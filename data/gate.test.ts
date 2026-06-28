import { test, expect } from "vitest";
import products from "./products.json";
import schema from "../research_and_planning/schema.json";
import { createProductValidator } from "@/lib/data-gate";

/* eslint-disable @typescript-eslint/no-explicit-any */
const all = products as any[];

test("every product passes structural schema validation", () => {
  const validate = createProductValidator(schema);
  const failures: string[] = [];
  for (const p of all) {
    const errs = validate(p);
    if (errs.length) failures.push(`${p.id}: ${errs.join("; ")}`);
  }
  expect(failures, failures.join("\n")).toHaveLength(0);
});
