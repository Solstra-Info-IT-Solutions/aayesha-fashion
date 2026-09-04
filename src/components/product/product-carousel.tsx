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
  (window.innerWidth >= 1024 ? 0.92 : 0.82);

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
          PRODUCTS
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
          gap-5
          overflow-x-auto
          overscroll-x-contain
          scroll-smooth
          pb-5
          outline-none
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
          sm:gap-7
          lg:gap-8
          xl:gap-10
        "
      >
        {products.map((product, index) => (
          <div
            key={product.id}
            className="
              w-[78vw]
              max-w-[330px]
              shrink-0
              snap-start
              sm:w-[44vw]
              sm:max-w-[370px]
              lg:w-[30vw]
              lg:max-w-[410px]
            "
          >
            <ProductCard
              product={product}
              priority={index === 0}
            />
          </div>
        ))}

        {/* ================================================
            DESKTOP END SPACER
        ================================================= */}

        <div
          aria-hidden="true"
          className="hidden w-[1px] shrink-0 lg:block"
        />
      </div>

      {/* =====================================================
          CONTROLS
      ===================================================== */}

      {products.length > 1 && (
        <div className="mt-7 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => scroll("prev")}
            aria-label="Previous products"
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              border
              border-[var(--color-border)]
              bg-transparent
              text-[var(--color-charcoal)]
              transition-all
              duration-300
              hover:border-[var(--color-charcoal)]
              hover:bg-[var(--color-charcoal)]
              hover:text-white
            "
          >
            <ArrowLeft
              size={16}
              strokeWidth={1.4}
            />
          </button>

          <button
            type="button"
            onClick={() => scroll("next")}
            aria-label="Next products"
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              border
              border-[var(--color-border)]
              bg-transparent
              text-[var(--color-charcoal)]
              transition-all
              duration-300
              hover:border-[var(--color-charcoal)]
              hover:bg-[var(--color-charcoal)]
              hover:text-white
            "
          >
            <ArrowRight
              size={16}
              strokeWidth={1.4}
            />
          </button>
        </div>
      )}
    </div>
  );
}