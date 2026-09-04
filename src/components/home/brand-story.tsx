import Image from "next/image";

import { Container } from "@/components/shared/container";
import { LinkButton } from "@/components/ui/button";

export function BrandStory() {
  return (
    <section
      id="brand-story"
      className="bg-[var(--color-ivory)]"
    >
      <Container>
          <div className="pt-2 pb-8 sm:pt-3 sm:pb-12 lg:pt-2 lg:pb-11">
          {/* =====================================================
              SECTION HEADER
          ===================================================== */}

          <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-5 sm:pt-6">
            <div className="flex items-center gap-4">
              <span className="h-px w-8 bg-[var(--color-rose-dark)]" />

              <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[var(--color-text-secondary)] sm:text-[9px]">
                Brand Story
              </p>
            </div>

            <span className="font-display text-lg text-[var(--color-text-muted)] sm:text-xl">
              06
            </span>
          </div>

          {/* =====================================================
              MAIN EDITORIAL CONTENT
          ===================================================== */}

          <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:items-center lg:gap-14 xl:gap-20">
            {/* ===================================================
                LEFT CONTENT
            =================================================== */}

            <div className="lg:col-span-6">
              <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[var(--color-rose-dark)] sm:text-[9px]">
                The House of Ayesha
              </p>

              <h2
                className="
                  mt-5
                  max-w-[620px]
                  font-display
                  text-[3.3rem]
                  font-medium
                  leading-[0.9]
                  tracking-[-0.045em]
                  text-[var(--color-charcoal)]
                  sm:text-[4.2rem]
                  md:text-[5rem]
                  lg:text-[5.6rem]
                  xl:text-[6.2rem]
                "
              >
                The art of
                <span className="block italic text-[var(--color-rose-dark)]">
                  modern Indian
                </span>
                <span className="block">
                  elegance.
                </span>
              </h2>

              <div className="mt-8 max-w-[520px]">
                <p className="text-sm leading-7 text-[var(--color-text-secondary)] sm:text-[15px] sm:leading-8">
                  Ayesha brings together the richness
                  of Indian craftsmanship with the ease
                  of contemporary dressing.
                </p>

                <p className="mt-5 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-[15px] sm:leading-8">
                  Every silhouette is considered with
                  intention — balancing graceful detail,
                  confident femininity, and timeless
                  appeal.
                </p>
              </div>

              <div className="mt-8">
                <LinkButton
                  href="/our-story"
                  variant="secondary"
                  size="md"
                  icon={
                    <span aria-hidden="true">
                      ↗
                    </span>
                  }
                >
                  Discover Our Story
                </LinkButton>
              </div>
            </div>

            {/* ===================================================
                IMAGE
            =================================================== */}

            <div className="lg:col-span-6">
              <div className="relative mx-auto w-full max-w-[620px] overflow-hidden bg-[var(--color-warm-gray)]">
                <Image
                  src="/images/home/brand-story.jpg"
                  alt="Ayesha Fashion editorial portrait representing modern Indian elegance"
                  width={1200}
                  height={1500}
                  className="
                    h-auto
                    w-full
                    object-cover
                    transition-transform
                    duration-1000
                    ease-out
                    hover:scale-[1.015]
                  "
                  sizes="(max-width: 1023px) 100vw, 50vw"
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
                  Modern Indian Elegance
                </p>

                <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
                  Ayesha Fashion
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              BOTTOM STATEMENT
          ===================================================== */}

          <div className="mt-14 border-t border-[var(--color-border)] pt-6 sm:mt-16 lg:mt-20">
            <p className="max-w-3xl font-display text-[1.6rem] leading-[1.1] tracking-[-0.02em] text-[var(--color-charcoal)] sm:text-[2rem]">
              Thoughtful design, beautiful craftsmanship,
              and pieces made to remain relevant beyond
              the season.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}