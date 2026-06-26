# Tech Stack Proposal: Vantra Lebanon Product Catalog Platform

> Generated 2026-06-24. Based on analysis of 170+ products across 10 brands, the client's requirement for an un-gated public catalog, and the need for non-technical data entry.

---

## 1. Problem Statement

### What the parent site (cmsglobal.com) gets wrong
1. **Product data is trapped in PDFs.** There is no structured product browsing. Users must download a multi-MB PDF, then manually search for their product. There are no filters, no comparison, no instant specs lookup.
2. **The site is slow.** The homepage took >60 seconds to load in automated testing (Playwright timeout). 7 JavaScript console errors on the homepage.
3. **No real product pages.** The "downloads" page is a flat list of PDF thumbnails with file sizes. There is no product detail view, no technical specs rendered in HTML, no search.
4. **Misleading UX copy.** The homepage says "Login with your credentials or Register yourself with us and get access to our product center" -- but the downloads page has *no actual login gate*. This language alone drives away potential customers who assume they need to register.
5. **Navigation is disorganized.** Product categories are mixed with corporate content. Air Filters, Air Outlets, HVAC Ducting, MEP Accessories, Flanges, Adhesive Tapes, and Laundry Solutions are all top-level nav items alongside About, Careers, and Blog.

### What ventra-leb.com currently is
A GoDaddy Website Builder placeholder showing "Website is currently under maintenance" with a basic contact form. No products, no catalog, no real content.

### The opportunity
Build a modern, blazing-fast catalog frontend that:
- Makes 170+ products instantly browsable and filterable by spec
- Renders technical data sheets inline (no PDF download required to see specs)
- Provides friction-free PDF download for those who want full catalogs
- Loads in under 2 seconds on a 3G connection
- Can be updated by a non-technical partner via a simple admin interface

---

## 2. Architecture Options Evaluated

### Option A: Headless CMS + Static Site Generator (SSG)

| Aspect | Detail |
|--------|--------|
| **CMS** | Sanity.io, Strapi, or Payload CMS |
| **Frontend** | Next.js (App Router) with static generation |
| **Hosting** | Vercel (frontend) + CMS cloud |
| **Search/Filter** | Client-side (Fuse.js or custom) or Algolia |
| **PDF Hosting** | Cloudflare R2 or S3 |

**Pros:**
- Pages pre-rendered at build time = sub-second loads
- CMS provides a visual editor -- non-technical partner can add/edit products
- Schema from `schema.json` maps directly to CMS content types
- Incremental Static Regeneration (ISR) means rebuilds only touch changed products
- Modern DX, excellent ecosystem, easy to iterate

**Cons:**
- Two systems to maintain (CMS + frontend)
- Build step adds complexity for updates (though ISR handles most cases)
- Monthly CMS costs (Sanity free tier covers this scale; Strapi can be self-hosted)

**Cost estimate:** $0-20/month (Vercel free tier + Sanity free tier covers ~170 products easily)

### Option B: Monolithic CMS (WordPress + Custom Theme)

| Aspect | Detail |
|--------|--------|
| **CMS** | WordPress with ACF Pro or Toolset |
| **Frontend** | Custom theme with PHP templates |
| **Hosting** | Traditional VPS (DigitalOcean, Hetzner) |
| **Search/Filter** | FacetWP or SearchWP plugin |
| **PDF Hosting** | WordPress Media Library |

**Pros:**
- Familiar to many developers
- All-in-one: CMS + frontend in one deployment
- Large plugin ecosystem for common needs

**Cons:**
- PHP rendering = slower page loads without heavy caching
- WordPress is the #1 target for web attacks -- ongoing security maintenance
- Plugin conflicts and update cycles
- Custom post types for 10+ product types becomes unwieldy
- The partner company used GoDaddy's website builder, suggesting they're already in a "simple hosting" mindset -- WordPress hosting adds complexity

**Cost estimate:** $10-30/month hosting + $100-200/year for premium plugins

### Option C: Pure Static Site (Astro / 11ty + JSON Data Files)

