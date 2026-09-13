"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Heart,
} from "lucide-react";

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

  const handleToggle = () => {
    toggle(productId);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={
        active
          ? `Remove ${productName} from wishlist`
          : `Add ${productName} to wishlist`
      }
      aria-pressed={active}
      className={[
        `
          group
          flex
          h-10
          w-10
          items-center
          justify-center
          border
          backdrop-blur-sm
          transition-all
          duration-[var(--duration-base)]
          ease-[var(--ease-luxury)]
          focus-visible:outline-none
          focus-visible:ring-1
          focus-visible:ring-[var(--color-text)]
          focus-visible:ring-offset-2
        `,
        active
          ? `
            border-[var(--color-accent-soft)]
            bg-[rgba(247,243,238,0.94)]
            text-[var(--color-accent-dark)]
          `
          : `
            border-white/70
            bg-[rgba(255,255,255,0.88)]
            text-[var(--color-text)]
            hover:border-white
            hover:bg-[var(--color-surface)]
          `,
        className,
      ].join(" ")}
    >
      <Heart
        aria-hidden="true"
        size={17}
        strokeWidth={1.25}
        fill={
          active
            ? "currentColor"
            : "none"
        }
        className="
          transition-all
          duration-[var(--duration-base)]
          ease-[var(--ease-luxury)]
          group-hover:scale-110
        "
      />
    </button>
  );
}