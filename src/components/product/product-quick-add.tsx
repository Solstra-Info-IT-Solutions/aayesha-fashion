"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
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

  /* ==========================================================
     UI STATE
  ========================================================== */

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

    product.variants.forEach(
      (variant) => {
        if (
          variant.status !==
          "active"
        ) {
          return;
        }

        if (
          !map.has(
            variant.color.id,
          )
        ) {
          map.set(
            variant.color.id,
            variant.color,
          );
        }
      },
    );

    return Array.from(
      map.values(),
    );
  }, [product.variants]);

  /* ==========================================================
     INITIAL VARIANT
  ========================================================== */

  const initialVariant = useMemo(() => {
    return (
      product.variants.find(
        (variant) =>
          variant.status ===
            "active" &&
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
      initialVariant?.color.id ??
        "",
    );

  const [selectedSizeCode, setSelectedSizeCode] =
    useState(
      initialVariant?.size.code ??
        "",
    );

  /* ==========================================================
     KEEP SELECTION IN SYNC WITH PRODUCT
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

  const selectedVariant =
    useMemo(() => {
      return (
        product.variants.find(
          (variant) =>
            variant.status ===
              "active" &&
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

    product.variants.forEach(
      (variant) => {
        if (
          variant.status !==
          "active"
        ) {
          return;
        }

        if (
          !map.has(
            variant.size.code,
          )
        ) {
          map.set(
            variant.size.code,
            variant.size,
          );
        }
      },
    );

    return Array.from(
      map.values(),
    ).sort(
      (a, b) =>
        a.sortOrder -
        b.sortOrder,
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
          variant.color.id ===
            colorId &&
          variant.status ===
            "active" &&
          getVariantAvailableStock(
            variant,
          ) > 0,
      );

    const firstActiveVariant =
      product.variants.find(
        (variant) =>
          variant.color.id ===
            colorId &&
          variant.status ===
            "active",
      );

    const nextVariant =
      firstAvailableVariant ??
      firstActiveVariant;

    setSelectedSizeCode(
      nextVariant?.size.code ??
        "",
    );
  };

  /* ==========================================================
     SIZE CHANGE
  ========================================================== */

  const handleSizeChange = (
    sizeCode: string,
  ) => {
    setSelectedSizeCode(
      sizeCode,
    );
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

    if (
      status ===
        "out-of-stock"
    ) {
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

  /* ==========================================================
     SOLD OUT PRODUCT
  ========================================================== */

  const productHasAvailability =
    product.variants.some(
      (variant) =>
        variant.status ===
          "active" &&
        getVariantAvailableStock(
          variant,
        ) > 0,
    );

  if (!productHasAvailability) {
    return (
      <div className="mt-4">
        <button
          type="button"
          disabled
          className="flex h-11 w-full items-center justify-center border border-[var(--color-border)] bg-[var(--color-warm-gray)] px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]"
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
          className="group flex h-11 w-full items-center justify-between border border-[var(--color-charcoal)] bg-transparent px-4 text-left transition hover:bg-[var(--color-charcoal)] hover:text-white"
        >
          <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em]">
            <ShoppingBag
              size={15}
              strokeWidth={1.5}
            />

            Add to Bag
          </span>

          <ChevronDown
            size={15}
            className="transition-transform duration-200 group-hover:translate-y-0.5"
          />
        </button>
      )}

      {/* ======================================================
         EXPANDED VARIANT PANEL
      ====================================================== */}

      {open && (
        <div className="border border-[var(--color-border-dark)] bg-[var(--color-surface)]">
          {/* PANEL HEADER */}

          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                Quick Add
              </p>

              <p className="mt-0.5 text-xs font-medium">
                Select your variant
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setOpen(false)
              }
              aria-label="Close quick add"
              className="flex h-8 w-8 items-center justify-center text-[var(--color-text-muted)] transition hover:text-[var(--color-charcoal)]"
            >
              <X size={15} />
            </button>
          </div>

          <div className="p-4">
            {/* ==================================================
               COLOR
            ================================================== */}

            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em]">
                  Color
                </p>

                <span className="text-[10px] text-[var(--color-text-muted)]">
                  {colors.find(
                    (color) =>
                      color.id ===
                      selectedColorId,
                  )?.name ?? ""}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {colors.map(
                  (color) => {
                    const active =
                      color.id ===
                      selectedColorId;

                    const hasStock =
                      product.variants.some(
                        (variant) =>
                          variant.color
                            .id ===
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
                        disabled={
                          !hasStock
                        }
                        onClick={() =>
                          handleColorChange(
                            color.id,
                          )
                        }
                        title={
                          color.name
                        }
                        className={[
                          "relative flex h-9 w-9 items-center justify-center rounded-full border transition",
                          active
                            ? "border-[var(--color-charcoal)]"
                            : "border-transparent",
                          !hasStock
                            ? "cursor-not-allowed opacity-25"
                            : "",
                        ].join(" ")}
                      >
                        <span
                          className="h-6 w-6 rounded-full border border-black/10"
                          style={{
                            backgroundColor:
                              color.hex ??
                              "#ddd",
                          }}
                        />

                        {!hasStock && (
                          <span className="absolute h-px w-8 rotate-45 bg-[var(--color-text-muted)]" />
                        )}
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            {/* ==================================================
               SIZE
            ================================================== */}

            <div className="mt-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em]">
                  Size
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setSizeGuideOpen(
                      true,
                    )
                  }
                  className="text-[10px] font-medium underline underline-offset-4"
                >
                  Size Guide
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5">
                {sizes.map(
                  (size) => {
                    const variant =
                      product.variants.find(
                        (item) =>
                          item.status ===
                            "active" &&
                          item.color.id ===
                            selectedColorId &&
                          item.size
                            .code ===
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
                        key={
                          size.code
                        }
                        type="button"
                        disabled={
                          !available
                        }
                        onClick={() =>
                          handleSizeChange(
                            size.code,
                          )
                        }
                        className={[
                          "flex min-h-9 items-center justify-center border px-2 text-[10px] font-semibold transition",
                          active
                            ? "border-[var(--color-charcoal)] bg-[var(--color-charcoal)] text-white"
                            : "border-[var(--color-border)]",
                          !available
                            ? "cursor-not-allowed opacity-35 line-through"
                            : "hover:border-[var(--color-charcoal)]",
                        ].join(" ")}
                      >
                        {
                          size.label
                        }
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            {/* ==================================================
               SELECTED VARIANT INFORMATION
            ================================================== */}

            {selectedVariant && (
              <div className="mt-5 border-t border-[var(--color-border)] pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                      Selected
                    </p>

                    <p className="mt-1 text-xs">
                      {
                        selectedVariant
                          .color.name
                      }{" "}
                      ·{" "}
                      {
                        selectedVariant
                          .size.label
                      }
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      ₹
                      {selectedVariant.pricing.sellingPrice.toLocaleString(
                        "en-IN",
                      )}
                    </p>

                    {selectedVariant
                      .pricing
                      .mrp >
                      selectedVariant
                        .pricing
                        .sellingPrice && (
                      <p className="text-[10px] text-[var(--color-text-muted)] line-through">
                        ₹
                        {selectedVariant.pricing.mrp.toLocaleString(
                          "en-IN",
                        )}
                      </p>
                    )}
                  </div>
                </div>

                {/* STOCK STATUS */}

                <div className="mt-3">
                  {getVariantInventoryStatus(
                    selectedVariant,
                  ) ===
                    "low-stock" && (
                    <p className="text-[10px] font-semibold text-[var(--color-rose-dark)]">
                      Only{" "}
                      {
                        selectedStock
                      }{" "}
                      left
                    </p>
                  )}

                  {getVariantInventoryStatus(
                    selectedVariant,
                  ) ===
                    "in-stock" && (
                    <p className="text-[10px] text-[var(--color-success)]">
                      In stock
                    </p>
                  )}

                  {getVariantInventoryStatus(
                    selectedVariant,
                  ) ===
                    "out-of-stock" && (
                    <p className="text-[10px] font-semibold text-[var(--color-error)]">
                      Sold out
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ==================================================
               ADD BUTTON
            ================================================== */}

            <button
              type="button"
              onClick={
                handleAddToBag
              }
              disabled={
                !selectedVariant ||
                getVariantInventoryStatus(
                  selectedVariant,
                ) ===
                  "out-of-stock"
              }
              className="mt-5 flex h-11 w-full items-center justify-center gap-2 bg-[var(--color-charcoal)] px-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[var(--color-charcoal-soft)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ShoppingBag
                size={15}
              />

              Add Selected Variant
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
        onOpenChange={
          setSizeGuideOpen
        }
      />
    </div>
  );
}