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

  useEffect(() => {
    if (
      total > 0 &&
      activeIndex >= total
    ) {
      setActiveIndex(0);
    }
  }, [activeIndex, total]);

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
        <div className="py-7 sm:py-9 lg:py-11">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-[var(--color-rose-dark)]" />

              <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[var(--color-text-secondary)] sm:text-[9px]">
                Client Stories
              </p>
            </div>

            <span className="font-display text-sm text-[var(--color-text-muted)] sm:text-base">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>
          </div>

          {/* Testimonial */}
          <div className="mx-auto mt-8 max-w-5xl text-center sm:mt-10 lg:mt-12">
            <Quote
              size={24}
              strokeWidth={1}
              className="mx-auto text-[var(--color-rose-dark)]"
            />

            <blockquote
              key={testimonial.id}
              className="
                mt-5
                font-display
                text-[2rem]
                font-medium
                leading-[1.06]
                tracking-[-0.03em]
                text-[var(--color-charcoal)]
                sm:mt-6
                sm:text-[2.7rem]
                md:text-[3.2rem]
                lg:text-[3.8rem]
                xl:text-[4.2rem]
              "
            >
              “{testimonial.quote}”
            </blockquote>

            {/* Customer */}
            <div className="mt-6 sm:mt-8">
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--color-charcoal)]">
                {testimonial.name}
              </p>

              <p className="mt-1.5 text-[8px] uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
                {testimonial.location}
              </p>
            </div>
          </div>

          {/* Controls */}
          {total > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2.5 sm:mt-10">
              <button
                type="button"
                onClick={previous}
                aria-label="Previous testimonial"
                className="
                  flex
                  h-9
                  w-9
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
                  size={14}
                  strokeWidth={1.3}
                />
              </button>

              <div className="flex items-center gap-1.5 px-1">
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
                        setActiveIndex(index)
                      }
                      className="flex h-5 items-center"
                    >
                      <span
                        className={[
                          "h-px transition-all duration-500",
                          index === activeIndex
                            ? "w-7 bg-[var(--color-charcoal)]"
                            : "w-3.5 bg-[var(--color-border-dark)]",
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
                  h-9
                  w-9
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
                  size={14}
                  strokeWidth={1.3}
                />
              </button>
            </div>
          )}

          {/* Closing line */}
          <div className="mt-7 text-center sm:mt-9">
            <p className="text-[8px] font-semibold uppercase tracking-[0.26em] text-[var(--color-text-muted)]">
              Loved by women, worn with confidence
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}