import { EN1822_SCALE, gradeLadderIndex } from "@/lib/instruments";

interface Props {
  grade: string;
  scale?: readonly string[];
  className?: string;
}

/**
 * EN 1822 classification shown as a measurement scale with a red needle on the active
 * grade, instead of a colored "badge" pill. True to how filters are actually classified.
 */
export default function GradeLadder({ grade, scale = EN1822_SCALE, className }: Props) {
  const active = gradeLadderIndex(grade, scale);

  return (
    <div className={className} role="img" aria-label={`EN 1822 classification: ${grade}`}>
      <div className="flex font-mono text-[10px]">
        {scale.map((g, i) => (
          <span
            key={g}
            className={
              i === active
                ? "flex-1 pb-1 text-center text-ink font-semibold border-b-2 border-[var(--color-signal)]"
                : "flex-1 pb-1 text-center text-steel/60 border-b border-[var(--color-rule)]"
            }
          >
            {g}
          </span>
        ))}
      </div>
      <div className="flex">
        {scale.map((g, i) => (
          <span key={g} className="flex-1 text-center text-[9px] leading-tight text-[var(--color-signal)]">
            {i === active ? "▲" : " "}
          </span>
        ))}
      </div>
    </div>
  );
}
