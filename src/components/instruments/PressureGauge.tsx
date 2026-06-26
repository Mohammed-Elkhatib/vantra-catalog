import { gaugeAngle } from "@/lib/instruments";

interface Props {
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  className?: string;
}

/** Minimal Magnehelic-style pressure-drop gauge: a semicircular dial with a red needle. */
export default function PressureGauge({ value, min = 0, max = 4, unit = "″ wg", className }: Props) {
  const cx = 40;
  const cy = 40;
  const r = 32;
  const angle = gaugeAngle(value, min, max);
  const t = (angle * Math.PI) / 180;
  const nx = cx + r * Math.sin(t);
  const ny = cy - r * Math.cos(t);

  return (
    <figure className={className}>
      <svg viewBox="0 0 80 52" width="100%" role="img" aria-label={`Pressure drop ${value}${unit}`}>
        <path
          d={`M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy}`}
          fill="none"
          strokeWidth="2"
          className="stroke-[var(--color-rule)]"
        />
        <line x1={cx} y1={cy} x2={nx} y2={ny} strokeWidth="2" strokeLinecap="round" className="stroke-[var(--color-signal)]" />
        <circle cx={cx} cy={cy} r="2.5" className="fill-[var(--color-ink)]" />
      </svg>
      <figcaption className="text-center font-mono text-xs text-ink">
        {value}
        <span className="text-steel">{unit}</span>
      </figcaption>
    </figure>
  );
}
