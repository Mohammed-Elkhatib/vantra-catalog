# Data Verification: our dataset vs. the source PDFs and the live site (2026-06-28)

> **Why this exists.** The 15-product dataset in `data/products.json` was built by a prior agent from the
> manufacturer PDFs in `material/`. Before the demo, every product was cross-checked: (a) does it correspond to
> a **real** Excelair/Premier product (name match against the live site catalog and the PDFs), and (b) are the
> **specs accurate** against the source datasheets. The site itself cannot confirm specs (its product pages are
> spec-less, see `CMS_WEBSITE_AUDIT.md` Part B), so the `material/` PDFs are the source of truth for specs.

## Verdict

The dataset is **genuinely sourced, not fabricated.** Model numbers, certifications, and primary specs trace
back to the real Excelair/Premier datasheets. The one cert that looked suspicious (UL **R-27945** reused across
three Premier products) is **legitimate**, confirmed verbatim in each datasheet. However, the prior agent
introduced **specific transcription and attribute errors**, and two products are badly handled: the 81-10 adhesive
is mischaracterized, and the ecology unit carries a **fabricated `UL 710` cert, a wrong airflow ceiling, and several
unsourced specs** (line-checked 2026-06-28, see below). There is also a coverage gap: the individual spec sheets for
**6 of the 15 products were not included** in `material/` (only a name index), so their specs cannot be verified
from the provided sources.

Net: roughly half the catalog is verified accurate against source, with a defined list of fixes; the other half
is name-verified but spec-unverifiable from what we were given.

## Status: fixes applied (2026-06-28)

All High + Medium fixes below are **applied to `data/products.json`** and verified (`npm run test` = 24 pass,
`npm run build` green). What changed:

- **premier-81-10-ul** — corrected against the real TDS (the prior "remove the cert" decision was based on
  erroneous transcribed values; the datasheet supports the UL/flame-0 profile): `base_material`
  "Polychloroprene Solvent-based Rubber" -> "Polychloroprene Synthetic Rubber"; `solid_content_pct` 24 -> 28;
  `flash_point` "-20°C" -> ">10°C"; removed the unsupported `voc_content_g_l: 450` (the TDS has no VOC row);
  `shelf_life_months` 12 -> 18; added `flame_spread_index: 0` + `smoke_developed_index: 0`; added the **UL
  R-27945** ("listed") certification.
- **efsd-342** — `blade_type` "airfoil" -> "v_lock"; description + the airfoil feature reworded to V-lock to
  match the real -342 model; removed the unsourced **AMCA** cert (UL 555/555S kept).
- **efd-140** — `temperature_rating_f` 165 -> 250 (165 kept in features as the fusible-link melt point);
  removed the unsourced **IFC / BS 476** cert (UL 555 kept).
- **hepa-ht-900** — both 11.5"-depth variants: airflow 240 -> 475 / 525 -> 1000 CFM, media area 39 -> 77 /
  83 -> 166 sqft, initial pressure drop 1.0 -> 1.10 in wg (now matching the selection chart for that depth).
- **premier-vb-95-ul** — `colour` "Grey / White" -> "White"; `solid_content_pct` 65 -> 62; `voc_content_g_l`
  0.05 -> 0.01; `drying_time_touch_hours` 2.0 -> 0.75 (datasheet 30-60 min); `coverage_rate` "1.0 - 1.5" ->
  "1.5 - 2.5 m²/liter". TDS also published (below).
- **eco-ecology-unit** — airflow ceiling 60,000 -> **40,000 CFM**; **dropped the fabricated UL 710 cert**
  entirely (catalogue claims only that *component filters* are "UL Listed" — pending client confirmation);
  model-scheme 4th segment relabeled `ACCESS` -> `TYPE` (Standard/Customized filtration); `frame_material`
  restated to the sourced double-skin / aluminum-extruded-frame description; **removed** the unsourced
  `construction_type: "roll"`, `max_temperature_f/c`, and `final_pressure_drop_in_wg` (omitting beats
  displaying a made-up number); softened the fabricated "95% oil/grease" and "BMS/fire-alarm" feature lines to
  sourced wording (optional fire damper / VFD / emergency shut-off); applications "Food Processing" (a misread
  of "Food Court") -> Hospitality / Commercial HVAC / Hospital.
