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
        <div className="py-10 sm:py-14 lg:py-16">

          {/* Main Content */}
          <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-12 lg:items-center lg:gap-12 xl:gap-16">

            {/* Content */}
            <div className="lg:col-span-6">

              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--color-rose-dark)]">
                The House of Ayesha
              </p>

              <h2
                className="
                  mt-4
                  max-w-[580px]
                  font-display
                  text-[3rem]
                  font-medium
                  leading-[0.95]
                  tracking-[-0.04em]
                  text-[var(--color-charcoal)]
                  sm:text-[3.8rem]
                  md:text-[4.5rem]
                  lg:text-[5rem]
                  xl:text-[5.5rem]
                "
              >
                {data.title}
              </h2>

              <div className="mt-7 max-w-[500px] space-y-4">
                {data.descriptions.map(
                  (description, index) => (
                    <p
                      key={`${index}-${description}`}
                      className="text-sm leading-7 text-[var(--color-text-secondary)] sm:text-[15px]"
                    >
                      {description}
                    </p>
                  ),
                )}
              </div>

              {data.ctaLabel &&
                data.ctaHref && (
                  <div className="mt-7">
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
              <div className="mx-auto w-full max-w-[600px] overflow-hidden bg-[var(--color-warm-gray)]">
                <Image
                  src={data.image}
                  alt={data.imageAlt}
                  width={1200}
                  height={1500}
                  className="h-auto w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.01]"
                  sizes="(max-width: 1023px) 100vw, 50vw"
                />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                  {data.caption}
                </p>

                <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                  {data.brandLabel}
                </p>
              </div>
            </div>
          </div>

          {/* Statement */}
          {data.statement && (
            <div className="mt-12 border-t border-[var(--color-border)] pt-5 sm:mt-14 lg:mt-16">
              <p className="max-w-3xl font-display text-[1.45rem] leading-[1.15] tracking-[-0.02em] text-[var(--color-charcoal)] sm:text-[1.8rem]">
                {data.statement}
              </p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}