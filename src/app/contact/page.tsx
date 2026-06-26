"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Send, CheckCircle2, Phone, Mail, MapPin } from "lucide-react";

function ContactForm() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    product: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill product from URL parameter
  useEffect(() => {
    const productParam = searchParams.get("product");
    if (productParam) {
      setFormData((prev) => ({ ...prev, product: productParam }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-16 border border-slate-100 rounded-xl bg-slate-50/50 max-w-2xl mx-auto shadow-sm p-8">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Inquiry Submitted Successfully</h2>
        <p className="text-slate-600 mt-3 text-sm leading-relaxed">
          Thank you for reaching out, <strong className="text-slate-800">{formData.name}</strong>. A technical sizing engineer from Vantra Lebanon will review your requirements for <strong className="text-slate-800">{formData.product || "our HVAC components"}</strong> and get back to you at <strong className="text-slate-800">{formData.email}</strong> within 24 hours.
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setFormData({ name: "", email: "", phone: "", company: "", product: "", message: "" });
          }}
          className="mt-8 px-5 py-2.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors"
        >
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-white border border-slate-100 p-8 rounded-xl shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white text-slate-900"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="johndoe@company.com"
            className="border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white text-slate-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+961 1 234567"
            className="border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white text-slate-900"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="company" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Company / Contractor
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Engineering Consultancy LLC"
            className="border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white text-slate-900"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="product" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Product of Interest
        </label>
        <select
          id="product"
          name="product"
          value={formData.product}
          onChange={handleChange}
          className="border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white text-slate-900"
        >
          <option value="">General Inquiry / Custom Sizing</option>
          <option value="HEPA HT-900 High-Temperature Filter">HEPA HT-900 High-Temperature Filter</option>
          <option value="HEPA BIO Biological Safety Filter">HEPA BIO Biological Safety Filter</option>
          <option value="HEPA SC Standard Capacity Filter">HEPA SC Standard Capacity Filter</option>
          <option value="Excelair Washable Aluminum Pre-Filter">Excelair Washable Aluminum Pre-Filter</option>
          <option value="Super Pleat MERV 13 Extended Surface Filter">Super Pleat MERV 13 Extended Surface Filter</option>
          <option value="V-Cell FG 3V Compact Filter">V-Cell FG 3V Compact Filter</option>
          <option value="CACU V-Type Carbon Panel">CACU V-Type Carbon Panel</option>
          <option value="EFD-140 V-Lock Fire Damper">EFD-140 V-Lock Fire Damper</option>
          <option value="EFSD-342 Fire & Smoke Damper">EFSD-342 Fire & Smoke Damper</option>
          <option value="CSA Rectangular Sound Attenuator">CSA Rectangular Sound Attenuator</option>
          <option value="ECO Series Kitchen Ecology Unit">ECO Series Kitchen Ecology Unit</option>
          <option value="Premier 30-36 UL Canvas Duct Coating">Premier 30-36 UL Canvas Duct Coating</option>
          <option value="Premier VB-95 UL Vapour Barrier Coating">Premier VB-95 UL Vapour Barrier Coating</option>
          <option value="Premier 32-17 UL Antibacterial Duct Sealant">Premier 32-17 UL Antibacterial Duct Sealant</option>
          <option value="Premier 81-10 UL Duct Adhesive">Premier 81-10 UL Duct Adhesive</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Message & Project Specifications *
          <span className="text-[10px] text-slate-400 normal-case font-normal block mt-0.5">
            Specify dimensions, airflow requirements (CFM/CMH), pressure drops, or certification needs.
          </span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          value={formData.message}
          onChange={handleChange}
          placeholder="We require 25 units of H14 HEPA filters for a hospital OT suite in Beirut..."
          className="border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white text-slate-900"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded bg-sky-600 hover:bg-sky-500 font-bold text-white text-sm shadow-sm transition-colors mt-2 disabled:opacity-50"
      >
        <Send className="w-4 h-4" /> {isSubmitting ? "Submitting..." : "Submit Project Inquiry"}
      </button>
    </form>
  );
}

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">Reach Us</h1>
        <p className="text-slate-500 text-sm mt-3 leading-relaxed max-w-xl mx-auto">
          Contact our local engineering desk in Beirut for sizing sheets, custom certification needs, or project tender pricing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start max-w-5xl mx-auto">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Suspense fallback={<div className="p-8 border border-slate-100 rounded-xl bg-slate-50 text-center text-xs">Loading contact form...</div>}>
            <ContactForm />
          </Suspense>
        </div>

        {/* Office Contact Info */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="border border-slate-100 p-6 rounded-xl bg-slate-50/50 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Vantra Lebanon Office
            </h3>
            <div className="flex flex-col gap-4 text-xs text-slate-600 leading-relaxed mt-2">
              <div className="flex gap-2.5 items-start">
                <MapPin className="w-4.5 h-4.5 text-sky-600 shrink-0" />
                <div>
                  <strong className="text-slate-800 block">Location</strong>
                  Vantra Building, Dora Highway,<br />
                  Beirut, Lebanon
                </div>
              </div>
              <div className="flex gap-2.5 items-start border-t border-slate-200/50 pt-4">
                <Phone className="w-4.5 h-4.5 text-sky-600 shrink-0" />
                <div>
                  <strong className="text-slate-800 block">Phone</strong>
                  +961 1 254870
                </div>
              </div>
              <div className="flex gap-2.5 items-start border-t border-slate-200/50 pt-4">
                <Mail className="w-4.5 h-4.5 text-sky-600 shrink-0" />
                <div>
                  <strong className="text-slate-800 block">Email</strong>
                  sales.lb@ventra-leb.com
                </div>
              </div>
            </div>
          </div>

          <div className="border border-slate-100 p-6 rounded-xl bg-white shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
              Parent Global Network
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Vantra is supported by the full engineering and manufacturing capabilities of the CMS Group network (UAE, KSA, Kuwait, Oman, Sri Lanka).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
