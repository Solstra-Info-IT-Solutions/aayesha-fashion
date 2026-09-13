"use client";

import { useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import type { Product } from "@/types/product";
import { ProductCard } from "@/components/product/product-card";

type ProductCarouselProps = {
  products: Product[];
  ariaLabel?: string;
};

export function ProductCarousel({
  products,
  ariaLabel = "Product carousel",
}: ProductCarouselProps) {
  const scrollRef =
    useRef<HTMLDivElement>(null);

  function scroll(direction: "prev" | "next") {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const amount =
      container.clientWidth *
      (window.innerWidth >= 1280
        ? 0.76
        : window.innerWidth >= 1024
          ? 0.82
          : 0.82);

    container.scrollBy({
      left:
        direction === "next"
          ? amount
          : -amount,
      behavior: "smooth",
    });
  }

  if (!products.length) {
    return null;
  }

  return (
    <div className="relative">
      {/* =====================================================
          PRODUCT TRACK
      ===================================================== */}

      <div
        ref={scrollRef}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
        className="
          flex
          snap-x
          snap-mandatory
          gap-4
          overflow-x-auto
          overscroll-x-contain
          scroll-smooth
          pb-3
          outline-none
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
          sm:gap-5
          lg:gap-6
          xl:gap-7
        "
      >
        {products.map((product, index) => (
          <article
            key={product.id}
            className="
              w-[78vw]
              max-w-[320px]
              shrink-0
              snap-start
              sm:w-[43vw]
              sm:max-w-[350px]
              md:w-[35vw]
              md:max-w-[370px]
              lg:w-[29vw]
              lg:max-w-[390px]
              xl:w-[27vw]
              xl:max-w-[410px]
            "
          >
            <ProductCard
              product={product}
              priority={index === 0}
            />
          </article>
        ))}

        {/* ===================================================
            END SPACER
        =================================================== */}

        <div
          aria-hidden="true"
          className="
            w-1
            shrink-0
            lg:w-4
          "
        />
      </div>

      {/* =====================================================
          CONTROLS
      ===================================================== */}

      {products.length > 1 && (
        <div
          className="
            mt-7
            flex
            items-center
            justify-between
            border-t
            border-[var(--color-border)]
            pt-5
            sm:mt-8
            sm:pt-6
          "
        >
          {/* Scroll hint */}

          <p
            className="
              hidden
              font-body
              text-[9px]
              font-medium
              uppercase
              tracking-[0.2em]
              text-[var(--color-text-muted)]
              sm:block
            "
          >
            Swipe to explore
          </p>

          {/* Arrow controls */}

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("prev")}
              aria-label="Previous products"
              className="
                group
                flex
                h-10
                w-10
                items-center
                justify-center
                border
                border-[var(--color-border)]
                bg-transparent
                text-[var(--color-text)]
                transition-all
                duration-[var(--duration-base)]
                hover:border-[var(--color-text)]
                hover:bg-[var(--color-text)]
                hover:text-[var(--color-text-inverse)]
                sm:h-11
                sm:w-11
              "
            >
              <ArrowLeft
                size={15}
                strokeWidth={1.2}
                className="
                  transition-transform
                  duration-[var(--duration-base)]
                  group-hover:-translate-x-0.5
                "
              />
            </button>

            <button
              type="button"
              onClick={() => scroll("next")}
              aria-label="Next products"
              className="
                group
                flex
                h-10
                w-10
                items-center
                justify-center
                border
                border-[var(--color-border)]
                bg-transparent
                text-[var(--color-text)]
                transition-all
                duration-[var(--duration-base)]
                hover:border-[var(--color-text)]
                hover:bg-[var(--color-text)]
                hover:text-[var(--color-text-inverse)]
                sm:h-11
                sm:w-11
              "
            >
              <ArrowRight
                size={15}
                strokeWidth={1.2}
                className="
                  transition-transform
                  duration-[var(--duration-base)]
                  group-hover:translate-x-0.5
                "
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}