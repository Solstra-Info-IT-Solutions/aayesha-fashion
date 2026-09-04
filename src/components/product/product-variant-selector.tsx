"use client";

import type {
  Product,
  ProductColor,
} from "@/types/product";
import { getVariantInventoryStatus } from "@/types/product";

interface ProductVariantSelectorProps {
  product: Product;
  selectedColorId: string;
  onColorChange: (colorId: string) => void;
}

export function ProductVariantSelector({
  product,
  selectedColorId,
  onColorChange,
}: ProductVariantSelectorProps) {
  const colors = Array.from(
    new Map(
      product.variants.map((variant) => [
        variant.color.id,
        variant.color,
      ]),
    ).values(),
  ) as ProductColor[];

  return (
    <section className="border-b border-[var(--color-border)] py-6">
      <div className="mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">
          Color
        </p>

        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          {colors.find((color) => color.id === selectedColorId)
            ?.name ?? "Select color"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {colors.map((color) => {
          const active = color.id === selectedColorId;

          const available = product.variants.some(
            (variant) =>
              variant.color.id === color.id &&
              variant.status === "active" &&
              getVariantInventoryStatus(variant) !==
                "out-of-stock",
          );

          return (
            <button
              key={color.id}
              type="button"
              disabled={!available}
              onClick={() => onColorChange(color.id)}
              className={[
                "group flex items-center gap-2 border px-3.5 py-2.5 text-xs transition",
                active
                  ? "border-[var(--color-charcoal)]"
                  : "border-[var(--color-border)]",
                !available
                  ? "cursor-not-allowed opacity-35"
                  : "hover:border-[var(--color-charcoal)]",
              ].join(" ")}
            >
              <span
                className="h-4 w-4 rounded-full border border-black/10"
                style={{
                  backgroundColor: color.hex ?? "#dedede",
                }}
              />

              <span>{color.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}