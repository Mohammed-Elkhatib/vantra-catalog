"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Category, Brand } from "@/lib/db";
import { Filter } from "lucide-react";

interface FilterSidebarProps {
  categories: Category[];
  brands: Brand[];
  availableCounts: {
    categories: Record<string, number>;
    brands: Record<string, number>;
    en1822: Record<string, number>;
    fireRating: Record<string, number>;
    leakageClass: Record<string, number>;
    certifications: Record<string, number>;
  };
}

// Curated spec-facet option lists. Intentional subsets of the schema's full enums (the
// demo data only spans these); extend here when the catalog grows.
const EN1822_OPTIONS = ["E12", "H13", "H14"];
const FIRE_RATING_OPTIONS = [1.5, 3];
const LEAKAGE_OPTIONS = ["I", "II", "III"];
const CERT_OPTIONS = ["UL", "ETL", "AMCA", "BSRIA", "IFC", "NAFA"];

function FacetSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-rule pt-5 first:border-t-0 first:pt-0">
      <h4 className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-steel">{title}</h4>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function Option({
  label,
  count,
  checked,
  onToggle,
}: {
  label: string;
  count: number;
  checked: boolean;
  onToggle: () => void;
}) {
  const disabled = count === 0 && !checked;
  return (
    <label
      className={
        disabled
          ? "pointer-events-none flex select-none items-center justify-between py-1 text-sm text-steel/40"
          : "flex cursor-pointer select-none items-center justify-between py-1 text-sm text-ink/80 transition-colors hover:text-ink"
      }
    >
      <span className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={onToggle}
          className="h-3.5 w-3.5 accent-[var(--color-signal)]"
        />
        <span>{label}</span>
      </span>
      <span className="font-mono text-[10px] text-steel">{count}</span>
    </label>
  );
}

export default function FilterSidebar({ categories, brands, availableCounts }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const active = (key: string): string[] => {
    const v = searchParams.get(key);
    return v ? v.split(",") : [];
  };

  const toggle = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get(key) ? params.get(key)!.split(",") : [];
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    if (updated.length > 0) params.set(key, updated.join(","));
    else params.delete(key);
    params.delete("page");
    startTransition(() => router.push(`${pathname}?${params.toString()}`, { scroll: false }));
  };

  const activeCategories = active("category");
  const activeBrands = active("brand");
  const activeEn1822 = active("en1822");
  const activeFire = active("fireRating");
  const activeLeakage = active("leakageClass");
  const activeCerts = active("cert");

  const hasActive =
    [activeCategories, activeBrands, activeEn1822, activeFire, activeLeakage, activeCerts].some((a) => a.length > 0) ||
    searchParams.has("search");

  return (
    <div className="flex h-fit flex-col gap-5 border border-rule bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink">
          <Filter className="h-3.5 w-3.5 text-[var(--color-signal)]" /> Filters
        </h3>
        {hasActive && (
          <button
            onClick={() => startTransition(() => router.push(pathname, { scroll: false }))}
            disabled={isPending}
            className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-signal)] hover:underline disabled:opacity-50"
          >
            Clear
          </button>
        )}
      </div>

      <FacetSection title="Category">
        {categories.map((c) => (
          <Option
            key={c.id}
            label={c.name}
            count={availableCounts.categories[c.name] || 0}
            checked={activeCategories.includes(c.name)}
            onToggle={() => toggle("category", c.name)}
          />
        ))}
      </FacetSection>

      <FacetSection title="Brand">
        {brands.map((b) => (
          <Option
            key={b.id}
            label={b.name}
            count={availableCounts.brands[b.id] || 0}
            checked={activeBrands.includes(b.id)}
            onToggle={() => toggle("brand", b.id)}
          />
        ))}
      </FacetSection>

      {Object.keys(availableCounts.en1822).length > 0 && (
        <FacetSection title="EN 1822 Classification">
          {EN1822_OPTIONS.map((g) => (
            <Option
              key={g}
              label={g}
              count={availableCounts.en1822[g] || 0}
              checked={activeEn1822.includes(g)}
              onToggle={() => toggle("en1822", g)}
            />
          ))}
        </FacetSection>
      )}

      {Object.keys(availableCounts.fireRating).length > 0 && (
        <FacetSection title="Fire Rating">
          {FIRE_RATING_OPTIONS.map((h) => (
            <Option
              key={h}
              label={`${h} hour${h > 1 ? "s" : ""}`}
              count={availableCounts.fireRating[String(h)] || 0}
              checked={activeFire.includes(String(h))}
              onToggle={() => toggle("fireRating", String(h))}
            />
          ))}
        </FacetSection>
      )}

      {Object.keys(availableCounts.leakageClass).length > 0 && (
        <FacetSection title="Leakage Class">
          {LEAKAGE_OPTIONS.map((l) => (
            <Option
              key={l}
              label={`Class ${l}`}
              count={availableCounts.leakageClass[l] || 0}
              checked={activeLeakage.includes(l)}
              onToggle={() => toggle("leakageClass", l)}
            />
          ))}
        </FacetSection>
      )}

      {Object.keys(availableCounts.certifications).length > 0 && (
        <FacetSection title="Certification">
          {CERT_OPTIONS.map((c) => (
            <Option
              key={c}
              label={c}
              count={availableCounts.certifications[c] || 0}
              checked={activeCerts.includes(c)}
              onToggle={() => toggle("cert", c)}
            />
          ))}
        </FacetSection>
      )}
    </div>
  );
}
