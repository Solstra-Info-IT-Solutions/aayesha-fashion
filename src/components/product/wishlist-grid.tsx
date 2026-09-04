"use client";

import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import type { Product } from "@/types/product";

import { ProductCard } from "@/components/product/product-card";
import { useWishlistStore } from "@/store/wishlist-store";
import { LinkButton } from "@/components/ui/button";

type WishlistGridProps = {
  products: Product[];
};

export function WishlistGrid({ products }: WishlistGridProps) {
  const productIds = useWishlistStore((state) => state.productIds);

  const wishlistProducts = products.filter((product) =>
    productIds.includes(product.id),
  );

  if (wishlistProducts.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center py-12 text-center sm:py-16">
        <div className="mb-7 flex h-16 w-16 items-center justify-center border border-[var(--color-border-dark)] text-[var(--color-charcoal)]">
          <Heart size={24} strokeWidth={1.2} />
        </div>

        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
          Nothing saved yet
        </p>

        <h2 className="mt-3 font-display text-[2.2rem] font-bold leading-none tracking-[-0.025em] text-[var(--color-charcoal)] sm:text-[2.6rem]">
          Your wishlist is waiting.
        </h2>

        <p className="mt-4 max-w-md text-sm leading-7 text-[var(--color-text-secondary)]">
          Save pieces you love while exploring the Aayesha collection. They
          will appear here for you later.
        </p>

        <div className="mt-8">
          <LinkButton
            href="/shop"
            variant="primary"
            size="md"
            rounded="none"
            icon={<ArrowRight size={16} />}
            iconPosition="right"
          >
            Continue Shopping
          </LinkButton>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-6 border-b border-[var(--color-border)] pb-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
            Your Selection
          </p>

          <h2 className="mt-2 font-display text-[2rem] font-bold tracking-[-0.02em] text-[var(--color-charcoal)]">
            Saved Pieces
          </h2>
        </div>

        <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
          {wishlistProducts.length}{" "}
          {wishlistProducts.length === 1 ? "piece" : "pieces"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
        {wishlistProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-14 flex justify-center sm:mt-16">
        <LinkButton
          href="/shop"
          variant="darkOutline"
          size="md"
          rounded="none"
          icon={<ArrowRight size={16} />}
          iconPosition="right"
        >
          Continue Shopping
        </LinkButton>
      </div>
    </div>
  );
}