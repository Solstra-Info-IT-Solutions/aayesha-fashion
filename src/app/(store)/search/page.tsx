import Link from "next/link";

import type { Product } from "@/types/product";

import { getProducts } from "@/lib/api/products";
import { ProductCard } from "@/components/product/product-card";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;

  const query = params.q?.trim() ?? "";

  let results: Product[] = [];

  if (query) {
    try {
      const response = await getProducts({
        page: 1,
        limit: 48,
        search: query,
        status: "active",
        sort: "relevance",
      });

      results = response.products;
    } catch {
      results = [];
    }
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      {/* =====================================================
          SEARCH INTRO
      ===================================================== */}

      <section className="border-b border-[var(--color-border-light)]">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="grid min-h-[42vh] items-end gap-10 py-14 sm:py-18 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-24">
            <div className="max-w-5xl">
              <p className="eyebrow flex items-center gap-3 text-[var(--color-accent)]">
                <span className="h-px w-8 bg-[var(--color-accent)]" />
                Search Aayesha
              </p>

              <h1
                className="
                  mt-6
                  max-w-5xl
                  font-display
                  text-[clamp(3rem,7vw,6.5rem)]
                  font-medium
                  leading-[0.86]
                  tracking-[var(--tracking-tight)]
                  text-[var(--color-text)]
                "
              >
                {query
                  ? `Results for “${query}”`
                  : "Find your next piece."}
              </h1>
            </div>

            {query && (
              <div className="border-t border-[var(--color-border)] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                <p className="font-display text-2xl leading-tight text-[var(--color-text)] sm:text-3xl">
                  Curated around what you are looking for.
                </p>

                <p className="mt-4 font-body text-sm leading-7 text-[var(--color-text-secondary)]">
                  Exploring our current collection for pieces
                  matching your search.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          SEARCH RESULTS
      ===================================================== */}

      <section className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* ===================================================
            NO QUERY
        =================================================== */}

        {!query ? (
          <div className="flex min-h-[42vh] items-center justify-center py-16 text-center">
            <div className="max-w-lg">
              <p className="eyebrow text-[var(--color-accent)]">
                Begin exploring
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
                Discover something made for you.
              </h2>

              <p className="mx-auto mt-5 max-w-md font-body text-sm leading-7 text-[var(--color-text-secondary)]">
                Use the search field in the header to discover
                silhouettes, collections and pieces from Aayesha
                Fashion.
              </p>

              <Link
                href="/shop"
                className="
                  mt-8
                  inline-flex
                  min-h-12
                  items-center
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
                  hover:border-[var(--color-accent-dark)]
                  hover:bg-[var(--color-accent-dark)]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--color-accent)]
                  focus:ring-offset-2
                "
              >
                Browse Shop
              </Link>
            </div>
          </div>
        ) : results.length ? (
          /* =================================================
             RESULTS FOUND
          ================================================= */

          <div>
            <div className="mb-9 flex items-end justify-between gap-6 border-b border-[var(--color-border)] pb-5">
              <div>
                <p className="eyebrow text-[var(--color-accent)]">
                  Search Results
                </p>

                <p className="mt-2 font-body text-sm text-[var(--color-text-secondary)]">
                  {results.length}{" "}
                  {results.length === 1 ? "piece" : "pieces"} found
                </p>
              </div>

              <Link
                href="/shop"
                className="
                  link-luxury
                  group
                  hidden
                  items-center
                  gap-2
                  font-body
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[var(--tracking-wider)]
                  text-[var(--color-text)]
                  sm:inline-flex
                "
              >
                View all

                <span className="transition-transform duration-[var(--duration-base)] group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-14 xl:grid-cols-4">
              {results.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>

            <div className="mt-12 border-t border-[var(--color-border-light)] pt-6 sm:hidden">
              <Link
                href="/shop"
                className="
                  link-luxury
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
                View all pieces
                <span>→</span>
              </Link>
            </div>
          </div>
        ) : (
          /* =================================================
             NO RESULTS
          ================================================= */

          <div className="flex min-h-[48vh] items-center justify-center py-16 text-center">
            <div className="max-w-xl">
              <p className="eyebrow text-[var(--color-accent)]">
                No match
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
                Nothing found.
              </h2>

              <p className="mx-auto mt-5 max-w-md font-body text-sm leading-7 text-[var(--color-text-secondary)]">
                We could not find a piece matching “{query}”.
                Try another term or explore the complete collection.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/shop"
                  className="
                    inline-flex
                    min-h-12
                    items-center
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
                    hover:border-[var(--color-accent-dark)]
                    hover:bg-[var(--color-accent-dark)]
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[var(--color-accent)]
                    focus:ring-offset-2
                  "
                >
                  Explore Shop
                </Link>

                <Link
                  href="/collections/new-arrivals"
                  className="
                    inline-flex
                    min-h-12
                    items-center
                    border
                    border-[var(--color-border-dark)]
                    px-6
                    py-3.5
                    font-body
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[var(--tracking-wider)]
                    text-[var(--color-text)]
                    transition-colors
                    duration-[var(--duration-base)]
                    hover:border-[var(--color-text)]
                  "
                >
                  New Arrivals
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}