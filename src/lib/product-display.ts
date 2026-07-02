import type { Product } from "@/types/catalog";
import { humanizeEnum } from "@/lib/format";

/** Up to three scannable key/value specs, chosen by spec type. */
export function quickSpecs(product: Product): { k: string; v: string }[] {
  const s = product.specifications;
  if (s.spec_type === "filter") {
    return [
      s.filter_classification_en1822
        ? { k: "EN 1822", v: s.filter_classification_en1822 }
        : s.merv_rating != null
          ? { k: "MERV", v: String(s.merv_rating) }
          : { k: "Type", v: humanizeEnum(s.construction_type) },
      s.max_temperature_c != null ? { k: "Max temp", v: `${s.max_temperature_c}°C` } : null,
      s.final_pressure_drop_in_wg != null ? { k: "Final ΔP", v: `${s.final_pressure_drop_in_wg}″ wg` } : null,
    ].filter(Boolean) as { k: string; v: string }[];
  }
  if (s.spec_type === "damper") {
    return [
      s.fire_rating_hours != null ? { k: "Fire rating", v: `${s.fire_rating_hours} hr` } : null,
      s.leakage_class ? { k: "Leakage", v: `Class ${s.leakage_class}` } : null,
      s.velocity_rating_fpm_max != null ? { k: "Max vel.", v: `${s.velocity_rating_fpm_max} fpm` } : null,
    ].filter(Boolean) as { k: string; v: string }[];
  }
  if (s.spec_type === "sound_attenuator") {
    return [
      { k: "Profile", v: humanizeEnum(s.attenuator_type) },
      s.max_airway_velocity_m_s != null ? { k: "Max vel.", v: `${s.max_airway_velocity_m_s} m/s` } : null,
    ].filter(Boolean) as { k: string; v: string }[];
  }
  return [
    { k: "Function", v: humanizeEnum(s.product_function) },
    s.solid_content_pct != null ? { k: "Solids", v: `${s.solid_content_pct}%` } : null,
    s.voc_content_g_l != null ? { k: "VOC", v: `${s.voc_content_g_l} g/l` } : null,
  ].filter(Boolean) as { k: string; v: string }[];
}
