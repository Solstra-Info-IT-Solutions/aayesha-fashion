"use client";

import { useMemo } from "react";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";

import type {
  Product,
  ProductCategory,
  ProductSort,
} from "@/types/product";

import {
  getProductAvailability,
  getProductStartingPrice,
  getProductColors,
  getProductSizes,
} from "@/types/product";

import { ProductCard } from "@/components/product/product-card";

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
  const filteredProducts = useMemo(() => {
    let result = products.filter(
      (product) =>
        product.status === "active",
    );

    if (category) {
      result = result.filter(
        (product) => product.category === category,
      );
    }

    const params =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : null;

    const type = params?.get("type");
    const color = params?.get("color");
    const size = params?.get("size");
    const availability = params?.get("availability");

    if (type) {
      result = result.filter(
        (product) =>
          product.productType === type,
      );
    }

    if (color) {
      result = result.filter((product) =>
        getProductColors(product).some(
          (item) => item.id === color,
        ),
      );
    }

    if (size) {
      result = result.filter((product) =>
        getProductSizes(product).some(
          (item) => item.code === size,
        ),
      );
    }

    if (availability) {
  result = result.filter((product) => {
    const productAvailability =
      getProductAvailability(product);

    if (availability === "in-stock") {
      return productAvailability.isAvailable === true;
    }

    if (availability === "low") {
      return productAvailability.isLowStock === true;
    }

    if (availability === "out-of-stock") {
      return productAvailability.isAvailable === false;
    }

    return true;
  });
}

    switch (sort) {
      case "price-low":
        result.sort(
          (a, b) =>
            getProductStartingPrice(a) -
            getProductStartingPrice(b),
        );
        break;

      case "price-high":
        result.sort(
          (a, b) =>
            getProductStartingPrice(b) -
            getProductStartingPrice(a),
        );
        break;

      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime(),
        );
        break;

      case "rating":
        result.sort(
          (a, b) =>
           {
               const aCount = a.reviews?.reviewCount ?? 0;
               const bCount = b.reviews?.reviewCount ?? 0;
               return bCount - aCount;
           }
        );
        break;

      case "best-selling":
        result.sort((a, b) => {
          const aScore =
            a.merchandising?.isBestSeller  ? 1 : 0;

          const bScore =
            b.merchandising?.isBestSeller  ? 1 : 0;

          return bScore - aScore;
        });
        break;

      case "featured":
        result.sort((a, b) => {
          const aScore =
            a.merchandising?.isFeatured  ? 1 : 0;

          const bScore =
            b.merchandising?.isFeatured  ? 1 : 0;

          return bScore - aScore;
        });
        break;

      default:
        break;
    }

    return result;
  }, [products, category, sort]);

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1
              ? "piece"
              : "pieces"}
          </p>
        </div>

        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.13em] text-[var(--color-text-secondary)] lg:hidden"
        >
          <SlidersHorizontal
            size={14}
            strokeWidth={1.7}
          />
          Refine
        </Link>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="border border-[var(--color-border)] bg-[var(--color-cream)] px-6 py-16 text-center sm:px-10 sm:py-24">
          <p className="font-serif text-3xl text-[var(--color-charcoal)]">
            No pieces found
          </p>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--color-text-secondary)]">
            Try adjusting your filters or explore the
            complete collection.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-flex border border-[var(--color-charcoal)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-charcoal)] transition-colors hover:bg-[var(--color-charcoal)] hover:text-white"
          >
            View Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}