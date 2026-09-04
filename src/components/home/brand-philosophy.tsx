import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/shared/container";

export function BrandPhilosophy() {
  return (
    <section
      id="our-story"
      className="relative overflow-hidden bg-[var(--color-ivory)]"
    >
      <Container>
        <div className="py-20 sm:py-24 lg:py-28 xl:py-32">
          {/* =====================================================
              SECTION LABEL
          ===================================================== */}

          <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-5 sm:pt-6">
            <div className="flex items-center gap-4">
              <span className="h-px w-8 bg-[var(--color-rose-dark)]" />

              <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[var(--color-text-secondary)] sm:text-[9px]">
                The House of Ayesha
              </p>
            </div>

            <span className="font-display text-lg text-[var(--color-text-muted)] sm:text-xl">
              01
            </span>
          </div>

          {/* =====================================================
              INTRO
          ===================================================== */}

          <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:items-end lg:gap-12">
            <div className="lg:col-span-8">
              <p className="mb-5 text-[8px] font-semibold uppercase tracking-[0.28em] text-[var(--color-rose-dark)] sm:text-[9px]">
                Our Philosophy
              </p>

              <h2 className="max-w-[850px] font-display text-[3.4rem] font-medium leading-[0.9] tracking-[-0.045em] text-[var(--color-charcoal)] sm:text-[4.5rem] md:text-[5.3rem] lg:text-[5.8rem] xl:text-[6.4rem]">
                Designed for
                <span className="block">
                  the woman who values
                </span>
                <span className="block italic text-[var(--color-rose-dark)]">
                  elegance.
                </span>
              </h2>
            </div>

            <div className="lg:col-span-4 lg:pb-2">
              <p className="max-w-md text-sm leading-7 text-[var(--color-text-secondary)] sm:text-[15px] sm:leading-8">
                Ayesha is an expression of refined
                femininity. Thoughtfully selected
                silhouettes, graceful details, and
                timeless pieces created for moments
                that deserve to be remembered.
              </p>
            </div>
          </div>

          {/* =====================================================
              STORY AREA
          ===================================================== */}

          <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:items-center lg:gap-14">
            {/* IMAGE */}

            <div className="lg:col-span-5">
              <div className="relative overflow-hidden bg-[var(--color-warm-gray)]">
                <Image
                  src="/images/home/brand-philosophy.jpg"
                  alt="Ayesha Fashion's refined Indian fashion aesthetic"
                  width={1000}
                  height={1250}
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 1023px) 100vw, 42vw"
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-[8px] font-semibold uppercase tracking-[0.26em] text-[var(--color-text-muted)]">
                  Modern Indian Elegance
                </span>

                <span className="text-[8px] font-semibold uppercase tracking-[0.26em] text-[var(--color-text-muted)]">
                  Ayesha
                </span>
              </div>
            </div>

            {/* TEXT */}

            <div className="lg:col-span-7 lg:pl-6 xl:pl-14">
              <div className="max-w-[650px]">
                <p className="text-[15px] leading-8 text-[var(--color-text-secondary)] sm:text-base sm:leading-8 lg:text-[17px]">
                  We believe true elegance does not
                  ask for attention. It is felt in the
                  silhouette, seen in the details, and
                  remembered long after the moment
                  has passed.
                </p>

                <p className="mt-6 text-[15px] leading-8 text-[var(--color-text-secondary)] sm:text-base sm:leading-8 lg:text-[17px]">
                  Every Ayesha piece balances the
                  richness of Indian craft with the
                  ease of contemporary dressing,
                  creating a wardrobe that feels
                  personal, graceful, and enduring.
                </p>

                {/* CTA */}

                <div className="mt-9">
                  <Link
                    href="/our-story"
                    className="
                      group
                      inline-flex
                      min-h-12
                      items-center
                      gap-5
                      border
                      border-[var(--color-charcoal)]
                      bg-transparent
                      px-5
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-[var(--color-charcoal)]
                      transition-all
                      duration-300
                      hover:bg-[var(--color-charcoal)]
                      hover:text-white
                    "
                  >
                    <span>Discover Our Story</span>

                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.4}
                      className="
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                        group-hover:-translate-y-0.5
                      "
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              BOTTOM STATEMENT
          ===================================================== */}

          <div className="mt-16 border-t border-[var(--color-border)] pt-6 sm:mt-20 lg:mt-24">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
                Refined · Feminine · Considered
              </p>

              <p className="font-display text-lg italic text-[var(--color-charcoal)]">
                A study in timeless femininity
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}