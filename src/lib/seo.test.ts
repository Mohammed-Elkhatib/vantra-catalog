import { test, expect } from "vitest";
import type { Product } from "@/types/catalog";
import { buildProductMetadata, buildListingMetadata, buildProductJsonLd } from "./seo";

const hepa: Product = {
  id: "hepa-ht-900",
  brand_id: "excelair",
  name: "HEPA HT-900",
  product_type: "hepa_filter",
  category: "Air Filters",
  description: "High-temperature absolute filter.",
  specifications: { spec_type: "filter", filter_classification_en1822: "H14" },
};

const damper: Product = {
  id: "efd-140",
  brand_id: "excelair",
  name: "EFD-140",
  product_type: "fire_damper",
  category: "Dampers",
  specifications: { spec_type: "damper", damper_function: "fire", fire_rating_hours: 1.5 },
};

test("product metadata has a unique, descriptive title and canonical", () => {
  const a = buildProductMetadata(hepa);
  const b = buildProductMetadata(damper);
  expect(a.title).toContain("HEPA HT-900");
  expect(a.title).toContain("Vantra Lebanon");
  expect(a.title).not.toBe(b.title); // each product page is distinct (fixes duplicate-title)
  expect(a.alternates?.canonical).toBe("/products/hepa-ht-900");
});

test("listing metadata is the catalog title", () => {
  expect(buildListingMetadata().title).toBe("Product Catalog | Vantra Lebanon");
});

test("JSON-LD is a schema.org Product with brand and key properties", () => {
  const ld = buildProductJsonLd(hepa, { id: "excelair", name: "Excelair", origin: "", description: "", logo_url: "" });
  expect(ld["@context"]).toBe("https://schema.org");
  expect(ld["@type"]).toBe("Product");
  expect(ld.name).toBe("HEPA HT-900");
  expect(ld.brand.name).toBe("Excelair");
  expect(ld.additionalProperty?.[0]).toMatchObject({ name: "EN 1822", value: "H14" });
});
