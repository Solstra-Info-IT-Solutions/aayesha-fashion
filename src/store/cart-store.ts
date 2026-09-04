"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ============================================================
   CART ITEM
============================================================ */

export interface CartItem {
  /**
   * Product-level identifier.
   */
  productId: string;

  /**
   * Exact selected variant.
   * Example:
   * rose-garden-rose-m
   */
  variantId: string;

  /**
   * Quantity currently in the cart.
   */
  quantity: number;
}

/* ============================================================
   CART STATE
============================================================ */

interface CartState {
  items: CartItem[];

  addItem: (
    productId: string,
    quantity?: number,
    variantId?: string,
  ) => void;

  removeItem: (
    productId: string,
    variantId?: string,
  ) => void;

  updateQuantity: (
    productId: string,
    quantity: number,
    variantId?: string,
  ) => void;

  clearCart: () => void;

  getItemQuantity: (
    productId: string,
    variantId?: string,
  ) => number;

  getTotalItems: () => number;

  hasItem: (
    productId: string,
    variantId?: string,
  ) => boolean;
}

/* ============================================================
   STORE
============================================================ */

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      /* --------------------------------------------------------
         ADD ITEM
      -------------------------------------------------------- */

      addItem: (
        productId,
        quantity = 1,
        variantId,
      ) => {
        /**
         * Variant is mandatory for the advanced
         * product architecture.
         */
        if (!variantId) {
          return;
        }

        if (quantity <= 0) {
          return;
        }

        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.productId === productId &&
              item.variantId === variantId,
          );

          /* ----------------------------------------------
             EXISTING VARIANT
          ---------------------------------------------- */

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.productId === productId &&
                item.variantId === variantId
                  ? {
                      ...item,
                      quantity:
                        item.quantity +
                        quantity,
                    }
                  : item,
              ),
            };
          }

          /* ----------------------------------------------
             NEW VARIANT
          ---------------------------------------------- */

          return {
            items: [
              ...state.items,
              {
                productId,
                variantId,
                quantity,
              },
            ],
          };
        });
      },

      /* --------------------------------------------------------
         REMOVE ITEM
      -------------------------------------------------------- */

      removeItem: (
        productId,
        variantId,
      ) => {
        if (!variantId) {
          return;
        }

        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.productId ===
                  productId &&
                item.variantId ===
                  variantId
              ),
          ),
        }));
      },

      /* --------------------------------------------------------
         UPDATE QUANTITY
      -------------------------------------------------------- */

      updateQuantity: (
        productId,
        quantity,
        variantId,
      ) => {
        if (!variantId) {
          return;
        }

        /**
         * Quantity 0 means remove the item.
         */
        if (quantity <= 0) {
          set((state) => ({
            items: state.items.filter(
              (item) =>
                !(
                  item.productId ===
                    productId &&
                  item.variantId ===
                    variantId
                ),
            ),
          }));

          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId &&
            item.variantId === variantId
              ? {
                  ...item,
                  quantity,
                }
              : item,
          ),
        }));
      },

      /* --------------------------------------------------------
         CLEAR CART
      -------------------------------------------------------- */

      clearCart: () => {
        set({
          items: [],
        });
      },

      /* --------------------------------------------------------
         GET ITEM QUANTITY
      -------------------------------------------------------- */

      getItemQuantity: (
        productId,
        variantId,
      ) => {
        if (!variantId) {
          return 0;
        }

        return (
          get().items.find(
            (item) =>
              item.productId ===
                productId &&
              item.variantId ===
                variantId,
          )?.quantity ?? 0
        );
      },

      /* --------------------------------------------------------
         TOTAL ITEMS
      -------------------------------------------------------- */

      getTotalItems: () => {
        return get().items.reduce(
          (total, item) =>
            total + item.quantity,
          0,
        );
      },

      /* --------------------------------------------------------
         HAS ITEM
      -------------------------------------------------------- */

      hasItem: (
        productId,
        variantId,
      ) => {
        if (!variantId) {
          return false;
        }

        return get().items.some(
          (item) =>
            item.productId === productId &&
            item.variantId === variantId,
        );
      },
    }),

    /* ==========================================================
       PERSISTENCE
    ========================================================== */

    {
      name: "aayesha-cart",

      /**
       * Only cart data is persisted.
       */
      partialize: (state) => ({
        items: state.items,
      }),
    },
  ),
);