import { Product } from "@/types/catalog";
import { Download, FileText, ArrowRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
  brandName: string;
}

export default function ProductCard({ product, brandName }: ProductCardProps) {
  // Extract key badge details
  const getHighlightBadge = () => {
    const specs = product.specifications;
    if (specs.spec_type === "filter") {
      if (specs.filter_classification_en1822) {
        return `EN 1822 ${specs.filter_classification_en1822}`;
      }
      if (specs.merv_rating) {
        return `MERV ${specs.merv_rating}`;
      }
    } else if (specs.spec_type === "damper") {
      if (specs.fire_rating_hours) {
        return `${specs.fire_rating_hours} Hr Fire Rated`;
      }
      if (specs.leakage_class) {
        return `Leakage Class ${specs.leakage_class}`;
      }
    } else if (specs.spec_type === "sound_attenuator") {
      return "ASTM E477 Silencer";
    } else if (specs.spec_type === "coating") {
      const funcNames: Record<string, string> = {
        duct_coating: "Duct Coating",
        vapour_barrier: "Vapor Barrier",
        adhesive: "Duct Glue",
        sealant: "Joint Sealant",
      };
      return funcNames[specs.product_function] || "HVAC Coating";
    }
    return null;
  };

  const badgeText = getHighlightBadge();
  const tdsDoc = product.documents?.find((doc) => doc.type === "technical_data_sheet");
  const catalogDoc = product.documents?.find((doc) => doc.type === "catalog");

  return (
    <div className="flex flex-col rounded-xl border border-slate-100 bg-white hover:border-sky-500/20 hover:shadow-lg transition-all overflow-hidden h-full">
      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            {brandName}
          </span>
          {badgeText && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 uppercase tracking-wide border border-sky-100">
              {badgeText}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
          <a href={`/products/${product.id}`} className="hover:text-sky-700">
            {product.name}
          </a>
        </h3>

        <p className="mt-2 text-slate-500 text-xs line-clamp-3 leading-relaxed flex-1">
          {product.description}
        </p>

        {/* Technical tag pills */}
        <div className="mt-4 flex flex-wrap gap-1">
          {product.applications?.slice(0, 2).map((app) => (
            <span
              key={app}
              className="text-[10px] px-2 py-0.5 rounded bg-slate-50 text-slate-600 font-medium"
            >
              {app}
            </span>
          ))}
          {product.certifications?.slice(0, 2).map((cert) => (
            <span
              key={cert.abbreviation}
              className="text-[10px] px-2 py-0.5 rounded bg-red-50 text-red-700 font-semibold border border-red-100"
              title={cert.body}
            >
              {cert.abbreviation}
            </span>
          ))}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="border-t border-slate-50 bg-slate-50/50 p-4 flex flex-wrap items-center justify-between gap-2">
        <a
          href={`/products/${product.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-600 hover:underline"
        >
          Specifications <ArrowRight className="w-3 h-3" />
        </a>

        <div className="flex gap-1.5">
          {tdsDoc && (
            <a
              href={tdsDoc.url}
              download
              className="inline-flex items-center justify-center p-2 rounded bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-950 border border-slate-200 transition-colors"
              title={`Download TDS PDF (${(tdsDoc.file_size_kb || 1000) / 1000} MB)`}
            >
              <FileText className="w-3.5 h-3.5" />
            </a>
          )}
          {catalogDoc && (
            <a
              href={catalogDoc.url}
              download
              className="inline-flex items-center justify-center p-2 rounded bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-950 border border-slate-200 transition-colors"
              title={`Download Catalog PDF (${(catalogDoc.file_size_kb || 1000) / 1000} MB)`}
            >
              <Download className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
