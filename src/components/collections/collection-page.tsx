"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

import type {
  Product,
  ProductSort,
} from "@/types/product";

import type { Category } from "@/types/category";

import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { ShopFilters } from "@/components/shop/shop-filters";
import { ShopProductGrid } from "@/components/shop/shop-product-grid";

/* =========================================================
   TYPES
========================================================= */

type CollectionPageProps = {
  title: string;
  eyebrow: string;
  description: string;
  categoryId?: string;
  products: Product[];
  sort: ProductSort;
  mood?: string;
  categories: Category[];
};

/* =========================================================
   COMPONENT
========================================================= */

export function CollectionPage({
  title,
  eyebrow,
  description,
  categoryId,
  products,
  sort,
  mood = "Considered silhouettes. Effortless presence.",
  categories,
}: CollectionPageProps) {
  const activeCategorySlug =
    categories.find(
      (category) => category.id === categoryId
    )?.slug ??
    title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

  return (
    <>
      {/* =====================================================
          BREADCRUMB JSON-LD
      ===================================================== */}

      <BreadcrumbJsonLd
        items={[
          {
            name: "Home",
            url: "/",
          },
          {
            name: "Collections",
            url: "/collections",
          },
          {
            name: title,
            url: `/collections/${activeCategorySlug}`,
          },
        ]}
      />

      <main className="min-h-screen bg-[var(--color-bg)]">
        {/* =====================================================
            COLLECTION HERO
        ===================================================== */}

        <section className="bg-[var(--color-bg)]">
          <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
            <div className="py-8 sm:py-10 lg:py-12">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end xl:grid-cols-[minmax(0,1fr)_320px]">
                {/* HERO COPY */}

                <div className="max-w-3xl">
                  <div className="flex items-center gap-3">
                    <span className="h-px w-7 bg-[var(--color-accent)]" />

                    <span className="eyebrow">
                      {eyebrow}
                    </span>
                  </div>

                  <h1
                    className="
                      mt-4
                      font-display
                      text-[2.8rem]
                      font-medium
                      leading-[0.92]
                      tracking-[-0.04em]
                      text-[var(--color-text)]
                      sm:text-[3.6rem]
                      md:text-[4.2rem]
                      lg:text-[4.7rem]
                    "
                  >
                    {title}
                  </h1>

                  <p
                    className="
                      mt-5
                      max-w-2xl
                      font-body
                      text-[13px]
                      leading-6
                      text-[var(--color-text-secondary)]
                      sm:text-sm
                      sm:leading-7
                    "
                  >
                    {description}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                    <div
                      className="
                        inline-flex
                        items-center
                        gap-2
                        font-body
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-[var(--color-text)]
                      "
                    >
                      <Sparkles
                        size={13}
                        strokeWidth={1.25}
                        className="text-[var(--color-accent)]"
                      />

                      Curated for modern Indian dressing
                    </div>

                    <p
                      className="
                        font-display
                        text-xs
                        italic
                        text-[var(--color-text-secondary)]
                      "
                    >
                      {mood}
                    </p>
                  </div>
                </div>

                {/* CATEGORY NAVIGATION */}

                {categories.length > 0 && (
                  <div className="lg:pl-6">
                    <div className="mb-3">
                      <p className="font-body text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                        Browse categories
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      {categories.map((category) => {
                        const isActive =
                          category.id === categoryId;

                        return (
                          <Link
                            key={category.id}
                            href={`/collections/${category.slug}`}
                            aria-current={
                              isActive
                                ? "page"
                                : undefined
                            }
                            className="
                              group
                              flex
                              items-center
                              justify-between
                              py-2
                              font-body
                              text-sm
                              transition-colors
                              duration-200
                            "
                          >
                            <span
                              className={
                                isActive
                                  ? "font-semibold text-[var(--color-text)]"
                                  : "font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-text)]"
                              }
                            >
                              {category.name}
                            </span>

                            <ArrowUpRight
                              size={14}
                              strokeWidth={1.3}
                              className={
                                isActive
                                  ? "text-[var(--color-accent)]"
                                  : "text-[var(--color-text-muted)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                              }
                            />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            COLLECTION TOOLBAR
        ===================================================== */}

        <section
          className="
            sticky
            top-0
            z-[var(--z-header)]
            bg-[var(--color-bg)]/95
            backdrop-blur-md
          "
        >
          <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
            <div className="flex min-h-12 items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-body text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                  {title}
                </span>

                <span className="text-[var(--color-text-muted)]">
                  /
                </span>

                <span className="font-body text-[11px] font-medium text-[var(--color-text)]">
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
                  gap-1.5
                  font-body
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-[var(--color-text)]
                "
              >
                Shop all

                <ArrowRight
                  size={13}
                  strokeWidth={1.3}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </section>

        {/* =====================================================
            PRODUCT AREA
        ===================================================== */}

        <section className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
          <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] xl:gap-10">
            {/* FILTERS */}

            <aside className="hidden lg:block">
              <div className="sticky top-20">
                <ShopFilters
                  products={products}
                  selectedCategory={categoryId}
                />
              </div>
            </aside>

            {/* PRODUCT GRID */}

            <div className="min-w-0">
              <ShopProductGrid
                products={products}
                category={categoryId}
                sort={sort}
              />
            </div>
          </div>
        </section>

        {/* =====================================================
            CONTINUE EXPLORING
        ===================================================== */}

        <section className="bg-[var(--color-bg-soft)]">
          <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <p className="eyebrow text-[var(--color-accent)]">
                  Continue exploring
                </p>

                <h2
                  className="
                    mt-2
                    font-display
                    text-[1.7rem]
                    font-medium
                    leading-[1]
                    tracking-[-0.03em]
                    text-[var(--color-text)]
                    sm:text-[2rem]
                    lg:text-[2.3rem]
                  "
                >
                  Find pieces that become part of your story.
                </h2>
              </div>

              <Link
                href="/collections/new-arrivals"
                className="
                  group
                  inline-flex
                  min-h-10
                  w-fit
                  items-center
                  justify-center
                  gap-2
                  border
                  border-[var(--color-text)]
                  bg-[var(--color-text)]
                  px-5
                  py-2.5
                  font-body
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-[var(--color-text-inverse)]
                  transition-colors
                  duration-200
                  hover:bg-[var(--color-accent-dark)]
                  hover:border-[var(--color-accent-dark)]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--color-accent)]
                  focus:ring-offset-2
                  focus:ring-offset-[var(--color-bg-soft)]
                "
              >
                New arrivals

                <ArrowUpRight
                  size={14}
                  strokeWidth={1.3}
                  className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}