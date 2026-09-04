import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { editorialCampaign } from "@/data/home";

export function EditorialCampaign() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-charcoal)]">
      {/* =========================================================
          CAMPAIGN IMAGE
      ========================================================== */}
      <div className="relative min-h-[620px] sm:min-h-[680px] lg:min-h-[760px] xl:min-h-[820px]">
        <Image
          src={editorialCampaign.image.src}
          alt={editorialCampaign.image.alt}
          fill
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* =======================================================
            CINEMATIC OVERLAY
        ======================================================== */}

        {/* Left readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-black/5" />

        {/* Bottom readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* =======================================================
            CONTENT
        ======================================================== */}

        <div className="absolute inset-0 z-10">
          <div className="flex h-full flex-col justify-between px-6 py-7 sm:px-8 sm:py-9 lg:px-12 lg:py-11 xl:px-16">
            {/* =================================================
                TOP META
            ================================================== */}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="h-px w-7 bg-[var(--color-rose-light)]/80" />

                <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-white/75 sm:text-[9px]">
                  {editorialCampaign.eyebrow}
                </p>
              </div>

              <p className="hidden text-[8px] font-medium uppercase tracking-[0.28em] text-white/50 sm:block">
                Aayesha Fashion
              </p>
            </div>

            {/* =================================================
                MAIN CONTENT
            ================================================== */}

            <div className="max-w-2xl pb-3 sm:pb-5 lg:max-w-3xl">
              {/* HEADING */}

              <h2
                className="
                  font-display
                  max-w-3xl
                  text-[3.6rem]
                  font-medium
                  leading-[0.84]
                  tracking-[-0.035em]
                  text-white

                  sm:text-[4.8rem]

                  md:text-[5.8rem]

                  lg:text-[7rem]

                  xl:text-[8rem]
                "
              >
                <span className="block">
                  {editorialCampaign.title.lineOne}
                </span>

                <span className="block pl-[7%] italic text-[var(--color-rose-light)]">
                  {editorialCampaign.title.lineTwo}
                </span>
              </h2>

              {/* =================================================
                  BOTTOM CONTENT
              ================================================== */}

              <div
                className="
                  mt-8
                  flex
                  max-w-2xl
                  flex-col
                  gap-6
                  border-t
                  border-white/20
                  pt-5

                  sm:mt-10
                  sm:gap-8
                  sm:pt-6

                  lg:mt-12
                  lg:flex-row
                  lg:items-end
                  lg:justify-between
                "
              >
                {/* DESCRIPTION */}

                <p className="max-w-md text-[12px] leading-6 text-white/75 sm:text-sm sm:leading-7">
                  {editorialCampaign.description}
                </p>

                {/* CTA */}

                <Link
                  href={editorialCampaign.action.href}
                  className="
                    group
                    inline-flex
                    w-fit
                    shrink-0
                    items-center
                    gap-3

                    border-b
                    border-white/60
                    pb-2

                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.22em]
                    text-white

                    transition-all
                    duration-300

                    hover:border-[var(--color-rose-light)]
                    hover:text-[var(--color-rose-light)]
                  "
                >
                  {editorialCampaign.action.label}

                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.3}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </div>

            {/* =================================================
                BOTTOM META
            ================================================== */}

            <div className="flex items-end justify-between">
              <span className="font-display text-xl text-white/55 sm:text-2xl">
                04
              </span>

              <p className="hidden text-[8px] uppercase tracking-[0.26em] text-white/40 md:block">
                The Signature Campaign
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}