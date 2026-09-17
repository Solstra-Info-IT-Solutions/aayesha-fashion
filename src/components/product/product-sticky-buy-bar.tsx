"use client";

import { useState } from "react";

import { ShoppingBag } from "lucide-react";

import toast from "react-hot-toast";

import type { Product } from "@/types/product";

import {
  getAvailableStock,
  getInventoryStatus,
} from "@/types/product";

import { addToCart } from "@/services/cart.service";

import { useAuthStore } from "@/store/auth-store";

import { LoginRequiredPopup } from "@/components/product/login-required-popup";

interface ProductStickyBuyBarProps {
  product: Product;
}

export function ProductStickyBuyBar({
  product,
}: ProductStickyBuyBarProps) {
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

  const stock =
    getAvailableStock(product);

  const status =
    getInventoryStatus(product);

  const available =
    status !== "out-of-stock" &&
    stock > 0;

  /* ==========================================================
     ADD TO BAG
  ========================================================== */

  const handleAdd = async () => {
    if (!available) {
      toast.error(
        "This product is currently sold out.",
      );

      return;
    }

    if (adding) {
      return;
    }

    if (!isInitialized) {
      return;
    }

    /*
     * Backend cart requires authentication.
     */
    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }

    try {
      setAdding(true);

      await addToCart(
        product.id,
        1,
      );

      toast.success(
        "Added to your bag.",
      );
    } catch (error) {
      console.error(
        "STICKY ADD TO CART ERROR:",
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
      <div
        className="
          fixed
          inset-x-0
          bottom-0
          z-40
          border-t
          border-[var(--color-border)]
          bg-[var(--color-ivory)]
          px-4
          py-3
          shadow-[0_-8px_30px_rgba(27,29,29,0.08)]
          lg:hidden
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-xl
            items-center
            gap-3
          "
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">
              {product.name}
            </p>

            <p
              className="
                mt-0.5
                text-xs
                text-[var(--color-text-muted)]
              "
            >
              ₹
              {product.pricing.sellingPrice.toLocaleString(
                "en-IN",
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void handleAdd()
            }
            disabled={
              !available ||
              adding ||
              !isInitialized
            }
            className="
              flex
              h-12
              shrink-0
              items-center
              gap-2
              bg-[var(--color-charcoal)]
              px-5
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.13em]
              text-white
              disabled:cursor-not-allowed
              disabled:opacity-45
            "
          >
            <ShoppingBag size={15} />

            {adding
              ? "Adding..."
              : available
                ? "Add to Bag"
                : "Sold Out"}
          </button>
        </div>
      </div>

      {/* ======================================================
          LOGIN REQUIRED POPUP
      ====================================================== */}

      <LoginRequiredPopup
        open={showLoginPopup}
        onClose={() =>
          setShowLoginPopup(false)
        }
      />
    </>
  );
}