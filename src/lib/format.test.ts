import { test, expect } from "vitest";
import { formatFileSize, humanizeEnum } from "./format";

test("formatFileSize renders MB to one decimal, or PDF when unknown", () => {
  expect(formatFileSize(4470)).toBe("4.5 MB");
  expect(formatFileSize(880)).toBe("0.9 MB");
  expect(formatFileSize(undefined)).toBe("PDF");
});

test("humanizeEnum replaces ALL underscores and title-cases", () => {
  expect(humanizeEnum("fire_smoke")).toBe("Fire Smoke");
  // multi-underscore proves replaceAll (the old .replace only fixed the first)
  expect(humanizeEnum("fire_smoke_damper")).toBe("Fire Smoke Damper");
  expect(humanizeEnum(undefined)).toBe("");
});
