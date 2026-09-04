import Link from "next/link";

export function BrandLogo() {
  return (
    <Link
      href="/"
      aria-label="Ayesha Fashion home"
      className="
        flex
        flex-col
        items-center
        leading-none
        text-[var(--color-charcoal)]
      "
    >
      <span
        className="
          font-display
          text-[27px]
          font-medium
          tracking-[-0.025em]
          sm:text-[30px]
        "
      >
        Aayesha
      </span>

      <span
        className="
          mt-1
          text-[6px]
          font-medium
          uppercase
          tracking-[0.4em]
          text-[var(--color-text-muted)]
        "
      >
        Fashion
      </span>
    </Link>
  );
}