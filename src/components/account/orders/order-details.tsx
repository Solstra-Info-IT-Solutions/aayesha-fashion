"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  getCustomerOrder,
  type OrderDetails as OrderDetailsData,
} from "@/lib/api/orders";
import { useAuthStore } from "@/store/auth-store";

interface OrderDetailsProps {
  orderNumber: string;
}

/* ==========================================================
   HELPERS
========================================================== */

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

const formatStatus = (status: string) =>
  status
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");

const getStatusLabel = (status: string) => {
  switch (status) {
    case "confirmed":
      return "Order Confirmed";

    case "processing":
      return "Being Prepared";

    case "packed":
      return "Packed & Ready";

    case "shipped":
      return "Shipped";

    case "in_transit":
      return "In Transit";

    case "out_for_delivery":
      return "Out for Delivery";

    case "delivered":
      return "Delivered";

    case "cancelled":
      return "Order Cancelled";

    case "returned":
      return "Order Returned";

    case "exchanged":
      return "Order Exchanged";

    default:
      return formatStatus(status);
  }
};

const getStatusTone = (status: string) => {
  switch (status) {
    case "delivered":
      return "border-[var(--color-success)]/25 bg-[var(--color-success)]/5 text-[var(--color-success)]";

    case "cancelled":
      return "border-[var(--color-error)]/25 bg-[var(--color-error)]/5 text-[var(--color-error)]";

    case "returned":
    case "exchanged":
      return "border-[var(--color-warning)]/25 bg-[var(--color-warning)]/5 text-[var(--color-warning)]";

    default:
      return "border-[var(--color-accent-soft)] bg-[var(--color-bg-soft)] text-[var(--color-accent-dark)]";
  }
};

/* ==========================================================
   TRACKING
========================================================== */

const trackingStatuses = [
  "confirmed",
  "processing",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
];

const getTrackingIndex = (status: string) => {
  if (status === "in_transit") {
    return 3;
  }

  return trackingStatuses.indexOf(status);
};

/* ==========================================================
   LOADING UI
========================================================== */

function OrderDetailsLoading() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12">
      <div className="animate-pulse space-y-6">
        <div className="h-4 w-28 bg-[var(--color-bg-soft)]" />

        <div className="overflow-hidden border border-[var(--color-border-light)] bg-[var(--color-surface)]">
          <div className="h-1 bg-[var(--color-bg-soft)]" />

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="h-3 w-28 bg-[var(--color-bg-soft)]" />

            <div className="mt-4 h-10 w-64 bg-[var(--color-bg-soft)]" />

            <div className="mt-5 h-4 w-72 bg-[var(--color-bg-soft)]" />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="h-[460px] border border-[var(--color-border-light)] bg-[var(--color-bg-subtle)]" />

          <div className="h-[460px] border border-[var(--color-border-light)] bg-[var(--color-bg-subtle)]" />
        </div>
      </div>
    </section>
  );
}

/* ==========================================================
   ERROR UI
========================================================== */

function OrderDetailsError({
  error,
}: {
  error: string;
}) {
  return (
    <section className="mx-auto flex min-h-[65vh] w-full max-w-3xl items-center justify-center px-5 py-14 sm:px-8">
      <div className="w-full border border-[var(--color-border-light)] bg-[var(--color-surface)] px-6 py-14 text-center shadow-[var(--shadow-xs)] sm:px-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center bg-[var(--color-bg-soft)]">
          <Package
            size={25}
            strokeWidth={1.4}
            className="text-[var(--color-accent-dark)]"
          />
        </div>

        <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
          My Orders
        </p>

        <h1 className="mt-3 font-[var(--font-display)] text-4xl leading-none tracking-[-0.02em] text-[var(--color-text)] sm:text-5xl">
          Order not found
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[var(--color-text-secondary)]">
          {error ||
            "We could not find the order you are looking for."}
        </p>

        <Link
          href="/account/orders"
          className="mt-8 inline-flex min-h-12 items-center gap-2 bg-[var(--color-text)] px-7 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-inverse)] transition duration-300 hover:bg-[var(--color-accent-dark)]"
        >
          <ArrowLeft
            size={15}
            strokeWidth={1.6}
          />
          Back to My Orders
        </Link>
      </div>
    </section>
  );
}

/* ==========================================================
   COMPONENT
========================================================== */

