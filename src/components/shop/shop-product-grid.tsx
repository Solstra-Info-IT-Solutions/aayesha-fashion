"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  SlidersHorizontal,
} from "lucide-react";

import type {
  Product,
  ProductSort,
} from "@/types/product";

import {
  getProductStartingPrice,
  getInventoryStatus,
} from "@/types/product";

import { ResilientProductGrid } from "@/components/product/resilient-product-grid";
import { getCategories } from "@/services/category.service";

interface ShopProductGridProps {
  products: Product[];
  category?: string;
  sort?: ProductSort;
}

function getUrlParams() {
  if (typeof window === "undefined") {
    return {
      availability: null,
    };
  }

  const params =
    new URLSearchParams(
      window.location.search,
    );

  return {
    availability:
      params.get("availability"),
  };
}

function getCollectionContext() {
  if (typeof window === "undefined") {
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
      params.get("isNew") === "true",

    isBestSeller:
      pathname ===
        "/collections/best-sellers" ||
      params.get("isBestSeller") ===
        "true",
  };
}

export function ShopProductGrid({
  products,
  category,
  sort = "relevance",
}: ShopProductGridProps) {
  const [categoryNames, setCategoryNames] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    let cancelled = false;

    getCategories()
      .then((categories) => {
        if (cancelled) return;

        setCategoryNames(
          Object.fromEntries(
            categories.map((c) => [c.id, c.name]),
          ),
        );
      })
      .catch(() => {
        /* category names are a display-only enhancement */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const urlParams = useMemo(
    () => getUrlParams(),
    [products, category, sort],
  );

  const collectionContext =
    useMemo(
      () => getCollectionContext(),
      [products, category, sort],
    );

  const filteredProducts =
    useMemo(() => {
      let result = products.filter(
        (product) =>
          product.status === "active",
      );

      /* =====================================================
         CATEGORY
      ===================================================== */

      if (category) {
        result = result.filter(
          (product) =>
            product.categoryId ===
            category,
        );
      }

      /* =====================================================
         COLLECTION SCOPE
      ===================================================== */

      if (collectionContext.isNew) {
        result = result.filter(
          (product) =>
            product.merchandising
              ?.isNew === true,
        );
      }

      if (
        collectionContext.isBestSeller
      ) {
        result = result.filter(
          (product) =>
            product.merchandising
              ?.isBestSeller === true,
        );
      }

      /* =====================================================
         AVAILABILITY
      ===================================================== */

      if (urlParams.availability) {
        result = result.filter(
          (product) => {
            const inventoryStatus =
              getInventoryStatus(
                product,
              );

            if (
              urlParams.availability ===
              "out-of-stock"
            ) {
              return (
                inventoryStatus ===
                "out-of-stock"
              );
            }

            if (
              urlParams.availability ===
              "in-stock"
            ) {
              return (
                inventoryStatus ===
                  "in-stock" ||
                inventoryStatus ===
                  "low-stock"
              );
            }

            if (
              urlParams.availability ===
              "low"
            ) {
              return (
                inventoryStatus ===
                "low-stock"
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
                bScore - aScore
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
                bScore - aScore
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

  return (
    <div className="min-w-0">
      {/* =====================================================
          PRODUCT COUNT / REFINE
      ===================================================== */}

      <div
        className="
          mb-7
          flex
          min-h-8
          items-center
          justify-between
          gap-4
          sm:mb-8
        "
      >
        <div>
          <p
            className="
              font-body
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-[var(--color-text-muted)]
            "
          >
            Collection
          </p>

          <p
            className="
              mt-1
              font-body
              text-[11px]
              text-[var(--color-text-secondary)]
            "
          >
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1
              ? "piece"
              : "pieces"}
          </p>
        </div>

        <Link
          href={refineHref}
          className="
            inline-flex
            min-h-9
            items-center
            gap-2
            font-body
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.16em]
            text-[var(--color-text-secondary)]
            transition-colors
            duration-[var(--duration-fast)]
            hover:text-[var(--color-text)]
            lg:hidden
          "
        >
          <SlidersHorizontal
            size={13}
            strokeWidth={1.4}
          />

          Refine
        </Link>
      </div>

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {filteredProducts.length === 0 ? (
        <div
          className="
            flex
            min-h-[420px]
            flex-col
            items-center
            justify-center
            border-y
            border-[var(--color-border)]
            bg-[var(--color-bg-soft)]
            px-6
            py-16
            text-center
            sm:min-h-[500px]
            sm:px-10
          "
        >
          <span
            className="
              h-px
              w-10
              bg-[var(--color-accent)]
            "
            aria-hidden="true"
          />

          <p
            className="
              mt-6
              font-body
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.22em]
              text-[var(--color-accent)]
            "
          >
            Nothing here yet
          </p>

          <h2
            className="
              mt-3
              font-display
              text-[clamp(2.2rem,5vw,3.5rem)]
              font-medium
              leading-none
              tracking-tight
              text-[var(--color-text)]
            "
          >
            No pieces found
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-md
              font-body
              text-[11px]
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
              min-h-11
              items-center
              justify-center
              border
              border-[var(--color-text)]
              px-6
              font-body
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-[var(--color-text)]
              transition-all
              duration-[var(--duration-base)]
              hover:bg-[var(--color-text)]
              hover:text-[var(--color-text-inverse)]
              focus-visible:outline-none
              focus-visible:ring-1
              focus-visible:ring-[var(--color-text)]
              focus-visible:ring-offset-2
            "
          >
            View Collection
          </Link>
        </div>
      ) : (
        /* ===================================================
           PRODUCT GRID
        =================================================== */

        <ResilientProductGrid
          products={filteredProducts}
          categoryNames={categoryNames}
        />
      )}
    </div>
  );
}