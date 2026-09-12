"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { getProductById } from "@/lib/api/products";
import type {
  Product,
  ProductVariant,
} from "@/types/product";

import { useCartStore } from "@/store/cart-store";
import { useCheckoutStore } from "@/store/checkout-store";

type ResolvedCheckoutItem = {
  cartItem: {
    productId: string;
    variantId: string;
    quantity: number;
  };

  product: Product;

  variant: ProductVariant;

  image?: Product["media"][number];
};

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

  const couponDiscount = useCheckoutStore(
    (state) => state.couponDiscount,
  );

  const couponShippingDiscount =
    useCheckoutStore(
      (state) =>
        state.couponShippingDiscount,
    );

  const [items, setItems] = useState<
    ResolvedCheckoutItem[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  /* ==========================================================
     LOAD PRODUCTS FROM BACKEND
  ========================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      if (!cartItems.length) {
        setItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const productIds =
          Array.from(
            new Set(
              cartItems.map(
                (item) =>
                  item.productId,
              ),
            ),
          );

        const responses =
          await Promise.all(
            productIds.map(
              async (
                productId,
              ) => {
                try {
                  return await getProductById(
                    productId,
                  );
                } catch {
                  return null;
                }
              },
            ),
          );

        if (cancelled) {
          return;
        }

        const productMap =
          new Map<
            string,
            Product
          >();

        responses.forEach(
          (product) => {
            if (product) {
              productMap.set(
                product.id,
                product,
              );
            }
          },
        );

        const resolved: ResolvedCheckoutItem[] =
          [];

        for (
          const cartItem of cartItems
        ) {
          const product =
            productMap.get(
              cartItem.productId,
            );

          if (!product) {
            continue;
          }

          const variant =
            product.variants.find(
              (item) =>
                item.id ===
                cartItem.variantId,
            );

          if (!variant) {
            continue;
          }

          const image =
            product.media.find(
              (media) =>
                variant.mediaIds?.includes(
                  media.id,
                ),
            ) ??
            product.media.find(
              (media) =>
                media.isPrimary,
            ) ??
            product.media.find(
              (media) =>
                media.type ===
                "image",
            );

          resolved.push({
            cartItem,

            product,

            variant,

            image,
          });
        }

        setItems(resolved);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, [cartItems]);

  /* ==========================================================
     SUMMARY
  ========================================================== */

  let subtotal = 0;

  let mrpTotal = 0;

  for (
    const item of items
  ) {
    subtotal +=
      item.variant.pricing
        .sellingPrice *
      item.cartItem.quantity;

    mrpTotal +=
      item.variant.pricing.mrp *
      item.cartItem.quantity;
  }

  /*
   * Base shipping before coupon.
   */
  const baseShipping =
    delivery === "express"
      ? 199
      : subtotal >= 2999
        ? 0
        : 99;

  /*
   * Coupon can discount shipping.
   *
   * Backend has already validated this amount.
   */
  const shipping = Math.max(
    0,
    baseShipping -
      couponShippingDiscount,
  );

  const productSavings =
    Math.max(
      0,
      mrpTotal -
        subtotal,
    );

  /*
   * Coupon discount is now taken
   * directly from checkout-store.
   *
   * It is populated by the backend
   * coupon validation API.
   */
  const total = Math.max(
    0,
    subtotal +
      shipping -
      couponDiscount,
  );

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <aside className="lg:sticky lg:top-28">
      <div className="border border-[var(--color-border)] bg-white">
        {/* HEADER */}

        <div className="border-b border-[var(--color-border)] px-6 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
            Order Summary
          </p>

          <p className="mt-2 font-[var(--font-cormorant)] text-2xl">
            Your Ayesha edit
          </p>
        </div>

        {/* PRODUCTS */}

        <div className="max-h-[420px] overflow-y-auto">
          {loading ? (
            <CheckoutItemsSkeleton />
          ) : items.length ? (
            items.map(
              ({
                cartItem,
                product,
                variant,
                image,
              }) => {
                return (
                  <div
                    key={`${cartItem.productId}-${cartItem.variantId}`}
                    className="flex gap-4 border-b border-[var(--color-border)] px-6 py-4"
                  >
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-[var(--color-cream)]">
                      {image?.src ? (
                        <Image
                          src={
                            image.src
                          }
                          alt={
                            image.alt ??
                            product.name
                          }
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[8px] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
                          No image
                        </div>
                      )}

                      <span className="absolute bottom-1 right-1 flex h-5 min-w-5 items-center justify-center bg-[var(--color-charcoal)] px-1 text-[8px] font-semibold text-white">
                        {
                          cartItem.quantity
                        }
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-[var(--font-cormorant)] text-lg leading-tight">
                        {
                          product.name
                        }
                      </p>

                      <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                        {
                          variant
                            .color
                            .name
                        }{" "}
                        ·{" "}
                        {
                          variant
                            .size
                            .label
                        }
                      </p>

                      <p className="mt-2 text-xs font-semibold">
                        ₹
                        {variant.pricing.sellingPrice.toLocaleString(
                          "en-IN",
                        )}
                      </p>
                    </div>
                  </div>
                );
              },
            )
          ) : (
            <div className="px-6 py-8 text-center text-xs text-[var(--color-text-muted)]">
              Your bag is empty.
            </div>
          )}
        </div>

        {/* TOTALS */}

        <div className="space-y-4 px-6 py-5">
          <SummaryRow
            label="MRP Total"
            value={`₹${mrpTotal.toLocaleString(
              "en-IN",
            )}`}
          />

          {productSavings > 0 && (
            <SummaryRow
              label="Product Discount"
              value={`- ₹${productSavings.toLocaleString(
                "en-IN",
              )}`}
              valueClass="text-[var(--color-success)]"
            />
          )}

          {couponDiscount > 0 &&
            couponCode && (
              <SummaryRow
                label={`Coupon (${couponCode.toUpperCase()})`}
                value={`- ₹${couponDiscount.toLocaleString(
                  "en-IN",
                )}`}
                valueClass="text-[var(--color-success)]"
              />
            )}

          {couponShippingDiscount >
            0 && (
            <SummaryRow
              label={`Shipping Discount (${couponCode.toUpperCase()})`}
              value={`- ₹${couponShippingDiscount.toLocaleString(
                "en-IN",
              )}`}
              valueClass="text-[var(--color-success)]"
            />
          )}

          <SummaryRow
            label="Delivery"
            value={
              shipping === 0
                ? "Free"
                : `₹${shipping.toLocaleString(
                    "en-IN",
                  )}`
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
                {total.toLocaleString(
                  "en-IN",
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {productSavings > 0 && (
        <div className="mt-4 border border-[var(--color-border)] bg-[var(--color-cream)] px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em]">
            You&apos;re saving
          </p>

          <p className="mt-1 text-sm font-semibold text-[var(--color-success)]">
            ₹
            {productSavings.toLocaleString(
              "en-IN",
            )}
          </p>
        </div>
      )}
    </aside>
  );
}

/* ============================================================
   SUMMARY ROW
============================================================ */

function SummaryRow({
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

/* ============================================================
   SKELETON
============================================================ */

function CheckoutItemsSkeleton() {
  return (
    <>
      {Array.from({
        length: 2,
      }).map(
        (_, index) => (
          <div
            key={index}
            className="flex gap-4 border-b border-[var(--color-border)] px-6 py-4"
          >
            <div className="h-20 w-16 animate-pulse bg-[var(--color-cream)]" />

            <div className="flex-1">
              <div className="h-5 w-32 animate-pulse bg-[var(--color-cream)]" />

              <div className="mt-2 h-3 w-24 animate-pulse bg-[var(--color-cream)]" />

              <div className="mt-3 h-4 w-16 animate-pulse bg-[var(--color-cream)]" />
            </div>
          </div>
        ),
      )}
    </>
  );
}