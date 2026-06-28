/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from "vitest";
import schema from "../../research_and_planning/schema.json";
import { createProductValidator, citeRequiredPaths, checkProvenance, type Sidecar } from "./data-gate";

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
