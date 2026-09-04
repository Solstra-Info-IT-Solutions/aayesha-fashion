import Image from "next/image";
import { LinkButton } from "@/components/ui/button";
import Link from "next/link";

import { Heart } from "lucide-react";

import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

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

export function ProductCard({
  product,
  priority = false,
}: ProductCardProps) {
  return (
    <article className="group w-full">
      {/* ================= PRODUCT IMAGE ================= */}

      <div className="relative overflow-hidden bg-[var(--color-warm-gray)]">
        <Link
          href={`/products/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="relative block aspect-[3/4] overflow-hidden"
        >
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            priority={priority}
            sizes="(max-width: 767px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />

          {/* VERY SUBTLE IMAGE OVERLAY */}
          <div className="absolute inset-0 bg-black/[0.015] transition-colors duration-500 group-hover:bg-black/[0.05]" />
        </Link>

        {/* BADGE */}

        {product.badge && (
          <div className="absolute left-4 top-4 sm:left-5 sm:top-5">
            <span className="bg-[var(--color-ivory)] px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.18em] text-[var(--color-charcoal)]">
              {product.badge}
            </span>
          </div>
        )}

        {/* WISHLIST */}

        <button
          type="button"
          aria-label={`Add ${product.name} to wishlist`}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center bg-black/15 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:bg-[var(--color-ivory)] hover:text-[var(--color-charcoal)] sm:right-5 sm:top-5"
        >
          <Heart size={17} strokeWidth={1.3} />
        </button>
      </div>

      {/* ================= PRODUCT INFORMATION ================= */}

      <div className="pt-3 sm:pt-4">
        {/* PRODUCT CATEGORY */}

        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
          {formatCategory(product.category)}
        </p>

        {/* PRODUCT NAME + PRICE */}

        <div className="mt-1.5 flex items-start justify-between gap-4">
          <Link
            href={`/products/${product.slug}`}
            className="min-w-0"
          >
            <h3 className="font-display text-[1.65rem] font-bold leading-[1] tracking-[-0.025em] text-[var(--color-charcoal)] transition-colors duration-300 group-hover:text-[var(--color-rose-dark)] sm:text-[1.8rem] lg:text-[1.95rem]">
              {product.name}
            </h3>
          </Link>

          <p className="shrink-0 pt-0.5 text-sm font-semibold tracking-[-0.01em] text-[var(--color-charcoal)]">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </article>
  );
}