- **6 spec-unverifiable filters** (hepa-sc, hepa-bio, aluminum-pre-filter, super-pleat-merv-13, vcell-fg-3v,
  cacu-carbon) — flagged in-data with `metadata.verification_status: "representative_pending_tds"` (a new,
  **non-rendering** `Product.metadata` field, mirrored in `research_and_planning/schema.json`). A new
  integrity test asserts a pending-TDS product never links a `technical_data_sheet`.
- **Published TDS** — copied `VB 95 UL-Vabour Barrier.pdf` and `81-10 UL-Duct Adhesive.pdf` into
  `public/downloads/tds/` (`Premier_VB_95_UL.pdf`, `Premier_81_10_UL.pdf`) and added `technical_data_sheet`
  entries to both products.

**Deliberately deferred** (demo-acceptable nuances, Low items 6-8 below): the coating "application_temp" vs
storage-temp relabel; the csa insertion-loss "representative curve" caveat; the VB-95 base_material / 32-17
colour embellishments. **Still open (client):** the 6 filter TDS; ecology-unit UL confirmation; any dedicated
Premier UL catalogue. The findings record below is kept as-is (the diagnostics that drove these edits).

## Per-product status

| Product (id) | Real product? | Spec source | Status |
|--------------|---------------|-------------|--------|
| hepa-ht-900 | Yes (own TDS) | `HEPA HT 900.pdf` | Specs + model scheme **exact**; **variant airflow/media wrong** |
| hepa-bio | Yes (in catalog index + site) | not in `material/` | Name verified; **specs unverifiable** |
| hepa-sc | Yes (index + site) | not in `material/` | Name verified; **specs unverifiable** |
| aluminum-pre-filter | Yes ("Aluminum Filter") | not in `material/` | Name verified; **specs unverifiable** |
| super-pleat-merv-13 | Yes (exact name) | not in `material/` | Name verified; **specs unverifiable** |
| vcell-fg-3v | Yes ("V-Cell FG 3V", exact) | not in `material/` | Name verified; **specs unverifiable** |
| cacu-carbon | Yes ("CACU Carbon", exact) | not in `material/` | Name verified; **specs unverifiable** |
| efd-140 | Yes (`Dampers_list.pdf`) | `Dampers_list.pdf` | Real model; **temp-rating + IFC cert issues** |
| efsd-342 | Yes (`Dampers_list.pdf`) | `Dampers_list.pdf` | Real model; **blade-type contradiction + AMCA cert** |
| csa-rectangular | Yes (`Sound attenuator.pdf`) | `Sound attenuator.pdf` | Construction + cert **exact**; insertion loss representative |
| eco-ecology-unit | Yes (Ecology Unit catalogue) | `Excelair Ecology Unit Catalogue.pdf` | Line-checked; **UL 710 unsourced, airflow max wrong (40k not 60k) + 8 fixes** |
| premier-30-36-ul | Yes (`30-36 UL...pdf`) | datasheet | **Near-exact** (minor app-temp note) |
| premier-vb-95-ul | Yes (`VB 95 UL...pdf`) | datasheet | Real; **numeric drift on 5 fields** |
| premier-32-17-ul | Yes (`32-17 UL...pdf`) | datasheet | **Near-exact** (best entry) |
| premier-81-10-ul | Yes (`81-10 UL...pdf`) | datasheet | **Mischaracterized; missing UL cert** |

## The cert question, resolved

