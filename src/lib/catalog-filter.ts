import type { Product } from "@/types/catalog";

/**
 * Pure catalog filtering + faceting. The `/products` page is the only consumer.
 * Both `filterProducts` and `computeFacetCounts` share one `matchesSearch`, so the
 * faceted counts can never disagree with the filtered results (the previous inline
 * implementation matched search on name+description for counts but name+description+
 * type+subcategory+features for filtering).
 */

export interface CatalogFilters {
  search?: string;
  category?: string[]; // matches Product.category (the name string)
  brand?: string[]; // matches Product.brand_id
  en1822?: string[];
  fireRating?: string[];
  leakageClass?: string[];
  cert?: string[];
}

export interface FacetCounts {
  categories: Record<string, number>;
  brands: Record<string, number>;
  en1822: Record<string, number>;
  fireRating: Record<string, number>;
  leakageClass: Record<string, number>;
  certifications: Record<string, number>;
}

export function matchesSearch(p: Product, search?: string): boolean {
  if (!search) return true;
  const q = search.toLowerCase();
  return (
    p.name.toLowerCase().includes(q) ||
    (p.description?.toLowerCase().includes(q) ?? false) ||
    p.product_type.toLowerCase().includes(q) ||
    (p.subcategory?.toLowerCase().includes(q) ?? false) ||
    (p.features?.some((f) => f.toLowerCase().includes(q)) ?? false)
  );
}

const inCategory = (p: Product, f: CatalogFilters) =>
  !f.category?.length || f.category.includes(p.category);

const inBrand = (p: Product, f: CatalogFilters) =>
  !f.brand?.length || f.brand.includes(p.brand_id);

const inEn1822 = (p: Product, f: CatalogFilters) => {
  if (!f.en1822?.length) return true;
  const s = p.specifications;
  return s.spec_type === "filter" && !!s.filter_classification_en1822 && f.en1822.includes(s.filter_classification_en1822);
};

const inFireRating = (p: Product, f: CatalogFilters) => {
  if (!f.fireRating?.length) return true;
  const s = p.specifications;
  return s.spec_type === "damper" && s.fire_rating_hours != null && f.fireRating.includes(String(s.fire_rating_hours));
};

const inLeakage = (p: Product, f: CatalogFilters) => {
  if (!f.leakageClass?.length) return true;
  const s = p.specifications;
  return s.spec_type === "damper" && !!s.leakage_class && f.leakageClass.includes(s.leakage_class);
};

const inCert = (p: Product, f: CatalogFilters) =>
  !f.cert?.length || (p.certifications?.some((c) => f.cert!.includes(c.abbreviation)) ?? false);

export function filterProducts(products: Product[], f: CatalogFilters): Product[] {
  return products.filter(
    (p) =>
      matchesSearch(p, f.search) &&
      inCategory(p, f) &&
      inBrand(p, f) &&
      inEn1822(p, f) &&
      inFireRating(p, f) &&
      inLeakage(p, f) &&
      inCert(p, f),
  );
}

type Dim = "category" | "brand" | "en1822" | "fireRating" | "leakageClass" | "cert";

/** Passes every active filter except the named dimension (for faceted "available" counts). */
function passesExcept(p: Product, f: CatalogFilters, except: Dim): boolean {
  return (
    matchesSearch(p, f.search) &&
    (except === "category" || inCategory(p, f)) &&
    (except === "brand" || inBrand(p, f)) &&
    (except === "en1822" || inEn1822(p, f)) &&
    (except === "fireRating" || inFireRating(p, f)) &&
    (except === "leakageClass" || inLeakage(p, f)) &&
    (except === "cert" || inCert(p, f))
  );
}

const bump = (m: Record<string, number>, k: string) => {
  m[k] = (m[k] ?? 0) + 1;
};

export function computeFacetCounts(products: Product[], f: CatalogFilters): FacetCounts {
  const counts: FacetCounts = {
    categories: {},
    brands: {},
    en1822: {},
    fireRating: {},
    leakageClass: {},
    certifications: {},
  };

  for (const p of products) {
    if (passesExcept(p, f, "category")) bump(counts.categories, p.category);
    if (passesExcept(p, f, "brand")) bump(counts.brands, p.brand_id);

    const s = p.specifications;
    if (passesExcept(p, f, "en1822") && s.spec_type === "filter" && s.filter_classification_en1822)
      bump(counts.en1822, s.filter_classification_en1822);
    if (passesExcept(p, f, "fireRating") && s.spec_type === "damper" && s.fire_rating_hours != null)
      bump(counts.fireRating, String(s.fire_rating_hours));
    if (passesExcept(p, f, "leakageClass") && s.spec_type === "damper" && s.leakage_class)
      bump(counts.leakageClass, s.leakage_class);
    if (passesExcept(p, f, "cert"))
      for (const c of p.certifications ?? []) bump(counts.certifications, c.abbreviation);
  }

  return counts;
}
