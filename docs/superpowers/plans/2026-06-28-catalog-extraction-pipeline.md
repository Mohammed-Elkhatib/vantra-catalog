# Catalog Extraction Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make adding products from catalog PDFs safe by enforcing that every value is traceable to a source page+quote, independently verified, and schema/plausibility-checked, so the data pipeline fails loudly instead of fabricating.

**Architecture:** A deterministic gate (a pure module `src/lib/data-gate.ts`) checks each product against the JSON schema (ajv), against per-value provenance sidecars (`data/provenance/<id>.json`), and against domain-plausibility rules. The gate runs in the Vitest suite. Extraction/verification is done by Claude Code subagents following `scripts/extract/PROTOCOL.md`; a thin Node driver (`scripts/extract/driver.mjs`) scaffolds sidecars, reports batch state, and delegates the gate to Vitest. No API key, no SDK, no PDF library.

**Tech Stack:** TypeScript (strict), Vitest, ajv + ajv-formats (new dev deps), Node 22 ESM for the driver, draft-07 JSON Schema in `research_and_planning/schema.json`.

## Global Constraints

- Environment is Windows 11 / PowerShell; the driver is plain Node ESM (`.mjs`), runnable cross-platform.
- No em dashes in any code, comment, doc, or commit message.
- Only two new dependencies are permitted: `ajv` and `ajv-formats`, both `devDependencies` (the gate is test/script-only and is never imported by app or client code).
- Conventional commit messages, each ending with the trailer line: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- `npm run test` and `npm run build` must both be green before any task is considered done.
- Keep the data-shape sources in sync per `CLAUDE.md`: `src/types/catalog.ts`, `research_and_planning/schema.json`, `data/products.json`, and `FilterSidebar.tsx` facet lists. This plan touches the schema and products.json; it does not change `Product`/spec field names, so the TS types and FilterSidebar lists need no edits.
- `src/lib/data-gate.ts` is server/test-only. Never import it into a client component or a route.
- Numeric range bounds added to the schema must not reject any of the existing 15 products.

---

## File Structure

| Path | Responsibility | Created/Modified |
| --- | --- | --- |
| `research_and_planning/schema.json` | Product mirror: relative-path url format fix + numeric range bounds. No sidecar fields. | Modify |
| `src/lib/data-gate.ts` | Pure gate logic: structural validator, cite-required path derivation, provenance check, plausibility rules, sidecar validator, `runGate` aggregator. | Create |
| `src/lib/data-gate.test.ts` | Unit tests for the gate functions on small good/bad fixtures. | Create |
| `data/gate.test.ts` | Integration: runs `runGate` over real `products.json` + sidecars + schema; expects zero violations. | Create |
| `data/catalog.test.ts` | Migrate the two inline plausibility tests to call the shared functions (DRY). | Modify |
| `scripts/extract/provenance.schema.json` | JSON schema for a sidecar document (kept out of the Product mirror). | Create |
| `data/provenance/<product-id>.json` | Per-product sidecar (provenance + verify report). Two created in the dry run. | Create (dry run) |
| `scripts/extract/driver.mjs` | Thin CLI: `scaffold`, `status`, `gate`. No LLM calls. | Create |
| `scripts/extract/PROTOCOL.md` | Extraction + verification runbook (the subagent prompts and rules). | Create |
| `CLAUDE.md`, `research_and_planning/BUILD_STATUS.md` | Document the pipeline, the gate, the new dep, and status. | Modify |

---

## Task 1: ajv structural validation + schema fixes

**Files:**
- Modify: `package.json` (add `ajv`, `ajv-formats` to devDependencies)
- Modify: `research_and_planning/schema.json` (url format + numeric ranges)
- Create: `src/lib/data-gate.ts` (structural validator only, for now)
- Create: `data/gate.test.ts` (all current products pass structural validation)
- Create: `src/lib/data-gate.test.ts` (a malformed product fails)

**Interfaces:**
- Produces: `createProductValidator(schema: unknown): (product: unknown) => string[]` returns `[]` when valid, else human-readable error strings. Later tasks import this.

- [ ] **Step 1: Install the dependencies**

Run:
```
npm install -D ajv ajv-formats
```
Expected: `package.json` devDependencies now include `ajv` and `ajv-formats`; `package-lock.json` updated; install succeeds.

- [ ] **Step 2: Fix relative-path url formats in the schema**

The data uses relative paths like `/downloads/tds/HEPA_HT_900.pdf`, which are URI *references*, not absolute URIs. In `research_and_planning/schema.json` change the two affected fields (leave the absolute `Brand.logo_url` / `Brand.website` as `"uri"`):

In `definitions.Document.properties.url`:
```json
"url": { "type": "string", "format": "uri-reference" },
```
In `definitions.Product.properties.images.items.properties.url`:
```json
"url": { "type": "string", "format": "uri-reference" },
```

- [ ] **Step 3: Add numeric range bounds (must not reject the existing 15 products)**

In `research_and_planning/schema.json`, replace these property declarations with bounded versions.

`definitions.FilterSpec.properties`:
```json
"mpps_efficiency_pct": { "type": "number", "minimum": 0, "maximum": 100 },
"efficiency_at_0_3_micron_pct": { "type": "number", "minimum": 0, "maximum": 100 },
"max_temperature_f": { "type": "number", "minimum": -50, "maximum": 1200 },
"max_temperature_c": { "type": "number", "minimum": -50, "maximum": 650 },
"final_pressure_drop_in_wg": { "type": "number", "minimum": 0, "maximum": 5 }
```

`definitions.DamperSpec.properties`:
```json
"temperature_rating_f": { "type": "number", "minimum": 0, "maximum": 2000 }
```

