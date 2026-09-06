"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  CreditCard,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";

import {
  getOrder,
  type OrderDetails,
} from "@/lib/api/orders";

interface PublicOrderPageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

const getOrderAccessTokenKey = (
  orderNumber: string,
) =>
  `aayesha-order-access-token:${orderNumber}`;

const formatCurrency = (
  value: number,
) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (
  date: string,
) =>
  new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  ).format(new Date(date));

const formatStatus = (
  status: string,
) =>
  status
    .split("_")
    .map(
      (word) =>
        word
          .charAt(0)
          .toUpperCase() +
        word.slice(1),
    )
    .join(" ");

const trackingStatuses = [
  "confirmed",
  "processing",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
];

const getTrackingIndex = (
  status: string,
) => {
  if (status === "in_transit") {
    return 3;
  }

  return trackingStatuses.indexOf(
    status,
  );
};

const getStatusTone = (
  status: string,
) => {
  switch (status) {
    case "delivered":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "cancelled":
      return "border-red-200 bg-red-50 text-red-700";

    case "returned":
    case "exchanged":
      return "border-amber-200 bg-amber-50 text-amber-700";

    default:
      return "border-[#edc6ca] bg-[#fdf2f3] text-[#b86670]";
  }
};

export default function PublicOrderPage({
  params,
}: PublicOrderPageProps) {
  const [orderNumber, setOrderNumber] =
    useState("");

  const [order, setOrder] =
    useState<OrderDetails | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const resolvedParams =
          await params;

        const normalizedOrderNumber =
          resolvedParams.orderNumber
            ?.trim()
            .toUpperCase();

        if (
          !normalizedOrderNumber
        ) {
          throw new Error(
            "Order number is required.",
          );
        }

        const storageKey =
          getOrderAccessTokenKey(
            normalizedOrderNumber,
          );

        const accessToken =
          sessionStorage.getItem(
            storageKey,
          );

        if (!accessToken) {
          throw new Error(
            "Secure order access has expired or is unavailable. Please check your orders from your account.",
          );
        }

        const response =
          await getOrder(
            normalizedOrderNumber,
            accessToken,
          );

        if (cancelled) {
          return;
        }

        setOrderNumber(
          normalizedOrderNumber,
        );

        setOrder(
          response.order,
        );
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        setError(
          requestError instanceof
            Error
            ? requestError.message
            : "Unable to load order details.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-[var(--color-ivory)]">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-5 py-16">
          <div className="w-full border border-[var(--color-border)] bg-white p-8 text-center sm:p-12">
            <div className="mx-auto flex h-14 w-14 animate-pulse items-center justify-center bg-[var(--color-cream)]">
              <ShoppingBag
                size={24}
                strokeWidth={1.5}
              />
            </div>

            <h1 className="mt-6 font-[var(--font-display)] text-3xl text-[var(--color-charcoal)]">
              Loading your order
            </h1>

            <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
              We&apos;re securely retrieving
              your order details.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-[70vh] bg-[var(--color-ivory)]">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-5 py-16">
          <div className="w-full border border-[var(--color-border)] bg-white p-8 text-center sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center bg-[var(--color-rose-light)]">
              <Package
                size={24}
                strokeWidth={1.5}
              />
            </div>

            <h1 className="mt-6 font-[var(--font-display)] text-3xl text-[var(--color-charcoal)]">
              Order unavailable
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--color-text-muted)]">
              {error}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/shop"
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-[var(--color-charcoal)] px-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-white"
              >
                Continue Shopping
                <ArrowUpRight size={15} />
              </Link>

              <Link
                href="/"
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-[var(--color-border)] bg-white px-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-charcoal)]"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const trackingIndex =
    getTrackingIndex(
      order.status,
    );

  const showTracking =
    ![
      "cancelled",
      "returned",
      "exchanged",
    ].includes(order.status);

  return (
    <main className="bg-[var(--color-ivory)]">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <Link
            href={`/checkout/success?orderNumber=${encodeURIComponent(
              orderNumber,
            )}`}
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] transition hover:text-[var(--color-charcoal)]"
          >
            <ArrowLeft size={16} />
            Order Confirmation
          </Link>

          <div className="mt-7 flex flex-col gap-5 sm:mt-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--color-rose-dark)]">
                Aayesha Fashion
              </p>

              <h1 className="mt-2 break-words font-[var(--font-display)] text-3xl leading-tight text-[var(--color-charcoal)] sm:text-4xl">
                Order #{order.orderNumber}
              </h1>

              <div className="mt-3 flex flex-wrap gap-4 text-xs text-[var(--color-text-secondary)]">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  {formatDate(
                    order.createdAt,
                  )}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <ShoppingBag size={14} />
                  {order.items.reduce(
                    (total, item) =>
                      total + item.quantity,
                    0,
                  )}{" "}
                  items
                </span>
              </div>
            </div>

            <span
              className={`inline-flex w-fit rounded-full border px-3.5 py-2 text-xs font-medium ${getStatusTone(
                order.status,
              )}`}
            >
              {formatStatus(
                order.status,
              )}
            </span>
          </div>

          {/* =================================================
              PROGRESS
          ================================================= */}

          {showTracking && (
            <div className="mt-8 overflow-x-auto pb-1">
              <div className="grid min-w-[560px] grid-cols-6 gap-2">
                {trackingStatuses.map(
                  (
                    status,
                    index,
                  ) => {
                    const completed =
                      trackingIndex >=
                      index;

                    return (
                      <div
                        key={status}
                        className="relative"
                      >
                        {index <
                          trackingStatuses.length -
                            1 && (
                          <div
                            className={`absolute left-[calc(50%+14px)] right-[calc(-50%+14px)] top-3 h-px ${
                              trackingIndex >
                              index
                                ? "bg-[#d98791]"
                                : "bg-[#ddd8d3]"
                            }`}
                          />
                        )}

                        <div className="relative flex flex-col items-center">
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                              completed
                                ? "border-[#d98791] bg-[#d98791] text-white"
                                : "border-[#d8d1ca] bg-white text-[#c4bfba]"
                            }`}
                          >
                            {completed ? (
                              <Check
                                size={12}
                              />
                            ) : (
                              <Circle
                                size={7}
                                fill="currentColor"
                              />
                            )}
                          </div>

                          <p className="mt-2 max-w-[90px] text-center text-[10px] leading-4 text-[var(--color-text-muted)]">
                            {status ===
                            "out_for_delivery"
                              ? "Out for Delivery"
                              : status ===
                                  "in_transit"
                                ? "In Transit"
                                : status ===
                                    "processing"
                                  ? "Processing"
                                  : formatStatus(
                                      status,
                                    )}
                          </p>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section>
        <div className="mx-auto grid max-w-6xl gap-5 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_340px] lg:px-10 lg:py-12">
          <div className="space-y-5">
            {/* ITEMS */}

            <div className="border border-[var(--color-border)] bg-white">
              <div className="border-b border-[var(--color-border)] px-5 py-4 sm:px-6">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                  Your Selection
                </p>

                <h2 className="mt-1 font-[var(--font-display)] text-2xl text-[var(--color-charcoal)]">
                  Order Items
                </h2>
              </div>

              <div className="divide-y divide-[var(--color-border)]">
                {order.items.map(
                  (item) => (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      className="flex gap-4 p-5 sm:p-6"
                    >
                      <div className="h-28 w-24 shrink-0 overflow-hidden bg-[var(--color-cream)] sm:h-32 sm:w-28">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Package
                              size={22}
                              strokeWidth={
                                1.4
                              }
                              className="text-[var(--color-text-muted)]"
                            />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                          <div className="min-w-0">
                            <p className="break-words text-sm font-semibold text-[var(--color-charcoal)] sm:text-base">
                              {item.name}
                            </p>

                            <p className="mt-1 break-words text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                              {item.colorName}
                              {item.colorName &&
                              item.sizeLabel
                                ? " · "
                                : ""}
                              {item.sizeLabel}
                            </p>

                            <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
                              Qty:{" "}
                              {item.quantity}
                            </p>
                          </div>

                          <div className="shrink-0 sm:text-right">
                            <p className="text-sm font-semibold text-[var(--color-charcoal)]">
                              {formatCurrency(
                                item.lineTotal,
                              )}
                            </p>

                            <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                              {formatCurrency(
                                item.sellingPrice,
                              )}{" "}
                              each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* ADDRESS + PAYMENT */}

            <div className="grid gap-5 md:grid-cols-2">
              <div className="border border-[var(--color-border)] bg-white p-5 sm:p-6">
                <div className="flex gap-3">
                  <MapPin
                    size={18}
                    className="mt-0.5 shrink-0 text-[var(--color-rose-dark)]"
                  />

                  <div className="min-w-0">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                      Delivery Address
                    </p>

                    <p className="mt-2 text-sm font-semibold text-[var(--color-charcoal)]">
                      {
                        order.shippingAddress
                          .firstName
                      }{" "}
                      {
                        order.shippingAddress
                          .lastName
                      }
                    </p>

                    <div className="mt-2 space-y-1 break-words text-xs leading-5 text-[var(--color-text-secondary)]">
                      <p>
                        {
                          order
                            .shippingAddress
                            .addressLine1
                        }
                      </p>

                      {order
                        .shippingAddress
                        .addressLine2 && (
                        <p>
                          {
                            order
                              .shippingAddress
                              .addressLine2
                          }
                        </p>
                      )}

                      {order
                        .shippingAddress
                        .landmark && (
                        <p>
                          Landmark:{" "}
                          {
                            order
                              .shippingAddress
                              .landmark
                          }
                        </p>
                      )}

                      <p>
                        {
                          order
                            .shippingAddress
                            .city
                        }
                        ,{" "}
                        {
                          order
                            .shippingAddress
                            .state
                        }{" "}
                        {
                          order
                            .shippingAddress
                            .postalCode
                        }
                      </p>

                      <p>
                        {
                          order
                            .shippingAddress
                            .country
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-[var(--color-border)] bg-white p-5 sm:p-6">
                <div className="flex gap-3">
                  <CreditCard
                    size={18}
                    className="mt-0.5 shrink-0 text-[var(--color-rose-dark)]"
                  />

                  <div className="min-w-0">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                      Payment
                    </p>

                    <p className="mt-2 text-sm font-semibold text-[var(--color-charcoal)]">
                      {order.paymentMethod ===
                      "cod"
                        ? "Cash on Delivery"
                        : "Online Payment"}
                    </p>

                    <div className="mt-2 space-y-1 text-xs leading-5 text-[var(--color-text-secondary)]">
                      <p>
                        Payment:{" "}
                        {formatStatus(
                          order.paymentStatus,
                        )}
                      </p>

                      <p>
                        Delivery:{" "}
                        {formatStatus(
                          order.deliveryMethod,
                        )}
                      </p>
                    </div>

                    {order.shippingInfo
                      ?.trackingNumber && (
                      <div className="mt-4 border-t border-[var(--color-border)] pt-4">
                        <div className="flex items-center gap-2">
                          <Truck
                            size={15}
                            className="text-[var(--color-rose-dark)]"
                          />

                          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                            Tracking
                          </span>
                        </div>

                        <p className="mt-2 break-all text-xs text-[var(--color-charcoal)]">
                          {
                            order
                              .shippingInfo
                              .trackingNumber
                          }
                        </p>

                        {order.shippingInfo
                          .trackingUrl && (
                          <a
                            href={
                              order
                                .shippingInfo
                                .trackingUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-charcoal)] underline underline-offset-4"
                          >
                            Track Shipment
                            <ArrowUpRight
                              size={13}
                            />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SUMMARY */}

          <aside className="h-fit border border-[var(--color-border)] bg-white p-5 sm:p-6">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              Price Details
            </p>

            <h2 className="mt-1 font-[var(--font-display)] text-2xl text-[var(--color-charcoal)]">
              Order Summary
            </h2>

            <div className="mt-6 space-y-3 border-t border-[var(--color-border)] pt-5">
              <div className="flex justify-between gap-4 text-xs">
                <span className="text-[var(--color-text-muted)]">
                  MRP Total
                </span>

                <span>
                  {formatCurrency(
                    order.mrpTotal,
                  )}
                </span>
              </div>

              {order.productDiscount >
                0 && (
                <div className="flex justify-between gap-4 text-xs">
                  <span className="text-[var(--color-text-muted)]">
                    Product Discount
                  </span>

                  <span className="text-[var(--color-rose-dark)]">
                    -
                    {formatCurrency(
                      order.productDiscount,
                    )}
                  </span>
                </div>
              )}

              {order.couponDiscount >
                0 && (
                <div className="flex justify-between gap-4 text-xs">
                  <span className="text-[var(--color-text-muted)]">
                    Coupon
                  </span>

                  <span className="text-[var(--color-rose-dark)]">
                    -
                    {formatCurrency(
                      order.couponDiscount,
                    )}
                  </span>
                </div>
              )}

              <div className="flex justify-between gap-4 text-xs">
                <span className="text-[var(--color-text-muted)]">
                  Shipping
                </span>

                <span>
                  {order.shippingAmount ===
                  0
                    ? "FREE"
                    : formatCurrency(
                        order.shippingAmount,
                      )}
                </span>
              </div>
            </div>

            <div className="mt-5 border-t border-[var(--color-border)] pt-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                    Total
                  </p>

                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    {order.paymentMethod ===
                    "cod"
                      ? "Payable on delivery"
                      : "Paid securely"}
                  </p>
                </div>

                <p className="text-2xl font-semibold text-[var(--color-charcoal)]">
                  {formatCurrency(
                    order.total,
                  )}
                </p>
              </div>
            </div>

            <Link
              href="/shop"
              className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 border border-[var(--color-border)] bg-white px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-charcoal)] transition hover:bg-[var(--color-cream)]"
            >
              Continue Shopping
              <ChevronRight size={15} />
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}