"use client";

import Link from "next/link";
import {
  Heart,
  Search,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import { WishlistCount } from "./wishlist-count";
import { CartCount } from "./cart-count";

export function HeaderActions() {
  return (
    <div className="flex items-center gap-0.5">
      {/* SEARCH */}

      <Link
        href="/search"
        aria-label="Search"
        className="
          relative
          flex
          h-10
          w-10
          items-center
          justify-center
          text-[var(--color-charcoal)]
          transition-colors
          duration-300
          hover:text-[var(--color-rose-dark)]
        "
      >
        <Search
          size={18}
          strokeWidth={1.3}
        />
      </Link>

      {/* ACCOUNT */}

      <Link
        href="/account"
        aria-label="Account"
        className="
          relative
          hidden
          h-10
          w-10
          items-center
          justify-center
          text-[var(--color-charcoal)]
          transition-colors
          duration-300
          hover:text-[var(--color-rose-dark)]
          sm:flex
        "
      >
        <UserRound
          size={18}
          strokeWidth={1.3}
        />
      </Link>

      {/* WISHLIST */}

      <Link
        href="/wishlist"
        aria-label="Wishlist"
        className="
          relative
          flex
          h-10
          w-10
          items-center
          justify-center
          text-[var(--color-charcoal)]
          transition-colors
          duration-300
          hover:text-[var(--color-rose-dark)]
        "
      >
        <Heart
          size={18}
          strokeWidth={1.3}
        />

        <WishlistCount />
      </Link>

      {/* CART */}

      <Link
        href="/cart"
        aria-label="Shopping bag"
        className="
          relative
          flex
          h-10
          w-10
          items-center
          justify-center
          text-[var(--color-charcoal)]
          transition-colors
          duration-300
          hover:text-[var(--color-rose-dark)]
        "
      >
        <ShoppingBag
          size={18}
          strokeWidth={1.3}
        />

        <CartCount />
      </Link>
    </div>
  );
}