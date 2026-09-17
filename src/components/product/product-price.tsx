import type { Product } from "@/types/product";

interface ProductPriceProps {
  product: Product;
}

export function ProductPrice({
  product,
}: ProductPriceProps) {
  const {
    mrp,
    sellingPrice,
  } = product.pricing;

  const discount =
    mrp > sellingPrice
      ? Math.round(
          ((mrp - sellingPrice) / mrp) * 100,
        )
      : 0;

  return (
    <div>
      {/* =====================================================
          PRICE ROW
      ===================================================== */}

      <div
        className="
          flex
          flex-wrap
          items-baseline
          gap-x-3
          gap-y-1.5
        "
      >
        {/* SELLING PRICE */}

        <span
          className="
            font-body
            text-[26px]
            font-semibold
            leading-none
            tracking-[-0.025em]
            text-[var(--color-text)]
            sm:text-[28px]
          "
        >
          ₹
          {sellingPrice.toLocaleString(
            "en-IN",
          )}
        </span>

        {/* MRP */}

        {mrp > sellingPrice && (
          <span
            className="
              font-body
              text-[13px]
              font-medium
              leading-none
              text-[var(--color-text-muted)]
              line-through
            "
          >
            ₹
            {mrp.toLocaleString(
              "en-IN",
            )}
          </span>
        )}

        {/* DISCOUNT */}

        {discount > 0 && (
          <span
            className="
              border
              border-[var(--color-accent-soft)]
              bg-[var(--color-bg-soft)]
              px-2
              py-1
              font-body
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.12em]
              text-[var(--color-accent-dark)]
            "
          >
            {discount}% off
          </span>
        )}
      </div>

      {/* =====================================================
          TAX NOTE
      ===================================================== */}

      <p
        className="
          mt-2.5
          font-body
          text-[9px]
          leading-5
          text-[var(--color-text-muted)]
        "
      >
        Inclusive of applicable taxes
      </p>
    </div>
  );
}