`definitions.CoatingSpec.properties`:
```json
"density_gm_cc": { "type": "number", "minimum": 0 },
"solid_content_pct": { "type": "number", "minimum": 0, "maximum": 100 },
"specific_gravity": { "type": "number", "minimum": 0 },
"voc_content_g_l": { "type": "number", "minimum": 0 },
"drying_time_touch_hours": { "type": "number", "minimum": 0 },
"drying_time_thorough_hours": { "type": "number", "minimum": 0 },
"shelf_life_months": { "type": "integer", "minimum": 0 },
"flame_spread_index": { "type": "integer", "minimum": 0, "maximum": 200 },
"smoke_developed_index": { "type": "integer", "minimum": 0, "maximum": 450 }
```

`definitions.Variant.properties.performance.properties`:
```json
"airflow_cfm": { "type": "number", "minimum": 0 },
"airflow_cmh": { "type": "number", "minimum": 0 },
"pressure_drop_in_wg": { "type": "number", "minimum": 0 },
"media_area_sqft": { "type": "number", "minimum": 0 },
"velocity_fpm": { "type": "number", "minimum": 0 }
```

- [ ] **Step 4: Write the failing integration test**

Create `data/gate.test.ts`:
```ts
import { test, expect } from "vitest";
import products from "./products.json";
import schema from "../research_and_planning/schema.json";
import { createProductValidator } from "@/lib/data-gate";

/* eslint-disable @typescript-eslint/no-explicit-any */
const all = products as any[];

test("every product passes structural schema validation", () => {
  const validate = createProductValidator(schema);
  const failures: string[] = [];
  for (const p of all) {
    const errs = validate(p);
    if (errs.length) failures.push(`${p.id}: ${errs.join("; ")}`);
  }
  expect(failures, failures.join("\n")).toHaveLength(0);
});
```

- [ ] **Step 5: Run it to confirm it fails**

Run:
```
npx vitest run data/gate.test.ts
```
Expected: FAIL, cannot resolve `@/lib/data-gate` (module not created yet).

- [ ] **Step 6: Implement the structural validator**

Create `src/lib/data-gate.ts`:
```ts
import Ajv from "ajv";
import addFormats from "ajv-formats";

/* The gate is server/test-only. Never import this module into a client component or route. */

/** Maps a product spec_type discriminator to its schema definition name. */
const SPEC_DEF: Record<string, string> = {
  filter: "FilterSpec",
  damper: "DamperSpec",
  sound_attenuator: "SoundAttenuatorSpec",
  coating: "CoatingSpec",
  flex_connector: "FlexConnectorSpec",
  flex_duct: "FlexDuctSpec",
  ecology_unit: "EcologyUnitSpec",
  air_outlet: "AirOutletSpec",
  tape: "TapeSpec",
  generic: "GenericSpec",
};

/**
 * Compiles a validator for a single Product against #/definitions/Product.
 * Returns a function that yields human-readable error strings ([] when valid).
 */
export function createProductValidator(schema: unknown): (product: unknown) => string[] {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  ajv.addSchema(schema as object, "vantra");
  const validate = ajv.getSchema("vantra#/definitions/Product");
  if (!validate) throw new Error("could not resolve #/definitions/Product in schema");
  return (product: unknown) => {
    if (validate(product)) return [];
    return (validate.errors ?? []).map(
      (e) => `${e.instancePath || "(root)"} ${e.message ?? "invalid"}`
    );
  };
}

export { SPEC_DEF };
```

- [ ] **Step 7: Run the integration test to confirm it passes**

Run:
```
npx vitest run data/gate.test.ts
```
Expected: PASS (all 15 products validate).

- [ ] **Step 8: Write a negative unit test**

Create `src/lib/data-gate.test.ts`:
```ts
import { test, expect } from "vitest";
import schema from "../../research_and_planning/schema.json";
import { createProductValidator } from "./data-gate";

const validate = createProductValidator(schema);

const baseProduct = {
  id: "x-1",
  brand_id: "excelair",
  name: "Test",
  product_type: "hepa_filter",
  category: "Air Filters",
  specifications: { spec_type: "filter", merv_rating: 14 },
};

test("a valid minimal product passes", () => {
  expect(validate(baseProduct)).toHaveLength(0);
});

test("an out-of-range numeric is rejected", () => {
  const bad = {
    ...baseProduct,
    specifications: { spec_type: "filter", mpps_efficiency_pct: 250 },
  };
  expect(validate(bad).length).toBeGreaterThan(0);
});

test("a non-numeric where a number is required is rejected", () => {
  const bad = {
    ...baseProduct,
    specifications: { spec_type: "filter", merv_rating: "abc" },
  };
  expect(validate(bad).length).toBeGreaterThan(0);
});
```

- [ ] **Step 9: Run the full suite and the build**

Run:
```
npx vitest run
```
Expected: PASS (existing 24 tests + the new structural tests).
Run:
```
npm run build
```
Expected: build green, typecheck clean.

- [ ] **Step 10: Commit**

Run:
```
git add package.json package-lock.json research_and_planning/schema.json src/lib/data-gate.ts src/lib/data-gate.test.ts data/gate.test.ts
git commit -m "feat(gate): ajv structural validation of products against schema

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Cite-required path derivation + provenance check

**Files:**
- Modify: `src/lib/data-gate.ts` (add the `Sidecar` type, `citeRequiredPaths`, `checkProvenance`)
- Modify: `src/lib/data-gate.test.ts` (unit tests for both)

**Interfaces:**
- Consumes: `SPEC_DEF` from Task 1.
- Produces:
  - `ProvenanceEntry`, `Sidecar` types (shapes below).
  - `citeRequiredPaths(product: any, schema: any): string[]` returns dotted field paths that must be cited.
  - `checkProvenance(product: any, sidecar: Sidecar | undefined, schema: any): string[]` returns violation messages ([] when complete).

- [ ] **Step 1: Write the failing unit tests**

Add to `src/lib/data-gate.test.ts`:
```ts
import {
  citeRequiredPaths,
  checkProvenance,
  type Sidecar,
} from "./data-gate";

