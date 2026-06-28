# Build Status & Handoff: Vantra Catalog Demo

**Living document.** This is the single place to resume from if the conversation context is lost.
Last updated: 2026-06-28. **Status: all six phases complete; `feat/demo-build` merged to `main`.**
Data-verification epic also done (fixes applied; see the 2026-06-28 note below). 24 tests pass, lint clean,
build green, responsive verified.

**2026-06-28 - CMS Global audit re-verified.** The competitor audit in `CMS_WEBSITE_AUDIT.md` was
independently re-checked against the live site (real browser: network, console, headers, computed styles).
The thesis holds, but several Part A specifics were wrong (lightcase is 503 not 404; "60s load" was a test
artifact, real load ~5.5s; no file-size bug; "7 JS errors" overstated; cert table partly invented; search
works with 9 results). New, stronger findings: EOL **PHP 5.6.40**, **zero security headers**, jQuery loaded
3x, `node_modules/` shipped to production, dead Universal Analytics, GoDaddy hosting. See the doc's **Part B**
for the corrected, pitch-safe talking points. This is research only; no code or data changed.

**2026-06-28 - CMS Global profiler pass (Core Web Vitals + Lighthouse + memory).** Closed the last public-site
gaps with Chrome DevTools: a perf trace, a Lighthouse audit, and a heap snapshot. Field CWV confirm the slow load
(LCP 5.5s / TTFB 1.9s, both Poor; INP/CLS Good). Root cause: a render-blocking **404** on `lightcase.css` (~2.3s in
the critical path) + 23 unbundled render-blocking head resources. jQuery 3x proven at runtime (1.12.4 + 2.2.4 + 3.2.1);
`node_modules/` served to prod (4 carousel libs). Lighthouse: A11y 77, SEO 85, Best Practices 96, **Agentic Browsing 4**;
8 fails (no `<main>`, 5 unnamed links, 5/6 imgs no alt, no meta description, contrast, malformed a11y tree, console errors).
Refined Part B: it's **2 real JS exceptions + 404s**, not "1 error." Explicitly clean: memory (9.7MB heap), DOM (~600 nodes),
transport (HTTP/2 + gzip + 30-day cache). 8 cookies, no consent (GDPR gap). Full detail in `CMS_WEBSITE_AUDIT.md` **B.8**.
The website-audit epic is now closed end to end; nothing material left unmeasured on the public site.

**2026-06-28 - Catalog data cross-checked vs source PDFs + site.** Verified `data/products.json` against the
`material/` datasheets and the live catalog. Findings in `research_and_planning/DATA_VERIFICATION.md`. Verdict:
data is genuinely sourced (real models/specs/certs; the shared UL R-27945 across Premier products is legitimate),
but has fixable errors. **High-priority fixes (not yet applied):** (1) `premier-81-10-ul` is mischaracterized as a
solvent/high-VOC non-certified adhesive, when the datasheet says UL-listed (R-27945), fire-resistant, flame/smoke 0
- add the cert, drop the solvent/VOC framing, fix solid/shelf-life/flash; (2) `efsd-342` `blade_type:"airfoil"`
contradicts the catalog (342 = V-Lock; airfoil = EFSD-352); (3) `efd-140` `temperature_rating_f:165` is the fusible
link, should be 250 (damper rating); IFC cert not in source; (4) `hepa-ht-900` variant airflow/media values are
swapped to the wrong depth. **Coverage gap:** 6 filters (hepa-sc, hepa-bio, aluminum-pre-filter, super-pleat-merv-13,
vcell-fg-3v, cacu-carbon) have no TDS in `material/` (only a name index), so their specs are name-verified but not
source-verifiable. (`eco-ecology-unit` has since been line-checked, see the next note.) No data edited yet.

