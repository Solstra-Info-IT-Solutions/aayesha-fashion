"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ShoppingBag,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import type { Product } from "@/types/product";

import {
  getInventoryStatus,
  getProductAvailability,
} from "@/types/product";

import { useCartStore } from "@/store/cart-store";

interface ProductQuickAddProps {
  product: Product;
}

export function ProductQuickAdd({
  product,
}: ProductQuickAddProps) {
  const addItem = useCartStore(
    (state) => state.addItem,
  );

  const [open, setOpen] = useState(false);

  /* ==========================================================
     PRODUCT AVAILABILITY
  ========================================================== */

  const availability =
    getProductAvailability(product);

  const inventoryStatus =
    getInventoryStatus(product);

  /* ==========================================================
     ADD TO BAG
  ========================================================== */

  const handleAddToBag = () => {
    if (availability.isSoldOut) {
      toast.error(
        "This product is currently sold out.",
      );
      return;
    }

    if (availability.availableQuantity <= 0) {
      toast.error(
        "This product is currently unavailable.",
      );
      return;
    }

    addItem(
      product.id,
      1,
    );

    toast.success(
      `${product.name} added to bag`,
    );

    setOpen(false);
  };

  /* ==========================================================
     SOLD OUT
  ========================================================== */

  if (availability.isSoldOut) {
    return (
      <div className="mt-4">
        <button
          type="button"
          disabled
          className="
            flex
            h-11
            w-full
            items-center
            justify-center
            border
            border-[var(--color-border)]
            bg-[var(--color-bg-soft)]
            px-4
            font-body
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.18em]
            text-[var(--color-text-muted)]
          "
        >
          Sold Out
        </button>
      </div>
    );
  }

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="mt-4">
      {/* ======================================================
         COLLAPSED STATE
      ====================================================== */}

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="
            group
            flex
            h-11
            w-full
            items-center
            justify-between
            border
            border-[var(--color-text)]
            bg-transparent
            px-4
            font-body
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.17em]
            text-[var(--color-text)]
            transition-all
            duration-[var(--duration-base)]
            hover:border-[var(--color-text)]
            hover:bg-[var(--color-text)]
            hover:text-[var(--color-text-inverse)]
          "
        >
          <span className="flex items-center gap-2.5">
            <ShoppingBag
              size={15}
              strokeWidth={1.25}
            />

            Quick Add
          </span>

          <ChevronDown
            size={15}
            strokeWidth={1.25}
            className="
              transition-transform
              duration-[var(--duration-base)]
              group-hover:translate-y-0.5
            "
          />
        </button>
      )}

      {/* ======================================================
         EXPANDED PANEL
      ====================================================== */}

      {open && (
        <div
          className="
            overflow-hidden
            border
            border-[var(--color-border-dark)]
            bg-[var(--color-surface)]
            shadow-[var(--shadow-sm)]
          "
        >
          {/* PANEL HEADER */}

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-[var(--color-border)]
              px-4
              py-4
            "
          >
            <div>
              <p className="eyebrow">
                Quick Add
              </p>

              <p
                className="
                  mt-1.5
                  font-display
                  text-[18px]
                  font-medium
                  leading-none
                  text-[var(--color-text)]
                "
              >
                Add to your bag
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close quick add"
              className="
                group
                flex
                h-8
                w-8
                items-center
                justify-center
                border
                border-[var(--color-border)]
                text-[var(--color-text-secondary)]
                transition-all
                duration-[var(--duration-base)]
                hover:border-[var(--color-text)]
                hover:bg-[var(--color-text)]
                hover:text-[var(--color-text-inverse)]
              "
            >
              <X
                size={15}
                strokeWidth={1.25}
                className="
                  transition-transform
                  duration-[var(--duration-base)]
                  group-hover:rotate-90
                "
              />
            </button>
          </div>

          <div className="p-4 sm:p-5">
            {/* ==================================================
               PRODUCT
            ================================================== */}

            <div>
              <p className="eyebrow">
                Product
              </p>

              <p
                className="
                  mt-1.5
                  font-display
                  text-[20px]
                  font-medium
                  leading-tight
                  text-[var(--color-text)]
                "
              >
                {product.name}
              </p>
            </div>

            {/* ==================================================
               PRICE
            ================================================== */}

            <div
              className="
                mt-5
                flex
                items-start
                justify-between
                gap-4
                border-t
                border-[var(--color-border)]
                pt-4
              "
            >
              <div>
                <p
                  className="
                    font-body
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-[var(--color-text-muted)]
                  "
                >
                  Price
                </p>

                <p
                  className="
                    mt-1.5
                    font-body
                    text-[15px]
                    font-semibold
                    text-[var(--color-text)]
                  "
                >
                  ₹
                  {product.pricing.sellingPrice.toLocaleString(
                    "en-IN",
                  )}
                </p>
              </div>

              {product.pricing.mrp >
                product.pricing.sellingPrice && (
                <div className="text-right">
                  <p
                    className="
                      font-body
                      text-[9px]
                      text-[var(--color-text-muted)]
                      line-through
                    "
                  >
                    ₹
                    {product.pricing.mrp.toLocaleString(
                      "en-IN",
                    )}
                  </p>

                  <p
                    className="
                      mt-1
                      font-body
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.05em]
                      text-[var(--color-accent-dark)]
                    "
                  >
                    {Math.round(
                      ((product.pricing.mrp -
                        product.pricing
                          .sellingPrice) /
                        product.pricing.mrp) *
                        100,
                    )}
                    % OFF
                  </p>
                </div>
              )}
            </div>

            {/* ==================================================
               STOCK
            ================================================== */}

            <div
              className="
                mt-5
                border-t
                border-[var(--color-border)]
                pt-4
              "
            >
              <p className="eyebrow">
                Availability
              </p>

              {inventoryStatus ===
                "low-stock" && (
                <p
                  className="
                    mt-2
                    font-body
                    text-[9px]
                    font-semibold
                    text-[var(--color-warning)]
                  "
                >
                  Only{" "}
                  {
                    availability.availableQuantity
                  }{" "}
                  left
                </p>
              )}

              {inventoryStatus ===
                "in-stock" && (
                <p
                  className="
                    mt-2
                    font-body
                    text-[9px]
                    text-[var(--color-success)]
                  "
                >
                  In stock
                </p>
              )}

              {inventoryStatus ===
                "out-of-stock" && (
                <p
                  className="
                    mt-2
                    font-body
                    text-[9px]
                    font-semibold
                    text-[var(--color-error)]
                  "
                >
                  Sold out
                </p>
              )}
            </div>

            {/* ==================================================
               ADD TO BAG
            ================================================== */}

            <button
              type="button"
              onClick={handleAddToBag}
              disabled={
                availability.isSoldOut ||
                availability.availableQuantity <=
                  0
              }
              className="
                group
                mt-5
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2.5
                border
                border-[var(--color-text)]
                bg-[var(--color-text)]
                px-4
                font-body
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.17em]
                text-[var(--color-text-inverse)]
                transition-all
                duration-[var(--duration-base)]
                hover:border-[var(--color-accent-dark)]
                hover:bg-[var(--color-accent-dark)]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <ShoppingBag
                size={15}
                strokeWidth={1.25}
              />

              <span>
                Add to Bag
              </span>

              <ChevronRight
                size={14}
                strokeWidth={1.2}
                className="
                  transition-transform
                  duration-[var(--duration-base)]
                  group-hover:translate-x-0.5
                "
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}