"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function BrandLogo() {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <Link
      href="/"
      onClick={handleLogoClick}
      aria-label="Aayesha Fashion — Home"
      className="
        group
        relative
        z-[70]
        inline-flex
        items-center
        justify-center
        leading-none
        text-[var(--color-text)]
        transition-opacity
        duration-[var(--duration-fast)]
        hover:opacity-80
        cursor-pointer
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
          pointer-events-none
          h-[36px]
          w-[36px]
          shrink-0
          object-contain
          sm:h-[40px]
          sm:w-[40px]
          md:h-[42px]
          md:w-[42px]
        "
      />

      {/* =====================================================
          BRAND WORDMARK
      ===================================================== */}

      <span
        className="
          pointer-events-none
          ml-2.5
          flex
          flex-col
          items-start
          justify-center
          sm:ml-3
        "
      >
        {/* AAYESHA */}

        <span
          className="
            font-display
            text-[25px]
            font-medium
            leading-[0.88]
            tracking-[-0.035em]
            text-[var(--color-text)]
            sm:text-[28px]
            md:text-[30px]
          "
        >
          Aayesha
        </span>

        {/* FASHION */}

        <span
          className="
            mt-[5px]
            pl-[0.2em]
            font-body
            text-[6px]
            font-medium
            uppercase
            leading-none
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