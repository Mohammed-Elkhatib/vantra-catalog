# Design B ("CMS-flavored") at `/v2` — Design Spec

**Date:** 2026-06-29
**Branch:** `design-b-cms-v2`
**Status:** Approved design, pending spec review → implementation plan

## 1. Goal

Add a second, visually distinct design ("Design B") to the Vantra Lebanon catalog so the
client can see two directions side by side in the demo:

- **Design A** — the existing "Instrument" system (restrained paper/ink/steel palette,
  signal-red as indicator-only, mono labels, hairline rules, signature data-viz). Stays on `/`
  visually unchanged except for one small, trivially removable addition: the A↔B demo switcher link
  in its header (see §3).
- **Design B** — a polished, corporate look derived from **CMS Global's own measured brand DNA**
  (blue accent, Avenir-family type, photographic banners, card grids), executed to Design A's
  quality bar. Lives at `/v2`.

The narrative for the pitch: *"Design A — a distinctive system we'd argue for. Design B — your own
brand identity, done right."*

Motivation: the current design is clean but reads "too mono / a bit bland." Design B answers that
directly with a confident accent color and warmer corporate styling, while giving the client a real
A/B choice rather than a single take-it-or-leave-it design.

## 2. Why this is cheap-ish (the MVC insight)

The codebase already separates concerns cleanly, so Design B touches **only the View**:

- **Model** — `data/*.json`, `src/lib/db.ts`, `src/types/catalog.ts`
- **Controller / logic** — `src/lib/catalog-filter.ts`, `format.ts`, `seo.ts`, `instruments.ts`
  (geometry), and the data-integrity / data-gate test suites
- **View** — `layout.tsx`, the four route `page.tsx` files, and ~11 components, styled with inline
  Tailwind utilities that resolve to **semantic design tokens** in `src/app/globals.css`

Design B reuses 100% of Model + Controller. Nothing in this work touches the database, filtering,
faceting, SEO helpers, or the instrument math.

## 3. Mechanism — one branch, a real `/v2` route segment

Both designs ship on the **same branch / same deploy**, sharing data and logic, switchable live in
front of the client.

- Design B lives under a real Next.js **`/v2` path segment** (`src/app/v2/...`), **not** a
  parenthesized `(group)` — parenthesized groups do not change the URL and would collide with the
  existing routes. A `/v2` segment gives distinct URLs (`/v2`, `/v2/products`,
  `/v2/products/[slug]`, `/v2/contact`) and its own nested layout.
- A nested `src/app/v2/layout.tsx` provides the CMS header/footer and font, and wraps its subtree in
  `data-theme="cms"`.
- A small **A↔B switcher** (a labeled link in each header, e.g. "View: A | B") lets the presenter
  jump between `/` and the equivalent `/v2` page during the demo.

Rejected alternatives: token-only recolor (too shallow for a real A/B); separate branches with
separate deploy URLs (no live toggle, ongoing sync overhead).

## 4. Theming mechanism — scoped token override (the cost-saver)

Add one scoped block to `src/app/globals.css`. Because Tailwind v4 utilities compile to
`var(--color-*)`, overriding the tokens inside a `[data-theme="cms"]` scope re-skins **every shared
component** rendered under `/v2` with no per-component edits.

```css
[data-theme="cms"] {
  --color-paper: #ffffff;   /* white ground */
  --color-ink:   #222a35;   /* deep corporate navy-ink (body + headings) */
  --color-steel: #5b6b7d;   /* secondary text */
  --color-rule:  #dbe2ea;   /* hairlines / separators, slightly cooler */
  --color-signal:#1f6fb8;   /* CMS blue — here a confident accent/FILL, not indicator-only */
  --color-carbon:#1a2230;   /* dark band anchor */
  --font-sans:   var(--font-cms);
}
```

This is the inversion that kills the "too mono" feeling: in Design A `signal` is red and forbidden
as a fill; in Design B `signal` is blue and used confidently as a fill/accent.

Note the deliberate divergence from CMS's *literal* palette: their real site is white + `#333` body
+ stock Bootstrap blue `#337ab7`. Design B keeps the recognizable blue+white+Avenir DNA but uses a
slightly deeper, more intentional blue and navy-ink so it reads as a *polished* version of their
brand, not a clone of a dated Bootstrap-3 theme.

## 5. Reuse map

**Reused as-is (zero changes):** `data/*.json`, `db.ts`, `catalog.ts`, `catalog-filter.ts`,
`format.ts`, `seo.ts`, `instruments.ts`, and the full data-integrity / data-gate test suite.

**Reused, auto-reskinned via `[data-theme="cms"]` (no fork):** the interactive / logic-bound
components — `FilterSidebar`, `SearchInput`, `SelectionTable`, `ContactForm`, `DynamicSpecs`, and the
instrument SVG components. A verification pass confirms each re-skins cleanly (see §9, Risks — some
hardcoded `bg-white` / `var(--color-signal)` usages must be checked).

**Net-new for `/v2`:**

