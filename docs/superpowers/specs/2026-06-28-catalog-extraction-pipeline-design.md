# Catalog-to-data extraction pipeline - design

Date: 2026-06-28
Status: approved (design); implementation plan to follow
Owner: Mohammed Elkhatib

## Context

The Vantra catalog ships 15 hand-authored products in `data/products.json`. A data-verification
epic (see `research_and_planning/DATA_VERIFICATION.md`) found that several of those products carried
wrong spec values, fabricated certifications, and unsourced numbers. Root cause: values were
transcribed from source PDFs with no provenance trail and no independent verification step, so a
misread or an invented number had nothing to catch it.

The next milestone scales the dataset toward the ~170 products catalogued in
`research_and_planning/CATALOG_DEEP_DIVE.md`. The source material is **not** 170 clean datasheets.
`material/` holds 19 PDFs: roughly a dozen multi-product **catalogs** (dense tables, many products per
page) and only ~6 single-product **TDS** (`HEPA HT 900`, the five Premier UL sheets). So the other
~155 products will be transcribed from catalog tables, which is exactly the failure mode we just hit:
values mis-read or blended across adjacent products on a page, and numbers invented where the catalog
is silent.

This spec defines a repeatable pipeline that makes that transcription safe.

## Goal

Every product value added from this point on is:

1. **Traceable** to a specific source PDF, page, and verbatim quote.
2. **Independently verified** by a second pass that re-reads the cited page.
3. **Schema-, range-, and plausibility-checked** by a deterministic gate.

The pipeline fails loudly (a product cannot be merged) rather than admitting an unsourced or
unverified value silently.

## Non-goals

- Extracting all ~155 remaining products now. We build and prove the pipeline; bulk extraction is
  ongoing post-demo work the pipeline enables.
- A headless, fully automated batch service. Extraction runs as Claude Code agent orchestration with
  a human checkpoint per catalog (decided during brainstorming). No external API key, SDK, or PDF
  library.
- Re-shaping the repo or moving `material/` out (deferred to the post-demo fresh-repo migration).

## Decisions (locked during brainstorming)

- **Pipeline scope:** semi-automated extraction plus a deterministic gate. The extractor is itself a
  hallucination source, so the gate is the safety net that must catch it.
- **Extraction runtime:** Claude Code agent orchestration. A subagent reads catalog PDF pages
  natively (the Read tool reads PDFs); a separate verification subagent re-reads them. A thin Node
  driver does bookkeeping and runs the gate but makes no LLM calls. No `@anthropic-ai/sdk`, no API
  key, no PDF lib.
- **Provenance storage:** sidecar files under `data/provenance/`, not inline in `products.json`.
  Keeps verbatim catalog text (copyright and bulk) out of the shipped data and the future CMS import,
  and is a natural internal artifact for the separate private repo later.
- **Provenance granularity:** hybrid. Per-product source block is mandatory; per-value citations are
  required for error-prone fields (all numerics, enums, certifications) but not for marketing
  free-text (description, features), which cites the page(s) it summarizes rather than every phrase.
- **Validation library:** `ajv` (plus `ajv-formats`) as a dev dependency, validating products against
  the existing `research_and_planning/schema.json` (referred to as `schema.json` below). Chosen over
  hand-rolled checks because that schema already exists and is maintained.

## Architecture

The unit of work is a **batch**: one catalog PDF, or a page range of it, producing a set of products.
A product moves through the happy-path states `todo -> extracted -> verified -> gated -> merged`. Any
product that fails verification or the gate moves to `flagged` and cannot advance until resolved.

### Stage 1: Extract (subagent A)

Input: catalog PDF, page range, the target schema.
Output, per product: the product fields plus a `provenance` map keyed by field path
(`{ "<field-path>": { "page": <int>, "quote": "<verbatim text>" } }`).

Rules:
- Emit a value only if it appears on the cited page. Omit absent values; never infer.
- Free-text fields cite the page(s) they summarize, not a per-phrase quote.
- A value that spans products or sits in an ambiguous table cell is marked `uncertain` with a note.

### Stage 2: Verify (subagent B)

A separate invocation from A, so the verifier is not anchored on the extractor's reasoning. It
re-opens each cited page and, per field, returns a verdict:

- `confirmed` - the quote exists on the page and the value matches it.
- `mismatch` - the quote exists but the value does not match.
- `quote-not-found` - the cited quote is not on the page.
- `value-not-in-quote` - the value cannot be derived from the quote.

Anything not `confirmed` is flagged. The verify report is written to the sidecar.

### Stage 3: Gate (deterministic, no LLM)

Runs in the Vitest suite (`npm run test`, the existing correctness gate). Checks:

1. **Structural:** each product validates against `schema.json` via ajv.
2. **Provenance completeness:** every cite-required field has a provenance entry with a non-empty
   quote and a valid page.
3. **Range/enum sanity:** domain bounds, for example MERV 1-16, EN1822 enum membership, pressure drop
   0-3 in wg, percentages 0-100, temperatures within plausible physical bounds.
