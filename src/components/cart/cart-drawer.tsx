"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

import {
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
  type Cart,
} from "@/services/cart.service";
import { setCartUiCountFromCart } from "@/store/cart-ui-store";
import { useAuthStore } from "@/store/auth-store";

/*
 * Cart drawer that supplements the full /cart page (cart-content.tsx) for a
 * quick-view opened from the nav bag icon. Mutations call the exact same
 * cart.service functions as cart-content.tsx / product-purchase-panel.tsx.
 */

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    /*
     * Backend cart requires authentication — matches the gate used
     * everywhere else (product cards, purchase panel). Skip the request
     * entirely instead of surfacing an auth error in the console; the
     * "sign in" empty state below is derived straight from isAuthenticated.
     */
    if (!open || !isAuthenticated) return;

    let cancelled = false;

    async function loadCart() {
      setIsLoading(true);

      try {
        const response = await getCart();
        if (!cancelled) {
          setCart(response);
          setCartUiCountFromCart(response);
        }
      } catch (error) {
        console.error("LOAD CART ERROR:", error);
        if (!cancelled) {
          setCart(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadCart();

    return () => {
      cancelled = true;
    };
  }, [open, isAuthenticated]);

  const cartItems = cart?.items ?? [];

  const subtotal = cartItems.reduce((total, item) => {
    if (!item.product) return total;
    return total + item.product.pricing.sellingPrice * item.quantity;
  }, 0);

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      const response = await updateCartItem(productId, quantity);
      setCart(response);
      setCartUiCountFromCart(response);
    } catch (error) {
      console.error("UPDATE CART ERROR:", error);
      toast.error(
        error instanceof Error ? error.message : "Unable to update cart.",
      );
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      const response = await removeFromCart(productId);
      setCart(response);
      setCartUiCountFromCart(response);
      toast.success("Removed from bag.");
    } catch (error) {
      console.error("REMOVE FROM CART ERROR:", error);
      toast.error(
        error instanceof Error ? error.message : "Unable to remove item.",
      );
    }
  };

  const formatPrice = (value: number) => `₹${value.toLocaleString("en-IN")}`;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP — blur + darken */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[var(--z-drawer)] bg-[var(--kohl-umber)]/70 backdrop-blur-sm"
          />

          {/* DRAWER — spring-in from right */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="drape-surface fixed inset-y-0 right-0 z-[var(--z-drawer)] flex w-full max-w-md flex-col"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between border-b drape-hairline px-6 py-5">
              <h2 className="drape-font-display text-xl italic text-[var(--unbleached-cotton)]">
                Your Bag
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close bag"
                className="text-[var(--unbleached-cotton)] transition-colors hover:text-[var(--sindoor-rust)]"
              >
                <X size={20} strokeWidth={1.4} />
              </button>
            </div>

            {/* ITEMS */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {!isAuthenticated ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <ShoppingBag
                    size={28}
                    strokeWidth={1.1}
                    className="text-[var(--aged-brass)]"
                  />
                  <p className="drape-font-body text-sm text-[var(--text-muted)]">
                    Sign in to view your bag.
                  </p>
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="drape-font-body border-b border-[var(--aged-brass)] pb-1 text-[10px] uppercase tracking-[0.18em] text-[var(--unbleached-cotton)] hover:border-[var(--sindoor-rust)] hover:text-[var(--sindoor-rust)]"
                  >
                    Sign In
                  </Link>
                </div>
              ) : isLoading ? (
                <div className="space-y-6">
                  {[1, 2].map((item) => (
                    <div key={item} className="flex gap-4">
                      <div className="h-24 w-20 animate-pulse bg-[var(--raw-silk)]" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-2/3 animate-pulse bg-[var(--raw-silk)]" />
                        <div className="h-3 w-1/3 animate-pulse bg-[var(--raw-silk)]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <ShoppingBag
                    size={28}
                    strokeWidth={1.1}
                    className="text-[var(--aged-brass)]"
                  />
                  <p className="drape-font-body text-sm text-[var(--text-muted)]">
                    Your bag is empty.
                  </p>
                  <Link
                    href="/shop"
                    onClick={onClose}
                    className="drape-font-body border-b border-[var(--aged-brass)] pb-1 text-[10px] uppercase tracking-[0.18em] text-[var(--unbleached-cotton)] hover:border-[var(--sindoor-rust)] hover:text-[var(--sindoor-rust)]"
                  >
                    Explore the Edit
                  </Link>
                </div>
              ) : (
                <ul className="space-y-6">
                  {cartItems.map((item) => {
                    const product = item.product;
                    if (!product) return null;
                    const media = product.media[0];

                    return (
                      <li key={item.productId} className="flex gap-4">
                        <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-[var(--raw-silk)]">
                          {media?.url && (
                            <Image
                              src={media.url}
                              alt={media.alt ?? product.name}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <p className="drape-font-display text-[0.95rem] leading-tight text-[var(--unbleached-cotton)]">
                              {product.name}
                            </p>
                            <button
                              type="button"
                              onClick={() => void handleRemoveItem(item.productId)}
                              aria-label={`Remove ${product.name}`}
                              className="text-[var(--text-muted)] transition-colors hover:text-[var(--state-error)]"
                            >
                              <Trash2 size={14} strokeWidth={1.4} />
                            </button>
                          </div>

                          <span className="drape-price-tag mt-1 inline-block text-[0.85rem] text-[var(--unbleached-cotton)]">
                            {formatPrice(product.pricing.sellingPrice)}
                          </span>

                          <div className="mt-3 inline-flex h-8 items-center border border-[var(--aged-brass)]/40">
                            <button
                              type="button"
                              onClick={() =>
                                void handleUpdateQuantity(
                                  item.productId,
                                  item.quantity - 1,
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="flex h-full w-8 items-center justify-center text-[var(--unbleached-cotton)] disabled:opacity-30"
                            >
                              <Minus size={12} strokeWidth={1.4} />
                            </button>
                            <span className="flex h-full w-8 items-center justify-center border-x border-[var(--aged-brass)]/40 text-xs text-[var(--unbleached-cotton)]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                void handleUpdateQuantity(
                                  item.productId,
                                  item.quantity + 1,
                                )
                              }
                              className="flex h-full w-8 items-center justify-center text-[var(--unbleached-cotton)]"
                            >
                              <Plus size={12} strokeWidth={1.4} />
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* FOOTER */}
            {cartItems.length > 0 && (
              <div className="border-t drape-hairline px-6 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="drape-font-body text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Subtotal
                  </span>
                  <span className="drape-price-tag text-lg text-[var(--unbleached-cotton)]">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="flex h-12 w-full items-center justify-center bg-[var(--sindoor-rust)] drape-font-body text-[10px] uppercase tracking-[0.18em] text-[var(--unbleached-cotton)] transition-colors hover:bg-[var(--sindoor-rust)]/85"
                >
                  Proceed to Checkout
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    void clearCart().then((response) => {
                      setCart(response);
                      setCartUiCountFromCart(response);
                    })
                  }
                  className="mt-3 w-full drape-font-body text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)] underline underline-offset-4 hover:text-[var(--state-error)]"
                >
                  Clear Bag
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
