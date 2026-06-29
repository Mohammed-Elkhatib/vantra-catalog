import Ajv from "ajv";
import addFormats from "ajv-formats";

/* The gate is server/test-only. Never import this module into a client component or route. */

/** Maps a product spec_type discriminator to its schema definition name. */
const SPEC_DEF: Record<string, string> = {
  filter: "FilterSpec",
  damper: "DamperSpec",
  sound_attenuator: "SoundAttenuatorSpec",
  coating: "CoatingSpec",
  flex_connector: "FlexConnectorSpec",
  flex_duct: "FlexDuctSpec",
  ecology_unit: "EcologyUnitSpec",
  air_outlet: "AirOutletSpec",
  tape: "TapeSpec",
  generic: "GenericSpec",
};

/**
 * Compiles a validator for a single Product against #/definitions/Product.
 * Returns a function that yields human-readable error strings ([] when valid).
 */
export function createProductValidator(schema: unknown): (product: unknown) => string[] {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  ajv.addSchema(schema as object, "vantra");
  let validate = ajv.getSchema("vantra#/definitions/Product");
  if (!validate) {
    validate = ajv.compile({ $ref: "vantra#/definitions/Product" });
  }
  return (product: unknown) => {
    if (validate(product)) return [];
    return (validate.errors ?? []).map(
      (e) => `${e.instancePath || "(root)"} ${e.message ?? "invalid"}`
    );
  };
}

export { SPEC_DEF };

export type Verdict =
  | "confirmed"
  | "mismatch"
  | "quote-not-found"
  | "value-not-in-quote"
  | "uncertain";

export interface ProvenanceEntry {
  value: unknown;
  page: number;
  quote: string;
  verdict: Verdict;
  note?: string;
}

export interface Sidecar {
  product_id: string;
  source_pdf: string;
  batch: string;
  state: "todo" | "extracted" | "verified" | "gated" | "merged" | "flagged";
  fields: Record<string, ProvenanceEntry>;
  free_text_sources?: Record<string, number[]>;
  exceptions?: { field: string; reason: string }[];
}

/* eslint-disable @typescript-eslint/no-explicit-any */

function resolvePath(obj: any, dotted: string): unknown {
  return dotted.split(".").reduce((o: any, k) => (o == null ? undefined : o[k]), obj);
}

/**
 * Field paths that must carry a citation: spec fields that are numeric/boolean
 * or schema-enum (high-stakes), plus each certification, plus each numeric
 * variant-performance value. Free-text spec strings are excluded (they cite
 * pages via the sidecar's free_text_sources, not per-value quotes).
 */
export function citeRequiredPaths(product: any, schema: any): string[] {
  const paths: string[] = [];
  const spec = product.specifications ?? {};
  const defName = SPEC_DEF[spec.spec_type];
  const props = defName ? schema?.definitions?.[defName]?.properties ?? {} : {};
  for (const [key, value] of Object.entries(spec)) {
    if (key === "spec_type") continue;
    const propSchema: any = props[key];
    const isEnum = Array.isArray(propSchema?.enum);
    const t = propSchema?.type;
    const numericOrBool =
      typeof value === "number" ||
      typeof value === "boolean" ||
      t === "number" ||
      t === "integer" ||
      t === "boolean";
    if (isEnum || numericOrBool) paths.push(`specifications.${key}`);
  }
  (product.certifications ?? []).forEach((_: any, i: number) =>
    paths.push(`certifications.${i}`)
  );
  (product.variants ?? []).forEach((v: any, i: number) => {
    const perf = v.performance ?? {};
    for (const [k, val] of Object.entries(perf)) {
      if (typeof val === "number") paths.push(`variants.${i}.performance.${k}`);
    }
  });
  return paths;
}

/**
 * Cross-field domain plausibility rules. Extend this list as new failure modes
 * are found. Each returns a message when the product is implausible.
 */
