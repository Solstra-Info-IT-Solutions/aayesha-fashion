"use client";

import type {
  Product,
  ProductCategory,
  ProductSort,
} from "@/types/product";

import { ProductCard } from "@/components/product/product-card";
import { getProductStartingPrice } from "@/types/product";

interface ShopProductGridProps {
  products: Product[];
  category?: ProductCategory;
  sort?: ProductSort;
}

export function ShopProductGrid({
  products,
  category,
  sort = "relevance",
}: ShopProductGridProps) {
  let visibleProducts = products.filter(
    (product) =>
      product.status === "active",
  );

  /* ==========================================================
     CATEGORY
  ========================================================== */

  if (category) {
    visibleProducts = visibleProducts.filter(
      (product) =>
        product.category === category,
    );
  }

  /* ==========================================================
     SORTING
  ========================================================== */

  visibleProducts = [
    ...visibleProducts,
  ];

  switch (sort) {
    case "newest":
      visibleProducts.sort(
        (a, b) =>
          new Date(
            b.publishedAt ??
              b.createdAt,
          ).getTime() -
          new Date(
            a.publishedAt ??
              a.createdAt,
          ).getTime(),
      );
      break;

    case "price-low":
      visibleProducts.sort(
        (a, b) =>
          getProductStartingPrice(a) -
          getProductStartingPrice(b),
      );
      break;

    case "price-high":
      visibleProducts.sort(
        (a, b) =>
          getProductStartingPrice(b) -
          getProductStartingPrice(a),
      );
      break;

    case "best-selling":
      visibleProducts.sort(
        (a, b) =>
          (a.merchandising.ranking ??
            999) -
          (b.merchandising.ranking ??
            999),
      );
      break;

    case "featured":
      visibleProducts.sort(
        (a, b) =>
          Number(
            b.merchandising.isFeatured,
          ) -
          Number(
            a.merchandising.isFeatured,
          ),
      );
      break;

    case "rating":
      visibleProducts.sort(
        (a, b) =>
          (b.reviews?.averageRating ??
            0) -
          (a.reviews?.averageRating ??
            0),
      );
      break;

    case "relevance":
    default:
      visibleProducts.sort(
        (a, b) =>
          (a.merchandising.ranking ??
            999) -
          (b.merchandising.ranking ??
            999),
      );
      break;
  }

  /* ==========================================================
     EMPTY STATE
  ========================================================== */

  if (!visibleProducts.length) {
    return (
      <section className="border-y border-[var(--color-border)] py-20 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          Ayesha Collection
        </p>

        <h2 className="mt-2 font-[var(--font-cormorant)] text-3xl">
          No pieces found.
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--color-text-secondary)]">
          Try adjusting your filters or explore another
          collection.
        </p>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-5 flex items-center justify-between border-b border-[var(--color-border)] pb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
          {visibleProducts.length}{" "}
          {visibleProducts.length === 1
            ? "piece"
            : "pieces"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-12">
        {visibleProducts.map(
          (product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ),
        )}
      </div>
    </section>
  );
}