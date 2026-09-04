"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart-store";

export function CartCount() {
  const items = useCartStore(
    (state) => state.items,
  );

  const [hydrated, setHydrated] =
    useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null;
  }

  const count = items.reduce(
    (total, item) =>
      total + item.quantity,
    0,
  );

  if (count <= 0) {
    return null;
  }

  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[var(--color-rose)] px-1 text-[8px] font-bold leading-none text-[var(--color-charcoal)]">
      {count > 99 ? "99+" : count}
    </span>
  );
}