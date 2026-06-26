import { test, expect } from "vitest";
import type { Product } from "@/types/catalog";
import { filterProducts, computeFacetCounts, matchesSearch } from "./catalog-filter";

const hepaH14: Product = {
  id: "h14",
  brand_id: "excelair",
  name: "HEPA HT-900",
  product_type: "hepa_filter",
  category: "Air Filters",
  description: "High-temperature absolute filter",
  features: ["Individually scan tested to EN 1822"],
  specifications: { spec_type: "filter", filter_classification_en1822: "H14" },
  certifications: [{ abbreviation: "NAFA", type: "member" }],
};

const hepaH13: Product = {
  id: "h13",
  brand_id: "excelair",
  name: "HEPA BIO",
  product_type: "hepa_filter",
  category: "Air Filters",
  specifications: { spec_type: "filter", filter_classification_en1822: "H13" },
};

const fireDamper: Product = {
  id: "efd",
  brand_id: "excelair",
  name: "EFD-140",
  product_type: "fire_damper",
  category: "Dampers",
  specifications: { spec_type: "damper", damper_function: "fire", fire_rating_hours: 1.5 },
  certifications: [{ abbreviation: "UL" }],
};

const fireSmoke: Product = {
  id: "efsd",
  brand_id: "excelair",
  name: "EFSD-342",
  product_type: "fire_smoke_damper",
  category: "Dampers",
  specifications: { spec_type: "damper", damper_function: "fire_smoke", fire_rating_hours: 3, leakage_class: "II" },
  certifications: [{ abbreviation: "UL" }, { abbreviation: "AMCA" }],
};

const coating: Product = {
  id: "p3036",
  brand_id: "premier",
  name: "Premier 30-36",
  product_type: "coating",
  category: "Coatings Adhesives & Sealants",
  specifications: { spec_type: "coating", product_function: "duct_coating" },
  certifications: [{ abbreviation: "UL" }],
};

const all = [hepaH14, hepaH13, fireDamper, fireSmoke, coating];

test("search matches a term that only appears in features (not name/description)", () => {
  expect(matchesSearch(hepaH14, "scan")).toBe(true);
  expect(filterProducts(all, { search: "scan" }).map((p) => p.id)).toEqual(["h14"]);
});

test("facet counts use the SAME search predicate as filtering (regression: count mismatch)", () => {
  // 'scan' only matches hepaH14 via its feature. Counts must agree with the filtered set.
  const counts = computeFacetCounts(all, { search: "scan" });
  expect(counts.categories).toEqual({ "Air Filters": 1 });
  expect(counts.brands).toEqual({ excelair: 1 });
});

test("category filter matches by category name; multi-value works", () => {
  expect(filterProducts(all, { category: ["Dampers"] }).map((p) => p.id)).toEqual(["efd", "efsd"]);
});

test("brand filter matches by brand_id", () => {
  expect(filterProducts(all, { brand: ["premier"] }).map((p) => p.id)).toEqual(["p3036"]);
});

test("en1822 facet only matches filter specs carrying that grade", () => {
  expect(filterProducts(all, { en1822: ["H14"] }).map((p) => p.id)).toEqual(["h14"]);
  // a damper must never be matched by an en1822 filter
  expect(filterProducts([fireDamper], { en1822: ["H14"] })).toEqual([]);
});

test("fireRating facet matches damper hours as a string", () => {
  expect(filterProducts(all, { fireRating: ["1.5"] }).map((p) => p.id)).toEqual(["efd"]);
  expect(filterProducts(all, { fireRating: ["3"] }).map((p) => p.id)).toEqual(["efsd"]);
});

test("a facet's own count ignores its own active selection (faceted availability)", () => {
  // With Air Filters selected, the category facet still shows Dampers/Coatings as available,
  // while the brand facet reflects the Air Filters selection (only excelair).
  const counts = computeFacetCounts(all, { category: ["Air Filters"] });
  expect(counts.categories["Dampers"]).toBe(2);
  expect(counts.categories["Air Filters"]).toBe(2);
  expect(counts.brands).toEqual({ excelair: 2 });
});