export function checkPlausibility(product: any): string[] {
  const errs: string[] = [];
  const s = product.specifications ?? {};
  if (
    s.spec_type === "coating" &&
    /solvent/i.test(s.base_material ?? "") &&
    s.flame_spread_index === 0
  ) {
    errs.push("solvent-based coating claims flame_spread_index 0 (implausible)");
  }
  if (product.metadata?.verification_status === "representative_pending_tds") {
    const hasTds = (product.documents ?? []).some(
      (d: any) => d.type === "technical_data_sheet"
    );
    if (hasTds)
      errs.push("representative_pending_tds product links a technical_data_sheet");
  }
  return errs;
}

export interface Violation {
  productId: string;
  rule: "structural" | "provenance" | "plausibility" | "sidecar";
  message: string;
}

/** Compiles a validator for a single sidecar document. */
export function createSidecarValidator(
  provSchema: unknown
): (sidecar: unknown) => string[] {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(provSchema as object);
  return (sidecar: unknown) => {
    if (validate(sidecar)) return [];
    return (validate.errors ?? []).map(
      (e) => `${e.instancePath || "(root)"} ${e.message ?? "invalid"}`
    );
  };
}

/**
 * Runs the full deterministic gate over a product set. Structural and
 * plausibility checks apply to every product; provenance applies only to
 * products marked metadata.verification_status === "source_verified".
 * Any present sidecar is structurally validated.
 */
export function runGate(input: {
  products: any[];
  sidecars: Record<string, Sidecar>;
  schema: any;
  provenanceSchema: any;
}): Violation[] {
  const { products, sidecars, schema, provenanceSchema } = input;
  const validateProduct = createProductValidator(schema);
  const validateSidecar = createSidecarValidator(provenanceSchema);
  const out: Violation[] = [];
  for (const p of products) {
    for (const m of validateProduct(p))
      out.push({ productId: p.id, rule: "structural", message: m });
    for (const m of checkPlausibility(p))
      out.push({ productId: p.id, rule: "plausibility", message: m });
    const sidecar = sidecars[p.id];
    if (sidecar)
      for (const m of validateSidecar(sidecar))
        out.push({ productId: p.id, rule: "sidecar", message: m });
    if (p.metadata?.verification_status === "source_verified")
      for (const m of checkProvenance(p, sidecar, schema))
        out.push({ productId: p.id, rule: "provenance", message: m });
  }
  return out;
}

/** Verifies every cite-required field has a confirmed sidecar entry (or a recorded exception). */
export function checkProvenance(
  product: any,
  sidecar: Sidecar | undefined,
  schema: any
): string[] {
  const required = citeRequiredPaths(product, schema);
  if (!sidecar) {
    return [
      `no provenance sidecar for source_verified product (needs citations for: ${required.join(", ")})`,
    ];
  }
  const exceptions = new Set((sidecar.exceptions ?? []).map((e) => e.field));
  const errs: string[] = [];
  for (const path of required) {
    if (exceptions.has(path)) continue;
    const entry = sidecar.fields?.[path];
    if (!entry) {
      errs.push(`missing citation for ${path}`);
      continue;
    }
    if (entry.verdict !== "confirmed")
      errs.push(`citation for ${path} not confirmed (verdict: ${entry.verdict})`);
    if (!entry.quote || !entry.quote.trim())
      errs.push(`citation for ${path} has empty quote`);
    if (typeof entry.page !== "number" || entry.page < 1)
      errs.push(`citation for ${path} has invalid page`);
    if (entry.verdict === "confirmed" && !path.startsWith("certifications.")) {
      const actual = resolvePath(product, path);
      if (String(actual) !== String(entry.value)) {
        errs.push(
          `value mismatch for ${path}: products.json has ${JSON.stringify(actual)} but the confirmed citation is for ${JSON.stringify(entry.value)}`
        );
      }
    }
  }
  return errs;
}
