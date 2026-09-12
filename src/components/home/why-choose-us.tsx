import {
  Heart,
  Gem,
  Sparkles,
  Scissors,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import type {
  HomepageWhyChooseUs,
  HomepageWhyChooseUsValue,
} from "@/types/homepage";

interface WhyChooseUsProps {
  data: HomepageWhyChooseUs;
}

const iconMap = {
  scissors: Scissors,
  gem: Gem,
  heart: Heart,
  sparkles: Sparkles,
} as const;

function getIcon(
  icon: HomepageWhyChooseUsValue["icon"]
) {
  return iconMap[icon];
}

export function WhyChooseUs({
  data,
}: WhyChooseUsProps) {
  const values = data.values
    .filter((value) => value.isActive)
    .sort(
      (a, b) => a.sortOrder - b.sortOrder
    );

  return (
    <section
      id="why-ayesha"
      className="bg-[var(--color-ivory)]"
    >
      <Container>
        <div className="py-16 sm:py-20 lg:py-24 xl:py-28">
          {/* =====================================================
              HEADER
          ===================================================== */}

          <div className="border-t border-[var(--color-border)] pt-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="h-px w-9 bg-[var(--color-rose-dark)]" />

                <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[var(--color-text-secondary)] sm:text-[9px]">
                  {data.eyebrow}
                </p>
              </div>

              <span className="font-display text-lg text-[var(--color-text-muted)] sm:text-xl">
                {data.number}
              </span>
            </div>

            <div className="mt-9 text-center sm:mt-11">
              <h2
                className="
                  font-display
                  text-[3.1rem]
                  font-medium
                  leading-[0.9]
                  tracking-[-0.045em]
                  text-[var(--color-charcoal)]
                  sm:text-[4rem]
                  md:text-[4.7rem]
                  lg:text-[5.3rem]
                  xl:text-[5.8rem]
                "
              >
                {data.title}
              </h2>

              <p className="mx-auto mt-5 max-w-[560px] text-sm leading-7 text-[var(--color-text-secondary)] sm:text-[15px] sm:leading-8">
                {data.description}
              </p>
            </div>
          </div>

          {/* =====================================================
              VALUES
          ===================================================== */}

          {values.length > 0 && (
            <div className="mt-14 grid border-y border-[var(--color-border)] sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:border-y">
              {values.map(
                (value, index) => {
                  const Icon = getIcon(
                    value.icon
                  );

                  return (
                    <div
                      key={value.id}
                      className={`
                        flex
                        flex-col
                        items-center
                        px-6
                        py-9
                        text-center
                        sm:px-8
                        sm:py-10
                        lg:px-7
                        lg:py-12
                        xl:px-9
                        ${
                          index !==
                          values.length - 1
                            ? "border-b border-[var(--color-border)] sm:odd:border-r lg:border-b-0 lg:border-r"
                            : ""
                        }
                        ${
                          index === 2
                            ? "sm:border-b-0"
                            : ""
                        }
                      `}
                    >
                      {/* ICON */}

                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-rose-dark)]">
                        <Icon
                          size={17}
                          strokeWidth={1.2}
                        />
                      </span>

                      {/* TITLE */}

                      <h3
                        className="
                          mt-5
                          font-display
                          text-[1.45rem]
                          font-medium
                          leading-none
                          tracking-[-0.02em]
                          text-[var(--color-charcoal)]
                          sm:text-[1.6rem]
                        "
                      >
                        {value.title}
                      </h3>

                      {/* DESCRIPTION */}

                      <p className="mt-4 max-w-[250px] text-[12px] leading-6 text-[var(--color-text-secondary)]">
                        {value.description}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          )}

          {/* =====================================================
              CLOSING STATEMENT
          ===================================================== */}

          {data.closingStatement && (
            <div className="mt-10 text-center sm:mt-12">
              <p className="font-display text-[1.5rem] italic leading-none tracking-[-0.02em] text-[var(--color-charcoal)] sm:text-[1.8rem]">
                {data.closingStatement}
              </p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}