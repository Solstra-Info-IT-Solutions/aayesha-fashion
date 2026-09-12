"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Quote,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import type {
  HomepageTestimonial,
  HomepageTestimonials,
} from "@/types/homepage";

const AUTOPLAY_DELAY = 5500;

interface TestimonialsProps {
  data: HomepageTestimonials;
}

export function Testimonials({
  data,
}: TestimonialsProps) {
  const testimonials: HomepageTestimonial[] =
    data.testimonials
      .filter(
        (testimonial) =>
          testimonial.isActive
      )
      .sort(
        (a, b) =>
          a.sortOrder - b.sortOrder
      );

  const [activeIndex, setActiveIndex] =
    useState(0);

  const total = testimonials.length;

  /* =========================================================
     SAFETY
  ========================================================= */

  useEffect(() => {
    if (
      total > 0 &&
      activeIndex >= total
    ) {
      setActiveIndex(0);
    }
  }, [activeIndex, total]);

  /* =========================================================
     NAVIGATION
  ========================================================= */

  function next() {
    if (total === 0) {
      return;
    }

    setActiveIndex(
      (current) =>
        (current + 1) % total
    );
  }

  function previous() {
    if (total === 0) {
      return;
    }

    setActiveIndex(
      (current) =>
        (current - 1 + total) % total
    );
  }

  /* =========================================================
     AUTOPLAY
  ========================================================= */

  useEffect(() => {
    if (total <= 1) {
      return;
    }

    const interval = window.setInterval(
      next,
      AUTOPLAY_DELAY
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [total]);

  /* =========================================================
     EMPTY STATE
  ========================================================= */

  if (total === 0) {
    return null;
  }

  const testimonial =
    testimonials[activeIndex];

  return (
    <section
      id="testimonials"
      className="bg-[var(--color-cream)]"
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
                  Client Stories
                </p>
              </div>

              <span className="font-display text-lg text-[var(--color-text-muted)] sm:text-xl">
                11
              </span>
            </div>
          </div>

          {/* =====================================================
              TESTIMONIAL
          ===================================================== */}

          <div className="mx-auto mt-12 max-w-5xl text-center sm:mt-16 lg:mt-20">
            <Quote
              size={28}
              strokeWidth={1}
              className="mx-auto text-[var(--color-rose-dark)]"
            />

            <blockquote
              key={testimonial.id}
              className="
                mt-7
                font-display
                text-[2.2rem]
                font-medium
                leading-[1.05]
                tracking-[-0.025em]
                text-[var(--color-charcoal)]
                sm:text-[3rem]
                md:text-[3.6rem]
                lg:text-[4.2rem]
                xl:text-[4.7rem]
              "
            >
              “{testimonial.quote}”
            </blockquote>

            {/* ===================================================
                CUSTOMER
            =================================================== */}

            <div className="mt-8 sm:mt-10">
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--color-charcoal)]">
                {testimonial.name}
              </p>

              <p className="mt-2 text-[8px] uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
                {testimonial.location}
              </p>
            </div>
          </div>

          {/* =====================================================
              CONTROLS
          ===================================================== */}

          {total > 1 && (
            <div className="mt-12 flex items-center justify-center gap-3 sm:mt-14">
              <button
                type="button"
                onClick={previous}
                aria-label="Previous testimonial"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  border
                  border-[var(--color-border-dark)]
                  text-[var(--color-charcoal)]
                  transition-all
                  duration-300
                  hover:bg-[var(--color-charcoal)]
                  hover:text-white
                "
              >
                <ArrowLeft
                  size={15}
                  strokeWidth={1.3}
                />
              </button>

              <div className="flex items-center gap-2 px-2">
                {testimonials.map(
                  (item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-label={`Go to testimonial ${
                        index + 1
                      }`}
                      aria-current={
                        index === activeIndex
                      }
                      onClick={() =>
                        setActiveIndex(
                          index
                        )
                      }
                      className="flex h-6 items-center"
                    >
                      <span
                        className={[
                          "h-px transition-all duration-500",
                          index ===
                          activeIndex
                            ? "w-8 bg-[var(--color-charcoal)]"
                            : "w-4 bg-[var(--color-border-dark)]",
                        ].join(" ")}
                      />
                    </button>
                  )
                )}
              </div>

              <button
                type="button"
                onClick={next}
                aria-label="Next testimonial"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  border
                  border-[var(--color-border-dark)]
                  text-[var(--color-charcoal)]
                  transition-all
                  duration-300
                  hover:bg-[var(--color-charcoal)]
                  hover:text-white
                "
              >
                <ArrowRight
                  size={15}
                  strokeWidth={1.3}
                />
              </button>
            </div>
          )}

          {/* =====================================================
              CLOSING LINE
          ===================================================== */}

          <div className="mt-12 border-t border-[var(--color-border)] pt-6 text-center sm:mt-14">
            <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
              Loved by women, worn with confidence
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}