#!/usr/bin/env python3
"""
ColourDiam Live Data Sync
=========================
Auto-fetches diamonds, jewellery and media from the colourdiam.com public
storefront API used by the site's own frontend, and normalises them into
local JSON + media files consumed by the remastered site.

Endpoints (discovered by studying the live site's frontend JS):
  GET /Home/SearchDiamonds?SubMenuName=...&PageIndex=N&PageCount=C
  GET /Home/SearchProduct?SubMenuName=...&PageIndex=N&PageCount=C
  GET /Home/GetDiamondsMenu / GetJewelleryMenu / GetDesignOwnMenu
  GET /Home/FeaturedProduct
Media:
  /Product/Diamond/{id}/still.jpg
  /Product/Jewellery/{id}/white360/center.jpg  (+ more views in ImgPathList)

Usage:
  python3 scripts/sync_colourdiam.py            # full sync
  python3 scripts/sync_colourdiam.py --media    # also download media files
  python3 scripts/sync_colourdiam.py --watch 600  # loop every 600s (long-running)
"""

import argparse
import json
import os
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

BASE = "https://colourdiam.com"
ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
MEDIA_DIR = ROOT / "images" / "auto-sync"
UA = "Mozilla/5.0 (ColourDiam-Remaster-Sync/1.0)"

HEADERS = {
    "User-Agent": UA,
    "Accept": "application/json, text/html, */*",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://colourdiam.com/",
}

# Submenus we pull for each category (mirrors the site's own menu data)
DIAMOND_SUBMENUS = [
    "All Fancy Colour Diamonds", "D-Z", "Argyle", "Black", "Blue", "Brown",
    "Gray", "Green", "Orange", "Pink", "Purple", "Red", "Violet", "White",
    "Yellow", "Chameleon", "New Arrival",
]
JEWELRY_SUBMENUS = [
    "Ring", "Earring", "Bracelet", "Necklace", "Pendant", "", "New Arrival",
]
PAGE_SIZE = 20
MAX_PAGES = 50


def http_get(url, timeout=30):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read()


def http_get_json(url, timeout=30):
    raw = http_get(url, timeout)
    return json.loads(raw.decode("utf-8"))


def fetch_all_submenu(kind, submenu, limit=MAX_PAGES * PAGE_SIZE):
    """Pagination loop over a submenu. Dedup by ProdId."""
    items = {}
    page = 1
    while page <= MAX_PAGES:
        params = urllib.parse.urlencode({
            "SubMenuName": submenu,
            "PageIndex": page,
            "PageCount": PAGE_SIZE,
            "SortById": "0",
        })
        if kind == "diamonds":
            url = f"{BASE}/Home/SearchDiamonds?{params}"
            key = "SearchProductsList"
        else:
            url = f"{BASE}/Home/SearchProduct?{params}"
            key = "searchProductsList"
        try:
            data = http_get_json(url)
        except Exception as exc:  # network / rate-limit blips
            print(f"  ! {submenu!r} page {page}: {exc}")
            break
        batch = data.get(key) or []
        if not batch:
            break
        for it in batch:
            items[it["ProdId"]] = it
        total = batch[0].get("TotRec") or 0
        if page * PAGE_SIZE >= min(total, limit):
            break
        page += 1
        time.sleep(0.2)
    return list(items.values())


