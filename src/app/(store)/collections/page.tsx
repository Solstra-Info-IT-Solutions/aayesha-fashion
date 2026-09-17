import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

import { getProducts } from "@/services/product.service";
import type { Product } from "@/types/product";
import { ProductCard } from "@/components/product/product-card";

/* =========================================================
   COLLECTIONS
========================================================= */

const collectionLinks = [
  {
    label: "New Arrivals",
    eyebrow: "Just introduced",
    description:
      "Discover the latest pieces added to the Aayesha Fashion collection.",
    href: "/collections/new-arrivals",
  },
  {
    label: "Best Sellers",
    eyebrow: "Most loved",
    description:
      "Explore the pieces our customers return to time and again.",
    href: "/collections/best-sellers",
  },
] as const;

/* =========================================================
   PAGE
========================================================= */

export default async function CollectionsPage() {
  let featured: Product[] = [];

  try {
    const response = await getProducts({
      page: 1,
      limit: 6,
      isFeatured: true,
      status: "active",
      sort: "featured",
    });

    featured = response.products ?? [];
  } catch {
    featured = [];
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="bg-[var(--color-bg)]">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="py-7 sm:py-9 lg:py-11">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-[var(--color-accent)]" />

                <p className="eyebrow text-[var(--color-accent)]">
                  Aayesha Fashion
                </p>
              </div>

              <h1
                className="
                  mt-3
                  font-display
                  text-[2.3rem]
                  font-medium
                  leading-none
                  tracking-[-0.035em]
                  text-[var(--color-text)]
                  sm:text-[2.9rem]
                  lg:text-[3.4rem]
                "
              >
                Collections
              </h1>

              <p
                className="
                  mt-3
                  max-w-xl
                  font-body
                  text-[13px]
                  leading-6
                  text-[var(--color-text-secondary)]
                  sm:text-sm
                  sm:leading-7
                "
              >
                Explore the latest arrivals and the pieces
                loved most by our customers.
              </p>

              <Link
                href="/shop"
                className="
                  group
                  mt-4
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
                Shop everything

                <ArrowRight
                  size={13}
                  strokeWidth={1.3}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          COLLECTIONS
      ===================================================== */}

      <section className="bg-[var(--color-bg-soft)]">
        <div className="mx-auto max-w-[1400px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-11">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-[var(--color-accent)]">
                Explore
              </p>

              <h2
                className="
                  mt-1.5
                  font-display
                  text-[1.65rem]
                  font-medium
                  leading-none
                  tracking-[-0.025em]
                  text-[var(--color-text)]
                  sm:text-[1.9rem]
                "
              >
                Shop by collection
              </h2>
            </div>

            <span className="hidden font-body text-[8px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)] sm:block">
              02 collections
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {collectionLinks.map(
              (collection, index) => (
                <Link
                  key={collection.href}
                  href={collection.href}
                  className="
                    group
                    flex
                    min-h-[190px]
                    flex-col
                    justify-between
                    bg-[var(--color-bg)]
                    p-5
                    transition-colors
                    duration-200
                    hover:bg-[var(--color-ivory)]
                    sm:min-h-[210px]
                    sm:p-6
                    lg:min-h-[230px]
                  "
                >
                  <div className="flex items-start justify-between">
                    <span className="font-body text-[8px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                      0{index + 1}
                    </span>

                    <span
                      className="
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        border
                        border-[var(--color-border)]
                        text-[var(--color-text-secondary)]
                        transition-colors
                        duration-200
                        group-hover:border-[var(--color-accent)]
                        group-hover:text-[var(--color-accent)]
                      "
                    >
                      <ArrowUpRight
                        size={13}
                        strokeWidth={1.25}
                      />
                    </span>
                  </div>

                  <div>
                    <p className="font-body text-[8px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                      {collection.eyebrow}
                    </p>

                    <h3
                      className="
                        mt-1.5
                        font-display
                        text-[1.75rem]
                        font-medium
                        leading-none
                        tracking-[-0.025em]
                        text-[var(--color-text)]
                        sm:text-[2rem]
                      "
                    >
                      {collection.label}
                    </h3>

                    <p className="mt-2.5 max-w-sm font-body text-[11px] leading-5 text-[var(--color-text-secondary)]">
                      {collection.description}
                    </p>

                    <span className="mt-3 inline-flex items-center gap-1.5 font-body text-[8px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text)]">
                      Explore

                      <ArrowRight
                        size={12}
                        strokeWidth={1.3}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURED PRODUCTS
      ===================================================== */}

      {featured.length > 0 && (
        <section className="bg-[var(--color-bg)]">
          <div className="mx-auto max-w-[1400px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-11">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-[var(--color-accent)]">
                  The Aayesha edit
                </p>

                <h2
                  className="
                    mt-1.5
                    font-display
                    text-[1.65rem]
                    font-medium
                    leading-none
                    tracking-[-0.025em]
                    text-[var(--color-text)]
                    sm:text-[1.9rem]
                  "
                >
                  Featured pieces
                </h2>
              </div>

              <Link
                href="/shop"
                className="
                  group
                  inline-flex
                  items-center
                  gap-1.5
                  font-body
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-[var(--color-text)]
                "
              >
                View all

                <ArrowUpRight
                  size={13}
                  strokeWidth={1.3}
                  className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            <p className="mt-2 max-w-lg font-body text-xs leading-5 text-[var(--color-text-secondary)]">
              A considered selection of pieces from the
              Aayesha collection.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-4 lg:mt-8 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-9">
              {featured.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          CLOSING
      ===================================================== */}

      <section className="bg-[var(--color-text)]">
        <div className="mx-auto max-w-[1000px] px-4 py-9 text-center sm:px-6 sm:py-11 lg:px-8 lg:py-13">
          <p className="font-body text-[8px] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-soft)]">
            Aayesha Fashion
          </p>

          <h2
            className="
              mx-auto
              mt-2.5
              max-w-xl
              font-display
              text-[1.9rem]
              font-medium
              leading-[0.95]
              tracking-[-0.03em]
              text-[var(--color-text-inverse)]
              sm:text-[2.4rem]
              lg:text-[2.8rem]
            "
          >
            Style that feels distinctly yours.
          </h2>

          <Link
            href="/shop"
            className="
              mt-5
              inline-flex
              min-h-9
              items-center
              justify-center
              gap-2
              border
              border-[var(--color-text-inverse)]/30
              px-4
              py-2
              font-body
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-[var(--color-text-inverse)]
              transition-colors
              duration-200
              hover:border-[var(--color-accent-soft)]
              hover:text-[var(--color-accent-soft)]
            "
          >
            Shop now

            <ArrowRight
              size={13}
              strokeWidth={1.3}
            />
          </Link>
        </div>
      </section>
    </main>
  );
}