"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

import { ProductCard } from "@/components/product/product-card";

interface CategoryBrowserProps {
  categories: Category[];
  selectedCategoryId?: string;
  products: Product[];
}

export function CategoryBrowser({
  categories,
  selectedCategoryId,
  products,
}: CategoryBrowserProps) {
  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId,
  );

  if (categories.length === 0) {
    return (
      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="eyebrow text-[var(--color-text-muted)]">
            Aayesha Fashion
          </p>

          <h1 className="mt-2 font-display text-2xl text-[var(--color-text)]">
            Categories
          </h1>

          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Categories are currently unavailable.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="bg-[var(--color-bg)]">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="py-7 sm:py-9 lg:py-10">
            <div className="flex items-center gap-2.5">
              <span className="h-px w-6 bg-[var(--color-accent)]" />

              <span className="eyebrow text-[var(--color-accent)]">
                Aayesha Fashion
              </span>
            </div>

            <div className="mt-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <h1
                className="
                  font-display
                  text-[2rem]
                  font-medium
                  leading-none
                  tracking-[-0.03em]
                  text-[var(--color-text)]
                  sm:text-[2.4rem]
                  lg:text-[2.7rem]
                "
              >
                Categories
              </h1>

              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-[var(--color-text-muted)]
                "
              >
                {categories.length} categories
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CATEGORY NAVIGATION
      ===================================================== */}

      <section className="bg-[var(--color-bg-soft)]">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div
            className="
              -mx-4
              flex
              overflow-x-auto
              px-4
              scrollbar-none
              sm:-mx-6
              sm:px-6
              lg:mx-0
              lg:px-0
            "
          >
            {categories.map((category) => {
              const isSelected =
                category.id === selectedCategoryId;

              return (
                <Link
                  key={category.id}
                  href={`/categories?category=${encodeURIComponent(
                    category.id,
                  )}`}
                  scroll={false}
                  className={`
                    relative
                    shrink-0
                    px-4
                    py-4
                    font-body
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    transition-colors
                    duration-200
                    first:pl-0
                    sm:px-5
                    sm:first:pl-0
                    ${
                      isSelected
                        ? "text-[var(--color-text)]"
                        : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    }
                  `}
                >
                  {category.name}

                  {isSelected && (
                    <span className="absolute bottom-0 left-4 right-4 h-px bg-[var(--color-accent)] sm:left-5 sm:right-5" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          SELECTED CATEGORY
      ===================================================== */}

      <section className="bg-[var(--color-bg)]">
        <div className="mx-auto max-w-[1400px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
          {/* Category heading */}
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-[var(--color-accent)]">
                Selected category
              </p>

              <h2
                className="
                  mt-1.5
                  font-display
                  text-[1.8rem]
                  font-medium
                  leading-none
                  tracking-[-0.025em]
                  text-[var(--color-text)]
                  sm:text-[2.1rem]
                "
              >
                {selectedCategory?.name}
              </h2>
            </div>

            {products.length > 0 && (
              <span
                className="
                  shrink-0
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-[var(--color-text-muted)]
                "
              >
                {products.length} products
              </span>
            )}
          </div>

          {/* =================================================
              PRODUCTS
          ================================================= */}

          {products.length > 0 ? (
            <div
              className="
                mt-6
                grid
                grid-cols-2
                gap-x-3
                gap-y-7
                sm:gap-x-4
                sm:gap-y-8
                lg:grid-cols-3
                lg:gap-x-5
                lg:gap-y-10
              "
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="mt-7 bg-[var(--color-bg-soft)] px-5 py-12 text-center">
              <p className="eyebrow text-[var(--color-text-muted)]">
                Coming soon
              </p>

              <h3 className="mt-2 font-display text-xl text-[var(--color-text)]">
                No products available
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[var(--color-text-secondary)]">
                New pieces for this category will be added soon.
              </p>

              <Link
                href="/shop"
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-1.5
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-[var(--color-text)]
                "
              >
                Shop all products

                <ArrowUpRight
                  size={13}
                  strokeWidth={1.3}
                />
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}