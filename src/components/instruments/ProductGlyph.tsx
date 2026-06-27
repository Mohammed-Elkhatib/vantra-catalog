import type { Product } from "@/types/catalog";

interface Props {
  productType: Product["product_type"];
  size?: number;
  className?: string;
}

type Family = "filter" | "damper" | "attenuator" | "coating";

function familyOf(t: Product["product_type"]): Family {
  if (t.endsWith("damper")) return "damper";
  if (t === "sound_attenuator") return "attenuator";
  if (t === "coating" || t === "adhesive" || t === "sealant") return "coating";
  return "filter";
}

/**
 * On-brand technical line-art per product family, used instead of stock photos. Grounded
 * in the products' own forms (pleated media, damper blades, silencer baffles, a coating
 * pail) so cards/detail pages have imagery without fake photography.
 */
export default function ProductGlyph({ productType, size = 64, className }: Props) {
  const family = familyOf(productType);
  const stroke = "stroke-[var(--color-steel)]";

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      role="img"
      aria-label={`${family} illustration`}
      className={className}
    >
      <rect x="6" y="6" width="52" height="52" rx="3" strokeWidth="1.5" className="stroke-[var(--color-rule)]" />
      {family === "filter" && (
        <polyline
          points="12,46 18,18 24,46 30,18 36,46 42,18 48,46 52,18"
          strokeWidth="2"
          strokeLinejoin="round"
          className={stroke}
        />
      )}
      {family === "damper" && (
        <g strokeWidth="2" strokeLinecap="round" className={stroke}>
          <line x1="14" y1="20" x2="50" y2="14" />
          <line x1="14" y1="32" x2="50" y2="26" />
          <line x1="14" y1="44" x2="50" y2="38" />
          <line x1="14" y1="52" x2="50" y2="50" />
        </g>
      )}
      {family === "attenuator" && (
        <g strokeWidth="3" strokeLinecap="round" className={stroke}>
          <line x1="20" y1="16" x2="20" y2="48" />
          <line x1="32" y1="16" x2="32" y2="48" />
          <line x1="44" y1="16" x2="44" y2="48" />
        </g>
      )}
      {family === "coating" && (
        <g strokeWidth="2" strokeLinejoin="round" className={stroke}>
          <path d="M20 22 h24 v26 a4 4 0 0 1 -4 4 h-16 a4 4 0 0 1 -4 -4 z" />
          <path d="M26 22 v-4 h12 v4" />
        </g>
      )}
    </svg>
  );
}
