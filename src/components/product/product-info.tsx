"use client";

import { useEffect, useState } from "react";

import { WishlistButton } from "@/components/product/wishlist-button";
import { ProductPrice } from "@/components/product/product-price";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import { ProductDeliveryChecker } from "@/components/product/product-delivery-checker";
import { ProductTrustBadges } from "@/components/product/product-trust-badges";

import { getCategories } from "@/services/category.service";

import type { Product } from "@/types/product";

interface ProductInfoProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export function ProductInfo({
  product,
  quantity,
  onQuantityChange,
}: ProductInfoProps) {
  const [categoryLabel, setCategoryLabel] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCategory() {
      try {
        const categories = await getCategories();

        const category = categories.find(
          (item) => item.id === product.categoryId,
        );

        if (!cancelled) {
          setCategoryLabel(category?.name ?? "");
        }
      } catch (error) {
        console.error("Failed to load product category:", error);

        if (!cancelled) {
          setCategoryLabel("");
        }
      }
    }

    if (product.categoryId) {
      loadCategory();
    } else {
      setCategoryLabel("");
    }

    return () => {
      cancelled = true;
    };
  }, [product.categoryId]);

  return (
    <div
      className="
        w-full
        max-w-[620px]
        lg:ml-auto
      "
    >
      {/* =====================================================
          PRODUCT HEADER
      ===================================================== */}

      <div
        className="
          border-b
          border-[var(--color-border)]
          pb-7
          sm:pb-8
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-5
          "
        >
          <div className="min-w-0">
            {/* CATEGORY */}

            {categoryLabel && (
              <p
                className="
                  eyebrow
                  mb-3
                  text-[var(--color-text-muted)]
                "
              >
                {categoryLabel}
              </p>
            )}

            {/* PRODUCT NAME */}

            <h1
              className="
                max-w-[560px]
                font-display
                text-[clamp(2.75rem,5vw,4.5rem)]
                font-medium
                leading-[0.88]
                tracking-[-0.035em]
                text-[var(--color-text)]
              "
            >
              {product.name}
            </h1>
          </div>

          {/* WISHLIST */}

          <div className="shrink-0">
            <WishlistButton
              productId={product.id}
              productName={product.name}
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          PRICE
      ===================================================== */}

      <div
        className="
          border-b
          border-[var(--color-border)]
          py-6
          sm:py-7
        "
      >
        <ProductPrice product={product} />

        <p
          className="
            mt-2
            font-body
            text-[9px]
            uppercase
            tracking-[0.14em]
            text-[var(--color-text-muted)]
          "
        >
          Inclusive of applicable taxes
        </p>
      </div>

      {/* =====================================================
          SHORT DESCRIPTION
      ===================================================== */}

      {product.content.description && (
        <div
          className="
            border-b
            border-[var(--color-border)]
            py-6
          "
        >
          <div
            className="
              max-w-xl
              font-body
              text-[13px]
              leading-7
              text-[var(--color-text-secondary)]
              sm:text-sm
            "
          >
            {product.content.description}
          </div>
        </div>
      )}

      {/* =====================================================
          PURCHASE
      ===================================================== */}

      <div
        className="
          border-b
          border-[var(--color-border)]
          py-7
          sm:py-8
        "
      >
        <ProductPurchasePanel
          product={product}
          quantity={quantity}
          onQuantityChange={onQuantityChange}
        />
      </div>

      {/* =====================================================
          DELIVERY
      ===================================================== */}

      <div
        className="
          border-b
          border-[var(--color-border)]
          py-6
        "
      >
        <ProductDeliveryChecker />
      </div>

      {/* =====================================================
          TRUST
      ===================================================== */}

      <div className="pt-6">
        <ProductTrustBadges />
      </div>
    </div>
  );
}