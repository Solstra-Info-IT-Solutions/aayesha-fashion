"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";

import type { Product } from "@/types/product";
import { getAvailableStock, getInventoryStatus } from "@/types/product";
import { addToCart } from "@/services/cart.service";
import { useAuthStore } from "@/store/auth-store";
import { setCartUiCountFromCart } from "@/store/cart-ui-store";
import { LoginRequiredPopup } from "@/components/product/login-required-popup";
import { ProductDeliveryCheckerDrape } from "@/components/product/product-delivery-checker-drape";

/*
 * Visual restyle of ProductPurchasePanel for the 2026 relaunch PDP shell.
 * Cart/auth logic is copied verbatim (same addToCart(product._id, quantity)
 * call, same auth gate, same router.push("/cart") on buy-now) so the
 * engineering pass can drop this in for the existing panel without
 * touching business logic — only the JSX/motion shell changed.
 */

interface ProductPurchasePanelDrapeProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  /**
   * Fired after a successful add-to-bag so the integration pass can trigger
   * the cart icon's 300ms scale-pulse from the real header. Not called on
   * mount — only from an actual success path.
   */
  onAddedToBag?: () => void;
}

export function ProductPurchasePanelDrape({
  product,
  quantity,
  onQuantityChange,
  onAddedToBag,
}: ProductPurchasePanelDrapeProps) {
  const router = useRouter();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  const [addingToBag, setAddingToBag] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const stock = getAvailableStock(product);
  const status = getInventoryStatus(product);
  const canBuy = status !== "out-of-stock" && stock > 0;

  const addToBag = async () => {
    if (!canBuy) {
      toast.error("This product is currently unavailable.");
      return;
    }
    if (addingToBag || buyingNow) return;
    if (!isInitialized) return;

    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }

    try {
      setAddingToBag(true);
      const response = await addToCart(product._id, quantity);
      setCartUiCountFromCart(response);

      toast.success(
        quantity > 1
          ? `${quantity} × ${product.name} added to your bag.`
          : `${product.name} has been added to your bag.`,
      );

      setJustAdded(true);
      onAddedToBag?.();
      setTimeout(() => setJustAdded(false), 1800);
    } catch (error) {
      console.error("ADD TO CART ERROR:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to add this product to your bag.",
      );
    } finally {
      setAddingToBag(false);
    }
  };

  const buyNow = async () => {
    if (!canBuy) {
      toast.error("This product is currently unavailable.");
      return;
    }
    if (addingToBag || buyingNow) return;
    if (!isInitialized) return;

    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }

    try {
      setBuyingNow(true);
      const response = await addToCart(product._id, quantity);
      setCartUiCountFromCart(response);
      router.push("/cart");
    } catch (error) {
      console.error("BUY NOW ERROR:", error);
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
      {/* Unboxed vertical stack, hairline dividers only — no card wrapper. */}
      <section aria-label="Purchase options" className="w-full">
        {/* PRICE */}
        <div className="border-t drape-hairline pt-5">
          <div className="flex items-baseline gap-3">
            <span className="drape-price-tag text-[2rem] text-[var(--unbleached-cotton)]">
              ₹{product.pricing.sellingPrice.toLocaleString("en-IN")}
            </span>
            {product.pricing.mrp > product.pricing.sellingPrice && (
              <span className="drape-font-body text-sm text-[var(--text-muted)] line-through">
                ₹{product.pricing.mrp.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>

        {/* QUANTITY */}
        <div className="border-t drape-hairline pt-5 mt-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="drape-font-body text-[10px] uppercase tracking-[0.18em] text-[var(--unbleached-cotton)]">
              Quantity
            </p>
            <span className="drape-font-body text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
              {stock > 0 ? `${stock} available` : "Unavailable"}
            </span>
          </div>

          <div className="inline-flex h-11 items-center border border-[var(--aged-brass)]/40">
            <button
              type="button"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || addingToBag || buyingNow}
              aria-label="Decrease quantity"
              className="flex h-full w-10 items-center justify-center text-[var(--unbleached-cotton)] transition-colors hover:bg-[var(--raw-silk)] disabled:opacity-30"
            >
              <Minus size={14} strokeWidth={1.25} />
            </button>
            <span
              aria-live="polite"
              className="flex h-full w-10 items-center justify-center border-x border-[var(--aged-brass)]/40 drape-font-body text-[11px] text-[var(--unbleached-cotton)]"
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={() =>
                onQuantityChange(Math.min(quantity + 1, Math.max(stock, 1)))
              }
              disabled={!canBuy || quantity >= stock || addingToBag || buyingNow}
              aria-label="Increase quantity"
              className="flex h-full w-10 items-center justify-center text-[var(--unbleached-cotton)] transition-colors hover:bg-[var(--raw-silk)] disabled:opacity-30"
            >
              <Plus size={14} strokeWidth={1.25} />
            </button>
          </div>
        </div>

        {/* ADD TO BAG / BUY NOW */}
        <div className="border-t drape-hairline pt-5 mt-5 flex flex-col gap-3 sm:flex-row">
          <motion.button
            type="button"
            onClick={() => void addToBag()}
            disabled={!canBuy || addingToBag || buyingNow || !isInitialized}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="relative flex h-[52px] flex-1 items-center justify-center gap-2.5 overflow-hidden bg-[var(--sindoor-rust)] px-6 py-4 drape-font-body text-[10px] uppercase tracking-[0.17em] text-[var(--unbleached-cotton)] transition-colors hover:bg-[var(--sindoor-rust)]/85 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <AnimatePresence mode="wait" initial={false}>
              {justAdded ? (
                <motion.span
                  key="check"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex items-center gap-2"
                >
                  <Check size={16} strokeWidth={1.5} />
                  Added
                </motion.span>
              ) : (
                <motion.span
                  key="label"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex items-center gap-2"
                >
                  <ShoppingBag size={16} strokeWidth={1.25} />
                  {addingToBag ? "Adding…" : "Add to Bag"}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => void buyNow()}
            disabled={!canBuy || addingToBag || buyingNow || !isInitialized}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="flex h-[52px] flex-1 items-center justify-center border border-[var(--aged-brass)] px-5 py-4 drape-font-body text-[10px] uppercase tracking-[0.17em] text-[var(--unbleached-cotton)] transition-colors hover:bg-[var(--aged-brass)] hover:text-[var(--kohl-umber)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {buyingNow ? "Adding…" : "Buy Now"}
          </motion.button>
        </div>

        {/* STOCK STATUS */}
        <div className="mt-4 flex items-center gap-2" aria-live="polite">
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 rounded-full ${
              status === "low-stock"
                ? "bg-[var(--aged-brass)]"
                : status === "in-stock"
                  ? "bg-[var(--bottle-moss)]"
                  : "bg-[var(--state-error)]"
            }`}
          />
          <p className="drape-font-body text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)]">
            {status === "low-stock"
              ? `Only ${stock} left in stock`
              : status === "in-stock"
                ? "In stock · Ready to ship"
                : "Sold out"}
          </p>
        </div>

        {/* DELIVERY CHECKER */}
        <div className="border-t drape-hairline pt-5 mt-5">
          <ProductDeliveryCheckerDrape />
        </div>
      </section>

      <LoginRequiredPopup
        open={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
      />
    </>
  );
}
