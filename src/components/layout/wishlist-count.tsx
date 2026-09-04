"use client";

import { useWishlistStore } from "@/store/wishlist-store";

export function WishlistCount() {
  const count = useWishlistStore(
    (state) => state.productIds.length,
  );

  if (count === 0) {
    return null;
  }

  return (
    <span
      aria-hidden="true"
      className="
        absolute
        right-[3px]
        top-[3px]
        flex
        h-[14px]
        min-w-[14px]
        items-center
        justify-center
        rounded-full
        bg-[var(--color-rose)]
        px-[3px]
        text-[7px]
        font-bold
        leading-none
        text-[var(--color-charcoal)]
      "
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}