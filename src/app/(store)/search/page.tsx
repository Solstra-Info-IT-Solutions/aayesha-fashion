import Link from "next/link";

import { products } from "@/data/products";
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

  const query =
    params.q?.trim().toLowerCase() ?? "";

  const results = query
    ? products.filter(
        (product) => {
          const haystack = [
            product.name,
            product.category,
            product.subcategory ?? "",
            product.productType,
            ...product.tags,
          ]
            .join(" ")
            .toLowerCase();

          return haystack.includes(query);
        },
      )
    : [];

  return (
    <main className="bg-[var(--color-ivory)]">
      <section className="border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 lg:py-18">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            Search Ayesha
          </p>

          <h1 className="mt-3 font-[var(--font-cormorant)] text-4xl sm:text-5xl">
            {query
              ? `Results for “${query}”`
              : "Find your next piece."}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
        {!query ? (
          <div className="py-20 text-center">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Use the search field in the header to discover
              products.
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-flex min-h-11 items-center bg-[var(--color-charcoal)] px-6 text-[10px] font-semibold uppercase tracking-[0.15em] text-white"
            >
              Browse Shop
            </Link>
          </div>
        ) : results.length ? (
          <div>
            <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
              {results.length}{" "}
              {results.length === 1
                ? "result"
                : "results"}
            </p>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
              {results.map(
                (product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ),
              )}
            </div>
          </div>
        ) : (
          <div className="py-20 text-center">
            <h2 className="font-[var(--font-cormorant)] text-3xl">
              Nothing found.
            </h2>

            <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
              Try another search term or explore the full
              collection.
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-flex min-h-11 items-center bg-[var(--color-charcoal)] px-6 text-[10px] font-semibold uppercase tracking-[0.15em] text-white"
            >
              Explore Shop
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}