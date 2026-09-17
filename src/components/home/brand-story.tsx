import Image from "next/image";

import { Container } from "@/components/shared/container";
import { LinkButton } from "@/components/ui/button";
import type { HomepageBrandStory } from "@/types/homepage";

interface BrandStoryProps {
  data: HomepageBrandStory;
}

export function BrandStory({
  data,
}: BrandStoryProps) {
  return (
    <section
      id="brand-story"
      className="bg-[var(--color-ivory)]"
    >
      <Container>
        <div className="py-6 sm:py-8 lg:py-10">

          {/* Main Content */}
          <div className="grid gap-7 sm:gap-9 lg:grid-cols-12 lg:items-center lg:gap-12 xl:gap-16">

            {/* Content */}
            <div className="lg:col-span-6">

              <p className="text-[8px] font-semibold uppercase tracking-[0.24em] text-[var(--color-rose-dark)] sm:text-[9px]">
                The House of Ayesha
              </p>

              <h2
                className="
                  mt-3
                  max-w-[560px]
                  font-display
                  text-[2.7rem]
                  font-medium
                  leading-[0.94]
                  tracking-[-0.04em]
                  text-[var(--color-charcoal)]
                  sm:mt-4
                  sm:text-[3.6rem]
                  md:text-[4.2rem]
                  lg:text-[4.7rem]
                  xl:text-[5.2rem]
                "
              >
                {data.title}
              </h2>

              <div className="mt-5 max-w-[500px] space-y-3 sm:mt-6 sm:space-y-4">
                {data.descriptions.map(
                  (description, index) => (
                    <p
                      key={`${index}-${description}`}
                      className="text-[13px] leading-6 text-[var(--color-text-secondary)] sm:text-sm sm:leading-7"
                    >
                      {description}
                    </p>
                  ),
                )}
              </div>

              {data.ctaLabel &&
                data.ctaHref && (
                  <div className="mt-5 sm:mt-6">
                    <LinkButton
                      href={data.ctaHref}
                      variant="secondary"
                      size="md"
                      icon={
                        <span aria-hidden="true">
                          ↗
                        </span>
                      }
                    >
                      {data.ctaLabel}
                    </LinkButton>
                  </div>
                )}
            </div>

            {/* Image */}
            <div className="lg:col-span-6">
              <div className="mx-auto w-full max-w-[560px] overflow-hidden bg-[var(--color-warm-gray)]">
                <Image
                  src={data.image}
                  alt={data.imageAlt}
                  width={1200}
                  height={1500}
                  className="
                    h-auto
                    w-full
                    object-cover
                    transition-transform
                    duration-700
                    ease-out
                    hover:scale-[1.01]
                  "
                  sizes="(max-width: 1023px) 100vw, 50vw"
                />
              </div>

              <div className="mt-2.5 flex items-center justify-between gap-4">
                <p className="truncate text-[7px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)] sm:text-[8px]">
                  {data.caption}
                </p>

                <p className="shrink-0 text-[7px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)] sm:text-[8px]">
                  {data.brandLabel}
                </p>
              </div>
            </div>
          </div>

          {/* Statement */}
          {data.statement && (
            <div className="mt-8 border-t border-[var(--color-border)] pt-4 sm:mt-10 sm:pt-5 lg:mt-12">
              <p className="max-w-3xl font-display text-[1.25rem] leading-[1.15] tracking-[-0.02em] text-[var(--color-charcoal)] sm:text-[1.6rem] lg:text-[1.8rem]">
                {data.statement}
              </p>
            </div>
          )}

        </div>
      </Container>
    </section>
  );
}