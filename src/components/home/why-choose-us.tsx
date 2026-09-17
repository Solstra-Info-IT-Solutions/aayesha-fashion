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
  icon: HomepageWhyChooseUsValue["icon"],
) {
  return iconMap[icon];
}

export function WhyChooseUs({
  data,
}: WhyChooseUsProps) {
  const values = data.values
    .filter((value) => value.isActive)
    .sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );

  return (
    <section
      id="why-ayesha"
      className="bg-[var(--color-ivory)]"
    >
      <Container>
        <div className="py-6 sm:py-8 lg:py-10">

          {/* Header */}
          <div className="text-center">
            <h2
              className="
                font-display
                text-[2.7rem]
                font-medium
                leading-[0.95]
                tracking-[-0.04em]
                text-[var(--color-charcoal)]
                sm:text-[3.5rem]
                md:text-[4.2rem]
                lg:text-[4.8rem]
                xl:text-[5.2rem]
              "
            >
              {data.title}
            </h2>

            <p className="mx-auto mt-3 max-w-[520px] text-[13px] leading-6 text-[var(--color-text-secondary)] sm:mt-4 sm:text-sm sm:leading-7">
              {data.description}
            </p>
          </div>

          {/* Values */}
          {values.length > 0 && (
            <div className="mt-7 grid gap-7 sm:mt-9 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-6">

              {values.map((value) => {
                const Icon = getIcon(value.icon);

                return (
                  <div
                    key={value.id}
                    className="flex flex-col items-center px-4 text-center"
                  >
                    {/* Icon */}
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-rose-dark)]">
                      <Icon
                        size={16}
                        strokeWidth={1.2}
                      />
                    </span>

                    {/* Title */}
                    <h3
                      className="
                        mt-4
                        font-display
                        text-[1.3rem]
                        font-medium
                        leading-none
                        tracking-[-0.02em]
                        text-[var(--color-charcoal)]
                        sm:text-[1.45rem]
                      "
                    >
                      {value.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2.5 max-w-[230px] text-[11px] leading-5 text-[var(--color-text-secondary)] sm:text-[12px] sm:leading-6">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Closing Statement */}
          {data.closingStatement && (
            <div className="mt-7 text-center sm:mt-9">
              <p className="font-display text-[1.25rem] italic leading-[1.1] tracking-[-0.02em] text-[var(--color-charcoal)] sm:text-[1.6rem]">
                {data.closingStatement}
              </p>
            </div>
          )}

        </div>
      </Container>
    </section>
  );
}