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

import {
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
  type Cart,
} from "@/services/cart.service";

/* ============================================================
   COMPONENT
============================================================ */

export function CartContent() {
  const [cart, setCart] = useState<Cart | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [updatingProductId, setUpdatingProductId] =
    useState<string | null>(null);

  const [removingProductId, setRemovingProductId] =
    useState<string | null>(null);

  const [isClearing, setIsClearing] = useState(false);

  /* ==========================================================
     LOAD CART
  ========================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadCart() {
      setIsLoading(true);

      try {
        const response = await getCart();

        if (cancelled) {
          return;
        }

        setCart(response);
      } catch (error) {
        console.error("LOAD CART ERROR:", error);

        if (!cancelled) {
          setCart(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadCart();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ==========================================================
     CART ITEMS
  ========================================================== */

  const cartItems = cart?.items ?? [];

  /* ==========================================================
     SUMMARY
  ========================================================== */

  const summary = useMemo(() => {
    return cartItems.reduce(
      (result, item) => {
        const product = item.product;

        if (!product) {
          return result;
        }

        const quantity = item.quantity;

        const sellingPrice =
          product.pricing.sellingPrice;

        const mrp =
          product.pricing.mrp;

        result.itemCount += quantity;

        result.subtotal +=
          sellingPrice * quantity;

        result.mrpTotal +=
          mrp * quantity;

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
     UPDATE QUANTITY
  ========================================================== */

  const handleUpdateQuantity = async (
    productId: string,
    quantity: number,
  ) => {
    if (quantity < 1) {
      return;
    }

    try {
      setUpdatingProductId(productId);

      const response =
        await updateCartItem(
          productId,
          quantity,
        );

      setCart(response);

      toast.success("Cart updated.");
    } catch (error) {
      console.error(
        "UPDATE CART ERROR:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update cart.",
      );
    } finally {
      setUpdatingProductId(null);
    }
  };

  /* ==========================================================
     REMOVE ITEM
  ========================================================== */

  const handleRemoveItem = async (
    productId: string,
  ) => {
    try {
      setRemovingProductId(productId);

      const response =
        await removeFromCart(productId);

      setCart(response);

      toast.success("Removed from bag.");
    } catch (error) {
      console.error(
        "REMOVE FROM CART ERROR:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to remove item.",
      );
    } finally {
      setRemovingProductId(null);
    }
  };

  /* ==========================================================
     CLEAR CART
  ========================================================== */

  const handleClearCart = async () => {
    try {
      setIsClearing(true);

      const response = await clearCart();

      setCart(response);

      toast.success(
        "Your bag has been cleared.",
      );
    } catch (error) {
      console.error(
        "CLEAR CART ERROR:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to clear your bag.",
      );
    } finally {
      setIsClearing(false);
    }
  };

  /* ==========================================================
     LOADING
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
              {[1, 2].map((item) => (
                <div
                  key={item}
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
        {/* HEADER */}

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

        {/* MAIN */}

        <div className="mt-9 grid gap-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start lg:gap-16">
          {/* ITEMS */}

          <section>
            <div className="border-y border-[var(--color-border)]">
              {cartItems.map((item) => {
                const product = item.product;

                if (!product) {
                  return null;
                }

                const availableStock = Math.max(
                  0,
                  product.inventory.stock -
                    product.inventory.reserved,
                );

                const price =
                  product.pricing.sellingPrice;

                const mrp =
                  product.pricing.mrp;

                const discount =
                  mrp > 0
                    ? Math.round(
                        ((mrp - price) / mrp) *
                          100,
                      )
                    : 0;

                const itemTotal =
                  price * item.quantity;

                const media =
                  product.media.find(
                    (mediaItem) =>
                      mediaItem.type === "image",
                  ) ?? product.media[0];

                const isUpdating =
                  updatingProductId ===
                  item.productId;

                const isRemoving =
                  removingProductId ===
                  item.productId;

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
                    {/* IMAGE */}

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
                      {media?.url ? (
                        <Image
                          src={media.url}
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
                          onClick={() =>
                            void handleRemoveItem(
                              item.productId,
                            )
                          }
                          disabled={
                            isRemoving
                          }
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
                            disabled:cursor-not-allowed
                            disabled:opacity-40
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

                      {/* QUANTITY */}

                      <div className="mt-7 flex flex-wrap items-end justify-between gap-5">
                        <div>
                          <p className="mb-2 font-body text-[9px] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-muted)]">
                            Quantity
                          </p>

                          <div className="flex h-11 border border-[var(--color-border-dark)]">
                            <button
                              type="button"
                              onClick={() =>
                                void handleUpdateQuantity(
                                  item.productId,
                                  item.quantity -
                                    1,
                                )
                              }
                              disabled={
                                item.quantity <=
                                  1 ||
                                isUpdating ||
                                isRemoving
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
                              {isUpdating
                                ? "..."
                                : item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                void handleUpdateQuantity(
                                  item.productId,
                                  item.quantity +
                                    1,
                                )
                              }
                              disabled={
                                availableStock <=
                                  item.quantity ||
                                isUpdating ||
                                isRemoving
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

                        {/* TOTAL */}

                        <div className="text-right">
                          <p className="font-body text-[9px] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-muted)]">
                            Item Total
                          </p>

                          <p className="mt-1 font-body text-sm font-semibold text-[var(--color-text)]">
                            {formatPrice(
                              itemTotal,
                            )}
                          </p>
                        </div>
                      </div>

                      {/* STOCK */}

                      {availableStock > 0 &&
                        availableStock <=
                          product.inventory
                            .lowStockThreshold && (
                          <p className="mt-4 font-body text-[10px] font-semibold text-[var(--color-warning)]">
                            Only {availableStock} left
                          </p>
                        )}

                      {availableStock === 0 && (
                        <p className="mt-4 font-body text-[10px] font-semibold text-[var(--color-error)]">
                          This product is currently
                          unavailable.
                        </p>
                      )}

                      {item.quantity >
                        availableStock &&
                        availableStock > 0 && (
                          <p className="mt-4 font-body text-[10px] font-semibold text-[var(--color-error)]">
                            Only {availableStock} units are
                            currently available. Please
                            reduce the quantity.
                          </p>
                        )}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* CLEAR */}

            <button
              type="button"
              onClick={() =>
                void handleClearCart()
              }
              disabled={isClearing}
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
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              {isClearing
                ? "Clearing..."
                : "Clear Bag"}
            </button>
          </section>

          {/* SUMMARY */}

          <aside className="lg:sticky lg:top-24">
            <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-7">
              <p className="eyebrow text-[var(--color-accent)]">
                Order Summary
              </p>

              <div className="mt-6 space-y-4 border-b border-[var(--color-border-light)] pb-6">
                <SummaryRow
                  label="MRP Total"
                  value={formatPrice(
                    summary.mrpTotal,
                  )}
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
                Secure checkout · Payment and delivery
                options available at checkout
              </p>
            </div>

            {/* CARE */}

            <div className="mt-4 border border-[var(--color-border-light)] bg-[var(--color-bg-soft)] p-5">
              <p className="font-body text-[10px] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text)]">
                Aayesha Care
              </p>

              <p className="mt-2 font-body text-xs leading-6 text-[var(--color-text-secondary)]">
                Your selected product is preserved in your
                bag. Final inventory availability is confirmed
                before order placement.
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