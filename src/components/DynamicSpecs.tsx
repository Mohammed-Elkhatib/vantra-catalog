import { ProductSpecification } from "@/types/catalog";
import { Check, X } from "lucide-react";

interface DynamicSpecsProps {
  specs: ProductSpecification;
}

export default function DynamicSpecs({ specs }: DynamicSpecsProps) {
  const renderRow = (label: string, value: React.ReactNode) => {
    if (value === undefined || value === null || value === "") return null;
    return (
      <tr key={label} className="border-b border-slate-100 last:border-b-0">
        <td className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/50 w-1/3">
          {label}
        </td>
        <td className="py-3 px-4 text-sm text-slate-800">
          {value}
        </td>
      </tr>
    );
  };

  const renderBoolean = (val?: boolean) => {
    if (val === undefined) return null;
    return val ? (
      <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-semibold">
        <Check className="w-4 h-4 text-emerald-500" /> Yes
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-slate-400 text-xs">
        <X className="w-4 h-4 text-slate-300" /> No
      </span>
    );
  };

  if (specs.spec_type === "filter") {
    return (
      <div className="overflow-hidden border border-slate-100 rounded-lg">
        <table className="min-w-full divide-y divide-slate-100 text-left">
          <tbody>
            {renderRow("EN 1822 Classification", specs.filter_classification_en1822)}
            {renderRow("MERV Rating", specs.merv_rating)}
            {renderRow("MPPS Efficiency", specs.mpps_efficiency_pct ? `${specs.mpps_efficiency_pct}%` : null)}
            {renderRow("Efficiency @ 0.3 Microns", specs.efficiency_at_0_3_micron_pct ? `${specs.efficiency_at_0_3_micron_pct}%` : null)}
            {renderRow("Filter Media", specs.filter_media)}
            {renderRow("Media Separator", specs.media_separator)}
            {renderRow("Frame Material", specs.frame_material)}
            {renderRow("Media Sealant", specs.media_sealant)}
            {renderRow("Gasket Type", specs.gasket_type)}
            {renderRow("Construction Type", specs.construction_type?.replace("_", " "))}
            {renderRow(
              "Max Operating Temp",
              specs.max_temperature_f
                ? `${specs.max_temperature_f}°F / ${specs.max_temperature_c}°C`
                : null
            )}
            {renderRow("Final Resistance (PD)", specs.final_pressure_drop_in_wg ? `${specs.final_pressure_drop_in_wg}" wg` : null)}
            {renderRow("Individually Scan Tested", renderBoolean(specs.scan_tested))}
          </tbody>
        </table>
      </div>
    );
  }

  if (specs.spec_type === "damper") {
    return (
      <div className="overflow-hidden border border-slate-100 rounded-lg">
        <table className="min-w-full divide-y divide-slate-100 text-left">
          <tbody>
            {renderRow("Damper Function", specs.damper_function?.replace("_", " "))}
            {renderRow("Fire Rating (Hours)", specs.fire_rating_hours ? `${specs.fire_rating_hours} Hours` : null)}
            {renderRow("Blade Construction", specs.blade_type ? `${specs.blade_type} blade` : null)}
            {renderRow("Leakage Class", specs.leakage_class ? `Class ${specs.leakage_class}` : null)}
            {renderRow("System Operation", specs.system_type)}
            {renderRow("Actuation / Control", specs.actuation?.replace("_", " + "))}
            {renderRow("Material", specs.construction_material?.replace("_", " "))}
            {renderRow(
              "Airflow Velocity Limit",
              specs.velocity_rating_fpm_max ? `${specs.velocity_rating_fpm_max} FPM` : null
            )}
            {renderRow("Max Static Pressure", specs.pressure_rating_wg_max ? `${specs.pressure_rating_wg_max}" wg` : null)}
            {renderRow("Fusible Link Temperature", specs.temperature_rating_f ? `${specs.temperature_rating_f}°F` : null)}
            {renderRow("Shape profile", specs.shape)}
            {renderRow("Style details", specs.style)}
          </tbody>
        </table>
      </div>
    );
  }

  if (specs.spec_type === "sound_attenuator") {
    return (
      <div className="flex flex-col gap-6">
        <div className="overflow-hidden border border-slate-100 rounded-lg">
          <table className="min-w-full divide-y divide-slate-100 text-left">
            <tbody>
              {renderRow("Silencer Profile", specs.attenuator_type?.replace("_", " "))}
              {renderRow("Casing Material", specs.casing_material?.replace("_", " "))}
              {renderRow("Casing Thickness", specs.casing_thickness_mm ? `${specs.casing_thickness_mm} mm` : null)}
              {renderRow("Acoustic Insulation", specs.insulation_type)}
              {renderRow("Insulation Density", specs.insulation_density_kg_m3 ? `${specs.insulation_density_kg_m3} kg/m³` : null)}
              {renderRow("Absorber Facing", specs.facing?.replace("_", " "))}
              {renderRow("Facing Thickness", specs.facing_thickness_mm ? `${specs.facing_thickness_mm} mm` : null)}
              {renderRow("Flange Profile Sizing", specs.flange_size_mm)}
              {renderRow(
                "Temperature Operating Range",
                specs.operating_temp_min_c !== undefined
                  ? `${specs.operating_temp_min_c}°C to ${specs.operating_temp_max_c}°C`
                  : null
              )}
              {renderRow("Max Airway Velocity", specs.max_airway_velocity_m_s ? `${specs.max_airway_velocity_m_s} m/s` : null)}
              {renderRow(
                "Max Section Dimension",
                specs.max_section_dimensions_mm
                  ? `${specs.max_section_dimensions_mm.width}W × ${specs.max_section_dimensions_mm.height}H × ${specs.max_section_dimensions_mm.length}L (mm)`
                  : null
              )}
            </tbody>
          </table>
        </div>

        {/* Insertion Loss Octave Bands Grid */}
        {specs.insertion_loss_db && (
          <div className="border border-slate-100 rounded-lg p-6 bg-slate-50/20">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
              Insertion Loss (Acoustic Performance)
            </h4>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3 text-center">
              {Object.entries(specs.insertion_loss_db).map(([freq, val]) => (
                <div key={freq} className="border border-slate-100 rounded p-2.5 bg-white shadow-sm">
                  <div className="text-[10px] uppercase font-bold text-slate-400">{freq}</div>
                  <div className="text-base font-extrabold text-slate-800 mt-1">{val} <span className="text-[10px] font-normal text-slate-400">dB</span></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (specs.spec_type === "coating") {
    return (
      <div className="overflow-hidden border border-slate-100 rounded-lg">
        <table className="min-w-full divide-y divide-slate-100 text-left">
          <tbody>
            {renderRow("Chemical Compound Function", specs.product_function?.replace("_", " "))}
            {renderRow("Base Composition", specs.base_material)}
            {renderRow("Colour Tone", specs.colour)}
            {renderRow("Liquid Density", specs.density_gm_cc ? `${specs.density_gm_cc} gm/cc` : null)}
            {renderRow("Viscosity Scale", specs.viscosity_cps)}
            {renderRow("Solid Content Percent", specs.solid_content_pct ? `${specs.solid_content_pct}%` : null)}
            {renderRow("Specific Gravity Index", specs.specific_gravity)}
            {renderRow(
              "Operational Temp Limits",
              specs.service_temp_min_c !== undefined
                ? `${specs.service_temp_min_c}°C to ${specs.service_temp_max_c}°C`
                : null
            )}
            {renderRow(
              "Application Temp Limits",
              specs.application_temp_min_c !== undefined
                ? `${specs.application_temp_min_c}°C to ${specs.application_temp_max_c}°C`
                : null
            )}
            {renderRow("Flash Point", specs.flash_point)}
            {renderRow("VOC Volatiles Content", specs.voc_content_g_l !== undefined ? `${specs.voc_content_g_l} g/l` : null)}
            {renderRow(
              "Drying Schedule",
              specs.drying_time_touch_hours
                ? `Touch dry: ${specs.drying_time_touch_hours} hr / Thorough dry: ${specs.drying_time_thorough_hours} hr`
                : null
            )}
            {renderRow("Coverage Rate Index", specs.coverage_rate)}
            {renderRow("Shelf Storage Period", specs.shelf_life_months ? `${specs.shelf_life_months} Months` : null)}
            {renderRow("Water Contact Resistance", specs.water_resistance)}
            {renderRow("Chemical Contact Resistance", specs.chemical_resistance)}
            {renderRow("Surface Flame Spread Index (ASTM E 84)", specs.flame_spread_index)}
            {renderRow("Smoke Developed Index (ASTM E 84)", specs.smoke_developed_index)}
            {renderRow("Application Instructions", specs.application_method?.join(", "))}
            {renderRow("Packaging Format", specs.packing)}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
}
