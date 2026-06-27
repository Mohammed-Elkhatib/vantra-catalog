# Vantra Lebanon — Product Catalog

An open, un-gated product catalog for **Vantra Lebanon** (`ventra-leb.com`), the Levant sister
company of CMS Global (Dubai). It sells medical-grade HVAC products — air filters, dampers, sound
attenuators, and coatings/adhesives/sealants — and lets engineers browse, filter, and download spec
sheets instantly, with no registration. It fixes the parent site's slow, gated, PDF-bound experience.

**Status:** demo-ready MVP. A curated, fact-checked dataset of **15 representative products** (of
~170 catalogued). No live backend yet — the contact form is a mock submit, and a CMS/AI are on the
roadmap, not in this build.

## Tech stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first: tokens via `@theme` in `globals.css`, no `tailwind.config.js`)
- **IBM Plex Sans / Mono** via `next/font`
- **lucide-react** icons · **Vitest** for tests
- Static JSON data layer (designed for a clean later swap to a headless CMS)

## Commands

```bash
npm install        # plain install (React 19 is stable; no --legacy-peer-deps)
npm run dev        # dev server on http://localhost:3000
npm run build      # production build + typecheck + lint (the main correctness gate)
npm run start      # serve the production build
npm run lint       # ESLint (next/core-web-vitals + next/typescript)
npm run test       # Vitest: unit + data-integrity tests
```

## Architecture

- **Data layer:** static JSON in `data/` (`products.json`, `brands.json`, `categories.json`).
  `src/lib/db.ts` is the only access path (server-only `fs` readers). `data/catalog.test.ts`
  enforces integrity (unique ids, resolvable brands/categories, files exist, honest counts,
  no reused certification numbers).
- **Types:** `src/types/catalog.ts` — `Product` plus a `ProductSpecification` discriminated union
  on `spec_type` (`filter | damper | sound_attenuator | coating`), mirroring
  `research_and_planning/schema.json`.
- **Logic (`src/lib`, all unit-tested):** `catalog-filter.ts` (filtering + faceting),
  `format.ts` (display formatters), `instruments.ts` (data-viz geometry), `seo.ts` (metadata + JSON-LD).
- **Design system ("Instrument"):** tokens in `src/app/globals.css` `@theme`; the signature visuals
  live in `src/components/instruments/` (efficiency curve, EN 1822 grade ladder, pressure gauge,
  octave-band bars, product glyphs). See `research_and_planning/DESIGN_STRATEGY.md`.
- **Routes:** `/` (home), `/products` (catalog, URL search params as state), `/products/[slug]`
  (SSG product pages), `/contact` (server page + client form). SEO: per-page metadata, JSON-LD,
  `sitemap.ts`, `robots.ts`.

## PDFs / downloads

Served statically from `public/downloads/`. Ungated by design. Source material is in `material/`.

## Project docs

`research_and_planning/` holds the business/industry context (`PROJECT_EXPLAINER.md`), the catalog
inventory (`CATALOG_DEEP_DIVE.md`), the competitor audit (`CMS_WEBSITE_AUDIT.md`), the design strategy
(`DESIGN_STRATEGY.md`), and the current build status (`BUILD_STATUS.md`).