**2026-06-28 - Ecology unit line-checked (queue item 1 done).** Field-by-field cross-check of `eco-ecology-unit`
against `material/Excelair Ecology Unit Catalogue - UAE.pdf`. Confirmed: the 5-stage layout (ESP -> Pre -> Fine ->
Carbon -> HEPA), model-scheme segments 1-3, and the 500 CFM floor. Found it is **not clean**: `UL 710` is
**fabricated** (the catalogue only says component filters are "UL Listed", no standard/number); the airflow ceiling
is **40,000 not 60,000 CFM**; the model-scheme 4th segment is mislabeled ("service access" vs the real **Type:
Standard/Customized**); plus medium/low issues (frame material, `construction_type: "roll"`, unsourced 95% oil/grease,
BMS / fire-alarm integration, max temperature, final pressure drop). All documented in `DATA_VERIFICATION.md` (the
"Ecology unit" section). **Not yet applied** (fixes folded into queue item 3 below). No data edited.

**2026-06-28 - Provenance clarified + download-link audit + meeting brief.** Confirmed how the data is stored: all 15
products are **hand-authored** in `data/products.json` (there is **no PDF-to-JSON pipeline**; verified no extraction
script exists in the repo). Data was transcribed from the `material/` source PDFs: 9 products from real spec docs
(5 individual TDS + 3 spec-bearing catalogues), 6 filters from the name-only `Airfilters_list.pdf`. Audited every
`documents[].url` against `public/downloads/`: **no product links to another product's file**, but `premier-vb-95-ul`
and `premier-81-10-ul` expose **only the generic catalogue** (their TDS exist in `material/` but were never published).
Added to `DATA_VERIFICATION.md`: a plain-language **"What to request from the client"** section (defines TDS, lists
the 6 filters) and a **"Download links"** section. New `research_and_planning/CLIENT_MEETING_BRIEF.md` holds the
meeting summary + client asks. **Decision (user):** keep the 6 unverified filters in the demo, flagged as
"representative, pending TDS" (do **not** remove them). Docs only; no data/code edited.

**2026-06-28 - Data fixes applied (queue items 2-4 DONE).** Applied every High + Medium fix from
`DATA_VERIFICATION.md` to `data/products.json` and verified (`npm run test` = **24 pass**, `npm run build` green).
Source values re-confirmed against the actual TDS before editing (81-10, VB-95, HEPA HT-900 selection chart).
Changes: **81-10** corrected and its UL R-27945 cert + flame/smoke-0 **restored** (see the Phase-1 reconciliation
below); **efsd-342** blade airfoil->v_lock (+ AMCA removed); **efd-140** temp 165->250 (+ IFC removed); **hepa-ht-900**
variant airflow/media/PD fixed to the 11.5" depth; **vb-95** five-field drift fixed; **eco-ecology-unit** UL 710
dropped, airflow 60k->40k, model 4th segment relabeled, frame restated, and the unsourced
`construction_type`/`max_temperature`/`final_pressure_drop` **removed** (omit beats fabricate). The **6 filters** are
kept and flagged in-data via a new non-rendering `Product.metadata.verification_status: "representative_pending_tds"`
(mirrored in `schema.json`; guarded by a new integrity test). The **two Premier UL TDS** are published into
`public/downloads/tds/` and linked. Full applied-list in `DATA_VERIFICATION.md` ("Status: fixes applied").
**Deferred (demo-acceptable):** Low items 6-8 (storage-temp relabel, csa insertion-loss caveat, minor
base_material/colour). **Open (client):** the 3 asks below.

### Next-session queue (updated 2026-06-28)

The data-verification epic is **complete**. All four queued items are done:

1. ~~**Line-check `eco-ecology-unit`**~~ **DONE 2026-06-28.**
2. ~~**Flag the 6 spec-unverifiable filters**~~ **DONE** — kept in the demo, flagged with
   `metadata.verification_status: "representative_pending_tds"` (non-rendering; mirrored in `schema.json`; integrity
   test added). Their numbers are never presented as manufacturer-published.
