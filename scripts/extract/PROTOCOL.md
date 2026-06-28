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
