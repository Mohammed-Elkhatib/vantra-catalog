import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CategoryTileProps {
  name: string;
  description: string;
  productCount: number;
  imageSrc?: string;
}

export default function CategoryTile({
  name,
  description,
  productCount,
  imageSrc,
}: CategoryTileProps) {
  return (
    <Link
      href={`/v2/products?category=${encodeURIComponent(name)}`}
      className="group flex flex-col overflow-hidden rounded-sm border border-rule bg-paper transition-all hover:border-[var(--color-signal)] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-signal)] focus-visible:ring-offset-2"
    >
      <div
        className="aspect-[16/10] bg-[var(--color-rule)]"
        style={
          imageSrc
            ? {
                backgroundImage: `url(${imageSrc})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold text-ink transition-colors group-hover:text-[var(--color-signal)]">
          {name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-steel">{description}</p>
        <div className="mt-5 flex items-center justify-between border-t border-rule pt-4 text-xs font-semibold uppercase tracking-[0.1em] text-steel">
          <span>{productCount} products</span>
          <ArrowRight className="h-4 w-4 text-[var(--color-signal)] transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
