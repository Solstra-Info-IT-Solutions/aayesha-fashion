"use client";

import { ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

import type {
  Product,
  ProductVariant,
} from "@/types/product";
import { getVariantInventoryStatus } from "@/types/product";
import { useCartStore } from "@/store/cart-store";

interface ProductStickyBuyBarProps {
  product: Product;
  variant: ProductVariant | null;
}

export function ProductStickyBuyBar({
  product,
  variant,
}: ProductStickyBuyBarProps) {
  const addItem = useCartStore((state) => state.addItem);

  const available =
    !!variant &&
    getVariantInventoryStatus(variant) !==
      "out-of-stock";

  const handleAdd = () => {
    if (!variant) {
      toast.error("Select color and size first.");
      return;
    }

    if (!available) {
      toast.error("This variant is sold out.");
      return;
    }

    addItem(product.id, 1, variant.id);

    toast.success("Added to your bag.");
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-ivory)] px-4 py-3 shadow-[0_-8px_30px_rgba(27,29,29,0.08)] lg:hidden">
      <div className="mx-auto flex max-w-xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold">
            {product.name}
          </p>

          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
            {variant
              ? `₹${variant.pricing.sellingPrice.toLocaleString("en-IN")}`
              : "Select variant"}
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="flex h-12 shrink-0 items-center gap-2 bg-[var(--color-charcoal)] px-5 text-[10px] font-semibold uppercase tracking-[0.13em] text-white"
        >
          <ShoppingBag size={15} />
          Add to Bag
        </button>
      </div>
    </div>
  );
}