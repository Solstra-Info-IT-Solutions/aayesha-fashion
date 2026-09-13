"use client";

import { Star } from "lucide-react";

import type {
  Product,
  ProductVariant,
} from "@/types/product";

import { ProductPrice } from "@/components/product/product-price";
import { ProductVariantSelector } from "@/components/product/product-variant-selector";
import { ProductSizeSelector } from "@/components/product/product-size-selector";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import { ProductDeliveryChecker } from "@/components/product/product-delivery-checker";
import { ProductTrustBadges } from "@/components/product/product-trust-badges";
import { WishlistButton } from "@/components/product/wishlist-button";
import { SizeGuide } from "@/components/product/size-guide";

interface ProductInfoProps {
  product: Product;
  selectedColorId: string;
  selectedSizeCode: string;
  selectedVariant: ProductVariant | null;
  quantity: number;
  sizeGuideOpen: boolean;
  onColorChange: (colorId: string) => void;
  onSizeChange: (sizeCode: string) => void;
  onQuantityChange: (quantity: number) => void;
  onSizeGuideChange: (open: boolean) => void;
}

export function ProductInfo({
  product,
  selectedColorId,
  selectedSizeCode,
  selectedVariant,
  quantity,
  sizeGuideOpen,
  onColorChange,
  onSizeChange,
  onQuantityChange,
  onSizeGuideChange,
}: ProductInfoProps) {
  const categoryLabel = [
    product.category,
    product.subcategory,
  ]
    .filter(Boolean)
    .join(" · ")
    .replace(/-/g, " ");

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

            <p
              className="
                eyebrow
                mb-3
                text-[var(--color-text-muted)]
              "
            >
              {categoryLabel}
            </p>

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

            {/* RATING */}

            {product.reviews && (
              <div
                className="
                  mt-5
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                    border
                    border-[var(--color-border-light)]
                    px-2.5
                    py-1.5
                  "
                >
                  <Star
                    size={12}
                    strokeWidth={1.25}
                    fill="currentColor"
                    className="text-[var(--color-accent-dark)]"
                  />

                  <span
                    className="
                      font-body
                      text-[10px]
                      font-semibold
                      tracking-[0.02em]
                      text-[var(--color-text)]
                    "
                  >
                    {product.reviews.averageRating.toFixed(
                      1,
                    )}
                  </span>
                </div>

                <span
                  className="
                    font-body
                    text-[10px]
                    text-[var(--color-text-muted)]
                  "
                >
                  {product.reviews.reviewCount}{" "}
                  reviews
                </span>
              </div>
            )}
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
        <ProductPrice
          variant={selectedVariant}
        />

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
          <p
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
          </p>
        </div>
      )}

      {/* =====================================================
          VARIANTS
      ===================================================== */}

      <div
        className="
          border-b
          border-[var(--color-border)]
          py-6
        "
      >
        <ProductVariantSelector
          product={product}
          selectedColorId={
            selectedColorId
          }
          onColorChange={
            onColorChange
          }
        />
      </div>

      {/* =====================================================
          SIZE
      ===================================================== */}

      <div
        className="
          border-b
          border-[var(--color-border)]
          py-6
        "
      >
        <ProductSizeSelector
          product={product}
          selectedColorId={
            selectedColorId
          }
          selectedSizeCode={
            selectedSizeCode
          }
          onSizeChange={
            onSizeChange
          }
          onOpenSizeGuide={() =>
            onSizeGuideChange(true)
          }
        />
      </div>

      {/* =====================================================
          SIZE GUIDE
      ===================================================== */}

      <SizeGuide
        sizeChart={product.sizeChart}
        open={sizeGuideOpen}
        onOpenChange={
          onSizeGuideChange
        }
      />

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
          variant={selectedVariant}
          quantity={quantity}
          onQuantityChange={
            onQuantityChange
          }
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