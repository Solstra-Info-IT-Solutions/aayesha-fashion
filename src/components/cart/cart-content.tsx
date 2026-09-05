"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import { useCartStore } from "@/store/cart-store";
import { getProductById } from "@/lib/api/products";
import type {
  Product,
  ProductVariant,
} from "@/types/product";
import {
  getVariantAvailableStock,
  getDiscountPercentage,
} from "@/types/product";

/* ============================================================
   RESOLVED CART ITEM
============================================================ */

type ResolvedCartItem = {
  item: {
    productId: string;
    variantId: string;
    quantity: number;
  };
  product: Product;
  variant: ProductVariant;
  media?: Product["media"][number];
};

/* ============================================================
   COMPONENT
============================================================ */

export function CartContent() {
  const items = useCartStore((state) => state.items);

  const updateQuantity = useCartStore(
    (state) => state.updateQuantity,
  );

  const removeItem = useCartStore(
    (state) => state.removeItem,
  );

  const clearCart = useCartStore(
    (state) => state.clearCart,
  );

  const [cartItems, setCartItems] = useState<
    ResolvedCartItem[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  /* ==========================================================
     LOAD PRODUCTS FROM BACKEND
  ========================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadCartProducts() {
      if (!items.length) {
        setCartItems([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const uniqueProductIds = Array.from(
          new Set(
            items.map(
              (item) => item.productId,
            ),
          ),
        );

        const productResults =
          await Promise.all(
            uniqueProductIds.map(
              async (productId) => {
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

        const productMap = new Map<
          string,
          Product
        >();

        productResults.forEach((product) => {
          if (product) {
            productMap.set(
              product.id,
              product,
            );
          }
        });

        const resolvedItems: ResolvedCartItem[] =
          [];

        for (const item of items) {
          const product = productMap.get(
            item.productId,
          );

          if (!product) {
            continue;
          }

          const variant =
            product.variants.find(
              (productVariant) =>
                productVariant.id ===
                item.variantId,
            );

          if (!variant) {
            continue;
          }

          const media =
            product.media.find(
              (mediaItem) =>
                variant.mediaIds?.includes(
                  mediaItem.id,
                ),
            ) ??
            product.media.find(
              (mediaItem) =>
                mediaItem.isPrimary,
            ) ??
            product.media.find(
              (mediaItem) =>
                mediaItem.type === "image",
            );

          resolvedItems.push({
            item,
            product,
            variant,
            media,
          });
        }

        setCartItems(resolvedItems);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadCartProducts();

    return () => {
      cancelled = true;
    };
  }, [items]);

  /* ==========================================================
     SUMMARY
  ========================================================== */

  const summary = useMemo(() => {
    return cartItems.reduce(
      (result, { item, variant }) => {
        const sellingPrice =
          variant.pricing.sellingPrice;

        const mrp =
          variant.pricing.mrp;

        result.itemCount +=
          item.quantity;

        result.subtotal +=
          sellingPrice *
          item.quantity;

        result.mrpTotal +=
          mrp * item.quantity;

        return result;
      },
      {
        itemCount: 0,
        subtotal: 0,
        mrpTotal: 0,
      },
    );
  }, [cartItems]);

  const savings = Math.max(
    0,
    summary.mrpTotal -
      summary.subtotal,
  );

  const formatPrice = (
    value: number,
  ) =>
    `₹${value.toLocaleString(
      "en-IN",
    )}`;

  /* ==========================================================
     LOADING STATE
  ========================================================== */

  if (isLoading) {
    return (
      <section className="bg-[var(--color-ivory)]">
        <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
          <div className="border-b border-[var(--color-border)] pb-7">
            <div className="h-4 w-28 animate-pulse bg-[var(--color-cream)]" />

            <div className="mt-6 h-12 w-52 animate-pulse bg-[var(--color-cream)]" />
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-16">
            <div className="border-y border-[var(--color-border)]">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="grid grid-cols-[100px_minmax(0,1fr)] gap-4 border-b border-[var(--color-border)] py-6 last:border-b-0 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-6"
                >
                  <div className="aspect-[3/4] animate-pulse bg-[var(--color-cream)]" />

                  <div>
                    <div className="h-3 w-20 animate-pulse bg-[var(--color-cream)]" />

                    <div className="mt-3 h-8 w-52 max-w-full animate-pulse bg-[var(--color-cream)]" />

                    <div className="mt-5 h-4 w-40 animate-pulse bg-[var(--color-cream)]" />

                    <div className="mt-5 h-5 w-28 animate-pulse bg-[var(--color-cream)]" />

                    <div className="mt-6 h-10 w-28 animate-pulse bg-[var(--color-cream)]" />
                  </div>
                </div>
              ))}
            </div>

            <div className="h-[360px] animate-pulse border border-[var(--color-border)] bg-white" />
          </div>
        </div>
      </section>
    );
  }

  /* ==========================================================
     CLEAN INVALID CART ITEMS
  ========================================================== */

  const resolvedItemKeys = new Set(
    cartItems.map(
      ({ item }) =>
        `${item.productId}-${item.variantId}`,
    ),
  );

  const invalidItems = items.filter(
    (item) =>
      !resolvedItemKeys.has(
        `${item.productId}-${item.variantId}`,
      ),
  );

  /*
   * Do not mutate the cart automatically while
   * rendering. Invalid persisted items are simply
   * excluded from the UI until the user clears them.
   */

  /* ==========================================================
     EMPTY CART
  ========================================================== */

  if (!cartItems.length) {
    return (
      <section className="min-h-[65vh] bg-[var(--color-ivory)]">
        <div className="mx-auto flex min-h-[65vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
          <div className="flex h-16 w-16 items-center justify-center border border-[var(--color-border)]">
            <ShoppingBag
              size={22}
              strokeWidth={1.4}
            />
          </div>

          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            Your Ayesha edit
          </p>

          <h1 className="mt-2 font-[var(--font-cormorant)] text-4xl leading-none sm:text-5xl">
            Your bag is empty.
          </h1>

          <p className="mt-4 max-w-md text-sm leading-7 text-[var(--color-text-secondary)]">
            Discover thoughtfully designed
            pieces from the latest Ayesha
            collection.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-flex min-h-12 items-center justify-center bg-[var(--color-charcoal)] px-7 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[var(--color-charcoal-soft)]"
          >
            Explore Collection
          </Link>
        </div>
      </section>
    );
  }

  /* ==========================================================
     CART
  ========================================================== */

  return (
    <main className="bg-[var(--color-ivory)]">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-12 lg:px-10 lg:py-16">
        {/* HEADER */}

        <div className="border-b border-[var(--color-border)] pb-7">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)] transition hover:text-[var(--color-charcoal)]"
          >
            <ChevronLeft size={14} />
            Continue Shopping
          </Link>

          <div className="mt-6 flex items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                Ayesha Fashion
              </p>

              <h1 className="mt-2 font-[var(--font-cormorant)] text-4xl leading-none sm:text-5xl">
                Your Bag
              </h1>
            </div>

            <div className="text-right">
              <p className="text-xs text-[var(--color-text-muted)]">
                {summary.itemCount}{" "}
                {summary.itemCount === 1
                  ? "item"
                  : "items"}
              </p>

              {savings > 0 && (
                <p className="mt-1 text-[10px] font-semibold text-[var(--color-success)]">
                  You save{" "}
                  {formatPrice(savings)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* MAIN */}

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start lg:gap-16">
          {/* ITEMS */}

          <section>
            {invalidItems.length > 0 && (
              <div className="mb-5 border border-[var(--color-rose-light)] bg-[var(--color-rose-light)] px-4 py-3 text-xs leading-5 text-[var(--color-charcoal)]">
                Some saved items are no
                longer available and have
                been excluded from your bag.
                Please review your selection
                before checkout.
              </div>
            )}

            <div className="border-y border-[var(--color-border)]">
              {cartItems.map(
                ({
                  item,
                  product,
                  variant,
                  media,
                }) => {
                  const availableStock =
                    getVariantAvailableStock(
                      variant,
                    );

                  const price =
                    variant.pricing
                      .sellingPrice;

                  const mrp =
                    variant.pricing.mrp;

                  const discount =
                    getDiscountPercentage(
                      variant.pricing,
                    );

                  const itemTotal =
                    price *
                    item.quantity;

                  return (
                    <article
                      key={`${item.productId}-${item.variantId}`}
                      className="grid grid-cols-[100px_minmax(0,1fr)] gap-4 border-b border-[var(--color-border)] py-6 last:border-b-0 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-6"
                    >
                      {/* PRODUCT IMAGE */}

                      <Link
                        href={`/products/${product.slug}`}
                        className="relative aspect-[3/4] overflow-hidden bg-[var(--color-cream)]"
                      >
                        {media?.src ? (
                          <Image
                            src={media.src}
                            alt={
                              media.alt ??
                              product.name
                            }
                            fill
                            className="object-cover transition duration-500 hover:scale-[1.02]"
                            sizes="140px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
                            No image
                          </div>
                        )}
                      </Link>

                      {/* DETAILS */}

                      <div className="min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                              {
                                product.category
                              }
                            </p>

                            <Link
                              href={`/products/${product.slug}`}
                              className="mt-1 block font-[var(--font-cormorant)] text-[24px] leading-tight transition hover:text-[var(--color-rose-dark)]"
                            >
                              {
                                product.name
                              }
                            </Link>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              removeItem(
                                item.productId,
                                item.variantId,
                              );

                              toast.success(
                                "Removed from bag.",
                              );
                            }}
                            aria-label={`Remove ${product.name}`}
                            className="flex h-9 w-9 shrink-0 items-center justify-center text-[var(--color-text-muted)] transition hover:text-[var(--color-error)]"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* VARIANT DETAILS */}

                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs">
                          <span className="text-[var(--color-text-secondary)]">
                            Color:{" "}
                            <strong className="font-medium text-[var(--color-charcoal)]">
                              {
                                variant
                                  .color
                                  .name
                              }
                            </strong>
                          </span>

                          <span className="text-[var(--color-text-secondary)]">
                            Size:{" "}
                            <strong className="font-medium text-[var(--color-charcoal)]">
                              {
                                variant
                                  .size
                                  .label
                              }
                            </strong>
                          </span>
                        </div>

                        <p className="mt-2 text-[10px] text-[var(--color-text-muted)]">
                          SKU:{" "}
                          {variant.sku}
                        </p>

                        {/* PRICE */}

                        <div className="mt-4 flex flex-wrap items-baseline gap-2">
                          <span className="text-sm font-semibold">
                            {formatPrice(
                              price,
                            )}
                          </span>

                          {mrp > price && (
                            <>
                              <span className="text-xs text-[var(--color-text-muted)] line-through">
                                {formatPrice(
                                  mrp,
                                )}
                              </span>

                              {discount >
                                0 && (
                                <span className="text-[10px] font-semibold text-[var(--color-rose-dark)]">
                                  {
                                    discount
                                  }
                                  % OFF
                                </span>
                              )}
                            </>
                          )}
                        </div>

                        {/* QUANTITY / TOTAL */}

                        <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
                          <div>
                            <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                              Quantity
                            </p>

                            <div className="flex h-10 border border-[var(--color-border-dark)]">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.quantity -
                                      1,
                                    item.variantId,
                                  )
                                }
                                disabled={
                                  item.quantity <=
                                  1
                                }
                                className="flex w-10 items-center justify-center transition hover:bg-[var(--color-cream)] disabled:cursor-not-allowed disabled:opacity-25"
                                aria-label="Decrease quantity"
                              >
                                <Minus
                                  size={
                                    14
                                  }
                                />
                              </button>

                              <span className="flex w-10 items-center justify-center border-x border-[var(--color-border-dark)] text-xs font-semibold">
                                {
                                  item.quantity
                                }
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.quantity +
                                      1,
                                    item.variantId,
                                  )
                                }
                                disabled={
                                  availableStock <=
                                    0 ||
                                  item.quantity >=
                                    availableStock
                                }
                                className="flex w-10 items-center justify-center transition hover:bg-[var(--color-cream)] disabled:cursor-not-allowed disabled:opacity-25"
                                aria-label="Increase quantity"
                              >
                                <Plus
                                  size={
                                    14
                                  }
                                />
                              </button>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                              Item Total
                            </p>

                            <p className="mt-1 text-sm font-semibold">
                              {formatPrice(
                                itemTotal,
                              )}
                            </p>
                          </div>
                        </div>

                        {/* INVENTORY */}

                        {availableStock <=
                          variant
                            .inventory
                            .lowStockThreshold &&
                          availableStock >
                            0 && (
                            <p className="mt-4 text-[10px] font-semibold text-[var(--color-rose-dark)]">
                              Only{" "}
                              {
                                availableStock
                              }{" "}
                              left in this
                              size
                            </p>
                          )}

                        {availableStock ===
                          0 && (
                          <p className="mt-4 text-[10px] font-semibold text-[var(--color-error)]">
                            This variant
                            is currently
                            unavailable.
                          </p>
                        )}

                        {item.quantity >
                          availableStock &&
                          availableStock >
                            0 && (
                            <p className="mt-4 text-[10px] font-semibold text-[var(--color-error)]">
                              Only{" "}
                              {
                                availableStock
                              }{" "}
                              units are
                              currently
                              available.
                              Please reduce
                              the quantity.
                            </p>
                          )}
                      </div>
                    </article>
                  );
                },
              )}
            </div>

            {/* CLEAR CART */}

            <button
              type="button"
              onClick={() => {
                clearCart();

                toast.success(
                  "Your bag has been cleared.",
                );
              }}
              className="mt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)] underline underline-offset-4 transition hover:text-[var(--color-error)]"
            >
              Clear Bag
            </button>
          </section>

          {/* SUMMARY */}

          <aside className="lg:sticky lg:top-28">
            <div className="border border-[var(--color-border)] bg-white p-6 sm:p-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                Order Summary
              </p>

              <div className="mt-6 space-y-4 border-b border-[var(--color-border)] pb-6">
                <SummaryRow
                  label="MRP Total"
                  value={formatPrice(
                    summary.mrpTotal,
                  )}
                />

                {savings > 0 && (
                  <SummaryRow
                    label="Product Discount"
                    value={`- ${formatPrice(
                      savings,
                    )}`}
                    valueClassName="text-[var(--color-success)]"
                  />
                )}

                <SummaryRow
                  label="Shipping"
                  value="Calculated at checkout"
                  valueClassName="text-[var(--color-text-muted)]"
                />
              </div>

              <div className="flex items-end justify-between gap-5 py-6">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    Subtotal
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-[var(--color-text-muted)]">
                    Inclusive of applicable
                    taxes
                  </p>
                </div>

                <p className="text-xl font-semibold">
                  {formatPrice(
                    summary.subtotal,
                  )}
                </p>
              </div>

              <Link
                href="/checkout"
                className="flex min-h-[52px] w-full items-center justify-center bg-[var(--color-charcoal)] px-6 text-[10px] font-semibold uppercase tracking-[0.17em] text-white transition hover:bg-[var(--color-charcoal-soft)]"
              >
                Proceed to Checkout
              </Link>

              <p className="mt-4 text-center text-[10px] leading-5 text-[var(--color-text-muted)]">
                Secure checkout · Payment
                and delivery options
                available at checkout
              </p>
            </div>

            {/* CARE CARD */}

            <div className="mt-4 border border-[var(--color-border)] bg-[var(--color-cream)] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em]">
                Ayesha Care
              </p>

              <p className="mt-2 text-xs leading-6 text-[var(--color-text-secondary)]">
                Your selected color,
                size and variant are
                preserved in your bag.
                Final inventory
                availability is
                confirmed before order
                placement.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   SUMMARY ROW
============================================================ */

function SummaryRow({
  label,
  value,
  valueClassName = "",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-5 text-sm">
      <span className="text-[var(--color-text-secondary)]">
        {label}
      </span>

      <span className={valueClassName}>
        {value}
      </span>
    </div>
  );
}