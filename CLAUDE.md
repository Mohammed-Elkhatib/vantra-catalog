# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A product catalog website for **Vantra Lebanon** (`ventra-leb.com`), the Levant sister company of
CMS Global (Dubai). It sells medical-grade HVAC products: air filters, dampers, sound attenuators,
and coatings/adhesives/sealants. The core goal is an **open, un-gated catalog** — engineers browse,
filter, and download spec sheets with no registration. It explicitly fixes the parent site's
PDF-bound, gated, slow experience.

Current state is a **demo-ready MVP**: a curated, fact-checked dataset of **15 representative products**
(of ~170 catalogued). No live backend yet — the contact form is a mock submit; a CMS and AI features are
roadmap, not built. Deep context lives in `research_and_planning/` (start with `PROJECT_EXPLAINER.md`,
`CLIENT_BRIEF.md`, `DESIGN_STRATEGY.md`, and `BUILD_STATUS.md`).

## Commands

- **Install:** `npm install` (plain; `--legacy-peer-deps` is no longer needed now that React 19 is stable).
- **Dev server:** `npm run dev` (port 3000, hot reload)
- **Production build + typecheck + lint:** `npm run build` (the main correctness gate)
- **Production server:** `npm run start`
- **Lint:** `npm run lint` (ESLint, `next/core-web-vitals` + `next/typescript`)
- **Tests:** `npm run test` (Vitest; unit + data-integrity under `src/**/*.test.ts` and `data/**/*.test.ts`)

## Architecture

- **Stack:** Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, IBM Plex via
  `next/font`, `lucide-react`, Vitest.
- **Tailwind v4** is CSS-first: `@import "tailwindcss";` + design tokens in an `@theme` block in
  `src/app/globals.css`, plus `@tailwindcss/postcss`. There is **no `tailwind.config.js`**.
- **`next.config.ts` is empty** (defaults only).

### Design system ("Instrument")
- Tokens are the single source of truth in `src/app/globals.css` `@theme`: colors `paper`, `ink`,
  `steel`, `rule`, `signal` (instrument-red, **indicator only, never a fill**), `carbon`; fonts wired in
  `src/app/fonts.ts` (Plex Sans → `--font-sans`, Plex Mono → `--font-mono`). Re-skin here first.
- Signature visuals in `src/components/instruments/`: `EfficiencyCurve`, `GradeLadder`, `PressureGauge`,
  `OctaveBands`, `ProductGlyph` — all server components driven by pure geometry in `src/lib/instruments.ts`.
- Rationale and the anti-"AI-slop" rules: `research_and_planning/DESIGN_STRATEGY.md`.

### Data layer (the "database")
- Static JSON under `data/`: `products.json` (15 products), `brands.json` (2 brands: excelair, premier),
  `categories.json` (4 categories). `data/catalog.test.ts` enforces integrity (unique ids, resolvable
  brands/categories, referenced files exist, honest counts, no certification-number reuse across categories).
- `src/lib/db.ts` is the **only** data access path: server-side `fs/promises` readers
  (`getProducts`, `getProductById`, `getBrands`, `getCategories`). Server-only; never import into a client
  component. The `Brand` and `Category` interfaces are defined here, **not** in `catalog.ts`.
- `src/types/catalog.ts` defines `Product` and the `ProductSpecification` **discriminated union** keyed on
  `spec_type`: `'filter' | 'damper' | 'sound_attenuator' | 'coating'`. Always switch on `spec_type` first.
  Mirrors `research_and_planning/schema.json` 1:1 for a clean later CMS import.
- `Product.metadata` is an **internal, never-rendered** provenance block (`verification_status`, `source_pdf`,
  `notes`, …). Six filters whose individual TDS was never provided carry
  `metadata.verification_status: "representative_pending_tds"`; a `catalog.test.ts` guard forbids a pending-TDS
  product from linking a `technical_data_sheet`. Provenance/findings live in `research_and_planning/DATA_VERIFICATION.md`.

