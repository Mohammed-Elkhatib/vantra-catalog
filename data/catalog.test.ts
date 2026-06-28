import { test, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import products from "./products.json";
import categories from "./categories.json";
import brands from "./brands.json";

/* eslint-disable @typescript-eslint/no-explicit-any */
const all = products as any[];
const pub = (u: string) => path.join(process.cwd(), "public", u.replace(/^\//, ""));

test("product ids are unique", () => {
  const ids = all.map((p) => p.id);
  expect(new Set(ids).size).toBe(ids.length);
});

test("every brand_id and category resolves to a defined record", () => {
  const brandIds = new Set((brands as any[]).map((b) => b.id));
  const catNames = new Set((categories as any[]).map((c) => c.name));
  for (const p of all) {
    expect(brandIds.has(p.brand_id), `unknown brand_id: ${p.brand_id}`).toBe(true);
    expect(catNames.has(p.category), `unknown category: ${p.category}`).toBe(true);
  }
});

test("every referenced document file exists in public/", () => {
  for (const p of all)
    for (const d of p.documents ?? [])
      expect(fs.existsSync(pub(d.url)), `${d.url} missing on disk`).toBe(true);
});

test("category product_count matches the actual number of products", () => {
  for (const c of categories as any[]) {
    const actual = all.filter((p) => p.category === c.name).length;
    expect(c.product_count, `count mismatch for "${c.name}"`).toBe(actual);
  }
});

test("every listed brand has at least one product (no empty brands in the demo)", () => {
  for (const b of brands as any[]) {
    const count = all.filter((p) => p.brand_id === b.id).length;
    expect(count, `brand "${b.id}" has no products`).toBeGreaterThan(0);
  }
});

test("a UL listing number is never shared across different product categories", () => {
  const catsByNumber = new Map<string, Set<string>>();
  for (const p of all)
    for (const c of p.certifications ?? [])
      if (c.listing_number) {
        const set = catsByNumber.get(c.listing_number) ?? new Set<string>();
        set.add(p.category);
        catsByNumber.set(c.listing_number, set);
      }
  for (const [num, cats] of catsByNumber)
    expect(cats.size, `listing ${num} reused across categories: ${[...cats].join(", ")}`).toBe(1);
});

test("products flagged representative_pending_tds never link a technical_data_sheet", () => {
  // We do not hold the TDS for these products, so we must not present one as theirs.
  for (const p of all) {
    if (p.metadata?.verification_status === "representative_pending_tds") {
      const hasTds = (p.documents ?? []).some(
        (d: any) => d.type === "technical_data_sheet"
      );
      expect(hasTds, `${p.id} is pending-TDS but links a technical_data_sheet`).toBe(false);
    }
  }
});

test("solvent-based coatings do not claim a zero flame-spread index", () => {
  for (const p of all) {
    const s = p.specifications;
    if (
      s.spec_type === "coating" &&
      /solvent/i.test(s.base_material ?? "") &&
      s.flame_spread_index === 0
    )
      throw new Error(`${p.id}: solvent base with flame_spread_index 0 is implausible`);
  }
});