3. ~~**Apply the High+Medium data fixes**~~ **DONE** — all applied; types/schema/test kept in sync; test + build green.
4. ~~**Publish the two missing Premier UL datasheets**~~ **DONE** — copied to `public/downloads/tds/` and linked from
   both products' `documents[]`.

**Remaining work (post-demo / client-gated):** the three Low/nuance items in `DATA_VERIFICATION.md` (6-8), then the
roadmap items (expand toward ~170 products, Sanity CMS migration, real contact backend). Nothing is blocking the demo.

**Client asks (for the meeting, see `CLIENT_MEETING_BRIEF.md`):** (1) the 6 missing filter TDS; (2) confirm whether
the ecology *unit* is UL 710 listed or only its filters are "UL Listed" (we dropped the unit-level UL claim until
confirmed); (3) any dedicated Premier UL catalogue.

**Minimal context needed to resume:** this file + `research_and_planning/DATA_VERIFICATION.md` + `data/products.json`
(+ the specific `material/` PDF for whichever item you tackle). Nothing from the website-audit phase is needed for
the data work; that phase is closed (`CMS_WEBSITE_AUDIT.md` Part B).

## How to resume (read in this order)

1. **This file** (current state, decisions, what is next).
2. `docs/superpowers/plans/2026-06-26-vantra-demo-build.md` (the task-by-task plan).
3. `research_and_planning/DESIGN_STRATEGY.md` (the "Instrument" design + anti-AI-slop rules).
4. The deep-review findings (summarized under "Why we are doing this" below).

The memory files `vantra-catalog-demo` and `user-design-sensibility` load automatically.

## Repo / branch

- Repo: `github.com/Mohammed-Elkhatib/vantra-catalog` (private).
- Working branch: **`feat/demo-build`** (branched from `main`). Commit per task, push per
  phase. Not yet merged to `main`. `main` holds: baseline draft + strategy doc + the plan.

## Verification commands

- `npm test` (Vitest)
- `npm run lint`
- `npm run build` (must pass; lint runs inside the build)
- Visual: `npm run dev` then `http://localhost:3000`. On Windows, kill any stale `:3000`
  listener first (a prior dev server holds the port and serves stale chunks after a build).

## Phase progress

- [x] **Phase 0** - Tooling + design tokens. DONE.
- [x] **Phase 1** - Data integrity. DONE (7 integrity tests pass; build green).
- [x] **Phase 2** - Tested logic layer. DONE (16 tests pass; build green). `src/lib/catalog-filter.ts` (filter + facet, consumed by products page) and `src/lib/format.ts` exist and are tested. **Deferred:** wiring `formatFileSize`/`humanizeEnum` into `DynamicSpecs`/`ProductCard`/detail happens in Phase 4 when those are rewritten (avoids double work; `.replace` bug is latent).
- [x] **Phase 3** - Instrument signature components. DONE (20 tests pass; build green). `src/lib/instruments.ts` + `src/components/instruments/` (EfficiencyCurve, GradeLadder, PressureGauge, OctaveBands, ProductGlyph). Visually verified via a temp preview route (removed). Not yet wired into pages.
- [x] **Phase 4** - Page redesign into the Instrument system. DONE. All pages (chrome, catalog+cards+filter, detail with wired instruments, home, contact) restyled to tokens; format helpers wired; ProductCard/contact links converted; unused-import warnings cleared (db.ts, FilterSidebar). Contact refactored to server page + client form (data-driven select). Build green; 20 tests pass; visually verified.
- [x] **Phase 5** - SEO. DONE. Per-page metadata (unique titles + canonical), JSON-LD Product, SSG product pages (`●`), sitemap.ts, robots.ts, OG defaults. Verified in build output. 23 tests pass.
- [x] **Phase 6** - Verification + truthful docs + merge. DONE. Tests/lint/build green; mobile/responsive verified (home + catalog); README/CLAUDE.md/SESSION_LOG updated; merged to `main`. Known minor follow-up: mobile header could use a hamburger menu; a full a11y audit is post-demo.

