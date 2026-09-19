"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

import type { Product } from "@/types/product";
import {
  getDiscountPercentage,
  getProductAvailability,
  getPrimaryProductMedia,
} from "@/types/product";

import { addToCart } from "@/services/cart.service";
import { useAuthStore } from "@/store/auth-store";
import { WishlistButton } from "@/components/product/wishlist-button";
import { LoginRequiredPopup } from "@/components/product/login-required-popup";
import { ProductImageCursor } from "@/components/product/product-image-cursor";

/* =========================================================
   TYPES
========================================================= */

type EditorialProductCardProps = {
  product: Product;
  priority?: boolean;
  /** Controls image aspect ratio / caption size across the hand-built layouts. */
  size?: "hero" | "large" | "medium" | "small" | "detail";
  categoryName?: string;
};

/* =========================================================
   HELPERS
========================================================= */

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

const ASPECT_BY_SIZE: Record<NonNullable<EditorialProductCardProps["size"]>, string> = {
  hero: "aspect-[3/4]",
  large: "aspect-[4/5]",
  medium: "aspect-[3/4]",
  small: "aspect-[1/1]",
  detail: "aspect-[4/5]",
};

/* =========================================================
   COMPONENT
   Visual shell only — reuses the exact same addToCart /
   auth-gating logic as the existing ProductCard so the
   engineering pass doesn't need to touch cart wiring.
========================================================= */

export function EditorialProductCard({
  product,
  priority = false,
  size = "medium",
  categoryName,
}: EditorialProductCardProps) {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  const availability = getProductAvailability(product);
  const primaryMedia = getPrimaryProductMedia(product);

  if (!primaryMedia) {
    return null;
  }

  const discount = getDiscountPercentage(product.pricing);

  const handleAddToBag = async () => {
    if (availability.isSoldOut || isAdding) return;
    if (!isInitialized) return;

    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }

    try {
      setIsAdding(true);
      await addToCart(product._id, 1);
    } catch (error) {
      console.error("ADD TO CART ERROR:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <article className="group relative w-full">
        <ProductImageCursor
          className={`relative w-full overflow-hidden ${ASPECT_BY_SIZE[size]}`}
        >
          <Link
            href={`/products/${product._id}`}
            aria-label={`View ${product.name}`}
            className="absolute inset-0 block"
          >
            <Image
              src={primaryMedia.src}
              alt={primaryMedia.alt ?? product.name}
              fill
              priority={priority}
              sizes="(max-width: 767px) 90vw, (max-width: 1279px) 45vw, 32vw"
              className="object-cover object-center transition-transform duration-500 ease-[var(--drape-ease)] group-hover:scale-[1.03]"
            />

            {/* Diagonal light-sweep hover overlay */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-tr from-transparent via-[rgba(242,233,220,0.16)] to-transparent transition-transform duration-500 ease-[var(--drape-ease)] group-hover:translate-x-full"
            />
          </Link>

          {availability.isSoldOut && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-[var(--kohl-umber)]/90 px-3 py-2 text-center">
              <span className="drape-font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--unbleached-cotton)]">
                Sold Out
              </span>
            </div>
          )}

          <div className="absolute right-2 top-2 z-10">
            <WishlistButton productId={product._id} productName={product.name} />
          </div>
        </ProductImageCursor>

        {/* =====================================================
            CAPTION STRIP — overlaps the image edge rather than
            sitting cleanly below in a card footer.
        ===================================================== */}

        <div className="relative z-10 -mt-8 ml-4 max-w-[85%] drape-panel px-4 py-3">
          <p className="drape-font-body text-[10px] uppercase tracking-[0.16em] text-[var(--aged-brass)]">
            {categoryName ?? product.categoryId.replace(/-/g, " ")}
          </p>

          <Link href={`/products/${product._id}`} className="block">
            <h3 className="drape-font-display mt-1 text-[1.05rem] leading-[1.15] tracking-[-0.01em] text-[var(--unbleached-cotton)]">
              {product.name}
            </h3>
          </Link>

          {/* Off-grid italic price typesetting */}
          <div className="mt-2 flex items-center gap-2">
            <span className="drape-price-tag text-[1.1rem] text-[var(--unbleached-cotton)]">
              {formatPrice(product.pricing.sellingPrice)}
            </span>

            {discount > 0 && (
              <span className="drape-font-body text-[10px] text-[var(--sindoor-rust)]">
                {discount}% off
              </span>
            )}
          </div>
        </div>

        {/* =====================================================
            ADD TO BAG — micro-interaction: text crossfades to a
            checkmark on success.
        ===================================================== */}

        <motion.button
          type="button"
          onClick={handleAddToBag}
          disabled={availability.isSoldOut || isAdding || !isInitialized}
          whileTap={{ scale: 0.97 }}
          className="drape-font-body mt-3 ml-4 inline-flex items-center gap-2 border-b border-[var(--aged-brass)] pb-1 text-[10px] uppercase tracking-[0.18em] text-[var(--unbleached-cotton)] transition-colors duration-300 hover:border-[var(--sindoor-rust)] hover:text-[var(--sindoor-rust)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {availability.isSoldOut
            ? "Sold Out"
            : isAdding
              ? "Adding…"
              : "Add to Bag"}
        </motion.button>
      </article>

      <LoginRequiredPopup
        open={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
      />
    </>
  );
}
