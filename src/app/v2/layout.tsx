import type { Metadata } from "next";
import Link from "next/link";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { mulish } from "../fonts";

export const metadata: Metadata = {
  // The demo's /v2 routes must not be indexed (no duplicate content).
  robots: { index: false, follow: false },
};

export default function V2Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-theme="cms"
      className={`${mulish.variable} flex min-h-screen flex-col bg-paper font-sans text-ink`}
    >
      <header className="sticky top-0 z-50 border-b border-rule bg-paper/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/v2" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center bg-[var(--color-signal)] text-sm font-extrabold text-white">V</span>
            <span className="text-xl font-extrabold tracking-tight text-ink">Vantra</span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-steel">Lebanon</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-steel sm:flex">
            <Link href="/v2" className="transition-colors hover:text-[var(--color-signal)]">Home</Link>
            <Link href="/v2/products" className="transition-colors hover:text-[var(--color-signal)]">Products</Link>
            <Link href="/v2/contact" className="transition-colors hover:text-[var(--color-signal)]">Contact</Link>
            <ThemeSwitcher current="b" />
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-[var(--color-signal)] text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-10 sm:px-6 lg:px-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold">Vantra Lebanon &middot; A CMS Global company</p>
          <p className="text-xs text-white/80">&copy; {new Date().getFullYear()} Vantra Lebanon. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
