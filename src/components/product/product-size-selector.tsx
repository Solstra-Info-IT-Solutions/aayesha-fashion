"use client";

import type { Product } from "@/types/product";
import { getVariantInventoryStatus } from "@/types/product";

interface ProductSizeSelectorProps {
  product: Product;
  selectedColorId: string;
  selectedSizeCode: string;
  onSizeChange: (sizeCode: string) => void;
  onOpenSizeGuide: () => void;
}

export function ProductSizeSelector({
  product,
  selectedColorId,
  selectedSizeCode,
  onSizeChange,
  onOpenSizeGuide,
}: ProductSizeSelectorProps) {
  const sizes = Array.from(
    new Map(
      product.variants.map((variant) => [
        variant.size.code,
        variant.size,
      ]),
    ).values(),
  ).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section className="border-b border-[var(--color-border)] py-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">
          Size
        </p>

        <button
          type="button"
          onClick={onOpenSizeGuide}
          className="text-[11px] font-semibold underline underline-offset-4"
        >
          Size Guide
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-6">
        {sizes.map((size) => {
          const variant = product.variants.find(
            (item) =>
              item.color.id === selectedColorId &&
              item.size.code === size.code &&
              item.status === "active",
          );

          const available =
            !!variant &&
            getVariantInventoryStatus(variant) !== "out-of-stock";

          const active = selectedSizeCode === size.code;

          return (
            <button
              key={size.code}
              type="button"
              disabled={!available}
              onClick={() => onSizeChange(size.code)}
              className={[
                "min-h-11 border px-3 text-xs font-semibold transition",
                active
                  ? "border-[var(--color-charcoal)] bg-[var(--color-charcoal)] text-white"
                  : "border-[var(--color-border)]",
                !available
                  ? "cursor-not-allowed text-[var(--color-text-muted)] line-through opacity-40"
                  : "hover:border-[var(--color-charcoal)]",
              ].join(" ")}
            >
              {size.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}