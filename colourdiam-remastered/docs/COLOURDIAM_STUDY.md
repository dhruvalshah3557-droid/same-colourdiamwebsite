# ColourDiam Study & Remaster — Project Memory

This document is the permanent project memory capturing the in-depth study of
`www.colourdiam.com` and how the remastered version (in this repo) was built.

## 1. Company / Brand Facts

- **Brand:** ColourDiam (legal: ColourDiam Limited)
- **Positioning:** Internationally recognized specialist & online retailer of high-end Fancy Colour Diamonds since **1994**
- **Focus:** Argyle Pink Diamonds; one of the largest online selections of colour diamonds
- **Mining origins:** Australia, Africa, India, Canada, Russia
- **Certification:** GIA or Argyle certificate on every diamond; also IGI/HRD/CGL on some
- **Milestones:** 2015 → 10,000 monthly visits; **64% returning customer rate**
- **Offices:** Associate offices in India and Japan (supply chain mine→retailer)
- **Contact:** Phone `+852 9644 0155`; "Email Me" modal form
- **Copyright year on site:** 2026
- **Developer credit:** Piconet Hitech Solutions PVT LTD

## 2. Brand Visual Identity

- **Primary brand color:** `#c29958` (champagne gold) — used ~128× in CSS
- **Secondary:** `#222222` (ink), `#555555` (body text), `#1e1e1e` (dark mode bg)
- **Gold glow accent:** `#ffe785d9` (dark-mode toggle shadow / gold tint)
- **Borders:** `#d3d3d3` / `#eae4da`; warm paper `#faf7f2`
- **Fonts:** Lato (body), Lobster (script accents), Playfair Display (remaster headings)
- **Buttons:** pill radius (50px), `.btn-hero` gold bg → black hover
- **Logo:** `logo.png` 798×313, `logoMobile.png` 996×166 (multi-colour diamond mark + wordmark)
- **Dark mode:** original site used a sun/moon checkbox toggle `.toggle-label`

## 3. Site Structure (original colourdiam.com)

| Path | Purpose |
|---|---|
| `/` | Home |
| `/product` | Jewelry |
| `/diamonds` | Loose diamonds |
| `/designown` | Design Your Own |
| `/aboutus` | About Us |
| `/contactus` | Contact |
| `/faq`, `/education`, `/news`, `/blog` | Buyer information |
| `/privacy-policy`, `/terms-condition`, `/returnpolicy` | Legal |
| `/login`, `/register` | Accounts |

**Homepage sections (in order):** header (top bar + nav + search + wishlist/cart)
→ hero slider (2 slides) → policy strip (4 items) → category banners (Pendant,
Bracelet, Earring, Ring, Necklace) → featured products (AJAX) → colour diamonds
carousel (12 colours) → testimonials (6) → footer → modals.

**Diamond colours (12):** Black, Blue, Brown, Gray, Green, Orange, Pink, Purple,
Red, Violet, White, Yellow — linked `/diamonds/<slug>`.

**Hero slide 1:** "Elegant & Timeless Diamond Jewelry" → /product
**Hero slide 2:** "Solitaire Elegance / A Sparkle That Lasts Forever" → /diamonds

**Policy strip:** Free Shipping · Support 24/7 · Money Return (30 days) · 100% Payment Secure

**Testimonials:** Priya M. (Singapore, pink ring), James Carter (yellow pendant),
Natcha S. (Bangkok, earrings), David Lindqvist (blue diamond collector), Ananya R.
(custom engagement ring), Michael Tan (brown bracelet for mother).

## 4. Media Asset Inventory (downloaded into `/images`)

- `slider/home2-slide2.jpg`, `slider/home2-slide3.jpg` — hero backgrounds
- `banners/Pendant.jpg`, `banners/Bracelet.jpg`, `banners/Earring.jpg`, `banners/ring.jpg`, `banners/Necklace.jpg`
- `loosestones/{Black,Blue,Brown,Gray,Green,Orange,pink,Purple,Red,Violet,White,Yellow}.png` (500×500)
- `logo/logo.png` (798×313), `logo/logoMobile.png` (996×166)
- `favicon.ico`
- `icons/icon-192.png`, `icon-512.png`, `icon-maskable-512.png` (generated for PWA)

## 5. Diamonds Page Filters (original)

Shape (26: round, oval, pear, cushion, princess, emerald, radiant, heart, marquise,
asscher, baguettes, trillion, half moon, etc.) · Colour (O-P … Y-Z, BLACK, Blue,
Brown, Gray, Green, Orange, Pink, Purple, Violet, White, Yellow) · Clarity (FL,
IF, VVS1-2, VS1-2, SI1-2, I1-3) · Intensity (Faint → Fancy Vivid/Deep/Dark) ·
Cut (F/GD/VG/EX) · Polish · Symmetry · Fluorescence · Lab (GIA, IGI, HRD, CGL,
Argyle, AGT) · Price bands ($5k … $50k+) · Carat bands (0.01–5.00+ ct).

Jewelry filters: Metal (Gold, White Gold), Purity (18K/9K/Silver), Price, Shape,
Color, Lab, Carat.

## 6. What Was Improved (this remastered build)

### Design / UX
- Modern luxury aesthetic: Playfair Display headings, champagne-gold palette, soft shadows, glassy sticky header
- Sticky header with backdrop blur; animated hero slider (auto + dots, fade/zoom)
- Consistent card design system (product, color, testimonial, policy cards)
- Polished dark mode (CSS variables, respects `prefers-color-scheme`, persisted)
- Fully responsive: desktop grid → tablet → mobile bottom app tab bar
- Accessible: skip-to-content semantics, aria labels, focus states, `sr-only`

### PWA / Mobile App (iPhone, iPad, Android)
- `manifest.json`: standalone display, theme color, maskable icons, shortcuts
- `sw.js`: offline-first cache of app shell + runtime caching
- Install banner (beforeinstallprompt + iOS "Add to Home Screen" fallback)
- App bottom tab bar (Home / Jewelry / Diamonds / Design / Contact) on ≤768px
- Viewport-fit + safe-area handling; apple-touch-icon; meta tags for iOS standalone

### SEO
- Unique title/description/keywords per page
- `canonical`, `robots`, Open Graph + Twitter cards per page
- JSON-LD: `JewelryStore`, `WebSite` (+ SearchAction), `BreadcrumbList`, `FAQPage`, `AboutPage`, `ContactPage`
- `sitemap.xml`, `robots.txt`
- Semantic HTML (`header/main/section/footer/article/nav`), lazy-loaded images
- Descriptive alt text on every image

## 7. Build Details

- **Stack:** Vanilla HTML5 + CSS3 + JS (no build step, no framework) — fast, portable, PWA-ready
- **Structure:** `index.html`, `jewelry.html`, `diamonds.html`, `design-your-own.html`, `about.html`, `contact.html`, `faq.html`, `404.html`
- **Shared data:** `js/data.js` (diamond colors, featured products, testimonials, inventory)
- **App logic:** `js/app.js` (theme, slider, nav, renders, filters, cart, modals, PWA)
- **CSS:** `css/main.css` (design tokens + components, ~responsive)
- Filters use URL params (`?color=pink`) for shareable/bookmarkable state
- Product/category grids render client-side from `data.js`; core SEO content is in static HTML

## 8. Preview

Dev server on port 8321; preview URL generated by the platform.
