"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  MapPin,
  PackageCheck,
  ShoppingBag,
} from "lucide-react";

import { getOrder } from "@/lib/api/orders";
import type { OrderDetails } from "@/lib/api/orders";

import { useAuthStore } from "@/store/auth-store";

/* ==========================================================
   HELPERS
========================================================== */

const getOrderAccessTokenKey = (
  orderNumber: string,
) => `aayesha-order-access-token:${orderNumber}`;

const formatCurrency = (
  amount: number,
) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

const formatDate = (
  date: string,
) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

/* ==========================================================
   LOADING UI
========================================================== */

function CheckoutSuccessLoading() {
  return (
    <main className="min-h-[70vh] bg-[var(--color-bg)]">
      <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center justify-center px-5 py-16 sm:px-8">
        <div className="w-full border border-[var(--color-border-light)] bg-[var(--color-surface)] p-8 text-center shadow-[var(--shadow-xs)] sm:p-14">
          <div className="mx-auto flex h-16 w-16 items-center justify-center bg-[var(--color-bg-soft)]">
            <ShoppingBag
              size={24}
              strokeWidth={1.3}
              className="text-[var(--color-text-secondary)]"
            />
          </div>

          <p className="mt-8 font-[var(--font-display)] text-3xl leading-none tracking-[-0.02em] text-[var(--color-text)] sm:text-4xl">
            Confirming your order
          </p>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[var(--color-text-secondary)]">
            We&apos;re securely retrieving your order
            details. Please wait a moment.
          </p>

          <div className="mx-auto mt-7 h-px w-16 animate-pulse bg-[var(--color-accent)]" />
        </div>
      </div>
    </main>
  );
}

/* ==========================================================
   ERROR / EMPTY STATE
========================================================== */

function CheckoutSuccessError({
  error,
}: {
  error: string | null;
}) {
  return (
    <main className="min-h-[70vh] bg-[var(--color-bg)]">
      <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center justify-center px-5 py-16 sm:px-8">
        <div className="w-full border border-[var(--color-border-light)] bg-[var(--color-surface)] p-8 text-center shadow-[var(--shadow-xs)] sm:p-14">
          <div className="mx-auto flex h-16 w-16 items-center justify-center bg-[var(--color-bg-soft)]">
            <Clock3
              size={24}
              strokeWidth={1.3}
              className="text-[var(--color-accent-dark)]"
            />
          </div>

          <p className="mt-8 text-[9px] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
            Order Verification
          </p>

          <h1 className="mt-3 font-[var(--font-display)] text-4xl leading-[0.95] tracking-[-0.02em] text-[var(--color-text)] sm:text-5xl">
            We&apos;re checking your order
          </h1>

          <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[var(--color-text-secondary)]">
            {error ||
              "Your order may still be processing. Please check your orders shortly."}
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/account/orders"
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-[var(--color-text)] px-7 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-inverse)] transition duration-300 hover:bg-[var(--color-accent-dark)]"
            >
              View My Orders
              <ArrowRight size={15} strokeWidth={1.6} />
            </Link>

            <Link
              href="/shop"
              className="inline-flex min-h-12 items-center justify-center border border-[var(--color-border)] bg-[var(--color-surface)] px-7 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text)] transition duration-300 hover:border-[var(--color-text)] hover:bg-[var(--color-bg-soft)]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ==========================================================
   MAIN CONTENT