const coating = {
  id: "c-1",
  specifications: {
    spec_type: "coating",
    product_function: "adhesive", // enum -> cite-required
    base_material: "Polychloroprene Synthetic Rubber", // free-text string -> NOT cite-required
    solid_content_pct: 28, // number -> cite-required
    flame_spread_index: 0, // number -> cite-required
  },
  certifications: [{ abbreviation: "UL", listing_number: "R-27945", type: "listed" }],
};

test("citeRequiredPaths picks numbers, enums and certs but not free-text strings", () => {
  const paths = citeRequiredPaths(coating, schema).sort();
  expect(paths).toContain("specifications.product_function");
  expect(paths).toContain("specifications.solid_content_pct");
  expect(paths).toContain("specifications.flame_spread_index");
  expect(paths).toContain("certifications.0");
  expect(paths).not.toContain("specifications.base_material");
});

const goodSidecar: Sidecar = {
  product_id: "c-1",
  source_pdf: "material/x.pdf",
  batch: "t",
  state: "verified",
  fields: {
    "specifications.product_function": { value: "adhesive", page: 1, quote: "Type: Adhesive", verdict: "confirmed" },
    "specifications.solid_content_pct": { value: 28, page: 1, quote: "Solids: 28%", verdict: "confirmed" },
    "specifications.flame_spread_index": { value: 0, page: 2, quote: "Flame Spread: 0", verdict: "confirmed" },
    "certifications.0": { value: "R-27945", page: 2, quote: "UL Listed R-27945", verdict: "confirmed" },
  },
};

test("checkProvenance passes when every cite-required field is confirmed", () => {
  expect(checkProvenance(coating, goodSidecar, schema)).toHaveLength(0);
});

test("checkProvenance fails when a sidecar is missing entirely", () => {
  expect(checkProvenance(coating, undefined, schema).length).toBeGreaterThan(0);
});

test("checkProvenance fails on a missing or unconfirmed field", () => {
  const partial: Sidecar = {
    ...goodSidecar,
    fields: {
      ...goodSidecar.fields,
      "specifications.solid_content_pct": { value: 28, page: 1, quote: "Solids: 28%", verdict: "mismatch" },
    },
  };
  delete (partial.fields as any)["specifications.flame_spread_index"];
  const errs = checkProvenance(coating, partial, schema);
  expect(errs.join(" ")).toMatch(/flame_spread_index/);
  expect(errs.join(" ")).toMatch(/not confirmed/);
});

test("checkProvenance honors a recorded exception", () => {
  const partial: Sidecar = { ...goodSidecar, fields: { ...goodSidecar.fields }, exceptions: [{ field: "certifications.0", reason: "verbally confirmed by client 2026-06-28" }] };
  delete (partial.fields as any)["certifications.0"];
  expect(checkProvenance(coating, partial, schema)).toHaveLength(0);
});
```

- [ ] **Step 2: Run to confirm failure**

Run:
```
npx vitest run src/lib/data-gate.test.ts
```
Expected: FAIL, `citeRequiredPaths` / `checkProvenance` / `Sidecar` not exported.

- [ ] **Step 3: Implement the types and functions**

Add to `src/lib/data-gate.ts`:
```ts
export type Verdict =
  | "confirmed"
  | "mismatch"
  | "quote-not-found"
  | "value-not-in-quote"
  | "uncertain";

export interface ProvenanceEntry {
  value: unknown;
  page: number;
  quote: string;
  verdict: Verdict;
  note?: string;
}

