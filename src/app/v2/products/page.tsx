import type { Metadata } from "next";
import { getProducts, getBrands, getCategories } from "@/lib/db";
import { filterProducts, computeFacetCounts, type CatalogFilters } from "@/lib/catalog-filter";
import { buildListingMetadata } from "@/lib/seo";
import ProductCardCms from "@/components/v2/ProductCardCms";
import FilterSidebar from "@/components/FilterSidebar";
import SearchInput from "@/components/SearchInput";
import { Search } from "lucide-react";

export const metadata: Metadata = buildListingMetadata();
export const revalidate = 0;

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string; category?: string; brand?: string;
    en1822?: string; fireRating?: string; leakageClass?: string; cert?: string;
  }>;
}

export default async function V2ProductsPage({ searchParams }: ProductsPageProps) {
  const sp = await searchParams;
  const filters: CatalogFilters = {
    search: sp.search || undefined,
    category: sp.category ? sp.category.split(",") : [],
    brand: sp.brand ? sp.brand.split(",") : [],
    en1822: sp.en1822 ? sp.en1822.split(",") : [],
    fireRating: sp.fireRating ? sp.fireRating.split(",") : [],
    leakageClass: sp.leakageClass ? sp.leakageClass.split(",") : [],
    cert: sp.cert ? sp.cert.split(",") : [],
  };

  const [products, brands, categories] = await Promise.all([getProducts(), getBrands(), getCategories()]);
  const filteredProducts = filterProducts(products, filters);
  const availableCounts = computeFacetCounts(products, filters);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-6 border-b border-rule pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Product Catalog</h1>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-steel">
            {filteredProducts.length} / {products.length} products
          </p>
        </div>
        <div className="w-full md:w-80">
          <SearchInput defaultValue={sp.search || ""} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <FilterSidebar categories={categories} brands={brands} availableCounts={availableCounts} />
        </aside>
        <main className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => {
                const brand = brands.find((b) => b.id === product.brand_id);
                return <ProductCardCms key={product.id} product={product} brandName={brand ? brand.name : product.brand_id} />;
              })}
            </div>
          ) : (
            <div className="rounded-sm border border-dashed border-rule bg-white py-20 text-center">
              <Search className="mx-auto mb-4 h-7 w-7 text-steel" />
              <h3 className="text-lg font-bold text-ink">No products found</h3>
              <p className="mx-auto mt-1 max-w-sm text-sm text-steel">Nothing matches your current filters. Try clearing a facet or adjusting your search.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
