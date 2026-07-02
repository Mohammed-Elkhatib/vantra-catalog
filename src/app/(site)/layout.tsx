import Link from "next/link";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-rule bg-paper/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="text-lg font-bold tracking-[0.16em] text-ink">VANTRA</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-steel">Lebanon</span>
          </Link>
          <nav className="flex items-center gap-7 font-mono text-[11px] uppercase tracking-[0.14em] text-steel">
            <Link href="/" className="transition-colors hover:text-ink">Home</Link>
            <Link href="/products" className="transition-colors hover:text-ink">Catalog</Link>
            <Link href="/contact" className="transition-colors hover:text-ink">Contact</Link>
            <ThemeSwitcher current="a" />
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-rule bg-paper py-12 text-steel">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 lg:px-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs">&copy; {new Date().getFullYear()} Vantra Lebanon. A CMS Global company.</p>
          <div className="flex gap-6 font-mono text-[11px] uppercase tracking-[0.14em]">
            <Link href="/contact" className="transition-colors hover:text-ink">Support</Link>
            <Link href="/contact" className="transition-colors hover:text-ink">Privacy</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
