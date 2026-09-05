import Link from "next/link";

import type { Product } from "@/types/product";

import { ProductCard } from "@/components/product/product-card";

interface ProductRecommendationsProps {
  product: Product;
  recommendations: Product[];
}

export function ProductRecommendations({
  product,
  recommendations,
}: ProductRecommendationsProps) {
  if (!recommendations.length) {
    return null;
  }

  return (
    <section className="border-t border-[var(--color-border)] bg-[var(--color-cream)]">
      <div className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 sm:py-18 lg:px-10 lg:py-20">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
              Curated for you
            </p>

            <h2 className="mt-2 font-[var(--font-cormorant)] text-4xl leading-none text-[var(--color-charcoal)]">
              You may also like.
            </h2>
          </div>

          <Link
            href={`/shop?category=${product.category}`}
            className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] underline underline-offset-4 sm:block"
          >
            View collection
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-6">
          {recommendations.map(
            (item) => (
              <ProductCard
                key={item.id}
                product={item}
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
}