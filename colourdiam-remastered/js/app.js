/* ColourDiam remastered — main application script */
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

  /* ---------- Generic component renderers ---------- */
  function renderColorGrid() {
    const grid = document.getElementById("colorGrid");
    if (!grid) return;
    grid.innerHTML = DIAMOND_COLORS.map(function (c) {
      return '<a class="color-card" href="diamonds.html?color=' + c.slug + '" title="' + c.name + ' fancy colour diamonds">' +
        '<img src="' + c.img + '" alt="' + c.name + ' fancy colour diamond" width="78" height="78">' +
        '<span>' + c.name + '</span></a>';
    }).join("");
  }

  function renderFeatured() {
    const grid = document.getElementById("featuredGrid");
    if (!grid) return;
    grid.innerHTML = FEATURED_PRODUCTS.map(function (p) {
      return '<article class="product-card">' +
        '<div class="product-card__thumb">' +
          (p.badge ? '<span class="product-card__badge">' + p.badge + '</span>' : "") +
          '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy" width="400" height="400">' +
        '</div>' +
        '<div class="product-card__body">' +
          '<h3>' + p.name + '</h3>' +
          '<p class="product-card__meta">' + p.meta + '</p>' +
          '<div class="product-card__price"><span class="now">' + p.price + '</span>' +
            (p.was ? '<span class="was">' + p.was + '</span>' : "") + '</div>' +
          '<div class="product-card__cta">' +
            '<a class="btn btn--gold" href="' + p.url + '">View</a>' +
            '<button class="btn btn--ghost add-to-cart" data-name="' + p.name + '" data-price="' + p.price.replace(/[^0-9]/g, "") + '" aria-label="Add ' + p.name + ' to cart"><i class="fa-solid fa-bag-shopping"></i></button>' +
          '</div>' +
        '</div></article>';
    }).join("");
  }

  function renderTestimonials() {
    const grid = document.getElementById("testiGrid");
    if (!grid) return;
    const letters = ["PM", "JC", "NS", "DL", "AR", "MT"];
    grid.innerHTML = TESTIMONIALS.map(function (t, i) {
      return '<article class="testi-card">' +
        '<div class="testi-card__user">' +
          '<div class="testi-card__avatar">' + letters[i] + '</div>' +
          '<div><strong>' + t.name + '</strong><span>' + t.location + '</span></div>' +
        '</div>' +
        '<p>' + t.text + '</p>' +
      '</article>';
    }).join("");
  }

  /* ---------- Inventory grids ---------- */
  function renderInventory(containerId, items) {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    grid.innerHTML = items.map(function (it) {
      const isStone = !!it.shape;
      return '<article class="product-card">' +
        '<div class="product-card__thumb">' +
          (it.badge ? '<span class="product-card__badge">' + it.badge + '</span>' : "") +
          '<img src="' + it.img + '" alt="' + it.name + ' — ' + it.color + ' fancy colour diamond" loading="lazy" width="400" height="400">' +
        '</div>' +
        '<div class="product-card__body">' +
          '<h3>' + (it.name || (it.carat + " ct " + it.color + " " + it.shape)) + '</h3>' +
          '<p class="product-card__meta">' + (isStone
            ? it.intensity + " · " + it.shape + " · " + it.clarity + " · " + it.lab + " · " + it.carat + " ct"
            : it.category + " · " + it.color) + '</p>' +
          '<div class="product-card__price"><span class="now">' + it.price + '</span></div>' +
          '<div class="product-card__cta">' +
            '<button class="btn btn--gold add-to-cart" data-name="' + (it.name || it.carat + "ct " + it.color) + '" data-price="' + it.price.replace(/[^0-9]/g, "") + '">Enquire</button>' +
          '</div>' +
        '</div></article>';
    }).join("");
  }

  function renderDiamonds(filter) {
    let items = DIAMOND_INVENTORY.slice();
    if (filter && filter.color) {
      items = items.filter(function (d) { return d.color.toLowerCase() === filter.color; });
    }
    renderInventory("diamondGrid", items.map(function (d) {
      return Object.assign({}, d, { name: d.carat + " ct " + d.color + " " + d.shape });
    }));
    const count = document.getElementById("resultCount");
    if (count) count.textContent = items.length + (items.length === 1 ? " diamond" : " diamonds");
  }

  function renderJewelry(filter) {
    let items = JEWELRY_INVENTORY.slice();
    if (filter && filter.color) {
      items = items.filter(function (d) { return d.color.toLowerCase() === filter.color; });
    }
    renderInventory("jewelryGrid", items);
    const count = document.getElementById("resultCount");
    if (count) count.textContent = items.length + " pieces";
  }

  /* ---------- Filter chips ---------- */
  function bindChips() {
    document.querySelectorAll("[data-filter-group]").forEach(function (group) {
      const groupName = group.getAttribute("data-filter-group");
      group.querySelectorAll(".chip").forEach(function (chip) {
        chip.addEventListener("click", function () {
          const wasActive = chip.classList.contains("active");
          group.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
          if (!wasActive) {
            chip.classList.add("active");
            applyFilters(groupName, chip.getAttribute("data-value"));
          } else {
            applyFilters(groupName, null);
          }
        });
      });
    });
  }

  function applyFilters(groupName, value) {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(groupName, value); else params.delete(groupName);
    const newUrl = window.location.pathname + (params.toString() ? "?" + params.toString() : "");
    window.history.replaceState({}, "", newUrl);
    if (groupName === "color") {
      const activeColor = params.get("color");
      if (document.getElementById("diamondGrid")) renderDiamonds({ color: activeColor });
      if (document.getElementById("jewelryGrid")) renderJewelry({ color: activeColor });
    }
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
        // iOS fallback: instruct user to add to home screen
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
  // Show banner after 4s on mobile even without install prompt (iOS guidance)
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
  function init() {
    renderColorGrid();
    renderFeatured();
    renderTestimonials();
    bindChips();

    const params = new URLSearchParams(window.location.search);
    const activeColor = params.get("color");
    if (activeColor && document.getElementById("diamondGrid")) renderDiamonds({ color: activeColor });
    if (activeColor && document.getElementById("jewelryGrid")) renderJewelry({ color: activeColor });
    if (document.getElementById("diamondGrid") && !activeColor) renderDiamonds(null);
    if (document.getElementById("jewelryGrid") && !activeColor) renderJewelry(null);

    // highlight matching color chip
    document.querySelectorAll('[data-filter-group="color"] .chip').forEach(function (chip) {
      if (chip.getAttribute("data-value") === activeColor) chip.classList.add("active");
    });

    // active nav state
    const page = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".main-nav a, .app-tabbar a").forEach(function (a) {
      const href = a.getAttribute("href");
      if (href === page) a.classList.add("active");
    });

    // register service worker (PWA)
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("sw.js").catch(function () { /* offline-first optional */ });
      });
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
