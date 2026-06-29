import { test, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import products from "./products.json";
import schema from "./schema.json";
import provenanceSchema from "../scripts/extract/provenance.schema.json";
import { runGate, type Sidecar } from "@/lib/data-gate";

/* eslint-disable @typescript-eslint/no-explicit-any */
const all = products as any[];

function loadSidecars(): Record<string, Sidecar> {
  const dir = path.join(process.cwd(), "data", "provenance");
  const out: Record<string, Sidecar> = {};
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith(".json")) continue;
    const sc = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as Sidecar;
    out[sc.product_id] = sc;
  }
  return out;
}

test("the full data gate reports no violations", () => {
  const violations = runGate({
    products: all,
    sidecars: loadSidecars(),
    schema,
    provenanceSchema,
  });
  const report = violations.map((v) => `${v.productId} [${v.rule}] ${v.message}`).join("\n");
  expect(violations, report).toHaveLength(0);
});
