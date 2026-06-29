# CMS-flavored Design B at `/v2` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a second, visually distinct "CMS-flavored" design (Design B) served from a `/v2` route segment, sharing all data and logic with the existing "Instrument" design (Design A), switchable live in the demo.

**Architecture:** Design B touches only the View. The root layout is split into a `(site)` route group (Design A chrome) so each design owns its own header/footer. Design B lives under `src/app/v2/*` with a nested layout that wraps its subtree in `data-theme="cms"`; a scoped token-override block in `globals.css` re-skins every shared, token-styled component automatically. Marketing/structural components are net-new under `src/components/v2/`; interactive and spec components (`FilterSidebar`, `SearchInput`, `SelectionTable`, `ContactForm`, `DynamicSpecs`, instruments) are reused and re-skinned by the theme scope. Data (`db.ts`), filtering (`catalog-filter.ts`), and SEO helpers are reused unchanged.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS v4 (CSS-first, tokens in `globals.css @theme`), `next/font/google` (IBM Plex + Mulish), `lucide-react`, Vitest.

**Design source of truth:** `docs/superpowers/specs/2026-06-29-cms-design-b-v2-design.md`. Read §6 (visual direction) before any page/component task.

## Global Constraints

- Environment is Windows 11 / PowerShell; run git/npm from PowerShell. Quote any path containing `(` `)` (the `(site)` route group).
- No em dashes in any code, comment, doc, or commit message.
- **No new package dependencies.** Mulish ships inside `next/font/google` (already a dependency); nothing is installed.
- Tailwind v4 is CSS-first: there is **no** `tailwind.config.js`. Design tokens live in `src/app/globals.css`. New theming is a scoped `[data-theme="cms"]` override of the existing tokens, never a parallel token set.
- Server components by default. The only new `"use client"` file is `ThemeSwitcher.tsx` (uses `usePathname`). `src/lib/db.ts` is server-only and must never be imported into a client component; client components (`FilterSidebar`, `ContactForm`) receive data as props from server pages, exactly as in Design A.
- `next/font` faces are declared at module scope in `src/app/fonts.ts` and applied via their `.variable` className.
- All Design B internal links point at `/v2/...` (its own homepage, listing, detail, contact). All Design A links stay `/...`.
- `/v2` must be `noindex` (set once on `v2/layout.tsx`, inherited by children).
- Route groups do **not** change URLs: after the split, `/`, `/products`, `/products/[slug]`, `/contact` render byte-identical output at the same URLs.
- Conventional commit messages, each ending with the trailer line: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- `npm run test` and `npm run build` must both be green before any task is considered done. `npm run build` is the render smoke test for the SSG/SSR `/v2` routes (home, detail, contact); the dynamic `/v2/products` listing is compiled but not pre-rendered.

---

## File Structure

| Path | Responsibility | Created/Modified |
| --- | --- | --- |
| `src/app/layout.tsx` | Slim root: `<html>`/`<body>` + Plex font variables + metadata base. No chrome. | Modify |
| `src/app/(site)/layout.tsx` | Design A chrome (header + `<main>` + footer) + A/B switcher. Moved out of root. | Create |
| `src/app/(site)/page.tsx` | Design A homepage (moved, unchanged). | Move |
| `src/app/(site)/products/page.tsx` + `[slug]/page.tsx` | Design A listing + detail (moved, unchanged). | Move |
| `src/app/(site)/contact/page.tsx` | Design A contact (moved, unchanged). | Move |
| `src/app/globals.css` | Add the scoped `[data-theme="cms"]` token-override block. | Modify |
| `src/app/fonts.ts` | Register Mulish as `--font-cms` (Avenir stand-in). | Modify |
| `src/lib/design-switch.ts` | Pure `counterpartPath(pathname, current)` mapping A<->B paths. | Create |
| `src/lib/design-switch.test.ts` | Unit tests for `counterpartPath`. | Create |
| `src/components/ThemeSwitcher.tsx` | Client A/B switcher link (uses `usePathname` + `counterpartPath`). | Create |
| `src/app/v2/layout.tsx` | CMS chrome (white header w/ blue lockup + blue footer band), theme wrapper, Mulish, `noindex`. | Create |
| `src/app/v2/page.tsx` | CMS homepage: photographic hero band, standards strip, category grid, heritage, CTA. | Create |
| `src/app/v2/products/page.tsx` | CMS listing: reuse filter logic + `FilterSidebar`/`SearchInput`, render `ProductCardCms` grid. | Create |
| `src/app/v2/products/[slug]/page.tsx` | CMS detail: reuse `DynamicSpecs`/`SelectionTable`/`ModelDecoder`/instruments, `/v2` links. | Create |
| `src/app/v2/contact/page.tsx` | CMS contact: reuse `ContactForm`, CMS info panels. | Create |
| `src/components/v2/Hero.tsx` | Full-bleed photographic/abstract hero band with ghost CTA. | Create |
| `src/components/v2/CategoryTile.tsx` | Photo-led category card. | Create |
| `src/components/v2/ProductCardCms.tsx` | CMS-styled product card (links to `/v2/products/<id>`). | Create |
| `src/lib/product-display.ts` | Extracted `quickSpecs(product)` shared by both product cards (DRY). | Create |
| `src/components/ProductCard.tsx` | Import `quickSpecs` from `product-display` instead of a local copy. | Modify |
| `public/v2/*` + `public/v2/CREDITS.md` | Royalty-free domain-true imagery + attribution. | Create |
| `CLAUDE.md` | Document `/v2`, the `(site)` split, the `[data-theme="cms"]` mechanism, and the Mulish font. | Modify |

---