### Logic layer (`src/lib`, all unit-tested)
- `catalog-filter.ts` — pure `filterProducts` + `computeFacetCounts` (one shared `matchesSearch`, so counts
  and results never disagree). The `/products` page consumes this; do not reinline filtering.
- `format.ts` — `formatFileSize`, `humanizeEnum` (uses `replaceAll`).
- `instruments.ts` — geometry for the signature visuals.
- `seo.ts` — `buildProductMetadata`, `buildListingMetadata`, `buildProductJsonLd`.

### Routes (`src/app/`)
- `/` (`page.tsx`) — homepage. Server, `revalidate = 3600`. Hero signature is an `EfficiencyCurve`.
- `/products` (`products/page.tsx`) — catalog listing. `revalidate = 0` (dynamic on search params).
  Filtering/faceting delegated to `src/lib/catalog-filter`; `FilterSidebar` renders the counts.
- `/products/[slug]` — product detail. **SSG** via `generateStaticParams`; `generateMetadata` per product;
  injects JSON-LD. `slug === product.id`, `notFound()` on miss. Renders specs (with wired instruments),
  variant table, and model decoder conditionally.
- `/contact` — **server page** that reads product names from `db` and passes them to the client
  `ContactForm` (`src/components/ContactForm.tsx`). Mock submit (setTimeout); reads `?product=` to prefill.
- SEO files: `sitemap.ts`, `robots.ts`; `metadataBase` + OpenGraph defaults in `layout.tsx`.

### Listing state — URL search params are the single source of truth
Multi-value facets are **comma-separated**. Keys: `search`, `category`, `brand`, `en1822`, `fireRating`,
`leakageClass`, `cert`. `category` matches the product's `category` **name**; `brand` matches `brand_id`.
Spec facets only match products whose `spec_type` carries that field. Counts are faceted (available under
each option given the *other* active filters).

### Client vs server components
Server by default. The only `"use client"` files: `FilterSidebar`, `SearchInput`, `SelectionTable`,
`ContactForm`. Everything else (pages, `DynamicSpecs`, `ModelDecoder`, `ProductCard`, instruments) is server.

- `FilterSidebar.tsx` — toggles facets via `router.push` + `useTransition`. **Gotcha:** the spec-facet
  option lists are curated constants at the top of the file (`EN1822_OPTIONS`, `FIRE_RATING_OPTIONS`,
  `LEAKAGE_OPTIONS`, `CERT_OPTIONS`). New data values won't appear as filters until added there. A facet
  section is hidden when its count map is empty.
- `SearchInput.tsx` — 300ms debounce, writes/clears `?search`.
- `SelectionTable.tsx` — **searchable/filterable** grid of `product.variants` (not sortable).
- `DynamicSpecs.tsx` — renders a spec table by `spec_type` and wires the instrument visuals.

### PDFs / downloads
Served statically from `public/downloads/{tds,catalogs}/`, referenced via each product's `documents[].url`.
Source PDFs are in `material/` (not served). Ungated by design.

## Next.js 15 gotchas
- `params` and `searchParams` are **Promises**; `await` them.
- Any component using `useSearchParams()` must sit under a `<Suspense>` boundary (see `contact/page.tsx`).

## Definition of done for changes here
When editing the data shape, keep these in sync: `src/types/catalog.ts`, `research_and_planning/schema.json`,
the JSON in `data/`, and the curated facet option lists in `FilterSidebar.tsx`. Run `npm run test` and
`npm run build` before claiming done.

## Roadmap
1. Expand `data/products.json` toward the ~170 items in `CATALOG_DEEP_DIVE.md`.
2. Wire a headless CMS (Sanity): convert `catalog.ts` types to schema, bulk-import `data/`, replace the
   `db.ts` fs readers with GROQ. The schema is structured to make this a clean swap.
3. Real contact backend (email/CRM, validation, spam protection); optional AI search/assistant.