export function OrderDetails({
  orderNumber,
}: OrderDetailsProps) {
  const {
    accessToken,
    isAuthenticated,
    isInitialized,
  } = useAuthStore();

  const [order, setOrder] =
    useState<OrderDetailsData | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* ==========================================================
     LOAD ORDER
  ========================================================== */

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (!isAuthenticated || !accessToken) {
      setIsLoading(false);
      setError(
        "Please login to view this order.",
      );
      return;
    }

    const loadOrder = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response =
          await getCustomerOrder(
            accessToken,
            orderNumber,
          );

        setOrder(response.order);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load order details.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrder();
  }, [
    accessToken,
    isAuthenticated,
    isInitialized,
    orderNumber,
  ]);

  /* ==========================================================
     DERIVED DATA
  ========================================================== */

  const itemCount = useMemo(() => {
    if (!order) {
      return 0;
    }

    return order.items.reduce(
      (total, item) =>
        total + item.quantity,
      0,
    );
  }, [order]);

  const currentTrackingIndex = order
    ? getTrackingIndex(order.status)
    : -1;

  const showTracking =
    order &&
    ![
      "cancelled",
      "returned",
      "exchanged",
    ].includes(order.status);

  /* ==========================================================
     LOADING
  ========================================================== */

  if (!isInitialized || isLoading) {
    return <OrderDetailsLoading />;
  }

  /* ==========================================================
     ERROR
  ========================================================== */

  if (error || !order) {
    return (
      <OrderDetailsError
        error={error}
      />
    );
  }

  /* ==========================================================
     MAIN
  ========================================================== */

  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 pb-12 pt-7 sm:px-8 sm:pb-16 sm:pt-9 lg:px-12">
      {/* =====================================================
          BACK
      ===================================================== */}

      <Link
        href="/account/orders"
        className="group inline-flex min-h-10 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-secondary)] transition duration-300 hover:text-[var(--color-text)]"
      >
        <ArrowLeft
          size={15}
          strokeWidth={1.5}
          className="transition-transform duration-300 group-hover:-translate-x-1"
        />
        My Orders
      </Link>

      {/* =====================================================
          ORDER HEADER
      ===================================================== */}

      <div className="mt-5 overflow-hidden border border-[var(--color-border-light)] bg-[var(--color-surface)] shadow-[var(--shadow-xs)] sm:mt-6">
        <div className="h-1 bg-[var(--color-accent)]" />

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                Aayesha Fashion
              </p>

              <div className="mt-3 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <h1 className="max-w-full break-words font-[var(--font-display)] text-4xl leading-[0.9] tracking-[-0.025em] text-[var(--color-text)] sm:text-5xl">
                  Order #{order.orderNumber}
                </h1>

                <span
                  className={`inline-flex max-w-full items-center border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.13em] ${getStatusTone(
                    order.status,
                  )}`}
                >
                  {getStatusLabel(
                    order.status,
                  )}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays
                    size={14}
                    strokeWidth={1.4}
                  />
                  {formatDate(
                    order.createdAt,
                  )}
                </span>

                <span className="inline-flex items-center gap-2">
                  <ShoppingBag
                    size={14}
                    strokeWidth={1.4}
                  />
                  {itemCount}{" "}
                  {itemCount === 1
                    ? "Item"
                    : "Items"}
                </span>
              </div>
            </div>

            <div className="border-t border-[var(--color-border-light)] pt-5 lg:border-t-0 lg:pt-0 lg:text-right">
              <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[var(--color-text-muted)]">
                Order Total
              </p>

              <p className="mt-1 font-[var(--font-display)] text-3xl leading-none text-[var(--color-text)] sm:text-4xl">
                {formatCurrency(
                  order.total,
                )}
              </p>
            </div>
          </div>

          {/* =================================================
              ORDER PROGRESS
          ================================================= */}

          {showTracking && (
            <div className="mt-8 border-t border-[var(--color-border-light)] pt-7">
              <div className="overflow-x-auto pb-1">
                <div className="grid min-w-[600px] grid-cols-6 gap-2">
                  {trackingStatuses.map(
                    (status, index) => {
                      const isCompleted =
                        currentTrackingIndex >=
                        index;

                      const isCurrent =
                        currentTrackingIndex ===
                        index;

                      return (
                        <div
                          key={status}
                          className="relative min-w-0"
                        >
                          {index <
                            trackingStatuses.length -
                              1 && (
                            <div
                              className={`absolute left-[calc(50%+13px)] right-[calc(-50%+13px)] top-3 h-px ${
                                currentTrackingIndex >
                                index
                                  ? "bg-[var(--color-accent)]"
                                  : "bg-[var(--color-border)]"
                              }`}
                            />
                          )}

                          <div className="relative flex flex-col items-center">
                            <div
                              className={`flex h-6 w-6 shrink-0 items-center justify-center border ${
                                isCompleted
                                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                                  : "border-[var(--color-border-dark)] bg-[var(--color-surface)] text-[var(--color-text-muted)]"
                              }`}
                            >
                              {isCompleted ? (
                                <Check
                                  size={12}
                                  strokeWidth={1.8}
                                />
                              ) : (
                                <Circle
                                  size={7}
                                  fill="currentColor"
                                  strokeWidth={0}
                                />
                              )}
                            </div>

                            <p
                              className={`mt-3 max-w-[90px] text-center text-[9px] leading-4 ${
                                isCurrent
                                  ? "font-semibold text-[var(--color-text)]"
                                  : "text-[var(--color-text-muted)]"
                              }`}
                            >
                              {status ===
                              "out_for_delivery"
                                ? "Out for Delivery"
                                : status ===
                                    "processing"
                                  ? "Processing"
                                  : status ===
                                      "in_transit"
                                    ? "In Transit"
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

              <p className="mt-3 text-center text-[9px] uppercase tracking-[0.12em] text-[var(--color-text-muted)] sm:hidden">
                Swipe to view progress
              </p>
            </div>
          )}

          {/* =================================================
              INACTIVE ORDER
          ================================================= */}

          {[
            "cancelled",
            "returned",
            "exchanged",
          ].includes(order.status) && (
            <div className="mt-7 border border-[var(--color-border-light)] bg-[var(--color-bg-subtle)] px-4 py-3.5 text-xs leading-5 text-[var(--color-text-secondary)]">
              <span className="font-semibold text-[var(--color-text)]">
                {getStatusLabel(
                  order.status,
                )}
              </span>{" "}
              — this order is no longer active.
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          CONTENT GRID
      ===================================================== */}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* ===================================================
            LEFT COLUMN
        =================================================== */}

        <div className="space-y-6">
          {/* =================================================
              ORDERED ITEMS
          ================================================= */}

          <div className="overflow-hidden border border-[var(--color-border-light)] bg-[var(--color-surface)]">
            <div className="flex items-end justify-between gap-4 border-b border-[var(--color-border-light)] px-6 py-6 sm:px-8">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.19em] text-[var(--color-text-muted)]">
                  Your Selection
                </p>

                <h2 className="mt-2 font-[var(--font-display)] text-3xl leading-none tracking-[-0.02em] text-[var(--color-text)]">
                  Ordered Items
                </h2>
              </div>

              <span className="shrink-0 text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                {itemCount}{" "}
                {itemCount === 1
                  ? "Item"
                  : "Items"}
              </span>
            </div>

            <div className="divide-y divide-[var(--color-border-light)]">
              {order.items.map(
                (item) => (
                  <div
                    key={item.productId}
                    className="p-5 sm:p-7"
                  >
                    <div className="flex gap-4 sm:gap-5">
                      {/* Image */}

                      <div className="relative h-28 w-22 shrink-0 overflow-hidden bg-[var(--color-bg-soft)] sm:h-32 sm:w-28">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[var(--color-text-muted)]">
                            <Package
                              size={22}
                              strokeWidth={1.3}
                            />
                          </div>
                        )}

                        <div className="absolute bottom-2 right-2 flex h-6 min-w-6 items-center justify-center bg-[var(--color-surface)] px-1.5 text-[9px] font-semibold text-[var(--color-text)] shadow-[var(--shadow-xs)]">
                          {item.quantity}
                        </div>
                      </div>

                      {/* Details */}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                              Aayesha Fashion
                            </p>

                            <h3 className="mt-1 font-[var(--font-display)] text-xl leading-tight text-[var(--color-text)] sm:text-2xl">
                              {item.name}
                            </h3>

                            {item.sku && (
                              <p className="mt-1.5 break-all text-[10px] text-[var(--color-text-muted)]">
                                SKU {item.sku}
                              </p>
                            )}
                          </div>

                          <p className="shrink-0 text-sm font-semibold text-[var(--color-text)] sm:text-right">
                            {formatCurrency(
                              item.lineTotal,
                            )}
                          </p>
                        </div>

                        {/* Price */}

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          {item.mrp >
                            item.sellingPrice && (
                            <span className="text-[10px] text-[var(--color-text-muted)] line-through">
                              {formatCurrency(
                                item.mrp,
                              )}
                            </span>
                          )}

                          <span className="text-[10px] font-medium text-[var(--color-text)]">
                            {formatCurrency(
                              item.sellingPrice,
                            )}{" "}
                            each
                          </span>

                          {item.mrp >
                            item.sellingPrice && (
                            <span className="bg-[var(--color-bg-soft)] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--color-accent-dark)]">
                              Save{" "}
                              {formatCurrency(
                                item.mrp -
                                  item.sellingPrice,
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* =================================================
              ADDRESS + PAYMENT
          ================================================= */}

          <div className="grid gap-6 md:grid-cols-2">
            {/* ADDRESS */}

            <div className="border border-[var(--color-border-light)] bg-[var(--color-surface)] p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                    Shipping
                  </p>

                  <h2 className="mt-2 font-[var(--font-display)] text-3xl leading-none text-[var(--color-text)]">
                    Delivery Address
                  </h2>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[var(--color-bg-soft)]">
                  <MapPin
                    size={17}
                    strokeWidth={1.4}
                    className="text-[var(--color-accent-dark)]"
                  />
                </div>
              </div>

              <div className="mt-6 text-xs leading-6 text-[var(--color-text-secondary)] sm:text-sm">
                <p className="font-semibold text-[var(--color-text)]">
                  {
                    order.shippingAddress
                      .firstName
                  }{" "}
                  {
                    order.shippingAddress
                      .lastName
                  }
                </p>

                <p className="mt-2 break-words">
                  {
                    order.shippingAddress
                      .addressLine1
                  }
                </p>

                {order.shippingAddress
                  .addressLine2 && (
                  <p className="break-words">
                    {
                      order.shippingAddress
                        .addressLine2
                    }
                  </p>
                )}

                {order.shippingAddress
                  .landmark && (
                  <p className="break-words">
                    Landmark:{" "}
                    {
                      order.shippingAddress
                        .landmark
                    }
                  </p>
                )}

                <p>
                  {
                    order.shippingAddress
                      .city
                  }
                  ,{" "}
                  {
                    order.shippingAddress
                      .state
                  }{" "}
                  {
                    order.shippingAddress
                      .postalCode
                  }
                </p>

                <p>
                  {
                    order.shippingAddress
                      .country
                  }
                </p>
              </div>
            </div>

            {/* PAYMENT */}

            <div className="border border-[var(--color-border-light)] bg-[var(--color-surface)] p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                    Payment
                  </p>

                  <h2 className="mt-2 font-[var(--font-display)] text-3xl leading-none text-[var(--color-text)]">
                    Payment Details
                  </h2>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[var(--color-bg-soft)]">
                  <CreditCard
                    size={17}
                    strokeWidth={1.4}
                    className="text-[var(--color-accent-dark)]"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-4 text-xs sm:text-sm">
                <div className="flex items-start justify-between gap-5">
                  <span className="text-[var(--color-text-secondary)]">
                    Method
                  </span>

                  <span className="max-w-[60%] text-right font-medium text-[var(--color-text)]">
                    {order.paymentMethod ===
                    "cod"
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-5">
                  <span className="text-[var(--color-text-secondary)]">
                    Status
                  </span>

                  <span className="inline-flex items-center gap-1.5 font-medium text-[var(--color-text)]">
                    {order.paymentStatus ===
                      "paid" && (
                      <CheckCircle2
                        size={14}
                        strokeWidth={1.5}
                        className="text-[var(--color-success)]"
                      />
                    )}

                    {formatStatus(
                      order.paymentStatus,
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-5">
                  <span className="text-[var(--color-text-secondary)]">
                    Delivery
                  </span>

                  <span className="font-medium capitalize text-[var(--color-text)]">
                    {formatStatus(
                      order.deliveryMethod,
                    )}
                  </span>
                </div>
              </div>

              {/* TRACKING */}

              {order.shippingInfo
                ?.trackingNumber && (
                <div className="mt-6 border-t border-[var(--color-border-light)] pt-5">
                  <div className="flex items-center gap-2">
                    <Truck
                      size={15}
                      strokeWidth={1.4}
                      className="text-[var(--color-accent-dark)]"
                    />

                    <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
                      Tracking
                    </span>
                  </div>

                  <div className="mt-4 flex flex-col gap-4">
                    <div className="min-w-0">
                      {order.shippingInfo
                        .courierName && (
                        <p className="text-sm font-semibold text-[var(--color-text)]">
                          {
                            order
                              .shippingInfo
                              .courierName
                          }
                        </p>
                      )}

                      <p className="mt-1 break-all text-[10px] text-[var(--color-text-muted)]">
                        {
                          order
                            .shippingInfo
                            .trackingNumber
                        }
                      </p>
                    </div>

                    {order.shippingInfo
                      .trackingUrl && (
                      <a
                        href={
                          order.shippingInfo
                            .trackingUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex min-h-10 w-full items-center justify-center gap-2 border border-[var(--color-border)] px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.13em] text-[var(--color-text)] transition duration-300 hover:border-[var(--color-text)] hover:bg-[var(--color-bg-soft)] sm:w-fit"
                      >
                        Track Shipment
                        <ArrowUpRight
                          size={14}
                          strokeWidth={1.5}
                          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===================================================
            RIGHT SUMMARY
        =================================================== */}

        <aside className="h-fit">
          <div className="overflow-hidden border border-[var(--color-border-light)] bg-[var(--color-surface)] shadow-[var(--shadow-xs)] lg:sticky lg:top-28">
            <div className="h-1 bg-[var(--color-text)]" />

            <div className="p-6 sm:p-8">
              <p className="text-[9px] font-semibold uppercase tracking-[0.19em] text-[var(--color-text-muted)]">
                Price Details
              </p>

              <h2 className="mt-2 font-[var(--font-display)] text-3xl leading-none tracking-[-0.02em] text-[var(--color-text)]">
                Order Summary
              </h2>

              <div className="mt-7 space-y-4">
                <div className="flex items-center justify-between gap-4 text-xs">
                  <span className="text-[var(--color-text-secondary)]">
                    MRP Total
                  </span>

                  <span className="text-right text-[var(--color-text)]">
                    {formatCurrency(
                      order.mrpTotal,
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 text-xs">
                  <span className="text-[var(--color-text-secondary)]">
                    Product Discount
                  </span>

                  <span className="text-right font-medium text-[var(--color-success)]">
                    -{" "}
                    {formatCurrency(
                      order.productDiscount,
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 text-xs">
                  <span className="text-[var(--color-text-secondary)]">
                    Subtotal
                  </span>

                  <span className="font-medium text-[var(--color-text)]">
                    {formatCurrency(
                      order.subtotal,
                    )}
                  </span>
                </div>

                {order.couponDiscount >
                  0 && (
                  <div className="border border-[var(--color-accent-soft)] bg-[var(--color-bg-soft)] px-4 py-3">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <div className="min-w-0">
                        <p className="font-semibold text-[var(--color-text)]">
                          Coupon Discount
                        </p>

                        {order.couponCode && (
                          <p className="mt-1 break-all text-[9px] uppercase tracking-[0.08em] text-[var(--color-accent-dark)]">
                            {order.couponCode}
                          </p>
                        )}
                      </div>

                      <span className="shrink-0 font-medium text-[var(--color-success)]">
                        -{" "}
                        {formatCurrency(
                          order.couponDiscount,
                        )}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between gap-4 text-xs">
                  <span className="text-[var(--color-text-secondary)]">
                    Shipping
                  </span>

                  <span className="text-[var(--color-text)]">
                    {order.shippingAmount ===
                    0
                      ? "Free"
                      : formatCurrency(
                          order.shippingAmount,
                        )}
                  </span>
                </div>
              </div>

              <div className="my-6 border-t border-[var(--color-border-light)]" />

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                    Total Amount
                  </p>

                  <p className="mt-1 font-[var(--font-display)] text-3xl leading-none text-[var(--color-text)] sm:text-4xl">
                    {formatCurrency(
                      order.total,
                    )}
                  </p>
                </div>

                <span className="pb-1 text-[9px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                  {order.currency}
                </span>
              </div>

              <div className="mt-7 border border-[var(--color-border-light)] bg-[var(--color-bg-subtle)] px-4 py-3.5">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={16}
                    strokeWidth={1.4}
                    className="mt-0.5 shrink-0 text-[var(--color-accent-dark)]"
                  />

                  <p className="text-[10px] leading-5 text-[var(--color-text-secondary)]">
                    Your order details are
                    securely saved in your
                    Aayesha Fashion account.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CONTINUE SHOPPING */}

          <Link
            href="/shop"
            className="group mt-4 flex min-h-12 w-full items-center justify-center gap-2 border border-[var(--color-border)] bg-[var(--color-surface)] px-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text)] transition duration-300 hover:border-[var(--color-text)] hover:bg-[var(--color-bg-soft)]"
          >
            Continue Shopping
            <ChevronRight
              size={15}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </Link>
        </aside>
      </div>
    </section>
  );
}