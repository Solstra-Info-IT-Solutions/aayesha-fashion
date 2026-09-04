import Image from "next/image";
import { LinkButton } from "@/components/ui/button";

import { ArrowUpRight } from "lucide-react";

import { homeHero } from "@/data/home";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--color-charcoal)]">
      {/* =========================================================
          BACKGROUND EDITORIAL IMAGE
      ========================================================== */}
      <div className="absolute inset-0">
        <Image
          src={homeHero.image.src}
          alt={homeHero.image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center]"
        />
      </div>

      {/* =========================================================
          CINEMATIC OVERLAYS
      ========================================================== */}

      {/* Desktop editorial gradient */}
      <div
        className="
          absolute inset-0
          bg-[linear-gradient(
            90deg,
            rgba(18,19,19,0.72)_0%,
            rgba(18,19,19,0.48)_32%,
            rgba(18,19,19,0.12)_58%,
            rgba(18,19,19,0.08)_100%
          )]
        "
      />

      {/* Bottom readability gradient */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-t
          from-black/60
          via-black/10
          to-transparent
        "
      />

      {/* Mobile overlay */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-t
          from-black/85
          via-black/35
          to-black/10
          lg:hidden
        "
      />

      {/* =========================================================
          HERO CONTENT
      ========================================================== */}

      <div
        className="
          relative z-10
          flex
          min-h-[calc(100svh-128px)]
          flex-col
          justify-between
          px-6
          py-8
          sm:px-8
          sm:py-10
          lg:min-h-[calc(100svh-140px)]
          lg:px-14
          lg:py-12
          xl:px-20
        "
      >
        {/* =======================================================
            TOP EDITORIAL INFORMATION
        ======================================================== */}

        <div className="flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-4">
            <span className="h-px w-8 bg-[var(--color-rose)] sm:w-10" />

            <p
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.28em]
                text-white/80
                sm:text-[10px]
                sm:tracking-[0.32em]
              "
            >
              {homeHero.eyebrow}
            </p>
          </div>

          {/* Right */}
          <p
            className="
              hidden
              text-[9px]
              font-medium
              uppercase
              tracking-[0.3em]
              text-white/60
              sm:block
            "
          >
            {homeHero.collection}
          </p>
        </div>

        {/* =======================================================
            MAIN CONTENT
        ======================================================== */}

        <div
          className="
            relative
            max-w-[1100px]
            pb-8
            pt-20
            sm:pt-24
            lg:pb-12
            lg:pt-16
          "
        >
          {/* =====================================================
              MAIN EDITORIAL HEADING
          ====================================================== */}

          <h1
            className="
              font-display
              text-[4.8rem]
              font-medium
              leading-[0.78]
              tracking-[-0.045em]
              text-white

              sm:text-[6.5rem]

              md:text-[8rem]

              lg:text-[9.5rem]

              xl:text-[11.5rem]

              2xl:text-[13rem]
            "
          >
            <span className="block">
              {homeHero.title.first}
            </span>

            <span
              className="
                block
                pl-[14%]
                italic
                text-[var(--color-rose-light)]
              "
            >
              {homeHero.title.second}
            </span>
          </h1>

          {/* =====================================================
              DESCRIPTION + CTA
          ====================================================== */}

          <div
            className="
              mt-12
              flex
              flex-col
              gap-10
              border-t
              border-white/20
              pt-7

              sm:flex-row
              sm:items-end
              sm:justify-between

              lg:mt-16
              lg:max-w-[760px]
            "
          >
            {/* Description */}
            <p
              className="
                max-w-sm
                text-sm
                leading-7
                text-white/75

                sm:text-base
                sm:leading-8
              "
            >
              {homeHero.description}
            </p>

            {/* Actions */}
            <div className="flex flex-col items-start gap-5">
              {/* Primary CTA */}
              <LinkButton
                href={homeHero.primaryAction.href}
                variant="rose"
                size="lg"
                icon={
                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.5}
                  />
                }
            >
              {homeHero.primaryAction.label}
            </LinkButton>

              {/* Secondary CTA */}
              <LinkButton
  href={homeHero.secondaryAction.href}
  variant="darkOutline"
  size="md"
>
  {homeHero.secondaryAction.label}
</LinkButton>
            </div>
          </div>
        </div>

        {/* =======================================================
            BOTTOM EDITORIAL INDEX
        ======================================================== */}

        <div className="flex items-end justify-between">
          {/* Slide Index */}
          <div className="flex items-center gap-4">
            <span
              className="
                font-display
                text-3xl
                leading-none
                text-white
              "
            >
              01
            </span>

            <span className="h-px w-12 bg-white/40" />

            <span
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.25em]
                text-white/60
              "
            >
              03
            </span>
          </div>

          {/* Copyright */}
          <p
            className="
              hidden
              text-[9px]
              uppercase
              tracking-[0.25em]
              text-white/50
              md:block
            "
          >
            Ayesha Fashion © 2026
          </p>
        </div>
      </div>

      {/* =========================================================
          VERTICAL EDITORIAL DETAIL
      ========================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-16
          right-6
          hidden
          origin-bottom-right
          rotate-[-90deg]

          lg:block
          xl:right-10
        "
      >
        <span
          className="
            text-[9px]
            uppercase
            tracking-[0.4em]
            text-white/50
          "
        >
          Designed for Timeless Moments
        </span>
      </div>
    </section>
  );
}