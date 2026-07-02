import Link from "next/link";
import { getCategories, getBrands } from "@/lib/db";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/v2/Hero";
import CategoryTile from "@/components/v2/CategoryTile";

export const revalidate = 3600;

const STANDARDS = ["UL", "ETL", "AMCA", "BSRIA", "EN 1822", "ASTM"];

export default async function V2Home() {
  const [categories, brands] = await Promise.all([getCategories(), getBrands()]);

  return (
    <div>
      <Hero
        eyebrow="Medical-grade HVAC"
        title="Engineered air, delivered with confidence."
        subtitle="Vantra brings CMS Global's certified air filtration, dampers, and acoustic attenuators to Lebanon. Open catalog, instant datasheets, no registration."
      />

      {/* Standards strip */}
      <section className="border-b border-rule bg-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-10 gap-y-3 px-4 py-6 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-steel">
            Tested to
          </span>
          {STANDARDS.map((s) => (
            <span key={s} className="text-sm font-bold text-[var(--color-signal)]">
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-ink">Browse by category</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryTile
              key={category.id}
              name={category.name}
              description={category.description}
              productCount={category.product_count}
            />
          ))}
        </div>
      </section>

      {/* Heritage */}
      <section className="border-y border-rule bg-paper">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-signal)]">
              CMS Global heritage
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink">
              Forty years of HVAC engineering
            </h2>
            <p className="mt-6 text-lg font-light leading-relaxed text-steel">
              Vantra is the Levant arm of Century Mechanical Systems, founded in 1982. CMS runs eight
              manufacturing facilities across the Gulf and Sri Lanka, supplying certified components
              to projects in over fifty countries.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-rule pt-8">
              <div>
                <div className="text-4xl font-extrabold text-[var(--color-signal)]">8</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-steel">
                  Factories
                </div>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-[var(--color-signal)]">54+</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-steel">
                  Export countries
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-sm border border-rule bg-white p-7">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-ink">
              Brands carried
            </h3>
            <div className="mt-4 divide-y divide-rule">
              {brands.map((brand) => (
                <div key={brand.id} className="py-4 first:pt-0 last:pb-0">
                  <h4 className="text-sm font-bold text-ink">{brand.name}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-steel">{brand.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--color-signal)]">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Get technical specs instantly
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/85">
            Find the exact product for your project and download the datasheet in one click. No
            registration, no gate.
          </p>
          <Link
            href="/v2/products"
            className="mt-8 inline-flex items-center gap-2 border border-white px-7 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-white hover:text-[var(--color-signal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-signal)]"
          >
            Explore Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