| Aspect | Detail |
|--------|--------|
| **Data** | JSON/YAML files in a git repo |
| **Frontend** | Astro 5 with static output |
| **Hosting** | Cloudflare Pages or Netlify |
| **Search/Filter** | Client-side (Pagefind or Fuse.js) |
| **PDF Hosting** | Same CDN, `/downloads/` directory |

**Pros:**
- Fastest possible: zero server, pure CDN-served HTML
- Simplest deployment: push to git = site updates
- Zero hosting cost (Cloudflare Pages free tier)
- Astro's island architecture ships near-zero JavaScript by default
- Security: no server to hack, no database to breach
- JSON data files match our schema.json directly

**Cons:**
- **Data entry requires editing JSON/YAML files** or using a git-based CMS (Decap CMS, Tina.io)
- "Non-technical partner" requirement means raw file editing is a dealbreaker
- Build step required for every content change
- No server-side features without adding an API

**Cost estimate:** $0/month (fully free-tier viable)

---

## 3. Recommendation: Option A -- Headless CMS + Next.js SSG

### Why this wins

| Requirement from Client Brief | How Option A Delivers |
|-------------------------------|----------------------|
| Remove gated catalog access | Public static pages, no login, no registration |
| Match CMS Global professional standard | Next.js + Tailwind = modern, polished UI |
| Non-technical data entry | Sanity Studio visual editor with custom product schemas |
| Constant stream of catalog data | Partner adds/edits in Sanity; ISR rebuilds in seconds |
| AI integration possibility | Sanity has a robust API; can add AI search/recommendation layer later |
| Filtration type categorization | Schema supports nested categories with faceted filtering |

### Specific Stack Recommendation

```
Frontend:     Next.js 15 (App Router, Static Export or ISR on Vercel)
CMS:          Sanity.io (free tier: 3 users, 500k API requests/month)
Styling:      Tailwind CSS 4
Search:       Pagefind (build-time search index, zero cost, works offline)
PDF hosting:  Cloudflare R2 (free tier: 10GB storage, 10M reads/month)
Deployment:   Vercel (free tier: 100GB bandwidth/month)
Domain:       ventra-leb.com (already owned)
Analytics:    Plausible or Umami (privacy-focused, no cookie banner needed)
```

### Why Sanity.io specifically (over Strapi, Payload, etc.)

1. **Structured Content.** Sanity's schema system is code-defined, matching our JSON schema approach. We define product types once; the Studio auto-generates the editing UI.
2. **Free tier is generous.** 3 editors, 500k API CDN requests/month, 20GB assets. More than enough for 170 products with PDFs.
3. **Real-time collaboration.** If the partner and you are both editing, you see each other's changes live.
4. **GROQ query language.** Powerful querying for faceted filtering without a separate search service.
5. **Portable Text.** Rich text fields that render to any frontend framework, no HTML lock-in.
6. **Image pipeline.** Automatic resizing, cropping, and format conversion (WebP/AVIF).

### CMS Schema Design (maps to our schema.json)

```
Sanity Document Types:
├── brand          → Brand definition (logo, tagline)
├── product        → Core product record
│   ├── category   → Reference to productCategory
│   ├── specs      → Polymorphic object (filterSpec | damperSpec | ...)
│   ├── variants[] → Array of size/model variants
│   ├── documents[]→ Array of {type, file} for TDS/Catalog PDFs
│   └── images[]   → Sanity image assets with metadata
├── productCategory→ Hierarchical taxonomy
└── certification  → Shared cert records referenced by products
```

### Why NOT Option C (Pure Static)

Option C is technically superior for performance and simplicity, but the client requirement is explicit: *"a constant stream of catalog data that can be uploaded or managed through the website backend."* Editing JSON files in a code editor is not a "backend" for a non-technical partner. Sanity Studio gives them a visual form-based editor that looks like a professional admin panel.

If budget or timeline becomes extremely tight, we can use **Astro + Tina.io** as a fallback -- Tina provides a visual editor backed by git. But Sanity's API-first approach is more robust for future needs (AI integration, mobile app, etc.).

---

## 4. Infrastructure Diagram

