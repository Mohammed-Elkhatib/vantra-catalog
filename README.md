# Vantra Lebanon - Product Catalog Platform

A modern, high-performance, medical-grade HVAC and air filtration product catalog for Vantra Lebanon (ventra-leb.com), a sister company of CMS Global (Dubai, UAE). 

This platform serves as an open, un-gated catalog designed for HVAC engineers, MEP contractors, and facility managers, replacing the slow, gated, and PDF-bound experience of the parent company's site.

---

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router, TypeScript, React 19)
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Asset Storage:** Public static files (PDF catalogs, Technical Data Sheets)

---

## 📂 Project Structure

```text
C:\Users\Admin\airfilters\
├── data/
│   ├── products.json           # Discriminated union records for 15 representative products
│   ├── brands.json             # Brand profiles (Excelair, Premier, Durotape, etc.)
│   └── categories.json         # Taxonomy details and product counts
├── public/
│   └── downloads/
│       ├── tds/                # Sized technical datasheets (TDS) copied from materials
│       └── catalogs/           # Sized general product line catalogs
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Main html structural shell with headers/footers
│   │   ├── page.tsx            # Homepage layout
│   │   ├── products/
│   │   │   ├── page.tsx        # Dynamic list page with URL state management
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # Details template (specs, variant charts, model decoders)
│   │   ├── contact/
│   │   │   └── page.tsx        # Sizing and project pricing quote form
│   │   └── globals.css         # Tailwind v4 directives and base resets
│   ├── components/
│   │   ├── ProductCard.tsx     # Grid cards containing quick specs and PDF buttons
│   │   ├── FilterSidebar.tsx   # Sidebar mapping search checkboxes to query states
│   │   ├── SearchInput.tsx     # Debounced text search box matching URL variables
│   │   ├── DynamicSpecs.tsx    # Renders specification rows based on product type
│   │   ├── SelectionTable.tsx  # Sortable sizing matrices
│   │   └── ModelDecoder.tsx    # Sizing model reference code explains
│   ├── lib/
│   │   └── db.ts               # File-system read wrappers for database access
│   └── types/
│       └── catalog.ts          # Discriminated union types matching schema.json
├── package.json                # NPM manifest
├── tsconfig.json               # TypeScript configurations
├── next.config.ts              # Next.js configurations
└── postcss.config.mjs          # PostCSS configurations
```

---

## 📦 Data Architecture

Every product specification matches `research_and_planning/schema.json` and is validated against TypeScript interfaces in `src/types/catalog.ts` using discriminated unions based on the `spec_type` attribute. 

Supported types:
- `FilterSpec`: EN 1822 ratings (H13/H14), MERV values, final pressure drops, and scan validation status.
- `DamperSpec`: Fire hours (1.5hr/3hr), leakage classes (Class II), actuator configurations, velocity thresholds.
- `SoundAttenuatorSpec`: Decibel insertion loss grids per frequency octave band, casing thickness, liner density.
- `CoatingSpec`: Solid percentages, densities, VOC content, surface flame spreads (ASTM E 84).

---

## 🛠️ Getting Started

### 1. Install Dependencies
Install packages with legacy peer-dependency resolution (necessary for React 19 RC type alignment):
```powershell
npm install --legacy-peer-deps
```

### 2. Run the Development Server
Launch the compiler and live hot-reloader:
```powershell
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
Compile, check type safety, and verify static code generation blocks:
```powershell
npm run build
```

---

## 📈 Quality & Validation Benchmarks

- **Type Safety:** 100% compliant, compiles cleanly under strict TypeScript config rules.
- **Build Verification:** All routes pre-render successfully during compilation (tested via Next.js compiler checks).
- **Asset Integration:** PDFs resolve directly to static local folders (`public/downloads/`), ensuring downloads start instantly without gateways.
