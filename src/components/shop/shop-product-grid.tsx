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
      (product) => product.status === "active",
    );

    /* =========================================================
       CATEGORY
    ========================================================= */

    if (category) {
      result = result.filter(
        (product) => product.category === category,
      );
    }

    /* =========================================================
       URL FILTERS
    ========================================================= */

    const params =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : null;

    const type = params?.get("type");
    const color = params?.get("color");
    const size = params?.get("size");
    const availability = params?.get("availability");

    /* =========================================================
       PRODUCT TYPE
    ========================================================= */

    if (type) {
      result = result.filter(
        (product) =>
          product.productType === type,
      );
    }

    /* =========================================================
       COLOR
    ========================================================= */

    if (color) {
      result = result.filter((product) =>
        getProductColors(product).some(
          (item) => item.id === color,
        ),
      );
    }

    /* =========================================================
       SIZE
    ========================================================= */

    if (size) {
      result = result.filter((product) =>
        getProductSizes(product).some(
          (item) => item.code === size,
        ),
      );
    }

    /* =========================================================
       AVAILABILITY
       
       Uses actual variant inventory data instead of relying
       on ProductAvailability fields.
    ========================================================= */

    if (availability) {
      result = result.filter((product) => {
        const activeVariants = product.variants.filter(
          (variant) =>
            variant.status === "active",
        );

        const availableVariants =
          activeVariants.filter((variant) => {
            const availableStock =
              variant.inventory.stock -
              variant.inventory.reserved;

            return availableStock > 0;
          });

        /* -----------------------------------------------
           OUT OF STOCK
        ----------------------------------------------- */

        if (availability === "out-of-stock") {
          return availableVariants.length === 0;
        }

        /* -----------------------------------------------
           IN STOCK
        ----------------------------------------------- */

        if (availability === "in-stock") {
          return availableVariants.some(
            (variant) => {
              const availableStock =
                variant.inventory.stock -
                variant.inventory.reserved;

              return (
                availableStock >
                variant.inventory.lowStockThreshold
              );
            },
          );
        }

        /* -----------------------------------------------
           LOW STOCK
        ----------------------------------------------- */

        if (availability === "low") {
          return availableVariants.some(
            (variant) => {
              const availableStock =
                variant.inventory.stock -
                variant.inventory.reserved;

              return (
                availableStock > 0 &&
                availableStock <=
                  variant.inventory.lowStockThreshold
              );
            },
          );
        }

        return true;
      });
    }

    /* =========================================================
       SORTING
    ========================================================= */

    switch (sort) {
      /* -------------------------------------------------------
         PRICE LOW → HIGH
      ------------------------------------------------------- */

      case "price-low":
        result.sort(
          (a, b) =>
            getProductStartingPrice(a) -
            getProductStartingPrice(b),
        );
        break;

      /* -------------------------------------------------------
         PRICE HIGH → LOW
      ------------------------------------------------------- */

      case "price-high":
        result.sort(
          (a, b) =>
            getProductStartingPrice(b) -
            getProductStartingPrice(a),
        );
        break;

      /* -------------------------------------------------------
         NEWEST
      ------------------------------------------------------- */

      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime(),
        );
        break;

      /* -------------------------------------------------------
         BEST SELLING
      ------------------------------------------------------- */

      case "best-selling":
        result.sort((a, b) => {
          const aScore =
            a.merchandising?.isBestSeller
              ? 1
              : 0;

          const bScore =
            b.merchandising?.isBestSeller
              ? 1
              : 0;

          return bScore - aScore;
        });
        break;

      /* -------------------------------------------------------
         FEATURED
      ------------------------------------------------------- */

      case "featured":
        result.sort((a, b) => {
          const aScore =
            a.merchandising?.isFeatured
              ? 1
              : 0;

          const bScore =
            b.merchandising?.isFeatured
              ? 1
              : 0;

          return bScore - aScore;
        });
        break;

      /* -------------------------------------------------------
         RATING
         
         Temporarily preserve original product order because
         the exact ProductReviewSummary rating field has not
         been verified.
      ------------------------------------------------------- */

      case "rating":
      case "relevance":
      default:
        break;
    }

    return result;
  }, [products, category, sort]);

  /* ===========================================================
     RENDER
  =========================================================== */

  return (
    <div className="min-w-0">
      {/* =======================================================
          TOOLBAR
      ======================================================= */}

      <div className="mb-6 flex items-center justify-between gap-4 sm:mb-7">
        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1
              ? "piece"
              : "pieces"}
          </p>
        </div>

        {/* Mobile refine */}
        <Link
          href="/shop"
          className="
            inline-flex
            items-center
            gap-2
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.14em]
            text-[var(--color-text-secondary)]
            transition-colors
            hover:text-[var(--color-charcoal)]
            lg:hidden
          "
        >
          <SlidersHorizontal
            size={14}
            strokeWidth={1.7}
          />

          Refine
        </Link>
      </div>

      {/* =======================================================
          EMPTY STATE
      ======================================================= */}

      {filteredProducts.length === 0 ? (
        <div
          className="
            border
            border-[var(--color-border)]
            bg-[var(--color-cream)]
            px-6
            py-16
            text-center
            sm:px-10
            sm:py-24
          "
        >
          <p
            className="
              font-serif
              text-3xl
              tracking-[-0.02em]
              text-[var(--color-charcoal)]
              sm:text-4xl
            "
          >
            No pieces found
          </p>

          <p
            className="
              mx-auto
              mt-3
              max-w-md
              text-sm
              leading-6
              text-[var(--color-text-secondary)]
            "
          >
            Try adjusting your filters or explore
            the complete collection.
          </p>

          <Link
            href="/shop"
            className="
              mt-7
              inline-flex
              border
              border-[var(--color-charcoal)]
              px-5
              py-3
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-[var(--color-charcoal)]
              transition-colors
              hover:bg-[var(--color-charcoal)]
              hover:text-white
            "
          >
            View Collection
          </Link>
        </div>
      ) : (
        /* =====================================================
           PRODUCT GRID
        ===================================================== */

        <div
          className="
            grid
            grid-cols-2
            gap-x-3
            gap-y-9

            sm:gap-x-5
            sm:gap-y-11

            md:grid-cols-3
            md:gap-x-6
            md:gap-y-12

            xl:grid-cols-4
            xl:gap-x-7
            xl:gap-y-14
          "
        >
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