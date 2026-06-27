"use client";

import { Variant } from "@/types/catalog";
import { useState } from "react";
import { Search } from "lucide-react";

interface SelectionTableProps {
  variants: Variant[];
}

export default function SelectionTable({ variants }: SelectionTableProps) {
  const [filterText, setFilterText] = useState("");

  const filtered = variants.filter((v) => {
    if (!filterText) return true;
    const term = filterText.toLowerCase();
    const dims = v.dimensions;
    return (
      v.model_reference.toLowerCase().includes(term) ||
      [dims?.width_in, dims?.height_in, dims?.depth_in, dims?.width_mm, dims?.height_mm, dims?.depth_mm].some((n) =>
        n?.toString().includes(term),
      )
    );
  });

  return (
    <div className="border border-rule bg-white">
      <div className="flex flex-col gap-3 border-b border-rule bg-paper p-4 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink">Variant selection chart</h4>
        <div className="relative w-full sm:w-64">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-3.5 w-3.5 text-steel" />
          </div>
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Search size or model…"
            aria-label="Search variants"
            className="block w-full border border-rule bg-white py-1.5 pl-9 pr-3 text-xs text-ink placeholder-steel focus:border-ink focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-paper font-mono uppercase tracking-[0.1em] text-steel">
            <tr>
              <th className="px-4 py-3 font-medium">Model Reference</th>
              <th className="px-4 py-3 font-medium">Dimensions (W×H×D)</th>
              <th className="px-4 py-3 text-right font-medium">Airflow</th>
              <th className="px-4 py-3 text-right font-medium">ΔP</th>
              <th className="px-4 py-3 text-right font-medium">Media Area</th>
            </tr>
          </thead>
          <tbody className="font-mono text-ink">
            {filtered.length > 0 ? (
              filtered.map((v) => {
                const d = v.dimensions;
                const size = d
                  ? d.width_in != null
                    ? `${d.width_in}″ × ${d.height_in}″ × ${d.depth_in}″`
                    : `${d.width_mm} × ${d.height_mm} × ${d.depth_mm} mm`
                  : "—";
                const airflow = v.performance?.airflow_cfm
                  ? `${v.performance.airflow_cfm} CFM`
                  : v.performance?.airflow_cmh
                    ? `${v.performance.airflow_cmh} CMH`
                    : "—";
                const pd = v.performance?.pressure_drop_in_wg != null ? `${v.performance.pressure_drop_in_wg}″ wg` : "—";
                const area = v.performance?.media_area_sqft != null ? `${v.performance.media_area_sqft} sq.ft` : "—";
                return (
                  <tr key={v.model_reference} className="border-t border-rule hover:bg-paper">
                    <td className="px-4 py-3 font-semibold text-ink">{v.model_reference}</td>
                    <td className="px-4 py-3 text-steel">{size}</td>
                    <td className="px-4 py-3 text-right text-steel">{airflow}</td>
                    <td className="px-4 py-3 text-right text-steel">{pd}</td>
                    <td className="px-4 py-3 text-right text-steel">{area}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center font-sans text-steel">
                  No matching models.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
