import Link from "next/link";

// Root-level 404. Renders under the slimmed root layout (no site chrome), so it
// carries its own minimal branding rather than a bare unstyled Next.js default.
export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <span className="text-lg font-bold tracking-[0.16em] text-ink">VANTRA</span>
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-steel">404: page not found</p>
      <p className="max-w-sm text-sm text-steel">
        The page you are looking for does not exist or may have moved.
      </p>
      <div className="mt-2 flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.14em] text-steel">
        <Link href="/products" className="transition-colors hover:text-ink">Go to catalog</Link>
        <Link href="/v2" className="transition-colors hover:text-ink">Design B home</Link>
      </div>
    </div>
  );
}
