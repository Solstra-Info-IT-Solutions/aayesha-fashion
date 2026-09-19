export function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block h-px w-full bg-[var(--gold-metallic)]/40 ${className}`}
    />
  );
}
