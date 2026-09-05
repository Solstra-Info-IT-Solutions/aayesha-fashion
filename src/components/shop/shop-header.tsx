"use client";

import { useState } from "react";
import {
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";

import type {
  Product,
  ProductCategory,
  ProductSort,
} from "@/types/product";

import { ShopFilters } from "@/components/shop/shop-filters";

interface ShopHeaderProps {
  products?: Product[];
  selectedCategory?: ProductCategory;
  selectedSort?: ProductSort;
}

const sortOptions: {
  value: ProductSort;
  label: string;
}[] = [
  {
    value: "relevance",
    label: "Relevance",
  },
  {
    value: "newest",
    label: "Newest",
  },
  {
    value: "featured",
    label: "Featured",
  },
  {
    value: "best-selling",
    label: "Best Selling",
  },
  {
    value: "price-low",
    label: "Price: Low to High",
  },
  {
    value: "price-high",
    label: "Price: High to Low",
  },
  {
    value: "rating",
    label: "Top Rated",
  },
];

export function ShopHeader({
  products = [],
  selectedCategory,
  selectedSort = "relevance",
}: ShopHeaderProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const activeSort =
    sortOptions.find(
      (item) => item.value === selectedSort,
    ) ?? sortOptions[0];

  return (
    <>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-cream)]">
        <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-14 xl:px-16">
          <div className="max-w-3xl">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
              Aayesha Fashion
            </p>

            <h1 className="font-serif text-4xl leading-none tracking-[-0.025em] text-[var(--color-charcoal)] sm:text-5xl lg:text-6xl">
              The Collection
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--color-text-secondary)] sm:text-[15px]">
              Discover thoughtfully designed silhouettes,
              refined fabrics and timeless Indian fashion
              created for every occasion.
            </p>
          </div>
        </div>
      </section>

      <div className="sticky top-[74px] z-30 border-b border-[var(--color-border)] bg-[var(--color-ivory)] sm:top-[78px] md:top-[82px]">
        <div className="mx-auto flex min-h-[58px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10 xl:px-16">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-charcoal)] lg:hidden"
          >
            <SlidersHorizontal size={17} strokeWidth={1.7} />
            Filters
          </button>

          <div className="hidden text-sm text-[var(--color-text-secondary)] lg:block">
            Explore the collection
          </div>

          <button
            type="button"
            className="group ml-auto inline-flex items-center gap-2 text-sm font-medium text-[var(--color-charcoal)]"
          >
            {activeSort.label}
            <ChevronDown
              size={16}
              strokeWidth={1.7}
              className="transition-transform group-hover:translate-y-0.5"
            />
          </button>
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-black/30"
          />

          <div className="absolute right-0 top-0 h-full w-[88%] max-w-[420px] overflow-y-auto bg-[var(--color-ivory)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                  Refine
                </p>

                <h2 className="mt-1 font-serif text-2xl text-[var(--color-charcoal)]">
                  Filters
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="text-sm text-[var(--color-text-secondary)]"
              >
                Close
              </button>
            </div>

            <div className="p-5">
              <ShopFilters
                products={products}
                selectedCategory={selectedCategory}
                mobile
                onClose={() =>
                  setMobileFiltersOpen(false)
                }
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}