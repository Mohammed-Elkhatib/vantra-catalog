# MVP Specification: Vantra Lebanon Product Catalog

> Generated 2026-06-24. Designed to be demo-ready for a client meeting. Scope: a working frontend prototype that displays core products with instant filtering and friction-free PDF downloads.

---

## 1. MVP Goal

Build a polished, functional product catalog prototype that:
1. Looks professional enough to present to the client and lock in a price
2. Demonstrates the core value proposition: **open catalog, instant filtering, zero friction**
3. Is built on the production architecture (not throwaway code)
4. Can be populated with real product data from the documents we've analyzed

**Time to functional demo: 2-3 days of focused development.**

---

## 2. Scope: What's In vs. What's Out

### IN (MVP)
| Feature | Rationale |
|---------|-----------|
| Homepage with hero + category grid | First impression, establishes brand |
| Product listing page with faceted filters | Core differentiator vs. CMS Global |
| Product detail page with inline specs | Eliminates PDF-only browsing |
| PDF download buttons (TDS + Catalog) | Preserves existing workflow for engineers who want PDFs |
| Category navigation | Mirrors the product hierarchy from catalogs |
| Mobile-responsive layout | Engineers browse on tablets at job sites |
| Contact/inquiry form | Basic lead capture without gating |
| 15-25 representative products loaded | Enough to demo filtering across categories |

### OUT (Post-MVP)
| Feature | Why Deferred |
|---------|-------------|
| Sanity CMS integration | Partner won't need to edit during demo phase |
| AI search/recommendation | Value-add, not core |
| Multi-language | Not needed for initial demo |
| User accounts | Explicitly unwanted per client brief |
| E-commerce / pricing | Not a sales platform |
| Full 170+ product data entry | Bulk migration script handles this post-approval |

---

## 3. Pages & Routes

### 3.1 Homepage (`/`)

```
┌──────────────────────────────────────────────────┐
│  [Vantra Logo]              [Products] [Contact] │
├──────────────────────────────────────────────────┤
│                                                  │
│   MEDICAL-GRADE AIR FILTRATION                   │
│   SOLUTIONS FOR LEBANON                          │
│                                                  │
│   Browse our complete catalog — no registration  │
│   required.                                      │
│                                                  │
│   [Explore Products →]                           │
│                                                  │
├──────────────────────────────────────────────────┤
│                                                  │
│   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
│   │  Pre   │ │  Fine  │ │  HEPA  │ │ Carbon │   │
│   │Filters │ │Filters │ │Filters │ │Filters │   │
│   │  (8)   │ │  (14)  │ │  (11)  │ │  (8)   │   │
│   └────────┘ └────────┘ └────────┘ └────────┘   │
│                                                  │
│   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
│   │Dampers │ │ Sound  │ │Housing │ │Ecology │   │
│   │        │ │Attenu. │ │Filters │ │ Units  │   │
│   └────────┘ └────────┘ └────────┘ └────────┘   │
│                                                  │
├──────────────────────────────────────────────────┤
│  Trusted Certifications                          │
│  [UL] [ETL] [SMACNA] [BSRIA] [AMCA] [NAFA]     │
├──────────────────────────────────────────────────┤
│  About Vantra  │  Part of CMS Group  │  Contact  │
└──────────────────────────────────────────────────┘
```

**Key elements:**
- Hero: clean, professional, immediately communicates "no registration required"
- Category grid: clickable cards with product count badges
- Certification logos bar: establishes credibility instantly
- No carousel, no animations, no clutter

### 3.2 Product Listing (`/products` and `/products/[category]`)

