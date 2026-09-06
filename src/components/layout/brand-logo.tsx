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
        items-center
        justify-center
        leading-none
        text-[var(--color-charcoal)]
        transition-opacity
        duration-200
        hover:opacity-80
      "
    >
      {/* =====================================================
          LOGO MARK
      ===================================================== */}

      <Image
        src="/images/logo.png"
        alt="Aayesha Fashion"
        width={46}
        height={46}
        priority
        className="
          h-[38px]
          w-[38px]
          shrink-0
          object-contain
          sm:h-[42px]
          sm:w-[42px]
        "
      />

      {/* =====================================================
          BRAND WORDMARK
      ===================================================== */}

      <span
        className="
          ml-3
          flex
          flex-col
          items-start
          justify-center
        "
      >
        {/* AAYESHA */}

        <span
          className="
            font-[var(--font-display)]
            text-[26px]
            font-medium
            leading-[0.9]
            tracking-[-0.035em]
            text-[var(--color-charcoal)]
            sm:text-[29px]
          "
        >
          Aayesha
        </span>

        {/* FASHION */}

        <span
          className="
            mt-[5px]
            pl-[0.18em]
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
      </span>
    </Link>
  );
}