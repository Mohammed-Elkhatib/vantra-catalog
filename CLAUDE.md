# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A product catalog website for **Vantra Lebanon** (`ventra-leb.com`), the Levant sister company of
CMS Global (Dubai). It sells medical-grade HVAC products: air filters, dampers, sound attenuators,
and coatings/adhesives/sealants. The core goal is an **open, un-gated catalog** — engineers browse,
filter, and download spec sheets with no registration. It explicitly fixes the parent site's
PDF-bound, gated, slow experience.

Current state is an **MVP prototype**: a static mock dataset of **15 representative products**
(of ~170 catalogued). It is pre-production, with no backend, auth, or live form submission.
Deep business/industry/product context lives in `research_and_planning/` (start with
`PROJECT_EXPLAINER.md` and `SESSION_LOG.md`); `research_and_planning/CLIENT_BRIEF.md` has the original brief.

## Commands

- **Install:** `npm install --legacy-peer-deps` — the `--legacy-peer-deps` flag is **required** (React 19 peer-dep ranges).
- **Dev server:** `npm run dev` (port 3000, hot reload)
- **Production build + typecheck:** `npm run build` (also fails on TS or ESLint errors; this is the main correctness gate)
- **Production server:** `npm run start`
- **Lint:** `npm run lint`
- **Tests:** none configured. There is no test runner; `npm run build` is the only automated verification.

## Architecture

- **Stack:** Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, `lucide-react` icons.
- **Tailwind v4** is CSS-first: configured via `@import "tailwindcss";` in `src/app/globals.css` plus
  `@tailwindcss/postcss` in `postcss.config.mjs`. There is **no `tailwind.config.js`**. UI palette is sky-600 accent on slate neutrals.
- **`next.config.ts` is empty** (defaults only).

### Data layer (the "database")
- Static JSON under `data/`: `products.json` (15 products), `brands.json` (5 brands: excelair, premier,
  durotape, duraflex, durodyne), `categories.json` (5 categories).
- `src/lib/db.ts` is the **only** data access path: server-side `fs/promises` readers
  (`getProducts`, `getProductById`, `getBrands`, `getCategories`). It is server-only; never import it
  into a client component. The `Brand` and `Category` interfaces are defined here, **not** in `catalog.ts`.
- `src/types/catalog.ts` defines `Product` and the `ProductSpecification` **discriminated union** keyed on
  `spec_type`: `'filter' | 'damper' | 'sound_attenuator' | 'coating'`. When narrowing specs, always switch on
  `spec_type` first. These types mirror `research_and_planning/schema.json` 1:1, by design, so the data can
  later be imported into a CMS cleanly (see Roadmap).

### Routes (`src/app/`)
- `/` (`page.tsx`) — marketing homepage. Server component, `revalidate = 3600`.
- `/products` (`products/page.tsx`) — catalog listing. `revalidate = 0` (dynamic on search params).
  **All filtering and faceting happens server-side here**, then `FilterSidebar` renders the computed counts.
- `/products/[slug]` (`products/[slug]/page.tsx`) — product detail. `slug === product.id`. `revalidate = 3600`,
  `notFound()` on miss. Renders specs, variant table, and model decoder conditionally on the product's fields.
- `/contact` (`contact/page.tsx`) — inquiry form. Client component; **mock submit only** (setTimeout, no network).
  Reads `?product=` to prefill; the product `<select>` options are **hardcoded** in this file.

### Listing state — URL search params are the single source of truth
The `/products` page derives everything from the URL query string. Multi-value facets are
**comma-separated** strings. The keys are:
`search`, `category`, `brand`, `en1822`, `fireRating`, `leakageClass`, `cert`.

- `category` matches against the product's `category` **name** string; `brand` matches `brand_id`.
- Spec facets (`en1822`, `fireRating`, `leakageClass`) only match products whose `spec_type` carries that field.
- The page computes faceted counts (count available under each option given the *other* active filters) and
  passes them to `FilterSidebar`.

### Client vs server components
Server by default. The only `"use client"` files are: `FilterSidebar`, `SearchInput`, `SelectionTable`,
and the contact page. Keep data reads and filtering on the server; client components only manipulate the URL.

- `FilterSidebar.tsx` — toggles facets by pushing updated query params (`router.push`, `useTransition`).
  **Gotcha:** the option lists are hardcoded (`["E12","H13","H14"]`, fire ratings `[1.5, 3]`, leakage
  `["I","II","III"]`, certs `["UL","ETL","AMCA","BSRIA","IFC"]`). New data values won't appear as filters
  until added here. A facet section is hidden entirely when its count map is empty.
- `SearchInput.tsx` — 300ms debounce, writes/clears `?search`.
- `DynamicSpecs.tsx` — server; renders a spec table chosen by `spec_type`.
- `SelectionTable.tsx` — sortable/searchable grid of `product.variants`.
- `ModelDecoder.tsx` — server; explains `product.model_numbering_scheme` block-by-block.
- `ProductCard.tsx` — server; grid card with quick specs and PDF buttons.

### PDFs / downloads
Served statically from `public/downloads/tds/` and `public/downloads/catalogs/`, referenced via each
product's `documents[].url`. Source PDFs are in `material/` (not served). Downloads are intentionally ungated.

## Next.js 15 gotchas
- `params` and `searchParams` are **Promises**; `await` them (see existing pages for the pattern).
- Any component using `useSearchParams()` must sit under a `<Suspense>` boundary (see `contact/page.tsx`).

## Definition of done for changes here
When editing the data shape, keep these in sync: `src/types/catalog.ts`, `research_and_planning/schema.json`,
the JSON in `data/`, and the hardcoded facet/option lists in `FilterSidebar.tsx` and `contact/page.tsx`.
Run `npm run build` to confirm types and lint pass before claiming done.

## Roadmap (per `research_and_planning/SESSION_LOG.md`)
1. Expand `data/products.json` from 15 toward the ~170 items in `CATALOG_DEEP_DIVE.md`.
2. Wire a headless CMS (Sanity): convert `catalog.ts` types to Sanity schema, bulk-import `data/products.json`,
   then replace the `src/lib/db.ts` fs readers with GROQ queries. The schema is structured to make this a clean swap.
