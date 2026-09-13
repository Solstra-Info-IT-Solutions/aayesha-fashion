"use client";

import type {
  Product,
  ProductColor,
} from "@/types/product";

import {
  getVariantInventoryStatus,
} from "@/types/product";

interface ProductVariantSelectorProps {
  product: Product;
  selectedColorId: string;
  onColorChange: (
    colorId: string,
  ) => void;
}

export function ProductVariantSelector({
  product,
  selectedColorId,
  onColorChange,
}: ProductVariantSelectorProps) {
  const colors = Array.from(
    new Map(
      product.variants.map(
        (variant) => [
          variant.color.id,
          variant.color,
        ],
      ),
    ).values(),
  ) as ProductColor[];

  const selectedColor =
    colors.find(
      (color) =>
        color.id === selectedColorId,
    );

  return (
    <section
      aria-labelledby="product-color-label"
      className="
        w-full
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          mb-5
          flex
          items-baseline
          justify-between
          gap-4
        "
      >
        <div>
          <p
            id="product-color-label"
            className="
              font-body
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-[var(--color-text)]
            "
          >
            Color
          </p>

          <p
            className="
              mt-1.5
              font-body
              text-[11px]
              text-[var(--color-text-secondary)]
            "
          >
            {selectedColor?.name ??
              "Select color"}
          </p>
        </div>

        <span
          className="
            font-body
            text-[9px]
            uppercase
            tracking-[0.14em]
            text-[var(--color-text-muted)]
          "
        >
          {colors.length}{" "}
          {colors.length === 1
            ? "option"
            : "options"}
        </span>
      </div>

      {/* =====================================================
          COLOR OPTIONS
      ===================================================== */}

      <div
        className="
          flex
          flex-wrap
          gap-3
        "
        role="radiogroup"
        aria-label="Available colors"
      >
        {colors.map((color) => {
          const active =
            color.id ===
            selectedColorId;

          const available =
            product.variants.some(
              (variant) =>
                variant.color.id ===
                  color.id &&
                variant.status ===
                  "active" &&
                getVariantInventoryStatus(
                  variant,
                ) !==
                  "out-of-stock",
            );

          return (
            <button
              key={color.id}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={`${color.name}${
                !available
                  ? " — unavailable"
                  : ""
              }`}
              disabled={!available}
              onClick={() =>
                onColorChange(
                  color.id,
                )
              }
              className={[
                `
                  group/color
                  relative
                  flex
                  min-h-11
                  items-center
                  gap-2.5
                  border
                  px-3
                  py-2
                  font-body
                  text-[10px]
                  font-medium
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
                    bg-[var(--color-surface)]
                  `
                  : `
                    border-[var(--color-border)]
                    bg-transparent
                    hover:border-[var(--color-text-secondary)]
                    hover:bg-[var(--color-surface-soft)]
                  `,
                !available
                  ? `
                    cursor-not-allowed
                    opacity-35
                  `
                  : "",
              ].join(" ")}
            >
              {/* COLOR SWATCH */}

              <span
                aria-hidden="true"
                className={[
                  `
                    relative
                    flex
                    h-5
                    w-5
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-black/10
                    transition-transform
                    duration-[var(--duration-base)]
                    group-hover/color:scale-105
                  `,
                  active
                    ? "ring-1 ring-[var(--color-text)] ring-offset-2"
                    : "",
                ].join(" ")}
                style={{
                  backgroundColor:
                    color.hex ??
                    "#dedede",
                }}
              >
                {/* ACTIVE DOT */}

                {active && (
                  <span
                    className="
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-white
                      shadow-[0_1px_3px_rgba(33,31,29,0.25)]
                    "
                  />
                )}
              </span>

              {/* COLOR NAME */}

              <span
                className="
                  whitespace-nowrap
                  text-[var(--color-text)]
                "
              >
                {color.name}
              </span>

              {/* UNAVAILABLE LINE */}

              {!available && (
                <span
                  aria-hidden="true"
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    h-px
                    w-[calc(100%-12px)]
                    -translate-x-1/2
                    -translate-y-1/2
                    rotate-[-12deg]
                    bg-[var(--color-text-muted)]
                  "
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}