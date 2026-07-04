import type { Metadata } from "next";
import Link from "next/link";
import { getProductById, getProducts, getBrands } from "@/lib/db";
import { buildProductMetadata, buildProductJsonLd } from "@/lib/seo";
import DynamicSpecs from "@/components/DynamicSpecs";
import SelectionTable from "@/components/SelectionTable";
import ModelDecoder from "@/components/ModelDecoder";
import ProductGlyph from "@/components/instruments/ProductGlyph";
import { formatFileSize } from "@/lib/format";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, FileText, Send, BadgeAlert } from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductById(slug);
  if (!product) return { title: "Product not found | Vantra Lebanon" };
  // robots noindex is inherited from v2/layout.tsx; canonical points at the Design A URL.
  return buildProductMetadata(product);
}

export default async function V2ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductById(slug);
  if (!product) notFound();

  const brands = await getBrands();
  const brand = brands.find((b) => b.id === product.brand_id);
  const tdsDoc = product.documents?.find((d) => d.type === "technical_data_sheet");
  const catalogDoc = product.documents?.find((d) => d.type === "catalog");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProductJsonLd(product, brand)).replace(/</g, "\\u003c") }}
      />
      <Link href="/v2/products" className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-steel transition-colors hover:text-[var(--color-signal)]">
        <ArrowLeft className="h-4 w-4" /> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="flex items-start justify-between gap-6 border-b border-rule pb-6">
            <div>
              <div className="mb-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-signal)]">
                {brand ? brand.name : product.brand_id} &middot; {product.category}
                {product.subcategory ? ` · ${product.subcategory}` : ""}
              </div>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">{product.name}</h1>
            </div>
            <ProductGlyph productType={product.product_type} size={64} className="shrink-0" />
          </div>

          {product.description && <p className="text-lg font-light leading-relaxed text-steel">{product.description}</p>}

          {product.features && product.features.length > 0 && (
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-steel">Key features</h3>
              <ul className="grid grid-cols-1 gap-2.5 text-sm text-ink md:grid-cols-2">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-signal)]" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.applications && product.applications.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-steel">Applications</h3>
              <div className="flex flex-wrap gap-1.5">
                {product.applications.map((app) => (
                  <span key={app} className="rounded-sm border border-rule px-2.5 py-1 text-xs font-medium text-ink">{app}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 lg:col-span-1">
          <div className="rounded-sm border border-rule bg-white p-5">
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-steel">Documents</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-steel">Ungated. Sourced from CMS Global factories.</p>
            <div className="mt-4 flex flex-col gap-2">
              {tdsDoc ? (
                <a href={tdsDoc.url} download className="group flex items-center gap-3 rounded-sm border border-rule p-3 transition-colors hover:border-[var(--color-signal)]">
                  <FileText className="h-5 w-5 shrink-0 text-[var(--color-signal)]" />
                  <span className="flex-1 text-left">
                    <span className="block text-xs font-bold text-ink">Technical Datasheet</span>
                    <span className="block text-[11px] text-steel">PDF &middot; {formatFileSize(tdsDoc.file_size_kb)}</span>
                  </span>
                  <Download className="h-4 w-4 text-steel transition-colors group-hover:text-ink" />
                </a>
              ) : (
                <div className="flex items-center gap-3 rounded-sm border border-dashed border-rule p-3 text-steel">
                  <BadgeAlert className="h-5 w-5 shrink-0" />
                  <span className="text-xs">No datasheet PDF yet</span>
                </div>
              )}
              {catalogDoc && (
                <a href={catalogDoc.url} download className="group flex items-center gap-3 rounded-sm border border-rule p-3 transition-colors hover:border-[var(--color-signal)]">
                  <Download className="h-5 w-5 shrink-0 text-ink" />
                  <span className="flex-1 text-left">
                    <span className="block text-xs font-bold text-ink">Product Catalogue</span>
                    <span className="block text-[11px] text-steel">PDF &middot; {formatFileSize(catalogDoc.file_size_kb)}</span>
                  </span>
                  <Download className="h-4 w-4 text-steel transition-colors group-hover:text-ink" />
                </a>
              )}
            </div>
          </div>

          <div className="rounded-sm border border-rule bg-white p-5">
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-steel">Request sizing &amp; pricing</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-steel">Need a custom size or project pricing for Lebanon tenders?</p>
            <Link href={`/v2/contact?product=${encodeURIComponent(product.name)}`} className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-[var(--color-signal)] py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90">
              <Send className="h-3.5 w-3.5" /> Submit Inquiry
            </Link>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="mb-5 text-xl font-extrabold tracking-tight text-ink">Technical Specifications</h2>
        <DynamicSpecs specs={product.specifications} />
      </section>

      {product.variants && product.variants.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 text-xl font-extrabold tracking-tight text-ink">Dimensions &amp; Sizing</h2>
          <SelectionTable variants={product.variants} />
        </section>
      )}

      {product.model_numbering_scheme && (
        <section className="mt-16">
          <ModelDecoder scheme={product.model_numbering_scheme} />
        </section>
      )}
    </div>
  );
}