def normalize_diamond(raw):
    """Map API fields to the shape used by the remastered site (data.js)."""
    name = raw.get("ProdName") or ""
    parts = [p.strip() for p in name.split(",") if p.strip()]
    # e.g. "0.05 carat, Fancy Deep Violet, Pear Shape, SI2 Clarity, CGL"
    carat = parts[0].replace("carat", "").strip() if parts else ""
    intensity = parts[1].strip() if len(parts) > 1 else ""
    shape = parts[2].replace("Shape", "").strip() if len(parts) > 2 else ""
    clarity = parts[3].replace("Clarity", "").strip() if len(parts) > 3 else ""
    lab = parts[4].strip() if len(parts) > 4 else ""
    color = _guess_color(intensity)
    price = raw.get("NewPrice") or raw.get("OldPrice") or 0
    return {
        "id": raw["ProdId"],
        "name": name,
        "carat": carat,
        "intensity": intensity,
        "shape": shape,
        "clarity": clarity,
        "lab": lab,
        "color": color,
        "price": price,
        "priceLabel": f"${price:,}" if price else "Contact For Price",
        "img": _media_url(raw),
        "imgPathList": raw.get("ImgPathList") or [],
        "isNew": bool(raw.get("IsNew")),
        "disc": raw.get("Disc") or 0,
        "hold": bool(raw.get("IsHold")),
        "tag": raw.get("TagNo"),
    }


def normalize_jewelry(raw, category=""):
    name = raw.get("ProdName") or ""
    price = raw.get("NewPrice") or raw.get("OldPrice") or 0
    metal = _guess_metal(name)
    purity = _guess_purity(name)
    return {
        "id": raw["ProdId"],
        "name": name,
        "category": category,
        "metal": metal,
        "purity": purity,
        "price": price,
        "priceLabel": f"${price:,}" if price else "Contact For Price",
        "img": _media_url(raw),
        "imgPathList": raw.get("ImgPathList") or [],
        "isNew": bool(raw.get("IsNew")),
        "disc": raw.get("Disc") or 0,
        "hold": bool(raw.get("IsHold")),
        "tag": raw.get("TagNo"),
    }


def _guess_metal(name):
    text = name.lower()
    if "white" in text and ("gold" in text or "k" in text):
        return "White Gold"
    if "yellow" in text and ("gold" in text or "k" in text):
        return "Yellow Gold"
    if "platinum" in text:
        return "Platinum"
    if "silver" in text:
        return "Silver"
    return "Gold"


def _jewelry_category(raw):
    """Best-effort category from the jewellery name (e.g. 'Ring', 'Earring')."""
    name = (raw.get("ProdName") or "").lower()
    for cat in ["bracelet", "necklace", "pendant", "earring", "ring"]:
        if cat in name:
            return cat.capitalize()
    return "Jewellery"


def _guess_purity(name):
    text = name.upper()
    for p in ["18K", "14K", "9K", "22K", "10K", "916", "585", "375"]:
        if p in text:
            return p
    if "silver" in text.lower():
        return "Silver"
    return ""


def _guess_color(intensity):
    text = intensity.lower()
    for c in ["pink", "blue", "yellow", "green", "purple", "violet", "red",
              "orange", "brown", "gray", "black", "white"]:
        if c in text:
            return c.capitalize()
    return "Fancy"


def _media_url(raw):
    img = raw.get("ImgPath") or raw.get("ModelImgPath")
    if img and img != "/assets/img/ColorDiam.png":
        return img
    lst = raw.get("ImgPathList") or []
    return lst[0] if lst else None


def fetch_menus():
    out = {}
    for name, action in [
        ("diamonds", "GetDiamondsMenu"),
        ("jewelry", "GetJewelleryMenu"),
        ("design", "GetDesignOwnMenu"),
    ]:
        try:
            data = http_get_json(f"{BASE}/Home/{action}?MenuName={name}")
            out[name] = data
        except Exception as exc:
            print(f"  ! menu {name}: {exc}")
            out[name] = None
    return out


def fetch_featured():
    try:
        return http_get(f"{BASE}/Home/FeaturedProduct").decode("utf-8")
    except Exception as exc:
        print(f"  ! featured: {exc}")
        return None


def download_media(items):
    """Download each item's main image (and listed views) into images/auto-sync."""
    MEDIA_DIR.mkdir(parents=True, exist_ok=True)
    n = 0
    for it in items:
        urls = set()
        if it.get("img"):
            urls.add(it["img"])
        for u in (it.get("imgPathList") or [])[:6]:
            urls.add(u)
        for u in urls:
            if not u.startswith("/"):
                continue
            rel = u.lstrip("/")
            dest = MEDIA_DIR / rel
            if dest.exists() and dest.stat().st_size > 0:
                continue
            dest.parent.mkdir(parents=True, exist_ok=True)
            try:
                raw = http_get(BASE + u, timeout=60)
                dest.write_bytes(raw)
                n += 1
            except Exception as exc:
                print(f"  ! media {u}: {exc}")
    return n


