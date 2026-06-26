"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

const fieldClass =
  "border border-rule bg-white px-3 py-2 text-sm text-ink placeholder-steel focus:border-ink focus:outline-none";
const labelClass = "font-mono text-[10px] uppercase tracking-[0.12em] text-steel";

export default function ContactForm({ products }: { products: string[] }) {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", product: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const p = searchParams.get("product");
    if (p) setForm((prev) => ({ ...prev, product: p }));
  }, [searchParams]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Demo only: no network call yet (a real email/CRM sink is post-demo).
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  if (submitted) {
    return (
      <div className="border border-rule bg-white p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-[var(--color-signal)]" />
        <h2 className="text-xl font-semibold text-ink">Inquiry received</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-steel">
          Thanks, <strong className="text-ink">{form.name}</strong>. Our Beirut engineering desk will review your
          requirements for <strong className="text-ink">{form.product || "your project"}</strong> and reply to{" "}
          <strong className="text-ink">{form.email}</strong> within one business day.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setForm({ name: "", email: "", phone: "", company: "", product: "", message: "" });
          }}
          className="mt-7 border border-rule px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink hover:border-ink"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 border border-rule bg-white p-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className={labelClass}>Full name *</label>
          <input id="name" name="name" required value={form.name} onChange={onChange} placeholder="Jane Engineer" className={fieldClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className={labelClass}>Email *</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={onChange} placeholder="jane@firm.com" className={fieldClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className={labelClass}>Phone</label>
          <input id="phone" name="phone" type="tel" value={form.phone} onChange={onChange} placeholder="+961 1 234 567" className={fieldClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="company" className={labelClass}>Company</label>
          <input id="company" name="company" value={form.company} onChange={onChange} placeholder="MEP Consultancy" className={fieldClass} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="product" className={labelClass}>Product of interest</label>
        <select id="product" name="product" value={form.product} onChange={onChange} className={fieldClass}>
          <option value="">General inquiry / custom sizing</option>
          {products.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className={labelClass}>
          Message &amp; requirements *
          <span className="mt-0.5 block font-sans text-[11px] normal-case tracking-normal text-steel">
            Include dimensions, airflow (CFM/CMH), pressure drop, or certification needs.
          </span>
        </label>
        <textarea id="message" name="message" required rows={4} value={form.message} onChange={onChange} placeholder="We need 25 H14 HEPA filters for a hospital OT suite in Beirut…" className={fieldClass} />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2 bg-ink py-3 font-mono text-[12px] uppercase tracking-[0.12em] text-paper transition-colors hover:bg-[var(--color-signal)] disabled:opacity-50"
      >
        <Send className="h-4 w-4" /> {submitting ? "Submitting…" : "Submit inquiry"}
      </button>
    </form>
  );
}
