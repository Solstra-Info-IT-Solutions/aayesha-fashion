"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { ShoppingBag } from "lucide-react";

import toast from "react-hot-toast";

import { addToCart } from "@/services/cart.service";

import { useAuthStore } from "@/store/auth-store";

import { LoginRequiredPopup } from "@/components/product/login-required-popup";

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
  const router = useRouter();

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const isInitialized = useAuthStore(
    (state) => state.isInitialized,
  );

  const [adding, setAdding] =
    useState(false);

  const [showLoginPopup, setShowLoginPopup] =
    useState(false);

  const handleAddToCart = async () => {
    if (adding) {
      return;
    }

    /*
     * Wait until auth state is initialized.
     */
    if (!isInitialized) {
      return;
    }

    /*
     * Login is required for backend cart.
     */
    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }

    try {
      setAdding(true);

      await addToCart(
        productId,
        quantity,
      );

      toast.success(
        quantity > 1
          ? `${quantity} × ${productName} added to your bag`
          : `${productName} added to your bag`,
      );
    } catch (error) {
      console.error(
        "ADD TO CART ERROR:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to add this product to your bag.",
      );
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() =>
          void handleAddToCart()
        }
        disabled={
          adding ||
          !isInitialized
        }
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
          "disabled:cursor-not-allowed",
          "disabled:opacity-50",
          fullWidth
            ? "w-full"
            : "w-auto",
        ].join(" ")}
      >
        <ShoppingBag
          size={16}
          strokeWidth={1.4}
        />

        {adding
          ? "Adding..."
          : "Add to Bag"}
      </button>

      <LoginRequiredPopup
        open={showLoginPopup}
        onClose={() =>
          setShowLoginPopup(false)
        }
      />
    </>
  );
}