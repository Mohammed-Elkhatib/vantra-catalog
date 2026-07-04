import Link from "next/link";
import { Product } from "@/types/catalog";
import { Download, FileText, ArrowRight } from "lucide-react";
import ProductGlyph from "@/components/instruments/ProductGlyph";
import { formatFileSize } from "@/lib/format";
import { quickSpecs } from "@/lib/product-display";

export default function ProductCardCms({ product, brandName }: { product: Product; brandName: string }) {
  const tdsDoc = product.documents?.find((d) => d.type === "technical_data_sheet");
  const catalogDoc = product.documents?.find((d) => d.type === "catalog");
  const specs = quickSpecs(product);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-sm border border-rule bg-white transition-shadow hover:shadow-lg">
      <div className="flex items-center justify-between bg-[var(--color-paper)] px-5 py-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-steel">{brandName}</span>
        <ProductGlyph productType={product.product_type} size={40} />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold leading-snug text-ink">
          <Link href={`/v2/products/${product.id}`} className="transition-colors group-hover:text-[var(--color-signal)]">
            {product.name}
          </Link>
        </h3>
        <dl className="mt-4 flex-1 divide-y divide-rule border-y border-rule">
          {specs.map((row) => (
            <div key={row.k} className="flex items-center justify-between py-1.5">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-steel">{row.k}</dt>
              <dd className="text-sm font-medium text-ink">{row.v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex items-center justify-between">
          <Link href={`/v2/products/${product.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-signal)]">
            View specs <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <div className="flex gap-1.5">
            {tdsDoc && (
              <a href={tdsDoc.url} download aria-label={`Download datasheet PDF (${formatFileSize(tdsDoc.file_size_kb)})`} className="inline-flex items-center justify-center rounded-sm border border-rule p-2 text-steel transition-colors hover:border-[var(--color-signal)] hover:text-[var(--color-signal)]">
                <FileText className="h-3.5 w-3.5" />
              </a>
            )}
            {catalogDoc && (
              <a href={catalogDoc.url} download aria-label={`Download catalogue PDF (${formatFileSize(catalogDoc.file_size_kb)})`} className="inline-flex items-center justify-center rounded-sm border border-rule p-2 text-steel transition-colors hover:border-[var(--color-signal)] hover:text-[var(--color-signal)]">
                <Download className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
