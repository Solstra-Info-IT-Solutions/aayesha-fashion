import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import type { Product } from "@/types/product";
import {
  getDiscountPercentage,
  getPrimaryProductMedia,
  getProductStartingPrice,
} from "@/types/product";

import { ProductCard } from "@/components/product/product-card";

interface ResilientProductGridProps {
  products: Product[];
  /** Map of categoryId -> resolved category display name. */
  categoryNames?: Record<string, string>;
  /** Only true for the very first grid on the page (LCP image). */
  priorityFirst?: boolean;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Editorial "feature" card used for the single-item and magazine layouts.
 * Large image + copy/CTA panel instead of a small tile floating in space.
 */
function FeatureCard({
  product,
  categoryName,
  priority,
  tall,
}: {
  product: Product;
  categoryName?: string;
  priority?: boolean;
  tall?: boolean;
}) {
  const media = getPrimaryProductMedia(product);
  const discount = getDiscountPercentage(product.pricing);

  return (
    <article
      className={[
        "group relative flex flex-col overflow-hidden",
        "border border-[var(--color-border)] bg-[var(--color-bg)]",
        tall ? "h-full" : "",
      ].join(" ")}
    >
      <Link
        href={`/products/${product._id}`}
        aria-label={`View ${product.name}`}
        className={[
          "relative block w-full overflow-hidden bg-[var(--color-bg-soft)]",
          tall ? "aspect-[4/5] flex-1" : "aspect-[16/10]",
        ].join(" ")}
      >
        {media && (
          <Image
            src={media.src}
            alt={media.alt ?? product.name}
            fill
            priority={priority}
            sizes="(max-width: 1023px) 100vw, 60vw"
            className="
              object-cover object-center
              transition-transform duration-[var(--dur-slow)]
              ease-[var(--ease-luxury)]
              group-hover:scale-[1.02]
            "
          />
        )}
      </Link>

      <div className="flex flex-col gap-2 px-5 py-5 sm:px-6 sm:py-6">
        <p className="font-body text-[8px] font-semibold uppercase tracking-[0.18em] text-[var(--gold-metallic)] sm:text-[9px]">
          {categoryName ?? "Signature Edit"}
        </p>

        <Link href={`/products/${product._id}`} className="group/title">
          <h3 className="font-display text-[1.4rem] leading-[1.15] tracking-[-0.01em] text-[var(--color-text)] transition-colors duration-[var(--dur-fast)] group-hover/title:text-[var(--color-accent)] sm:text-[1.7rem]">
            {product.name}
          </h3>
        </Link>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-body text-sm font-semibold text-[var(--color-text)]">
            {formatPrice(getProductStartingPrice(product))}
          </span>

          {discount > 0 && (
            <span className="font-body text-[10px] font-semibold uppercase tracking-[0.04em] text-[var(--maroon-deep)]">
              {discount}% off
            </span>
          )}
        </div>

        <Link
          href={`/products/${product._id}`}
          className="mt-2 inline-flex w-fit items-center gap-2 font-body text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text)] transition-colors duration-[var(--dur-fast)] hover:text-[var(--gold-metallic)]"
        >
          Shop the piece
          <ArrowUpRight size={13} strokeWidth={1.4} />
        </Link>
      </div>
    </article>
  );
}

function categoryNameFor(
  product: Product,
  categoryNames?: Record<string, string>,
) {
  return categoryNames?.[product.categoryId];
}

/**
 * Grid that never leaves an orphaned half-empty row.
 * 1 -> full-width feature. 2 -> 50/50. 3 -> magazine (tall + 2 stacked).
 * 4+ -> standard responsive grid, remainder (1-3) recurses into the rules
 * above instead of rendering as a short last row.
 *
 * ponytail: remainder is computed against the 4-col desktop breakpoint
 * only (not per-breakpoint) — acceptable since the recursive layouts
 * below are themselves responsive; revisit if 2/3-col breakpoints need
 * their own remainder math.
 */
export function ResilientProductGrid({
  products,
  categoryNames,
  priorityFirst = false,
}: ResilientProductGridProps) {
  const count = products.length;

  if (count === 0) {
    return null;
  }

  if (count === 1) {
    const product = products[0];
    return (
      <FeatureCard
        product={product}
        categoryName={categoryNameFor(product, categoryNames)}
        priority={priorityFirst}
      />
    );
  }

  if (count === 2) {
    return (
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10">
        {products.map((product, index) => (
          <FeatureCard
            key={product.id}
            product={product}
            categoryName={categoryNameFor(product, categoryNames)}
            priority={priorityFirst && index === 0}
            tall
          />
        ))}
      </div>
    );
  }

  if (count === 3) {
    const [tallProduct, ...stacked] = products;
    return (
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
        <FeatureCard
          product={tallProduct}
          categoryName={categoryNameFor(tallProduct, categoryNames)}
          priority={priorityFirst}
          tall
        />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-1 lg:gap-10">
          {stacked.map((product) => (
            <FeatureCard
              key={product.id}
              product={product}
              categoryName={categoryNameFor(product, categoryNames)}
            />
          ))}
        </div>
      </div>
    );
  }

  const remainder = count % 4;
  const gridCount = remainder === 0 ? count : count - remainder;
  const gridProducts = products.slice(0, gridCount);
  const remainderProducts = products.slice(gridCount);

  return (
    <div className="flex flex-col gap-10 sm:gap-12 lg:gap-14">
      <div
        className="
          grid grid-cols-2 gap-x-3 gap-y-10
          sm:gap-x-5 sm:gap-y-12
          md:grid-cols-3 md:gap-x-6 md:gap-y-14
          xl:grid-cols-4 xl:gap-x-7 xl:gap-y-16
        "
      >
        {gridProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={priorityFirst && index === 0}
            categoryName={categoryNameFor(product, categoryNames)}
          />
        ))}
      </div>

      {remainderProducts.length > 0 && (
        <ResilientProductGrid
          products={remainderProducts}
          categoryNames={categoryNames}
        />
      )}
    </div>
  );
}
