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
