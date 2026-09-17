"use client";

import { useState } from "react";

import {
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";

import toast from "react-hot-toast";

import { useRouter } from "next/navigation";

import type { Product } from "@/types/product";

import {
  getAvailableStock,
  getInventoryStatus,
} from "@/types/product";

import {
  addToCart,
} from "@/services/cart.service";

import { useAuthStore } from "@/store/auth-store";

import { LoginRequiredPopup } from "@/components/product/login-required-popup";

interface ProductPurchasePanelProps {
  product: Product;
  quantity: number;
  onQuantityChange: (
    quantity: number,
  ) => void;
}

export function ProductPurchasePanel({
  product,
  quantity,
  onQuantityChange,
}: ProductPurchasePanelProps) {
  const router = useRouter();

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const isInitialized = useAuthStore(
    (state) => state.isInitialized,
  );

  const [addingToBag, setAddingToBag] =
    useState(false);

  const [buyingNow, setBuyingNow] =
    useState(false);

  const [showLoginPopup, setShowLoginPopup] =
    useState(false);

  const stock =
    getAvailableStock(product);

  const status =
    getInventoryStatus(product);

  const canBuy =
    status !== "out-of-stock" &&
    stock > 0;

  /* ==========================================================
     ADD TO BAG
  ========================================================== */

  const addToBag = async () => {
    if (!canBuy) {
      toast.error(
        "This product is currently unavailable.",
      );

      return;
    }

    if (
      addingToBag ||
      buyingNow
    ) {
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
      setAddingToBag(true);

      await addToCart(
        product.id,
        quantity,
      );

      toast.success(
        quantity > 1
          ? `${quantity} × ${product.name} added to your bag.`
          : `${product.name} has been added to your bag.`,
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
      setAddingToBag(false);
    }
  };

  /* ==========================================================
     BUY NOW
  ========================================================== */

  const buyNow = async () => {
    if (!canBuy) {
      toast.error(
        "This product is currently unavailable.",
      );

      return;
    }

    if (
      addingToBag ||
      buyingNow
    ) {
      return;
    }

    if (!isInitialized) {
      return;
    }

    /*
     * Login required before adding
     * the product to backend cart.
     */
    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }

    try {
      setBuyingNow(true);

      await addToCart(
        product.id,
        quantity,
      );

      router.push("/cart");
    } catch (error) {
      console.error(
        "BUY NOW ERROR:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to add this product to your bag.",
      );
    } finally {
      setBuyingNow(false);
    }
  };

  return (
    <>
      <section
        aria-label="Purchase options"
        className="w-full"
      >
        {/* =====================================================
            PURCHASE HEADER
        ===================================================== */}

        <div
          className="
            mb-4
            flex
            items-center
            justify-between
          "
        >
          <p
            className="
              font-body
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-[var(--color-text)]
            "
          >
            Quantity
          </p>

          <span
            className="
              font-body
              text-[9px]
              uppercase
              tracking-[0.12em]
              text-[var(--color-text-muted)]
            "
          >
            {stock > 0
              ? `${stock} available`
              : "Unavailable"}
          </span>
        </div>

        {/* =====================================================
            QUANTITY + ADD TO BAG
        ===================================================== */}

        <div
          className="
            flex
            gap-2
          "
        >
          {/* QUANTITY */}

          <div
            className="
              flex
              h-12
              shrink-0
              border
              border-[var(--color-border-dark)]
              bg-[var(--color-surface)]
            "
          >
            <button
              type="button"
              onClick={() =>
                onQuantityChange(
                  Math.max(
                    1,
                    quantity - 1,
                  ),
                )
              }
              disabled={
                quantity <= 1 ||
                addingToBag ||
                buyingNow
              }
              aria-label="Decrease quantity"
              className="
                flex
                w-10
                items-center
                justify-center
                text-[var(--color-text)]
                transition-colors
                duration-[var(--duration-base)]
                hover:bg-[var(--color-bg-soft)]
                disabled:cursor-not-allowed
                disabled:opacity-30
                focus-visible:outline-none
                focus-visible:ring-1
                focus-visible:ring-inset
                focus-visible:ring-[var(--color-text)]
              "
            >
              <Minus
                size={14}
                strokeWidth={1.25}
              />
            </button>

            <span
              aria-live="polite"
              className="
                flex
                w-10
                items-center
                justify-center
                border-x
                border-[var(--color-border-light)]
                font-body
                text-[11px]
                font-semibold
                text-[var(--color-text)]
              "
            >
              {quantity}
            </span>

            <button
              type="button"
              onClick={() =>
                onQuantityChange(
                  Math.min(
                    quantity + 1,
                    Math.max(
                      stock,
                      1,
                    ),
                  ),
                )
              }
              disabled={
                !canBuy ||
                quantity >= stock ||
                addingToBag ||
                buyingNow
              }
              aria-label="Increase quantity"
              className="
                flex
                w-10
                items-center
                justify-center
                text-[var(--color-text)]
                transition-colors
                duration-[var(--duration-base)]
                hover:bg-[var(--color-bg-soft)]
                disabled:cursor-not-allowed
                disabled:opacity-30
                focus-visible:outline-none
                focus-visible:ring-1
                focus-visible:ring-inset
                focus-visible:ring-[var(--color-text)]
              "
            >
              <Plus
                size={14}
                strokeWidth={1.25}
              />
            </button>
          </div>

          {/* ADD TO BAG */}

          <button
            type="button"
            onClick={() =>
              void addToBag()
            }
            disabled={
              !canBuy ||
              addingToBag ||
              buyingNow ||
              !isInitialized
            }
            className="
              group
              flex
              h-12
              min-w-0
              flex-1
              items-center
              justify-center
              gap-2.5
              bg-[var(--color-text)]
              px-4
              font-body
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.17em]
              text-[var(--color-text-inverse)]
              transition-all
              duration-[var(--duration-base)]
              ease-[var(--ease-luxury)]
              hover:bg-[var(--color-accent-dark)]
              focus-visible:outline-none
              focus-visible:ring-1
              focus-visible:ring-[var(--color-text)]
              focus-visible:ring-offset-2
              disabled:cursor-not-allowed
              disabled:opacity-45
              sm:px-6
            "
          >
            <ShoppingBag
              size={16}
              strokeWidth={1.25}
              className="
                transition-transform
                duration-[var(--duration-base)]
                group-hover:translate-x-0.5
              "
            />

            <span>
              {addingToBag
                ? "Adding..."
                : "Add to Bag"}
            </span>
          </button>
        </div>

        {/* =====================================================
            BUY NOW
        ===================================================== */}

        <button
          type="button"
          onClick={() =>
            void buyNow()
          }
          disabled={
            !canBuy ||
            addingToBag ||
            buyingNow ||
            !isInitialized
          }
          className="
            mt-2
            flex
            h-12
            w-full
            items-center
            justify-center
            border
            border-[var(--color-text)]
            bg-transparent
            px-5
            font-body
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.17em]
            text-[var(--color-text)]
            transition-all
            duration-[var(--duration-base)]
            ease-[var(--ease-luxury)]
            hover:bg-[var(--color-text)]
            hover:text-[var(--color-text-inverse)]
            focus-visible:outline-none
            focus-visible:ring-1
            focus-visible:ring-[var(--color-text)]
            focus-visible:ring-offset-2
            disabled:cursor-not-allowed
            disabled:opacity-45
          "
        >
          {buyingNow
            ? "Adding..."
            : "Buy Now"}
        </button>

        {/* =====================================================
            INVENTORY MESSAGE
        ===================================================== */}

        <div
          className="
            mt-4
            flex
            items-center
            gap-2
          "
          aria-live="polite"
        >
          <span
            aria-hidden="true"
            className={[
              "h-1.5 w-1.5 rounded-full",
              status === "low-stock"
                ? "bg-[var(--color-warning)]"
                : status === "in-stock"
                  ? "bg-[var(--color-success)]"
                  : "bg-[var(--color-error)]",
            ].join(" ")}
          />

          {status ===
          "low-stock" ? (
            <p
              className="
                font-body
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.08em]
                text-[var(--color-warning)]
              "
            >
              Only {stock} left
              in stock
            </p>
          ) : status ===
            "in-stock" ? (
            <p
              className="
                font-body
                text-[10px]
                font-medium
                uppercase
                tracking-[0.08em]
                text-[var(--color-success)]
              "
            >
              In stock · Ready to ship
            </p>
          ) : (
            <p
              className="
                font-body
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.08em]
                text-[var(--color-error)]
              "
            >
              Sold out
            </p>
          )}
        </div>

        {/* =====================================================
            PURCHASE REASSURANCE
        ===================================================== */}

        <div
          className="
            mt-5
            border-t
            border-[var(--color-border-light)]
            pt-4
          "
        >
          <p
            className="
              font-body
              text-[9px]
              leading-5
              text-[var(--color-text-muted)]
            "
          >
            Secure checkout · Easy returns ·
            Carefully packed by Aayesha Fashion
          </p>
        </div>
      </section>

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