## Task 1: Split the root layout into a `(site)` route group

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/app/(site)/layout.tsx`
- Move: `src/app/page.tsx` -> `src/app/(site)/page.tsx`
- Move: `src/app/products/` -> `src/app/(site)/products/`
- Move: `src/app/contact/` -> `src/app/(site)/contact/`

**Interfaces:**
- Produces: a slim root layout that renders only `{children}`; a `(site)` layout that owns the Design A header/footer. No exported functions.

- [ ] **Step 1: Move the Design A route files into the group**

Run (PowerShell, from repo root):
```
mkdir "src/app/(site)"
git mv src/app/page.tsx "src/app/(site)/page.tsx"
git mv src/app/products "src/app/(site)/products"
git mv src/app/contact "src/app/(site)/contact"
```
Expected: `src/app/layout.tsx`, `fonts.ts`, `globals.css`, `sitemap.ts`, `robots.ts` remain at `src/app/`; the three route files/dirs now live under `src/app/(site)/`.

- [ ] **Step 2: Create the `(site)` layout with the Design A chrome**

Create `src/app/(site)/layout.tsx` with the header/footer lifted verbatim from the current root layout:

```tsx
import Link from "next/link";

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-rule bg-paper/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="text-lg font-bold tracking-[0.16em] text-ink">VANTRA</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-steel">Lebanon</span>
          </Link>
          <nav className="flex items-center gap-7 font-mono text-[11px] uppercase tracking-[0.14em] text-steel">
            <Link href="/" className="transition-colors hover:text-ink">Home</Link>
            <Link href="/products" className="transition-colors hover:text-ink">Catalog</Link>
            <Link href="/contact" className="transition-colors hover:text-ink">Contact</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-rule bg-paper py-12 text-steel">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 lg:px-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs">&copy; {new Date().getFullYear()} Vantra Lebanon. A CMS Global company.</p>
          <div className="flex gap-6 font-mono text-[11px] uppercase tracking-[0.14em]">
            <Link href="/contact" className="transition-colors hover:text-ink">Support</Link>
            <Link href="/contact" className="transition-colors hover:text-ink">Privacy</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
