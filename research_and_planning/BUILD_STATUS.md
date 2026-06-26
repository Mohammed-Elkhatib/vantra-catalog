# Build Status & Handoff: Vantra Catalog Demo

**Living document. Update at every phase boundary.** This is the single place to resume
from if the conversation context is lost. Last updated: 2026-06-26 (end of Phase 0).

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
- [ ] **Phase 1** - Data integrity (NEXT; awaiting user go-ahead).
- [ ] **Phase 2** - Tested logic layer (filter/format).
- [ ] **Phase 3** - Instrument signature components.
- [ ] **Phase 4** - Page redesign into the Instrument system.
- [ ] **Phase 5** - SEO (metadata, JSON-LD, SSG, sitemap, robots).
- [ ] **Phase 6** - Verification + truthful doc updates (README, CLAUDE.md, SESSION_LOG).

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

## Pending decisions (need the user)

- **Phase 1 content default:** remove the empty "Air Outlets & Accessories" category and the
  three product-less brands (Durotape, Duraflex, Duro Dyne) so no empty states show in the
  demo. Default = remove. Alternative = keep as "coming soon". **Awaiting go-ahead to start
  Phase 1.**

## Why we are doing this (deep-review findings that drive the build)

- **Data credibility (Phase 1):** UL listing `R-27945` is wrongly reused across a filter, a
  damper, and coatings; the 81-10 adhesive is solvent-based (VOC 450, flash point -20 C) yet
  claims `flame_spread_index: 0`; category counts are inflated (47/31/6/12/34 advertised vs
  15 real products); "Air Outlets" and three brands have zero products.
- **SEO is the core value proposition and is missing (Phase 5):** no per-page metadata
  (every product page shares one title), no sitemap/robots/JSON-LD, product pages render
  dynamically instead of SSG.
- **Code (Phases 2, 4):** duplicated + inconsistent filter/facet logic (search predicate
  differs between filter and counts); `.replace("_"," ")` only replaces the first underscore;
  icon-only links lack `aria-label`; no tests existed.
- **Design (Phases 3, 4):** the draft drifted toward AI-default looks; corrected to the
  subject-grounded "Instrument" direction. See `DESIGN_STRATEGY.md`.
