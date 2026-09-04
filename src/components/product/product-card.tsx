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

function formatPrice(price: number) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    },
  ).format(price);
}

function formatCategory(
  category: string,
) {
  return category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function formatBadge(
  badge: string,
) {
  return badge
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

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

  const discount =
    getDiscountPercentage(
      primaryVariant.pricing,
    );

  return (
    <article className="group w-full">
      {/* =====================================================
          IMAGE
      ===================================================== */}

      <div className="relative overflow-hidden bg-[var(--color-warm-gray)]">
        <Link
          href={`/products/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="relative block aspect-[3/4] overflow-hidden"
        >
          <Image
            src={primaryMedia.src}
            alt={
              primaryMedia.alt ??
              product.name
            }
            fill
            priority={priority}
            sizes="(max-width: 767px) 50vw, (max-width: 1023px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          />

          <div className="absolute inset-0 bg-black/[0.015] transition-colors duration-500 group-hover:bg-black/[0.055]" />
        </Link>

        {/* BADGE */}

        {product.merchandising.badges
          .length > 0 && (
          <div className="absolute left-4 top-4 bg-[var(--color-ivory)] px-3 py-2.5 sm:left-5 sm:top-5">
            <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[var(--color-charcoal)]">
              {formatBadge(
                product.merchandising
                  .badges[0],
              )}
            </span>
          </div>
        )}

        {/* WISHLIST */}

        <div className="absolute right-4 top-4 sm:right-5 sm:top-5">
          <WishlistButton
            productId={product.id}
            productName={product.name}
          />
        </div>

        {/* SOLD OUT */}

        {availability.isSoldOut && (
          <div className="absolute inset-x-0 bottom-0 bg-[var(--color-charcoal)] px-4 py-3 text-center">
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* =====================================================
          PRODUCT INFORMATION
      ===================================================== */}

      <div className="pt-5">
        <div className="flex items-start justify-between gap-5">
          {/* NAME */}

          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[var(--color-text-secondary)]">
              {formatCategory(
                product.category,
              )}
            </p>

            <Link
              href={`/products/${product.slug}`}
              className="mt-2 block"
            >
              <h3 className="font-display text-[1.5rem] font-bold leading-[1.04] tracking-[-0.02em] text-[var(--color-charcoal)] transition-colors duration-300 group-hover:text-[var(--color-rose-dark)] sm:text-[1.65rem]">
                {product.name}
              </h3>
            </Link>
          </div>

          {/* PRICE */}

          <div className="shrink-0 text-right">
            <p className="text-[13px] font-semibold text-[var(--color-charcoal)] sm:text-sm">
              {formatPrice(
                primaryVariant
                  .pricing
                  .sellingPrice,
              )}
            </p>

            {discount > 0 && (
              <div className="mt-1 flex items-center justify-end gap-1.5">
                <span className="text-[9px] font-medium text-[var(--color-text-muted)] line-through">
                  {formatPrice(
                    primaryVariant
                      .pricing
                      .mrp,
                  )}
                </span>

                <span className="text-[9px] font-semibold text-[var(--color-rose-dark)]">
                  {discount}% OFF
                </span>
              </div>
            )}
          </div>
        </div>

        {/* QUICK ADD */}

        {!availability.isSoldOut && (
          <ProductQuickAdd
            product={product}
          />
        )}
      </div>
    </article>
  );
}