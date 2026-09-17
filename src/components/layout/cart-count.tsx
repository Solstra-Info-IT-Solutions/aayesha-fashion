"use client";

import { useEffect, useState } from "react";
import { getCart } from "@/services/cart.service";

export function CartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadCartCount = async () => {
      try {
        const cart = await getCart();

        if (cancelled) {
          return;
        }

        const totalItems = cart.items.reduce(
          (total, item) => total + item.quantity,
          0,
        );

        setCount(totalItems);
      } catch (error) {
        /*
         * 401 means the customer is not logged in.
         * In that case the cart count remains 0.
         */
        if (!cancelled) {
          setCount(0);
        }

        console.error("CART COUNT ERROR:", error);
      }
    };

    void loadCartCount();

    return () => {
      cancelled = true;
    };
  }, []);

  if (count <= 0) {
    return null;
  }

  return (
    <span
      className="
        absolute
        -right-2
        -top-2
        flex
        h-4
        min-w-4
        items-center
        justify-center
        rounded-full
        bg-[var(--color-text)]
        px-1
        font-body
        text-[8px]
        font-semibold
        leading-none
        text-[var(--color-text-inverse)]
      "
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}