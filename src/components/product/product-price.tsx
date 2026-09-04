import type { ProductVariant } from "@/types/product";

interface ProductPriceProps {
  variant: ProductVariant | null;
}

export function ProductPrice({ variant }: ProductPriceProps) {
  if (!variant) {
    return (
      <div className="text-lg font-semibold">
        Select a variant
      </div>
    );
  }

  const { mrp, sellingPrice } = variant.pricing;

  const discount =
    mrp > sellingPrice
      ? Math.round(((mrp - sellingPrice) / mrp) * 100)
      : 0;

  return (
    <div>
      <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
        <span className="text-[22px] font-semibold tracking-[-0.02em]">
          ₹{sellingPrice.toLocaleString("en-IN")}
        </span>

        {mrp > sellingPrice && (
          <>
            <span className="text-sm text-[var(--color-text-muted)] line-through">
              ₹{mrp.toLocaleString("en-IN")}
            </span>

            <span className="text-xs font-semibold text-[var(--color-rose-dark)]">
              {discount}% OFF
            </span>
          </>
        )}
      </div>

      <p className="mt-2 text-xs text-[var(--color-text-muted)]">
        Inclusive of applicable taxes
      </p>
    </div>
  );
}