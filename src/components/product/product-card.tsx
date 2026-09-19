"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";

import type { Product } from "@/types/product";

import { WishlistButton } from "@/components/product/wishlist-button";
import { LoginRequiredPopup } from "@/components/product/login-required-popup";

import {
  getDiscountPercentage,
  getProductAvailability,
  getPrimaryProductMedia,
} from "@/types/product";

import { addToCart } from "@/services/cart.service";

import { useAuthStore } from "@/store/auth-store";

/* =========================================================
   TYPES
========================================================= */

type ProductCardProps = {
  product: Product;
  priority?: boolean;
  /**
   * Resolved category display name (e.g. "Sarees"), looked up from
   * getCategories() by the parent grid. Falls back to a formatted
   * version of the raw categoryId slug when not provided, so this
   * stays backwards compatible with any existing call sites.
   */
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

function formatCategory(category: string) {
  return category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatBadge(badge: string) {
  return badge
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/* =========================================================
   COMPONENT
========================================================= */

export function ProductCard({
  product,
  priority = false,
  categoryName,
}: ProductCardProps) {
  const [showLoginPopup, setShowLoginPopup] =
    useState(false);

  const [isAdding, setIsAdding] = useState(false);

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const isInitialized = useAuthStore(
    (state) => state.isInitialized,
  );

  const availability = getProductAvailability(product);

  /* =======================================================
     PRODUCT MEDIA
  ======================================================= */

  const primaryMedia = getPrimaryProductMedia(product);

  const secondaryMedia = product.media.find(
    (media) =>
      media.type === "image" &&
      media.id !== primaryMedia?.id,
  );

  if (!primaryMedia) {
    return null;
  }

  /* =======================================================
     PRICING
  ======================================================= */

  const discount = getDiscountPercentage(
    product.pricing,
  );

  /* =======================================================
     BADGE
  ======================================================= */

  const hasBadge =
    product.merchandising.badges.length > 0;

  /* =======================================================
     ADD TO BAG
  ======================================================= */

  const handleAddToBag = async () => {
    if (availability.isSoldOut || isAdding) {
      return;
    }

    /*
     * Do not make an authentication decision before
     * the auth store has finished initializing.
     */
    if (!isInitialized) {
      return;
    }

    /*
     * Login is required before adding to cart.
     */
    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }

    try {
      setIsAdding(true);

      await addToCart(product._id, 1);
    } catch (error) {
      console.error(
        "ADD TO CART ERROR:",
        error,
      );
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <article
        className="
          group
          w-full
          overflow-hidden
          border
          border-[var(--color-border)]
          bg-[var(--color-bg)]
          transition-all
          duration-[var(--duration-base)]
          hover:border-[var(--color-accent)]
        "
      >
        {/* =====================================================
            IMAGE
        ===================================================== */}

        <div
          className="
            relative
            mx-2
            mt-2
            overflow-hidden
            bg-[var(--color-bg-soft)]
          "
        >
          <Link
            href={`/products/${product._id}`}
            aria-label={`View ${product.name}`}
            className="
              relative
              block
              aspect-[4/5]
              overflow-hidden
            "
          >
            {/* PRIMARY IMAGE */}

            <Image
              src={primaryMedia.src}
              alt={
                primaryMedia.alt ??
                product.name
              }
              fill
              priority={priority}
              sizes="
                (max-width: 639px) 42vw,
                (max-width: 767px) 42vw,
                (max-width: 1023px) 29vw,
                (max-width: 1279px) 23vw,
                21vw
              "
              className="
                object-cover
                object-center
                transition-transform
                duration-[var(--dur-fast)]
                ease-[var(--ease-luxury)]
                group-hover:scale-[1.025]
              "
            />

            {/* SECONDARY IMAGE */}

            {secondaryMedia && (
              <Image
                src={secondaryMedia.src}
                alt={
                  secondaryMedia.alt ??
                  product.name
                }
                fill
                sizes="
                  (max-width: 639px) 42vw,
                  (max-width: 767px) 42vw,
                  (max-width: 1023px) 29vw,
                  (max-width: 1279px) 23vw,
                  21vw
                "
                className="
                  pointer-events-none
                  object-cover
                  object-center
                  opacity-0
                  transition-all
                  duration-[var(--dur-fast)]
                  ease-[var(--ease-luxury)]
                  group-hover:scale-[1.025]
                  group-hover:opacity-100
                "
              />
            )}

            {/* IMAGE VEIL */}

            <span
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                bg-transparent
                transition-colors
                duration-[var(--duration-slow)]
                group-hover:bg-[rgba(33,31,29,0.02)]
              "
            />
          </Link>

          {/* ===================================================
              BADGE
          =================================================== */}

          {hasBadge && (
            <div
              className="
                pointer-events-none
                absolute
                left-2
                top-2
                z-10
                sm:left-3
                sm:top-3
              "
            >
              <span
                className="
                  inline-flex
                  items-center
                  border
                  border-[var(--color-border-light)]
                  bg-[rgba(255,255,255,0.95)]
                  px-2.5
                  py-1.5
                  font-body
                  text-[7px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-[var(--color-text)]
                  shadow-[var(--shadow-xs)]
                  backdrop-blur-sm
                  sm:text-[8px]
                "
              >
                {formatBadge(
                  product.merchandising
                    .badges[0],
                )}
              </span>
            </div>
          )}

          {/* ===================================================
              WISHLIST
          =================================================== */}

          <div
            className="
              absolute
              right-2
              top-2
              z-10
              sm:right-3
              sm:top-3
            "
          >
            <WishlistButton
              productId={product._id}
              productName={product.name}
            />
          </div>

          {/* ===================================================
              SOLD OUT
          =================================================== */}

          {availability.isSoldOut && (
            <div
              className="
                absolute
                inset-x-0
                bottom-0
                z-10
                border-t
                border-white/10
                bg-[rgba(33,31,29,0.92)]
                px-3
                py-2
                text-center
                backdrop-blur-sm
              "
            >
              <span
                className="
                  font-body
                  text-[7px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-[var(--color-text-inverse)]
                  sm:text-[8px]
                "
              >
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* =====================================================
            PRODUCT INFORMATION
        ===================================================== */}

        <div
          className="
            px-3
            pb-3
            pt-3
            sm:px-4
            sm:pb-4
            sm:pt-4
          "
        >
          {/* CATEGORY */}

          <p
            className="
              font-body
              text-[7px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-[var(--gold-metallic)]
              sm:text-[8px]
            "
          >
            {categoryName ??
              formatCategory(
                product.categoryId,
              )}
          </p>

          {/* PRODUCT NAME */}

          <Link
            href={`/products/${product._id}`}
            className="group/title block"
          >
            <h3
              className="
                mt-1.5
                line-clamp-2
                min-h-[34px]
                font-display
                text-[14px]
                font-medium
                leading-[1.2]
                tracking-[-0.01em]
                text-[var(--color-text)]
                transition-colors
                duration-[var(--duration-base)]
                group-hover/title:text-[var(--color-accent)]
                sm:text-[15px]
              "
            >
              {product.name}
            </h3>
          </Link>

          {/* ===================================================
              PRICE
          =================================================== */}

          <div
            className="
              mt-2
              flex
              flex-wrap
              items-center
              gap-x-2
              gap-y-1
            "
          >
            <span
              className="
                font-body
                text-[12px]
                font-semibold
                text-[var(--color-text)]
                sm:text-[13px]
              "
            >
              {formatPrice(
                product.pricing.sellingPrice,
              )}
            </span>

            {discount > 0 && (
              <>
                <span
                  className="
                    font-body
                    text-[9px]
                    font-medium
                    text-[var(--color-text-muted)]
                    line-through
                    sm:text-[10px]
                  "
                >
                  {formatPrice(
                    product.pricing.mrp,
                  )}
                </span>

                <span
                  className="
                    font-body
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.04em]
                    text-[var(--color-accent-dark)]
                    sm:text-[9px]
                  "
                >
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* ===================================================
              AVAILABILITY
          =================================================== */}

          {!availability.isSoldOut && (
            <div
              className="
                mt-2
                flex
                items-center
                gap-1.5
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[var(--color-accent)]
                "
              />

              <span
                className="
                  font-body
                  text-[8px]
                  font-medium
                  text-[var(--color-text-secondary)]
                "
              >
                {availability.isLowStock
                  ? "Only a few left"
                  : "In Stock"}
              </span>
            </div>
          )}

          {/* ===================================================
              ADD TO BAG
          =================================================== */}

          <button
            type="button"
            onClick={handleAddToBag}
            disabled={
              availability.isSoldOut ||
              isAdding ||
              !isInitialized
            }
            className="
              mt-3
              flex
              w-full
              items-center
              justify-center
              gap-2
              border
              border-[var(--color-text)]
              bg-[var(--color-text)]
              px-3
              py-2.5
              font-body
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-[var(--color-text-inverse)]
              transition-all
              duration-[var(--duration-base)]
              hover:border-[var(--color-accent)]
              hover:bg-[var(--color-accent)]
              disabled:cursor-not-allowed
              disabled:border-[var(--color-border)]
              disabled:bg-[var(--color-bg-soft)]
              disabled:text-[var(--color-text-muted)]
              sm:py-3
              sm:text-[9px]
            "
          >
            <ShoppingBag
              size={13}
              strokeWidth={1.5}
            />

            {availability.isSoldOut
              ? "Sold Out"
              : isAdding
                ? "Adding..."
                : "Add to Bag"}
          </button>
        </div>
      </article>

      {/* =====================================================
          LOGIN REQUIRED POPUP
      ===================================================== */}

      <LoginRequiredPopup
        open={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
      />
    </>
  );
}