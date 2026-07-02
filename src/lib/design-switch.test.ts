import { describe, it, expect } from "vitest";
import { counterpartPath } from "./design-switch";

describe("counterpartPath", () => {
  it("adds the /v2 prefix from Design A", () => {
    expect(counterpartPath("/", "a")).toBe("/v2");
    expect(counterpartPath("/products", "a")).toBe("/v2/products");
    expect(counterpartPath("/products/hepa-ht-900", "a")).toBe("/v2/products/hepa-ht-900");
  });

  it("strips the /v2 prefix from Design B", () => {
    expect(counterpartPath("/v2", "b")).toBe("/");
    expect(counterpartPath("/v2/products", "b")).toBe("/products");
    expect(counterpartPath("/v2/products/hepa-ht-900", "b")).toBe("/products/hepa-ht-900");
  });
});
