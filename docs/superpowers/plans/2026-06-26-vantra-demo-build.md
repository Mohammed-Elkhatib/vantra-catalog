# Vantra Catalog Demo Build Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing draft into a credible, demo-ready MVP of the Vantra catalog: correct data, the "Instrument" design system, and the SEO that is the product's core value proposition.

**Architecture:** Keep the existing Next.js 15 App Router + static-JSON architecture. Add a thin tested logic layer (`src/lib`) for filtering, formatting, SEO, and instrument geometry so presentation stays dumb and swappable. Centralize all visual decisions in design tokens (Tailwind v4 `@theme` + `next/font`) so the design can be re-skinned cheaply after client feedback.

**Tech Stack:** Next.js 15.5, React 19.2, TypeScript (strict), Tailwind CSS v4, lucide-react, IBM Plex Sans/Mono via `next/font/google`, Vitest (new, dev-only) for unit/data tests.

## Global Constraints

- Node 22; install with plain `npm install` (React 19 is stable; `--legacy-peer-deps` no longer required — verify in Task 1).
- Only one new dependency permitted: `vitest` (dev). Flag any other before adding.
- All internal navigation uses `next/link`, never raw `<a>` (lint rule `@next/next/no-html-link-for-pages` must pass).
- Every visual value (color, font, radius, spacing scale) comes from a token, never a hardcoded hex in a component. Tokens defined once in `src/app/globals.css` `@theme` and `src/app/fonts.ts`.
- Design tokens (verbatim from `research_and_planning/DESIGN_STRATEGY.md`): Paper `#F6F7F9`, Ink `#15181C`, Steel `#5B636E`, Rule `#E3E5E8`, Instrument Red `#D6321E` (indicator only, never a fill), Carbon `#0B0C0E`. Display+body = IBM Plex Sans; data/utility = IBM Plex Mono (tabular numerals).
- Quality floor on every page: responsive to mobile, visible keyboard focus, `prefers-reduced-motion` respected, real copy (no lorem).
- Work on a branch `feat/demo-build`, not `main`. Commit after every task. Push at phase boundaries.
- `npm run build` and `npm run lint` must pass at the end of every phase.

---

## File Structure

**New:**
- `src/app/fonts.ts` — IBM Plex Sans/Mono via `next/font/google`, exported font vars.
- `src/lib/format.ts` (+ `.test.ts`) — `formatFileSize`, `humanizeEnum` (replaceAll-based), unit helpers.
- `src/lib/catalog-filter.ts` (+ `.test.ts`) — pure `filterProducts` + `computeFacetCounts`.
- `src/lib/instruments.ts` (+ `.test.ts`) — pure geometry: efficiency curve points, grade-ladder index, gauge angle, octave-band heights.
- `src/lib/seo.ts` (+ `.test.ts`) — `buildProductMetadata`, `buildListingMetadata`, `buildProductJsonLd`.
- `src/lib/catalog.test.ts` — data-integrity tests over `data/*.json`.
- `src/components/instruments/{EfficiencyCurve,GradeLadder,PressureGauge,OctaveBands,ProductGlyph}.tsx` — presentational, token-driven.
- `src/app/sitemap.ts`, `src/app/robots.ts` — Next file conventions.
- `vitest.config.ts`, test setup.

**Modified:**
- `data/products.json`, `data/categories.json`, `data/brands.json` — credibility fixes.
- `src/app/globals.css` — `@theme` tokens, base, focus, reduced-motion.
- `src/app/layout.tsx` — fonts, restyle chrome, metadata base.
- `src/app/page.tsx`, `src/app/products/page.tsx`, `src/app/products/[slug]/page.tsx`, `src/app/contact/page.tsx` — redesign + `Link` + a11y.
- `src/components/{ProductCard,FilterSidebar,SearchInput,DynamicSpecs,SelectionTable,ModelDecoder}.tsx` — restyle, consume tokens/instruments, fix unused imports.
- `README.md`, `CLAUDE.md`, `research_and_planning/SESSION_LOG.md` — truthful updates (definition of done).

---

## Phase 0: Tooling and tokens (foundation)

### Task 1: Verify clean install and add Vitest

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Confirm a clean install works without legacy flag**

Run: `rm -rf node_modules package-lock.json && npm install`
Expected: succeeds with no peer-dep error. If it fails, restore with `npm install --legacy-peer-deps` and note it in the commit; otherwise the flag is gone for good.

