import Link from "next/link";

import { mainNavigation } from "@/config/navigation";

export function DesktopNavigation() {
  return (
    <nav
      className="hidden items-center gap-7 xl:flex"
      aria-label="Main navigation"
    >
      {mainNavigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group relative py-2 text-[11px] font-semibold uppercase tracking-[0.13em] text-[var(--color-charcoal)] transition-colors duration-300 hover:text-[var(--color-text-secondary)]"
        >
          {item.label}

          <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[var(--color-charcoal)] transition-transform duration-300 group-hover:scale-x-100" />
        </Link>
      ))}
    </nav>
  );
}