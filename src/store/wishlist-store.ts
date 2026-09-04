"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  productIds: string[];

  add: (productId: string) => void;

  remove: (productId: string) => void;

  toggle: (productId: string) => void;

  isInWishlist: (productId: string) => boolean;

  clear: () => void;
}

export const useWishlistStore =
  create<WishlistState>()(
    persist(
      (set, get) => ({
        productIds: [],

        add: (productId) => {
          if (
            get().productIds.includes(
              productId,
            )
          ) {
            return;
          }

          set((state) => ({
            productIds: [
              ...state.productIds,
              productId,
            ],
          }));
        },

        remove: (productId) => {
          set((state) => ({
            productIds:
              state.productIds.filter(
                (id) => id !== productId,
              ),
          }));
        },

        toggle: (productId) => {
          const exists =
            get().productIds.includes(
              productId,
            );

          if (exists) {
            set((state) => ({
              productIds:
                state.productIds.filter(
                  (id) =>
                    id !== productId,
                ),
            }));
          } else {
            set((state) => ({
              productIds: [
                ...state.productIds,
                productId,
              ],
            }));
          }
        },

        isInWishlist: (productId) =>
          get().productIds.includes(
            productId,
          ),

        clear: () => {
          set({
            productIds: [],
          });
        },
      }),
      {
        name: "aayesha-wishlist",
      },
    ),
  );