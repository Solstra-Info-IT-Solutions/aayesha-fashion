"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Package,
  ShoppingBag,
} from "lucide-react";

import {
  getCustomerOrders,
  type OrderDetails,
} from "@/lib/api/orders";
import { useAuthStore } from "@/store/auth-store";

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
    month: "short",
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

const getStatusClasses = (status: string) => {
  switch (status) {
    case "delivered":
      return "border-[var(--color-success)]/25 bg-[var(--color-success)]/5 text-[var(--color-success)]";

    case "cancelled":
      return "border-[var(--color-error)]/25 bg-[var(--color-error)]/5 text-[var(--color-error)]";

    case "returned":
    case "exchanged":
      return "border-[var(--color-warning)]/25 bg-[var(--color-warning)]/5 text-[var(--color-warning)]";

    case "shipped":
    case "in_transit":
    case "out_for_delivery":
      return "border-[var(--color-accent-soft)] bg-[var(--color-bg-soft)] text-[var(--color-accent-dark)]";

    default:
      return "border-[var(--color-accent-soft)] bg-[var(--color-bg-soft)] text-[var(--color-accent-dark)]";
  }
};

/* ==========================================================
   LOADING
========================================================== */

function OrdersListLoading() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12">
      <div className="animate-pulse space-y-6">
        <div className="h-3 w-24 bg-[var(--color-bg-soft)]" />

        <div className="h-12 w-56 bg-[var(--color-bg-soft)]" />

        <div className="border border-[var(--color-border-light)] bg-[var(--color-surface)] p-6 sm:p-8">
          <div className="h-5 w-32 bg-[var(--color-bg-soft)]" />

          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-40 bg-[var(--color-bg-subtle)]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================
   EMPTY / AUTH STATE
========================================================== */

function OrdersEmptyState({
  authenticated,
}: {
  authenticated: boolean;
}) {
  return (
    <section className="mx-auto flex min-h-[65vh] w-full max-w-3xl items-center justify-center px-5 py-14 sm:px-8">
      <div className="w-full border border-[var(--color-border-light)] bg-[var(--color-surface)] px-6 py-14 text-center shadow-[var(--shadow-xs)] sm:px-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center bg-[var(--color-bg-soft)]">
          <ShoppingBag
            size={25}
            strokeWidth={1.3}
            className="text-[var(--color-accent-dark)]"
          />
        </div>

        <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
          {authenticated
            ? "Your Wardrobe"
            : "Aayesha Fashion"}
        </p>

        <h1 className="mt-3 font-[var(--font-display)] text-4xl leading-none tracking-[-0.02em] text-[var(--color-text)] sm:text-5xl">
          {authenticated
            ? "No orders yet"
            : "Sign in to view your orders"}
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[var(--color-text-secondary)]">
          {authenticated
            ? "Your Aayesha Fashion purchases will appear here once you place your first order."
            : "Your orders, delivery updates and purchase history are available in your account."}
        </p>

        <Link
          href={
            authenticated
              ? "/shop"
              : "/login"
          }
          className="group mt-8 inline-flex min-h-12 items-center gap-2 bg-[var(--color-text)] px-7 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-inverse)] transition duration-300 hover:bg-[var(--color-accent-dark)]"
        >
          {authenticated
            ? "Explore Collection"
            : "Sign In"}

          <ArrowRight
            size={15}
            strokeWidth={1.6}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </section>
  );
}

/* ==========================================================
   ERROR
========================================================== */

function OrdersError({
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
            strokeWidth={1.3}
            className="text-[var(--color-accent-dark)]"
          />
        </div>

        <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
          My Orders
        </p>

        <h1 className="mt-3 font-[var(--font-display)] text-4xl leading-none tracking-[-0.02em] text-[var(--color-text)] sm:text-5xl">
          Unable to load orders
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[var(--color-text-secondary)]">
          {error}
        </p>

        <button
          type="button"
          onClick={() =>
            window.location.reload()
          }
          className="group mt-8 inline-flex min-h-12 items-center gap-2 bg-[var(--color-text)] px-7 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-inverse)] transition duration-300 hover:bg-[var(--color-accent-dark)]"
        >
          Try Again
          <ArrowRight
            size={15}
            strokeWidth={1.6}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>
      </div>
    </section>
  );
}

/* ==========================================================
   ORDERS LIST
========================================================== */

