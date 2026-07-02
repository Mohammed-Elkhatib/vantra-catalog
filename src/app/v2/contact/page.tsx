import { Suspense } from "react";
import { getProducts } from "@/lib/db";
import ContactForm from "@/components/ContactForm";
import { Phone, Mail, MapPin } from "lucide-react";

export const revalidate = 3600;

export default async function V2ContactPage() {
  const products = await getProducts();
  const productNames = products.map((p) => p.name);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Reach the engineering desk</h1>
        <p className="mx-auto mt-3 max-w-xl text-lg font-light leading-relaxed text-steel">
          Contact our Beirut team for sizing sheets, certification needs, or project tender pricing.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense fallback={<div className="rounded-sm border border-rule bg-white p-8 text-center text-xs text-steel">Loading form...</div>}>
            <ContactForm products={productNames} />
          </Suspense>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-1">
          <div className="rounded-sm border border-rule bg-white p-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-steel">Vantra Lebanon</h3>
            <div className="mt-4 flex flex-col gap-4 text-xs leading-relaxed text-steel">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-[var(--color-signal)]" />
                <span><strong className="block text-ink">Office</strong>Dora Highway, Beirut, Lebanon</span>
              </div>
              <div className="flex items-start gap-2.5 border-t border-rule pt-4">
                <Phone className="h-4 w-4 shrink-0 text-[var(--color-signal)]" />
                <span><strong className="block text-ink">Phone</strong><span className="font-medium">+961 1 254 870</span></span>
              </div>
              <div className="flex items-start gap-2.5 border-t border-rule pt-4">
                <Mail className="h-4 w-4 shrink-0 text-[var(--color-signal)]" />
                <span><strong className="block text-ink">Email</strong><span className="font-medium">sales.lb@ventra-leb.com</span></span>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-rule bg-white p-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-steel">Global network</h3>
            <p className="mt-2 text-xs leading-relaxed text-steel">
              Backed by the CMS Group engineering and manufacturing network across the UAE, KSA, Kuwait, Oman, and Sri Lanka.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
