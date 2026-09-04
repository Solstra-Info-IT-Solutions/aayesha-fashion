"use client";

import { ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

import { useCartStore } from "@/store/cart-store";

type AddToCartButtonProps = {
  productId: string;
  productName: string;
  quantity?: number;
  fullWidth?: boolean;
};

export function AddToCartButton({
  productId,
  productName,
  quantity = 1,
  fullWidth = true,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(productId, quantity);

    toast.success(
      quantity > 1
        ? `${quantity} × ${productName} added to your bag`
        : `${productName} added to your bag`,
    );
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      className={[
        "inline-flex",
        "items-center",
        "justify-center",
        "gap-2.5",
        "border",
        "border-[var(--color-charcoal)]",
        "bg-[var(--color-charcoal)]",
        "px-6",
        "py-4",
        "text-[11px]",
        "font-semibold",
        "uppercase",
        "tracking-[0.14em]",
        "text-white",
        "transition-all",
        "duration-300",
        "hover:bg-[var(--color-charcoal-soft)]",
        "focus:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-[var(--color-rose)]",
        "focus-visible:ring-offset-2",
        fullWidth ? "w-full" : "w-auto",
      ].join(" ")}
    >
      <ShoppingBag
        size={16}
        strokeWidth={1.4}
      />

      Add to Bag
    </button>
  );
}