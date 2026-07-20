import type { Metadata } from "next";
import type { Product } from "@/types/catalog";
import type { Brand } from "@/lib/db";

const SITE = "Vantra Lebanon";

/** One or two headline spec values for structured data, by spec type. */
function keyProperties(p: Product): { "@type": "PropertyValue"; name: string; value: string }[] {
  const s = p.specifications;
  const props: { "@type": "PropertyValue"; name: string; value: string }[] = [];
  if (s.spec_type === "filter") {
    if (s.filter_classification_en1822) props.push({ "@type": "PropertyValue", name: "EN 1822", value: s.filter_classification_en1822 });
    if (s.merv_rating != null) props.push({ "@type": "PropertyValue", name: "MERV", value: String(s.merv_rating) });
  } else if (s.spec_type === "damper") {
    if (s.fire_rating_hours != null) props.push({ "@type": "PropertyValue", name: "Fire rating (hours)", value: String(s.fire_rating_hours) });
    if (s.leakage_class) props.push({ "@type": "PropertyValue", name: "Leakage class", value: s.leakage_class });
  } else if (s.spec_type === "sound_attenuator") {
    props.push({ "@type": "PropertyValue", name: "Type", value: s.attenuator_type });
  } else {
    props.push({ "@type": "PropertyValue", name: "Function", value: s.product_function });
  }
  return props;
}

export function buildProductMetadata(p: Product): Metadata {
  const title = `${p.name} · ${p.category} | ${SITE}`;
  const description = p.description ?? `${p.name}: specifications and datasheet from ${SITE}.`;
  const url = `/products/${p.id}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", siteName: SITE },
  };
}

export function buildListingMetadata(): Metadata {
  const title = `Product Catalog | ${SITE}`;
  const description =
    "Browse and filter medical-grade HVAC air filters, dampers, sound attenuators, and coatings. Full specifications and instant datasheet downloads.";
  return {
    title,
    description,
    alternates: { canonical: "/products" },
    openGraph: { title, description, url: "/products", type: "website", siteName: SITE },
  };
}

export function buildProductJsonLd(p: Product, brand?: Brand) {
  const props = keyProperties(p);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    ...(p.description ? { description: p.description } : {}),
    category: p.category,
    brand: { "@type": "Brand", name: brand?.name ?? p.brand_id },
    ...(props.length ? { additionalProperty: props } : {}),
  };
}
