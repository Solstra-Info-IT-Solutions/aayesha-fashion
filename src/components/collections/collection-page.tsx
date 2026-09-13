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
   COLLECTION PATHS
========================================================= */

const collectionPathMap: Record<ProductCategory, string> = {
  festive: "/collections/festive",
  ethnic: "/collections/ethnic",
  contemporary: "/collections/contemporary",
  "new-arrival": "/collections/new-arrivals",
};

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
  const collectionPath =
    collectionPathMap[category] ??
    `/collections/${category}`;

  return (
    <>
      {/* =====================================================
          COLLECTION BREADCRUMB JSON-LD
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
            url: collectionPath,
          },
        ]}
      />

      <main className="min-h-screen bg-[var(--color-bg)]">
        {/* =====================================================
            EDITORIAL HERO
        ===================================================== */}

        <section className="border-b border-[var(--color-border-light)] bg-[var(--color-bg)]">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
            <div className="py-14 sm:py-18 lg:py-24 xl:py-28">
              <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end xl:grid-cols-[minmax(0,1fr)_360px]">
                {/* =================================================
                    HERO COPY
                ================================================= */}

                <div className="max-w-4xl">
                  <div className="eyebrow flex items-center gap-3">
                    <span className="h-px w-8 bg-[var(--color-accent)]" />

                    <span>{eyebrow}</span>
                  </div>

                  <h1
                    className="
                      mt-6
                      font-display
                      text-[clamp(3.5rem,8vw,7rem)]
                      font-medium
                      leading-[0.86]
                      tracking-[var(--tracking-tight)]
                      text-[var(--color-text)]
                    "
                  >
                    {title}
                  </h1>

                  <p
                    className="
                      mt-8
                      max-w-2xl
                      font-body
                      text-[var(--text-body)]
                      leading-7
                      text-[var(--color-text-secondary)]
                      sm:text-[1.0625rem]
                      sm:leading-8
                    "
                  >
                    {description}
                  </p>

                  <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                    <div
                      className="
                        inline-flex
                        items-center
                        gap-2.5
                        font-body
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[var(--tracking-wider)]
                        text-[var(--color-text)]
                      "
                    >
                      <Sparkles
                        size={14}
                        strokeWidth={1.25}
                        className="text-[var(--color-accent)]"
                      />

                      Curated for modern Indian dressing
                    </div>

                    <span
                      aria-hidden="true"
                      className="hidden h-4 w-px bg-[var(--color-border)] sm:block"
                    />

                    <p
                      className="
                        font-display
                        text-sm
                        italic
                        text-[var(--color-text-secondary)]
                      "
                    >
                      {mood}
                    </p>
                  </div>
                </div>

                {/* =================================================
                    COLLECTION INDEX
                ================================================= */}

                <div
                  className="
                    border-t
                    border-[var(--color-border)]
                    pt-7
                    lg:border-l
                    lg:border-t-0
                    lg:pl-8
                    lg:pt-0
                  "
                >
                  <p className="font-body text-[10px] font-semibold uppercase tracking-[var(--tracking-luxury)] text-[var(--color-text-muted)]">
                    Browse the edits
                  </p>

                  <div className="mt-5">
                    {collectionLinks.map((item) => {
                      const isActive = item.category === category;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          aria-current={
                            isActive ? "page" : undefined
                          }
                          className="
                            group
                            flex
                            min-h-12
                            items-center
                            justify-between
                            border-b
                            border-[var(--color-border-light)]
                            py-3
                            font-body
                            text-sm
                            transition-colors
                            duration-[var(--duration-base)]
                          "
                        >
                          <span
                            className={
                              isActive
                                ? "font-semibold text-[var(--color-text)]"
                                : "font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-text)]"
                            }
                          >
                            {item.label}
                          </span>

                          <ArrowUpRight
                            size={15}
                            strokeWidth={1.3}
                            className={
                              isActive
                                ? "text-[var(--color-accent)]"
                                : "text-[var(--color-text-muted)] transition-transform duration-[var(--duration-base)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            }
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>
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
            border-b
            border-[var(--color-border-light)]
            bg-[var(--color-bg)]/95
            backdrop-blur-md
          "
        >
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
            <div className="flex min-h-16 items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-body text-[10px] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-muted)]">
                  Collection
                </span>

                <span
                  aria-hidden="true"
                  className="h-3 w-px bg-[var(--color-border)]"
                />

                <span className="font-body text-xs font-medium text-[var(--color-text)]">
                  {products.length}{" "}
                  {products.length === 1 ? "piece" : "pieces"}
                </span>
              </div>

              <Link
                href="/shop"
                className="
                  link-luxury
                  group
                  inline-flex
                  items-center
                  gap-2
                  font-body
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[var(--tracking-wider)]
                  text-[var(--color-text)]
                "
              >
                Shop all

                <ArrowRight
                  size={14}
                  strokeWidth={1.3}
                  className="transition-transform duration-[var(--duration-base)] group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </section>

        {/* =====================================================
            PRODUCT AREA
        ===================================================== */}

        <section className="mx-auto max-w-[1600px] px-4 py-9 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[235px_minmax(0,1fr)] xl:gap-12">
            {/* =================================================
                FILTERS
            ================================================= */}

            <aside className="hidden lg:block">
              <div className="sticky top-24">
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

        <section className="border-t border-[var(--color-border-light)] bg-[var(--color-bg-soft)]">
          <div className="mx-auto max-w-[1600px] px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-2xl">
                <p className="eyebrow text-[var(--color-accent)]">
                  Continue exploring
                </p>

                <h2
                  className="
                    mt-4
                    font-display
                    text-[var(--text-heading-lg)]
                    font-medium
                    leading-[0.95]
                    tracking-[var(--tracking-tight)]
                    text-[var(--color-text)]
                  "
                >
                  Find the pieces that become part of your story.
                </h2>
              </div>

              <Link
                href="/collections/new-arrivals"
                className="
                  group
                  inline-flex
                  min-h-12
                  items-center
                  justify-center
                  gap-3
                  border
                  border-[var(--color-text)]
                  bg-[var(--color-text)]
                  px-6
                  py-3.5
                  font-body
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[var(--tracking-wider)]
                  text-[var(--color-text-inverse)]
                  transition-all
                  duration-[var(--duration-base)]
                  hover:bg-[var(--color-accent-dark)]
                  hover:border-[var(--color-accent-dark)]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--color-accent)]
                  focus:ring-offset-2
                  focus:ring-offset-[var(--color-bg-soft)]
                "
              >
                Discover new arrivals

                <ArrowUpRight
                  size={15}
                  strokeWidth={1.3}
                  className="transition-transform duration-[var(--duration-base)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}