export interface Sidecar {
  product_id: string;
  source_pdf: string;
  batch: string;
  state: "todo" | "extracted" | "verified" | "gated" | "merged" | "flagged";
  fields: Record<string, ProvenanceEntry>;
  free_text_sources?: Record<string, number[]>;
  exceptions?: { field: string; reason: string }[];
}

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Field paths that must carry a citation: spec fields that are numeric/boolean
 * or schema-enum (high-stakes), plus each certification, plus each numeric
 * variant-performance value. Free-text spec strings are excluded (they cite
 * pages via the sidecar's free_text_sources, not per-value quotes).
 */
export function citeRequiredPaths(product: any, schema: any): string[] {
  const paths: string[] = [];
  const spec = product.specifications ?? {};
  const defName = SPEC_DEF[spec.spec_type];
  const props = defName ? schema?.definitions?.[defName]?.properties ?? {} : {};
  for (const [key, value] of Object.entries(spec)) {
    if (key === "spec_type") continue;
    const propSchema: any = props[key];
    const isEnum = Array.isArray(propSchema?.enum);
    const t = propSchema?.type;
    const numericOrBool =
      typeof value === "number" ||
      typeof value === "boolean" ||
      t === "number" ||
      t === "integer" ||
      t === "boolean";
    if (isEnum || numericOrBool) paths.push(`specifications.${key}`);
  }
  (product.certifications ?? []).forEach((_: any, i: number) =>
    paths.push(`certifications.${i}`)
  );
  (product.variants ?? []).forEach((v: any, i: number) => {
    const perf = v.performance ?? {};
    for (const [k, val] of Object.entries(perf)) {
      if (typeof val === "number") paths.push(`variants.${i}.performance.${k}`);
    }
  });
  return paths;
}

/** Verifies every cite-required field has a confirmed sidecar entry (or a recorded exception). */
export function checkProvenance(
  product: any,
  sidecar: Sidecar | undefined,
  schema: any
): string[] {
  const required = citeRequiredPaths(product, schema);
  if (!sidecar) {
    return [
      `no provenance sidecar for source_verified product (needs citations for: ${required.join(", ")})`,
    ];
  }
  const exceptions = new Set((sidecar.exceptions ?? []).map((e) => e.field));
  const errs: string[] = [];
  for (const path of required) {
    if (exceptions.has(path)) continue;
    const entry = sidecar.fields?.[path];
    if (!entry) {
      errs.push(`missing citation for ${path}`);
      continue;
    }
    if (entry.verdict !== "confirmed")
      errs.push(`citation for ${path} not confirmed (verdict: ${entry.verdict})`);
    if (!entry.quote || !entry.quote.trim())
      errs.push(`citation for ${path} has empty quote`);
    if (typeof entry.page !== "number" || entry.page < 1)
      errs.push(`citation for ${path} has invalid page`);
  }
  return errs;
}
```

- [ ] **Step 4: Run unit tests to confirm pass**

Run:
```
npx vitest run src/lib/data-gate.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

Run:
```
git add src/lib/data-gate.ts src/lib/data-gate.test.ts
git commit -m "feat(gate): cite-required path derivation and provenance check

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Plausibility rules (shared, DRY with existing tests)

**Files:**
- Modify: `src/lib/data-gate.ts` (add `checkPlausibility`)
- Modify: `src/lib/data-gate.test.ts` (unit tests)
- Modify: `data/catalog.test.ts` (replace the two inline plausibility tests with calls to the shared function)

**Interfaces:**
- Produces: `checkPlausibility(product: any): string[]` returns violation messages ([] when plausible).

- [ ] **Step 1: Write the failing unit tests**

Add to `src/lib/data-gate.test.ts`:
```ts
import { checkPlausibility } from "./data-gate";

test("solvent coating claiming flame_spread_index 0 is flagged", () => {
  const p = { id: "p", specifications: { spec_type: "coating", base_material: "Solvent-based Acrylic", flame_spread_index: 0 } };
  expect(checkPlausibility(p).join(" ")).toMatch(/flame_spread_index/);
});

test("pending-tds product linking a TDS is flagged", () => {
  const p = {
    id: "p",
    specifications: { spec_type: "filter" },
    metadata: { verification_status: "representative_pending_tds" },
    documents: [{ type: "technical_data_sheet", url: "/x.pdf" }],
  };
  expect(checkPlausibility(p).join(" ")).toMatch(/technical_data_sheet/);
});

test("a clean product yields no plausibility violations", () => {
  const p = { id: "p", specifications: { spec_type: "coating", base_material: "Synthetic Rubber", flame_spread_index: 0 } };
  expect(checkPlausibility(p)).toHaveLength(0);
});
```

- [ ] **Step 2: Run to confirm failure**

Run:
```
npx vitest run src/lib/data-gate.test.ts
```
Expected: FAIL, `checkPlausibility` not exported.

- [ ] **Step 3: Implement `checkPlausibility`**

Add to `src/lib/data-gate.ts`:
```ts
/**
 * Cross-field domain plausibility rules. Extend this list as new failure modes
 * are found. Each returns a message when the product is implausible.
 */
export function checkPlausibility(product: any): string[] {
  const errs: string[] = [];
  const s = product.specifications ?? {};
  if (
    s.spec_type === "coating" &&
    /solvent/i.test(s.base_material ?? "") &&
    s.flame_spread_index === 0
  ) {
    errs.push("solvent-based coating claims flame_spread_index 0 (implausible)");
  }
  if (product.metadata?.verification_status === "representative_pending_tds") {
    const hasTds = (product.documents ?? []).some(
      (d: any) => d.type === "technical_data_sheet"
    );
    if (hasTds)
      errs.push("representative_pending_tds product links a technical_data_sheet");
  }
  return errs;
}
```

- [ ] **Step 4: Run unit tests to confirm pass**

Run:
```
npx vitest run src/lib/data-gate.test.ts
```
Expected: PASS.

- [ ] **Step 5: Migrate the two inline tests in `data/catalog.test.ts` to the shared function**

In `data/catalog.test.ts`, add the import near the top:
```ts
import { checkPlausibility } from "@/lib/data-gate";
```
Replace the existing test `"products flagged representative_pending_tds never link a technical_data_sheet"` and the test `"solvent-based coatings do not claim a zero flame-spread index"` with a single shared-rule test:
```ts
test("all products pass the shared domain-plausibility rules", () => {
  const failures: string[] = [];
  for (const p of all) {
    const errs = checkPlausibility(p);
    if (errs.length) failures.push(`${p.id}: ${errs.join("; ")}`);
  }
  expect(failures, failures.join("\n")).toHaveLength(0);
});
```

- [ ] **Step 6: Run the full suite**

Run:
```
npx vitest run
```
Expected: PASS. Net test count is unchanged-or-lower in `catalog.test.ts` (two tests became one) and higher in the gate tests; all green.

- [ ] **Step 7: Commit**

Run:
```
git add src/lib/data-gate.ts src/lib/data-gate.test.ts data/catalog.test.ts
git commit -m "refactor(gate): share plausibility rules between gate and catalog tests

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Sidecar schema + `runGate` aggregator + full integration gate

**Files:**
- Create: `scripts/extract/provenance.schema.json`
- Modify: `src/lib/data-gate.ts` (add `createSidecarValidator`, `Violation`, `runGate`)
- Modify: `src/lib/data-gate.test.ts` (unit test for `runGate`)
- Modify: `data/gate.test.ts` (load real sidecars, run the full gate)

**Interfaces:**
- Consumes: `createProductValidator`, `checkProvenance`, `checkPlausibility`, `Sidecar` from earlier tasks.
- Produces:
  - `Violation` type `{ productId: string; rule: "structural" | "provenance" | "plausibility" | "sidecar"; message: string }`.
  - `createSidecarValidator(provSchema: unknown): (sidecar: unknown) => string[]`.
  - `runGate(input: { products: any[]; sidecars: Record<string, Sidecar>; schema: any; provenanceSchema: any }): Violation[]`.

- [ ] **Step 1: Create the sidecar schema**

Create `scripts/extract/provenance.schema.json`:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Vantra provenance sidecar",
  "type": "object",
  "properties": {
    "product_id": { "type": "string", "pattern": "^[a-z0-9-]+$" },
    "source_pdf": { "type": "string" },
    "batch": { "type": "string" },
    "state": {
      "type": "string",
      "enum": ["todo", "extracted", "verified", "gated", "merged", "flagged"]
    },
    "fields": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "value": {},
          "page": { "type": "integer", "minimum": 1 },
          "quote": { "type": "string", "minLength": 1 },
          "verdict": {
            "type": "string",
            "enum": ["confirmed", "mismatch", "quote-not-found", "value-not-in-quote", "uncertain"]
          },
          "note": { "type": "string" }
        },
        "required": ["page", "quote", "verdict"]
      }
    },
    "free_text_sources": {
      "type": "object",
      "additionalProperties": { "type": "array", "items": { "type": "integer", "minimum": 1 } }
    },
    "exceptions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": { "field": { "type": "string" }, "reason": { "type": "string" } },
        "required": ["field", "reason"]
      }
    }
  },
  "required": ["product_id", "source_pdf", "batch", "state", "fields"]
}
```

- [ ] **Step 2: Write the failing unit test for `runGate`**

Add to `src/lib/data-gate.test.ts`:
```ts
import { runGate, createSidecarValidator, type Violation } from "./data-gate";
import provenanceSchema from "../../scripts/extract/provenance.schema.json";