- [ ] **Step 2: Add Vitest (dev) and scripts**

Run: `npm install -D vitest@^2`
Then edit `package.json` scripts to add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "data/**/*.test.ts"],
  },
  resolve: {
    // fileURLToPath gives a correct Windows path (avoids the leading-slash `/C:/...` bug)
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
```

- [ ] **Step 4: Smoke test the runner**

Create a temporary `src/lib/smoke.test.ts` with `import {test,expect} from "vitest"; test("ok",()=>expect(1).toBe(1));`
Run: `npm test`
Expected: 1 passing. Then delete `smoke.test.ts`.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "build: add vitest test runner; verify clean install"
```

### Task 2: Design tokens and fonts

**Files:**
- Create: `src/app/fonts.ts`
- Modify: `src/app/globals.css`, `src/app/layout.tsx`

**Interfaces:**
- Produces: CSS custom properties `--color-paper|ink|steel|rule|signal|carbon`, Tailwind utilities `bg-paper text-ink border-rule text-signal` etc.; font CSS vars `--font-sans`, `--font-mono` applied on `<body>`.

- [ ] **Step 1: Create `src/app/fonts.ts`**

```ts
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";

export const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});
```

- [ ] **Step 2: Define tokens in `src/app/globals.css`**

Replace the file with the token system (Tailwind v4 `@theme`), base styles, focus ring, and reduced-motion:
```css
@import "tailwindcss";

@theme {
  --color-paper: #f6f7f9;
  --color-ink: #15181c;
  --color-steel: #5b636e;
  --color-rule: #e3e5e8;
  --color-signal: #d6321e;
  --color-carbon: #0b0c0e;
  --font-sans: var(--font-plex-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-plex-mono), ui-monospace, monospace;
  --radius-sm: 3px;
}

@layer base {
  body { @apply bg-paper text-ink font-sans antialiased; }
  *:focus-visible { outline: 2px solid var(--color-signal); outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; transition: none !important; }
  }
}
```
Note: `next/font` exposes the CSS var named by its `variable:` option (`--font-plex-sans` / `--font-plex-mono`), which the `@theme` block above maps into the Tailwind `--font-sans` / `--font-mono` tokens. Keep those names in sync with `fonts.ts`.

- [ ] **Step 3: Apply fonts in `src/app/layout.tsx`**

Add `className={\`${plexSans.variable} ${plexMono.variable}\`}` to `<html>` and keep base body classes from globals. Import from `./fonts`.

- [ ] **Step 4: Verify build and visual baseline**

Run: `npm run build` — Expected: success.
Run dev, screenshot `/` — confirm Plex fonts load and background is paper, not white. (Visual check; styling is incomplete here — only verifying tokens/fonts apply.)

- [ ] **Step 5: Commit**

```bash
git add src/app/fonts.ts src/app/globals.css src/app/layout.tsx
git commit -m "feat: add Instrument design tokens and IBM Plex fonts"
```

---

## Phase 1: Data integrity (bulletproof the catalog)

### Task 3: Data-integrity test (write failing first)

**Files:**
- Create: `src/lib/catalog.types.ts` (re-export of allowed enums for tests if needed), `data/catalog.test.ts`

**Interfaces:**
- Consumes: `data/products.json`, `data/categories.json`, `data/brands.json`, `src/types/catalog.ts`.

- [ ] **Step 1: Write the failing integrity test**

```ts
import { test, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import products from "../data/products.json";
import categories from "../data/categories.json";
import brands from "../data/brands.json";

const pub = (u: string) => path.join(process.cwd(), "public", u.replace(/^\//, ""));

test("product ids are unique", () => {
  const ids = products.map((p: any) => p.id);
  expect(new Set(ids).size).toBe(ids.length);
});

test("every brand_id and category resolves", () => {
  const brandIds = new Set(brands.map((b: any) => b.id));
  const catNames = new Set(categories.map((c: any) => c.name));
  for (const p of products as any[]) {
    expect(brandIds.has(p.brand_id)).toBe(true);
    expect(catNames.has(p.category)).toBe(true);
  }
});

test("every referenced document file exists in public/", () => {
  for (const p of products as any[])
    for (const d of p.documents ?? [])
      expect(fs.existsSync(pub(d.url)), `${d.url} missing`).toBe(true);
});

test("category product_count matches actual product count", () => {
  for (const c of categories as any[]) {
    const actual = (products as any[]).filter((p) => p.category === c.name).length;
    expect(c.product_count, `${c.name}`).toBe(actual);
  }
});

test("a UL listing number is never shared across different categories", () => {
  const byNumber = new Map<string, Set<string>>();
  for (const p of products as any[])
    for (const c of p.certifications ?? [])
      if (c.listing_number) {
        const s = byNumber.get(c.listing_number) ?? new Set();
        s.add(p.category);
        byNumber.set(c.listing_number, s);
      }
  for (const [num, cats] of byNumber)
    expect(cats.size, `listing ${num} reused across ${[...cats]}`).toBe(1);
});

test("solvent-based products do not claim zero flame spread", () => {
  for (const p of products as any[]) {
    const s = p.specifications;
    if (s.spec_type === "coating" && /solvent/i.test(s.base_material ?? "") && s.flame_spread_index === 0)
      throw new Error(`${p.id}: solvent base with flame_spread_index 0 is implausible`);
  }
});
```

- [ ] **Step 2: Run and confirm failures**

Run: `npm test -- data/catalog.test.ts`
Expected: FAIL on category counts (47 vs 8 etc.), UL reuse (R-27945 across Air Filters/Dampers/Coatings), and the solvent flame-spread check (81-10).

### Task 4: Fix the data to pass integrity

**Files:**
- Modify: `data/products.json`, `data/categories.json`, `data/brands.json`

- [ ] **Step 1: Reconcile category counts** — set each `product_count` to the actual number of demo products in that category. Remove the `Air Outlets & Accessories` category (zero products) OR keep it only if you add ≥1 real product; for the demo, remove it from `categories.json` and drop the matching `category` union usage note. Decide and apply.
- [ ] **Step 2: Remove brands with zero products** (`durotape`, `duraflex`, `durodyne`) from `brands.json`, OR add one representative product each. For a bulletproof demo, remove them so the "Authorized Brands" and brand facet never show empties.
- [ ] **Step 3: Fix UL listing numbers** — `R-27945` is the Premier coatings listing; keep it ONLY on Premier coating products. For the HEPA filter and dampers, replace with category-appropriate values or drop `listing_number` and keep `type`/`standard` (e.g., dampers cite `UL 555`/`UL 555S` standard without borrowing the coatings number). Verify against the source PDFs in `material/` where possible; if unverifiable, omit the number rather than invent one.
- [ ] **Step 4: Fix the 81-10 adhesive contradiction** — a solvent polychloroprene adhesive with VOC 450 and flash point −20 °C should not show `flame_spread_index: 0`. Either remove the flame-spread/smoke fields and the "UL Classified index of 0" feature line, or reclassify accurately per the source TDS. Keep the entry internally consistent.
- [ ] **Step 5: Run integrity test to green**

Run: `npm test -- data/catalog.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add data/ src/lib/catalog.types.ts data/catalog.test.ts
git commit -m "fix(data): correct UL numbers, counts, adhesive specs; add integrity tests"
```

---

## Phase 2: Tested logic layer

### Task 5: Extract pure filter + facet logic

**Files:**
- Create: `src/lib/catalog-filter.ts`, `src/lib/catalog-filter.test.ts`
- Modify: `src/app/products/page.tsx` (consume the module)

**Interfaces:**
- Produces:
  - `type CatalogFilters = { search?: string; category?: string[]; brand?: string[]; en1822?: string[]; fireRating?: string[]; leakageClass?: string[]; cert?: string[] }`
  - `filterProducts(products: Product[], f: CatalogFilters): Product[]`
  - `computeFacetCounts(products: Product[], f: CatalogFilters): FacetCounts` where the search predicate is identical to the one in `filterProducts` (fixes the current name+desc-only mismatch).

- [ ] **Step 1: Write failing tests** — cover: search matches across name/description/type/subcategory/features identically in filter and facet pass; multi-value category/brand; spec facets only match the right `spec_type`; facet count for a facet excludes that facet's own active selection. (Write concrete cases against 3-4 fixture products defined inline.)
- [ ] **Step 2: Run, confirm fail** (`npm test -- catalog-filter`).
- [ ] **Step 3: Implement** `filterProducts` and `computeFacetCounts`, sharing one `matchesSearch(product, q)` helper.
- [ ] **Step 4: Run to green.**
- [ ] **Step 5: Refactor `products/page.tsx`** to import and use these; delete the inline duplicated logic. Run `npm run build`.
- [ ] **Step 6: Commit** (`refactor(catalog): extract tested filter/facet logic, fix count mismatch`).

### Task 6: Formatting helpers

**Files:** Create `src/lib/format.ts`, `src/lib/format.test.ts`; modify components that hardcode formatting.

**Interfaces:** `formatFileSize(kb?: number): string` (e.g., 4470 -> "4.5 MB", undefined -> "PDF"); `humanizeEnum(s?: string): string` (replaceAll `_`->space, title-case) replacing the buggy `.replace("_"," ")`.

- [ ] Steps: failing test (incl. `fire_smoke` -> "Fire Smoke", multi-underscore) -> fail -> implement with `replaceAll` -> green -> swap usages in `DynamicSpecs.tsx`, `ProductCard.tsx`, detail page -> build -> commit.

---

## Phase 3: Instrument signature components

### Task 7: Instrument geometry (pure, tested)

**Files:** Create `src/lib/instruments.ts`, `src/lib/instruments.test.ts`.

**Interfaces:**
- `efficiencyCurvePoints(opts:{width:number;height:number}): string` — SVG path with a valley at the MPPS x-position (~mid), endpoints higher than the valley. Test: valley y > endpoint y (lower efficiency = higher y in SVG coords) and path is non-empty.
- `gradeLadderIndex(grade: string, scale?: string[]): number` — index of grade in `["E12","H13","H14","U15","U16"]`; `-1` if absent. Test exact indices.
- `gaugeAngle(value:number, min:number, max:number): number` — maps to −90..+90 degrees, clamps out-of-range. Test endpoints and clamp.
- `octaveBandHeights(loss: Record<string,number>, maxPx:number): {hz:string;px:number}[]` — normalized bar heights. Test ordering by frequency and max maps to maxPx.

- [ ] Steps: failing tests -> fail -> implement -> green -> commit (`feat(instruments): tested geometry helpers`).

### Task 8: Instrument + glyph components

**Files:** Create `src/components/instruments/{EfficiencyCurve,GradeLadder,PressureGauge,OctaveBands,ProductGlyph}.tsx`.

- `EfficiencyCurve` — renders the curve via `efficiencyCurvePoints`, red dot/dashed marker at MPPS, mono axis labels. Props: efficiency %, optional animate (respects reduced-motion).
- `GradeLadder` — EN 1822 scale with the active grade marked by a red triangle needle (replaces the candy pill). Props: `grade`.
- `PressureGauge` — minimal Magnehelic-style arc using `gaugeAngle`. Props: value, min, max, unit.
- `OctaveBands` — bar chart from `octaveBandHeights`. Props: `insertion_loss_db`.
- `ProductGlyph` — token-colored SVG motif per `product_type` (pleated filter, damper blades, silencer baffles, coating drum) so cards/detail have on-brand imagery without stock photos. Props: `product_type`, `size`.

- [ ] Steps per component: build the component using only tokens; render in an isolated dev route or Storybook-free quick page is NOT added (YAGNI) — instead verify by temporarily importing into the detail page and screenshotting. Confirm `npm run build` + visual. Commit after the set (`feat(instruments): curve, ladder, gauge, bands, glyph components`).

---

## Phase 4: Redesign into the Instrument system

> Verification for this phase is `npm run build` + `npm run lint` (zero errors) + visual screenshots at 1440px and 390px. Each task replaces hardcoded styles with tokens, swaps raw `<a>`->`Link`, adds `aria-label` to icon-only controls, and removes unused imports.

### Task 9: App chrome (layout, header, footer)
**Files:** Modify `src/app/layout.tsx`. Header with Plex wordmark, mono nav, hairline rules; footer. All nav via `Link`. Replace the "Privacy Policy `#`" dead link with a real `/` anchor or remove. Commit.

### Task 10: Catalog listing + cards + filter rail
**Files:** Modify `src/app/products/page.tsx`, `src/components/ProductCard.tsx`, `src/components/FilterSidebar.tsx`, `src/components/SearchInput.tsx`. Cards use `ProductGlyph` + `GradeLadder`/mono specs (no pill). Honest counts. Fix `group-hover` (add `group` to card root). Drive facet option lists from the data/brands/categories where feasible instead of hardcoded arrays; where a curated subset is intentional, document it in a comment. `Link` + a11y. Build/lint/visual. Commit.

### Task 11: Product detail (the crown jewel)
**Files:** Modify `src/app/products/[slug]/page.tsx`, `src/components/DynamicSpecs.tsx`, `src/components/SelectionTable.tsx`, `src/components/ModelDecoder.tsx`. Specs rendered as instruments: `EfficiencyCurve` for HEPA, `PressureGauge` for ΔP, `OctaveBands` for attenuators, `GradeLadder` for classification. Rename SelectionTable to reflect it filters (or add real column sort to match the "sortable" claim — pick one and make docs honest). `Link` back-nav. Build/lint/visual. Commit.

### Task 12: Home + contact
**Files:** Modify `src/app/page.tsx`, `src/app/contact/page.tsx`. Home hero thesis = the physics (an `EfficiencyCurve` or airflow motif) + value prop; category entry with honest counts; brands section reflects only real brands. Fix the unescaped apostrophe. Contact: keep mock submit, add inline validation messaging in the interface voice, generate the product `<option>` list from data (no hardcoded list). Build/lint/visual. Commit.

---

## Phase 5: SEO (the actual value proposition)

### Task 13: Metadata + JSON-LD builders (tested)
**Files:** Create `src/lib/seo.ts`, `src/lib/seo.test.ts`.
**Interfaces:** `buildProductMetadata(p): Metadata` (unique title `"<name> — <category> | Vantra Lebanon"`, description from product), `buildListingMetadata(filters)`, `buildProductJsonLd(p, brand): object` (schema.org `Product` with `additionalProperty` for specs, brand, category).
- [ ] Steps: failing tests (unique titles per product; JSON-LD has `@type:"Product"`, name, brand) -> fail -> implement -> green -> commit.

### Task 14: Wire metadata, JSON-LD, SSG, sitemap, robots
**Files:** Modify `src/app/products/[slug]/page.tsx` (export `generateMetadata` + `generateStaticParams`; inject JSON-LD `<script type="application/ld+json">`), `src/app/products/page.tsx` (`generateMetadata`), create `src/app/sitemap.ts` and `src/app/robots.ts`. Add `metadataBase` + OpenGraph defaults in `layout.tsx`.
- [ ] Verify: `npm run build` shows `/products/[slug]` as ○ (SSG) not ƒ; built HTML has per-product `<title>` and JSON-LD; `/sitemap.xml` and `/robots.txt` resolve in dev. Commit (`feat(seo): per-page metadata, JSON-LD, SSG product pages, sitemap, robots`).

---

## Phase 6: Verification and docs

### Task 15: Full verification pass
- [ ] Run `npm test` (all green), `npm run lint` (zero errors), `npm run build` (success, product pages static).
- [ ] Visual pass: home, catalog (with active filters), one of each product type's detail page, contact — at 1440px and 390px. Capture screenshots to the scratchpad for review.
- [ ] Accessibility spot-check: keyboard-tab through catalog filters and a detail page; confirm focus ring visible and download/icon controls have labels.

### Task 16: Truthful docs (definition of done)
**Files:** Modify `README.md` (remove overstated "0 lint errors / 100% benchmarks"; reflect real state, Vitest, SEO), `CLAUDE.md` (add tokens, instruments, lib layer, test command, SEO), `research_and_planning/SESSION_LOG.md` (append a dated entry for this build).
- [ ] Commit (`docs: update README/CLAUDE/SESSION_LOG to match the build`).

### Task 17: Merge
- [ ] Open PR from `feat/demo-build` to `main` via `gh pr create` (or fast-forward merge if solo), push. Confirm CI-less build passes locally before merge.

---

## Notes for the implementer

- This is a client **demo**; the design may be redirected after the meeting. That is why all visual decisions live in tokens (Task 2) and presentation is kept thin over a tested logic layer — a re-skin should touch tokens + components, not logic or data.
- Do not invent technical certification data. When a source value can't be verified in `material/`, omit the field rather than fabricate (credibility with HVAC engineers is the whole point).
- Follow `research_and_planning/DESIGN_STRATEGY.md` for every aesthetic choice and the anti-"AI-slop" rules.
