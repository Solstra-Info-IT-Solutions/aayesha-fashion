"use client";

import {
  useMemo,
} from "react";

import Link from "next/link";

import {
  SlidersHorizontal,
} from "lucide-react";

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

function getUrlParams() {
  if (
    typeof window ===
    "undefined"
  ) {
    return {
      type: null,
      color: null,
      size: null,
      availability: null,
    };
  }

  const params =
    new URLSearchParams(
      window.location.search,
    );

  return {
    type: params.get(
      "type",
    ),

    color: params.get(
      "color",
    ),

    size: params.get(
      "size",
    ),

    availability:
      params.get(
        "availability",
      ),
  };
}

function getCollectionContext() {
  if (
    typeof window ===
    "undefined"
  ) {
    return {
      isNew: false,
      isBestSeller: false,
    };
  }

  const pathname =
    window.location.pathname;

  const params =
    new URLSearchParams(
      window.location.search,
    );

  return {
    isNew:
      pathname ===
        "/collections/new-arrivals" ||
      params.get(
        "isNew",
      ) === "true",

    isBestSeller:
      pathname ===
        "/collections/best-sellers" ||
      params.get(
        "isBestSeller",
      ) === "true",
  };
}

export function ShopProductGrid({
  products,
  category,
  sort = "relevance",
}: ShopProductGridProps) {
  /*
   * Reading the current query string
   * at render time allows the server
   * page to provide the correctly
   * filtered product array while this
   * component applies the presentation
   * layer filters as well.
   */
  const urlParams =
    useMemo(
      () => getUrlParams(),
      [
        products,
        category,
        sort,
      ],
    );

  const collectionContext =
    useMemo(
      () =>
        getCollectionContext(),
      [
        products,
        category,
        sort,
      ],
    );

  const filteredProducts =
    useMemo(() => {
      let result =
        products.filter(
          (product) =>
            product.status ===
            "active",
        );

      /* =====================================================
         CATEGORY
      ===================================================== */

      if (category) {
        result =
          result.filter(
            (product) =>
              product.category ===
              category,
          );
      }

      /* =====================================================
         COLLECTION SCOPE
      ===================================================== */

      if (
        collectionContext.isNew
      ) {
        result =
          result.filter(
            (product) =>
              product.merchandising
                ?.isNew === true,
          );
      }

      if (
        collectionContext.isBestSeller
      ) {
        result =
          result.filter(
            (product) =>
              product.merchandising
                ?.isBestSeller ===
              true,
          );
      }

      /* =====================================================
         PRODUCT TYPE
      ===================================================== */

      if (urlParams.type) {
        result =
          result.filter(
            (product) =>
              product.productType ===
              urlParams.type,
          );
      }

      /* =====================================================
         COLOR
      ===================================================== */

      if (urlParams.color) {
        result =
          result.filter(
            (product) =>
              getProductColors(
                product,
              ).some(
                (item) =>
                  item.id ===
                  urlParams.color,
              ),
          );
      }

      /* =====================================================
         SIZE
      ===================================================== */

      if (urlParams.size) {
        result =
          result.filter(
            (product) =>
              getProductSizes(
                product,
              ).some(
                (item) =>
                  item.code ===
                  urlParams.size,
              ),
          );
      }

      /* =====================================================
         AVAILABILITY
      ===================================================== */

      if (
        urlParams.availability
      ) {
        result =
          result.filter(
            (product) => {
              const activeVariants =
                product.variants.filter(
                  (variant) =>
                    variant.status ===
                    "active",
                );

              const availableVariants =
                activeVariants.filter(
                  (variant) => {
                    const availableStock =
                      variant.inventory.stock -
                      variant.inventory.reserved;

                    return (
                      availableStock >
                      0
                    );
                  },
                );

              if (
                urlParams.availability ===
                "out-of-stock"
              ) {
                return (
                  availableVariants.length ===
                  0
                );
              }

              if (
                urlParams.availability ===
                "in-stock"
              ) {
                return availableVariants.some(
                  (variant) => {
                    const availableStock =
                      variant.inventory.stock -
                      variant.inventory.reserved;

                    return (
                      availableStock >
                      variant.inventory
                        .lowStockThreshold
                    );
                  },
                );
              }

              if (
                urlParams.availability ===
                "low"
              ) {
                return availableVariants.some(
                  (variant) => {
                    const availableStock =
                      variant.inventory.stock -
                      variant.inventory.reserved;

                    return (
                      availableStock >
                        0 &&
                      availableStock <=
                        variant
                          .inventory
                          .lowStockThreshold
                    );
                  },
                );
              }

              return true;
            },
          );
      }

      /* =====================================================
         SORT
      ===================================================== */

      switch (sort) {
        case "price-low":
          result.sort(
            (a, b) =>
              getProductStartingPrice(
                a,
              ) -
              getProductStartingPrice(
                b,
              ),
          );
          break;

        case "price-high":
          result.sort(
            (a, b) =>
              getProductStartingPrice(
                b,
              ) -
              getProductStartingPrice(
                a,
              ),
          );
          break;

        case "newest":
          result.sort(
            (a, b) =>
              new Date(
                b.createdAt,
              ).getTime() -
              new Date(
                a.createdAt,
              ).getTime(),
          );
          break;

        case "best-selling":
          result.sort(
            (a, b) => {
              const aScore =
                a.merchandising
                  ?.isBestSeller
                  ? 1
                  : 0;

              const bScore =
                b.merchandising
                  ?.isBestSeller
                  ? 1
                  : 0;

              return (
                bScore -
                aScore
              );
            },
          );
          break;

        case "featured":
          result.sort(
            (a, b) => {
              const aScore =
                a.merchandising
                  ?.isFeatured
                  ? 1
                  : 0;

              const bScore =
                b.merchandising
                  ?.isFeatured
                  ? 1
                  : 0;

              return (
                bScore -
                aScore
              );
            },
          );
          break;

        case "rating":
        case "relevance":
        default:
          break;
      }

      return result;
    }, [
      products,
      category,
      sort,
      urlParams.type,
      urlParams.color,
      urlParams.size,
      urlParams.availability,
      collectionContext.isNew,
      collectionContext.isBestSeller,
    ]);

  /* ==========================================================
     CURRENT COLLECTION LINK
  ========================================================== */

  const refineHref =
    collectionContext.isNew
      ? "/collections/new-arrivals"
      : collectionContext.isBestSeller
        ? "/collections/best-sellers"
        : "/shop";

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="min-w-0">
      {/* =====================================================
          TOOLBAR
      ===================================================== */}

      <div className="mb-6 flex items-center justify-between gap-4 sm:mb-7">
        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {
              filteredProducts.length
            }{" "}
            {filteredProducts.length ===
            1
              ? "piece"
              : "pieces"}
          </p>
        </div>

        <Link
          href={refineHref}
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

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {filteredProducts.length ===
      0 ? (
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
              font-[var(--font-display)]
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
            Try adjusting your filters or
            explore the complete collection.
          </p>

          <Link
            href={refineHref}
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
          {filteredProducts.map(
            (product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}