| File | Purpose |
|------|---------|
| `src/app/v2/layout.tsx` | Nested layout: CMS header/footer, `data-theme="cms"` wrapper, Avenir-stand-in font, `noindex` metadata |
| `src/app/v2/page.tsx` | CMS homepage: photographic hero banner, standards strip, category card grid (photo tiles), heritage, CTA |
| `src/app/v2/products/page.tsx` | Listing shell; reuses `catalog-filter` + (reskinned) `FilterSidebar`, renders the CMS product card grid |
| `src/app/v2/products/[slug]/page.tsx` | Detail shell; CMS chrome but reuses `DynamicSpecs` + instruments (recolored blue) |
| `src/app/v2/contact/page.tsx` | Thin shell; reuses `ContactForm` (reskinned) |
| `src/components/v2/Hero.tsx` (or `Banner.tsx`) | Full-bleed photographic banner |
| `src/components/v2/CategoryTile.tsx` | Photo-led category tile |
| `src/components/v2/ProductCardCms.tsx` | CMS-styled product card (photo + blue accents) |
| `src/components/v2/ThemeSwitcher.tsx` | A↔B switcher link (shared, also added to Design A header) |
| `public/v2/*` | Royalty-free domain-true imagery (see §7) |

**Edited:** `src/app/globals.css` (add scoped theme block), `src/app/fonts.ts` (register the
Avenir-stand-in font), `src/app/layout.tsx` (add the A↔B switcher link), `CLAUDE.md` (document `/v2`).

## 6. Design B visual direction (grounded in `research_and_planning/CMS_WEBSITE_AUDIT.md` §B.5)

Built from the *measured* CMS DNA, executed to Design A's quality bar:

- **Palette:** white ground, navy-ink text, **blue `#1f6fb8` as a confident fill/accent**.
- **Typography:** an Avenir-family feel. Avenir is a licensed Linotype font we cannot bundle, so the
  demo uses a close **free stand-in** — **Mulish** (preferred) or **Nunito Sans** — via `next/font`,
  with heavy weights (800/900) for headings to echo Avenir Black. Real Avenir drops in later if the
  client licenses it.
- **Layout:** full-bleed **photographic hero banners** + **card grids** (CMS's structural
  signature), but with honest copy, generous spacing, and everything actually working.
- **Instruments (HYBRID):** homepage / marketing leans photographic + corporate blue; **product
  detail pages keep the real `DynamicSpecs` + instruments**, recolored to blue. Design B reads as a
  polished corporate site up front while keeping the data-viz depth where specs live.
- **Anti-"AI-slop" guardrail:** CMS's actual identity is "stock Bootstrap blue + generic
  cyclist/sky/mountain photos." Design B deliberately uses **domain-true imagery**
  (cleanroom / HVAC / filtration), never random generic stock, so it is a *better version of their
  brand*, not generic corporate filler.

## 7. Imagery & assets

The client provides nothing; imagery is sourced during implementation:

- **Primary:** ~3–5 royalty-free, domain-true photos (cleanroom, HVAC plant, filtration, ducting)
  from Unsplash / Pexels, committed under `public/v2/` with source attribution recorded in a
  `public/v2/CREDITS.md`.
- **Fallback:** if suitable royalty-free photos cannot be sourced cleanly, use CSS/SVG abstract
  banners (blue gradient fields + the existing instrument geometry as a faint motif) so the build is
  never blocked on an external asset.
- **Logo:** keep the existing "VANTRA" wordmark in both designs (no logo asset exists).

## 8. Scope

All four `/v2` routes, in value order for the demo:

1. **Homepage** — first impression (highest value)
2. **Products listing** — the catalog UX
3. **Product detail** — the depth (hybrid instruments live here)
4. **Contact** — thin reskin of the existing mock form (lowest value; first to cut if scope tightens)

## 9. Risks & open verification

- **Shared-component re-skin pass.** Some shared components hardcode `bg-white` (literal — fine on
  both) or `var(--color-signal)` / `bg-ink` / `bg-carbon` (resolve via tokens — re-skinned). One
  pass during implementation must confirm each shared component renders correctly under
  `[data-theme="cms"]`, especially anywhere `signal` red was assumed.
- **Avenir-stand-in fidelity.** Mulish/Nunito Sans approximate Avenir; acceptable for a demo, called
  out explicitly so no one believes it is the licensed face.
- **Imagery sourcing.** Mitigated by the CSS-abstract fallback (§7).
- **Root layout ownership.** `src/app/layout.tsx` owns `<html>`/`<body>` and the Plex fonts; the
  `/v2` nested layout cannot replace them, so Design B's font + background are applied on the
  `data-theme="cms"` wrapper inside the nested layout, which is sufficient.

## 10. Testing & definition of done

- Data / logic / data-gate tests unchanged and still green (`npm run test`).
- Add a light smoke test asserting the four `/v2` routes render without error.
- `npm run build` (production build + typecheck + lint) passes — the main correctness gate.
- `/v2` carries `robots: noindex` metadata so the demo creates no duplicate-content (the exact issue
  the audit dings CMS for).
- `CLAUDE.md` updated: document the `/v2` Design B variant, the scoped `[data-theme="cms"]` theming
  mechanism, and the Avenir-stand-in font.

## 11. Cost estimate

**Medium** — roughly **2–4 focused work sessions**:

- ~1 session: scoped theme + nested `v2/layout` + font registration + routing scaffold + A↔B switcher
- ~1–2 sessions: homepage + listing + detail
- ~0.5 session: contact + imagery + `noindex` + smoke test + docs

The reuse of the entire Model + Controller is what keeps this a View swap rather than a second build.
