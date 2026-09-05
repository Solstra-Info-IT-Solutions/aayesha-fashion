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
    <main className="bg-[var(--color-ivory)]">
      {/* =====================================================
          SEARCH INTRO
      ===================================================== */}

      <section className="border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 lg:py-18">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            Search Ayesha
          </p>

          <h1 className="mt-3 font-[var(--font-cormorant)] text-4xl text-[var(--color-charcoal)] sm:text-5xl">
            {query
              ? `Results for “${query}”`
              : "Find your next piece."}
          </h1>

          {query && (
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--color-text-secondary)]">
              Exploring our current collection for
              pieces matching your search.
            </p>
          )}
        </div>
      </section>

      {/* =====================================================
          SEARCH RESULTS
      ===================================================== */}

      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
        {/* ===================================================
            NO QUERY
        =================================================== */}

        {!query ? (
          <div className="py-20 text-center">
            <p className="text-sm leading-7 text-[var(--color-text-secondary)]">
              Use the search field in the header to discover
              products.
            </p>

            <Link
              href="/shop"
              className="
                mt-6
                inline-flex
                min-h-11
                items-center
                bg-[var(--color-charcoal)]
                px-6
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.15em]
                text-white
                transition-colors
                duration-300
                hover:bg-[var(--color-rose-dark)]
              "
            >
              Browse Shop
            </Link>
          </div>
        ) : results.length ? (
          /* =================================================
             RESULTS FOUND
          ================================================= */

          <div>
            <div className="mb-7 flex items-end justify-between border-b border-[var(--color-border)] pb-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                  Search Results
                </p>

                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  {results.length}{" "}
                  {results.length === 1
                    ? "piece"
                    : "pieces"}{" "}
                  found
                </p>
              </div>

              <Link
                href="/shop"
                className="
                  hidden
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.15em]
                  text-[var(--color-charcoal)]
                  underline
                  underline-offset-4
                  transition-colors
                  duration-300
                  hover:text-[var(--color-rose-dark)]
                  sm:block
                "
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
              {results.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          </div>
        ) : (
          /* =================================================
             NO RESULTS
          ================================================= */

          <div className="py-20 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
              No Match
            </p>

            <h2 className="mt-3 font-[var(--font-cormorant)] text-3xl text-[var(--color-charcoal)]">
              Nothing found.
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--color-text-secondary)]">
              We could not find a piece matching “{query}”.
              Try another term or explore the complete
              collection.
            </p>

            <Link
              href="/shop"
              className="
                mt-6
                inline-flex
                min-h-11
                items-center
                bg-[var(--color-charcoal)]
                px-6
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.15em]
                text-white
                transition-colors
                duration-300
                hover:bg-[var(--color-rose-dark)]
              "
            >
              Explore Shop
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}