```

- [ ] **Step 3: Slim the root layout**

Replace `src/app/layout.tsx` body so it owns only `<html>`/`<body>` + fonts + metadata:

```tsx
import type { Metadata } from "next";
import { plexSans, plexMono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ventra-leb.com"),
  title: "Vantra Lebanon | Medical-Grade HVAC & Air Filtration",
  description:
    "High-efficiency air filtration, dampers, sound attenuators, and coatings for medical, pharmaceutical, and commercial projects in Lebanon. Open catalog, instant datasheets, no registration.",
  openGraph: {
    siteName: "Vantra Lebanon",
    type: "website",
    locale: "en",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable}`}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Verify the build and existing tests**

Run: `npm run build`
Expected: build succeeds; route list still shows `/`, `/products`, `/products/[slug]`, `/contact` (the `(site)` group does not appear in URLs).

Run: `npm run test`
Expected: all existing suites pass (no test references app-dir paths).

- [ ] **Step 5: Visually confirm Design A is unchanged**

Run: `npm run dev`, open `http://localhost:3000/`, `/products`, and one product detail page. Confirm they look identical to before the move. Stop the dev server.

- [ ] **Step 6: Commit**

```
git add -A
git commit -m "refactor(layout): extract Design A chrome into a (site) route group

Slim the root layout to <html>/<body> + fonts so a second design can own
its own chrome. URLs and rendered output for /, /products, /contact are
unchanged.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: CMS theme scope, Mulish font, and the `/v2` layout shell

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/fonts.ts`
- Create: `src/app/v2/layout.tsx`
- Create: `src/app/v2/page.tsx` (temporary stub, fleshed out in Task 4)

**Interfaces:**
- Produces: `mulish` font export (`--font-cms`); a `data-theme="cms"` subtree that re-skins token-styled children; a `/v2` route that renders with CMS chrome.

- [ ] **Step 1: Add the scoped theme block to `globals.css`**

Append after the existing `@layer base { ... }` block in `src/app/globals.css`:

```css
/* ---------------------------------------------------------------------------
   Design B ("CMS") theme scope. Applied by src/app/v2/layout.tsx via
   data-theme="cms". Overrides the Instrument tokens so every token-styled
   shared component reskins with no per-component edits.
   See docs/superpowers/specs/2026-06-29-cms-design-b-v2-design.md.
--------------------------------------------------------------------------- */
[data-theme="cms"] {
  --color-paper: #ffffff; /* white ground */
  --color-ink: #222a35; /* deep corporate navy-ink */
  --color-steel: #5b6b7d; /* secondary text */
  --color-rule: #dbe2ea; /* hairlines / separators */
  --color-signal: #1f6fb8; /* CMS blue: allowed as accent/fill (used with restraint) */
  --color-carbon: #1a2230; /* dark band anchor */
  --font-sans: var(--font-cms), ui-sans-serif, system-ui, sans-serif;
}
```

- [ ] **Step 2: Register Mulish in `fonts.ts`**

Edit `src/app/fonts.ts`: add `Mulish` to the import and export it:

```ts
import { IBM_Plex_Sans, IBM_Plex_Mono, Mulish } from "next/font/google";
```
and append:
```ts
// Design B ("CMS") face: a free, humanist-geometric stand-in for Avenir
// (which is licensed and cannot be bundled). Heavy weights echo Avenir Black.
export const mulish = Mulish({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-cms",
  display: "swap",
});
```

- [ ] **Step 3: Create the `/v2` layout shell**

Create `src/app/v2/layout.tsx`. White CMS header with a blue logo mark, regular-case nav, and a blue footer band. (The A/B switcher is added in Task 3.)

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { mulish } from "../fonts";

export const metadata: Metadata = {
  // The demo's /v2 routes must not be indexed (no duplicate content).
  robots: { index: false, follow: false },
};

export default function V2Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-theme="cms"
      className={`${mulish.variable} flex min-h-screen flex-col bg-paper font-sans text-ink`}
    >
      <header className="sticky top-0 z-50 border-b border-rule bg-paper/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/v2" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center bg-[var(--color-signal)] text-sm font-extrabold text-white">V</span>
            <span className="text-xl font-extrabold tracking-tight text-ink">Vantra</span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-steel">Lebanon</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-steel sm:flex">
            <Link href="/v2" className="transition-colors hover:text-[var(--color-signal)]">Home</Link>
            <Link href="/v2/products" className="transition-colors hover:text-[var(--color-signal)]">Products</Link>
            <Link href="/v2/contact" className="transition-colors hover:text-[var(--color-signal)]">Contact</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-[var(--color-signal)] text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-10 sm:px-6 lg:px-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold">Vantra Lebanon &middot; A CMS Global company</p>
          <p className="text-xs text-white/80">&copy; {new Date().getFullYear()} Vantra Lebanon. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 4: Create a temporary `/v2` home stub**

Create `src/app/v2/page.tsx` (replaced in Task 4):

```tsx
export const revalidate = 3600;

export default function V2Home() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-signal)]">Design B preview</p>
      <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-ink">CMS-flavored design</h1>
      <p className="mt-4 max-w-xl text-lg text-steel">Theme scaffold in place. Homepage content lands in Task 4.</p>
    </section>
  );
}
```

- [ ] **Step 5: Verify the theme renders**

Run: `npm run build`
Expected: build succeeds; route list now includes `/v2`.

Run: `npm run dev`, open `http://localhost:3000/v2`. Confirm: white background, navy headings in the Mulish face, a blue square logo mark, and a solid blue footer band. Take a screenshot to confirm the theme is applied. Stop the dev server.

- [ ] **Step 6: Commit**

```
git add -A
git commit -m "feat(v2): add CMS theme scope, Mulish font, and /v2 layout shell

Scoped [data-theme=cms] token override reskins token-styled components with
no fork; Mulish stands in for Avenir; /v2 layout supplies CMS chrome and is
noindex.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: A/B design switcher

**Files:**
- Create: `src/lib/design-switch.ts`
- Create: `src/lib/design-switch.test.ts`
- Create: `src/components/ThemeSwitcher.tsx`
- Modify: `src/app/(site)/layout.tsx` (add switcher, `current="a"`)
- Modify: `src/app/v2/layout.tsx` (add switcher, `current="b"`)

**Interfaces:**
- Produces: `counterpartPath(pathname: string, current: "a" | "b"): string`; `<ThemeSwitcher current="a" | "b" />`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/design-switch.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { counterpartPath } from "./design-switch";

describe("counterpartPath", () => {
  it("adds the /v2 prefix from Design A", () => {
    expect(counterpartPath("/", "a")).toBe("/v2");
    expect(counterpartPath("/products", "a")).toBe("/v2/products");
    expect(counterpartPath("/products/hepa-ht-900", "a")).toBe("/v2/products/hepa-ht-900");
  });

  it("strips the /v2 prefix from Design B", () => {
    expect(counterpartPath("/v2", "b")).toBe("/");
    expect(counterpartPath("/v2/products", "b")).toBe("/products");
    expect(counterpartPath("/v2/products/hepa-ht-900", "b")).toBe("/products/hepa-ht-900");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- design-switch`
Expected: FAIL with "counterpartPath is not exported" / module not found.

- [ ] **Step 3: Implement `counterpartPath`**

Create `src/lib/design-switch.ts`:

```ts
/**
 * Map a path in one design to the equivalent path in the other, so the
 * A/B switcher keeps the visitor on the same page type.
 * current="a": prepend the /v2 prefix. current="b": strip it.
 */
export function counterpartPath(pathname: string, current: "a" | "b"): string {
  if (current === "a") {
    return pathname === "/" ? "/v2" : `/v2${pathname}`;
  }
  const stripped = pathname.replace(/^\/v2/, "");
  return stripped === "" ? "/" : stripped;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- design-switch`
Expected: PASS (both cases).

- [ ] **Step 5: Create the switcher component**

Create `src/components/ThemeSwitcher.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { counterpartPath } from "@/lib/design-switch";

/** Small A/B pill. `current` marks which design is active; the other is a link. */
export default function ThemeSwitcher({ current }: { current: "a" | "b" }) {
  const pathname = usePathname();
  const target = counterpartPath(pathname || "/", current);
  const activeCls = "px-2 py-0.5 text-[11px] font-semibold";
  const onCls = `${activeCls} bg-[var(--color-signal)] text-white`;
  const offCls = `${activeCls} text-steel transition-colors hover:text-ink`;
  return (
    <span className="inline-flex items-center overflow-hidden rounded-sm border border-rule">
      {current === "a" ? (
        <>
          <span className={onCls}>A</span>
          <Link href={target} className={offCls} prefetch={false}>B</Link>
        </>
      ) : (
        <>
          <Link href={target} className={offCls} prefetch={false}>A</Link>
          <span className={onCls}>B</span>
        </>
      )}
    </span>
  );
}
```

- [ ] **Step 6: Wire the switcher into both layouts**

In `src/app/(site)/layout.tsx`, import it and add `<ThemeSwitcher current="a" />` as the last child of the `<nav>`:
```tsx
import ThemeSwitcher from "@/components/ThemeSwitcher";
```
```tsx
            <Link href="/contact" className="transition-colors hover:text-ink">Contact</Link>
            <ThemeSwitcher current="a" />
```

In `src/app/v2/layout.tsx`, import it and add `<ThemeSwitcher current="b" />` as the last child of the `<nav>`:
```tsx
import ThemeSwitcher from "@/components/ThemeSwitcher";
```
```tsx
            <Link href="/v2/contact" className="transition-colors hover:text-[var(--color-signal)]">Contact</Link>
            <ThemeSwitcher current="b" />
```

- [ ] **Step 7: Verify build, tests, and live toggle**

Run: `npm run build` then `npm run test`
Expected: both green.

Run: `npm run dev`. From `/products`, click the switcher "B": lands on `/v2/products`. From `/v2/products`, click "A": lands on `/products`. Stop the dev server.

- [ ] **Step 8: Commit**

```
git add -A
git commit -m "feat(v2): add A/B design switcher

Pure counterpartPath maps a path to its equivalent in the other design;
ThemeSwitcher renders the A/B pill in both layouts so the demo toggles live.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Design B homepage

**Read first:** spec §6 (visual direction) and §7 (imagery). Apply the `frontend-design:frontend-design` skill for the visual craft; the code below is a correct, on-brand starting point, not the final polish.

**Files:**
- Create: `src/components/v2/Hero.tsx`
- Create: `src/components/v2/CategoryTile.tsx`
- Modify: `src/app/v2/page.tsx` (replace the Task 2 stub)

**Interfaces:**
- Consumes: `getCategories()`, `getBrands()` from `@/lib/db` (same as Design A home). `Category` has `{ id, name, description, product_count }`; `Brand` has `{ id, name, description }`.
- Produces: `<Hero>` and `<CategoryTile>` presentational components (Design B only).

- [ ] **Step 1: Create the Hero band**

Create `src/components/v2/Hero.tsx`. Full-bleed band; accepts an optional background image, otherwise a blue gradient (the §7 CSS-abstract fallback). Ghost CTA buttons (the CMS signature).

```tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  imageSrc?: string; // optional; falls back to a blue gradient field
}

