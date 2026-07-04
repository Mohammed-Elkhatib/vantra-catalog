import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  imageSrc?: string; // optional; falls back to a blue gradient field
}

export default function Hero({ eyebrow, title, subtitle, imageSrc }: HeroProps) {
  return (
    <section
      className="relative isolate overflow-hidden bg-[var(--color-carbon)] text-white"
      style={
        imageSrc
          ? {
              backgroundImage: `linear-gradient(180deg, rgba(13,18,28,0.72), rgba(13,18,28,0.72)), url(${imageSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {
              backgroundImage:
                "radial-gradient(110% 140% at 80% 0%, #2b6fb0 0%, #1f4f86 45%, #14233a 100%)",
            }
      }
    >
      <div className="mx-auto max-w-6xl px-4 py-28 sm:px-6 lg:px-8 lg:py-36">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/80">
          {eyebrow}
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-white/90">
          {subtitle}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/v2/products"
            className="inline-flex items-center gap-2 border border-white/80 px-7 py-3 text-sm font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-white hover:text-[var(--color-carbon)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-carbon)]"
          >
            Browse Products <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/v2/contact"
            className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white/90 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-1"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
