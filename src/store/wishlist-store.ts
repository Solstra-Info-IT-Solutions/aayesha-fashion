import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistState = {
  productIds: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],

      addToWishlist: (productId) => {
        set((state) => {
          if (state.productIds.includes(productId)) {
            return state;
          }

          return {
            productIds: [...state.productIds, productId],
          };
        });
      },

      removeFromWishlist: (productId) => {
        set((state) => ({
          productIds: state.productIds.filter((id) => id !== productId),
        }));
      },

      toggleWishlist: (productId) => {
        const { productIds } = get();

        if (productIds.includes(productId)) {
          set({
            productIds: productIds.filter((id) => id !== productId),
          });
          return;
        }

        set({
          productIds: [...productIds, productId],
        });
      },

      isInWishlist: (productId) => {
        return get().productIds.includes(productId);
      },

      clearWishlist: () => {
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