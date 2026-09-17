import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/types/product";

import { WishlistButton } from "@/components/product/wishlist-button";
import { ProductQuickAdd } from "@/components/product/product-quick-add";

import {
  getDiscountPercentage,
  getProductAvailability,
  getPrimaryProductMedia,
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
}: ProductCardProps) {
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

  const discount = getDiscountPercentage(product.pricing);

  /* =======================================================
     BADGE
  ======================================================= */

  const hasBadge = product.merchandising.badges.length > 0;

  return (
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
          href={`/products/${product.slug}`}
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
            alt={primaryMedia.alt ?? product.name}
            fill
            priority={priority}
            sizes="
              (max-width: 639px) 44vw,
              (max-width: 767px) 44vw,
              (max-width: 1023px) 30vw,
              (max-width: 1279px) 24vw,
              22vw
            "
            className="
              object-cover
              object-center
              transition-transform
              duration-[var(--duration-luxury)]
              ease-[var(--ease-luxury)]
              group-hover:scale-[1.02]
            "
          />

          {/* SECONDARY IMAGE */}

          {secondaryMedia && (
            <Image
              src={secondaryMedia.src}
              alt={secondaryMedia.alt ?? product.name}
              fill
              sizes="
                (max-width: 639px) 44vw,
                (max-width: 767px) 44vw,
                (max-width: 1023px) 30vw,
                (max-width: 1279px) 24vw,
                22vw
              "
              className="
                pointer-events-none
                object-cover
                object-center
                opacity-0
                transition-all
                duration-[var(--duration-luxury)]
                ease-[var(--ease-luxury)]
                group-hover:scale-[1.02]
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
                bg-[rgba(255,255,255,0.94)]
                px-2
                py-1
                font-body
                text-[7px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-[var(--color-text)]
                shadow-[var(--shadow-xs)]
                backdrop-blur-sm
                sm:px-2.5
                sm:py-1.5
                sm:text-[8px]
              "
            >
              {formatBadge(product.merchandising.badges[0])}
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
            font-medium
            uppercase
            tracking-[0.16em]
            text-[var(--color-text-muted)]
            sm:text-[8px]
          "
        >
          {formatCategory(product.categoryId)}
        </p>

        {/* PRODUCT NAME */}

        <Link
          href={`/products/${product.slug}`}
          className="group/title mt-1.5 block"
        >
          <h3
            className="
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
              tracking-[-0.01em]
              text-[var(--color-text)]
              sm:text-[13px]
            "
          >
            {formatPrice(product.pricing.sellingPrice)}
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
                {formatPrice(product.pricing.mrp)}
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
            QUICK ADD
        =================================================== */}

        {!availability.isSoldOut && (
          <div className="mt-3">
            <ProductQuickAdd product={product} />
          </div>
        )}
      </div>
    </article>
  );
}