import { getCategories, getBrands } from "@/lib/db";
import { ShieldCheck, ArrowRight, Download, PhoneCall, Award, Factory } from "lucide-react";

export const revalidate = 3600; // Cache for 1 hour

export default async function Home() {
  const [categories, brands] = await Promise.all([
    getCategories(),
    getBrands(),
  ]);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute inset-0 bg-[radial-gradient(#0075b2_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-6">
              <ShieldCheck className="w-3.5 h-3.5" /> Medical-Grade & Industrial HVAC Solutions
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Open Product Catalog <br />
              <span className="text-sky-400">Zero Registration Required</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl">
              Vantra brings CMS Global's industry-leading air filtration, dampers, and acoustic attenuators to the Levant. Access all specifications and download catalog PDFs instantly.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-sky-600 hover:bg-sky-500 font-semibold text-white shadow-sm transition-all"
              >
                Browse Products <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-slate-800 hover:bg-slate-700 font-semibold text-slate-200 border border-slate-700 transition-all"
              >
                Request Custom Specs <PhoneCall className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Banner */}
      <section className="border-b border-slate-100 bg-slate-50 py-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center md:text-left md:flex md:items-center md:justify-between gap-8">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 md:mb-0">
              Trusted Certifications & Standards
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
              <div className="flex items-center gap-1 font-bold text-slate-700 text-sm">
                <span className="text-red-600 font-extrabold">UL</span> LISTED
              </div>
              <div className="flex items-center gap-1 font-bold text-slate-700 text-sm">
                <span className="text-sky-700">ETL</span> INTERTEK
              </div>
              <div className="flex items-center gap-1 font-bold text-slate-700 text-sm">
                AMCA MEMBER
              </div>
              <div className="flex items-center gap-1 font-bold text-slate-700 text-sm">
                BSRIA CERTIFIED
              </div>
              <div className="flex items-center gap-1 font-bold text-slate-700 text-sm">
                SMACNA COMPLIANT
              </div>
              <div className="flex items-center gap-1 font-bold text-slate-700 text-sm">
                EN 1822 TESTED
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Product Categories
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Select a category to explore specifications and compare sizing models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`/products?category=${encodeURIComponent(category.name)}`}
              className="group relative flex flex-col p-8 rounded-xl border border-slate-100 hover:border-sky-500/30 hover:shadow-xl hover:shadow-sky-500/5 bg-white transition-all overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-all -z-0"></div>
              <div className="relative z-10 flex-1">
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-sky-50 text-sky-700 uppercase tracking-wide">
                  {category.name}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-6 group-hover:text-sky-700 transition-colors">
                  {category.name}
                </h3>
                <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                  {category.description}
                </p>
              </div>
              <div className="relative z-10 mt-8 pt-6 border-t border-slate-50 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-sky-700 transition-colors">
                <span>{category.product_count} Products listed</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Corporate Heritage Section */}
      <section className="bg-slate-50 py-20 sm:py-28 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">CMS Global Heritage</span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-2 sm:text-4xl">
                35+ Years of Engineering Excellence
              </h2>
              <p className="mt-6 text-slate-600 leading-relaxed">
                Vantra operates as the Levant subsidiary of Century Mechanical Systems (CMS Group). Founded in 1982, CMS operates 8 manufacturing facilities across the Gulf region and Sri Lanka, employing over 1,000 personnel.
              </p>
              <p className="mt-4 text-slate-600 leading-relaxed">
                By maintaining these local warehouses and leveraging regional manufacturing capabilities, Vantra delivers certified, high-spec HVAC components directly to engineering projects in Lebanon with shortened lead times.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-6 border-t border-slate-200 pt-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">8</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Factories</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">54+</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Export Countries</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Factory className="w-5 h-5 text-sky-600" /> Authorized Brands
              </h3>
              <div className="divide-y divide-slate-100">
                {brands.map((brand) => (
                  <div key={brand.id} className="py-4 first:pt-0 last:pb-0">
                    <h4 className="font-bold text-slate-800 text-sm">{brand.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{brand.description}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Origin: {brand.origin}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Immediate Access Banner */}
      <section className="py-20 sm:py-24 bg-sky-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="w-12 h-12 mx-auto text-sky-200 mb-6" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Get Technical Specifications Instantly
          </h2>
          <p className="mt-4 text-lg text-sky-100 max-w-2xl mx-auto">
            Skip the registration forms, credential logins, and broken links. Find the exact product specifications you need for your HVAC projects.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-white hover:bg-slate-50 font-semibold text-sky-700 shadow-sm transition-all"
            >
              Explore Products <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
