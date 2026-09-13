"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ShoppingBag,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import type {
  Product,
  ProductColor,
  ProductVariant,
} from "@/types/product";

import {
  getVariantAvailableStock,
  getVariantInventoryStatus,
} from "@/types/product";

import { useCartStore } from "@/store/cart-store";
import { SizeGuide } from "@/components/product/size-guide";

interface ProductQuickAddProps {
  product: Product;
}

export function ProductQuickAdd({
  product,
}: ProductQuickAddProps) {
  const addItem = useCartStore(
    (state) => state.addItem,
  );

  const [open, setOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] =
    useState(false);

  /* ==========================================================
     COLORS
  ========================================================== */

  const colors = useMemo(() => {
    const map = new Map<
      string,
      ProductColor
    >();

    product.variants.forEach((variant) => {
      if (variant.status !== "active") {
        return;
      }

      if (!map.has(variant.color.id)) {
        map.set(
          variant.color.id,
          variant.color,
        );
      }
    });

    return Array.from(map.values());
  }, [product.variants]);

  /* ==========================================================
     INITIAL VARIANT
  ========================================================== */

  const initialVariant = useMemo(() => {
    return (
      product.variants.find(
        (variant) =>
          variant.status === "active" &&
          getVariantAvailableStock(
            variant,
          ) > 0,
      ) ??
      product.variants.find(
        (variant) =>
          variant.status === "active",
      ) ??
      product.variants[0]
    );
  }, [product.variants]);

  const [selectedColorId, setSelectedColorId] =
    useState(
      initialVariant?.color.id ?? "",
    );

  const [selectedSizeCode, setSelectedSizeCode] =
    useState(
      initialVariant?.size.code ?? "",
    );

  /* ==========================================================
     KEEP SELECTION IN SYNC
  ========================================================== */

  useEffect(() => {
    if (!initialVariant) {
      return;
    }

    setSelectedColorId(
      initialVariant.color.id,
    );

    setSelectedSizeCode(
      initialVariant.size.code,
    );
  }, [initialVariant]);

  /* ==========================================================
     CURRENT VARIANT
  ========================================================== */

  const selectedVariant = useMemo(() => {
    return (
      product.variants.find(
        (variant) =>
          variant.status === "active" &&
          variant.color.id ===
            selectedColorId &&
          variant.size.code ===
            selectedSizeCode,
      ) ?? null
    );
  }, [
    product.variants,
    selectedColorId,
    selectedSizeCode,
  ]);

  /* ==========================================================
     SIZE OPTIONS
  ========================================================== */

  const sizes = useMemo(() => {
    const map = new Map<
      string,
      ProductVariant["size"]
    >();

    product.variants.forEach((variant) => {
      if (variant.status !== "active") {
        return;
      }

      if (!map.has(variant.size.code)) {
        map.set(
          variant.size.code,
          variant.size,
        );
      }
    });

    return Array.from(map.values()).sort(
      (a, b) =>
        a.sortOrder - b.sortOrder,
    );
  }, [product.variants]);

  /* ==========================================================
     COLOR CHANGE
  ========================================================== */

  const handleColorChange = (
    colorId: string,
  ) => {
    setSelectedColorId(colorId);

    const firstAvailableVariant =
      product.variants.find(
        (variant) =>
          variant.color.id === colorId &&
          variant.status === "active" &&
          getVariantAvailableStock(
            variant,
          ) > 0,
      );

    const firstActiveVariant =
      product.variants.find(
        (variant) =>
          variant.color.id === colorId &&
          variant.status === "active",
      );

    const nextVariant =
      firstAvailableVariant ??
      firstActiveVariant;

    setSelectedSizeCode(
      nextVariant?.size.code ?? "",
    );
  };

  /* ==========================================================
     SIZE CHANGE
  ========================================================== */

  const handleSizeChange = (
    sizeCode: string,
  ) => {
    setSelectedSizeCode(sizeCode);
  };

  /* ==========================================================
     ADD TO BAG
  ========================================================== */

  const handleAddToBag = () => {
    if (!selectedVariant) {
      toast.error(
        "Please select a color and size.",
      );
      return;
    }

    const status =
      getVariantInventoryStatus(
        selectedVariant,
      );

    if (status === "out-of-stock") {
      toast.error(
        "This size is currently sold out.",
      );
      return;
    }

    addItem(
      product.id,
      1,
      selectedVariant.id,
    );

    toast.success(
      `${product.name} · ${selectedVariant.color.name} · ${selectedVariant.size.label} added to bag`,
    );

    setOpen(false);
  };

  /* ==========================================================
     AVAILABILITY
  ========================================================== */

  const selectedStock =
    selectedVariant
      ? getVariantAvailableStock(
          selectedVariant,
        )
      : 0;

  const productHasAvailability =
    product.variants.some(
      (variant) =>
        variant.status === "active" &&
        getVariantAvailableStock(
          variant,
        ) > 0,
    );

  /* ==========================================================
     SOLD OUT
  ========================================================== */

  if (!productHasAvailability) {
    return (
      <div className="mt-4">
        <button
          type="button"
          disabled
          className="
            flex
            h-11
            w-full
            items-center
            justify-center
            border
            border-[var(--color-border)]
            bg-[var(--color-bg-soft)]
            px-4
            font-body
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.18em]
            text-[var(--color-text-muted)]
          "
        >
          Sold Out
        </button>
      </div>
    );
  }

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="mt-4">
      {/* ======================================================
         COLLAPSED STATE
      ====================================================== */}

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="
            group
            flex
            h-11
            w-full
            items-center
            justify-between
            border
            border-[var(--color-text)]
            bg-transparent
            px-4
            font-body
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.17em]
            text-[var(--color-text)]
            transition-all
            duration-[var(--duration-base)]
            hover:border-[var(--color-text)]
            hover:bg-[var(--color-text)]
            hover:text-[var(--color-text-inverse)]
          "
        >
          <span className="flex items-center gap-2.5">
            <ShoppingBag
              size={15}
              strokeWidth={1.25}
            />

            Quick Add
          </span>

          <ChevronDown
            size={15}
            strokeWidth={1.25}
            className="
              transition-transform
              duration-[var(--duration-base)]
              group-hover:translate-y-0.5
            "
          />
        </button>
      )}

      {/* ======================================================
         EXPANDED PANEL
      ====================================================== */}

      {open && (
        <div
          className="
            overflow-hidden
            border
            border-[var(--color-border-dark)]
            bg-[var(--color-surface)]
            shadow-[var(--shadow-sm)]
          "
        >
          {/* PANEL HEADER */}

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-[var(--color-border)]
              px-4
              py-4
            "
          >
            <div>
              <p className="eyebrow">
                Quick Add
              </p>

              <p
                className="
                  mt-1.5
                  font-display
                  text-[18px]
                  font-medium
                  leading-none
                  text-[var(--color-text)]
                "
              >
                Choose your style
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close quick add"
              className="
                group
                flex
                h-8
                w-8
                items-center
                justify-center
                border
                border-[var(--color-border)]
                text-[var(--color-text-secondary)]
                transition-all
                duration-[var(--duration-base)]
                hover:border-[var(--color-text)]
                hover:bg-[var(--color-text)]
                hover:text-[var(--color-text-inverse)]
              "
            >
              <X
                size={15}
                strokeWidth={1.25}
                className="
                  transition-transform
                  duration-[var(--duration-base)]
                  group-hover:rotate-90
                "
              />
            </button>
          </div>

          <div className="p-4 sm:p-5">
            {/* ==================================================
               COLOR
            ================================================== */}

            <div>
              <div className="mb-3 flex items-center justify-between">
                <p
                  className="
                    font-body
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-[var(--color-text)]
                  "
                >
                  Color
                </p>

                <span
                  className="
                    font-body
                    text-[9px]
                    text-[var(--color-text-secondary)]
                  "
                >
                  {colors.find(
                    (color) =>
                      color.id ===
                      selectedColorId,
                  )?.name ?? ""}
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {colors.map((color) => {
                  const active =
                    color.id ===
                    selectedColorId;

                  const hasStock =
                    product.variants.some(
                      (variant) =>
                        variant.color.id ===
                          color.id &&
                        variant.status ===
                          "active" &&
                        getVariantAvailableStock(
                          variant,
                        ) > 0,
                    );

                  return (
                    <button
                      key={color.id}
                      type="button"
                      disabled={!hasStock}
                      onClick={() =>
                        handleColorChange(
                          color.id,
                        )
                      }
                      title={color.name}
                      aria-label={`Select ${color.name}`}
                      aria-pressed={active}
                      className={[
                        "relative flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200",
                        active
                          ? "border-[var(--color-text)]"
                          : "border-transparent",
                        !hasStock
                          ? "cursor-not-allowed opacity-25"
                          : "hover:scale-105",
                      ].join(" ")}
                    >
                      <span
                        className="
                          h-6
                          w-6
                          rounded-full
                          border
                          border-[rgba(33,31,29,0.12)]
                        "
                        style={{
                          backgroundColor:
                            color.hex ??
                            "#ddd",
                        }}
                      />

                      {!hasStock && (
                        <span
                          className="
                            absolute
                            h-px
                            w-8
                            rotate-45
                            bg-[var(--color-text-muted)]
                          "
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ==================================================
               SIZE
            ================================================== */}

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <p
                  className="
                    font-body
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-[var(--color-text)]
                  "
                >
                  Size
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setSizeGuideOpen(true)
                  }
                  className="
                    font-body
                    text-[9px]
                    font-medium
                    text-[var(--color-text-secondary)]
                    underline
                    underline-offset-4
                    transition-colors
                    duration-[var(--duration-base)]
                    hover:text-[var(--color-accent)]
                  "
                >
                  Size Guide
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5">
                {sizes.map((size) => {
                  const variant =
                    product.variants.find(
                      (item) =>
                        item.status ===
                          "active" &&
                        item.color.id ===
                          selectedColorId &&
                        item.size.code ===
                          size.code,
                    );

                  const available =
                    !!variant &&
                    getVariantAvailableStock(
                      variant,
                    ) > 0;

                  const active =
                    selectedSizeCode ===
                    size.code;

                  return (
                    <button
                      key={size.code}
                      type="button"
                      disabled={!available}
                      onClick={() =>
                        handleSizeChange(
                          size.code,
                        )
                      }
                      className={[
                        "flex min-h-10 items-center justify-center border px-2 font-body text-[9px] font-semibold uppercase tracking-[0.08em] transition-all duration-200",
                        active
                          ? "border-[var(--color-text)] bg-[var(--color-text)] text-[var(--color-text-inverse)]"
                          : "border-[var(--color-border)] bg-transparent text-[var(--color-text)]",
                        !available
                          ? "cursor-not-allowed opacity-30 line-through"
                          : "hover:border-[var(--color-text)]",
                      ].join(" ")}
                    >
                      {size.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ==================================================
               SELECTED VARIANT
            ================================================== */}

            {selectedVariant && (
              <div
                className="
                  mt-6
                  border-t
                  border-[var(--color-border)]
                  pt-4
                "
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow">
                      Selected
                    </p>

                    <p
                      className="
                        mt-1.5
                        font-body
                        text-[10px]
                        font-medium
                        text-[var(--color-text)]
                      "
                    >
                      {selectedVariant.color.name}
                      {" · "}
                      {selectedVariant.size.label}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className="
                        font-body
                        text-[13px]
                        font-semibold
                        text-[var(--color-text)]
                      "
                    >
                      ₹
                      {selectedVariant.pricing.sellingPrice.toLocaleString(
                        "en-IN",
                      )}
                    </p>

                    {selectedVariant
                      .pricing.mrp >
                      selectedVariant
                        .pricing
                        .sellingPrice && (
                      <p
                        className="
                          mt-0.5
                          font-body
                          text-[9px]
                          text-[var(--color-text-muted)]
                          line-through
                        "
                      >
                        ₹
                        {selectedVariant.pricing.mrp.toLocaleString(
                          "en-IN",
                        )}
                      </p>
                    )}
                  </div>
                </div>

                {/* STOCK */}

                <div className="mt-3">
                  {getVariantInventoryStatus(
                    selectedVariant,
                  ) ===
                    "low-stock" && (
                    <p
                      className="
                        font-body
                        text-[9px]
                        font-semibold
                        text-[var(--color-warning)]
                      "
                    >
                      Only {selectedStock} left
                    </p>
                  )}

                  {getVariantInventoryStatus(
                    selectedVariant,
                  ) ===
                    "in-stock" && (
                    <p
                      className="
                        font-body
                        text-[9px]
                        text-[var(--color-success)]
                      "
                    >
                      In stock
                    </p>
                  )}

                  {getVariantInventoryStatus(
                    selectedVariant,
                  ) ===
                    "out-of-stock" && (
                    <p
                      className="
                        font-body
                        text-[9px]
                        font-semibold
                        text-[var(--color-error)]
                      "
                    >
                      Sold out
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ==================================================
               ADD TO BAG
            ================================================== */}

            <button
              type="button"
              onClick={handleAddToBag}
              disabled={
                !selectedVariant ||
                getVariantInventoryStatus(
                  selectedVariant,
                ) === "out-of-stock"
              }
              className="
                group
                mt-5
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2.5
                border
                border-[var(--color-text)]
                bg-[var(--color-text)]
                px-4
                font-body
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.17em]
                text-[var(--color-text-inverse)]
                transition-all
                duration-[var(--duration-base)]
                hover:border-[var(--color-accent-dark)]
                hover:bg-[var(--color-accent-dark)]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <ShoppingBag
                size={15}
                strokeWidth={1.25}
              />

              <span>
                Add to Bag
              </span>

              <ChevronRight
                size={14}
                strokeWidth={1.2}
                className="
                  transition-transform
                  duration-[var(--duration-base)]
                  group-hover:translate-x-0.5
                "
              />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
         SIZE GUIDE
      ======================================================== */}

      <SizeGuide
        sizeChart={product.sizeChart}
        open={sizeGuideOpen}
        onOpenChange={setSizeGuideOpen}
      />
    </div>
  );
}