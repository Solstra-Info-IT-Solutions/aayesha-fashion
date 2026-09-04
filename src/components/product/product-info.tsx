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
  return (
    <div>
      {/* HEADER */}
      <div className="border-b border-[var(--color-border)] pb-7">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              {product.category}
              {product.subcategory
                ? ` · ${product.subcategory}`
                : ""}
            </p>

            <h1 className="font-[var(--font-cormorant)] text-[42px] leading-[0.95] tracking-[-0.02em] text-[var(--color-charcoal)] sm:text-5xl">
              {product.name}
            </h1>

            {product.reviews && (
              <div className="mt-4 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star
                    size={13}
                    fill="currentColor"
                  />

                  <span className="text-xs font-semibold">
                    {product.reviews.averageRating.toFixed(1)}
                  </span>
                </div>

                <span className="text-xs text-[var(--color-text-muted)]">
                  {product.reviews.reviewCount} reviews
                </span>
              </div>
            )}
          </div>

          <WishlistButton
            productId={product.id}
            productName={product.name}
          />
        </div>
      </div>

      {/* PRICE */}
      <div className="border-b border-[var(--color-border)] py-6">
        <ProductPrice variant={selectedVariant} />
      </div>

      {/* SHORT DESCRIPTION */}
      {product.content.description && (
        <div className="border-b border-[var(--color-border)] py-6">
          <p className="max-w-xl text-sm leading-7 text-[var(--color-text-secondary)]">
            {product.content.description}
          </p>
        </div>
      )}

      {/* COLOR */}
      <ProductVariantSelector
        product={product}
        selectedColorId={selectedColorId}
        onColorChange={onColorChange}
      />

      {/* SIZE */}
      <ProductSizeSelector
        product={product}
        selectedColorId={selectedColorId}
        selectedSizeCode={selectedSizeCode}
        onSizeChange={onSizeChange}
        onOpenSizeGuide={() => onSizeGuideChange(true)}
      />

      {/* SIZE GUIDE */}
      <SizeGuide
        sizeChart={product.sizeChart}
        open={sizeGuideOpen}
        onOpenChange={onSizeGuideChange}
      />

      {/* PURCHASE */}
      <ProductPurchasePanel
        product={product}
        variant={selectedVariant}
        quantity={quantity}
        onQuantityChange={onQuantityChange}
      />

      {/* DELIVERY */}
      <ProductDeliveryChecker />

      {/* TRUST */}
      <div className="mt-6">
        <ProductTrustBadges />
      </div>
    </div>
  );
}