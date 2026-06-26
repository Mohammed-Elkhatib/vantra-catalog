"use client";

import { Variant } from "@/types/catalog";
import { useState } from "react";
import { Search } from "lucide-react";

interface SelectionTableProps {
  variants: Variant[];
}

export default function SelectionTable({ variants }: SelectionTableProps) {
  const [filterText, setFilterText] = useState("");

  const filteredVariants = variants.filter((v) => {
    if (!filterText) return true;
    const term = filterText.toLowerCase();
    const modelMatch = v.model_reference.toLowerCase().includes(term);
    const sizeMatch =
      (v.dimensions?.width_in?.toString().includes(term)) ||
      (v.dimensions?.height_in?.toString().includes(term)) ||
      (v.dimensions?.depth_in?.toString().includes(term)) ||
      (v.dimensions?.width_mm?.toString().includes(term)) ||
      (v.dimensions?.height_mm?.toString().includes(term)) ||
      (v.dimensions?.depth_mm?.toString().includes(term)) ||
      false;
    return modelMatch || sizeMatch;
  });

  return (
    <div className="border border-slate-100 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Table Header Filter Control */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Variant Selection Chart
        </h4>
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-3.5 w-3.5 text-slate-400" />
          </div>
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Search size or model..."
            className="block w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-md text-xs bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-all"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Model Reference</th>
              <th className="py-3 px-4">Dimensions (W×H×D)</th>
              <th className="py-3 px-4 text-right">Airflow</th>
              <th className="py-3 px-4 text-right">Pressure Drop</th>
              <th className="py-3 px-4 text-right">Media Area</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {filteredVariants.length > 0 ? (
              filteredVariants.map((v) => {
                const sizeStr = v.dimensions
                  ? v.dimensions.width_in
                    ? `${v.dimensions.width_in}" × ${v.dimensions.height_in}" × ${v.dimensions.depth_in}"`
                    : `${v.dimensions.width_mm} × ${v.dimensions.height_mm} × ${v.dimensions.depth_mm} mm`
                  : "-";

                const airflowStr = v.performance?.airflow_cfm
                  ? `${v.performance.airflow_cfm} CFM`
                  : v.performance?.airflow_cmh
                  ? `${v.performance.airflow_cmh} CMH`
                  : "-";

                const pdStr = v.performance?.pressure_drop_in_wg !== undefined
                  ? `${v.performance.pressure_drop_in_wg}" wg`
                  : "-";

                const areaStr = v.performance?.media_area_sqft !== undefined
                  ? `${v.performance.media_area_sqft} sq.ft`
                  : "-";

                return (
                  <tr key={v.model_reference} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                      {v.model_reference}
                    </td>
                    <td className="py-3 px-4">
                      {sizeStr}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      {airflowStr}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      {pdStr}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      {areaStr}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-8 px-4 text-center text-slate-400 font-normal">
                  No matching models or configurations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
