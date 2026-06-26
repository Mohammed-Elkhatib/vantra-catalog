import { getProducts, getBrands, getCategories } from "@/lib/db";
import { filterProducts, computeFacetCounts, type CatalogFilters } from "@/lib/catalog-filter";
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";
import { Search } from "lucide-react";
import SearchInput from "@/components/SearchInput";

export const revalidate = 0; // Dynamic route based on search params

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    brand?: string;
    en1822?: string;
    fireRating?: string;
    leakageClass?: string;
    cert?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Await searchParams in Next.js 15
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams.search || "";
  const categoriesFilter = resolvedSearchParams.category ? resolvedSearchParams.category.split(",") : [];
  const brandsFilter = resolvedSearchParams.brand ? resolvedSearchParams.brand.split(",") : [];
  const en1822Filter = resolvedSearchParams.en1822 ? resolvedSearchParams.en1822.split(",") : [];
  const fireRatingFilter = resolvedSearchParams.fireRating ? resolvedSearchParams.fireRating.split(",") : [];
  const leakageClassFilter = resolvedSearchParams.leakageClass ? resolvedSearchParams.leakageClass.split(",") : [];
  const certsFilter = resolvedSearchParams.cert ? resolvedSearchParams.cert.split(",") : [];

  const [products, brands, categories] = await Promise.all([
    getProducts(),
    getBrands(),
    getCategories(),
  ]);

  // Filtering and faceted counts live in a tested, pure module (src/lib/catalog-filter).
  const filters: CatalogFilters = {
    search: searchQuery || undefined,
    category: categoriesFilter,
    brand: brandsFilter,
    en1822: en1822Filter,
    fireRating: fireRatingFilter,
    leakageClass: leakageClassFilter,
    cert: certsFilter,
  };
  const filteredProducts = filterProducts(products, filters);
  const availableCounts = computeFacetCounts(products, filters);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex flex-col gap-6 border-b border-rule pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Product Catalog</h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-steel">
            {filteredProducts.length} / {products.length} products
          </p>
        </div>
        <div className="w-full md:w-80">
          <SearchInput defaultValue={searchQuery} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <aside className="lg:col-span-1">
          <FilterSidebar
            categories={categories}
            brands={brands}
            availableCounts={availableCounts}
          />
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => {
                const brand = brands.find((b) => b.id === product.brand_id);
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    brandName={brand ? brand.name : product.brand_id}
                  />
                );
              })}
            </div>
          ) : (
            <div className="border border-dashed border-rule bg-white py-20 text-center">
              <Search className="mx-auto mb-4 h-7 w-7 text-steel" />
              <h3 className="text-lg font-semibold text-ink">No products found</h3>
              <p className="mx-auto mt-1 max-w-sm text-sm text-steel">
                Nothing matches your current filters. Try clearing a facet or adjusting your search.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
