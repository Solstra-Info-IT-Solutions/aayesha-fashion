import {
  Heart,
  Gem,
  Sparkles,
  Scissors,
} from "lucide-react";

import { Container } from "@/components/shared/container";

const values = [
  {
    id: "craftsmanship",
    title: "Thoughtful Craftsmanship",
    description:
      "Every piece is selected for its detail, finish, and enduring beauty.",
    icon: Scissors,
  },
  {
    id: "quality",
    title: "Considered Quality",
    description:
      "We focus on fabrics, silhouettes, and finishes that feel beautiful from the first wear.",
    icon: Gem,
  },
  {
    id: "femininity",
    title: "Refined Femininity",
    description:
      "Graceful silhouettes designed to feel elegant, confident, and effortless.",
    icon: Heart,
  },
  {
    id: "timeless",
    title: "Made to Last",
    description:
      "Pieces created to remain relevant beyond a single season or occasion.",
    icon: Sparkles,
  },
] as const;

export function WhyChooseUs() {
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
                  Why Ayesha
                </p>
              </div>

              <span className="font-display text-lg text-[var(--color-text-muted)] sm:text-xl">
                10
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
                Made with{" "}
                <span className="italic text-[var(--color-rose-dark)]">
                  intention.
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-[560px] text-sm leading-7 text-[var(--color-text-secondary)] sm:text-[15px] sm:leading-8">
                From the first detail to the final finish,
                everything is chosen to make getting dressed
                feel effortlessly beautiful.
              </p>
            </div>
          </div>

          {/* =====================================================
              VALUES
          ===================================================== */}

          <div className="mt-14 grid border-y border-[var(--color-border)] sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:border-y">
            {values.map((value, index) => {
              const Icon = value.icon;

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
                      index !== values.length - 1
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
            })}
          </div>

          {/* =====================================================
              CLOSING STATEMENT
          ===================================================== */}

          <div className="mt-10 text-center sm:mt-12">
            <p className="font-display text-[1.5rem] italic leading-none tracking-[-0.02em] text-[var(--color-charcoal)] sm:text-[1.8rem]">
              Elegance, thoughtfully considered.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}