========================================================== */

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const isInitialized = useAuthStore(
    (state) => state.isInitialized,
  );

  const [orderNumber, setOrderNumber] =
    useState("");

  const [order, setOrder] =
    useState<OrderDetails | null>(null);

  const [publicAccessToken, setPublicAccessToken] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /* ==========================================================
     READ ORDER NUMBER FROM URL
  ========================================================== */

  useEffect(() => {
    const normalizedOrderNumber =
      searchParams
        .get("orderNumber")
        ?.trim()
        .toUpperCase();

    if (!normalizedOrderNumber) {
      setOrderNumber("");
      setError(
        "We could not find an order number for this confirmation page.",
      );
      setLoading(false);
      return;
    }

    setOrderNumber(
      normalizedOrderNumber,
    );
    setError(null);
  }, [searchParams]);

  /* ==========================================================
     LOAD ORDER
  ========================================================== */

  useEffect(() => {
    if (!orderNumber) {
      return;
    }

    let cancelled = false;

    const loadOrder = async () => {
      setLoading(true);
      setError(null);

      try {
        const storageKey =
          getOrderAccessTokenKey(
            orderNumber,
          );

        const storedToken =
          sessionStorage.getItem(
            storageKey,
          );

        if (!storedToken) {
          if (!cancelled) {
            setOrder(null);

            setError(
              "Your secure order access information is unavailable. Please check your orders shortly.",
            );

            setLoading(false);
          }

          return;
        }

        const response =
          await getOrder(
            orderNumber,
            storedToken,
          );

        if (cancelled) {
          return;
        }

        setOrder(
          response.order,
        );

        setPublicAccessToken(
          storedToken,
        );
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        console.error(
          "Checkout success order load error:",
          requestError,
        );

        setOrder(null);

        setError(
          requestError instanceof Error
            ? requestError.message
            : "We could not load your order details.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadOrder();

    return () => {
      cancelled = true;
    };
  }, [orderNumber]);

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return <CheckoutSuccessLoading />;
  }

  /* ==========================================================
     INVALID / ERROR
  ========================================================== */

  if (error || !order) {
    return (
      <CheckoutSuccessError
        error={error}
      />
    );
  }

  const isCod =
    order.paymentMethod === "cod";

  const fullAddress = [
    order.shippingAddress.addressLine1,
    order.shippingAddress.addressLine2,
    order.shippingAddress.landmark,
    order.shippingAddress.city,
    order.shippingAddress.state,
    order.shippingAddress.postalCode,
    order.shippingAddress.country,
  ].filter(Boolean);

  const viewOrderHref =
    isInitialized &&
    isAuthenticated
      ? `/account/orders/${encodeURIComponent(
          order.orderNumber,
        )}`
      : `/orders/${encodeURIComponent(
          order.orderNumber,
        )}`;

  return (
    <main className="bg-[var(--color-bg)]">
      {/* =====================================================
          CONFIRMATION HERO
      ===================================================== */}

      <section className="border-b border-[var(--color-border-light)]">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center border border-[var(--color-border)] bg-[var(--color-surface)]">
              <div className="flex h-10 w-10 items-center justify-center bg-[var(--color-text)] text-[var(--color-text-inverse)]">
                <Check
                  size={21}
                  strokeWidth={1.7}
                />
              </div>
            </div>

            <p className="mt-8 text-[9px] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
              Order Confirmed
            </p>

            <h1 className="mt-4 font-[var(--font-display)] text-5xl leading-[0.9] tracking-[-0.025em] text-[var(--color-text)] sm:text-6xl lg:text-7xl">
              Thank you for your order.
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[var(--color-text-secondary)] sm:text-[15px]">
              Your order has been received and is
              now being prepared with care.
            </p>

            <div className="mx-auto mt-9 inline-flex max-w-full flex-wrap items-center justify-center gap-x-5 gap-y-2 border border-[var(--color-border-light)] bg-[var(--color-surface)] px-5 py-3.5">
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                Order Number
              </span>

              <span className="break-all text-sm font-semibold tracking-[0.05em] text-[var(--color-text)]">
                {order.orderNumber}
              </span>

              <span className="hidden h-4 w-px bg-[var(--color-border)] sm:block" />

              <span className="text-[10px] text-[var(--color-text-muted)]">
                {formatDate(
                  order.createdAt,
                )}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ORDER DETAILS
      ===================================================== */}

      <section>
        <div className="mx-auto grid w-full max-w-[1440px] gap-6 px-5 py-10 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)] lg:px-12 lg:py-16">
          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <div className="space-y-6">
            {/* PAYMENT */}

            <div className="border border-[var(--color-border-light)] bg-[var(--color-surface)] p-6 sm:p-8">
              <div className="flex items-start gap-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[var(--color-bg-soft)]">
                  <CheckCircle2
                    size={19}
                    strokeWidth={1.4}
                    className="text-[var(--color-accent-dark)]"
                  />
                </div>

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                    Payment
                  </p>

                  <h2 className="mt-1.5 text-base font-semibold text-[var(--color-text)]">
                    {isCod
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </h2>

                  <p className="mt-2 max-w-xl text-xs leading-6 text-[var(--color-text-secondary)]">
                    {isCod
                      ? "Please keep the payable amount ready when your order is delivered."
                      : "Your payment has been recorded successfully."}
                  </p>
                </div>
              </div>
            </div>

            {/* ORDER ITEMS */}

            <div className="border border-[var(--color-border-light)] bg-[var(--color-surface)]">
              <div className="flex items-end justify-between gap-5 border-b border-[var(--color-border-light)] px-6 py-6 sm:px-8">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                    Your Selection
                  </p>

                  <h2 className="mt-2 font-[var(--font-display)] text-3xl leading-none tracking-[-0.02em] text-[var(--color-text)]">
                    Order Items
                  </h2>
                </div>

                <span className="shrink-0 text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                  {order.items.length}{" "}
                  {order.items.length === 1
                    ? "Item"
                    : "Items"}
                </span>
              </div>

              <div className="divide-y divide-[var(--color-border-light)]">
                {order.items.map(
                  (item) => (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      className="flex gap-5 px-6 py-6 sm:px-8"
                    >
                      <div className="h-28 w-22 shrink-0 overflow-hidden bg-[var(--color-bg-soft)] sm:h-32 sm:w-28">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ShoppingBag
                              size={18}
                              strokeWidth={1.3}
                              className="text-[var(--color-text-muted)]"
                            />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row">
                          <div className="min-w-0">
                            <p className="break-words font-[var(--font-display)] text-xl leading-tight text-[var(--color-text)] sm:text-2xl">
                              {item.name}
                            </p>

                            {(item.colorName ||
                              item.sizeLabel) && (
                              <p className="mt-2 break-words text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                                {item.colorName}
                                {item.colorName &&
                                item.sizeLabel
                                  ? " · "
                                  : ""}
                                {item.sizeLabel}
                              </p>
                            )}

                            <p className="mt-3 text-[11px] text-[var(--color-text-secondary)]">
                              Quantity{" "}
                              <span className="font-medium text-[var(--color-text)]">
                                {item.quantity}
                              </span>
                            </p>
                          </div>

                          <div className="shrink-0 text-left sm:text-right">
                            <p className="text-sm font-semibold text-[var(--color-text)]">
                              {formatCurrency(
                                item.lineTotal,
                              )}
                            </p>

                            {item.mrp >
                              item.sellingPrice && (
                              <p className="mt-1 text-[10px] text-[var(--color-text-muted)] line-through">
                                {formatCurrency(
                                  item.mrp *
                                    item.quantity,
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* DELIVERY ADDRESS */}

            <div className="border border-[var(--color-border-light)] bg-[var(--color-surface)] p-6 sm:p-8">
              <div className="flex gap-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[var(--color-bg-soft)]">
                  <MapPin
                    size={18}
                    strokeWidth={1.4}
                    className="text-[var(--color-text-secondary)]"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                    Delivery Address
                  </p>

                  <h2 className="mt-1.5 text-base font-semibold text-[var(--color-text)]">
                    {
                      order.shippingAddress
                        .firstName
                    }{" "}
                    {
                      order.shippingAddress
                        .lastName
                    }
                  </h2>

                  <div className="mt-4 space-y-1 break-words text-xs leading-5 text-[var(--color-text-secondary)]">
                    {fullAddress.map(
                      (line, index) => (
                        <p
                          key={`${line}-${index}`}
                        >
                          {line}
                        </p>
                      ),
                    )}
                  </div>

                  <div className="mt-4 space-y-1 break-words border-t border-[var(--color-border-light)] pt-4 text-xs text-[var(--color-text-secondary)]">
                    <p>
                      {order.customerPhone}
                    </p>

                    <p>
                      {order.customerEmail}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT COLUMN
          ================================================= */}

          <aside className="space-y-6">
            {/* ORDER SUMMARY */}

            <div className="border border-[var(--color-border-light)] bg-[var(--color-surface)] p-6 sm:p-8 lg:sticky lg:top-28">
              <div className="flex items-center gap-3">
                <PackageCheck
                  size={19}
                  strokeWidth={1.4}
                  className="text-[var(--color-accent-dark)]"
                />

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                    Your Purchase
                  </p>

                  <h2 className="mt-1 font-[var(--font-display)] text-3xl leading-none tracking-[-0.02em] text-[var(--color-text)]">
                    Order Summary
                  </h2>
                </div>
              </div>

              <div className="mt-7 space-y-4 border-t border-[var(--color-border-light)] pt-6">
                <div className="flex items-center justify-between gap-5 text-xs">
                  <span className="text-[var(--color-text-muted)]">
                    MRP Total
                  </span>

                  <span className="font-medium text-[var(--color-text)]">
                    {formatCurrency(
                      order.mrpTotal,
                    )}
                  </span>
                </div>

                {order.productDiscount >
                  0 && (
                  <div className="flex items-center justify-between gap-5 text-xs">
                    <span className="text-[var(--color-text-muted)]">
                      Product Savings
                    </span>

                    <span className="font-medium text-[var(--color-success)]">
                      -
                      {formatCurrency(
                        order.productDiscount,
                      )}
                    </span>
                  </div>
                )}

                {order.couponDiscount >
                  0 && (
                  <div className="flex items-center justify-between gap-5 text-xs">
                    <span className="text-[var(--color-text-muted)]">
                      {order.couponCode ||
                        "Coupon"}
                    </span>

                    <span className="font-medium text-[var(--color-success)]">
                      -
                      {formatCurrency(
                        order.couponDiscount,
                      )}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-5 text-xs">
                  <span className="text-[var(--color-text-muted)]">
                    {order.deliveryMethod ===
                    "express"
                      ? "Express Delivery"
                      : "Standard Delivery"}
                  </span>

                  <span className="font-medium text-[var(--color-text)]">
                    {order.shippingAmount ===
                    0
                      ? "FREE"
                      : formatCurrency(
                          order.shippingAmount,
                        )}
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t border-[var(--color-border-light)] pt-6">
                <div className="flex items-end justify-between gap-5">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                      Total
                    </p>

                    <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
                      {isCod
                        ? "Payable on delivery"
                        : "Paid securely"}
                    </p>
                  </div>

                  <p className="font-[var(--font-display)] text-3xl leading-none text-[var(--color-text)]">
                    {formatCurrency(
                      order.total,
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* STATUS */}

            <div className="bg-[var(--color-text)] p-6 text-[var(--color-text-inverse)] sm:p-8">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                Current Status
              </p>

              <div className="mt-6 flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/15 bg-white/[0.04]">
                  <Check
                    size={16}
                    strokeWidth={1.7}
                  />
                </div>

                <div className="min-w-0">
                  <p className="break-words text-sm font-semibold capitalize">
                    {order.status.replace(
                      /_/g,
                      " ",
                    )}
                  </p>

                  <p className="mt-1.5 text-[10px] leading-5 text-white/50">
                    We&apos;ll keep you updated as
                    your order progresses.
                  </p>
                </div>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="border border-[var(--color-border-light)] bg-[var(--color-surface)] p-6 sm:p-8">
              {publicAccessToken ? (
                <Link
                  href={viewOrderHref}
                  className="group flex min-h-12 w-full items-center justify-center gap-2 bg-[var(--color-text)] px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-inverse)] transition duration-300 hover:bg-[var(--color-accent-dark)]"
                >
                  View Order
                  <ArrowRight
                    size={15}
                    strokeWidth={1.6}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              ) : null}

              <Link
                href="/shop"
                className="mt-3 flex min-h-12 w-full items-center justify-center border border-[var(--color-border)] bg-[var(--color-surface)] px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text)] transition duration-300 hover:border-[var(--color-text)] hover:bg-[var(--color-bg-soft)]"
              >
                Continue Shopping
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* =====================================================
          CLOSING NOTE
      ===================================================== */}

      <section className="border-t border-[var(--color-border-light)]">
        <div className="mx-auto flex w-full max-w-[1440px] items-center gap-4 px-5 py-9 sm:px-8 lg:px-12">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[var(--color-bg-soft)]">
            <CheckCircle2
              size={16}
              strokeWidth={1.4}
              className="text-[var(--color-accent-dark)]"
            />
          </div>

          <p className="max-w-2xl text-[10px] leading-5 text-[var(--color-text-muted)]">
            Thank you for choosing Aayesha Fashion.
            Your order has been successfully recorded
            and our team will begin processing it shortly.
          </p>
        </div>
      </section>
    </main>
  );
}

/* ==========================================================
   PAGE
========================================================== */

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <CheckoutSuccessLoading />
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}