test("runGate flags a source_verified product with no sidecar", () => {
  const products = [
    {
      id: "c-1",
      brand_id: "premier",
      name: "T",
      product_type: "adhesive",
      category: "Coatings Adhesives & Sealants",
      specifications: { spec_type: "coating", product_function: "adhesive", solid_content_pct: 28 },
      metadata: { verification_status: "source_verified" },
    },
  ];
  const violations: Violation[] = runGate({ products, sidecars: {}, schema, provenanceSchema });
  expect(violations.some((v) => v.rule === "provenance")).toBe(true);
});

test("runGate ignores provenance for products that are not source_verified", () => {
  const products = [
    {
      id: "c-2",
      brand_id: "premier",
      name: "T",
      product_type: "adhesive",
      category: "Coatings Adhesives & Sealants",
      specifications: { spec_type: "coating", product_function: "adhesive", solid_content_pct: 28 },
    },
  ];
  const violations = runGate({ products, sidecars: {}, schema, provenanceSchema });
  expect(violations.filter((v) => v.rule === "provenance")).toHaveLength(0);
});

test("createSidecarValidator rejects a malformed sidecar", () => {
  const validate = createSidecarValidator(provenanceSchema);
  expect(validate({ product_id: "c-1" }).length).toBeGreaterThan(0);
});
```

- [ ] **Step 3: Run to confirm failure**

Run:
```
npx vitest run src/lib/data-gate.test.ts
```
Expected: FAIL, `runGate` / `createSidecarValidator` / `Violation` not exported.

- [ ] **Step 4: Implement the aggregator and sidecar validator**

Add to `src/lib/data-gate.ts`:
```ts
export interface Violation {
  productId: string;
  rule: "structural" | "provenance" | "plausibility" | "sidecar";
  message: string;
}

/** Compiles a validator for a single sidecar document. */
export function createSidecarValidator(
  provSchema: unknown
): (sidecar: unknown) => string[] {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(provSchema as object);
  return (sidecar: unknown) => {
    if (validate(sidecar)) return [];
    return (validate.errors ?? []).map(
      (e) => `${e.instancePath || "(root)"} ${e.message ?? "invalid"}`
    );
  };
}

/**
 * Runs the full deterministic gate over a product set. Structural and
 * plausibility checks apply to every product; provenance applies only to
 * products marked metadata.verification_status === "source_verified".
 * Any present sidecar is structurally validated.
 */
export function runGate(input: {
  products: any[];
  sidecars: Record<string, Sidecar>;
  schema: any;
  provenanceSchema: any;
}): Violation[] {
  const { products, sidecars, schema, provenanceSchema } = input;
  const validateProduct = createProductValidator(schema);
  const validateSidecar = createSidecarValidator(provenanceSchema);
  const out: Violation[] = [];
  for (const p of products) {
    for (const m of validateProduct(p))
      out.push({ productId: p.id, rule: "structural", message: m });
    for (const m of checkPlausibility(p))
      out.push({ productId: p.id, rule: "plausibility", message: m });
    const sidecar = sidecars[p.id];
    if (sidecar)
      for (const m of validateSidecar(sidecar))
        out.push({ productId: p.id, rule: "sidecar", message: m });
    if (p.metadata?.verification_status === "source_verified")
      for (const m of checkProvenance(p, sidecar, schema))
        out.push({ productId: p.id, rule: "provenance", message: m });
  }
  return out;
}
```

- [ ] **Step 5: Run unit tests to confirm pass**

Run:
```
npx vitest run src/lib/data-gate.test.ts
```
Expected: PASS.

- [ ] **Step 6: Upgrade `data/gate.test.ts` to run the full gate over real data**

Replace the body of `data/gate.test.ts` with:
```ts
import { test, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import products from "./products.json";
import schema from "../research_and_planning/schema.json";
import provenanceSchema from "../scripts/extract/provenance.schema.json";
import { runGate, type Sidecar } from "@/lib/data-gate";

/* eslint-disable @typescript-eslint/no-explicit-any */
const all = products as any[];

function loadSidecars(): Record<string, Sidecar> {
  const dir = path.join(process.cwd(), "data", "provenance");
  const out: Record<string, Sidecar> = {};
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith(".json")) continue;
    const sc = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as Sidecar;
    out[sc.product_id] = sc;
  }
  return out;
}

