"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Category, Brand } from "@/lib/db";
import { Filter, X, Check } from "lucide-react";

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

export default function FilterSidebar({
  categories,
  brands,
  availableCounts,
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Active filters helper
  const getActiveFilters = (key: string): string[] => {
    const val = searchParams.get(key);
    return val ? val.split(",") : [];
  };

  const activeCategories = getActiveFilters("category");
  const activeBrands = getActiveFilters("brand");
  const activeEn1822 = getActiveFilters("en1822");
  const activeFireRating = getActiveFilters("fireRating");
  const activeLeakageClass = getActiveFilters("leakageClass");
  const activeCerts = getActiveFilters("cert");

  // Toggle filter helper
  const handleFilterToggle = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get(key) ? params.get(key)!.split(",") : [];

    let updated: string[];
    if (current.includes(value)) {
      updated = current.filter((v) => v !== value);
    } else {
      updated = [...current, value];
    }

    if (updated.length > 0) {
      params.set(key, updated.join(","));
    } else {
      params.delete(key);
    }

    // Reset pagination on filter change
    params.delete("page");

    startTransition(() => {
      router.push(`/products?${params.toString()}`, { scroll: false });
    });
  };

  const handleClearAll = () => {
    startTransition(() => {
      router.push("/products", { scroll: false });
    });
  };

  const hasActiveFilters =
    activeCategories.length > 0 ||
    activeBrands.length > 0 ||
    activeEn1822.length > 0 ||
    activeFireRating.length > 0 ||
    activeLeakageClass.length > 0 ||
    activeCerts.length > 0 ||
    searchParams.has("search");

  return (
    <div className="flex flex-col gap-8 bg-white border border-slate-100 p-6 rounded-xl shadow-sm h-fit">
      <div className="flex items-center justify-between">
        <h3 className="text-sm uppercase font-bold text-slate-800 tracking-wider flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-sky-600" /> Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            disabled={isPending}
            className="text-xs text-sky-600 hover:text-sky-500 font-semibold flex items-center gap-0.5 hover:underline disabled:opacity-50"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="divide-y divide-slate-100 flex flex-col gap-6">
        {/* Category Filter */}
        <div className="flex flex-col gap-3 pt-6 first:pt-0">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Categories</h4>
          <div className="flex flex-col gap-2">
            {categories.map((category) => {
              const checked = activeCategories.includes(category.name);
              const count = availableCounts.categories[category.name] || 0;
              return (
                <label
                  key={category.id}
                  className={`flex items-center justify-between text-sm cursor-pointer py-0.5 transition-colors select-none ${
                    count === 0 && !checked
                      ? "text-slate-300 pointer-events-none"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={count === 0 && !checked}
                      onChange={() => handleFilterToggle("category", category.name)}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 h-4 w-4"
                    />
                    <span>{category.name}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-400">({count})</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Brand Filter */}
        <div className="flex flex-col gap-3 pt-6">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Brands</h4>
          <div className="flex flex-col gap-2">
            {brands.map((brand) => {
              const checked = activeBrands.includes(brand.id);
              const count = availableCounts.brands[brand.id] || 0;
              return (
                <label
                  key={brand.id}
                  className={`flex items-center justify-between text-sm cursor-pointer py-0.5 transition-colors select-none ${
                    count === 0 && !checked
                      ? "text-slate-300 pointer-events-none"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={count === 0 && !checked}
                      onChange={() => handleFilterToggle("brand", brand.id)}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 h-4 w-4"
                    />
                    <span className="capitalize">{brand.name}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-400">({count})</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* HEPA Grade Filter */}
        {Object.keys(availableCounts.en1822).length > 0 && (
          <div className="flex flex-col gap-3 pt-6">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">EN 1822 Classification</h4>
            <div className="flex flex-col gap-2">
              {["E12", "H13", "H14"].map((grade) => {
                const checked = activeEn1822.includes(grade);
                const count = availableCounts.en1822[grade] || 0;
                return (
                  <label
                    key={grade}
                    className={`flex items-center justify-between text-sm cursor-pointer py-0.5 transition-colors select-none ${
                      count === 0 && !checked
                        ? "text-slate-300 pointer-events-none"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={count === 0 && !checked}
                        onChange={() => handleFilterToggle("en1822", grade)}
                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 h-4 w-4"
                      />
                      <span>{grade}</span>
                    </div>
                    <span className="text-xs font-medium text-slate-400">({count})</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Damper Fire Rating Filter */}
        {Object.keys(availableCounts.fireRating).length > 0 && (
          <div className="flex flex-col gap-3 pt-6">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Fire Rating</h4>
            <div className="flex flex-col gap-2">
              {[1.5, 3].map((hours) => {
                const checked = activeFireRating.includes(hours.toString());
                const count = availableCounts.fireRating[hours.toString()] || 0;
                return (
                  <label
                    key={hours}
                    className={`flex items-center justify-between text-sm cursor-pointer py-0.5 transition-colors select-none ${
                      count === 0 && !checked
                        ? "text-slate-300 pointer-events-none"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={count === 0 && !checked}
                        onChange={() => handleFilterToggle("fireRating", hours.toString())}
                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 h-4 w-4"
                      />
                      <span>{hours} Hour{hours > 1 && "s"}</span>
                    </div>
                    <span className="text-xs font-medium text-slate-400">({count})</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Leakage Class Filter */}
        {Object.keys(availableCounts.leakageClass).length > 0 && (
          <div className="flex flex-col gap-3 pt-6">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Leakage Class</h4>
            <div className="flex flex-col gap-2">
              {["I", "II", "III"].map((leak) => {
                const checked = activeLeakageClass.includes(leak);
                const count = availableCounts.leakageClass[leak] || 0;
                return (
                  <label
                    key={leak}
                    className={`flex items-center justify-between text-sm cursor-pointer py-0.5 transition-colors select-none ${
                      count === 0 && !checked
                        ? "text-slate-300 pointer-events-none"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={count === 0 && !checked}
                        onChange={() => handleFilterToggle("leakageClass", leak)}
                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 h-4 w-4"
                      />
                      <span>Class {leak}</span>
                    </div>
                    <span className="text-xs font-medium text-slate-400">({count})</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Certifications Filter */}
        {Object.keys(availableCounts.certifications).length > 0 && (
          <div className="flex flex-col gap-3 pt-6">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Certifications</h4>
            <div className="flex flex-col gap-2">
              {["UL", "ETL", "AMCA", "BSRIA", "IFC"].map((cert) => {
                const checked = activeCerts.includes(cert);
                const count = availableCounts.certifications[cert] || 0;
                return (
                  <label
                    key={cert}
                    className={`flex items-center justify-between text-sm cursor-pointer py-0.5 transition-colors select-none ${
                      count === 0 && !checked
                        ? "text-slate-300 pointer-events-none"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={count === 0 && !checked}
                        onChange={() => handleFilterToggle("cert", cert)}
                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 h-4 w-4"
                      />
                      <span>{cert}</span>
                    </div>
                    <span className="text-xs font-medium text-slate-400">({count})</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
