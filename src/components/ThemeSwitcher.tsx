"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { counterpartPath } from "@/lib/design-switch";

/** Small A/B pill. `current` marks which design is active; the other is a link. */
export default function ThemeSwitcher({ current }: { current: "a" | "b" }) {
  const pathname = usePathname();
  const target = counterpartPath(pathname || "/", current);
  const activeCls = "px-2 py-0.5 text-[11px] font-semibold";
  const onCls = `${activeCls} bg-[var(--color-signal)] text-white`;
  const offCls = `${activeCls} text-steel transition-colors hover:text-ink`;
  return (
    <span className="inline-flex items-center overflow-hidden rounded-sm border border-rule">
      {current === "a" ? (
        <>
          <span className={onCls} aria-current="true">A</span>
          <Link href={target} className={offCls} prefetch={false} aria-label="Switch to Design B">B</Link>
        </>
      ) : (
        <>
          <Link href={target} className={offCls} prefetch={false} aria-label="Switch to Design A">A</Link>
          <span className={onCls} aria-current="true">B</span>
        </>
      )}
    </span>
  );
}
