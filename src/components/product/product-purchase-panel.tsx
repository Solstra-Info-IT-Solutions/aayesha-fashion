"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import type { Product, ProductVariant } from "@/types/product";
import { getVariantInventoryStatus } from "@/types/product";
import { useCartStore } from "@/store/cart-store";

interface ProductPurchasePanelProps {
  product: Product;
  variant: ProductVariant | null;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export function ProductPurchasePanel({
  product,
  variant,
  quantity,
  onQuantityChange,
}: ProductPurchasePanelProps) {
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const stock = variant
    ? Math.max(
        0,
        variant.inventory.stock - variant.inventory.reserved,
      )
    : 0;

  const status = variant
    ? getVariantInventoryStatus(variant)
    : "out-of-stock";

  const canBuy =
    !!variant &&
    status !== "out-of-stock" &&
    stock > 0;

  const addToBag = () => {
    if (!variant) {
      toast.error("Please select color and size.");
      return;
    }

    if (!canBuy) {
      toast.error("This variant is currently unavailable.");
      return;
    }

    addItem(product.id, quantity, variant.id);

    toast.success(
      `${product.name} has been added to your bag.`,
    );
  };

  const buyNow = () => {
    if (!variant) {
      toast.error("Please select color and size.");
      return;
    }

    if (!canBuy) {
      toast.error("This variant is currently unavailable.");
      return;
    }

    addItem(product.id, quantity, variant.id);
    router.push("/cart");
  };

  return (
    <section className="py-7">
      <div className="flex items-center gap-3">
        <div className="flex h-12 border border-[var(--color-border-dark)]">
          <button
            type="button"
            onClick={() =>
              onQuantityChange(Math.max(1, quantity - 1))
            }
            disabled={quantity <= 1}
            className="flex w-11 items-center justify-center disabled:opacity-30"
            aria-label="Decrease quantity"
          >
            <Minus size={15} />
          </button>

          <span className="flex w-12 items-center justify-center text-sm font-semibold">
            {quantity}
          </span>

          <button
            type="button"
            onClick={() =>
              onQuantityChange(
                Math.min(quantity + 1, Math.max(stock, 1)),
              )
            }
            disabled={!variant || quantity >= stock}
            className="flex w-11 items-center justify-center disabled:opacity-30"
            aria-label="Increase quantity"
          >
            <Plus size={15} />
          </button>
        </div>

        <button
          type="button"
          onClick={addToBag}
          disabled={!canBuy}
          className="flex h-12 flex-1 items-center justify-center gap-2 bg-[var(--color-charcoal)] px-5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[var(--color-charcoal-soft)] disabled:cursor-not-allowed disabled:opacity-45"
        >
          <ShoppingBag size={16} />
          Add to Bag
        </button>
      </div>

      <button
        type="button"
        onClick={buyNow}
        disabled={!canBuy}
        className="mt-2 h-12 w-full border border-[var(--color-charcoal)] px-5 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-charcoal)] transition hover:bg-[var(--color-charcoal)] hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
      >
        Buy Now
      </button>

      {variant && (
        <div className="mt-4">
          {status === "low-stock" ? (
            <p className="text-xs font-semibold text-[var(--color-rose-dark)]">
              Only {stock} left in stock
            </p>
          ) : status === "in-stock" ? (
            <p className="text-xs font-medium text-[var(--color-success)]">
              In stock · Ready to ship
            </p>
          ) : (
            <p className="text-xs font-semibold text-[var(--color-error)]">
              Sold out
            </p>
          )}
        </div>
      )}
    </section>
  );
}