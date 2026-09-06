import Image from "next/image";
import Link from "next/link";

export function BrandLogo() {
  return (
    <Link
      href="/"
      aria-label="Aayesha Fashion — Home"
      className="
        group
        inline-flex
        flex-col
        items-center
        justify-center
        leading-none
        text-[var(--color-charcoal)]
      "
    >
      {/* BRAND LOGO IMAGE */}
      <Image
        src="/images/logo.png"
        alt="Aayesha Fashion"
        width={38}
        height={38}
        priority
        className="
          h-[34px]
          w-auto
          object-contain
          transition-opacity
          duration-200
          group-hover:opacity-80
          sm:h-[38px]
        "
      />

      {/* BRAND NAME */}
      <span
        className="
          mt-[5px]
          font-[var(--font-display)]
          text-[26px]
          font-medium
          leading-none
          tracking-[-0.045em]
          transition-opacity
          duration-200
          group-hover:opacity-80
          sm:text-[29px]
        "
      >
        Aayesha
      </span>

      {/* SUB BRAND */}
      <span
        className="
          mt-[4px]
          pl-[0.32em]
          text-[6px]
          font-medium
          uppercase
          tracking-[0.42em]
          text-[var(--color-text-muted)]
          sm:text-[6.5px]
        "
      >
        Fashion
      </span>
    </Link>
  );
}