import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Why this test exists: FilterSidebar and SearchInput are shared client
// components reused under both /products (Design A) and /v2/products
// (Design B). They must navigate relative to the active design's pathname
// (usePathname), not a literal "/products" push target. A hardcoded
// "/products" push silently ejects /v2 users into Design A on every
// interaction, and on SearchInput even fires on initial hydration.
const HARDCODED_PUSH = /push\(\s*[`'"]\/products/;

const files = [
  join(__dirname, "FilterSidebar.tsx"),
  join(__dirname, "SearchInput.tsx"),
];

describe("shared listing controls navigate relative to the active pathname", () => {
  it.each(files)("%s imports usePathname and never pushes a hardcoded /products target", (path) => {
    const source = readFileSync(path, "utf-8");
    expect(source).toMatch(/usePathname/);
    expect(source).not.toMatch(HARDCODED_PUSH);
  });
});
