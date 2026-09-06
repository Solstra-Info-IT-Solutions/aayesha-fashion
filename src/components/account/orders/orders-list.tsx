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
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");

const getStatusClasses = (status: string) => {
  switch (status) {
    case "delivered":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "cancelled":
      return "border-red-200 bg-red-50 text-red-700";

    case "returned":
    case "exchanged":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "shipped":
    case "in_transit":
    case "out_for_delivery":
      return "border-blue-200 bg-blue-50 text-blue-700";

    default:
      return "border-[#edc6ca] bg-[#fdf2f3] text-[#b86670]";
  }
};

export function OrdersList() {
  const {
    accessToken,
    isAuthenticated,
    isInitialized,
  } = useAuthStore();

  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

        const response = await getCustomerOrders(
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

  if (!isInitialized || isLoading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-5">
          <div className="h-4 w-20 rounded bg-[#ebe7e2]" />
          <div className="h-12 w-52 rounded bg-[#ebe7e2]" />

          <div className="rounded-3xl border border-[#e7e2dd] bg-white p-5 sm:p-6">
            <div className="h-6 w-32 rounded bg-[#ebe7e2]" />
            <div className="mt-5 space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-40 rounded-2xl bg-[#f5f1ec]"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#e7e2dd] bg-white px-6 py-14 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f9e4e6] text-[#c97983]">
            <ShoppingBag
              size={27}
              strokeWidth={1.5}
            />
          </div>

          <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.2em] text-[#969696]">
            Aayesha Fashion
          </p>

          <h1 className="mt-2 font-serif text-3xl text-[#171717]">
            Sign in to view your orders
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6f706f]">
            Your orders, delivery updates and purchase
            history are available in your account.
          </p>

          <Link
            href="/login"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#171717] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#292c2c]"
          >
            Sign In
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#e7e2dd] bg-white px-6 py-14 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f9e4e6] text-[#c97983]">
            <Package
              size={27}
              strokeWidth={1.5}
            />
          </div>

          <h1 className="mt-6 font-serif text-3xl text-[#171717]">
            Unable to load orders
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6f706f]">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#171717] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#292c2c]"
          >
            Try Again
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#e7e2dd] bg-white px-6 py-14 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f9e4e6] text-[#c97983]">
            <ShoppingBag
              size={27}
              strokeWidth={1.5}
            />
          </div>

          <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.2em] text-[#969696]">
            Your Wardrobe
          </p>

          <h1 className="mt-2 font-serif text-3xl text-[#171717]">
            No orders yet
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6f706f]">
            Your Aayesha Fashion purchases will appear
            here once you place your first order.
          </p>

          <Link
            href="/shop"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#171717] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#292c2c]"
          >
            Explore Collection
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#969696]">
            My Account
          </p>

          <h1 className="mt-2 font-serif text-4xl leading-none text-[#171717] sm:text-5xl">
            My Orders
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#6f706f]">
            View your purchases, delivery status and
            complete order details.
          </p>
        </div>

        <Link
          href="/shop"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d8d1ca] bg-white px-5 py-3 text-sm font-medium text-[#171717] transition hover:border-[#171717]"
        >
          Continue Shopping
          <ChevronRight size={16} />
        </Link>
      </div>

      {/* Order count */}
      <div className="mt-7 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#e7e2dd]" />

        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#969696]">
          {orders.length}{" "}
          {orders.length === 1 ? "Order" : "Orders"}
        </span>

        <div className="h-px flex-1 bg-[#e7e2dd]" />
      </div>

      {/* Orders */}
      <div className="mt-6 space-y-4">
        {orders.map((order) => {
          const firstItem = order.items[0];

          return (
            <article
              key={order.id}
              className="group overflow-hidden rounded-3xl border border-[#e7e2dd] bg-white transition duration-300 hover:border-[#d8d1ca]"
            >
              <div className="p-4 sm:p-5 lg:p-6">
                <div className="flex flex-col gap-5">
                  {/* Top row */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-[#969696]">
                          Order
                        </p>

                        <p className="mt-0.5 text-sm font-semibold text-[#171717]">
                          #{order.orderNumber}
                        </p>
                      </div>

                      <div className="hidden h-5 w-px bg-[#e7e2dd] sm:block" />

                      <div className="inline-flex items-center gap-2 text-xs text-[#6f706f]">
                        <CalendarDays size={14} />
                        {formatDate(order.createdAt)}
                      </div>
                    </div>

                    <span
                      className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-xs font-medium ${getStatusClasses(
                        order.status,
                      )}`}
                    >
                      {formatStatus(order.status)}
                    </span>
                  </div>

                  {/* Main */}
                  <div className="flex flex-col gap-5 border-t border-[#eee9e5] pt-5 sm:flex-row sm:items-center">
                    {/* Product */}
                    <div className="flex min-w-0 flex-1 gap-4">
                      <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#f5f1ec] sm:h-32 sm:w-28">
                        {firstItem?.image ? (
                          <img
                            src={firstItem.image}
                            alt={firstItem.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[#969696]">
                            <Package
                              size={24}
                              strokeWidth={1.5}
                            />
                          </div>
                        )}

                        <div className="absolute bottom-2 right-2 flex h-6 min-w-6 items-center justify-center rounded-full border border-white/80 bg-white/90 px-1.5 text-[10px] font-semibold text-[#171717] shadow-sm">
                          {order.items.reduce(
                            (total, item) =>
                              total + item.quantity,
                            0,
                          )}
                        </div>
                      </div>

                      <div className="min-w-0 pt-0.5">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-[#969696]">
                          Aayesha Fashion
                        </p>

                        <h2 className="mt-1 line-clamp-2 text-sm font-medium leading-5 text-[#171717] sm:text-base">
                          {firstItem?.name ||
                            "Order Items"}
                        </h2>

                        {firstItem &&
                          order.items.length >
                            1 && (
                            <p className="mt-1 text-xs text-[#969696]">
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
                          <div className="mt-3 flex flex-wrap gap-2">
                            {firstItem.colorName && (
                              <span className="rounded-full border border-[#e7e2dd] px-2.5 py-1 text-[10px] text-[#6f706f]">
                                {firstItem.colorName}
                              </span>
                            )}

                            {firstItem.sizeLabel && (
                              <span className="rounded-full border border-[#e7e2dd] px-2.5 py-1 text-[10px] text-[#6f706f]">
                                {firstItem.sizeLabel}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between gap-5 border-t border-[#eee9e5] pt-4 sm:min-w-[170px] sm:flex-col sm:items-end sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                      <div className="sm:text-right">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-[#969696]">
                          Order Total
                        </p>

                        <p className="mt-1 font-serif text-2xl text-[#171717]">
                          {formatCurrency(
                            order.total,
                          )}
                        </p>
                      </div>

                      <Link
                        href={`/account/orders/${encodeURIComponent(
                          order.orderNumber,
                        )}`}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#171717] px-4 py-2.5 text-xs font-medium text-white transition hover:bg-[#292c2c] sm:w-full sm:justify-center"
                      >
                        View Order
                        <ArrowRight size={14} />
                      </Link>
                    </div>
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