```
┌──────────────────────────────────────────────────┐
│  ← Products  /  HEPA Filters                    │
├──────────┬───────────────────────────────────────┤
│          │                                       │
│ FILTERS  │  Showing 11 HEPA Filters              │
│          │  ┌─────────────────────────────────┐   │
│ Category │  │ ┌─────┐                         │   │
│ ☑ Pre    │  │ │ img │  HEPA HT-900            │   │
│ ☑ Fine   │  │ │     │  Deep Pleat, EN 1822    │   │
│ ☑ HEPA ← │  │ └─────┘  H13/H14, up to 900°F  │   │
│ ☐ Carbon │  │           [View Details] [↓ PDF] │   │
│          │  └─────────────────────────────────┘   │
│ Specs    │  ┌─────────────────────────────────┐   │
│          │  │ ┌─────┐                         │   │
│ EN 1822: │  │ │ img │  HEPA BIO Filter        │   │
│ ☐ E12   │  │ │     │  Biological safety...   │   │
│ ☑ H13   │  │ └─────┘  [View Details] [↓ PDF] │   │
│ ☑ H14   │  └─────────────────────────────────┘   │
│          │                                       │
│ Max Temp │  ┌─────────────────────────────────┐   │
│ [slider] │  │ ...more products...             │   │
│          │  └─────────────────────────────────┘   │
│          │                                       │
│ [Clear]  │                                       │
└──────────┴───────────────────────────────────────┘
```

**Key elements:**
- Sidebar filters that update the list instantly (client-side, no page reload)
- Filter facets derived from the schema: category, classification, MERV rating, certifications
- Each product card shows: image, name, key specs summary, direct PDF download button
- "View Details" links to the full product page
- URL reflects filter state (`/products/hepa-filters?grade=H14`) for shareability
- Mobile: filters collapse into a slide-out drawer

### 3.3 Product Detail (`/products/[slug]`)

```
┌──────────────────────────────────────────────────┐
│  ← Back to HEPA Filters                         │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌────────────┐  HEPA HT-900                    │
│  │            │  Deep Pleat Construction | HEPA  │
│  │   [Hero    │                                  │
│  │   Image]   │  ┌──────────┐ ┌──────────────┐  │
│  │            │  │ ↓ TDS    │ │ ↓ Full       │  │
│  │            │  │ PDF      │ │ Catalog PDF  │  │
│  └────────────┘  └──────────┘ └──────────────┘  │
│                                                  │
├──────────────────────────────────────────────────┤
│  Features & Benefits                             │
│  • Standard capacity deep pleated HEPA Filter    │
│  • Micro glass fiber paper media                 │
│  • Reinforced stainless steel frame              │
│  • Scan tested per EN 1822                       │
│  • Suitable for temps up to 900°F / 482°C        │
│  • Pharmaceutical dehydrogenation tunnels/ovens  │
│                                                  │
├──────────────────────────────────────────────────┤
│  Technical Specifications                        │
│  ┌────────────────────┬────────────────────────┐ │
│  │ Type               │ Deep pleat             │ │
│  │ Filter Grades      │ E12 / H13 / H14       │ │
│  │ MPPS Efficiency    │ ≤99.5% / ≤99.95%      │ │
│  │ Efficiency @ 0.3μ  │ ≤99.97% / ≤99.99%     │ │
│  │ Filter Media       │ Micro glass fiber      │ │
│  │ Frame              │ Stainless steel        │ │
│  │ Gasket             │ Ceramic Fiberglass     │ │
│  │ Max Temperature    │ 900°F / 482°C          │ │
│  │ Final Pressure Drop│ 2.00" wg              │ │
│  └────────────────────┴────────────────────────┘ │
│                                                  │
├──────────────────────────────────────────────────┤
│  Selection Chart                                 │
│  ┌───────────────┬──────┬──────┬──────┬─────┐   │
│  │ Model         │ W×H×D│Grade │ CFM  │ Area│   │
│  ├───────────────┼──────┼──────┼──────┼─────┤   │
│  │ EHHT900-12x24 │12×24 │ H14  │ 240  │ 39  │   │
│  │ EHHT900-24x24 │24×24 │ H14  │ 525  │ 83  │   │
│  │ ...           │      │      │      │     │   │
│  └───────────────┴──────┴──────┴──────┴─────┘   │
│  [Search within chart: ________]                 │
│                                                  │
├──────────────────────────────────────────────────┤
│  Applications                                    │
│  [Hospital] [Biomedical] [Pharmaceutical]        │
│  [Laboratories] [Food Processing] [Hospitality]  │
│                                                  │
├──────────────────────────────────────────────────┤
│  Certifications                                  │
│  [UL] [IAQA] [NAFA] [EN 1822]                   │
│                                                  │
├──────────────────────────────────────────────────┤
│  Model Reference Decoder                         │
│  EHHT900 - 12x12x12 - E12                       │
│  E = Excelair                                    │
│  HHT900 = HEPA High Temp 900°F                   │
│  12x12x12 = Width × Height × Depth              │
│  DTF/BX = Double Turn Flange                     │
│  E12 = EN 1822 Grade                             │
│                                                  │
├──────────────────────────────────────────────────┤
│  Need help selecting?  [Contact Us →]            │
└──────────────────────────────────────────────────┘
```

