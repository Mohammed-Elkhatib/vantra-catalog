import { getProducts, getBrands, getCategories } from "@/lib/db";
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

  // Dynamic filter function
  const filteredProducts = products.filter((product) => {
    // 1. Search Query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const nameMatch = product.name.toLowerCase().includes(searchLower);
      const descMatch = product.description?.toLowerCase().includes(searchLower) || false;
      const typeMatch = product.product_type.toLowerCase().includes(searchLower);
      const subcatMatch = product.subcategory?.toLowerCase().includes(searchLower) || false;
      const featureMatch = product.features?.some((f) => f.toLowerCase().includes(searchLower)) || false;
      if (!nameMatch && !descMatch && !typeMatch && !subcatMatch && !featureMatch) {
        return false;
      }
    }

    // 2. Category Filter
    if (categoriesFilter.length > 0 && !categoriesFilter.includes(product.category)) {
      return false;
    }

    // 3. Brand Filter
    if (brandsFilter.length > 0 && !brandsFilter.includes(product.brand_id)) {
      return false;
    }

    // 4. Specs: EN 1822 Filter
    if (en1822Filter.length > 0) {
      const specs = product.specifications;
      if (specs.spec_type !== "filter" || !specs.filter_classification_en1822 || !en1822Filter.includes(specs.filter_classification_en1822)) {
        return false;
      }
    }

    // 5. Specs: Fire Rating Filter
    if (fireRatingFilter.length > 0) {
      const specs = product.specifications;
      if (specs.spec_type !== "damper" || !specs.fire_rating_hours || !fireRatingFilter.includes(specs.fire_rating_hours.toString())) {
        return false;
      }
    }

    // 6. Specs: Leakage Class Filter
    if (leakageClassFilter.length > 0) {
      const specs = product.specifications;
      if (specs.spec_type !== "damper" || !specs.leakage_class || !leakageClassFilter.includes(specs.leakage_class)) {
        return false;
      }
    }

    // 7. Certifications Filter
    if (certsFilter.length > 0) {
      const hasCert = product.certifications?.some((c) => certsFilter.includes(c.abbreviation));
      if (!hasCert) {
        return false;
      }
    }

    return true;
  });

  // Calculate facet counts based on currently filtered products (simple implementation)
  const availableCounts = {
    categories: {} as Record<string, number>,
    brands: {} as Record<string, number>,
    en1822: {} as Record<string, number>,
    fireRating: {} as Record<string, number>,
    leakageClass: {} as Record<string, number>,
    certifications: {} as Record<string, number>,
  };

  products.forEach((product) => {
    // Check if item matches other filters except this specific facet to build proper faceted counts
    const matchesSearch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());

    if (matchesSearch) {
      // Category count
      const matchesBrand = brandsFilter.length === 0 || brandsFilter.includes(product.brand_id);
      const matchesSpecs =
        (en1822Filter.length === 0 || (product.specifications.spec_type === "filter" && product.specifications.filter_classification_en1822 && en1822Filter.includes(product.specifications.filter_classification_en1822))) &&
        (fireRatingFilter.length === 0 || (product.specifications.spec_type === "damper" && product.specifications.fire_rating_hours && fireRatingFilter.includes(product.specifications.fire_rating_hours.toString()))) &&
        (leakageClassFilter.length === 0 || (product.specifications.spec_type === "damper" && product.specifications.leakage_class && leakageClassFilter.includes(product.specifications.leakage_class))) &&
        (certsFilter.length === 0 || product.certifications?.some((c) => certsFilter.includes(c.abbreviation)));

      if (matchesBrand && matchesSpecs) {
        availableCounts.categories[product.category] = (availableCounts.categories[product.category] || 0) + 1;
      }

      // Brand count
      const matchesCategory = categoriesFilter.length === 0 || categoriesFilter.includes(product.category);
      if (matchesCategory && matchesSpecs) {
        availableCounts.brands[product.brand_id] = (availableCounts.brands[product.brand_id] || 0) + 1;
      }

      // EN 1822 count
      const specs = product.specifications;
      if (matchesCategory && matchesBrand && specs.spec_type === "filter" && specs.filter_classification_en1822) {
        availableCounts.en1822[specs.filter_classification_en1822] = (availableCounts.en1822[specs.filter_classification_en1822] || 0) + 1;
      }

      // Fire Rating count
      if (matchesCategory && matchesBrand && specs.spec_type === "damper" && specs.fire_rating_hours) {
        availableCounts.fireRating[specs.fire_rating_hours.toString()] = (availableCounts.fireRating[specs.fire_rating_hours.toString()] || 0) + 1;
      }

      // Leakage Class count
      if (matchesCategory && matchesBrand && specs.spec_type === "damper" && specs.leakage_class) {
        availableCounts.leakageClass[specs.leakage_class] = (availableCounts.leakageClass[specs.leakage_class] || 0) + 1;
      }

      // Certifications count
      if (matchesCategory && matchesBrand && matchesSpecs) {
        product.certifications?.forEach((c) => {
          availableCounts.certifications[c.abbreviation] = (availableCounts.certifications[c.abbreviation] || 0) + 1;
        });
      }
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">Product Catalog</h1>
          <p className="text-slate-500 text-sm mt-2">
            Showing {filteredProducts.length} of {products.length} products
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
            <div className="text-center py-20 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <Search className="w-8 h-8 text-slate-400 mx-auto mb-4" />
              <h3 className="font-bold text-slate-800 text-lg">No Products Found</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                No products match your current filters. Try adjusting your search query or clearing active checkboxes.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
