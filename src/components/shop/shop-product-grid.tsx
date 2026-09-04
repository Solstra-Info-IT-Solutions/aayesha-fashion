"use client";

import type { Product } from "@/types/product";

import { ProductCard } from "@/components/product/product-card";

interface ShopProductGridProps {
  products: Product[];
}

export function ShopProductGrid({
  products,
}: ShopProductGridProps) {
  if (!products.length) {
    return (
      <div className="border-y border-[var(--color-border)] py-20 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          The Ayesha Collection
        </p>

        <h2 className="mt-2 font-[var(--font-cormorant)] text-3xl">
          No pieces found.
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--color-text-secondary)]">
          Try adjusting your filters or exploring another
          category.
        </p>
      </div>
    );
  }

  return (
    <section>
      <div className="mb-5 flex items-center justify-between border-b border-[var(--color-border)] pb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
          {products.length}{" "}
          {products.length === 1
            ? "piece"
            : "pieces"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-12">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}