def diff_report(prev, curr, kind):
    if not prev:
        return f"  {kind}: initial sync ({len(curr)} items)"
    prev_ids = {p["id"] for p in prev}
    curr_ids = {c["id"] for c in curr}
    new_ids = curr_ids - prev_ids
    gone = prev_ids - curr_ids
    lines = [f"  {kind}: {len(curr)} items (was {len(prev)})"]
    if new_ids:
        names = [next(c["name"] for c in curr if c["id"] == i) for i in list(new_ids)[:5]]
        lines.append(f"    + NEW: {', '.join(names)}" + (" ..." if len(new_ids) > 5 else ""))
    if gone:
        lines.append(f"    - removed: {len(gone)}")
    return "\n".join(lines)


def load_prev(path):
    if path.exists():
        try:
            return json.loads(path.read_text())
        except Exception:
            return None
    return None


def sync(kind, with_media=False):
    print(f"[{datetime.now(timezone.utc).isoformat()}] syncing {kind} ...")
    if kind == "diamonds":
        submenus, norm, json_name = DIAMOND_SUBMENUS, normalize_diamond, "diamonds.json"
    elif kind == "jewelry":
        submenus, norm, json_name = JEWELRY_SUBMENUS, normalize_jewelry, "jewelry.json"
    else:
        raise ValueError(kind)

    all_items, seen = [], set()
    for sub in submenus:
        batch = fetch_all_submenu(kind, sub)
        for it in batch:
            if it["ProdId"] in seen:
                continue
            seen.add(it["ProdId"])
            if kind == "jewelry":
                cat = sub if sub and sub != "New Arrival" else _jewelry_category(it)
                all_items.append(norm(it, cat))
            else:
                all_items.append(norm(it))
        print(f"  {sub!r}: {len(batch)}")
        time.sleep(0.2)

    prev = load_prev(DATA_DIR / json_name)
    print(diff_report(prev, all_items, kind))

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    (DATA_DIR / json_name).write_text(
        json.dumps(all_items, indent=2, ensure_ascii=False)
    )

    if with_media:
        n = download_media(all_items)
        print(f"  media downloaded: {n} files")

    return all_items


def write_manifest(full):
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    manifest = {
        "source": "https://colourdiam.com",
        "lastSync": datetime.now(timezone.utc).isoformat(),
        "counts": {k: len(v) for k, v in full.items()},
        "generator": "scripts/sync_colourdiam.py",
    }
    (DATA_DIR / "last-sync.json").write_text(
        json.dumps(manifest, indent=2)
    )
    print("manifest:", json.dumps(manifest, indent=2))


def main():
    ap = argparse.ArgumentParser(description="Sync colourdiam.com live data")
    ap.add_argument("--media", action="store_true", help="download media files")
    ap.add_argument("--watch", type=int, metavar="SECONDS",
                    help="loop forever every N seconds")
    args = ap.parse_args()

    print("== ColourDiam auto-sync ==")
    menus = fetch_menus()
    (DATA_DIR / "menus.json").write_text(json.dumps(menus, indent=2, ensure_ascii=False))

    featured = fetch_featured()
    (DATA_DIR / "featured.html").write_text(featured or "")

    full = {
        "diamonds": sync("diamonds", args.media),
        "jewelry": sync("jewelry", args.media),
    }
    write_manifest(full)

    if args.watch:
        print(f"watching: will re-sync every {args.watch}s (Ctrl+C to stop)")
        while True:
            time.sleep(args.watch)
            try:
                main()
            except Exception as exc:
                print("  sync error:", exc)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(0)