UL file **R-27945** appears on our three Premier UL products (30-36, VB-95, 32-17). Each product's datasheet
prints **"COATING GENERAL PURPOSE R-27945"** verbatim, so a single UL file legitimately covers all of them.
The 81-10 adhesive **also** carries R-27945 in its datasheet, which our data **omits** (see below). Conclusion:
the shared R-27945 is correct; the only cert error is the **missing** one on 81-10.

## Errors to fix, by priority

### High (would damage credibility if a client checks against the datasheet)

1. **premier-81-10-ul is mischaracterized.** The real Premier 81-10 UL is a **UL-listed (R-27945), fire-resistant,
   flame-spread-0 / smoke-0, non-toxic, low-smell** synthetic-rubber adhesive, 18-month shelf life, flash point
   `>10` C, solid `28 ±2`%. Our entry instead says: no certification, `voc_content_g_l: 450`, `flash_point: -20 C`,
   `base_material: "Polychloroprene Solvent-based Rubber"`, `solid_content_pct: 24`, `shelf_life_months: 12`, and
   omits flame/smoke indices. Fixes: add the **UL R-27945** cert; remove the unsupported `VOC 450` (the datasheet
   states no VOC); correct `flash_point` to the datasheet value; drop "Solvent-based" from `base_material`
   (datasheet says "synthetic rubber based", and the solvent/high-VOC framing contradicts the UL/non-toxic
   profile); set `solid_content_pct` to 28; set `shelf_life_months` to 18; add `flame_spread_index: 0` and
   `smoke_developed_index: 0`.

2. **efsd-342 blade type contradicts the catalog.** Per `Dampers_list.pdf` numbering, the `-342` suffix is the
   **3 hr, V-Lock blade, Class-II** fire/smoke damper. The **airfoil** Class-II 3 hr model is **EFSD-352**. Our
   entry uses model `EFSD-342` but sets `blade_type: "airfoil"` and the description says "airfoil blades." Fix:
   either set `blade_type` to `v_lock` (and rewrite the airfoil wording) to match `EFSD-342`, or change the model
   reference to `EFSD-352` to match the airfoil claim. Also: the **AMCA** certification is not in the damper
   datasheet (UL only); remove it or substantiate.

3. **efd-140 temperature rating is the fusible-link temp, not the damper rating.** `Dampers_list.pdf` rates the
   1.5 hr fire damper line at **250 F**; `165 F` is the fusible-link melt point (correctly described in our
   features). Our `temperature_rating_f: 165` should be `250` (keep 165 as the fusible link). Also: the
   **IFC / BS 476: Part 24** certification is not in the damper datasheet (UL only); remove or substantiate.

4. **hepa-ht-900 variants pair the wrong airflow/media with the depth.** The two variants use **11.5 in depth**
   but carry the **6 in depth** performance values. Per the `HEPA HT 900.pdf` selection chart, at 11.5 in (nominal
   12 in) depth: `12x24` H14 = **475 CFM / 77 sq ft** (not 240 / 39) and `24x24` H14 = **1000 CFM / 166 sq ft**
   (not 525 / 83). Initial pressure drop is **1.10** in wg (we wrote 1.0). The spec table and model-numbering
   scheme are otherwise exact.

### Medium

5. **premier-vb-95-ul numeric drift.** Against its datasheet: `solid_content_pct` 65 should be **62** (`62 ±2`);
   `voc_content_g_l` 0.05 should be **<0.01**; `drying_time_touch_hours` 2.0 should be **~0.5-1.0** (datasheet
   30-60 min); `coverage_rate` "1.0 - 1.5" should be **"1.5 - 2.5 m2/liter"**; `colour` "Grey / White" should be
   **"White"** (datasheet lists White only). `specific_gravity` 1.39 is within the `1.35 ±0.15` range (fine).

### Low / nuance (acceptable for a demo, but worth knowing)

6. **Coating "application temperature" fields are actually storage temps.** The 30-36 / VB-95 / 32-17 datasheets
   give a **storage** range (10-40 C); none give an explicit application temperature. Our `application_temp_*`
   values mirror the storage range. Relabel or note.

