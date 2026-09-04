"use client";

import Link from "next/link";

import {
  Heart,
  Search,
  ShoppingBag,
  UserRound,
} from "lucide-react";

interface HeaderActionsProps {
  onSearchClick?: () => void;
}

const actionClassName =
  "group relative flex h-10 w-10 items-center justify-center transition-colors duration-300 hover:text-[var(--color-rose-dark)]";

const iconClassName =
  "transition-transform duration-300 group-hover:scale-110";

export function HeaderActions({
  onSearchClick,
}: HeaderActionsProps) {
  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={onSearchClick}
        className={actionClassName}
        aria-label="Search products"
      >
        <Search
          size={19}
          strokeWidth={1.7}
          className={iconClassName}
        />
      </button>

      <Link
        href="/account"
        className={`${actionClassName} hidden sm:flex`}
        aria-label="My account"
      >
        <UserRound
          size={19}
          strokeWidth={1.7}
          className={iconClassName}
        />
      </Link>

      <Link
        href="/wishlist"
        className={`${actionClassName} hidden sm:flex`}
        aria-label="Wishlist"
      >
        <Heart
          size={19}
          strokeWidth={1.7}
          className={iconClassName}
        />
      </Link>

      <Link
        href="/cart"
        className={actionClassName}
        aria-label="Shopping bag"
      >
        <ShoppingBag
          size={19}
          strokeWidth={1.7}
          className={iconClassName}
        />

        <span className="absolute right-0 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[var(--color-rose)] px-1 text-[9px] font-bold text-[var(--color-charcoal)]">
          0
        </span>
      </Link>
    </div>
  );
}