import { octaveBandHeights } from "@/lib/instruments";

interface Props {
  data: Record<string, number>;
  maxPx?: number;
  className?: string;
}

/** Insertion-loss bars across octave bands (the acoustic signature for sound attenuators). */
export default function OctaveBands({ data, maxPx = 80, className }: Props) {
  const bars = octaveBandHeights(data, maxPx);

  return (
    <div className={className}>
      <div className="flex items-end gap-2" style={{ height: maxPx }}>
        {bars.map((b) => (
          <div key={b.hz} className="flex flex-1 flex-col items-center justify-end gap-1">
            <span className="font-mono text-[9px] text-steel">{data[b.hz]}</span>
            <div className="w-full bg-[var(--color-ink)]" style={{ height: Math.max(2, b.px) }} />
          </div>
        ))}
      </div>
      <div className="mt-1 flex gap-2">
        {bars.map((b) => (
          <span key={b.hz} className="flex-1 text-center font-mono text-[9px] text-steel">
            {b.hz.replace("hz", "")}
          </span>
        ))}
      </div>
    </div>
  );
}
