"use client";

import { useMemo } from "react";

import {
  getProductById,
} from "@/data/products";

import { useCartStore } from "@/store/cart-store";
import { useCheckoutStore } from "@/store/checkout-store";

export function CheckoutSummary() {
  const cartItems = useCartStore(
    (state) => state.items,
  );

  const delivery = useCheckoutStore(
    (state) => state.delivery,
  );

  const couponCode = useCheckoutStore(
    (state) => state.couponCode,
  );

  const data = useMemo(() => {
    let subtotal = 0;
    let mrpTotal = 0;

    const items = cartItems
      .map((cartItem) => {
        const product = getProductById(
          cartItem.productId,
        );

        if (!product) return null;

        const variant =
          product.variants.find(
            (item) =>
              item.id ===
              cartItem.variantId,
          );

        if (!variant) return null;

        subtotal +=
          variant.pricing.sellingPrice *
          cartItem.quantity;

        mrpTotal +=
          variant.pricing.mrp *
          cartItem.quantity;

        return {
          cartItem,
          product,
          variant,
        };
      })
      .filter(Boolean);

    const shipping =
      delivery === "express"
        ? 199
        : subtotal >= 2999
          ? 0
          : 99;

    const productSavings =
      Math.max(
        0,
        mrpTotal - subtotal,
      );

    const couponDiscount =
      couponCode === "AYESHA10"
        ? Math.round(
            subtotal * 0.1,
          )
        : 0;

    const total =
      subtotal +
      shipping -
      couponDiscount;

    return {
      items,
      subtotal,
      mrpTotal,
      shipping,
      productSavings,
      couponDiscount,
      total,
    };
  }, [
    cartItems,
    delivery,
    couponCode,
  ]);

  return (
    <aside className="lg:sticky lg:top-28">
      <div className="border border-[var(--color-border)] bg-white">
        <div className="border-b border-[var(--color-border)] px-6 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
            Order Summary
          </p>

          <p className="mt-2 font-[var(--font-cormorant)] text-2xl">
            Your Ayesha edit
          </p>
        </div>

        {/* ITEMS */}
        <div className="max-h-[420px] overflow-y-auto">
          {data.items.map(
            ({
              cartItem,
              product,
              variant,
            }) => (
              <div
                key={`${cartItem.productId}-${cartItem.variantId}`}
                className="flex gap-4 border-b border-[var(--color-border)] px-6 py-4"
              >
                <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-[var(--color-cream)]">
                  {product.media[0]?.src && (
                    <img
                      src={product.media[0].src}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  )}

                  <span className="absolute bottom-1 right-1 flex h-5 min-w-5 items-center justify-center bg-[var(--color-charcoal)] px-1 text-[8px] font-semibold text-white">
                    {cartItem.quantity}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-[var(--font-cormorant)] text-lg leading-tight">
                    {product.name}
                  </p>

                  <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                    {variant.color.name} ·{" "}
                    {variant.size.label}
                  </p>

                  <p className="mt-2 text-xs font-semibold">
                    ₹
                    {variant.pricing.sellingPrice.toLocaleString(
                      "en-IN",
                    )}
                  </p>
                </div>
              </div>
            ),
          )}
        </div>

        {/* TOTALS */}
        <div className="space-y-4 px-6 py-5">
          <Row
            label="MRP Total"
            value={`₹${data.mrpTotal.toLocaleString("en-IN")}`}
          />

          {data.productSavings > 0 && (
            <Row
              label="Product Discount"
              value={`- ₹${data.productSavings.toLocaleString("en-IN")}`}
              valueClass="text-[var(--color-success)]"
            />
          )}

          {data.couponDiscount > 0 && (
            <Row
              label="Coupon Discount"
              value={`- ₹${data.couponDiscount.toLocaleString("en-IN")}`}
              valueClass="text-[var(--color-success)]"
            />
          )}

          <Row
            label="Delivery"
            value={
              data.shipping === 0
                ? "Free"
                : `₹${data.shipping.toLocaleString("en-IN")}`
            }
          />

          <div className="border-t border-[var(--color-border)] pt-5">
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                  Total
                </p>

                <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                  Inclusive of applicable taxes
                </p>
              </div>

              <p className="text-xl font-semibold">
                ₹
                {data.total.toLocaleString(
                  "en-IN",
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {data.productSavings > 0 && (
        <div className="mt-4 border border-[var(--color-border)] bg-[var(--color-cream)] px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em]">
            You're saving
          </p>

          <p className="mt-1 text-sm font-semibold text-[var(--color-success)]">
            ₹
            {data.productSavings.toLocaleString(
              "en-IN",
            )}
          </p>
        </div>
      )}
    </aside>
  );
}

function Row({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between gap-5 text-sm">
      <span className="text-[var(--color-text-secondary)]">
        {label}
      </span>

      <span className={valueClass}>
        {value}
      </span>
    </div>
  );
}