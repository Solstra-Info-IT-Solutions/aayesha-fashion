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
import type { Product } from "@/types/product";
import {
  getAvailableStock,
  getDiscountPercentage,
} from "@/types/product";

/* ============================================================
   RESOLVED CART ITEM
============================================================ */

type ResolvedCartItem = {
  item: {
    productId: string;
    quantity: number;
  };
  product: Product;
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

  const [isLoading, setIsLoading] = useState(true);

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

        const productResults = await Promise.all(
          uniqueProductIds.map(
            async (productId) => {
              try {
                return await getProductById(productId);
              } catch {
                return null;
              }
            },
          ),
        );

        if (cancelled) {
          return;
        }

        const productMap = new Map<string, Product>();

        productResults.forEach((product) => {
          if (product) {
            productMap.set(product.id, product);
          }
        });

        const resolvedItems: ResolvedCartItem[] = [];

        for (const item of items) {
          const product = productMap.get(item.productId);

          if (!product) {
            continue;
          }

          const media =
            product.media.find(
              (mediaItem) => mediaItem.isPrimary,
            ) ??
            product.media.find(
              (mediaItem) => mediaItem.type === "image",
            );

          resolvedItems.push({
            item,
            product,
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
      (result, { item, product }) => {
        const sellingPrice =
          product.pricing.sellingPrice;

        const mrp =
          product.pricing.mrp;

        result.itemCount += item.quantity;

        result.subtotal +=
          sellingPrice * item.quantity;

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
    summary.mrpTotal - summary.subtotal,
  );

  const formatPrice = (value: number) =>
    `₹${value.toLocaleString("en-IN")}`;

  /* ==========================================================
     LOADING STATE
  ========================================================== */

  if (isLoading) {
    return (
      <section className="min-h-screen bg-[var(--color-bg)]">
        <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="border-b border-[var(--color-border-light)] pb-7">
            <div className="h-3 w-28 animate-pulse bg-[var(--color-bg-soft)]" />

            <div className="mt-6 h-12 w-52 animate-pulse bg-[var(--color-bg-soft)]" />
          </div>

          <div className="mt-9 grid gap-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-16">
            <div className="border-y border-[var(--color-border-light)]">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="grid grid-cols-[100px_minmax(0,1fr)] gap-4 border-b border-[var(--color-border-light)] py-6 last:border-b-0 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-6"
                >
                  <div className="aspect-[3/4] animate-pulse bg-[var(--color-bg-soft)]" />

                  <div>
                    <div className="h-3 w-20 animate-pulse bg-[var(--color-bg-soft)]" />

                    <div className="mt-3 h-8 w-52 max-w-full animate-pulse bg-[var(--color-bg-soft)]" />

                    <div className="mt-5 h-4 w-40 animate-pulse bg-[var(--color-bg-soft)]" />

                    <div className="mt-5 h-5 w-28 animate-pulse bg-[var(--color-bg-soft)]" />

                    <div className="mt-6 h-10 w-28 animate-pulse bg-[var(--color-bg-soft)]" />
                  </div>
                </div>
              ))}
            </div>

            <div className="h-[360px] animate-pulse border border-[var(--color-border-light)] bg-[var(--color-surface)]" />
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
      ({ item }) => item.productId,
    ),
  );

  const invalidItems = items.filter(
    (item) =>
      !resolvedItemKeys.has(item.productId),
  );

  /* ==========================================================
     EMPTY CART
  ========================================================== */

  if (!cartItems.length) {
    return (
      <section className="min-h-[70vh] bg-[var(--color-bg)]">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
          <div className="flex h-16 w-16 items-center justify-center border border-[var(--color-border)]">
            <ShoppingBag
              size={22}
              strokeWidth={1.25}
              className="text-[var(--color-text)]"
            />
          </div>

          <p className="eyebrow mt-7 text-[var(--color-accent)]">
            Your Aayesha edit
          </p>

          <h1
            className="
              mt-3
              font-display
              text-[var(--text-heading-lg)]
              font-medium
              leading-[0.95]
              tracking-[var(--tracking-tight)]
              text-[var(--color-text)]
            "
          >
            Your bag is empty.
          </h1>

          <p className="mt-5 max-w-md font-body text-sm leading-7 text-[var(--color-text-secondary)]">
            Discover thoughtfully designed pieces from the
            latest Aayesha collection.
          </p>

          <Link
            href="/shop"
            className="
              mt-8
              inline-flex
              min-h-12
              items-center
              justify-center
              border
              border-[var(--color-text)]
              bg-[var(--color-text)]
              px-7
              py-3.5
              font-body
              text-[10px]
              font-semibold
              uppercase
              tracking-[var(--tracking-wider)]
              text-[var(--color-text-inverse)]
              transition-all
              duration-[var(--duration-base)]
              hover:border-[var(--color-accent-dark)]
              hover:bg-[var(--color-accent-dark)]
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--color-accent)]
              focus:ring-offset-2
            "
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
    <main className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="border-b border-[var(--color-border-light)] pb-7">
          <Link
            href="/shop"
            className="
              link-luxury
              inline-flex
              items-center
              gap-1
              font-body
              text-[10px]
              font-semibold
              uppercase
              tracking-[var(--tracking-wider)]
              text-[var(--color-text-muted)]
              transition-colors
              hover:text-[var(--color-text)]
            "
          >
            <ChevronLeft
              size={14}
              strokeWidth={1.4}
            />

            Continue Shopping
          </Link>

          <div className="mt-7 flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-[var(--color-accent)]">
                Aayesha Fashion
              </p>

              <h1
                className="
                  mt-3
                  font-display
                  text-[var(--text-heading-lg)]
                  font-medium
                  leading-[0.9]
                  tracking-[var(--tracking-tight)]
                  text-[var(--color-text)]
                "
              >
                Your Bag
              </h1>
            </div>

            <div className="text-right">
              <p className="font-body text-xs text-[var(--color-text-muted)]">
                {summary.itemCount}{" "}
                {summary.itemCount === 1
                  ? "item"
                  : "items"}
              </p>

              {savings > 0 && (
                <p className="mt-1 font-body text-[10px] font-semibold text-[var(--color-success)]">
                  You save {formatPrice(savings)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ====================================================
            MAIN
        ==================================================== */}

        <div className="mt-9 grid gap-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start lg:gap-16">
          {/* ==================================================
              ITEMS
          ================================================== */}

          <section>
            {invalidItems.length > 0 && (
              <div
                role="status"
                className="
                  mb-6
                  border
                  border-[var(--color-accent-soft)]
                  bg-[var(--color-bg-soft)]
                  px-4
                  py-4
                  font-body
                  text-xs
                  leading-5
                  text-[var(--color-text)]
                "
              >
                Some saved items are no longer available and
                have been excluded from your bag. Please review
                your selection before checkout.
              </div>
            )}

            <div className="border-y border-[var(--color-border)]">
              {cartItems.map(
                ({
                  item,
                  product,
                  media,
                }) => {
                  const availableStock =
                    getAvailableStock(product);

                  const price =
                    product.pricing.sellingPrice;

                  const mrp =
                    product.pricing.mrp;

                  const discount =
                    getDiscountPercentage(product.pricing);

                  const itemTotal =
                    price * item.quantity;

                  return (
                    <article
                      key={item.productId}
                      className="
                        grid
                        grid-cols-[100px_minmax(0,1fr)]
                        gap-4
                        border-b
                        border-[var(--color-border-light)]
                        py-7
                        last:border-b-0
                        sm:grid-cols-[140px_minmax(0,1fr)]
                        sm:gap-6
                        lg:py-8
                      "
                    >
                      {/* PRODUCT IMAGE */}

                      <Link
                        href={`/products/${product.slug}`}
                        className="
                          group
                          relative
                          aspect-[3/4]
                          overflow-hidden
                          bg-[var(--color-bg-soft)]
                        "
                      >
                        {media?.src ? (
                          <Image
                            src={media.src}
                            alt={
                              media.alt ??
                              product.name
                            }
                            fill
                            className="
                              object-cover
                              transition-transform
                              duration-700
                              ease-[cubic-bezier(0.22,1,0.36,1)]
                              group-hover:scale-[1.025]
                            "
                            sizes="(max-width: 640px) 100px, 140px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center px-2 text-center font-body text-[9px] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
                            No image
                          </div>
                        )}
                      </Link>

                      {/* DETAILS */}

                      <div className="min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-body text-[9px] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-muted)]">
                              Product
                            </p>

                            <Link
                              href={`/products/${product.slug}`}
                              className="
                                mt-1
                                block
                                font-display
                                text-[25px]
                                font-medium
                                leading-tight
                                tracking-[var(--tracking-tight)]
                                text-[var(--color-text)]
                                transition-colors
                                duration-[var(--duration-base)]
                                hover:text-[var(--color-accent-dark)]
                              "
                            >
                              {product.name}
                            </Link>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              removeItem(
                                item.productId,
                              );

                              toast.success(
                                "Removed from bag.",
                              );
                            }}
                            aria-label={`Remove ${product.name}`}
                            className="
                              flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              border
                              border-transparent
                              text-[var(--color-text-muted)]
                              transition-all
                              duration-[var(--duration-base)]
                              hover:border-[var(--color-border)]
                              hover:text-[var(--color-error)]
                              focus:outline-none
                              focus:ring-2
                              focus:ring-[var(--color-accent)]
                            "
                          >
                            <Trash2
                              size={15}
                              strokeWidth={1.35}
                            />
                          </button>
                        </div>

                        {/* SKU */}

                        <p className="mt-4 font-body text-[10px] text-[var(--color-text-muted)]">
                          SKU: {product.id}
                        </p>

                        {/* PRICE */}

                        <div className="mt-5 flex flex-wrap items-baseline gap-2">
                          <span className="font-body text-sm font-semibold text-[var(--color-text)]">
                            {formatPrice(price)}
                          </span>

                          {mrp > price && (
                            <>
                              <span className="font-body text-xs text-[var(--color-text-muted)] line-through">
                                {formatPrice(mrp)}
                              </span>

                              {discount > 0 && (
                                <span className="font-body text-[10px] font-semibold uppercase tracking-wide text-[var(--color-accent-dark)]">
                                  {discount}% Off
                                </span>
                              )}
                            </>
                          )}
                        </div>

                        {/* QUANTITY / TOTAL */}

                        <div className="mt-7 flex flex-wrap items-end justify-between gap-5">
                          <div>
                            <p className="mb-2 font-body text-[9px] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-muted)]">
                              Quantity
                            </p>

                            <div className="flex h-11 border border-[var(--color-border-dark)]">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.quantity - 1,
                                  )
                                }
                                disabled={
                                  item.quantity <= 1
                                }
                                className="
                                  flex
                                  w-10
                                  items-center
                                  justify-center
                                  transition-colors
                                  duration-[var(--duration-fast)]
                                  hover:bg-[var(--color-bg-soft)]
                                  disabled:cursor-not-allowed
                                  disabled:opacity-25
                                  focus:outline-none
                                  focus:ring-2
                                  focus:ring-inset
                                  focus:ring-[var(--color-accent)]
                                "
                                aria-label="Decrease quantity"
                              >
                                <Minus
                                  size={13}
                                  strokeWidth={1.4}
                                />
                              </button>

                              <span className="flex w-10 items-center justify-center border-x border-[var(--color-border-dark)] font-body text-xs font-semibold text-[var(--color-text)]">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.quantity + 1,
                                  )
                                }
                                disabled={
                                  availableStock <= 0 ||
                                  item.quantity >=
                                    availableStock
                                }
                                className="
                                  flex
                                  w-10
                                  items-center
                                  justify-center
                                  transition-colors
                                  duration-[var(--duration-fast)]
                                  hover:bg-[var(--color-bg-soft)]
                                  disabled:cursor-not-allowed
                                  disabled:opacity-25
                                  focus:outline-none
                                  focus:ring-2
                                  focus:ring-inset
                                  focus:ring-[var(--color-accent)]
                                "
                                aria-label="Increase quantity"
                              >
                                <Plus
                                  size={13}
                                  strokeWidth={1.4}
                                />
                              </button>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="font-body text-[9px] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-muted)]">
                              Item Total
                            </p>

                            <p className="mt-1 font-body text-sm font-semibold text-[var(--color-text)]">
                              {formatPrice(itemTotal)}
                            </p>
                          </div>
                        </div>

                        {/* INVENTORY */}

                        {availableStock <=
                          product.inventory.lowStockThreshold &&
                          availableStock > 0 && (
                            <p className="mt-4 font-body text-[10px] font-semibold text-[var(--color-warning)]">
                              Only {availableStock} left
                            </p>
                          )}

                        {availableStock === 0 && (
                          <p className="mt-4 font-body text-[10px] font-semibold text-[var(--color-error)]">
                            This product is currently unavailable.
                          </p>
                        )}

                        {item.quantity > availableStock &&
                          availableStock > 0 && (
                            <p className="mt-4 font-body text-[10px] font-semibold text-[var(--color-error)]">
                              Only {availableStock} units are
                              currently available. Please reduce
                              the quantity.
                            </p>
                          )}
                      </div>
                    </article>
                  );
                },
              )}
            </div>

            {/* CLEAR BAG */}

            <button
              type="button"
              onClick={() => {
                clearCart();

                toast.success(
                  "Your bag has been cleared.",
                );
              }}
              className="
                mt-6
                font-body
                text-[10px]
                font-semibold
                uppercase
                tracking-[var(--tracking-wider)]
                text-[var(--color-text-muted)]
                underline
                underline-offset-4
                transition-colors
                duration-[var(--duration-base)]
                hover:text-[var(--color-error)]
                focus:outline-none
                focus:ring-2
                focus:ring-[var(--color-accent)]
              "
            >
              Clear Bag
            </button>
          </section>

          {/* ==================================================
              SUMMARY
          ================================================== */}

          <aside className="lg:sticky lg:top-24">
            <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-7">
              <p className="eyebrow text-[var(--color-accent)]">
                Order Summary
              </p>

              <div className="mt-6 space-y-4 border-b border-[var(--color-border-light)] pb-6">
                <SummaryRow
                  label="MRP Total"
                  value={formatPrice(summary.mrpTotal)}
                />

                {savings > 0 && (
                  <SummaryRow
                    label="Product Discount"
                    value={`- ${formatPrice(savings)}`}
                    valueClassName="font-semibold text-[var(--color-success)]"
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
                  <p className="font-body text-[10px] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-muted)]">
                    Subtotal
                  </p>

                  <p className="mt-1 max-w-[180px] font-body text-[10px] leading-5 text-[var(--color-text-muted)]">
                    Inclusive of applicable taxes
                  </p>
                </div>

                <p className="font-body text-xl font-semibold text-[var(--color-text)]">
                  {formatPrice(summary.subtotal)}
                </p>
              </div>

              <Link
                href="/checkout"
                className="
                  flex
                  min-h-[54px]
                  w-full
                  items-center
                  justify-center
                  border
                  border-[var(--color-text)]
                  bg-[var(--color-text)]
                  px-6
                  py-3.5
                  font-body
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[var(--tracking-wider)]
                  text-[var(--color-text-inverse)]
                  transition-all
                  duration-[var(--duration-base)]
                  hover:border-[var(--color-accent-dark)]
                  hover:bg-[var(--color-accent-dark)]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--color-accent)]
                  focus:ring-offset-2
                "
              >
                Proceed to Checkout
              </Link>

              <p className="mt-4 text-center font-body text-[10px] leading-5 text-[var(--color-text-muted)]">
                Secure checkout · Payment and delivery options
                available at checkout
              </p>
            </div>

            {/* ==================================================
                CARE CARD
            ================================================== */}

            <div className="mt-4 border border-[var(--color-border-light)] bg-[var(--color-bg-soft)] p-5">
              <p className="font-body text-[10px] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text)]">
                Aayesha Care
              </p>

              <p className="mt-2 font-body text-xs leading-6 text-[var(--color-text-secondary)]">
                Your selected product is preserved in your bag.
                Final inventory availability is confirmed before
                order placement.
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
    <div className="flex items-center justify-between gap-5 font-body text-sm">
      <span className="text-[var(--color-text-secondary)]">
        {label}
      </span>

      <span className={valueClassName}>
        {value}
      </span>
    </div>
  );
}