export default function Hero({ eyebrow, title, subtitle, imageSrc }: HeroProps) {
  return (
    <section
      className="relative isolate overflow-hidden bg-[var(--color-carbon)] text-white"
      style={
        imageSrc
          ? { backgroundImage: `linear-gradient(180deg, rgba(13,18,28,0.72), rgba(13,18,28,0.72)), url(${imageSrc})`, backgroundSize: "cover", backgroundPosition: "center" }
          : { backgroundImage: "radial-gradient(110% 140% at 80% 0%, #2b6fb0 0%, #1f4f86 45%, #14233a 100%)" }
      }
    >
      <div className="mx-auto max-w-6xl px-4 py-28 sm:px-6 lg:px-8 lg:py-36">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/80">{eyebrow}</p>
        <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">{title}</h1>
        <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-white/90">{subtitle}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/v2/products" className="inline-flex items-center gap-2 border border-white/80 px-7 py-3 text-sm font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-white hover:text-[var(--color-carbon)]">
            Browse Products <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/v2/contact" className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white/90 transition-colors hover:text-white">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create the CategoryTile**

Create `src/components/v2/CategoryTile.tsx`. Photo-led card with blue title hover; falls back to a tinted block when no image.

```tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CategoryTileProps {
  name: string;
  description: string;
  productCount: number;
  imageSrc?: string;
}

export default function CategoryTile({ name, description, productCount, imageSrc }: CategoryTileProps) {
  return (
    <Link
      href={`/v2/products?category=${encodeURIComponent(name)}`}
      className="group flex flex-col overflow-hidden rounded-sm border border-rule bg-paper transition-shadow hover:shadow-lg"
    >
      <div
        className="aspect-[16/10] bg-[var(--color-rule)]"
        style={imageSrc ? { backgroundImage: `url(${imageSrc})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
      />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold text-ink transition-colors group-hover:text-[var(--color-signal)]">{name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-steel">{description}</p>
        <div className="mt-5 flex items-center justify-between border-t border-rule pt-4 text-xs font-semibold uppercase tracking-[0.1em] text-steel">
          <span>{productCount} products</span>
          <ArrowRight className="h-4 w-4 text-[var(--color-signal)] transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 3: Build the homepage**

Replace `src/app/v2/page.tsx`:

```tsx
import Link from "next/link";
import { getCategories, getBrands } from "@/lib/db";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/v2/Hero";
import CategoryTile from "@/components/v2/CategoryTile";

export const revalidate = 3600;

const STANDARDS = ["UL", "ETL", "AMCA", "BSRIA", "EN 1822", "ASTM"];

export default async function V2Home() {
  const [categories, brands] = await Promise.all([getCategories(), getBrands()]);

  return (
    <div>
      <Hero
        eyebrow="Medical-grade HVAC"
        title="Engineered air, delivered with confidence."
        subtitle="Vantra brings CMS Global's certified air filtration, dampers, and acoustic attenuators to Lebanon. Open catalog, instant datasheets, no registration."
      />

      {/* Standards strip */}
      <section className="border-b border-rule bg-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-10 gap-y-3 px-4 py-6 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-steel">Tested to</span>
          {STANDARDS.map((s) => (
            <span key={s} className="text-sm font-bold text-[var(--color-signal)]">{s}</span>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-ink">Browse by category</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryTile
              key={category.id}
              name={category.name}
              description={category.description}
              productCount={category.product_count}
            />
          ))}
        </div>
      </section>

      {/* Heritage */}
      <section className="border-y border-rule bg-paper">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-signal)]">CMS Global heritage</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink">Forty years of HVAC engineering</h2>
            <p className="mt-6 text-lg font-light leading-relaxed text-steel">
              Vantra is the Levant arm of Century Mechanical Systems, founded in 1982. CMS runs eight manufacturing
              facilities across the Gulf and Sri Lanka, supplying certified components to projects in over fifty countries.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-rule pt-8">
              <div>
                <div className="text-4xl font-extrabold text-[var(--color-signal)]">8</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-steel">Factories</div>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-[var(--color-signal)]">54+</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-steel">Export countries</div>
              </div>
            </div>
          </div>
          <div className="rounded-sm border border-rule bg-white p-7">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-ink">Brands carried</h3>
            <div className="mt-4 divide-y divide-rule">
              {brands.map((brand) => (
                <div key={brand.id} className="py-4 first:pt-0 last:pb-0">
                  <h4 className="text-sm font-bold text-ink">{brand.name}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-steel">{brand.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--color-signal)]">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Get technical specs instantly</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/85">
            Find the exact product for your project and download the datasheet in one click. No registration, no gate.
          </p>
          <Link href="/v2/products" className="mt-8 inline-flex items-center gap-2 border border-white px-7 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-white hover:text-[var(--color-signal)]">
            Explore Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npm run build` (renders `/v2` at build) then `npm run dev` and open `/v2`. Confirm against spec §6: airy whitespace, restrained blue, ghost CTA buttons, proper heading contrast. Screenshot. Stop the dev server.

- [ ] **Step 5: Commit**

```
git add -A
git commit -m "feat(v2): Design B homepage (hero, categories, heritage, CTA)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: Design B products listing

**Read first:** spec §6. Apply `frontend-design:frontend-design` for polish.

**Files:**
- Create: `src/lib/product-display.ts`
- Modify: `src/components/ProductCard.tsx` (import `quickSpecs` from the new module)
- Create: `src/components/v2/ProductCardCms.tsx`
- Create: `src/app/v2/products/page.tsx`

**Interfaces:**
- Consumes: `getProducts`, `getBrands`, `getCategories` from `@/lib/db`; `filterProducts`, `computeFacetCounts`, `CatalogFilters` from `@/lib/catalog-filter`. `FilterSidebar` props: `{ categories, brands, availableCounts }`. `SearchInput` props: `{ defaultValue }`.
- Produces: `quickSpecs(product: Product): { k: string; v: string }[]`; `<ProductCardCms product brandName />`.

- [ ] **Step 1: Extract `quickSpecs` into a shared module (DRY)**

Create `src/lib/product-display.ts` by moving the `quickSpecs` function out of `src/components/ProductCard.tsx` verbatim (it currently lives at `ProductCard.tsx:13-44`), adding the imports it needs:

```ts
import type { Product } from "@/types/catalog";
import { humanizeEnum } from "@/lib/format";

/** Up to three scannable key/value specs, chosen by spec type. */
export function quickSpecs(product: Product): { k: string; v: string }[] {
  const s = product.specifications;
  if (s.spec_type === "filter") {
    return [
      s.filter_classification_en1822
        ? { k: "EN 1822", v: s.filter_classification_en1822 }
        : s.merv_rating != null
          ? { k: "MERV", v: String(s.merv_rating) }
          : { k: "Type", v: humanizeEnum(s.construction_type) },
      s.max_temperature_c != null ? { k: "Max temp", v: `${s.max_temperature_c}°C` } : null,
      s.final_pressure_drop_in_wg != null ? { k: "Final ΔP", v: `${s.final_pressure_drop_in_wg}″ wg` } : null,
    ].filter(Boolean) as { k: string; v: string }[];
  }
  if (s.spec_type === "damper") {
    return [
      s.fire_rating_hours != null ? { k: "Fire rating", v: `${s.fire_rating_hours} hr` } : null,
      s.leakage_class ? { k: "Leakage", v: `Class ${s.leakage_class}` } : null,
      s.velocity_rating_fpm_max != null ? { k: "Max vel.", v: `${s.velocity_rating_fpm_max} fpm` } : null,
    ].filter(Boolean) as { k: string; v: string }[];
  }
  if (s.spec_type === "sound_attenuator") {
    return [
      { k: "Profile", v: humanizeEnum(s.attenuator_type) },
      s.max_airway_velocity_m_s != null ? { k: "Max vel.", v: `${s.max_airway_velocity_m_s} m/s` } : null,
    ].filter(Boolean) as { k: string; v: string }[];
  }
  return [
    { k: "Function", v: humanizeEnum(s.product_function) },
    s.solid_content_pct != null ? { k: "Solids", v: `${s.solid_content_pct}%` } : null,
    s.voc_content_g_l != null ? { k: "VOC", v: `${s.voc_content_g_l} g/l` } : null,
  ].filter(Boolean) as { k: string; v: string }[];
}
```

Then in `src/components/ProductCard.tsx`: delete the local `quickSpecs` function and the now-unused `humanizeEnum` import, and add `import { quickSpecs } from "@/lib/product-display";`. (Keep the `formatFileSize` import.)

- [ ] **Step 2: Verify the refactor is behavior-preserving**

Run: `npm run build` then `npm run test`
Expected: both green; Design A product cards unchanged.

- [ ] **Step 3: Create `ProductCardCms`**

Create `src/components/v2/ProductCardCms.tsx`. CMS-styled card, links to `/v2/products/<id>`, reuses `quickSpecs` and the `ProductGlyph` instrument.

```tsx
import Link from "next/link";
import { Product } from "@/types/catalog";
import { Download, FileText, ArrowRight } from "lucide-react";
import ProductGlyph from "@/components/instruments/ProductGlyph";
import { formatFileSize } from "@/lib/format";
import { quickSpecs } from "@/lib/product-display";

export default function ProductCardCms({ product, brandName }: { product: Product; brandName: string }) {
  const tdsDoc = product.documents?.find((d) => d.type === "technical_data_sheet");
  const catalogDoc = product.documents?.find((d) => d.type === "catalog");
  const specs = quickSpecs(product);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-sm border border-rule bg-white transition-shadow hover:shadow-lg">
      <div className="flex items-center justify-between bg-[var(--color-paper)] px-5 py-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-steel">{brandName}</span>
        <ProductGlyph productType={product.product_type} size={40} />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold leading-snug text-ink">
          <Link href={`/v2/products/${product.id}`} className="transition-colors group-hover:text-[var(--color-signal)]">
            {product.name}
          </Link>
        </h3>
        <dl className="mt-4 flex-1 divide-y divide-rule border-y border-rule">
          {specs.map((row) => (
            <div key={row.k} className="flex items-center justify-between py-1.5">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-steel">{row.k}</dt>
              <dd className="text-sm font-medium text-ink">{row.v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex items-center justify-between">
          <Link href={`/v2/products/${product.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-signal)]">
            View specs <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <div className="flex gap-1.5">
            {tdsDoc && (
              <a href={tdsDoc.url} download aria-label={`Download datasheet PDF (${formatFileSize(tdsDoc.file_size_kb)})`} className="inline-flex items-center justify-center rounded-sm border border-rule p-2 text-steel transition-colors hover:border-[var(--color-signal)] hover:text-[var(--color-signal)]">
                <FileText className="h-3.5 w-3.5" />
              </a>
            )}
            {catalogDoc && (
              <a href={catalogDoc.url} download aria-label={`Download catalogue PDF (${formatFileSize(catalogDoc.file_size_kb)})`} className="inline-flex items-center justify-center rounded-sm border border-rule p-2 text-steel transition-colors hover:border-[var(--color-signal)] hover:text-[var(--color-signal)]">
                <Download className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create the listing page**

Create `src/app/v2/products/page.tsx`. The searchParams parsing and filter logic are identical to Design A's listing (`src/app/(site)/products/page.tsx`); only the chrome and card differ.

```tsx
import type { Metadata } from "next";
import { getProducts, getBrands, getCategories } from "@/lib/db";
import { filterProducts, computeFacetCounts, type CatalogFilters } from "@/lib/catalog-filter";
import { buildListingMetadata } from "@/lib/seo";
import ProductCardCms from "@/components/v2/ProductCardCms";
import FilterSidebar from "@/components/FilterSidebar";
import SearchInput from "@/components/SearchInput";
import { Search } from "lucide-react";

export const metadata: Metadata = buildListingMetadata();
export const revalidate = 0;

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string; category?: string; brand?: string;
    en1822?: string; fireRating?: string; leakageClass?: string; cert?: string;
  }>;
}

export default async function V2ProductsPage({ searchParams }: ProductsPageProps) {
  const sp = await searchParams;
  const filters: CatalogFilters = {
    search: sp.search || undefined,
    category: sp.category ? sp.category.split(",") : [],
    brand: sp.brand ? sp.brand.split(",") : [],
    en1822: sp.en1822 ? sp.en1822.split(",") : [],
    fireRating: sp.fireRating ? sp.fireRating.split(",") : [],
    leakageClass: sp.leakageClass ? sp.leakageClass.split(",") : [],
    cert: sp.cert ? sp.cert.split(",") : [],
  };

  const [products, brands, categories] = await Promise.all([getProducts(), getBrands(), getCategories()]);
  const filteredProducts = filterProducts(products, filters);
  const availableCounts = computeFacetCounts(products, filters);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-6 border-b border-rule pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Product Catalog</h1>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-steel">
            {filteredProducts.length} / {products.length} products
          </p>
        </div>
        <div className="w-full md:w-80">
          <SearchInput defaultValue={sp.search || ""} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <FilterSidebar categories={categories} brands={brands} availableCounts={availableCounts} />
        </aside>
        <main className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => {
                const brand = brands.find((b) => b.id === product.brand_id);
                return <ProductCardCms key={product.id} product={product} brandName={brand ? brand.name : product.brand_id} />;
              })}
            </div>
          ) : (
            <div className="rounded-sm border border-dashed border-rule bg-white py-20 text-center">
              <Search className="mx-auto mb-4 h-7 w-7 text-steel" />
              <h3 className="text-lg font-bold text-ink">No products found</h3>
              <p className="mx-auto mt-1 max-w-sm text-sm text-steel">Nothing matches your current filters. Try clearing a facet or adjusting your search.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Verify**

Run: `npm run build` then `npm run test`
Expected: both green.

Run: `npm run dev`, open `/v2/products`. Confirm: FilterSidebar and SearchInput render re-skinned (blue accents, navy text), the CMS cards show, and filtering works (toggle a category; URL gains `?category=...`; counts update). Screenshot. Stop the dev server.

- [ ] **Step 6: Commit**

```
git add -A
git commit -m "feat(v2): Design B products listing + shared quickSpecs

Extract quickSpecs into src/lib/product-display.ts (used by both cards);
reuse filter logic, FilterSidebar, and SearchInput; render the CMS card grid.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 6: Design B product detail

**Read first:** spec §6. This page keeps the hybrid instruments (`DynamicSpecs` + the instrument visuals), re-skinned by the theme. Apply `frontend-design:frontend-design` for polish.

**Files:**
- Create: `src/app/v2/products/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getProductById`, `getProducts`, `getBrands`; `buildProductMetadata`, `buildProductJsonLd`; `DynamicSpecs` (props `{ specs }`), `SelectionTable` (props `{ variants }`), `ModelDecoder` (props `{ scheme }`), `ProductGlyph` (props `{ productType, size, className? }`).
- Produces: SSG detail pages at `/v2/products/[slug]`.

- [ ] **Step 1: Create the detail page**

Create `src/app/v2/products/[slug]/page.tsx`. Mirrors Design A detail (`src/app/(site)/products/[slug]/page.tsx`) for data, SSG, metadata, and JSON-LD; CMS chrome; all internal links use `/v2`.

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { getProductById, getProducts, getBrands } from "@/lib/db";
import { buildProductMetadata, buildProductJsonLd } from "@/lib/seo";
import DynamicSpecs from "@/components/DynamicSpecs";
import SelectionTable from "@/components/SelectionTable";
import ModelDecoder from "@/components/ModelDecoder";
import ProductGlyph from "@/components/instruments/ProductGlyph";
import { formatFileSize } from "@/lib/format";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, FileText, Send, BadgeAlert } from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductById(slug);
  if (!product) return { title: "Product not found | Vantra Lebanon" };
  // robots noindex is inherited from v2/layout.tsx; canonical points at the Design A URL.
  return buildProductMetadata(product);
}

export default async function V2ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductById(slug);
  if (!product) notFound();

  const brands = await getBrands();
  const brand = brands.find((b) => b.id === product.brand_id);
  const tdsDoc = product.documents?.find((d) => d.type === "technical_data_sheet");
  const catalogDoc = product.documents?.find((d) => d.type === "catalog");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProductJsonLd(product, brand)).replace(/</g, "\\u003c") }}
      />
      <Link href="/v2/products" className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-steel transition-colors hover:text-[var(--color-signal)]">
        <ArrowLeft className="h-4 w-4" /> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="flex items-start justify-between gap-6 border-b border-rule pb-6">
            <div>
              <div className="mb-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-signal)]">
                {brand ? brand.name : product.brand_id} &middot; {product.category}
                {product.subcategory ? ` · ${product.subcategory}` : ""}
              </div>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">{product.name}</h1>
            </div>
            <ProductGlyph productType={product.product_type} size={64} className="shrink-0" />
          </div>

          {product.description && <p className="text-lg font-light leading-relaxed text-steel">{product.description}</p>}

          {product.features && product.features.length > 0 && (
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-steel">Key features</h3>
              <ul className="grid grid-cols-1 gap-2.5 text-sm text-ink md:grid-cols-2">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-signal)]" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.applications && product.applications.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-steel">Applications</h3>
              <div className="flex flex-wrap gap-1.5">
                {product.applications.map((app) => (
                  <span key={app} className="rounded-sm border border-rule px-2.5 py-1 text-xs font-medium text-ink">{app}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 lg:col-span-1">
          <div className="rounded-sm border border-rule bg-white p-5">
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-steel">Documents</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-steel">Ungated. Sourced from CMS Global factories.</p>
            <div className="mt-4 flex flex-col gap-2">
              {tdsDoc ? (
                <a href={tdsDoc.url} download className="group flex items-center gap-3 rounded-sm border border-rule p-3 transition-colors hover:border-[var(--color-signal)]">
                  <FileText className="h-5 w-5 shrink-0 text-[var(--color-signal)]" />
                  <span className="flex-1 text-left">
                    <span className="block text-xs font-bold text-ink">Technical Datasheet</span>
                    <span className="block text-[11px] text-steel">PDF &middot; {formatFileSize(tdsDoc.file_size_kb)}</span>
                  </span>
                  <Download className="h-4 w-4 text-steel transition-colors group-hover:text-ink" />
                </a>
              ) : (
                <div className="flex items-center gap-3 rounded-sm border border-dashed border-rule p-3 text-steel">
                  <BadgeAlert className="h-5 w-5 shrink-0" />
                  <span className="text-xs">No datasheet PDF yet</span>
                </div>
              )}
              {catalogDoc && (
                <a href={catalogDoc.url} download className="group flex items-center gap-3 rounded-sm border border-rule p-3 transition-colors hover:border-[var(--color-signal)]">
                  <Download className="h-5 w-5 shrink-0 text-ink" />
                  <span className="flex-1 text-left">
                    <span className="block text-xs font-bold text-ink">Product Catalogue</span>
                    <span className="block text-[11px] text-steel">PDF &middot; {formatFileSize(catalogDoc.file_size_kb)}</span>
                  </span>
                  <Download className="h-4 w-4 text-steel transition-colors group-hover:text-ink" />
                </a>
              )}
            </div>
          </div>

          <div className="rounded-sm border border-rule bg-white p-5">
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-steel">Request sizing &amp; pricing</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-steel">Need a custom size or project pricing for Lebanon tenders?</p>
            <Link href={`/v2/contact?product=${encodeURIComponent(product.name)}`} className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-[var(--color-signal)] py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90">
              <Send className="h-3.5 w-3.5" /> Submit Inquiry
            </Link>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="mb-5 text-xl font-extrabold tracking-tight text-ink">Technical Specifications</h2>
        <DynamicSpecs specs={product.specifications} />
      </section>

      {product.variants && product.variants.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 text-xl font-extrabold tracking-tight text-ink">Dimensions &amp; Sizing</h2>
          <SelectionTable variants={product.variants} />
        </section>
      )}

      {product.model_numbering_scheme && (
        <section className="mt-16">
          <ModelDecoder scheme={product.model_numbering_scheme} />
        </section>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: build succeeds and statically generates `/v2/products/<id>` for every product (check the route output lists them).

Run: `npm run dev`, open a `/v2/products/<id>` page (e.g. `/v2/products/hepa-ht-900`). Confirm: CMS chrome, the spec table and instrument visuals render re-skinned in blue, variant table and model decoder appear where present, links go to `/v2/...`. Screenshot. Stop the dev server.

- [ ] **Step 3: Commit**

```
git add -A
git commit -m "feat(v2): Design B product detail (hybrid instruments)

SSG detail pages under /v2 reusing DynamicSpecs, SelectionTable, ModelDecoder
and the instrument visuals, reskinned by the CMS theme; noindex inherited.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 7: Design B contact

**Read first:** spec §6. Apply `frontend-design:frontend-design` for polish.

**Files:**
- Create: `src/app/v2/contact/page.tsx`

**Interfaces:**
- Consumes: `getProducts` (for names); `ContactForm` (props `{ products: string[] }`, reads `?product=` itself). Must keep `ContactForm` inside `<Suspense>` (it uses `useSearchParams`).

- [ ] **Step 1: Create the contact page**

Create `src/app/v2/contact/page.tsx` (mirrors Design A contact data flow; CMS chrome; reuses `ContactForm`):

```tsx
import { Suspense } from "react";
import { getProducts } from "@/lib/db";
import ContactForm from "@/components/ContactForm";
import { Phone, Mail, MapPin } from "lucide-react";

export const revalidate = 3600;

export default async function V2ContactPage() {
  const products = await getProducts();
  const productNames = products.map((p) => p.name);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Reach the engineering desk</h1>
        <p className="mx-auto mt-3 max-w-xl text-lg font-light leading-relaxed text-steel">
          Contact our Beirut team for sizing sheets, certification needs, or project tender pricing.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense fallback={<div className="rounded-sm border border-rule bg-white p-8 text-center text-xs text-steel">Loading form...</div>}>
            <ContactForm products={productNames} />
          </Suspense>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-1">
          <div className="rounded-sm border border-rule bg-white p-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-steel">Vantra Lebanon</h3>
            <div className="mt-4 flex flex-col gap-4 text-xs leading-relaxed text-steel">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-[var(--color-signal)]" />
                <span><strong className="block text-ink">Office</strong>Dora Highway, Beirut, Lebanon</span>
              </div>
              <div className="flex items-start gap-2.5 border-t border-rule pt-4">
                <Phone className="h-4 w-4 shrink-0 text-[var(--color-signal)]" />
                <span><strong className="block text-ink">Phone</strong><span className="font-medium">+961 1 254 870</span></span>
              </div>
              <div className="flex items-start gap-2.5 border-t border-rule pt-4">
                <Mail className="h-4 w-4 shrink-0 text-[var(--color-signal)]" />
                <span><strong className="block text-ink">Email</strong><span className="font-medium">sales.lb@ventra-leb.com</span></span>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-rule bg-white p-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-steel">Global network</h3>
            <p className="mt-2 text-xs leading-relaxed text-steel">
              Backed by the CMS Group engineering and manufacturing network across the UAE, KSA, Kuwait, Oman, and Sri Lanka.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run build` then `npm run test`
Expected: both green.

Run: `npm run dev`, open `/v2/contact` and `/v2/products/hepa-ht-900` then click "Submit Inquiry" to confirm the prefill (`?product=`) works and the form is re-skinned. Screenshot. Stop the dev server.

- [ ] **Step 3: Commit**

```
git add -A
git commit -m "feat(v2): Design B contact page

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 8: Imagery, documentation, and final gate

**Files:**
- Create: `public/v2/*` (3 to 5 images) + `public/v2/CREDITS.md`
- Modify: `src/app/v2/page.tsx` (pass `imageSrc` to `Hero` and the category tiles)
- Modify: `CLAUDE.md`

- [ ] **Step 1: Source royalty-free, domain-true imagery**

Obtain 3 to 5 royalty-free images (Unsplash/Pexels license) of cleanroom / HVAC plant / air filtration / ducting. Save them to `public/v2/` with descriptive names (e.g. `hero-cleanroom.jpg`, `cat-filters.jpg`). Create `public/v2/CREDITS.md` listing each file, its source URL, author, and license. If suitable images cannot be sourced cleanly, skip this task's image wiring and keep the CSS-abstract fallback (the build must never block on an external asset, per spec §7).

- [ ] **Step 2: Wire images into the homepage**

In `src/app/v2/page.tsx`, pass `imageSrc="/v2/hero-cleanroom.jpg"` to `<Hero>` and a per-category `imageSrc` to each `<CategoryTile>` (map category id to an image; fall back to undefined for any without one).

- [ ] **Step 3: Update `CLAUDE.md`**

Add to the Routes section a short subsection documenting: the `(site)` route group (Design A) vs the `/v2` segment (Design B); the scoped `[data-theme="cms"]` theming mechanism in `globals.css` and that it re-skins token-styled shared components with no fork; the Mulish Avenir stand-in in `fonts.ts`; the A/B `ThemeSwitcher`; and that `/v2` is `noindex`. Point to this spec and plan.

- [ ] **Step 4: Final gate**

Run: `npm run build`
Expected: succeeds; route output lists `/`, `/products`, `/products/[slug]`, `/contact`, `/v2`, `/v2/products`, `/v2/products/[slug]`, `/v2/contact`.

Run: `npm run test`
Expected: all suites pass, including `design-switch`.

Run: `npm run dev` and walk both designs end to end via the A/B switcher: `/` <-> `/v2`, `/products` <-> `/v2/products`, a detail page, and `/contact`. Confirm Design A is visually unchanged and Design B matches spec §6. Screenshot the Design B pages for the demo. Stop the dev server.

- [ ] **Step 5: Commit**

```
git add -A
git commit -m "feat(v2): imagery, docs, and final A/B gate

Wire domain-true imagery into the Design B homepage (CSS-abstract fallback
retained); document the /v2 design, route-group split, theming, and font in
CLAUDE.md.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review (completed during planning)

**Spec coverage:** §1/§2 goal and MVC reuse -> all tasks reuse Model+Controller. §3 mechanism (`/v2` segment + nested layout) -> Tasks 1-2. §3 root-layout split -> Task 1. §4 theming scope -> Task 2. §5 reuse map -> Tasks 5-7 reuse `FilterSidebar`/`SearchInput`/`SelectionTable`/`ContactForm`/`DynamicSpecs`/instruments; net-new components in Tasks 2-7. §6 visual direction -> Tasks 4-7 (airy, restrained blue, ghost buttons, hybrid instruments). §7 imagery + fallback -> Task 8 (with fallback wired in Task 4). §8 scope (4 routes) -> Tasks 4-7. §9 shared-component re-skin risk -> verification steps in Tasks 5-7; the grep done during planning confirmed shared components use only token utilities + literal `bg-white` (white on a white CMS ground), so they re-skin cleanly. §10 testing -> `npm run build` gate in every task + the `design-switch` unit test. §11 cost -> 8 tasks.

**Placeholder scan:** No "TBD"/"add error handling"/"similar to Task N". The Task 2 `v2/page.tsx` stub is explicitly temporary and fully replaced in Task 4. Design tasks ship real, runnable code plus a frontend-design polish note (not a placeholder).

**Type consistency:** `counterpartPath(pathname, current)` signature identical in Task 3 test, impl, and `ThemeSwitcher`. `quickSpecs(product)` signature identical in `product-display.ts`, `ProductCard`, and `ProductCardCms`. Component props (`FilterSidebar {categories,brands,availableCounts}`, `SearchInput {defaultValue}`, `ContactForm {products}`, `DynamicSpecs {specs}`, `SelectionTable {variants}`, `ModelDecoder {scheme}`, `ProductGlyph {productType,size,className?}`) match their existing definitions.
