import { efficiencyCurvePoints } from "@/lib/instruments";

interface Props {
  width?: number;
  height?: number;
  efficiencyLabel?: string;
  className?: string;
}

/**
 * The signature visual: filtration efficiency vs particle size, drawn as a valley with
 * its minimum (the Most Penetrating Particle Size, ~0.3 micron) marked in instrument red.
 */
export default function EfficiencyCurve({
  width = 240,
  height = 96,
  efficiencyLabel = "99.995%",
  className,
}: Props) {
  const pts = efficiencyCurvePoints({ width, height, samples: 40 });
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const mid = pts[Math.floor(pts.length / 2)];

  return (
    <figure className={className}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        role="img"
        aria-label={`Filtration efficiency curve; minimum efficiency ${efficiencyLabel} at the most penetrating particle size`}
      >
        <line x1="0" y1={height - 1} x2={width} y2={height - 1} strokeWidth="1" className="stroke-[var(--color-rule)]" />
        <path d={d} fill="none" strokeWidth="1.5" className="stroke-[var(--color-ink)]" />
        <line
          x1={mid.x}
          y1={mid.y}
          x2={mid.x}
          y2={height - 1}
          strokeWidth="1"
          strokeDasharray="2 2"
          className="stroke-[var(--color-signal)]"
        />
        <circle cx={mid.x} cy={mid.y} r="3" className="fill-[var(--color-signal)]" />
      </svg>
      <figcaption className="mt-1 flex justify-between font-mono text-[10px] text-steel">
        <span className="text-[var(--color-signal)]">&#9656; MPPS 0.3&micro;m</span>
        <span>min. efficiency {efficiencyLabel}</span>
      </figcaption>
    </figure>
  );
}