test("the full data gate reports no violations", () => {
  const violations = runGate({
    products: all,
    sidecars: loadSidecars(),
    schema,
    provenanceSchema,
  });
  const report = violations.map((v) => `${v.productId} [${v.rule}] ${v.message}`).join("\n");
  expect(violations, report).toHaveLength(0);
});
```

- [ ] **Step 7: Run the full suite and the build**

Run:
```
npx vitest run
```
Expected: PASS (no `source_verified` products exist yet, so provenance is not enforced; structural + plausibility + any-present-sidecar checks pass).
Run:
```
npm run build
```
Expected: green.

- [ ] **Step 8: Commit**

Run:
```
git add scripts/extract/provenance.schema.json src/lib/data-gate.ts src/lib/data-gate.test.ts data/gate.test.ts
git commit -m "feat(gate): runGate aggregator and sidecar schema validation

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: The driver CLI

**Files:**
- Create: `scripts/extract/driver.mjs`

**Interfaces:**
- Produces a CLI with three commands: `scaffold <product-id> --pdf <path> --batch <name>`, `status`, `gate`. The driver makes no LLM calls. It is a thin orchestrator verified by run/expected-output steps (the heavy logic it relies on, the gate, is fully unit- and integration-tested in Tasks 1-4).

- [ ] **Step 1: Implement the driver**

Create `scripts/extract/driver.mjs`:
```js
#!/usr/bin/env node
// Thin orchestration CLI for the catalog extraction pipeline.
// Commands: scaffold, status, gate. No LLM calls.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");
const provDir = path.join(repoRoot, "data", "provenance");

function parseFlags(args) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      flags[args[i].slice(2)] = args[i + 1];
      i++;
    } else {
      positional.push(args[i]);
    }
  }
  return { flags, positional };
}

function scaffold(positional, flags) {
  const id = positional[0];
  if (!id || !flags.pdf || !flags.batch) {
    console.error("usage: scaffold <product-id> --pdf <path> --batch <name>");
    process.exit(2);
  }
  fs.mkdirSync(provDir, { recursive: true });
  const file = path.join(provDir, `${id}.json`);
  if (fs.existsSync(file)) {
    console.error(`refusing to overwrite existing sidecar: ${file}`);
    process.exit(2);
  }
  const skeleton = {
    product_id: id,
    source_pdf: flags.pdf,
    batch: flags.batch,
    state: "todo",
    fields: {},
    free_text_sources: {},
    exceptions: [],
  };
  fs.writeFileSync(file, JSON.stringify(skeleton, null, 2) + "\n");
  console.log(`created ${path.relative(repoRoot, file)}`);
}

function status() {
  if (!fs.existsSync(provDir)) {
    console.log("no sidecars yet");
    return;
  }
  const rows = fs
    .readdirSync(provDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const sc = JSON.parse(fs.readFileSync(path.join(provDir, f), "utf8"));
      return `${sc.state.padEnd(10)} ${sc.product_id}  (${sc.batch})`;
    });
  console.log(rows.length ? rows.join("\n") : "no sidecars yet");
}

function gate() {
  const res = spawnSync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["vitest", "run", "data/gate.test.ts"],
    { cwd: repoRoot, stdio: "inherit" }
  );
  process.exit(res.status ?? 1);
}

const [cmd, ...rest] = process.argv.slice(2);
const { flags, positional } = parseFlags(rest);
switch (cmd) {
  case "scaffold":
    scaffold(positional, flags);
    break;
  case "status":
    status();
    break;
  case "gate":
    gate();
    break;
  default:
    console.error("usage: driver.mjs <scaffold|status|gate> [...]");
    process.exit(2);
}
```

- [ ] **Step 2: Verify `scaffold` creates a sidecar**

Run:
```
node scripts/extract/driver.mjs scaffold tmp-smoke --pdf material/x.pdf --batch smoke
```
Expected output: `created data/provenance/tmp-smoke.json`, and the file exists with `"state": "todo"`.

- [ ] **Step 3: Verify `status` lists it**

Run:
```
node scripts/extract/driver.mjs status
```
Expected output includes a line: `todo       tmp-smoke  (smoke)`.

- [ ] **Step 4: Verify `gate` delegates to Vitest**

Run:
```
node scripts/extract/driver.mjs gate
```
Expected: Vitest runs `data/gate.test.ts`. NOTE: the smoke sidecar `tmp-smoke` has no matching product, so it is simply ignored by the gate (the gate iterates products, not sidecars); the run passes. Confirm exit code 0.

- [ ] **Step 5: Remove the smoke sidecar**

Run:
```
git clean -f data/provenance/tmp-smoke.json 2>/dev/null; rm -f data/provenance/tmp-smoke.json
```
Expected: `data/provenance/tmp-smoke.json` no longer exists.

- [ ] **Step 6: Commit**