4. **Domain plausibility:** the cross-field rules already in `catalog.test.ts` (solvent-based coating
   may not claim flame-spread 0; a `representative_pending_tds` product may not link a
   `technical_data_sheet`), as an extensible list.
5. **Merge guard:** a product present in `products.json` with `metadata.verification_status:
   "source_verified"` must have a sidecar in which every cite-required field has verdict
   `confirmed`, unless a human exception for a named field is recorded in the sidecar's `exceptions`.

The gate rules live in a single pure module (for example `src/lib/data-gate.ts`) that both the Vitest
suite and the driver import. The tests assert it against fixtures; the driver runs it programmatically
to decide whether a batch may advance to `gated`. "The gate is tests" and "the driver runs the gate"
are the same logic invoked from two places, not two implementations.

## Data model

### `products.json` (shipped, clean)

Unchanged shape. The only provenance-related field is the existing internal
`metadata.verification_status`, whose enum already covers `source_verified` and
`representative_pending_tds`. No verbatim quotes or page numbers live here.

### Sidecar: `data/provenance/<product-id>.json` (internal)

```jsonc
{
  "product_id": "hepa-ht-900",
  "source_pdf": "material/Air Filters - EXCELAIR - UAE/HEPA HT 900.pdf",
  "batch": "excelair-hepa",
  "state": "verified",
  "fields": {
    "specifications.efficiency_rating": {
      "value": "H14",
      "page": 1,
      "quote": "Efficiency: H14 per EN 1822",
      "verdict": "confirmed"
    }
    // ... one entry per cite-required field
  },
  "free_text_sources": {
    "description": [1],
    "features": [1, 2]
  },
  "exceptions": []
}
```

The gate cross-checks: every `source_verified` product in `products.json` must have a sidecar in which
every cite-required field present in the product has a matching `confirmed` entry (or a recorded
exception).

### Schema changes

- **`schema.json` (the Product mirror):** tighten product field ranges/enums where the catalog
  supports it, so structural validation carries as much of the checking as possible. This file mirrors
  the Product shape 1:1 for a clean CMS import (per `CLAUDE.md`), so it gains only Product-level
  constraints, nothing sidecar-specific.
- **Sidecar schema (separate):** the provenance/sidecar document gets its own small schema
  (`scripts/extract/provenance.schema.json`), kept out of the Product mirror so the CMS-import surface
  stays clean. ajv validates each sidecar against it.

## Components / files

| Path | Role |
| --- | --- |
| `scripts/extract/PROTOCOL.md` | Runbook: the exact extract and verify subagent prompts, the cite-then-check and omit-don't-infer rules, how to run a batch. |
| `scripts/extract/driver.mjs` | Thin Node orchestrator: scaffolds a batch's sidecars, tracks state, runs the gate module. No LLM calls. |
| `scripts/extract/provenance.schema.json` | Schema for the sidecar document (separate from the Product mirror). |
| `src/lib/data-gate.ts` | Pure gate logic (structural + provenance + range/enum + plausibility + merge guard), imported by both the Vitest suite and the driver. |
| `data/provenance/<product-id>.json` | Per-product sidecar (candidate values, provenance, verify report). |
| `data/catalog.test.ts` (or new `data/gate.test.ts`) | Asserts the gate module against fixtures. Split out if it grows. |
| `research_and_planning/schema.json` | Tightened product ranges/enums (the Product mirror; no sidecar fields). |
| `package.json` | Add `ajv`, `ajv-formats` dev deps. |

## Dependencies

- `ajv`, `ajv-formats` (dev). The only new dependencies. No PDF lib, no SDK, no API key.

## Error handling

- **Verifier disagreement:** product stays `flagged`/not-`gated`, never merged; field, expected, and
  found are written to the sidecar for human resolution.
- **Required field with no source:** gate fails with a specific message (for example "required field
  `specifications.efficiency_rating` not on cited pages") rather than passing a guess.
- **Ambiguous catalog cell:** extractor marks the field `uncertain`; the gate treats `uncertain` as
  not-confirmed.

## Testing

- The gate is tests (Vitest). Add unit tests for the gate logic itself against a tiny fixture: one
  known-good product and one known-bad product per rule, so the gate's own rules are proven and
  cannot silently regress.
- `npm run test` and `npm run build` stay green as the done bar.

## Validation plan (dry run)

Before declaring the pipeline done, run it end to end on 1-2 catalogs and re-derive a couple of
products we already corrected in the verification epic (for example `hepa-ht-900` from
`HEPA HT 900.pdf`, and a Premier UL coating). Success = the pipeline independently reproduces the
corrected values with citations, and the gate passes only when the sidecar is complete and confirmed.

## Rollout / scope

Build the gate, protocol, driver, sidecar format, and schema changes now, and prove them on the dry
run. Bulk extraction of the remaining ~155 products is the ongoing work this unlocks, post-demo.
