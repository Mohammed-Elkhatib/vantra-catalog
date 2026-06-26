import { Product } from "@/types/catalog";
import { HelpCircle } from "lucide-react";

interface ModelDecoderProps {
  scheme: NonNullable<Product["model_numbering_scheme"]>;
}

export default function ModelDecoder({ scheme }: ModelDecoderProps) {
  return (
    <div className="border border-slate-100 rounded-lg p-6 bg-slate-50/30">
      <div className="flex items-center gap-1.5 mb-4">
        <HelpCircle className="w-5 h-5 text-sky-600" />
        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Understanding the Model Reference
        </h4>
      </div>
      <p className="text-slate-600 text-xs leading-relaxed mb-6">
        HVAC engineers use reference codes to specify sizes and classifications. Here is how to decode the model numbers for this product line:
      </p>

      {/* Visual Pattern display */}
      <div className="bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-center text-sm md:text-base border border-slate-800 shadow-inner mb-6 select-all">
        {scheme.pattern}
      </div>

      {/* Explanation segments list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scheme.segments.map((seg) => (
          <div
            key={seg.code}
            className="flex items-start gap-3 p-3 rounded-lg bg-white border border-slate-100 shadow-sm"
          >
            <span className="inline-flex items-center justify-center min-w-16 px-2 py-1 bg-sky-50 text-sky-700 rounded font-mono text-xs font-bold border border-sky-100 text-center">
              {seg.code}
            </span>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-800">{seg.meaning}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