export function OrdersList() {
  const {
    accessToken,
    isAuthenticated,
    isInitialized,
  } = useAuthStore();

  const [orders, setOrders] =
    useState<OrderDetails[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* ==========================================================
     LOAD ORDERS
  ========================================================== */

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (!isAuthenticated || !accessToken) {
      setIsLoading(false);
      return;
    }

    const loadOrders = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response =
          await getCustomerOrders(
            accessToken,
          );

        setOrders(response.orders);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load your orders.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrders();
  }, [
    accessToken,
    isAuthenticated,
    isInitialized,
  ]);

  /* ==========================================================
     LOADING
  ========================================================== */

  if (!isInitialized || isLoading) {
    return <OrdersListLoading />;
  }

  /* ==========================================================
     AUTH
  ========================================================== */

  if (!isAuthenticated) {
    return (
      <OrdersEmptyState
        authenticated={false}
      />
    );
  }

  /* ==========================================================
     ERROR
  ========================================================== */

  if (error) {
    return (
      <OrdersError
        error={error}
      />
    );
  }

  /* ==========================================================
     EMPTY
  ========================================================== */

  if (orders.length === 0) {
    return (
      <OrdersEmptyState
        authenticated
      />
    );
  }

  /* ==========================================================
     MAIN
  ========================================================== */

  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 pb-14 pt-8 sm:px-8 sm:pb-18 sm:pt-10 lg:px-12">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-7 border-b border-[var(--color-border-light)] pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
            My Account
          </p>

          <h1 className="mt-3 font-[var(--font-display)] text-5xl leading-[0.9] tracking-[-0.025em] text-[var(--color-text)] sm:text-6xl">
            My Orders
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--color-text-secondary)]">
            View your purchases, delivery status and
            complete order details.
          </p>
        </div>

        <Link
          href="/shop"
          className="group inline-flex min-h-12 w-fit items-center gap-2 border border-[var(--color-border)] bg-[var(--color-surface)] px-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text)] transition duration-300 hover:border-[var(--color-text)] hover:bg-[var(--color-bg-soft)]"
        >
          Continue Shopping
          <ChevronRight
            size={15}
            strokeWidth={1.5}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {/* =====================================================
          ORDER COUNT
      ===================================================== */}

      <div className="flex items-center gap-4 py-7">
        <div className="h-px flex-1 bg-[var(--color-border-light)]" />

        <span className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          {orders.length}{" "}
          {orders.length === 1
            ? "Order"
            : "Orders"}
        </span>

        <div className="h-px flex-1 bg-[var(--color-border-light)]" />
      </div>

      {/* =====================================================
          ORDERS
      ===================================================== */}

      <div className="space-y-5">
        {orders.map((order) => {
          const firstItem =
            order.items[0];

          const totalItems =
            order.items.reduce(
              (total, item) =>
                total + item.quantity,
              0,
            );

          return (
            <article
              key={order.id}
              className="group border border-[var(--color-border-light)] bg-[var(--color-surface)] transition duration-300 hover:border-[var(--color-border-dark)] hover:shadow-[var(--shadow-sm)]"
            >
              <div className="p-5 sm:p-7 lg:p-8">
                {/* =================================================
                    ORDER META
                ================================================= */}

                <div className="flex flex-col gap-4 border-b border-[var(--color-border-light)] pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                        Order
                      </p>

                      <p className="mt-1 text-sm font-semibold tracking-[0.04em] text-[var(--color-text)]">
                        #{order.orderNumber}
                      </p>
                    </div>

                    <div className="hidden h-6 w-px bg-[var(--color-border)] sm:block" />

                    <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                      <CalendarDays
                        size={14}
                        strokeWidth={1.4}
                      />

                      {formatDate(
                        order.createdAt,
                      )}
                    </div>
                  </div>

                  <span
                    className={`inline-flex w-fit items-center border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] ${getStatusClasses(
                      order.status,
                    )}`}
                  >
                    {formatStatus(
                      order.status,
                    )}
                  </span>
                </div>

                {/* =================================================
                    ORDER BODY
                ================================================= */}

                <div className="flex flex-col gap-6 pt-6 lg:flex-row lg:items-center">
                  {/* Product */}

                  <div className="flex min-w-0 flex-1 gap-5">
                    <div className="relative h-32 w-24 shrink-0 overflow-hidden bg-[var(--color-bg-soft)] sm:h-36 sm:w-28">
                      {firstItem?.image ? (
                        <img
                          src={
                            firstItem.image
                          }
                          alt={
                            firstItem.name
                          }
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[var(--color-text-muted)]">
                          <Package
                            size={23}
                            strokeWidth={1.3}
                          />
                        </div>
                      )}

                      <div className="absolute bottom-2 right-2 flex h-6 min-w-6 items-center justify-center bg-[var(--color-surface)] px-1.5 text-[9px] font-semibold text-[var(--color-text)] shadow-[var(--shadow-xs)]">
                        {totalItems}
                      </div>
                    </div>

                    <div className="min-w-0 pt-0.5">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
                        Aayesha Fashion
                      </p>

                      <h2 className="mt-2 line-clamp-2 font-[var(--font-display)] text-2xl leading-tight text-[var(--color-text)] sm:text-3xl">
                        {firstItem?.name ||
                          "Order Items"}
                      </h2>

                      {firstItem &&
                        order.items.length >
                          1 && (
                          <p className="mt-2 text-[10px] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
                            +{" "}
                            {order.items
                              .length -
                              1}{" "}
                            more{" "}
                            {order.items
                              .length -
                              1 === 1
                              ? "item"
                              : "items"}
                          </p>
                        )}

                      {firstItem && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {firstItem.colorName && (
                            <span className="border border-[var(--color-border)] px-2.5 py-1 text-[9px] uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">
                              {
                                firstItem.colorName
                              }
                            </span>
                          )}

                          {firstItem.sizeLabel && (
                            <span className="border border-[var(--color-border)] px-2.5 py-1 text-[9px] uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">
                              {
                                firstItem.sizeLabel
                              }
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* =================================================
                      TOTAL
                  ================================================= */}

                  <div className="flex flex-row items-center justify-between gap-5 border-t border-[var(--color-border-light)] pt-5 lg:min-w-[190px] lg:flex-col lg:items-end lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                    <div className="lg:text-right">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                        Order Total
                      </p>

                      <p className="mt-1 font-[var(--font-display)] text-3xl leading-none text-[var(--color-text)] sm:text-4xl">
                        {formatCurrency(
                          order.total,
                        )}
                      </p>
                    </div>

                    <Link
                      href={`/account/orders/${encodeURIComponent(
                        order.orderNumber,
                      )}`}
                      className="group/action inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-[var(--color-text)] px-5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-inverse)] transition duration-300 hover:bg-[var(--color-accent-dark)] lg:w-full"
                    >
                      View Order

                      <ArrowRight
                        size={14}
                        strokeWidth={1.6}
                        className="transition-transform duration-300 group-hover/action:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}