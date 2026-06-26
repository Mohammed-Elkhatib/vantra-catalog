# CMS Global Website Audit (cmsglobal.com)

> Full crawl performed 2026-06-24. Every page in the site navigation was visited and content extracted.

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