## Decisions & deviations from the plan (important for a clean resume)

- **`--legacy-peer-deps` is no longer needed** (React 19 is stable; verified by a clean
  `npm install -D vitest`). README/CLAUDE.md still say it is required; corrected in Phase 6.
- **Vitest 4.1.9** installed (plan said `^2`; used current). Config: `vitest.config.ts`
  (node env, `@` alias via `fileURLToPath` for Windows-safe paths).
- **Task 1 Step 1**: used a lighter install check (install Vitest without the legacy flag)
  instead of the full `rm -rf node_modules` reinstall. Sufficient and non-destructive.
- **Lint-error fixes pulled FORWARD into Phase 0** to keep the build gate green every phase:
  internal `<a>` -> `next/link` in `layout.tsx`, `page.tsx`, `products/[slug]/page.tsx`, and
  one escaped apostrophe. Consequence for later phases: Phase 4 still must (a) convert the
  remaining internal links in `ProductCard.tsx` and the contact page, and (b) clear the
  remaining unused-import **warnings** (`db.ts`: `Variant`/`Certification`/`Document`;
  `FilterSidebar.tsx`: `X`/`Check`). Warnings do not block the build.
- **Design direction = "Instrument"** (refined Direction A). Tokens are centralized in
  `src/app/globals.css` `@theme` + `src/app/fonts.ts` so a post-meeting re-skin is cheap.

## Phase 1 decisions (resolved)

- Removed the empty "Air Outlets & Accessories" category and the three product-less brands
  (Durotape, Duraflex, Duro Dyne) per the approved default. The catalog is now 15 products
  across 4 categories / 2 brands.
- UL listing `R-27945` is now only on the Premier coatings it actually covers. The HEPA
  filter keeps NAFA (UL claim dropped as unverifiable); the dampers keep the correct
  UL 555 / UL 555S standards as `classified` with no borrowed number.
- **[Superseded 2026-06-28]** Phase 1 stripped the 81-10's UL cert and flame/smoke indices on the premise that
  "a solvent product with VOC 450 / flash point -20 C cannot credibly be flame-spread 0." That premise was itself
  a transcription error: the real 81-10 UL TDS shows a UL-listed (R-27945) synthetic-rubber adhesive, flash point
  >10 C, no VOC row, surface flame spread 0 / smoke developed 0. The data-verification epic corrected the root
  values and **restored** the UL R-27945 cert + flame/smoke 0. The `solvent-based -> not flame-spread 0` integrity
  test stays (still valid for genuine solvent products; 81-10's base_material is no longer "solvent-based").

## Pending decisions (need the user)

- None open. (If a later phase surfaces one, record it here.)

## Why we are doing this (deep-review findings that drive the build)

- **Data credibility (Phase 1):** UL listing `R-27945` is wrongly reused across a filter, a
  damper, and coatings; the 81-10 adhesive *appeared* solvent-based (VOC 450, flash point -20 C) yet
  claimed `flame_spread_index: 0` (this turned out to be a transcription error — see the superseded note
  under "Phase 1 decisions"; the real TDS is UL-listed / flame-0); category counts are inflated
  (47/31/6/12/34 advertised vs 15 real products); "Air Outlets" and three brands have zero products.
- **SEO is the core value proposition and is missing (Phase 5):** no per-page metadata
  (every product page shares one title), no sitemap/robots/JSON-LD, product pages render
  dynamically instead of SSG.
- **Code (Phases 2, 4):** duplicated + inconsistent filter/facet logic (search predicate
  differs between filter and counts); `.replace("_"," ")` only replaces the first underscore;
  icon-only links lack `aria-label`; no tests existed.
- **Design (Phases 3, 4):** the draft drifted toward AI-default looks; corrected to the
  subject-grounded "Instrument" direction. See `DESIGN_STRATEGY.md`.
