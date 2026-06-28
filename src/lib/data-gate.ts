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
