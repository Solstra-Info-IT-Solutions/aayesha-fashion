import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/types/product";

import { WishlistButton } from "@/components/product/wishlist-button";
import { ProductQuickAdd } from "@/components/product/product-quick-add";

import {
  getDiscountPercentage,
  getProductAvailability,
} from "@/types/product";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
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
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function formatBadge(badge: string) {
  return badge
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

/* =========================================================
   COMPONENT
========================================================= */

export function ProductCard({
  product,
  priority = false,
}: ProductCardProps) {
  const availability =
    getProductAvailability(product);

  const primaryVariant =
    product.variants.find(
      (variant) =>
        variant.status === "active",
    );

  if (!primaryVariant) {
    return null;
  }

  const primaryMedia =
    product.media.find(
      (media) =>
        media.isPrimary &&
        media.type === "image",
    ) ??
    product.media.find(
      (media) =>
        media.type === "image",
    );

  if (!primaryMedia) {
    return null;
  }

  const secondaryMedia =
    product.media.find(
      (media) =>
        media.type === "image" &&
        media.id !== primaryMedia.id,
    );

  const discount =
    getDiscountPercentage(
      primaryVariant.pricing,
    );

  const hasBadge =
    product.merchandising.badges.length > 0;

  return (
    <article
      className="
        group
        w-full
      "
    >
      {/* =====================================================
          PRODUCT IMAGE
      ===================================================== */}

      <div
        className="
          relative
          overflow-hidden
          bg-[var(--color-bg-soft)]
        "
      >
        <Link
          href={`/products/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="
            relative
            block
            aspect-[3/4]
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
              (max-width: 639px) 78vw,
              (max-width: 767px) 50vw,
              (max-width: 1023px) 43vw,
              (max-width: 1279px) 29vw,
              27vw
            "
            className="
              object-cover
              object-center
              transition-transform
              duration-[var(--duration-luxury)]
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
                (max-width: 639px) 78vw,
                (max-width: 767px) 50vw,
                (max-width: 1023px) 43vw,
                (max-width: 1279px) 29vw,
                27vw
              "
              className="
                pointer-events-none
                object-cover
                object-center
                opacity-0
                transition-all
                duration-[var(--duration-luxury)]
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
              group-hover:bg-[rgba(33,31,29,0.025)]
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
              left-3
              top-3
              z-10
              sm:left-4
              sm:top-4
            "
          >
            <span
              className="
                inline-flex
                items-center
                border
                border-[var(--color-border-light)]
                bg-[rgba(255,255,255,0.94)]
                px-3
                py-2
                font-body
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[var(--color-text)]
                shadow-[var(--shadow-xs)]
                backdrop-blur-sm
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
            right-3
            top-3
            z-10
            sm:right-4
            sm:top-4
          "
        >
          <WishlistButton
            productId={product.id}
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
              bg-[rgba(33,31,29,0.94)]
              px-4
              py-3
              text-center
              backdrop-blur-sm
            "
          >
            <span
              className="
                font-body
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.22em]
                text-[var(--color-text-inverse)]
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
          pt-4
          sm:pt-5
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >
          {/* =================================================
              PRODUCT NAME
          ================================================= */}

          <div className="min-w-0">
            <p
              className="
                font-body
                text-[8px]
                font-medium
                uppercase
                tracking-[0.2em]
                text-[var(--color-text-muted)]
                sm:text-[9px]
              "
            >
              {formatCategory(
                product.category,
              )}
            </p>

            <Link
              href={`/products/${product.slug}`}
              className="group/title mt-2 block"
            >
              <h3
                className="
                  font-display
                  text-[22px]
                  font-medium
                  leading-[1]
                  tracking-[-0.02em]
                  text-[var(--color-text)]
                  transition-colors
                  duration-[var(--duration-base)]
                  group-hover/title:text-[var(--color-accent)]
                  sm:text-[24px]
                "
              >
                {product.name}
              </h3>
            </Link>
          </div>

          {/* =================================================
              PRICE
          ================================================= */}

          <div
            className="
              shrink-0
              pt-0.5
              text-right
            "
          >
            <p
              className="
                font-body
                text-[12px]
                font-semibold
                tracking-[-0.01em]
                text-[var(--color-text)]
                sm:text-[13px]
              "
            >
              {formatPrice(
                primaryVariant
                  .pricing
                  .sellingPrice,
              )}
            </p>

            {discount > 0 && (
              <div
                className="
                  mt-1
                  flex
                  items-center
                  justify-end
                  gap-1.5
                "
              >
                <span
                  className="
                    font-body
                    text-[8px]
                    font-medium
                    text-[var(--color-text-muted)]
                    line-through
                    sm:text-[9px]
                  "
                >
                  {formatPrice(
                    primaryVariant
                      .pricing
                      .mrp,
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
              </div>
            )}
          </div>
        </div>

        {/* =================================================
            QUICK ADD
        ================================================= */}

        {!availability.isSoldOut && (
          <div
            className="
              mt-4
              transition-transform
              duration-[var(--duration-base)]
              ease-[var(--ease-luxury)]
              sm:mt-5
            "
          >
            <ProductQuickAdd
              product={product}
            />
          </div>
        )}
      </div>
    </article>
  );
}