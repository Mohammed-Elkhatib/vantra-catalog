import Link from "next/link";
import { getCategories, getBrands } from "@/lib/db";
import { ArrowRight, Factory } from "lucide-react";
import EfficiencyCurve from "@/components/instruments/EfficiencyCurve";

export const revalidate = 3600;

const STANDARDS = ["UL", "ETL", "AMCA", "BSRIA", "EN 1822", "ASTM"];

export default async function Home() {
  const [categories, brands] = await Promise.all([getCategories(), getBrands()]);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-rule">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-steel">
              Medical-grade HVAC · Open catalog
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Filtration built for
              <br />
              critical environments.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-steel">
              Vantra brings CMS Global&apos;s air filtration, dampers, and acoustic attenuators to Lebanon. Browse
              the range, compare specifications, and download any datasheet instantly.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-ink px-6 py-3 font-mono text-[12px] uppercase tracking-[0.12em] text-paper transition-colors hover:bg-[var(--color-signal)]"
              >
                Browse Catalog <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-rule px-6 py-3 font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink"
              >
                Request Specs
              </Link>
            </div>
          </div>

          {/* Signature: the physics */}
          <div className="border border-rule bg-white p-6">
            <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-steel">
              HEPA efficiency · particle size
            </div>
            <EfficiencyCurve width={320} height={150} efficiencyLabel="99.995%" />
            <p className="mt-4 border-t border-rule pt-4 text-xs leading-relaxed text-steel">
              Efficiency curves, classification scales, pressure gauges, and octave-band acoustics, rendered
              from each product&apos;s certified test data.
            </p>
          </div>
        </div>
      </section>

      {/* Standards strip */}
      <section className="border-b border-rule bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-3 px-4 py-6 sm:px-6 lg:px-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-steel">Tested to</span>
          {STANDARDS.map((s) => (
            <span key={s} className="font-mono text-sm font-medium text-ink">
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Browse by category</h2>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${encodeURIComponent(category.name)}`}
              className="group flex flex-col border border-rule bg-white p-6 transition-colors hover:border-ink"
            >
              <h3 className="text-lg font-semibold text-ink transition-colors group-hover:text-[var(--color-signal)]">
                {category.name}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-steel">{category.description}</p>
              <div className="mt-6 flex items-center justify-between border-t border-rule pt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-steel">
                <span>{category.product_count} products</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Heritage */}
      <section className="border-y border-rule bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-steel">CMS Global heritage</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Forty years of HVAC engineering
            </h2>
            <p className="mt-6 leading-relaxed text-steel">
              Vantra is the Levant arm of Century Mechanical Systems (CMS Group), founded in 1982. CMS runs eight
              manufacturing facilities across the Gulf and Sri Lanka, supplying certified components to projects in
              over fifty countries.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-rule pt-8">
              <div>
                <div className="font-mono text-3xl font-semibold text-ink">8</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-steel">Factories</div>
              </div>
              <div>
                <div className="font-mono text-3xl font-semibold text-ink">54+</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-steel">Export countries</div>
              </div>
            </div>
          </div>

          <div className="border border-rule p-6">
            <h3 className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink">
              <Factory className="h-4 w-4 text-[var(--color-signal)]" /> Brands carried
            </h3>
            <div className="mt-4 divide-y divide-rule">
              {brands.map((brand) => (
                <div key={brand.id} className="py-4 first:pt-0 last:pb-0">
                  <h4 className="text-sm font-semibold text-ink">{brand.name}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-steel">{brand.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-carbon">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-paper sm:text-3xl">Get technical specs instantly</h2>
          <p className="mx-auto mt-4 max-w-2xl text-steel">
            Find the exact product for your project and download the datasheet in one click.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-2 bg-paper px-6 py-3 font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors hover:bg-[var(--color-signal)] hover:text-paper"
          >
            Explore Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