7. **csa-rectangular insertion loss is a representative curve, not a published row.** The construction specs and
   ASTM E477-06 / Intertek ETL cert are **exact**. The per-octave `insertion_loss_db` (6/12/22/34/41/38/29/19) has
   the right shape and magnitude but does not match any single model+length row in the catalog (the PDF gives a
   different curve per model and length). Do not cite it as a specific model's published figure.

8. **Minor base-material / colour embellishments.** VB-95 `base_material` "Aqueous Copolymer Emulsion" is more
   specific than the datasheet (generic water-based); 32-17 `colour` omits "Grey" (datasheet: Clear/White/Black/Grey).

## Ecology unit (eco-ecology-unit), line-checked 2026-06-28

Cross-checked field-by-field against `material/Excelair Ecology Unit Catalogue - UAE.pdf` (7 pp.). **Confirmed
correct:** the **5-stage layout** (ESP -> Pre-Filters -> Fine/Bag -> Carbon -> HEPA) matches the p.5 stage breakdown
exactly; **model-scheme segments 1-3** (ECO series, AIRFLOW = CFM/1000, STAGES A-E) and the **500 CFM floor** match
the p.1-2 Model Numbering page; the description (grease/smoke/odour from kitchen exhaust) is accurate. This entry,
however, carries the **most unsourced or incorrect fields of any line-checked product**:

**High (would damage credibility if a client checks against the catalogue):**

- **`UL 710` certification is not in the source.** The catalogue never cites UL 710 (or any UL standard number) for the
  unit. It states only that the **component filters** are "UL Listed" (generic UL logo on p.5; "UL Listed filter" on
  the CDPSC and Ultrapac modules), with no standard and no listing number. UL 710 is a plausible standard for
  commercial kitchen exhaust but is **not claimed by the manufacturer here**; it was added by the prior agent, and the
  `"type": "member"` value is meaningless for a UL standard. Fix: drop the cert, or restate it honestly as "component
  filters UL Listed; unit-level UL standard not published, confirm with client." (This corrects the earlier note that
  called UL 710 the "correct standard" for this product, which assumed rather than verified it.)
- **Airflow maximum is wrong: 60,000 should be 40,000 CFM.** The catalogue (Unit Construction, p.3) states the units
  range "from 500 CFM to 40000 CFM." The 500 floor is correct; the 60,000 ceiling is unsupported. Fix the `features`
  string. (The BUILD_STATUS queue item that launched this check inherited the wrong 60,000 from the data itself.)
- **Model scheme 4th segment is mislabeled.** Our scheme calls the last segment `ACCESS` = "Service access: Custom (C)
  or Standard (S)." The catalogue (p.1-2) defines it as **Type**: S = Standard Filtration only, C = Customized (with
  selectable options ESP, Fan Unit, Air Damper, Fire Damper, UV Lamp, VFD, Starter, Odour Neutraliser, Sand Trap
  Louver). The C/S letters are right but the meaning is wrong: it is the filtration type, not a service-access door
  style. As written, our model decoder would mis-explain a customer's own part number. Fix the segment label and
  meaning.

**Medium:**

- **`frame_material` "Heavy Gauge Galvanized Iron Case" is wrong.** Per Unit Construction (p.3) the unit is a
  **factory-assembled, pre-coated double-skin** enclosure with **PUF insulation** on an **aluminum extruded-profile
  frame** (optionally **powder-coated MS** casing); GI (galvanized iron) is only the **mounting rails**. Restate.
- **`construction_type: "roll"` is wrong.** The unit is a rigid, modular, factory-assembled housing, not a
  roll/auto-roll filter. Pick a valid enum value (confirm against `src/types/catalog.ts`); "roll" is misleading.
