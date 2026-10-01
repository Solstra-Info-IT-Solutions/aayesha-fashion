import type { ReactNode } from "react";

export function EyebrowLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`font-body text-[0.8125rem] leading-[1.4] font-semibold uppercase tracking-[0.2em] text-[var(--gold-metallic)] ${className}`}
    >
      {children}
    </p>
  );
}
