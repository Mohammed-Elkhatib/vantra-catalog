import { Product } from "@/types/catalog";
import { HelpCircle } from "lucide-react";

interface ModelDecoderProps {
  scheme: NonNullable<Product["model_numbering_scheme"]>;
}

export default function ModelDecoder({ scheme }: ModelDecoderProps) {
  return (
    <div className="border border-rule bg-white p-6">
      <div className="mb-4 flex items-center gap-1.5">
        <HelpCircle className="h-4 w-4 text-[var(--color-signal)]" />
        <h4 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink">Decoding the model reference</h4>
      </div>
      <p className="mb-5 max-w-2xl text-xs leading-relaxed text-steel">
        Engineers specify size and class through the model code. Here is how each block reads:
      </p>

      <div className="mb-6 bg-carbon px-4 py-3 text-center font-mono text-sm text-paper">{scheme.pattern}</div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {scheme.segments.map((seg) => (
          <div key={seg.code} className="flex items-start gap-3 border border-rule p-3">
            <span className="min-w-16 border border-rule bg-paper px-2 py-1 text-center font-mono text-xs font-semibold text-ink">
              {seg.code}
            </span>
            <p className="flex-1 text-xs text-steel">{seg.meaning}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