- **"Removes minimum 95% of exhaust oil & grease" is unsourced.** The catalogue publishes no unit-level oil/grease
  removal percentage. 95% appears only as component-filter efficiencies at sub-micron sizes (ASHRAE Cell F8 95% at
  0.45 micron; Bio-HEPA 95% at 0.3 micron), not as an oil/grease figure. Soften or mark unverified.
- **"Full integration support with BMS and kitchen fire alarm systems" is unsourced.** The catalogue lists a Fire
  Damper option, a VFD, and "temperature shut off / emergency shut off" buttons on the fan control panel (p.7), but
  makes no BMS or fire-alarm integration claim. Soften or remove.
- **`applications` "Food Processing" is not in the source.** The catalogue lists "Food **Court**" (a mall dining area),
  not food processing (industrial manufacturing); this looks like a misread. The catalogue's full list (Hotels &
  Restaurants, Food Court, Hospitals, Schools & Colleges, Shopping Malls, Commercial buildings) is also narrowed to
  just two app tags. Map to a sourced application.

**Low / nuance:**

- **`max_temperature_f: 180` / `max_temperature_c: 82` are unsourced.** The catalogue gives no operating-temperature
  rating (only "temperature shut off controls" on the fan panel, with no value). The F/C pair is at least internally
  consistent (180 F = 82 C). Flag.
- **`final_pressure_drop_in_wg: 1.5` is unsourced.** No numeric pressure drop is published (the catalogue shows
  Magnehelic gauges and claims "very less pressure drop"). A full 5-stage ESP-to-HEPA stack at dirty load would
  plausibly exceed 1.5 in wg. Flag.

## Coverage gap (important and honest)

The individual TDS for **hepa-bio, hepa-sc, aluminum-pre-filter, super-pleat-merv-13, vcell-fg-3v, cacu-carbon**
are **not in `material/`** (the air-filters PDF is only a name index linking to TDS/Ctlg that were not provided).
Their product **names are confirmed real** (they appear in the Excelair catalog index and, for several, on the
live site), and the catalog's cert logo strip supports UL / Intertek-ETL / AMCA / AHRI generally. But the
**specific spec values** (efficiencies, MERV, temperatures, pressure drops, per-product certifications) for these
six **cannot be verified from the sources we were given**. They are plausible and name-correct, not source-confirmed.

`eco-ecology-unit` has now been line-checked against its catalogue (see the "Ecology unit" section above), so it is
**not** in this unverifiable bucket: the source exists and was read in full. The model scheme and 5-stage layout are
confirmed, but the `UL 710` cert is **unsourced** (the catalogue claims only that component filters are "UL Listed"),
and the airflow ceiling and several specs are wrong or unsupported.

## Site cross-check

The live site confirms the **names/lines** exist (HEPA SC, HEPA BIO, CACU, sound attenuators, fire dampers,
Premier coatings), but its product pages carry **no specs** (duplicate-content bug), so it validates existence,
not values. HEPA HT-900 has no dedicated site page or `/product/` slug; it is a specialized product backed by its
own TDS, so its absence from the site listing is expected, not a red flag.

## Download links (documents[] vs `public/downloads/`)

Checked every product's `documents[].url` against the files actually in `public/downloads/`. **No product links to
another product's file** — every link resolves and points to the correct product *family* (air filters -> the
air-filters index, dampers -> the dampers catalogue, attenuator -> the attenuator catalogue, ecology -> the ecology
catalogue, Premier -> the Premier coatings catalogue, and the three published TDS to their own sheets). The
`catalog.test.ts` "referenced files exist" check passes. Two things are still worth knowing:

1. **Catalog links are shared/generic, and a few titles overpromise.** All 7 air-filter products link to the **same**
   `Airfilters_list.pdf`, which is the **name-only index** (no specs); three are titled "Excelair HEPA Filters
   Catalogue" though the file is the general air-filters list. All 4 Premier products link to
   `Premier-Normal-Catalogue.pdf` (the **non-UL** line catalogue), including the UL products. Acceptable for a demo,
   but a "catalogue" download does not always contain that specific product's specs.

