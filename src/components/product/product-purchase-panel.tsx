"use client";

import {
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import type {
  Product,
  ProductVariant,
} from "@/types/product";

import {
  getVariantInventoryStatus,
} from "@/types/product";

import { useCartStore } from "@/store/cart-store";

interface ProductPurchasePanelProps {
  product: Product;
  variant: ProductVariant | null;
  quantity: number;
  onQuantityChange: (
    quantity: number,
  ) => void;
}

export function ProductPurchasePanel({
  product,
  variant,
  quantity,
  onQuantityChange,
}: ProductPurchasePanelProps) {
  const addItem = useCartStore(
    (state) => state.addItem,
  );

  const router = useRouter();

  const stock = variant
    ? Math.max(
        0,
        variant.inventory.stock -
          variant.inventory.reserved,
      )
    : 0;

  const status = variant
    ? getVariantInventoryStatus(
        variant,
      )
    : "out-of-stock";

  const canBuy =
    !!variant &&
    status !== "out-of-stock" &&
    stock > 0;

  const addToBag = () => {
    if (!variant) {
      toast.error(
        "Please select color and size.",
      );
      return;
    }

    if (!canBuy) {
      toast.error(
        "This variant is currently unavailable.",
      );
      return;
    }

    addItem(
      product.id,
      quantity,
      variant.id,
    );

    toast.success(
      `${product.name} has been added to your bag.`,
    );
  };

  const buyNow = () => {
    if (!variant) {
      toast.error(
        "Please select color and size.",
      );
      return;
    }

    if (!canBuy) {
      toast.error(
        "This variant is currently unavailable.",
      );
      return;
    }

    addItem(
      product.id,
      quantity,
      variant.id,
    );

    router.push("/cart");
  };

  return (
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

        {variant && (
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
        )}
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
              quantity <= 1
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
              !variant ||
              quantity >= stock
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
          onClick={addToBag}
          disabled={!canBuy}
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
            Add to Bag
          </span>
        </button>
      </div>

      {/* =====================================================
          BUY NOW
      ===================================================== */}

      <button
        type="button"
        onClick={buyNow}
        disabled={!canBuy}
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
        Buy Now
      </button>

      {/* =====================================================
          INVENTORY MESSAGE
      ===================================================== */}

      {variant && (
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
                : status ===
                    "in-stock"
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
              In stock ·
              Ready to ship
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
      )}

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
  );
}