"use client";

import type { Product } from "@/types/product";
import {
  getVariantInventoryStatus,
} from "@/types/product";

interface ProductSizeSelectorProps {
  product: Product;
  selectedColorId: string;
  selectedSizeCode: string;
  onSizeChange: (
    sizeCode: string,
  ) => void;
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
      product.variants.map(
        (variant) => [
          variant.size.code,
          variant.size,
        ],
      ),
    ).values(),
  ).sort(
    (a, b) =>
      a.sortOrder - b.sortOrder,
  );

  const selectedSize = sizes.find(
    (size) =>
      size.code === selectedSizeCode,
  );

  return (
    <section
      aria-labelledby="product-size-label"
      className="w-full"
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          mb-5
          flex
          items-end
          justify-between
          gap-4
        "
      >
        <div>
          <p
            id="product-size-label"
            className="
              font-body
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-[var(--color-text)]
            "
          >
            Size
          </p>

          <p
            className="
              mt-1.5
              font-body
              text-[11px]
              text-[var(--color-text-secondary)]
            "
          >
            {selectedSize
              ? `Selected: ${selectedSize.label}`
              : "Select your size"}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenSizeGuide}
          className="
            shrink-0
            border-b
            border-[var(--color-text)]
            pb-0.5
            font-body
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.14em]
            text-[var(--color-text)]
            transition-colors
            duration-[var(--duration-base)]
            hover:border-[var(--color-accent)]
            hover:text-[var(--color-accent)]
            focus-visible:outline-none
            focus-visible:ring-1
            focus-visible:ring-[var(--color-text)]
            focus-visible:ring-offset-2
          "
        >
          Size Guide
        </button>
      </div>

      {/* =====================================================
          SIZE OPTIONS
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-3
          gap-2
          sm:grid-cols-5
          lg:grid-cols-6
        "
        role="radiogroup"
        aria-label="Available sizes"
      >
        {sizes.map((size) => {
          const variant =
            product.variants.find(
              (item) =>
                item.color.id ===
                  selectedColorId &&
                item.size.code ===
                  size.code &&
                item.status ===
                  "active",
            );

          const available =
            !!variant &&
            getVariantInventoryStatus(
              variant,
            ) !== "out-of-stock";

          const active =
            selectedSizeCode ===
            size.code;

          return (
            <button
              key={size.code}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={`${size.label}${
                !available
                  ? " — unavailable"
                  : ""
              }`}
              disabled={!available}
              onClick={() =>
                onSizeChange(
                  size.code,
                )
              }
              className={[
                `
                  relative
                  min-h-12
                  border
                  px-3
                  py-3
                  font-body
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  transition-all
                  duration-[var(--duration-base)]
                  ease-[var(--ease-luxury)]
                  focus-visible:outline-none
                  focus-visible:ring-1
                  focus-visible:ring-[var(--color-text)]
                  focus-visible:ring-offset-2
                `,
                active
                  ? `
                    border-[var(--color-text)]
                    bg-[var(--color-text)]
                    text-[var(--color-text-inverse)]
                  `
                  : `
                    border-[var(--color-border)]
                    bg-transparent
                    text-[var(--color-text)]
                    hover:border-[var(--color-text-secondary)]
                    hover:bg-[var(--color-surface-soft)]
                  `,
                !available
                  ? `
                    cursor-not-allowed
                    border-[var(--color-border-light)]
                    bg-[var(--color-bg-subtle)]
                    text-[var(--color-text-muted)]
                    opacity-55
                  `
                  : "",
              ].join(" ")}
            >
              {size.label}

              {/* UNAVAILABLE INDICATOR */}

              {!available && (
                <span
                  aria-hidden="true"
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    h-px
                    w-[55%]
                    -translate-x-1/2
                    -translate-y-1/2
                    rotate-[-12deg]
                    bg-[var(--color-text-muted)]
                  "
                />
              )}

              {/* ACTIVE INDICATOR */}

              {active && (
                <span
                  aria-hidden="true"
                  className="
                    absolute
                    bottom-1
                    left-1/2
                    h-px
                    w-4
                    -translate-x-1/2
                    bg-[var(--color-accent-soft)]
                  "
                />
              )}
            </button>
          );
        })}
      </div>

      {/* =====================================================
          SELECTION NOTE
      ===================================================== */}

      {selectedSize && (
        <p
          className="
            mt-3
            font-body
            text-[9px]
            text-[var(--color-text-muted)]
          "
        >
          Size {selectedSize.label} selected
          for the chosen color.
        </p>
      )}
    </section>
  );
}