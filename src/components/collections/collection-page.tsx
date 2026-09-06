"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

import type {
  Product,
  ProductCategory,
  ProductSort,
} from "@/types/product";

import { ShopFilters } from "@/components/shop/shop-filters";
import { ShopProductGrid } from "@/components/shop/shop-product-grid";

/* =========================================================
   TYPES
========================================================= */

type CollectionPageProps = {
  title: string;
  eyebrow: string;
  description: string;
  category: ProductCategory;
  products: Product[];
  sort: ProductSort;
  mood?: string;
};

/* =========================================================
   COLLECTION CONFIG
========================================================= */

const collectionLinks = [
  {
    label: "Festive",
    href: "/collections/festive",
    category: "festive",
  },
  {
    label: "Ethnic",
    href: "/collections/ethnic",
    category: "ethnic",
  },
  {
    label: "Contemporary",
    href: "/collections/contemporary",
    category: "contemporary",
  },
] as const;

/* =========================================================
   COMPONENT
========================================================= */

export function CollectionPage({
  title,
  eyebrow,
  description,
  category,
  products,
  sort,
  mood = "Considered silhouettes. Effortless presence.",
}: CollectionPageProps) {
  return (
    <main className="min-h-screen bg-[var(--color-ivory)]">
      {/* =====================================================
          EDITORIAL HERO
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-ivory)]">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="relative py-12 sm:py-16 lg:py-20">
            {/* subtle editorial accent */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                right-0
                top-8
                h-32
                w-32
                rounded-full
                border
                border-[var(--color-rose)]/35
                sm:h-44
                sm:w-44
                lg:h-56
                lg:w-56
              "
            />

            <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="max-w-4xl">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-[var(--color-rose-dark)]" />

                  <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--color-rose-dark)]">
                    {eyebrow}
                  </p>
                </div>

                <h1
                  className="
                    mt-5
                    max-w-4xl
                    font-[var(--font-display)]
                    text-[3.2rem]
                    font-medium
                    leading-[0.9]
                    tracking-[-0.035em]
                    text-[var(--color-charcoal)]
                    sm:text-[4.4rem]
                    lg:text-[5.4rem]
                    xl:text-[6rem]
                  "
                >
                  {title}
                </h1>

                <p
                  className="
                    mt-7
                    max-w-2xl
                    text-sm
                    leading-7
                    text-[var(--color-text-secondary)]
                    sm:text-[15px]
                    sm:leading-8
                  "
                >
                  {description}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
                  <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--color-charcoal)]">
                    <Sparkles
                      size={13}
                      strokeWidth={1.3}
                    />

                    Curated for modern Indian dressing
                  </div>

                  <span className="hidden h-3 w-px bg-[var(--color-border)] sm:block" />

                  <p className="text-[10px] italic text-[var(--color-secondary)]">
                    {mood}
                  </p>
                </div>
              </div>

              {/* COLLECTION INDEX */}

              <div className="border-t border-[var(--color-border)] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-[var(--color-muted)]">
                  Browse the edits
                </p>

                <div className="mt-5 space-y-1">
                  {collectionLinks.map(
                    (item) => {
                      const isActive =
                        item.category === category;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`
                            group
                            flex
                            items-center
                            justify-between
                            border-b
                            border-[var(--color-border)]
                            py-3
                            text-sm
                            transition-colors
                            duration-300
                            ${
                              isActive
                                ? "text-[var(--color-charcoal)]"
                                : "text-[var(--color-secondary)] hover:text-[var(--color-charcoal)]"
                            }
                          `}
                        >
                          <span
                            className={
                              isActive
                                ? "font-semibold"
                                : "font-medium"
                            }
                          >
                            {item.label}
                          </span>

                          <ArrowUpRight
                            size={14}
                            strokeWidth={1.35}
                            className={`
                              transition-transform
                              duration-300
                              ${
                                isActive
                                  ? "text-[var(--color-rose-dark)]"
                                  : "text-[var(--color-muted)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                              }
                            `}
                          />
                        </Link>
                      );
                    },
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          COLLECTION TOOLBAR
      ===================================================== */}

      <section className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Collection
              </span>

              <span className="h-3 w-px bg-[var(--color-border)]" />

              <span className="text-[11px] font-medium text-[var(--color-charcoal)]">
                {products.length}{" "}
                {products.length === 1
                  ? "piece"
                  : "pieces"}
              </span>
            </div>

            <Link
              href="/shop"
              className="
                group
                inline-flex
                items-center
                gap-2
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-[var(--color-charcoal)]
              "
            >
              Shop all

              <ArrowRight
                size={14}
                strokeWidth={1.35}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          PRODUCT AREA
      ===================================================== */}

      <section className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[235px_minmax(0,1fr)] xl:gap-10">
          {/* =================================================
              FILTERS
          ================================================= */}

          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <ShopFilters
                products={products}
                selectedCategory={category}
              />
            </div>
          </aside>

          {/* =================================================
              PRODUCT GRID
          ================================================= */}

          <div className="min-w-0">
            <ShopProductGrid
              products={products}
              category={category}
              sort={sort}
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          EDIT NAVIGATION
      ===================================================== */}

      <section className="border-t border-[var(--color-border)] bg-[var(--color-cream)]">
        <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[var(--color-rose-dark)]">
                Continue exploring
              </p>

              <h2 className="mt-3 max-w-xl font-[var(--font-display)] text-3xl leading-tight tracking-[-0.02em] text-[var(--color-charcoal)] sm:text-4xl">
                Find the pieces that become part of your story.
              </h2>
            </div>

            <Link
              href="/collections/new-arrivals"
              className="
                group
                inline-flex
                items-center
                gap-3
                border
                border-[var(--color-charcoal)]
                bg-[var(--color-charcoal)]
                px-5
                py-3.5
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-white
                transition-opacity
                hover:opacity-90
              "
            >
              Discover new arrivals

              <ArrowUpRight
                size={14}
                strokeWidth={1.35}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}