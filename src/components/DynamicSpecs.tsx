import { ProductSpecification } from "@/types/catalog";
import { Check, X } from "lucide-react";
import { humanizeEnum } from "@/lib/format";
import GradeLadder from "./instruments/GradeLadder";
import EfficiencyCurve from "./instruments/EfficiencyCurve";
import PressureGauge from "./instruments/PressureGauge";
import OctaveBands from "./instruments/OctaveBands";

type Row = [string, React.ReactNode];

function SpecTable({ rows }: { rows: Row[] }) {
  const visible = rows.filter(([, v]) => v !== undefined && v !== null && v !== "");
  return (
    <div className="border border-rule">
      <table className="w-full text-left">
        <tbody>
          {visible.map(([k, v]) => (
            <tr key={k} className="border-b border-rule last:border-b-0">
              <td className="w-2/5 bg-paper px-4 py-2.5 align-top font-mono text-[10px] uppercase tracking-[0.1em] text-steel">
                {k}
              </td>
              <td className="px-4 py-2.5 font-mono text-sm text-ink">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function YesNo({ value }: { value?: boolean }) {
  if (value === undefined) return null;
  return value ? (
    <span className="inline-flex items-center gap-1 text-ink">
      <Check className="h-4 w-4 text-[var(--color-signal)]" /> Yes
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-steel">
      <X className="h-4 w-4" /> No
    </span>
  );
}

function Instrument({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border border-rule bg-white p-4">
      <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-steel">{label}</div>
      {children}
    </div>
  );
}

export default function DynamicSpecs({ specs }: { specs: ProductSpecification }) {
  if (specs.spec_type === "filter") {
    const eff = specs.mpps_efficiency_pct ?? specs.efficiency_at_0_3_micron_pct;
    return (
      <div className="flex flex-col gap-6">
        {(specs.filter_classification_en1822 || eff != null) && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {specs.filter_classification_en1822 && (
              <Instrument label="EN 1822 Classification">
                <GradeLadder grade={specs.filter_classification_en1822} />
              </Instrument>
            )}
            {eff != null && (
              <Instrument label="Efficiency vs particle size">
                <EfficiencyCurve efficiencyLabel={`${eff}%`} />
              </Instrument>
            )}
          </div>
        )}
        <SpecTable
          rows={[
            ["MERV Rating", specs.merv_rating],
            ["MPPS Efficiency", specs.mpps_efficiency_pct != null ? `${specs.mpps_efficiency_pct}%` : null],
            ["Efficiency @ 0.3µm", specs.efficiency_at_0_3_micron_pct != null ? `${specs.efficiency_at_0_3_micron_pct}%` : null],
            ["Filter Media", specs.filter_media],
            ["Media Separator", specs.media_separator],
            ["Frame Material", specs.frame_material],
            ["Media Sealant", specs.media_sealant],
            ["Gasket Type", specs.gasket_type],
            ["Construction", humanizeEnum(specs.construction_type)],
            ["Max Operating Temp", specs.max_temperature_f != null ? `${specs.max_temperature_f}°F / ${specs.max_temperature_c}°C` : null],
            ["Final Resistance (ΔP)", specs.final_pressure_drop_in_wg != null ? `${specs.final_pressure_drop_in_wg}″ wg` : null],
            ["Individually Scan Tested", <YesNo key="scan" value={specs.scan_tested} />],
          ]}
        />
      </div>
    );
  }

  if (specs.spec_type === "damper") {
    return (
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="md:flex-1">
          <SpecTable
            rows={[
              ["Damper Function", humanizeEnum(specs.damper_function)],
              ["Fire Rating", specs.fire_rating_hours != null ? `${specs.fire_rating_hours} hours` : null],
              ["Blade Construction", specs.blade_type ? `${humanizeEnum(specs.blade_type)} blade` : null],
              ["Leakage Class", specs.leakage_class ? `Class ${specs.leakage_class}` : null],
              ["System Operation", humanizeEnum(specs.system_type)],
              ["Actuation / Control", humanizeEnum(specs.actuation)],
              ["Material", humanizeEnum(specs.construction_material)],
              ["Max Airflow Velocity", specs.velocity_rating_fpm_max != null ? `${specs.velocity_rating_fpm_max} fpm` : null],
              ["Fusible Link Temp", specs.temperature_rating_f != null ? `${specs.temperature_rating_f}°F` : null],
              ["Shape", humanizeEnum(specs.shape)],
            ]}
          />
        </div>
        {specs.pressure_rating_wg_max != null && (
          <div className="md:w-44">
            <Instrument label="Max static pressure">
              <div className="mx-auto w-28">
                <PressureGauge value={specs.pressure_rating_wg_max} min={0} max={Math.max(8, specs.pressure_rating_wg_max)} />
              </div>
            </Instrument>
          </div>
        )}
      </div>
    );
  }

  if (specs.spec_type === "sound_attenuator") {
    return (
      <div className="flex flex-col gap-6">
        <SpecTable
          rows={[
            ["Silencer Profile", humanizeEnum(specs.attenuator_type)],
            ["Casing Material", humanizeEnum(specs.casing_material)],
            ["Casing Thickness", specs.casing_thickness_mm != null ? `${specs.casing_thickness_mm} mm` : null],
            ["Acoustic Insulation", specs.insulation_type],
            ["Insulation Density", specs.insulation_density_kg_m3 != null ? `${specs.insulation_density_kg_m3} kg/m³` : null],
            ["Absorber Facing", humanizeEnum(specs.facing)],
            ["Flange Profile", specs.flange_size_mm],
            ["Operating Range", specs.operating_temp_min_c != null ? `${specs.operating_temp_min_c}°C to ${specs.operating_temp_max_c}°C` : null],
            ["Max Airway Velocity", specs.max_airway_velocity_m_s != null ? `${specs.max_airway_velocity_m_s} m/s` : null],
          ]}
        />
        {specs.insertion_loss_db && (
          <Instrument label="Insertion loss — dB by octave band (Hz)">
            <OctaveBands data={specs.insertion_loss_db as Record<string, number>} />
          </Instrument>
        )}
      </div>
    );
  }

  // coating
  return (
    <SpecTable
      rows={[
        ["Function", humanizeEnum(specs.product_function)],
        ["Base Composition", specs.base_material],
        ["Colour", specs.colour],
        ["Density", specs.density_gm_cc != null ? `${specs.density_gm_cc} gm/cc` : null],
        ["Solid Content", specs.solid_content_pct != null ? `${specs.solid_content_pct}%` : null],
        ["Specific Gravity", specs.specific_gravity],
        ["Service Temp", specs.service_temp_min_c != null ? `${specs.service_temp_min_c}°C to ${specs.service_temp_max_c}°C` : null],
        ["Application Temp", specs.application_temp_min_c != null ? `${specs.application_temp_min_c}°C to ${specs.application_temp_max_c}°C` : null],
        ["Flash Point", specs.flash_point],
        ["VOC Content", specs.voc_content_g_l != null ? `${specs.voc_content_g_l} g/l` : null],
        ["Coverage", specs.coverage_rate],
        ["Shelf Life", specs.shelf_life_months != null ? `${specs.shelf_life_months} months` : null],
        ["Water Resistance", humanizeEnum(specs.water_resistance)],
        ["Chemical Resistance", humanizeEnum(specs.chemical_resistance)],
        ["Flame Spread (ASTM E84)", specs.flame_spread_index],
        ["Smoke Developed (ASTM E84)", specs.smoke_developed_index],
        ["Application", specs.application_method?.map(humanizeEnum).join(", ")],
        ["Packaging", specs.packing],
      ]}
    />
  );
}
