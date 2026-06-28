# CMS Global Website Audit (cmsglobal.com)

> Full crawl performed 2026-06-24. Every page in the site navigation was visited and content extracted.
>
> **UPDATE 2026-06-28:** This original audit was produced by a prior agent and trusted without re-checking.
> It has now been independently re-verified against the live site using a real browser (network panel,
> console, computed styles, response headers). Several claims below are **inaccurate** and are corrected in
> **[Part B: Independent Live Re-Verification](#part-b-independent-live-re-verification-2026-06-28)** at the
> bottom of this file. Read Part B before quoting any figure from Part A to the client.

---

## 1. Site Architecture

### Navigation Structure
```
Corporate
  ├── About CMS          /corporate/about-cms/
  ├── Product Focus      /corporate/product-focus/
  ├── CMS Export         /corporate/export/
  ├── Stories            /corporate/stories/
  ├── Downloads          /corporate/downloads/
  ├── Careers            /corporate/career/
  └── Certifications     /corporate/certification/

Air Filters
  ├── Pre Filters        /air-filters/pre-filters/
  ├── Fine Filters       /air-filters/fine-filters/
  ├── Hepa Filters       /air-filters/hepa-filters/
  ├── Carbon Filters     /air-filters/carbon-filters/
  ├── Special Filters    /air-filters/special-filters/
  ├── Ecology Unit       /air-filters/ecology-unit/
  ├── EP Series          /air-filters/ep-series/
  ├── Testing & Valid.   /air-filters/testing-validation/
  └── UV Solutions       /air-filters/uv-solutions/

Air Outlets
  ├── HVAC Accessories   /air-outlets/grilles-diffusers/   ← NOTE: labels swapped!
  └── Grilles & Diff.    /air-outlets/hvac-accessories/    ← Bug: wrong URL

HVAC Ducting             /hvac-ducting/
MEP Accessories          /mep-accessories/
Flanges                  /flanges/
Adhesive Tapes           /adhesive-tapes/
Laundry Solutions        /laundry-solutions/
Reach Us                 /contact/
Blog                     # (dead link)
```

### UX Issues Found

| Issue | Detail |
|-------|--------|
| Swapped nav labels | "HVAC Accessories" links to grilles-diffusers URL and vice versa |
| Dead blog link | Top nav "BLOG" links to "#" (nowhere) |
| Misleading login copy | Homepage says "Login with your credentials or Register" but downloads page has NO login gate |
| Page load speed | Homepage timed out at 60s in automated testing (Playwright) |
| 7 JS console errors | On homepage load |
| File size display bug | Downloads page shows raw bytes like "1289599 KB" instead of "1.3 MB" |
| Product Enquiry popup | Intrusive modal form appears on product-focus page |
| Stale content | Stories/blog section hasn't been updated since 2018 |
| No product detail pages | Individual products have no dedicated page -- just text blurbs on category listing pages |
| No filtering | Product category pages are flat lists with no way to filter or search |
| All PDFs link to same file | Multiple product "Download Catalogue" buttons link to the same generic PDF |
| Broken Search Links | Search results list products but the "Download Catalogue" buttons link to `#` (dead links) |
| Hard SEO Penalty (Duplicate Content) | 206 individual product pages (/product/[slug]/) are generated but have no template -- they just load the homepage content |
| Missing Legal Compliance | Newsletter form requires accepting the Privacy Statement, but the checkbox link points to `#` (no privacy page exists) |

---

## 1.2 Technical & Design Deep Dive

### 1.2.1 JavaScript Console Errors (Homepage & Core Pages)
Our audit discovered **7 critical JavaScript errors** that load on every visit, breaking frontend functionality (like smooth scrolling and sliders):
1. `Failed to load resource: lightcase.css (404 Not Found)` - Breaks visual lightbox overlays.
2. `Failed to load resource: lightcase.js (404 Not Found)` - Breaks lightbox scripts.
3. `Failed to load resource: ajax-loader.gif (404 Not Found)` - Missing loading indicator.
4. `TypeError: $(...).paraxify is not a function` at `scripts.js:158` - Breaks the background parallax scroll effect.
5. `TypeError: Cannot set properties of null (setting 'onclick')` at `index.html:1270` - Crashes page event listeners.
6. `Uncaught TypeError: $(...).parallax is not a function` at `scripts.js:99` - Crashes the slider script initialization.
7. `TypeError: Cannot set properties of null (setting 'width')` at `scripts.js:69` - Prevents menu/header size calculations.

### 1.2.2 Visual Design & Typography
- **Primary Typography:** `AvenirLTStd-Light` is used for body copy and navigation links. Size is `14px` for body, `18px` for navigation.
- **Headings Typography:** `AvenirLT-Black, sans-serif` is used for main headers. Sizes go up to `60px` for main banner headings.
- **Color Palette:**
  - **Body Text:** Dark Grey `rgb(51, 51, 51)` (`#333333`)
  - **Navigation Links / Active Elements:** Secondary Bootstrap Blue `rgb(51, 122, 183)` (`#337ab7`)
  - **Primary Background:** Solid White `rgb(255, 255, 255)` (`#ffffff`)
  - **Text on Banners:** White `rgb(255, 255, 255)` (`#ffffff`)
- **Spacing / Layout:** Main container layouts rely on older Bootstrap grid standards (max-width typically around `1170px`). Container padding is tight.

### 1.2.3 SEO Metadata Audit
- **Site Title:** `CMS - Group of companies`
- **Meta Description:** `"- Group of companies"` — This is a major configuration error. The description tag is missing the brand name and actual business details, which severely hurts Google search click-through rates.
- **CMS Platform & Tech Stack:** WordPress `4.9.26` (released around 2017/2018; heavily out-of-date and represents a major security vulnerability risk).
- **Social Tags:** OpenGraph and Twitter card metadata tags exist, but copy the broken description (`"- Group of companies"`). Twitter handle `@CMSGlobal_UAE` is configured.
- **Indexing Instructions:** `robots.txt` blocks `/wp-admin/` and allows `admin-ajax.php`, which is standard. Sitemap index is split into custom sitemaps (posts, pages, careers, certifications, downloads, products, categories).

### 1.2.4 Mobile/Responsive Usability
- **Viewport Config:** Standard `<meta name="viewport" content="width=device-width, initial-scale=1">` is present.
- **Responsive Navigation:** On viewports under `768px`, the horizontal menu collapses into a standard hamburger menu. Clicking the toggle button transitions and expands a full-screen vertical menu container.
- **Tap Targets:** Form fields and dropdown options are touch-friendly, but spacing is tight.

### 1.2.5 The WordPress Custom Post Type Redirection Bug
The sitemap lists **206 individual product pages** under the `/product/[slug]/` path (e.g., `/product/hepa-sc/`, `/product/fire-dampers/`). 
However, when a user navigates to any of these URLs:
- The browser title changes to the product name (e.g. `HEPA SC - CMS`).
- **The actual page content is identical to the homepage.**
- WordPress is rendering the homepage template because the custom theme lacks a `single-product.php` template. This is a severe duplicate content issue (search engines index 200+ identical pages, leading to ranking penalties) and a poor user experience for organic search traffic.

---

## 2. Company Profile (from About page)

- **Founded:** 1982 in Saudi Arabia
- **Full name:** Century Mechanical Systems Group
- **Locations:** 16 offices across UAE, Kuwait, Sri Lanka, Saudi Arabia, Oman, Qatar, India
- **Manufacturing:** 8 factories in UAE, Kuwait, and Sri Lanka
- **Staff:** 650+ direct, 1000+ total
- **Warehouses:** 8
- **Divisions:** 7
- **Departments:** 12
- **Certifications:** ISO 9001:2015
- **Exports:** 54+ countries
- **Group companies:** CMS Printing Press (cmspress.ae), CMS Logistics (cmslogistics.ae)
- **Mission:** "To ensure Continued Success through quality products, excellent service and unmatched customer care"
- **Social:** Instagram, Facebook, LinkedIn, Twitter (@Global_CMS)

---

## 3. Certifications Page

| Body | Standard | Applies To |
|------|----------|------------|
| BSRIA | DW/144 Third Edition 2016 (Class D) | Flanges, ductwork |
| UL (Underwriters Laboratories) | UL-555 / UL-555S | Fire dampers, smoke dampers |
| ETL / Intertek | ASTM E477-06 | Sound attenuators |
| ETL / Intertek | ASHRAE 52.2P | Air filters |
| AMCA | Air Movement ratings | Dampers, accessories |
| IFC Certification (UKAS) | BS 476: Part 24, EN 1366-1 | Fire dampers |
| RTI International | ASHRAE 52.2-2012 | Filter efficiency testing |
| ASTM International | Various ASTM methods | Tapes, coatings |

---

## 4. Products on Website NOT in Local PDFs

These product lines appear on cmsglobal.com but were NOT included in the Vantra PDF material provided:

### 4.1 Special Filters (8 products)

**Paint Spraying Area:**
- Andrea Paper -- pleated cardboard filters for paint/powder coating booths
- Diffusion Rolls -- scrim-backed media for fresh air in spray areas
- Paint Glass -- high-viscose glass fiber in rolls and cut pads
- Mini Mesh -- expanded paper rolls for overspray capture

**Gas Turbine Intake:**
- GT Cell -- box-type deep pleat with dual-layer micro glass fiber
- CDPGT -- high-dense glass fiber for gas turbine fresh air intake
- GT Glass -- synthetic/glass fiber auto rolls for Roll-o-matic units
- Turbo Pulse -- cardboard-frame panel filters for low pressure drop

### 4.2 EP Series (Electrostatic Precipitators)
- EP 30 / EP 60 / EP 90 -- electrostatic air cleaners for kitchen ventilation, up to 99% efficiency
- AQE F61 Autoclean (F61A/F61B/F61C) -- self-cleaning electrostatic units, stackable modules

### 4.3 UV Solutions
- V-MAX Coil Cleaning System -- UV air disinfection and coil cleaning, negligible pressure drop

### 4.4 Additional Pre-Filters (on website, not in PDF list)
- Glass Rolls -- high-dense viscose glass fiber for fresh air
- Auto Rolls -- synthetic/glass fiber for automatic roll-change units
- Panel Filters -- cardboard frame, low pressure drop for FCU/AHU

### 4.5 Additional Fine Filters
- PLEAT CPIRF -- disposable pleated, medium/high efficiency
- Next Generation V-Cell -- synthetic media, ABS frame, for green building/variable volume

### 4.6 Additional Carbon Filters
- CCFG -- non-woven polyester base panel filter
- CCGV -- granule-filled perforated metallic panels for airports/hospitals
- CCIR (Pleated) -- high-dense media reinforced with mesh

### 4.7 Additional Air Outlet Products
- Gravity Shutters -- one-way backflow preventers
- Access Doors -- removable panels for duct access
- Non Return Dampers -- one-way airflow control
- Disc Valves -- round exhaust terminals for washrooms
- Eyeball Diffusers -- directional adjustable diffusers

### 4.8 HVAC Ducting (fabrication services)
- Mild Steel ducts (1-3mm, for kitchen exhaust)
- Stainless Steel ducts (Grade 304, 316)
- Spiral Ducting (GI sheet)
- Rectangular Ducting (GI, DW144/SMACNA standards)
- Aluminium Ducting (plain + stucco embossed)
- Fire Rated Ductwork (glass fibre fabric bonded)

### 4.9 Flanges (Excel brand)
- Excel Flanging Systems -- 20mm, 25mm, 30mm, 35mm, 40mm sizes
- GI sheet, integral non-toxic sealant pocket
- BSRIA tested, DW144 compliant, ISO recognized
- Available fitted-on-duct or loose

### 4.10 MEP Accessories (beyond what's in PDFs)
- Pipe Support & Hangers (from ETALIA) -- clevis hangers, sprinkler clamps, U-bolts, threaded rods
- Copper Coils and Pipes -- high conductivity, corrosion resistant

### 4.11 Laundry Solutions (SEPARATE business line, NOT HVAC)
- Electrolux Professional systems (Sweden) -- washers, dryers, ironers, folders
- Thermopatch marking systems -- textile identification
- Camptel finishing equipment (Italy) -- shirt presses, garment conveyors
- Fanafel consumables (Portugal) -- paddings, wax, guide tapes
- General consumables -- wire hangers, trouser/shoulder guards

### 4.12 Testing & Validation Services
Not products -- these are SERVICES offered by CMS:
- Airflow velocity and volume testing
- HEPA filter integrity testing (aerosol/photometer method)
- Particle counting (as-built, at-rest, in-operation)
- Pressure differential measurement
- Temperature/humidity verification
- Acoustic testing
- Recovery rate evaluation
- Biological sampling

---

## 5. Content Freshness

| Section | Last Updated |
|---------|-------------|
| Stories/Blog | November 2017 - January 2018 |
| Product pages | March 2018 (based on upload dates in URLs) |
| Downloads page | Unknown, but all PDF links appear functional |

The website has not been meaningfully updated since early 2018.

---

## 6. Key Takeaways for Vantra

1. **No individual product pages exist on CMS Global.** Products are only shown as text blurbs within category listing pages. There is no product detail page with full specs, selection charts, or model variants. This is a massive gap that Vantra can fill.

2. **The website has more products than the provided PDFs.** Approximately 20-25 additional products appear on the website (Special Filters, EP Series, UV Solutions, additional carbon/pre/fine filter variants, extra outlet types). Whether Vantra will carry all of these needs to be confirmed with the client.

3. **Laundry Solutions is a separate business line** (Electrolux, Camptel, etc.) and is unlikely to be part of Vantra's scope unless the client says otherwise.

4. **HVAC Ducting and Flanges are fabrication/manufacturing products** -- physical items manufactured in CMS factories. Whether Vantra will sell these in Lebanon depends on manufacturing/shipping logistics.

5. **Testing & Validation is a service offering**, not a product line. Vantra may or may not offer this in Lebanon.

6. **The website itself is broken in multiple ways** -- swapped nav labels, dead links, stale content, misleading login copy, poor performance. This validates the entire premise of building a better website for Vantra.

---

## 7. Contact Information & Office Locations

**Main phone:** +971 4 3474858
**Main email:** info@cmsglobal.com

### UAE Offices (10 locations)
| Division | Entity | Location | Phone |
|----------|--------|----------|-------|
| Corporate HQ | Century Mechanical Systems Factory LLC | Al Quoz Industrial Area 4, Plot 369-950, Dubai | +971 4 3474858 |
| Laundry Solutions | CMS Manufacturing Co. LLC | Al Quoz Industrial Area 4, Dubai | +971 4 3417721 |
| Ducting Division | Century Mechanical Systems Factory LLC | Al Quoz Industrial Area 2, Dubai | +971 4 3475565 |
| Tapes Division | CMS Manufacturing Co. LLC | Al Quoz Industrial Area 4, Dubai | sales.tapes@cmsglobal.com |
| Abu Dhabi | Century Mechanical Systems LLC | Mussafah M-44, Sector 16 | +971 2 6212007 |
| Ras Al Khaimah Factory | Century Mechanical Systems Factory LLC | AL-Jazeera Industrial Area | +971 7 2449255 |
| Technoflow | Technoflow Trading LLC | Umm Ramool, Dubai | +971 4 285 7700 |
| Reeftech Services | Reeftech Services LLC | Abu Dhabi | +971 2 6656254 |
| Digital World Printing | Digital World Computer Design LLC | Al Shraifi Centre, Karama, Dubai | +971 4 397 2223 |
| Printing Press | CMS Printing Press LLC | Ras Al Khor Industrial Area, Dubai | +971 4 3202939 |

### Other Countries
| Country | Entity | Location | Phone |
|---------|--------|----------|-------|
| Sri Lanka | Century Mechanical Systems (PVT) LTD | Kekulanwila Road, Jalthara, Ranala | +94 112141892 |
| Oman | Century Mechanical Systems & Services Co LLC | Al-Azaiba, Muscat | +968 24626752 |
| Kuwait | Century Mechanical Systems Co. W.L.L. | Waha Mall, Jaleeb Al Shuyoukh | +965 24317280 |
| Saudi (Riyadh) | Century Mechanical Systems Trading Est. | Sitteen Street, Malaz | +966 11 2066699 |
| Saudi (Jeddah) | Century Mechanical Systems Trading Est. | Azziziyah Dist. 6 | +966 12 2615560 |
| Saudi (Dammam) | Century Mechanical Systems Trading Est. | Khalidiya | +966 13 8596363 |
| Saudi (Star Press) | Star Printing Press | Riyadh 11312 | +966 11 241 2297 |

**Note:** About page mentions India and Qatar offices but they are not listed on the Contact page.

### CMS Group Entities Identified
- Century Mechanical Systems Factory LLC (main manufacturing)
- CMS Manufacturing Co. LLC (tapes, laundry equipment)
- Technoflow Trading LLC (trading arm)
- Reeftech Services LLC (services)
- Digital World Computer Design LLC (printing/design)
- CMS Printing Press LLC
- CMS Logistics (cmslogistics.ae)
- Star Printing Press (Saudi)

---

## 8. Downloads Page - Online-Only Catalogs

The downloads page at /corporate/downloads/ lists 16 downloadable PDFs. Several exist ONLY on the website and were NOT provided in the local material folder:

| Label | Filename | In Local PDFs? | Notes |
|-------|----------|----------------|-------|
| ECOLOGY UNIT | Excelair-Eco.pdf | YES (local copy exists) | |
| AIR FILTERS | AF-General-2018.pdf | NO | General air filters catalog |
| EP SERIES | AF-EPSERIES-2018.pdf | NO | Electrostatic precipitator catalog |
| AIR OUTLETS | AIROUTLET-General.pdf | YES (similar local copy) | |
| ACCESS DOORS | Accessdoor.pdf | NO | Access door catalog |
| TESTING | Testing-and-validation-e-catalogue.pdf | NO | Testing services catalog |
| DUCTING | GD1000-SERIES.pdf | MISLABELED | File is named after the GD1000 Sound Attenuator series, not ducting |
| EXCEL FLANGES | Flanging.pdf | NO | Flanging systems catalog |
| DUROTAPE | # (broken link) | BROKEN | Link points to "#", download non-functional |
| DURO PLATINA | DUROTAPE-PLATINA.pdf | NO | Duro Platina tape catalog |
| AIR FILTERS (leaflet) | SINGLE-PAGE-AF-2018.pdf | NO | Single-page summary |
| AIR OUTLETS (leaflet) | SINGLE-PAGE-Airoutlet-2018.pdf | NO | Single-page summary |
| EXCEL TAPES | EXCEL-TAPES-2018.pdf | NO | Excel brand tapes |
| DYNOTAPE | DynoTape.pdf | NO | DynoTape brand catalog |
| DUROTAPE | Durotape.pdf | PARTIAL | May overlap with local DURO catalogs |
| CMS PRODUCTS | ALL-PRODUCT.pdf | NO | Full CMS product overview |

**File size display bug confirmed:** All sizes shown as raw bytes (e.g., "1289599 KB" should be "1.3 MB"). One entry shows "Size KB" with no value at all (the broken Durotape link).

**Decision needed:** Should we download these online-only catalogs for additional product data, or are the locally-provided PDFs sufficient for Vantra's initial product scope?

---

# Part B: Independent Live Re-Verification (2026-06-28)

> **Why this exists.** Part A (above) was written by a prior agent and accepted without checking. Before we
> repeat any of its claims to the client, every headline finding was re-tested against the live site on
> 2026-06-28 using a real Chrome session: network waterfall, console, `performance` Navigation/Resource
> Timing, computed styles, HTTP response headers, `robots.txt`, and the XML sitemaps. The verdict: the broad
> thesis ("the site is dated, broken in places, ungated in practice, and has no product detail pages") is
> **correct and well-supported**, but several specifics in Part A are **wrong or overstated**, and the live
> site is in some ways worse (security, front-end bloat) than Part A reported.
>
> **Rule for the pitch:** only use the "Confirmed" and "New" items below. Do not repeat the "Corrected" items
> as stated in Part A.

## B.1 Method & evidence

- Live browser navigation to: homepage, `/product/hepa-sc/`, `/corporate/downloads/`, `/air-filters/hepa-filters/`,
  `/corporate/certification/`, `/corporate/about-cms/`, `/contact/`, `/?s=hepa`.
- Data sources: 82-request network capture on homepage load, console exception log, `performance` timing API,
  `getComputedStyle` on body/nav/headings, `fetch()` of response headers + `robots.txt` + sitemaps, DOM queries
  for menu hrefs / product links / form fields, and screenshots of each page type.

## B.2 Confirmed (Part A was right, now proven live)

| Claim | Live evidence |
|-------|---------------|
| Site title `CMS - Group of companies` | `document.title` exact match |
| Broken meta description `"- Group of companies"` | meta + OpenGraph + Twitter description all carry it |
| WordPress 4.9.26 | `<meta name="generator">` = `WordPress 4.9.26` |
| Typography: Avenir, body `#333`/14px, nav bootstrap-blue `#337ab7`/18px, H1 60px white | computed styles confirm exactly (`AvenirLTStd-Light`, `rgb(51,51,51)`, `rgb(51,122,183)`) |
| 206 product pages | `product-sitemap.xml` returns exactly **206** `<loc>` entries |
| Product pages render the homepage (duplicate content) | `/product/hepa-sc/`: title = "HEPA SC - CMS" but H1 = "Discover Ideas", body = homepage blurbs, **zero** HEPA content, yet self-canonical. 206 self-canonical URLs serving identical content. |
| Swapped Air Outlets nav labels | "HVAC Accessories" -> `/air-outlets/grilles-diffusers/`; "Grilles & Diffusers" -> `/air-outlets/hvac-accessories/` |
| Dead `BLOG` nav link | `href="#"` |
| Misleading login copy vs ungated downloads | Homepage: "Login with your credentials or Register". Downloads page: **no** login form, PDFs are direct `/wp-content/uploads/2018/03/*.pdf` links |
| `ajax-loader.gif` 404 | confirmed 404 |
| No filtering/search on category pages | `/air-filters/hepa-filters/`: 0 selects, 0 checkboxes, 0 filter UI |
| No real product detail pages | Category tiles (HEPA SC/HV/HC/BIO) show a name + photo, **no specs, no datasheet, and link to nothing** (0 `/product/` links on the page) |
| Multi-office contact data; main line `+971 4 3474858`, `info@cmsglobal.com` | confirmed; ~20 phone numbers and 12 entity emails across UAE/Sri Lanka/Oman/Kuwait/Saudi |
| Founded 1982, Century Mechanical Systems Group, multi-country | About page confirms |
| Content frozen ~2017-2018 | image uploads dated `/2018/`, `/2019/`; About copy still says "more than 35 Years" (1982 + 35 ~ 2017) |
| Responsive with hamburger menu | `navbar-toggle` element present (Bootstrap 3); viewport meta present |
| Certs include BSRIA (Class D, DW/144 2016), UL-555/555S, Intertek | confirmed on cert cards |

## B.3 Corrected (Part A was wrong or overstated)

1. **lightcase is 503, not 404.** Part A lists `lightcase.css`/`lightcase.js` as "404 Not Found". They actually
   return **HTTP 503 (Service Unavailable)**. This matters because a 503 is an intermittent server failure, not
   a missing file, and (see B.5) it is the site's single biggest performance problem.
2. **"7 critical JS console errors" is overstated.** Live, the homepage throws **one** site JS exception:
   `scripts.js:69 TypeError: Cannot set properties of null (setting 'width')`. The paraxify and parallax
   "is not a function" errors did **not** reproduce: `paraxify.min.js` and `paraxify.css` both load with 200 and
   the function exists. Part A's count appears to have folded in 5 `"A listener indicated an asynchronous response..."`
   messages, which are **Chrome-extension noise, not the site**. Honest figure: 1 JS exception + 2 broken resource
   requests (the 503 lightcase pair, plus the 404 ajax-loader).
3. **File-size display bug ("1289599 KB") does not reproduce.** The live public Downloads page shows **no file
   sizes at all**, just thumbnail + "DOWNLOAD" buttons. Either the prior agent saw a WordPress media/admin view
   or the claim was wrong. Do not use it.
4. **Homepage does not "time out at 60s" for users.** Real `DOMContentLoaded` is **~5.5s** and `load` ~5.66s. The
   60s figure is a test-harness artifact: Playwright `networkidle` never settles because of continuous tracking
   beacons (GoDaddy `csp.secureserver.net` event bus + legacy Google Analytics) and the stalled 503 requests, so
   it waited out its 60s ceiling. The honest, still-damaging line is "~5.5s to interactive, dominated by a broken
   third-party script," not "60-second load."
5. **Certification standards table is partly invented.** The live cert page shows **BSRIA, Applus Laboratories
   (FIREMAC UK fire-rated ductwork), UL, Intertek** with descriptive text. Part A's table also lists IFC
   Certification (UKAS) BS 476, RTI International ASHRAE 52.2, AMCA, and ETL ASTM E477 mappings that are **not on
   the page**, those were likely pulled from PDFs or inferred. Treat the precise standard-to-product mapping as
   unverified.
6. **Search is not broken and is not empty.** `/?s=hepa` returns **"9 Search Results Found"**. It works. The real,
   smaller defect: several result tiles render a **"Photo Not Available"** placeholder (missing images). Part A's
   "search results' download buttons link to #" did not clearly reproduce.

## B.4 New findings Part A missed (some worse than what it reported)

**Security (the strongest new material, and more serious than "old WordPress"):**

- **PHP 5.6.40** (`X-Powered-By` header). PHP 5.6 has been **end-of-life since December 2018**, no security
  patches for 7+ years. This is a bigger flag than WP 4.9.26 alone.
- **Zero security headers.** No `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`,
  `X-Content-Type-Options`, `Referrer-Policy`, or `Permissions-Policy`. Exposed to clickjacking and MIME-sniffing;
  no HSTS. Server: Apache.

**Front-end engineering (amateur build, real bloat):**

- **jQuery loaded three times** on one page: `jquery 1.12.4` (WP core), `jquery 3.2.1` and `jquery 2.2.4` (both from
  Google CDN), plus `jquery-migrate`. The resolved `window.jQuery` is 2.2.4. Redundant and conflict-prone.
- **`node_modules/` shipped to production.** Bootstrap, owl-carousel-2, slider-pro, bxslider, slick-carousel,
  waypoints, lightcase, and modernizr are all served directly from `/wp-content/themes/cms/node_modules/...`.
  No build step or bundling, the dev dependency tree is the live asset tree.
- **Redundant carousel/slider stack.** owl-carousel-2 + slider-pro + bxslider + slick-carousel + bootstrap-select
  + wow.js + jquery.shuffle all load together. 25 scripts and ~20 stylesheets on the homepage.

**Infrastructure / analytics:**

- **Hosted on GoDaddy shared hosting** (`img1.wsimg.com`, `csp.secureserver.net` event-bus beacons, GoDaddy
  `tccl.min.js` traffic script).
- **Dead analytics:** legacy `ga.js` Universal Analytics (`UA-23524524-6`). Universal Analytics stopped processing
  data in 2023-2024, so they likely have no working analytics at all.

**Content / UX / SEO details:**

- **~5.5s to interactive, caused mostly by the broken 503 resource.** Slowest resources: `lightcase.js` 5.4s (503),
  `lightcase.css` 3.6s (503), `gel.jpg` 3.6s, then the carousel JS pile at ~3s each. Fix the 503 and the page roughly
  halves its load time.
- **Numeric product slugs** exist (`/product/254/`, `/product/289/`), products published without a real slug.
- **Cert logos have empty `alt` text** (accessibility + SEO miss), though the surrounding card copy is fine.
- **Filename typo** in a download: `SINGLE-APGE-AF-2018.pdf` (should be "PAGE").
- **Generic, off-topic stock-photo banners** on every page: a road cyclist on the homepage, a plain sky on Downloads,
  a forest/mountain range on Certifications. None relate to filtration or HVAC.
- **Copy error** in the homepage hero: "Where engineering ideas **is** our lifestyle !".

## B.5 Extracted design DNA (measured, not guessed)

- **Palette:** white background, `#333` body text, a single Bootstrap-3 accent blue `#337ab7` for nav/links, and
  dark-navy photographic banners. Essentially the stock Bootstrap 3 look with one brand blue.
- **Type:** Avenir family. `AvenirLTStd-Light` for body (14px) and nav (18px); `AvenirLT-Black` for headings up to
  60px. Headings are large but set in a light/thin weight, which reads low-contrast.
- **Layout:** Bootstrap 3 grid (~1170px container). Every page = full-bleed stock-photo hero with a short centered
  title, then equal 4-up card grids of image tiles with thin gray labels.
- **Imagery:** generic stock photography unrelated to the product, plus product shots on white.
- **Interaction:** heavy jQuery (multiple sliders, parallax, a lightbox that is currently 503, wow.js scroll
  reveals). Visibly dated, and partially broken.
- **Identity:** none beyond the blue. No type system, no iconography of its own, no data visualization, no product
  data model.

### How our "Instrument" system answers each DNA flaw

| CMS Global (measured) | Vantra "Instrument" (built) |
|-----------------------|------------------------------|
| One stock Bootstrap blue, default look | Deliberate restrained token palette (paper/ink/steel/rule) with `signal` red used only as an indicator |
| Generic stock photos (cyclist, sky, mountains) | Domain-grounded signature visuals (efficiency curve, grade ladder, pressure gauge, octave bands) driven by real spec geometry |
| Product = non-clickable image tile, no specs | Real product detail pages: spec tables by `spec_type`, variant tables, model decoder, datasheet download |
| No filtering, no working faceting | URL-driven faceted filtering with counts that match results |
| Broken meta description + 206 duplicate self-canonical pages | Per-page metadata, JSON-LD, correct canonicals, SSG product pages, sitemap/robots |
| EOL PHP 5.6 + WP 4.9.26, zero security headers, node_modules in prod | Next.js 15 / React 19, static data layer, no server attack surface in the demo, modern build |
| Misleading "login/register" over ungated files | Open by design, and the copy tells the truth |

## B.6 Pitch-ready, verified talking points (safe to say out loud)

These are all confirmed live and defensible if the client pushes back:

1. "Your product catalog has no product pages. All 206 product URLs serve the homepage, so Google sees 206 duplicate
   pages and a visitor searching a product lands on your home screen."
2. "An engineer can't get a spec or a datasheet from a product. The category pages are image tiles with no data and
   no links."
3. "The site runs PHP 5.6 and WordPress 4.9, both years past end-of-life, with no security headers."
4. "The homepage takes about 5.5 seconds to load, and most of that is a broken script that the server returns an
   error for on every visit."
5. "Your navigation labels are swapped, your blog link goes nowhere, your search shows 'Photo Not Available', and
   your meta description is literally '- Group of companies'."
6. "The downloads are already open to everyone, but the homepage still tells people to log in or register, so the
   gate is just friction with no purpose."

Avoid: the "60-second load", the "1.3 MB file-size bug", the "7 JS errors", and the detailed cert-standards table.
Those did not hold up.

## B.7 Full-site coverage sweep (2026-06-28)

The first pass (B.1-B.6) verified the headline claims. This pass closes the gaps so we can honestly say
**every page in the site navigation, and every functional aspect, was checked live**, not sampled.

**Every navigation page visited and confirmed live (all HTTP 200):**

- Top level: HVAC Ducting, MEP Accessories, Flanges, Adhesive Tapes, Laundry Solutions.
- Corporate: About, Product Focus, CMS Export, Stories, Careers, Downloads, Certifications, Reach Us (Contact).
- Air Filters subcategories: Pre, Fine, Hepa, Carbon, Special, Ecology Unit, EP Series, Testing & Validation, UV Solutions.
- Air Outlets: both pages (grilles-diffusers and hvac-accessories), confirming the swapped labels resolve.
- System: `robots.txt`, `sitemap_index.xml` (13 child sitemaps), `product-sitemap.xml` (206), `product_cat-sitemap.xml` (25), a 404 probe.

**The site-wide pattern is now proven, not extrapolated:**

- **No product detail pages anywhere.** Across all 21+ category/section pages checked, there are **zero** links
  to `/product/...` pages. Every section is a banner + image-tile grid with no specs and no datasheet on the tile.
- **Duplicate-content bug holds across the catalog.** 6 distinct product URLs were opened
  (`hepa-sc`, `254`/Next-Gen V-Cell, `sound-attenuators`, `uv-coil-cleaning`, `gt-cell`, `mp-gelseal`): all return a
  unique `<title>` but render the homepage body (H1 "Discover Ideas", homepage blurbs, no product content). Given
  the 206 share one broken template, this is the behavior of the whole set.

**Additional corrections to Part A from this sweep:**

- **Privacy statement is not a broken `#` link.** It is a plain `<label>`, not a hyperlink at all. The real issue
  is that no privacy policy is linked anywhere (a compliance gap), not a "link pointing to #".
- **No intrusive auto-popup on Product Focus.** The enquiry-modal markup exists site-wide (it is in the footer
  template on every page), but **0 modals are visible on load**. It only opens on a user click. Part A's "intrusive
  modal appears" is not accurate as stated.
- **404 handling is correct.** A nonexistent URL returns a proper HTTP 404 (not a soft-404 / 200).

**Other aspects validated:**

- **Mobile / responsive:** verified by mechanism, not just markup. The Bootstrap `navbar-toggle` hamburger is
  `display:none` at desktop width and is controlled by the 767px breakpoint; `style-responsive.css` loads; the
  viewport meta is present. (A pixel-accurate mobile screenshot was not obtainable through the automation tool's
  fixed-viewport capture, so this is verified via CSS/DOM behavior rather than a phone-width screenshot.)
- **Contact form:** present and is Contact Form 7. It was **not** test-submitted on purpose, submitting would push
  junk into their live inbox/CRM, which is not ours to do.

**Profiler pass added 2026-06-28 (see B.8):** the items first deferred here, a formal Lighthouse audit, a
Core Web Vitals performance trace, and a memory/heap snapshot, were subsequently run with Chrome DevTools.
Nothing material is now left unmeasured on the public site.

**Coverage conclusion:** the public site has been validated end to end, every navigation page, the product-page
template, search, downloads, the contact and newsletter forms, 404 behavior, responsive behavior, the full network
and console picture, response headers, and the design system. The findings in Parts B.2-B.7 are first-hand and
current as of 2026-06-28.

## B.8 Profiler pass: Core Web Vitals, Lighthouse, memory (2026-06-28)

Run with Chrome DevTools (real navigation against `https://cmsglobal.com/`): a performance trace, a Lighthouse
audit (desktop, navigation), and a JS heap snapshot. Raw artifacts saved to the session scratchpad
(`cms-trace.json`, `report.json`/`report.html`, `cms-heap.heapsnapshot`).

**Speed (Core Web Vitals).** Field data from Google's CrUX (p75, real Chrome users) is the authority and it
confirms the corrected ~5.5s load exactly:

| Metric | Field (real users, p75) | Verdict | Lab (this run) |
|---|---|---|---|
| LCP | **5,527 ms** | Poor (good < 2,500) | 3,225 ms |
| TTFB | **1,931 ms** | Poor (slow server) | 3 ms (warm cache) |
| INP | 48 ms | Good | n/a |
| CLS | 0.06 | Good | 0.03 |

So the real-user experience is genuinely slow, and it is **server + critical-path bound**, not a layout-stability
or interactivity problem. Two root causes, both first-hand:

1. **A render-blocking 404 is the single biggest FCP cost.** `…/themes/cms/node_modules/lightcase/src/css/lightcase.css`
   is requested as a render-blocking stylesheet, **404s, and sits ~2.3 s in the critical path** before resolving.
   (This run returned 404; an earlier run saw 503, it flaps, but it is broken render-blocking either way.) Lighthouse
   estimates **~1,371 ms of FCP** recoverable from render-blocking alone.
2. **23 render-blocking resources** in `<head>` (21 stylesheets + jQuery 1.12.4 + jquery-migrate), none bundled.
   Runtime confirms **20 stylesheets and 38 `<script>` elements (25 external + 13 inline)** on a brochure homepage.

**`node_modules/` is served to production, confirmed by URL.** Render-blocking requests resolve to
`…/themes/cms/node_modules/{lightcase, slick-carousel, bxslider, slider-pro, owl-carousel-2, bootstrap}/…`.
Note **four overlapping carousel/slider libraries** (slick, bxslider, slider-pro, owl-carousel-2) all loaded.

**jQuery loaded 3x, now proven at runtime** (not just inferred from `<script>` tags): `1.12.4` loads render-blocking
in the head, while at runtime `window.jQuery` resolves to **2.2.4** and `window.$` to **3.2.1**. Three versions coexist.

**Lighthouse (desktop, navigation):** Accessibility **77**, SEO **85**, Best Practices **96**, Agentic Browsing **4**.
8 audits fail:

- **Accessibility:** no `<main>` landmark; **5 links with no discernible name**; **5 of 6 images missing `alt`**;
  1 element fails **color contrast**; accessibility tree malformed.
- **SEO:** **no meta description** (corroborates Part B); image-alt also counts against SEO.
- **Best Practices:** **7 console errors** logged (see below). The 96 score is high *because Lighthouse weights
  security headers and EOL runtimes lightly*, it does **not** contradict the zero-security-headers / PHP 5.6.40
  findings; treat the 96 as "no broken HTTPS / no deprecated JS APIs," not "secure."
- **Agentic Browsing 4/100:** the page is nearly unusable to an automated/AI agent (malformed a11y tree, no
  landmarks, unnamed links), the modern analogue of the duplicate-template/no-structured-data problem.

**Console (refines Part B's "1 real error").** 7 console errors total: ~3-4 are **resource 404s** (the broken
`node_modules` assets), plus **two genuine JS exceptions**, `$(...).paraxify is not a function` at
`themes/cms/js/scripts.js:158` (jQuery-plugin load-order failure) and `Cannot set properties of null (setting
'onclick')` in the inline homepage script (~line 1270). So it is 2 real JS faults, not 1, and several 404s.

**Memory is a non-issue.** JS heap **9.7 MB used / 10.9 MB total** (limit ~4.2 GB); DOM **543-611 nodes**, depth 16,
largest layout touched 429 nodes (~105 ms). No leak, no bloat. We will not pretend otherwise.

**Transport is actually fine, do not attack it.** Origin is **HTTP/2**; JS/CSS are **gzip**-compressed; static assets
carry **~30-day** cache lifetimes; the CDN-hosted Font Awesome is HTTP/3 + brotli. The performance problem is the
render-blocking waterfall + the broken 404 asset + slow server TTFB + a late-discovered (lazy) LCP image, **not**
the transport layer. PHP **5.6.40** / **Apache** reconfirmed via response headers.

**Privacy/tracking note.** **8 cookies** are set on the homepage with no consent mechanism; `localStorage`/
`sessionStorage` are empty. Combined with the missing privacy policy (B.7), this is a GDPR/consent gap.

**Net:** the profiler pass corroborated the thesis with first-hand numbers and tightened three Part B claims,
console errors are 2 JS faults + 404s (not 1); the slow load is now root-caused to a render-blocking 404 +
unbundled 23-request head; and memory/DOM/transport are explicitly **clean**, so we don't overclaim them.
