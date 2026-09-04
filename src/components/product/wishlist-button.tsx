"use client";

import {
  useEffect,
  useState,
} from "react";

import { Heart } from "lucide-react";

import { useWishlistStore } from "@/store/wishlist-store";

interface WishlistButtonProps {
  productId: string;
  productName?: string;
  className?: string;
}

export function WishlistButton({
  productId,
  productName = "Product",
  className = "",
}: WishlistButtonProps) {
  const isInWishlist =
    useWishlistStore(
      (state) =>
        state.productIds.includes(
          productId,
        ),
    );

  const toggle =
    useWishlistStore(
      (state) => state.toggle,
    );

  const [hydrated, setHydrated] =
    useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const active =
    hydrated && isInWishlist;

  return (
    <button
      type="button"
      onClick={() =>
        toggle(productId)
      }
      aria-label={
        active
          ? `Remove ${productName} from wishlist`
          : `Add ${productName} to wishlist`
      }
      aria-pressed={active}
      className={[
        "flex h-11 w-11 items-center justify-center border transition",
        active
          ? "border-[var(--color-rose)] bg-[var(--color-rose-light)] text-[var(--color-rose-dark)]"
          : "border-[var(--color-border)] bg-[var(--color-ivory)] text-[var(--color-charcoal)] hover:border-[var(--color-charcoal)]",
        className,
      ].join(" ")}
    >
      <Heart
        size={18}
        strokeWidth={1.5}
        fill={
          active
            ? "currentColor"
            : "none"
        }
      />
    </button>
  );
}