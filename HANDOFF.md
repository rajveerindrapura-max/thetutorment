# The Tutorment — Project Handoff
## Session 4 — June 10, 2026

---

## Live Deployments
- **Frontend**: https://www.thetutorment.com — Hostinger, files in `public_html`
- **Backend**: https://tutorment-backend.onrender.com — Render.com free tier
- **Database**: MongoDB Atlas M0, cluster `tutorment`, Mumbai

## Upload Instructions
1. Download zip → extract → go into `tutorment-complete/tutorment-project/frontend/`
2. Hostinger File Manager → `public_html`
3. Upload ALL contents (don't delete existing `priyanshu.jpg`, `vipul.jpg` if uploaded)
4. Clear browser cache → hard refresh (Ctrl+Shift+R)

---

## Current File Structure
```
public_html/
├── index.html                  ← Homepage
├── shared.css                  ← MASTER: brand colors, nav, footer, all utilities
├── nav.js                      ← Sticky nav with dropdowns, scroll shadow
├── footer.js                   ← 4-col footer with social icons
├── eligibility-report.js       ← Full report generator (questions + PDF output)
├── TT_Logo_SVG.svg             ← Nav logo (full color SVG)
├── TT_Logo_White_Bg.png        ← Footer logo (white background)
├── TT_Logo_Transparent.png     ← Backup transparent logo
├── TT_Favicon.svg              ← SVG favicon (all pages)
├── TT_Favicon.png              ← PNG favicon (apple-touch-icon fallback)
└── pages/
    ├── eligibility.html        ← 10-question checker + dark report output
    ├── contact.html            ← Contact form first, booking widget second
    ├── results.html            ← Carousel testimonials + stats
    ├── salary-calculator.html
    ├── about.html
    ├── blog.html
    ├── dashboard.html
    ├── international.html
    ├── india.html
    ├── services.html
    └── [other pages]
```

---

## Brand System (shared.css CSS variables)
```css
--navy:   #0A2E73   /* Primary — CTAs, headings, nav */
--navy-d: #071f52   /* Dark hover */
--navy-l: #EBF0FA   /* Light navy background */
--slate:  #667085   /* Secondary text */
--blue:   #1E88E5   /* Success blue — hover, links */
--teal:   #00B3A4   /* Growth indicators, charts, accent */
--bg:     #F7F9FC
--border: #E4E7EC
--text:   #101828
```
Fonts: **Manrope** (h1-h6, section titles) + **Inter** (body)

---

## Nav (nav.js) — Current State
- Logo: `TT_Logo_SVG.svg` at height:34px — full color SVG
- Links: International (2-level dropdown) | India | Tools | About | Results
- **Contact** link removed from nav links
- **"Contact us"** button (right side) → `pages/contact.html`
- Scroll shadow: `.scrolled` class after 10px (no backdrop-filter — causes PNG issues)
- Nav is solid white `#ffffff` always

## Footer (footer.js) — Current State
- Logo: `TT_Logo_White_Bg.png` at height:28px with border-radius:4px
- 4 columns: Brand (logo + tagline + social icons) | International | India | Company
- Social: Instagram, Facebook, LinkedIn, YouTube, WhatsApp
- Background: `#070f24`

---

## Eligibility Checker (pages/eligibility.html + eligibility-report.js)

### Page Structure
1. **Gate** — name, email, phone, country dropdown → `startChecker()`
2. **Checker** — 10 questions with hero bar
3. **Report** — dark-themed multi-section report

### 10 Questions
| # | Key | Topic |
|---|-----|-------|
| 1 | goal | Career goal (9 options + write-in) |
| 2 | profession | Profession (30+ options + write-in) |
| 3 | qualification | Highest qualification |
| 4 | experience | Years of experience |
| 5 | current-country | Current country of residence |
| 6 | target-country | Target country |
| 7 | salary | **Currency-aware** — shows £/$/₹/€/CAD/AUD based on Q5 answer |
| 8 | english | English test status |
| 9 | previous-attempt | Previous attempts |
| 10 | addons | Additional report sections (multi-select) |

### Q7 Salary Currency Logic
- India → LPA + INR (₹3L, ₹7L, ₹15L, ₹30L, ₹60L+)
- UK → GBP (£20k, £30k, £45k, £65k, £90k+)
- USA → USD ($40k, $70k, $110k, $160k, $220k+)
- Canada → CAD
- Australia → AUD
- Germany → EUR
- UAE/Singapore → AED/SGD
- Others → generic USD

### Report Design (dark theme — like Product Space PDF)
- Background: `#070b12` (near-black)
- Dark sections: profile, market, skills, action, next (`#0d1117`)
- Light sections: position, pathway, salary (`#f8fafc`)
- Section headers: teal label + Manrope white title + teal gradient rule
- Cover: dark navy → teal gradient with stats cards
- All `print-color-adjust: exact` for color PDF printing

### Salary Calculation
- India salary data in USD equivalents (PM Lead India = $72k, not $110k)
- Profession normalization: write-in text matched to known keys
- Career trajectory: yr2/yr5 uses realistic relocation economics
  - Healthcare: entry→mid immediately on registration
  - Others: one level below home seniority on arrival
- `salMap` converts all currency brackets to USD midpoints

---

## Results Page (pages/results.html)
- Stats strip: 5,000+ students | 93% satisfaction | £50k+ highest package | 100% HCPC
- **CSS scroll-snap carousel** (no JS width calculation)
  - UK International Wing: 6 cards, `id="scroll-uk"`
  - India Wing: 6 cards, `id="scroll-in"`
  - Cards: `flex:0 0 calc((100vw - 88px) / 3)` — vw-based, works always
  - Dots, progress bar, arrow buttons driven by scroll event
- Featured card: navy gradient (first HCPC card)
- CTA: gradient banner with "Book my free session" → contact.html

---

## Contact Page (pages/contact.html)
- **Section order**: Contact form first (`id="contact-form-section"`) → Booking widget second (`id="booking-section"`)
- Nav "Contact us" → `contact.html` (lands on form)
- All "Book free session" CTAs → `contact.html#booking-section`
- **Calendly**: commented out, instructions in page source
  - Find `YOUR-USERNAME/free-session`, replace, uncomment widget div + script
- Booking card: two-column — navy info panel + white contact options (WhatsApp, Email, Call)

---

## Pending Items
1. **Calendly URL** — When ready: find `YOUR-USERNAME/free-session` in contact.html, replace, uncomment widget
2. **Vipul photo** — Upload `vipul.jpg` to public_html/, update about.html
3. **WordPress cleanup** — Check/delete `index.php` or `.htaccess` if Hostinger shows one

---

## Key Technical Decisions (do not change without understanding why)
1. **No `backdrop-filter:blur` on nav** — causes PNG logo transparency artifacts on scroll in some browsers. Nav is solid white `#ffffff` always, scroll shadow added via JS `.scrolled` class.
2. **Carousel uses vw units** — `flex:0 0 calc((100vw - 88px) / 3)`. Percentages on flex children fail because they resolve against the flex container which has no fixed width → zero-width cards. vw is absolute and always works.
3. **SVG favicon** — `type="image/svg+xml"` for all pages; `apple-touch-icon` stays PNG (iOS doesn't support SVG favicons).
4. **India salary in USD** — stored as USD equivalents at 83 INR/USD, NOT in INR. PM Lead India = $72k.
5. **sectionHead() signature** — `sectionHead(title, subtitle, color, _unused)` — the 4th param is ignored, needed for backward compat with old calls that pass extra args.

---

## Last Good Zip
`/mnt/user-data/outputs/tutorment-complete.zip` — June 10, 2026