Run:
```
git add scripts/extract/driver.mjs
git commit -m "feat(extract): add thin driver CLI (scaffold, status, gate)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 6: The extraction + verification protocol (runbook)

**Files:**
- Create: `scripts/extract/PROTOCOL.md`

**Interfaces:**
- Produces the human/subagent-facing runbook. No code. Defines the two subagent prompts and the rules they enforce, so a batch can be run repeatably.

- [ ] **Step 1: Write the protocol**

Create `scripts/extract/PROTOCOL.md` with this content:
```markdown
# Catalog extraction protocol

Goal: add products from catalog PDFs such that every cite-required value is
traceable to a source page and verbatim quote, independently verified, and
passes the gate (`data/gate.test.ts`). See the design at
`docs/superpowers/specs/2026-06-28-catalog-extraction-pipeline-design.md`.

A batch is one catalog PDF (or a page range). Run these steps per product.

## 0. Scaffold

For each product in the batch:

    node scripts/extract/driver.mjs scaffold <product-id> --pdf "<path under material/>" --batch <batch-name>

This writes `data/provenance/<product-id>.json` in state `todo`.

## 1. Extract (subagent A)

Dispatch a fresh subagent with ONLY this job. Prompt template:

> You are extracting one product from a source PDF into JSON. Read ONLY the
> cited pages of `<pdf>` (pages `<range>`). Produce JSON with two parts:
> (1) the product fields per `src/types/catalog.ts`; (2) a `fields` map keyed
> by dotted field path (e.g. `specifications.solid_content_pct`,
> `certifications.0`) where each entry is `{ value, page, quote }` and `quote`
> is text copied verbatim from that page that contains the value.
> Rules: emit a value ONLY if it appears on the page. Never infer, never round,
> never carry a value over from an adjacent product on the page. If a value is
> absent, omit the field. If a cell is ambiguous or spans products, set the
> field's entry verdict to `uncertain` with a `note`. For free-text fields
> (description, features) do not quote per phrase; instead list the page numbers
> they summarize under `free_text_sources`.

Write the result into the sidecar `fields` / `free_text_sources`, set
`state: "extracted"`. Do NOT write the product into `data/products.json` yet.

## 2. Verify (subagent B, a SEPARATE invocation)

Dispatch a DIFFERENT fresh subagent. It must not see subagent A's reasoning.
Prompt template:

> You are verifying extracted values against a source PDF. For each entry in the
> sidecar `fields`, open the cited page of `<pdf>` and decide a verdict:
> `confirmed` (the quote is on the page AND the value matches it),
> `mismatch` (quote present, value does not match),
> `quote-not-found` (the quote is not on the page), or
> `value-not-in-quote` (value cannot be derived from the quote).
> Do not change values. Only write the `verdict` (and a `note` on any
> non-confirmed field).

Set `state: "verified"`.

## 3. Gate and merge