**Key elements:**
- Inline specs table (no PDF required to see technical data)
- Selection chart rendered as a sortable/searchable HTML table
- One-click PDF downloads for both TDS and full catalog
- Model reference decoder (unique value-add: helps engineers understand naming)
- Application tags and certification badges
- Contact CTA at bottom (not gated, not required)

### 3.4 Contact Page (`/contact`)

Simple form: Name, Email, Phone (optional), Company (optional), Product of Interest (dropdown), Message. No login, no account creation.

---

## 4. MVP Product Selection (15-25 products)

To demonstrate filtering across categories, load these representative products:

| Category | Products to Load | Why |
|----------|-----------------|-----|
| Pre Filters | Aluminum Filter, Disposable CDPHC, Polyfiber CPIR | Range of types |
| Fine Filters | Super Pleat MERV 11, Super Pleat MERV 13, V-Cell FG 3V | Shows MERV filtering |
| HEPA Filters | HEPA HT-900, HEPA BIO, HEPA MP HD Gelseal, HEPA SC | Richest data, multiple grades |
| Carbon Filters | CACU Carbon, CCRV Blend, CCYL | Different carbon types |
| Housing Filters | BIBO Unit, Laminar Housing for OT, Fan Filter Unit | Medical-critical products |
| Dampers | EFD-140 (Fire), EFSD-342 (Fire Smoke), ESD-141 (Smoke) | Shows damper classification |
| Sound Attenuators | CSA (Rectangular), CSA-BV (Bend) | Shows construction options |
| Ecology Units | ECO Series (configurable) | Demonstrates multi-stage concept |

**Total: ~20 products** covering all major categories with enough variety to demo meaningful filtering.

---

## 5. Data Format for MVP

Since the CMS isn't wired up for MVP, products will be stored as static JSON files:

```
/data/
  products.json       ← Array of all products (matches schema.json)
  brands.json          ← Brand definitions
  categories.json      ← Category taxonomy
/public/
  /downloads/
    /tds/              ← Technical Data Sheet PDFs
    /catalogs/         ← Full catalog PDFs
  /images/
    /products/         ← Product hero images
```

This structure maps 1:1 to the Sanity schema, so migration to the CMS post-approval is a data import, not a rewrite.

---

## 6. Technical Implementation Plan

### Day 1: Foundation
- [ ] Initialize Next.js 15 project with Tailwind CSS 4
- [ ] Set up project structure (components, data, types)
- [ ] Define TypeScript interfaces from schema.json
- [ ] Build layout: header, footer, navigation
- [ ] Create homepage with category grid
- [ ] Set up static product data (JSON files)

### Day 2: Catalog Core
- [ ] Build product listing page with card grid
- [ ] Implement sidebar filter system (category, specs, certifications)
- [ ] Build product detail page template
- [ ] Render specs table, selection chart, features list
- [ ] Wire up PDF download links
- [ ] Add Pagefind for full-text search

### Day 3: Polish & Demo Prep
- [ ] Load 20 real products with actual data from catalogs
- [ ] Extract and optimize product images from PDFs
- [ ] Copy real PDF files into downloads directory
- [ ] Mobile responsive pass
- [ ] Performance audit (Lighthouse)
- [ ] Deploy to Vercel on ventra-leb.com
- [ ] Prepare 2-minute demo walkthrough

---

## 7. Filter System Design

### Available Filters by Category

