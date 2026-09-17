"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ============================================================
   CART ITEM
============================================================ */

export interface CartItem {
  /**
   * Product-level identifier.
   *
   * Every color/style is now a separate product,
   * so productId uniquely identifies the cart item.
   */
  productId: string;

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
  ) => void;

  removeItem: (
    productId: string,
  ) => void;

  updateQuantity: (
    productId: string,
    quantity: number,
  ) => void;

  clearCart: () => void;

  getItemQuantity: (
    productId: string,
  ) => number;

  getTotalItems: () => number;

  hasItem: (
    productId: string,
  ) => boolean;
}

/* ============================================================
   STORE
============================================================ */

export const useCartStore =
  create<CartState>()(
    persist(
      (set, get) => ({
        items: [],

        /* ------------------------------------------------------
           ADD ITEM
        ------------------------------------------------------ */

        addItem: (
          productId,
          quantity = 1,
        ) => {
          if (!productId) {
            return;
          }

          if (quantity <= 0) {
            return;
          }

          set((state) => {
            const existingItem =
              state.items.find(
                (item) =>
                  item.productId ===
                  productId,
              );

            /* ----------------------------------------------
               EXISTING PRODUCT
            ---------------------------------------------- */

            if (existingItem) {
              return {
                items: state.items.map(
                  (item) =>
                    item.productId ===
                    productId
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
               NEW PRODUCT
            ---------------------------------------------- */

            return {
              items: [
                ...state.items,
                {
                  productId,
                  quantity,
                },
              ],
            };
          });
        },

        /* ------------------------------------------------------
           REMOVE ITEM
        ------------------------------------------------------ */

        removeItem: (
          productId,
        ) => {
          if (!productId) {
            return;
          }

          set((state) => ({
            items: state.items.filter(
              (item) =>
                item.productId !==
                productId,
            ),
          }));
        },

        /* ------------------------------------------------------
           UPDATE QUANTITY
        ------------------------------------------------------ */

        updateQuantity: (
          productId,
          quantity,
        ) => {
          if (!productId) {
            return;
          }

          /**
           * Quantity 0 or below means
           * remove the product from cart.
           */
          if (quantity <= 0) {
            set((state) => ({
              items: state.items.filter(
                (item) =>
                  item.productId !==
                  productId,
              ),
            }));

            return;
          }

          set((state) => ({
            items: state.items.map(
              (item) =>
                item.productId ===
                productId
                  ? {
                      ...item,
                      quantity,
                    }
                  : item,
            ),
          }));
        },

        /* ------------------------------------------------------
           CLEAR CART
        ------------------------------------------------------ */

        clearCart: () => {
          set({
            items: [],
          });
        },

        /* ------------------------------------------------------
           GET ITEM QUANTITY
        ------------------------------------------------------ */

        getItemQuantity: (
          productId,
        ) => {
          if (!productId) {
            return 0;
          }

          return (
            get().items.find(
              (item) =>
                item.productId ===
                productId,
            )?.quantity ?? 0
          );
        },

        /* ------------------------------------------------------
           TOTAL ITEMS
        ------------------------------------------------------ */

        getTotalItems: () => {
          return get().items.reduce(
            (total, item) =>
              total + item.quantity,
            0,
          );
        },

        /* ------------------------------------------------------
           HAS ITEM
        ------------------------------------------------------ */

        hasItem: (
          productId,
        ) => {
          if (!productId) {
            return false;
          }

          return get().items.some(
            (item) =>
              item.productId ===
              productId,
          );
        },
      }),

      /* ========================================================
         PERSISTENCE
      ======================================================== */

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