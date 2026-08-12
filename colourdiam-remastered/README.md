# ColourDiam — Deployment Guide

Static HTML/CSS/JS + PWA site. No build step, no backend. Deploy by uploading files.

## GitHub Repository

- Repo: `https://github.com/dhruvalshah3557-droid/same-colourdiamwebsite`
- Branch: `main`
- Download ZIP: GitHub → `Code` → `Download ZIP`

## Quick Deploy — GoDaddy India (cPanel)

1. Log in to GoDaddy → **Web Hosting** → your plan → **Manage**
2. Open **cPanel** → **File Manager**
3. Go to `public_html/`
4. Delete the default files (`index.html`, `default.php`, `welcome.html` etc.)
5. Upload `colourdiam-remastered.zip` (the contents, not the folder) so `index.html`
   sits directly in `public_html/`
6. Right-click the zip → **Extract**
7. Visit `https://yourdomain.com` — done

> `.htaccess` is included (HTTPS redirect, gzip, caching, custom 404). Enable the
> free SSL first in GoDaddy cPanel → **SSL/TLS Status** (or let AutoSSL run).

## Important: Media Size

`images/auto-sync/` is ~426 MB (real product photos synced from colourdiam.com).
- Do **not** use the cPanel web uploader (limit is usually 2–10 MB/file).
- Use the **File Manager Upload** (accepts large zips) or **FTP** (FileZilla) to upload.
- If your plan has a storage limit, you can exclude `images/auto-sync/` and the site
  will still work — missing product images fall back to a placeholder.

## FTP (FileZilla) Alternative

```
Host:   ftp.yourdomain.com
User:   (cPanel username)
Pass:   (cPanel password)
Port:   21
```
Drag all files from `colourdiam-remastered/` into `public_html/`.

## Custom Domain / DNS

- Point the domain's **A record** to the hosting server IP (shown in GoDaddy cPanel →
  General Information). Nameservers may already be set to GoDaddy's.
- If the domain is registered elsewhere (e.g., an Indian registrar), either change
  nameservers to GoDaddy's or add an A record at the registrar.

## Live Data Sync (optional, on your own machine)

Product data is already committed to the repo. To refresh from the live store:

```bash
python3 scripts/sync_colourdiam.py            # data only
python3 scripts/sync_colourdiam.py --media    # data + media (~426 MB)
```

Outputs: `data/diamonds.json` (746 diamonds), `data/jewelry.json` (644 pieces),
media under `images/auto-sync/`. Re-upload changed files after syncing.

## Checklist

- [ ] SSL enabled, https redirects working
- [ ] `index.html` present in `public_html/`
- [ ] `robots.txt` + `sitemap.xml` uploaded
- [ ] Media uploaded (or placeholder fallback accepted)
- [ ] All internal links use relative paths (they already do)