```
                    ┌─────────────┐
                    │  Partner     │
                    │  (Lebanon)   │
                    └──────┬──────┘
                           │ Edits products via
                           ▼
                    ┌─────────────┐
                    │  Sanity     │
                    │  Studio     │◄──── Custom schemas matching
                    │  (Hosted)   │      schema.json definitions
                    └──────┬──────┘
                           │ Webhook on publish
                           ▼
                    ┌─────────────┐
                    │  Vercel     │
                    │  Build/ISR  │──── Rebuilds only changed pages
                    └──────┬──────┘
                           │ Deploys to CDN
                           ▼
              ┌────────────────────────┐
              │    Vercel Edge CDN     │
              │  ventra-leb.com        │
              │                        │
              │  /                     │ ◄── Homepage
              │  /products/            │ ◄── Browsable catalog
              │  /products/air-filters │ ◄── Category pages
              │  /products/hepa-ht-900 │ ◄── Product detail pages
              │  /downloads/           │ ◄── PDF catalog library
              └────────────┬───────────┘
                           │
                           │ PDF links point to
                           ▼
              ┌────────────────────────┐
              │  Cloudflare R2         │
              │  (PDF/Asset storage)   │
              │  cdn.ventra-leb.com    │
              └────────────────────────┘
```

---

## 5. Data Entry Workflow

### For the non-technical partner

1. Go to `studio.ventra-leb.com` (or `ventra-leb.com/studio`)
2. Log in with email
3. Click "Products" > "Create New"
4. Fill form:
   - Select brand (dropdown: Excelair, Premier, etc.)
   - Select category (dropdown: Air Filters > HEPA Filters)
   - Enter product name, description, features (rich text)
   - Fill specification fields (type-specific form auto-renders based on category)
   - Upload images (drag & drop, auto-optimized)
   - Upload PDF documents (TDS, Catalog)
   - Check applicable certifications
5. Click "Publish"
6. Site rebuilds that product page in ~10 seconds via ISR

### For bulk initial data load

We will write a migration script that:
1. Reads the extracted product data from our analysis
2. Creates Sanity documents via the API
3. Uploads the existing PDF catalogs to Cloudflare R2
4. Links everything together

This avoids manual entry of 170+ products for the initial launch.

---

## 6. Performance Targets

| Metric | Target | How |
|--------|--------|-----|
| First Contentful Paint | < 1.0s | Static HTML, edge-served |
| Largest Contentful Paint | < 2.0s | Optimized images (WebP/AVIF via Sanity CDN) |
| Time to Interactive | < 2.5s | Minimal JS, progressive enhancement |
| Cumulative Layout Shift | < 0.05 | Proper image dimensions, font loading strategy |
| Lighthouse Score | 95+ | Static pages with optimized assets |
| PDF download start | < 500ms | CDN-served from R2, no auth/redirect |
| Search response | < 100ms | Client-side Pagefind index |

---

## 7. Cost Summary (Monthly)

| Service | Free Tier Limit | Expected Usage | Cost |
|---------|----------------|----------------|------|
| Vercel (hosting) | 100GB bandwidth | ~5-10GB | $0 |
| Sanity.io (CMS) | 3 users, 500k API/mo | ~10k API/mo | $0 |
| Cloudflare R2 (PDFs) | 10GB storage, 10M reads | ~2GB, ~5k reads | $0 |
| Domain (ventra-leb.com) | Already owned | - | $0 |
| **Total** | | | **$0/month** |

The entire platform runs within free tiers at this scale. Paid tiers would only be needed if traffic exceeds ~100k visits/month or the team grows beyond 3 editors.

---

## 8. Future Expansion Path

| Phase | Feature | Tech |
|-------|---------|------|
| MVP+1 | AI-powered product recommendation ("I need a filter for a 500 CFM hospital AHU") | Claude API + GROQ queries |
| MVP+2 | Multi-language support (Arabic, French for Lebanon market) | Sanity's i18n plugin + Next.js locale routing |
| MVP+3 | Online quote request with product selections | Sanity + serverless function + email |
| MVP+4 | 3D/AR product viewer for dampers and housings | Three.js or model-viewer web component |
| MVP+5 | CAD/BIM file downloads for engineers | Additional document types in schema |
