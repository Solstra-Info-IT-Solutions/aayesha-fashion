"use client";

import { create } from "zustand";

import { getCart, type Cart } from "@/services/cart.service";
import { useAuthStore } from "@/store/auth-store";

/*
 * Lightweight UI-only cart store (item count + a "pulse" tick for the nav
 * cart icon). There is no full cart Zustand store in this codebase — cart
 * data itself is still fetched/mutated directly via cart.service in
 * cart-drawer.tsx / cart-content.tsx, unchanged. This store only exists so
 * the nav badge and the icon's pulse animation can be driven from anywhere
 * (grid quick-add, PDP buy box, cart drawer) without prop-drilling a ref.
 */

type CartUiState = {
  count: number;
  pulseTick: number;
  refreshCount: () => Promise<void>;
  pulse: () => void;
};

export const useCartUiStore = create<CartUiState>((set) => ({
  count: 0,
  pulseTick: 0,

  refreshCount: async () => {
    if (!useAuthStore.getState().isAuthenticated) {
      set({ count: 0 });
      return;
    }

    try {
      const cart = await getCart();
      set({ count: countCartItems(cart) });
    } catch {
      set({ count: 0 });
    }
  },

  pulse: () => set((state) => ({ pulseTick: state.pulseTick + 1 })),
}));

function countCartItems(cart: Cart): number {
  return cart.items.reduce((total, item) => total + item.quantity, 0);
}

/** Sync the badge count straight from a Cart response returned by a mutation. */
export function setCartUiCountFromCart(cart: Cart): void {
  useCartUiStore.setState({ count: countCartItems(cart) });
}
