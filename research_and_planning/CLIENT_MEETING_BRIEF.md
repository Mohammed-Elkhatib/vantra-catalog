# Client Meeting Brief: Demo Data Status

**Date prepared:** 2026-06-28. **Audience:** internal + client meeting. **Scope:** the 15-product demo dataset.

## One-line status

The demo's data is genuinely sourced from the real manufacturer PDFs and has been audited product-by-product. It is
solid to show. The audit produced a bounded fix list (our cleanup) and two items only the client can resolve.

## What we built (plain version)

We chose **15 representative products** (out of ~170 in the full catalogue) to demonstrate browsing and filtering
across every category. The specs were transcribed **by hand** from the manufacturer PDFs into the site's data file.
We then did a line-by-line audit of every product against its source document.

## What the audit found (three buckets)

1. **Accuracy fixes (we handle these).** A specific, documented list of transcription slips and a few unsourced
   values, concentrated in a handful of products (the 81-10 adhesive, the ecology unit, two dampers, HEPA HT-900,
   VB-95). All are written up in `DATA_VERIFICATION.md` with the exact correction for each. None are show-stoppers.

2. **Six filters with no datasheet (needs the client).** Six products were picked to fill category slots, but their
   individual datasheets (TDS) were never in the source folder we received, only a name index. Their names are real;
   their spec numbers are not source-verified. We are keeping them in the demo, flagged internally as "representative,
   pending TDS." We need their datasheets to verify or correct them.

3. **Download-link gaps (mostly our cleanup).** Every download link points to the correct product family (nothing
   mis-linked to another product). Two UL Premier products currently offer only a generic catalogue download instead
   of their own datasheet; we already have those files and will publish them.

## What we need from the client

1. **The six missing filter datasheets (TDS):** HEPA SC, HEPA BIO, Aluminum Filter, Super Pleat MERV 13,
   V-Cell FG 3V, CACU Carbon. (This is the main ask.)
2. **Confirm the ecology unit's UL status:** is the ECO *unit* itself UL 710 listed, or are only its component
   filters "UL Listed"? The catalogue only supports the latter, so we will not publish a unit-level UL claim until
   this is confirmed.
3. *(Minor)* If a dedicated **Premier UL catalogue** exists separate from the standard one, please share it.

## What we are handling internally (no client action)

- Applying every accuracy fix in `DATA_VERIFICATION.md`.
- Publishing the two Premier UL datasheets we already hold (VB-95, 81-10) and adding their download links.
- Flagging the six unverified filters so their numbers are never presented as manufacturer-published.

## Reference

Full technical detail: `research_and_planning/DATA_VERIFICATION.md`. Project state and next steps:
`research_and_planning/BUILD_STATUS.md`.
