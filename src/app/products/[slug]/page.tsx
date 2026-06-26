import Link from "next/link";
import { getProductById, getBrands } from "@/lib/db";
import DynamicSpecs from "@/components/DynamicSpecs";
import SelectionTable from "@/components/SelectionTable";
import ModelDecoder from "@/components/ModelDecoder";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, FileText, Send, BadgeAlert } from "lucide-react";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 3600; // Cache individual pages for 1 hour

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const brands = await getBrands();
  const brand = brands.find((b) => b.id === product.brand_id);
  const tdsDoc = product.documents?.find((doc) => doc.type === "technical_data_sheet");
  const catalogDoc = product.documents?.find((doc) => doc.type === "catalog");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back link */}
      <div className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-sky-600 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
        </Link>
      </div>

      {/* Main product overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16 items-start">
        {/* Left/Middle: Info & Features */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-xs uppercase font-bold text-sky-700 tracking-wider">
                {brand ? brand.name : product.brand_id}
              </span>
              <span className="text-slate-300 text-xs">|</span>
              <span className="text-xs font-medium text-slate-500">
                {product.category} {product.subcategory && `> ${product.subcategory}`}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>
          </div>

          <p className="text-slate-600 text-base leading-relaxed">
            {product.description}
          </p>

          {/* Features list */}
          {product.features && product.features.length > 0 && (
            <div className="mt-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3.5">
                Key Features & Benefits
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600">
                {product.features.map((feat, index) => (
                  <li key={index} className="flex gap-2.5 items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-sky-50 text-sky-600 text-xs font-bold mt-0.5 shrink-0">
                      ✓
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Application pills */}
          {product.applications && product.applications.length > 0 && (
            <div className="pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Recommended Applications
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {product.applications.map((app) => (
                  <span
                    key={app}
                    className="text-xs px-3 py-1 rounded-full bg-slate-50 text-slate-700 font-semibold border border-slate-100"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Downloads & Quick CTAs */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Quick Downloads Card */}
          <div className="border border-slate-100 p-6 rounded-xl bg-slate-50/50 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Document Downloads
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Standard ungated access. Sourced from official UAE factories.
            </p>
            <div className="flex flex-col gap-2.5 mt-2">
              {tdsDoc ? (
                <a
                  href={tdsDoc.url}
                  download
                  className="flex items-center gap-3 p-3 rounded-lg bg-white border border-slate-200 hover:border-sky-500 hover:shadow-sm transition-all"
                >
                  <FileText className="w-5 h-5 text-sky-600 shrink-0" />
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate">Technical Datasheet (TDS)</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      PDF • {tdsDoc.file_size_kb ? `${(tdsDoc.file_size_kb / 1000).toFixed(1)} MB` : "1.2 MB"}
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 hover:text-sky-600 transition-colors" />
                </a>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-slate-200 bg-white/50 text-slate-400">
                  <BadgeAlert className="w-5 h-5 shrink-0" />
                  <span className="text-xs">No Datasheet PDF available</span>
                </div>
              )}

              {catalogDoc && (
                <a
                  href={catalogDoc.url}
                  download
                  className="flex items-center gap-3 p-3 rounded-lg bg-white border border-slate-200 hover:border-sky-500 hover:shadow-sm transition-all"
                >
                  <Download className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate">Full Product Catalog</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      PDF • {catalogDoc.file_size_kb ? `${(catalogDoc.file_size_kb / 1000).toFixed(1)} MB` : "4.5 MB"}
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 hover:text-emerald-600 transition-colors" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Inquiry Card */}
          <div className="border border-slate-100 p-6 rounded-xl bg-white shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Request Sizing & Pricing
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Need custom modifications or pricing for project tenders in Lebanon?
            </p>
            <Link
              href={`/contact?product=${encodeURIComponent(product.name)}`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors w-full mt-2"
            >
              <Send className="w-3.5 h-3.5" /> Submit Inquiry
            </Link>
          </div>
        </div>
      </div>

      {/* Specifications Table Section */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-6">
          Technical Specifications
        </h2>
        <DynamicSpecs specs={product.specifications} />
      </section>

      {/* Sizing & Sizing Table (Variants) */}
      {product.variants && product.variants.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-6">
            Dimensions & Sizing Chart
          </h2>
          <SelectionTable variants={product.variants} />
        </section>
      )}

      {/* Model reference decoder helper */}
      {product.model_numbering_scheme && (
        <section className="mb-16">
          <ModelDecoder scheme={product.model_numbering_scheme} />
        </section>
      )}
    </div>
  );
}
