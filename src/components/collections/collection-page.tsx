import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

import type {
  Product,
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
  categoryId?: string;
  products: Product[];
  sort: ProductSort;
  mood?: string;
};

/* =========================================================
   COLLECTION LINKS
========================================================= */

const collectionLinks = [
  {
    label: "New Arrivals",
    href: "/collections/new-arrivals",
  },
  {
    label: "Best Sellers",
    href: "/collections/best-sellers",
  },
] as const;

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
  mood,
}: CollectionPageProps) {
  const currentSlug = title
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
            url: `/collections/${currentSlug}`,
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
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_250px] lg:items-end xl:grid-cols-[minmax(0,1fr)_280px]">
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
                      text-[2.7rem]
                      font-medium
                      leading-[0.92]
                      tracking-[-0.04em]
                      text-[var(--color-text)]
                      sm:text-[3.4rem]
                      md:text-[3.9rem]
                      lg:text-[4.3rem]
                    "
                  >
                    {title}
                  </h1>

                  <p
                    className="
                      mt-4
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

                  {mood && (
                    <p
                      className="
                        mt-4
                        font-display
                        text-xs
                        italic
                        text-[var(--color-text-secondary)]
                      "
                    >
                      {mood}
                    </p>
                  )}
                </div>

                {/* COLLECTION NAVIGATION */}

                <div>
                  <p className="mb-2 font-body text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                    Explore collections
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {collectionLinks.map((item) => {
                      const isActive =
                        item.href ===
                        `/collections/${currentSlug}`;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          aria-current={
                            isActive
                              ? "page"
                              : undefined
                          }
                          className={[
                            "group inline-flex items-center gap-1.5 border px-3.5 py-2.5 font-body text-[9px] font-semibold uppercase tracking-[0.16em] transition-colors duration-200",
                            isActive
                              ? "border-[var(--color-text)] bg-[var(--color-text)] text-[var(--color-text-inverse)]"
                              : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text)] hover:text-[var(--color-text)]",
                          ].join(" ")}
                        >
                          {item.label}

                          <ArrowUpRight
                            size={13}
                            strokeWidth={1.3}
                            className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="eyebrow text-[var(--color-accent)]">
                  Continue exploring
                </p>

                <h2
                  className="
                    mt-1.5
                    font-display
                    text-[1.6rem]
                    font-medium
                    leading-none
                    tracking-[-0.03em]
                    text-[var(--color-text)]
                    sm:text-[1.9rem]
                    lg:text-[2.1rem]
                  "
                >
                  Discover more from Ayesha Fashion.
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href="/collections/new-arrivals"
                  className="
                    group
                    inline-flex
                    min-h-10
                    items-center
                    justify-center
                    gap-2
                    border
                    border-[var(--color-text)]
                    bg-[var(--color-text)]
                    px-4
                    py-2.5
                    font-body
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-[var(--color-text-inverse)]
                    transition-colors
                    duration-200
                    hover:bg-[var(--color-accent-dark)]
                    hover:border-[var(--color-accent-dark)]
                  "
                >
                  New Arrivals

                  <ArrowUpRight
                    size={13}
                    strokeWidth={1.3}
                    className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>

                <Link
                  href="/collections/best-sellers"
                  className="
                    group
                    inline-flex
                    min-h-10
                    items-center
                    justify-center
                    gap-2
                    border
                    border-[var(--color-border)]
                    bg-transparent
                    px-4
                    py-2.5
                    font-body
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-[var(--color-text)]
                    transition-colors
                    duration-200
                    hover:border-[var(--color-text)]
                  "
                >
                  Best Sellers

                  <ArrowUpRight
                    size={13}
                    strokeWidth={1.3}
                    className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}