- Only once every cite-required field is `confirmed` (or has a recorded
  `exceptions` entry) may the product be written into `data/products.json` with
  `metadata.verification_status: "source_verified"`, `metadata.source_pdf`, and
  `metadata.last_verified` (today's date).
- A cross-check that proves the pipeline: a `confirmed` value in the sidecar must
  equal the value written into `products.json`.
- Run the gate:

      npm run test

  The gate enforces structure, provenance completeness, and plausibility. If it
  fails, fix the data or the citation; never weaken the gate to pass.
- Set the sidecar `state: "merged"`.

## Field path conventions

- Spec fields: `specifications.<key>` (e.g. `specifications.flame_spread_index`).
- Certifications: `certifications.<index>` (the whole entry, proven by one quote).
- Variant performance: `variants.<index>.performance.<key>`.

## What needs a citation (cite-required)

Numeric and boolean spec fields, schema-enum spec fields, every certification,
and every numeric variant-performance value. Free-text strings (media, frame,
base material, descriptions, features) are cited at page granularity via
`free_text_sources`, not per value.
```

- [ ] **Step 2: Commit**

Run:
```
git add scripts/extract/PROTOCOL.md
git commit -m "docs(extract): add extraction and verification protocol

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 7: Dry run on two products (prove the pipeline)

**Files:**
- Create: `data/provenance/hepa-ht-900.json`
- Create: `data/provenance/premier-81-10-ul.json`
- Modify: `data/products.json` (add `metadata.verification_status: "source_verified"` + `source_pdf` + `last_verified` to those two products only)

**Interfaces:**
- Consumes the protocol (Task 6), the driver (Task 5), and the gate (Tasks 1-4). No new code.

**Why these two:** both already have an authoritative single-product TDS in `material/` (`Air Filters - EXCELAIR - UAE/HEPA HT 900.pdf` and `PREMIER - UAE/PREMIER UL/81-10 UL-Duct Adhesive.pdf`), and their values were corrected in the data-verification epic. Re-deriving them with citations proves the pipeline reproduces the known-good values.

- [ ] **Step 1: Scaffold both sidecars**

Run:
```
node scripts/extract/driver.mjs scaffold hepa-ht-900 --pdf "material/Air Filters - EXCELAIR - UAE/HEPA HT 900.pdf" --batch dry-run
node scripts/extract/driver.mjs scaffold premier-81-10-ul --pdf "material/PREMIER - UAE/PREMIER UL/81-10 UL-Duct Adhesive.pdf" --batch dry-run
```
Expected: two new files under `data/provenance/`.

- [ ] **Step 2: Extract (subagent A) for `hepa-ht-900`**

Following PROTOCOL.md section 1, dispatch a fresh subagent to read the HEPA HT 900 TDS and fill the sidecar `fields` for every cite-required path. The cite-required paths for the current product are:
`specifications.filter_classification_en1822`, `specifications.mpps_efficiency_pct`, `specifications.efficiency_at_0_3_micron_pct`, `specifications.construction_type`, `specifications.max_temperature_f`, `specifications.max_temperature_c`, `specifications.final_pressure_drop_in_wg`, `specifications.scan_tested`, `certifications.0`, and the numeric performance values under `variants.0.performance.*` and `variants.1.performance.*`.
Set the sidecar `state: "extracted"`.

- [ ] **Step 3: Verify (subagent B) for `hepa-ht-900`**

Following PROTOCOL.md section 2, dispatch a SEPARATE fresh subagent to set a `verdict` per field. Set `state: "verified"`. Every cite-required field must end `confirmed`. If any field cannot be confirmed from the TDS, that value is unsupported: either correct `products.json` to the supported value or record an `exceptions` entry with a reason. Do not invent a quote.

- [ ] **Step 4: Repeat extract + verify for `premier-81-10-ul`**

Cite-required paths for this product: `specifications.product_function`, `specifications.solid_content_pct`, `specifications.specific_gravity`, `specifications.service_temp_min_c`, `specifications.service_temp_max_c`, `specifications.application_temp_min_c`, `specifications.application_temp_max_c`, `specifications.drying_time_touch_hours`, `specifications.shelf_life_months`, `specifications.water_resistance`, `specifications.chemical_resistance`, `specifications.flame_spread_index`, `specifications.smoke_developed_index`, and `certifications.0`. (Free-text: `base_material`, `colour`, `flash_point`, `coverage_rate`, `packing`, `application_method`, description, features are page-cited via `free_text_sources`.) Set `state: "verified"`.

- [ ] **Step 5: Mark the two products source_verified in `products.json`**

For `hepa-ht-900` and `premier-81-10-ul` only, add a `metadata` block (place it after `model_numbering_scheme` for hepa, after `documents` for premier; match existing key ordering style):
```json
"metadata": {
  "source_pdf": "material/Air Filters - EXCELAIR - UAE/HEPA HT 900.pdf",
  "last_verified": "2026-06-28",
  "verification_status": "source_verified"
}
```
(Use the matching `source_pdf` for the Premier product.) Set each sidecar `state: "merged"`.

- [ ] **Step 6: Run the gate and the build**

Run:
```
npm run test
```
Expected: PASS. The two `source_verified` products now have their provenance enforced, every cite-required field is `confirmed`, and the sidecars validate. A green run is the proof the pipeline reproduces the corrected values with citations.
Run:
```
npm run build
```
Expected: green.

- [ ] **Step 7: Negative check (prove the gate bites)**

Temporarily flip one verdict in `data/provenance/hepa-ht-900.json` from `confirmed` to `mismatch` and run:
```
npx vitest run data/gate.test.ts
```
Expected: FAIL with a `provenance` violation naming that field. Then revert the flip and re-run to confirm PASS. (Do not commit the temporary edit.)

- [ ] **Step 8: Commit**

Run:
```
git add data/provenance/hepa-ht-900.json data/provenance/premier-81-10-ul.json data/products.json
git commit -m "feat(data): dry-run extraction pipeline on hepa-ht-900 and premier-81-10-ul

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 8: Documentation + status

**Files:**
- Modify: `CLAUDE.md`
- Modify: `research_and_planning/BUILD_STATUS.md`

- [ ] **Step 1: Document the pipeline in `CLAUDE.md`**

In the "Data layer" section, add a bullet describing the gate and pipeline:
```markdown
- **Extraction pipeline / data gate.** New products are added from catalog PDFs via the protocol in
  `scripts/extract/PROTOCOL.md` (extract subagent, then a separate verify subagent). Every
  cite-required value (numerics, enums, certifications, variant performance) is recorded in a
  provenance sidecar `data/provenance/<id>.json` with `{page, quote, verdict}`. The deterministic gate
  lives in `src/lib/data-gate.ts` (pure; server/test-only; ajv-backed) and runs in the Vitest suite:
  it validates each product against `schema.json`, enforces provenance for products marked
  `metadata.verification_status: "source_verified"`, validates any present sidecar against
  `scripts/extract/provenance.schema.json`, and applies the shared domain-plausibility rules
  (`checkPlausibility`). `scripts/extract/driver.mjs` scaffolds sidecars and runs the gate. New deps:
  `ajv`, `ajv-formats` (dev).
```

- [ ] **Step 2: Update `BUILD_STATUS.md`**

Add a dated note recording that the extraction pipeline + gate were built, the new dev deps, the dry-run on the two products, and that bulk extraction of the remaining ~155 is the ongoing post-demo work. Update the test count to the new total from `npx vitest run`.

- [ ] **Step 3: Run the full suite and build a final time**

Run:
```
npx vitest run && npm run build
```
Expected: both green.

- [ ] **Step 4: Commit**

Run:
```
git add CLAUDE.md research_and_planning/BUILD_STATUS.md
git commit -m "docs: document the catalog extraction pipeline and data gate

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

- [ ] **Step 5: Update project memory**

Update `C:\Users\Admin\.claude\projects\C--Users-Admin-airfilters\memory\vantra-catalog-demo.md` to note the extraction pipeline/gate is built and dry-run-proven, with a pointer to the spec and plan. (Memory lives outside the repo; not a git step.)

---

## Notes on deviations from the spec

- The spec said the driver "runs the gate programmatically." Because the gate is TypeScript and the
  driver is plain Node ESM (no TS loader is available without adding a dependency such as `tsx`), the
  driver's `gate` command delegates to `vitest run data/gate.test.ts` instead. The gate logic is still
  a single shared module (`src/lib/data-gate.ts`) consumed by both the unit tests and the integration
  test; the driver invokes that same logic via the test runner. This avoids a third dependency.
- The driver is verified by run/expected-output steps rather than an automated test, proportionate to
  its role as a thin orchestration CLI whose only non-trivial dependency (the gate) is fully tested.
