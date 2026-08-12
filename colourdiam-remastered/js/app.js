/* ColourDiam remastered — main application script
   Renders real product data (CDData) synced from www.colourdiam.com.
   Filters mirror the original site: Shape / Colour / Clarity / Intensity /
   Lab / Price / Carat (diamonds); Category / Metal / Purity / Price (jewelry). */
(function () {
  "use strict";

  /* ---------- Theme toggle (light / dark) ---------- */
  const themeToggle = document.getElementById("themeToggle");
  function applyTheme(dark) {
    document.body.classList.toggle("dark-mode", dark);
    if (themeToggle) {
      themeToggle.innerHTML = dark
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
    }
    try {
      localStorage.setItem("cd-theme", dark ? "dark" : "light");
    } catch (e) { /* ignore */ }
  }
  if (themeToggle) {
    const saved = (function () { try { return localStorage.getItem("cd-theme"); } catch (e) { return null; } })();
    applyTheme(saved === "dark" || (!saved && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches));
    themeToggle.addEventListener("click", function () {
      applyTheme(!document.body.classList.contains("dark-mode"));
    });
  }

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      const open = mobileNav.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  /* ---------- Hero slider ---------- */
  const heroSlider = document.getElementById("heroSlider");
  if (heroSlider) {
    const slides = heroSlider.querySelectorAll(".hero__slide");
    const dots = heroSlider.querySelectorAll(".hero__dots button");
    let current = 0;
    let timer = null;

    function goTo(i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (s, idx) { s.classList.toggle("active", idx === current); });
      dots.forEach(function (d, idx) { d.classList.toggle("active", idx === current); });
    }
    function start() { timer = setInterval(function () { goTo(current + 1); }, 6000); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    dots.forEach(function (d, idx) {
      d.addEventListener("click", function () { stop(); goTo(idx); start(); });
    });
    heroSlider.addEventListener("mouseenter", stop);
    heroSlider.addEventListener("mouseleave", start);
    start();
  }

  /* ---------- Escaping helper ---------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* ---------- Home renderers ---------- */
  function renderColorGrid() {
    const grid = document.getElementById("colorGrid");
    if (!grid) return;
    grid.innerHTML = CDData.colors.map(function (c) {
      return '<a class="color-card" href="diamonds.html?color=' + c.slug + '" title="' + c.name + ' fancy colour diamonds">' +
        '<img src="' + c.img + '" alt="' + c.name + ' fancy colour diamond" width="78" height="78">' +
        '<span>' + c.name + '</span></a>';
    }).join("");
  }

  function featuredCards(count) {
    const items = CDData.featured(count);
    return items.map(function (p) {
      const isStone = !!(p.shape);
      const name = esc(p.name || (p.carat + " ct " + p.color + " " + p.shape) || p.category);
      const meta = isStone
        ? (p.intensity + " · " + p.shape + " · " + p.clarity + " · " + p.lab + " · " + p.carat + " ct")
        : (p.category + (p.metal ? " · " + p.metal : ""));
      const badge = p.isNew ? "New" : (p.disc > 0 ? "Sale" : "");
      return '<article class="product-card">' +
        '<div class="product-card__thumb">' +
          (badge ? '<span class="product-card__badge">' + badge + '</span>' : "") +
          '<img src="' + CDData.mediaPath(p.img) + '" alt="' + name + '" loading="lazy" width="400" height="400">' +
        '</div>' +
        '<div class="product-card__body">' +
          '<h3>' + name + '</h3>' +
          '<p class="product-card__meta">' + esc(meta) + '</p>' +
          '<div class="product-card__price"><span class="now">' + esc(p.priceLabel) + '</span></div>' +
          '<div class="product-card__cta">' +
            '<a class="btn btn--gold" href="' + (isStone ? "diamonds.html" : "jewelry.html") + '">View</a>' +
            '<button class="btn btn--ghost add-to-cart" data-name="' + name + '" data-price="' + (p.price || "") + '" aria-label="Add to cart"><i class="fa-solid fa-bag-shopping"></i></button>' +
          '</div>' +
        '</div></article>';
    }).join("");
  }

  function renderFeatured() {
    const grid = document.getElementById("featuredGrid");
    if (!grid) return;
    grid.innerHTML = featuredCards(4);
  }

  function renderTestimonials() {
    const grid = document.getElementById("testiGrid");
    if (!grid) return;
    const letters = ["PM", "JC", "NS", "DL", "AR", "MT"];
    grid.innerHTML = CDData.testimonials.map(function (t, i) {
      return '<article class="testi-card">' +
        '<div class="testi-card__user">' +
          '<div class="testi-card__avatar">' + letters[i] + '</div>' +
          '<div><strong>' + esc(t.name) + '</strong><span>' + esc(t.location) + '</span></div>' +
        '</div>' +
        '<p>' + esc(t.text) + '</p>' +
      '</article>';
    }).join("");
  }

  /* ---------- Product grid renderers ---------- */
  function renderProductCard(it) {
    const isStone = !!it.shape;
    const name = esc(it.name || (it.carat + " ct " + it.color + " " + it.shape) || it.category || "Item");
    const meta = isStone
      ? [it.intensity, it.shape, it.clarity, it.lab, it.carat + " ct"].filter(Boolean).join(" · ")
      : [it.category, it.metal, it.purity].filter(Boolean).join(" · ");
    const badge = it.isNew ? "New" : (it.disc > 0 ? "Sale" : "");
    const href = isStone ? "diamonds.html" : "jewelry.html";
    return '<article class="product-card">' +
      '<div class="product-card__thumb">' +
        (badge ? '<span class="product-card__badge">' + badge + '</span>' : "") +
        '<img src="' + CDData.mediaPath(it.img) + '" alt="' + name + ' — ColourDiam" loading="lazy" width="400" height="400">' +
      '</div>' +
      '<div class="product-card__body">' +
        '<h3>' + name + '</h3>' +
        '<p class="product-card__meta">' + esc(meta) + '</p>' +
        '<div class="product-card__price"><span class="now">' + esc(it.priceLabel) + '</span></div>' +
        '<div class="product-card__cta">' +
          '<button class="btn btn--gold add-to-cart" data-name="' + name + '" data-price="' + (it.price || "") + '">Enquire</button>' +
          '<a class="btn btn--ghost" href="' + href + '">View</a>' +
        '</div>' +
      '</div></article>';
  }

  function renderGrid(containerId, items) {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    grid.innerHTML = items.length
      ? items.map(renderProductCard).join("")
      : '<p style="text-align:center;color:var(--ink-3);padding:40px 0;">No matching pieces. Try clearing a filter.</p>';
  }

  /* ---------- Filter values (mirror original colourdiam.com) ---------- */
  const DIAMOND_FILTERS = [
    { key: "color", label: "Colour", options: ["BLACK", "Blue", "Brown", "Gray", "Green", "Orange", "Pink", "Purple", "Violet", "White", "Yellow"] },
    { key: "shape", label: "Shape", options: ["Round", "Oval", "Pear", "Cushion", "Princess", "Emerald", "Radiant", "Heart", "Marquise", "Asscher", "Baguettes", "Bullet", "Cadillac", "Half Moon", "Octagon", "Shield", "Trillion", "Trapezoid", "Tappers", "Hexagon", "Kite Step Cut", "Cut cornered square", "Other"] },
    { key: "clarity", label: "Clarity", options: ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2", "I3"] },
    { key: "intensity", label: "Intensity", options: ["Faint", "Light", "Fancy Light", "Fancy", "Fancy Intense", "Fancy Deep", "Fancy Vivid", "Fancy Dark"] },
    { key: "lab", label: "Lab", options: ["GIA", "IGI", "HRD", "CGL", "Argyle", "AGT"] },
    { key: "price", label: "Price", options: [
      { v: "0-5000", t: "Up to $5,000" },
      { v: "5000-10000", t: "$5,000 – $10,000" },
      { v: "10000-20000", t: "$10,000 – $20,000" },
      { v: "20000-30000", t: "$20,000 – $30,000" },
      { v: "30000-40000", t: "$30,000 – $40,000" },
      { v: "40000-50000", t: "$40,000 – $50,000" },
      { v: "50000-", t: "$50,000+" }
    ] },
    { key: "carat", label: "Carat", options: [
      { v: "0.01-0.50", t: "0.01 – 0.50 ct" },
      { v: "0.50-1.00", t: "0.50 – 1.00 ct" },
      { v: "1.00-2.00", t: "1.00 – 2.00 ct" },
      { v: "2.00-5.00", t: "2.00 – 5.00 ct" },
      { v: "5.00-", t: "5.00+ ct" }
    ] }
  ];

  const JEWELRY_FILTERS = [
    { key: "category", label: "Category", options: ["Ring", "Earring", "Bracelet", "Necklace", "Pendant"] },
    { key: "metal", label: "Metal", options: ["Gold", "White Gold", "Yellow Gold", "Silver"] },
    { key: "purity", label: "Purity", options: ["18K", "9K", "Silver"] },
    { key: "price", label: "Price", options: [
      { v: "0-5000", t: "Up to $5,000" },
      { v: "5000-10000", t: "$5,000 – $10,000" },
      { v: "10000-20000", t: "$10,000 – $20,000" },
      { v: "20000-", t: "$20,000+" }
    ] }
  ];

  /* ---------- Build filter UI from data ---------- */
  function buildFilters(schema) {
    schema.forEach(function (grp) {
      const groupEl = document.querySelector('[data-filter-group="' + grp.key + '"]');
      if (!groupEl) return;
      const row = groupEl.querySelector(".chip-row") || document.createElement("div");
      if (!groupEl.querySelector(".chip-row")) { row.className = "chip-row"; groupEl.appendChild(row); }
      row.innerHTML = grp.options.map(function (opt) {
        const v = typeof opt === "object" ? opt.v : opt;
        const t = typeof opt === "object" ? opt.t : opt;
        return '<button class="chip" data-value="' + v + '">' + esc(t) + '</button>';
      }).join("");
      // add "All" clear chip
      const clear = document.createElement("button");
      clear.className = "chip";
      clear.textContent = "All";
      clear.setAttribute("data-filter-clear", "1");
      row.insertBefore(clear, row.firstChild);
    });
  }

  function activeFilters() {
    const out = {};
    document.querySelectorAll("[data-filter-group]").forEach(function (g) {
      const key = g.getAttribute("data-filter-group");
      const active = g.querySelector(".chip.active");
      if (active && !active.hasAttribute("data-filter-clear")) {
        out[key] = active.getAttribute("data-value");
      }
    });
    return out;
  }

  function matchFilter(item, key, val) {
    if (key === "price") {
      const p = item.price || 0;
      const parts = val.split("-");
      const lo = parseFloat(parts[0]) || 0;
      const hi = parts[1] === "" ? Infinity : (parseFloat(parts[1]) || Infinity);
      return p >= lo && p < hi;
    }
    if (key === "carat") {
      const c = parseFloat(item.carat) || 0;
      const parts = val.split("-");
      const lo = parseFloat(parts[0]) || 0;
      const hi = parts[1] === "" ? Infinity : (parseFloat(parts[1]) || Infinity);
      return c >= lo && c < hi;
    }
    const v = item[key];
    if (v == null) return false;
    if (key === "color" && val === "BLACK") return String(v).toLowerCase() === "black";
    return String(v).toLowerCase() === String(val).toLowerCase();
  }

  function renderDiamonds(filters) {
    let items = CDData.diamonds;
    Object.keys(filters).forEach(function (k) {
      items = items.filter(function (d) { return matchFilter(d, k, filters[k]); });
    });
    renderGrid("diamondGrid", items);
    const count = document.getElementById("resultCount");
    if (count) count.textContent = items.length + (items.length === 1 ? " diamond" : " diamonds");
  }

  function renderJewelry(filters) {
    let items = CDData.jewelry;
    Object.keys(filters).forEach(function (k) {
      items = items.filter(function (d) { return matchFilter(d, k, filters[k]); });
    });
    renderGrid("jewelryGrid", items);
    const count = document.getElementById("resultCount");
    if (count) count.textContent = items.length + (items.length === 1 ? " piece" : " pieces");
  }

  /* ---------- Filter chips ---------- */
  function bindChips() {
    document.querySelectorAll("[data-filter-group]").forEach(function (group) {
      group.querySelectorAll(".chip").forEach(function (chip) {
        chip.addEventListener("click", function () {
          const wasActive = chip.classList.contains("active");
          group.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
          if (!wasActive) chip.classList.add("active");
          applyFilters();
        });
      });
    });
  }

  function applyFilters() {
    const params = new URLSearchParams(window.location.search);
    const filters = activeFilters();
    Object.keys(params).forEach(function (k) { params.delete(k); });
    Object.keys(filters).forEach(function (k) { params.set(k, filters[k]); });
    window.history.replaceState({}, "", window.location.pathname + (params.toString() ? "?" + params.toString() : ""));
    if (document.getElementById("diamondGrid")) renderDiamonds(filters);
    if (document.getElementById("jewelryGrid")) renderJewelry(filters);
  }

  /* ---------- Cart / wishlist badge ---------- */
  let cartCount = 0;
  function updateBadges() {
    document.querySelectorAll(".header-actions .badge").forEach(function (b) {
      b.textContent = cartCount;
    });
  }
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".add-to-cart");
    if (btn) {
      cartCount += 1;
      updateBadges();
      const msg = document.getElementById("toastMsg");
      if (msg) { msg.textContent = "Added to cart"; msg.classList.add("show"); setTimeout(function () { msg.classList.remove("show"); }, 2200); }
    }
  });

  /* ---------- Toast ---------- */
  function ensureToast() {
    if (document.getElementById("toastMsg")) return;
    const el = document.createElement("div");
    el.id = "toastMsg";
    el.setAttribute("role", "status");
    el.style.cssText = "position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:var(--ink);color:#fff;padding:12px 24px;border-radius:30px;font-size:14px;z-index:400;opacity:0;transition:opacity .3s;pointer-events:none;";
    document.body.appendChild(el);
  }
  ensureToast();

  /* ---------- Modals ---------- */
  function openModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add("open");
  }
  function closeModals() {
    document.querySelectorAll(".modal.open").forEach(function (m) { m.classList.remove("open"); });
  }
  document.querySelectorAll("[data-open-modal]").forEach(function (el) {
    el.addEventListener("click", function (e) { e.preventDefault(); openModal(el.getAttribute("data-open-modal")); });
  });
  document.querySelectorAll("[data-close-modal]").forEach(function (el) {
    el.addEventListener("click", closeModals);
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModals(); });

  const emailForm = document.getElementById("emailForm");
  if (emailForm) {
    emailForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const msg = document.getElementById("emailFormMsg");
      msg.textContent = "Thank you! Your message has been sent. We'll reply within 24 hours.";
      msg.classList.remove("sr-only");
      emailForm.reset();
      setTimeout(closeModals, 1800);
    });
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const msg = document.getElementById("contactFormMsg");
      if (msg) {
        msg.textContent = "Thank you! Your message has been sent. We'll reply within 24 hours.";
        msg.classList.remove("sr-only");
      }
      contactForm.reset();
    });
  }

  /* ---------- Newsletter ---------- */
  const newsForm = document.getElementById("newsForm");
  if (newsForm) {
    newsForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const input = document.getElementById("newsEmail");
      const btn = newsForm.querySelector("button");
      if (btn) btn.textContent = "Subscribed ✓";
      if (input) input.value = "";
      setTimeout(function () { if (btn) btn.textContent = "Subscribe"; }, 2500);
    });
  }

  /* ---------- PWA install prompt ---------- */
  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredPrompt = e;
    const banner = document.getElementById("appBanner");
    const dismissed = (function () { try { return localStorage.getItem("cd-app-dismissed"); } catch (err) { return null; } })();
    if (banner && !dismissed) banner.classList.add("show");
  });
  const installBtn = document.getElementById("installBtn");
  if (installBtn) {
    installBtn.addEventListener("click", function () {
      const banner = document.getElementById("appBanner");
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function (choice) {
          if (choice.outcome === "accepted") { if (banner) banner.classList.remove("show"); }
          deferredPrompt = null;
        });
      } else {
        if (banner) banner.classList.remove("show");
        const msg = document.getElementById("toastMsg");
        if (msg) {
          msg.textContent = "Tap Share, then 'Add to Home Screen'";
          msg.classList.add("show");
          setTimeout(function () { msg.classList.remove("show"); }, 3500);
        }
      }
    });
  }
  const dismissBanner = document.getElementById("dismissBanner");
  if (dismissBanner) {
    dismissBanner.addEventListener("click", function () {
      const banner = document.getElementById("appBanner");
      if (banner) banner.classList.remove("show");
      try { localStorage.setItem("cd-app-dismissed", "1"); } catch (e) { /* ignore */ }
    });
  }
  setTimeout(function () {
    const banner = document.getElementById("appBanner");
    const dismissed = (function () { try { return localStorage.getItem("cd-app-dismissed"); } catch (err) { return null; } })();
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (banner && !banner.classList.contains("show") && !dismissed && isMobile) banner.classList.add("show");
  }, 4000);

  /* ---------- Scroll top ---------- */
  const scrollTop = document.getElementById("scrollTop");
  if (scrollTop) {
    window.addEventListener("scroll", function () {
      scrollTop.classList.toggle("visible", window.scrollY > 400);
    });
    scrollTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  }

  /* ---------- Init ---------- */
  function initFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const onDiamonds = !!document.getElementById("diamondGrid");
    const onJewelry = !!document.getElementById("jewelryGrid");

    const schema = onDiamonds ? DIAMOND_FILTERS : (onJewelry ? JEWELRY_FILTERS : null);
    if (schema) buildFilters(schema);

    const filters = {};
    schema && schema.forEach(function (grp) {
      const v = params.get(grp.key);
      if (v) {
        filters[grp.key] = v;
        const groupEl = document.querySelector('[data-filter-group="' + grp.key + '"]');
        if (groupEl) {
          const chips = groupEl.querySelectorAll(".chip");
          const chip = Array.prototype.find.call(chips, function (c) {
            return String(c.getAttribute("data-value")).toLowerCase() === String(v).toLowerCase();
          });
          if (chip) chip.classList.add("active");
        }
      }
    });

    if (onDiamonds) renderDiamonds(filters);
    if (onJewelry) renderJewelry(filters);

    // active nav state
    const page = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".main-nav a, .app-tabbar a").forEach(function (a) {
      const href = a.getAttribute("href");
      if (href === page) a.classList.add("active");
    });
  }

  function init() {
    renderColorGrid();
    renderFeatured();
    renderTestimonials();
    bindChips();
    initFromUrl();

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("sw.js").catch(function () { /* offline-first optional */ });
      });
    }
  }

  CDData.load().then(function () {
    document.addEventListener("DOMContentLoaded", init);
    if (document.readyState === "interactive" || document.readyState === "complete") init();
  }).catch(function (err) {
    console.error("ColourDiam data load failed:", err);
    const grid = document.getElementById("featuredGrid");
    if (grid) grid.innerHTML = '<p style="text-align:center;color:var(--ink-3);">Could not load product data.</p>';
  });
})();