| Filter Facet | Applies To | Type | Values |
|-------------|-----------|------|--------|
| Category | All | Multi-select checkboxes | Pre, Fine, HEPA, Carbon, Housing, etc. |
| Brand | All | Multi-select | Excelair, Premier, Duro Dyne, etc. |
| EN 1822 Grade | Filters | Multi-select | E12, H13, H14 |
| MERV Rating | Filters | Range slider | 1-20 |
| Max Temperature | Filters | Range slider | Ambient - 900degF |
| Fire Rating | Dampers | Multi-select | 1.5hr, 3hr |
| Leakage Class | Dampers | Multi-select | I, II, III |
| Construction Material | Multiple | Multi-select | GI, SS 304, SS 316, Aluminum |
| Certification | All | Multi-select | UL, ETL, AMCA |
| Application | All | Multi-select | Hospital, Pharmaceutical, etc. |

### Filter UX Behavior
- Filters update the product list instantly (no "Apply" button)
- Active filters shown as removable chips above the product grid
- Filter counts update to show remaining matches
- URL updates with query params for shareability
- "Clear all filters" button
- Mobile: filters in a slide-out panel with "Show N results" button

---

## 8. PDF Download Strategy

### The problem with the parent site
CMS Global's catalog downloads page shows raw PDF links with file sizes in bytes (e.g., "Size 1289599 KB" -- likely a rendering bug). No preview, no context, no organization.

### Our approach
1. **Inline specs first.** Product pages render all technical data as HTML. Engineers can find what they need without downloading anything.
2. **Contextual PDF buttons.** Each product page has clearly labeled download buttons:
   - "Technical Data Sheet (PDF, 1.2 MB)" -- single product TDS
   - "Full Catalog (PDF, 4.5 MB)" -- complete catalog for that product line
3. **No gates.** Click = download starts. No form, no email, no login.
4. **Download tracking.** Analytics events on PDF downloads to understand what products get the most interest (for future sales intelligence).

---

## 9. Design Direction

### Visual Identity
- **Primary color:** Excelair brand blue (#0075B2) -- established brand recognition
- **Accent:** CMS red (#CC0000) for CTAs and alerts
- **Typography:** Inter or IBM Plex Sans -- clean, engineering-grade, excellent readability for spec tables
- **Layout:** Generous whitespace, card-based, data-dense product pages
- **Imagery:** Product photos from catalogs, desaturated backgrounds, sharp product cutouts

### Competitive Differentiation
| What CMS Global Does | What Vantra Will Do |
|---------------------|---------------------|
| PDF thumbnail grid | Structured, filterable product cards |
| Download-to-read specs | Inline rendered specs tables |
| Misleading "login required" copy | "No registration required" prominently displayed |
| 60+ second page loads | Sub-2-second loads |
| Desktop-only layout | Mobile-first responsive |
| Flat category listing | Faceted filtering with live counts |
| Raw file size display ("1289599 KB") | Clean "1.3 MB" with file type icon |

---

## 10. Success Metrics for Demo

| Metric | Target | Measurement |
|--------|--------|-------------|
| Client reaction | "When can we go live?" | Qualitative |
| Page load time | < 2s on demo network | Lighthouse |
| Products browsable | 20+ across 8 categories | Count |
| Filter operations | < 100ms response | Manual test |
| PDF downloads | One-click, < 1s start | Manual test |
| Mobile usability | Fully functional | Device test |
| Lighthouse performance | 95+ | Automated |
| Zero broken links | All PDFs accessible | Automated check |

---

## 11. Post-Demo Roadmap (if client approves)

| Week | Milestone |
|------|-----------|
| 1 | Wire up Sanity CMS, migrate 20 MVP products to CMS |
| 2 | Bulk import remaining ~150 products via migration script |
| 3 | Partner training on Sanity Studio editing workflow |
| 4 | SEO optimization, meta tags, Open Graph images |
| 5 | Contact form backend (email notifications to sales team) |
| 6 | Analytics dashboard, PDF download tracking |
| 7 | User testing with 3-5 HVAC engineers for feedback |
| 8 | Production launch on ventra-leb.com |
