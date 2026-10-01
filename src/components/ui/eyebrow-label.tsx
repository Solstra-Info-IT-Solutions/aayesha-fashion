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
      className={`font-body text-[0.75rem] leading-[1.4] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)] ${className}`}
    >
      {children}
    </p>
  );
}
