import Link from "next/link";
import { Product } from "@/types/catalog";
import { Download, FileText, ArrowRight } from "lucide-react";
import ProductGlyph from "./instruments/ProductGlyph";
import { formatFileSize } from "@/lib/format";
import { quickSpecs } from "@/lib/product-display";

interface ProductCardProps {
  product: Product;
  brandName: string;
}

export default function ProductCard({ product, brandName }: ProductCardProps) {
  const tdsDoc = product.documents?.find((d) => d.type === "technical_data_sheet");
  const catalogDoc = product.documents?.find((d) => d.type === "catalog");
  const specs = quickSpecs(product);

  return (
    <div className="group flex h-full flex-col border border-rule bg-white transition-colors hover:border-ink">
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between">
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel">{brandName}</div>
          <ProductGlyph productType={product.product_type} size={40} />
        </div>

        <h3 className="mt-3 text-base font-semibold leading-snug text-ink">
          <Link href={`/products/${product.id}`} className="transition-colors group-hover:text-[var(--color-signal)]">
            {product.name}
          </Link>
        </h3>

        <dl className="mt-4 divide-y divide-rule border-y border-rule">
          {specs.map((row) => (
            <div key={row.k} className="flex items-center justify-between py-1.5">
              <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-steel">{row.k}</dt>
              <dd className="font-mono text-xs text-ink">{row.v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex items-center justify-between border-t border-rule px-5 py-3">
        <Link
          href={`/products/${product.id}`}
          className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ink transition-colors hover:text-[var(--color-signal)]"
        >
          Specs <ArrowRight className="h-3 w-3" />
        </Link>
        <div className="flex gap-1.5">
          {tdsDoc && (
            <a
              href={tdsDoc.url}
              download
              aria-label={`Download datasheet PDF (${formatFileSize(tdsDoc.file_size_kb)})`}
              className="inline-flex items-center justify-center border border-rule p-2 text-steel transition-colors hover:border-ink hover:text-ink"
            >
              <FileText className="h-3.5 w-3.5" />
            </a>
          )}
          {catalogDoc && (
            <a
              href={catalogDoc.url}
              download
              aria-label={`Download catalogue PDF (${formatFileSize(catalogDoc.file_size_kb)})`}
              className="inline-flex items-center justify-center border border-rule p-2 text-steel transition-colors hover:border-ink hover:text-ink"
            >
              <Download className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
