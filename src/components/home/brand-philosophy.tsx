import Image from "next/image";
import { LinkButton } from "@/components/ui/button";

import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/shared/container";

export function BrandPhilosophy() {
  return (
    <section
      id="our-story"
      className="relative overflow-hidden bg-[var(--color-ivory)]"
    >
      <Container>
        <div className="relative py-20 sm:py-28 lg:py-32 xl:py-40">
          {/* =====================================================
              SECTION HEADER
          ====================================================== */}

          <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-5 sm:pt-6">
            <div className="flex items-center gap-4">
              <span className="h-px w-8 bg-[var(--color-rose-dark)]" />

              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--color-text-secondary)]">
                The House of Aayesha
              </p>
            </div>

            <span className="font-display text-xl text-[var(--color-charcoal)] sm:text-2xl">
              01
            </span>
          </div>

          {/* =====================================================
              MAIN EDITORIAL GRID
          ====================================================== */}

          <div className="relative mt-16 grid gap-14 lg:mt-24 lg:grid-cols-12 lg:items-center lg:gap-10 xl:gap-16">
            {/* =================================================
                LEFT CONTENT
            ================================================== */}

            <div className="relative lg:col-span-7">
              {/* Editorial label */}

              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-[var(--color-rose-dark)]" />

                <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[var(--color-rose-dark)]">
                  Our Philosophy
                </p>
              </div>

              {/* Main Heading */}

              <h2 className="mt-8 max-w-[760px] font-display text-[4rem] font-medium leading-[0.88] tracking-[-0.04em] text-[var(--color-charcoal)] sm:text-[5.4rem] md:text-[6.5rem] lg:text-[5.8rem] xl:text-[7rem]">
                <span className="block">
                  Designed for
                </span>

                <span className="block pl-[7%]">
                  the woman who
                </span>

                <span className="block pl-[14%]">
                  values{" "}
                  <em className="text-[var(--color-rose-dark)]">
                    elegance.
                  </em>
                </span>
              </h2>

              {/* Bottom information */}

              <div className="mt-12 flex flex-col gap-8 border-t border-[var(--color-border)] pt-7 sm:mt-14 sm:flex-row sm:items-end sm:justify-between lg:max-w-[680px]">
                <p className="max-w-sm text-sm leading-7 text-[var(--color-text-secondary)] sm:text-[15px] sm:leading-8">
                  Aayesha is an expression of refined femininity.
                  Thoughtfully selected silhouettes, graceful details,
                  and timeless pieces created for moments that deserve
                  to be remembered.
                </p>

                <LinkButton
  href="/about"
  variant="secondary"
  size="md"
  icon={
    <ArrowUpRight
      size={15}
      strokeWidth={1.5}
    />
  }
>
  Discover Our Story
</LinkButton>
              </div>

              {/* Brand signature */}

              <div className="mt-12 hidden items-center gap-4 lg:flex">
                <span className="h-px w-10 bg-[var(--color-border-dark)]" />

                <span className="text-[8px] font-semibold uppercase tracking-[0.32em] text-[var(--color-text-muted)]">
                  Refined · Feminine · Timeless
                </span>
              </div>
            </div>

            {/* =================================================
                RIGHT EDITORIAL IMAGE
            ================================================== */}

            <div className="relative lg:col-span-5">
              {/* Architectural background block */}

              <div className="absolute -bottom-6 -right-6 hidden h-[78%] w-[78%] border border-[var(--color-rose)]/40 lg:block" />

              {/* Main Image */}

              <div className="relative ml-auto w-full max-w-[500px]">
                <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-warm-gray)]">
                  <Image
                    src="/images/home/brand-philosophy.jpg"
                    alt="Ayesha Fashion editorial collection"
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                  />

                  {/* Subtle image treatment */}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                  {/* Image editorial index */}

                  <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5 text-white sm:p-6">
                    <div>
                      <p className="text-[8px] font-medium uppercase tracking-[0.24em] text-white/65">
                        Aayesha Fashion
                      </p>

                      <p className="mt-2 text-[10px] uppercase tracking-[0.18em]">
                        The Signature Edit
                      </p>
                    </div>

                    <span className="font-display text-4xl leading-none text-white/90">
                      01
                    </span>
                  </div>
                </div>

                {/* Image caption */}

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                    Modern Indian Elegance
                  </span>

                  <span className="text-[8px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                    SS / 2026
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              BOTTOM EDITORIAL FOOTER
          ====================================================== */}

          <div className="mt-20 flex items-center justify-between border-t border-[var(--color-border)] pt-6 lg:mt-28">
            <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
              A study in timeless femininity
            </p>

            <span className="font-display text-xl text-[var(--color-charcoal)] sm:text-2xl">
              Aayesha
            </span>
          </div>
        </div>
      </Container>

      {/* =========================================================
          VERTICAL EDITORIAL DETAIL
      ========================================================== */}

      <div className="pointer-events-none absolute bottom-24 right-5 hidden origin-bottom-right rotate-[-90deg] xl:block">
        <span className="text-[8px] uppercase tracking-[0.35em] text-[var(--color-text-muted)]">
          Crafted for memorable moments
        </span>
      </div>
    </section>
  );
}