2. **Two UL Premier products have no datasheet download, only the generic catalogue.** `premier-vb-95-ul` and
   `premier-81-10-ul` expose **only** the "Premier Coatings Catalogue" link (no TDS) even though their source
   datasheets (`VB 95 UL-Vabour Barrier.pdf`, `81-10 UL-Duct Adhesive.pdf`) **exist in `material/`**. (30-36 and 32-17
   do publish their TDS.) Easy fix: copy those two TDS into `public/downloads/tds/` and add a `technical_data_sheet`
   entry to each product's `documents[]`. The integrity test does not catch this because it only verifies that
   *referenced* files exist, not that expected files are referenced.

## Recommended actions

1. ~~Apply the High-priority fixes (1-4) and Medium fix (5).~~ **DONE 2026-06-28** (see "Status: fixes applied").
2. ~~Decide on the 6 spec-unverifiable filters.~~ **DONE** — kept in the demo, flagged in-data with
   `metadata.verification_status: "representative_pending_tds"`; their numbers are not presented as
   manufacturer-published. TDS still to be requested from the client (see "What to request" below).
3. ~~Apply the `eco-ecology-unit` fixes.~~ **DONE** — UL 710 dropped, airflow 60k -> 40k, model-scheme 4th
   segment relabeled, `frame_material` restated, and the unsourced `construction_type` / `max_temperature` /
   `final_pressure_drop` fields removed (not just flagged); 95% oil-grease + BMS lines softened to sourced wording.
4. ~~Keep `catalog.test.ts`, `catalog.ts`, `schema.json` in sync; run test + build.~~ **DONE** — `Product.metadata`
   added to both the type and the schema; a pending-TDS integrity test added; `npm run test` = 24 pass, build green.
5. ~~Publish the two missing Premier UL datasheets.~~ **DONE** — `Premier_VB_95_UL.pdf` and `Premier_81_10_UL.pdf`
   copied into `public/downloads/tds/` and linked from both products' `documents[]`.

**Remaining (open):** the three Low/nuance items (6-8 below) are deliberately left for the demo; the three client
asks ("What to request from the client") are still pending the client meeting.

## What to request from the client (open items, plain language)

**What a TDS is.** A **TDS (Technical Data Sheet)** is the manufacturer's official one- or two-page spec sheet for a
**single product**. It lists that product's published, tested numbers: efficiency, dimensions, airflow, pressure
drop, temperature rating, certifications, and so on. The TDS is the **authoritative source** for a product's specs.
(A "catalogue" or "list" PDF is different: it covers many products at once and usually gives names and a short
blurb, not the full per-product spec table.)

**The gap.** Six of our 15 products are filters whose **individual TDS was not in the `material/` folder** we were
given. For those six we only have `Airfilters_list.pdf`, which is a **name index** (it lists the product names, not
their full specs). So the numbers currently in `products.json` for these six were entered during the build
**without an authoritative sheet to copy from**, and we cannot verify them. The product **names are real** (confirmed
against the index and, for several, the live site); the **spec values are not source-confirmed**.

**The six products that need a TDS:**

| id | product name |
|----|--------------|
| hepa-sc | HEPA SC |
| hepa-bio | HEPA BIO |
| aluminum-pre-filter | Aluminum Filter |
| super-pleat-merv-13 | Super Pleat MERV 13 |
| vcell-fg-3v | V-Cell FG 3V |
| cacu-carbon | CACU Carbon |

**The ask, in one sentence:** request the individual Technical Data Sheets (TDS PDFs) for these six Excelair filters
from the client (CMS / Vantra) or the manufacturer (Excelair). Once we have them we either confirm the existing
numbers or correct them, exactly as we did for the products that did have a sheet.

**Until then:** do not present these six products' numbers as "manufacturer-published." Either flag them internally
as "representative, pending TDS" or hold them back from the demo.
