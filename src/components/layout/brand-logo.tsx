import Link from "next/link";

import { siteConfig } from "@/config/site";

interface BrandLogoProps {
  className?: string;
  compact?: boolean;
}

export function BrandLogo({
  className,
  compact = false,
}: BrandLogoProps) {
  return (
    <Link
      href="/"
      className={`group inline-flex flex-col items-center text-center ${className ?? ""}`}
      aria-label={`${siteConfig.name} home`}
    >
      <span
        className={`font-display leading-none tracking-[0.04em] text-[var(--color-charcoal)] transition-opacity duration-300 group-hover:opacity-70 ${
          compact ? "text-2xl" : "text-3xl"
        }`}
      >
        Aayesha
      </span>

      {!compact && (
        <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.42em] text-[var(--color-text-secondary)]">
          Fashion
        </span>
      )}
    </Link>
  );
}