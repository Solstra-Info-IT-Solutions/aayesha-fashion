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
        word.charAt(0).toUpperCase() + word.slice(1),
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

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (!isAuthenticated || !accessToken) {
      setIsLoading(false);
      setError("Please login to view this order.");
      return;
    }

    const loadOrder = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await getCustomerOrder(
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

  const itemCount = useMemo(() => {
    if (!order) {
      return 0;
    }

    return order.items.reduce(
      (total, item) => total + item.quantity,
      0,
    );
  }, [order]);

  const currentTrackingIndex = order
    ? getTrackingIndex(order.status)
    : -1;

  const showTracking =
    order &&
    !["cancelled", "returned", "exchanged"].includes(
      order.status,
    );

  if (!isInitialized || isLoading) {
    return (
      <section className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="animate-pulse space-y-4 sm:space-y-5">
          <div className="h-5 w-28 rounded bg-[#ebe7e2]" />

          <div className="overflow-hidden rounded-2xl border border-[#e7e2dd] bg-white sm:rounded-3xl">
            <div className="h-1 bg-[#ebe7e2]" />

            <div className="p-5 sm:p-8">
              <div className="h-4 w-24 rounded bg-[#ebe7e2]" />
              <div className="mt-3 h-9 w-52 rounded bg-[#ebe7e2]" />
              <div className="mt-4 h-4 w-64 rounded bg-[#ebe7e2]" />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_350px]">
            <div className="h-[420px] rounded-2xl border border-[#e7e2dd] bg-[#f5f1ec] sm:rounded-3xl" />
            <div className="h-[420px] rounded-2xl border border-[#e7e2dd] bg-[#f5f1ec] sm:rounded-3xl" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="mx-auto max-w-3xl px-3 py-12 sm:px-6 sm:py-16">
        <div className="rounded-2xl border border-[#e7e2dd] bg-white px-5 py-12 text-center sm:rounded-3xl sm:px-6 sm:py-14">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f9e4e6] text-[#c97983] sm:h-16 sm:w-16">
            <Package size={26} strokeWidth={1.5} />
          </div>

          <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#969696]">
            My Orders
          </p>

          <h1 className="mt-2 font-serif text-2xl text-[#171717] sm:text-3xl">
            Order not found
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6f706f]">
            {error ||
              "We could not find the order you are looking for."}
          </p>

          <Link
            href="/account/orders"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#171717] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#292c2c]"
          >
            <ArrowLeft size={16} />
            Back to My Orders
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-3 pb-8 pt-6 sm:px-6 sm:pb-12 sm:pt-8 lg:px-8">
      {/* Back */}
      <Link
        href="/account/orders"
        className="group inline-flex min-h-10 items-center gap-2 text-sm text-[#6f706f] transition hover:text-[#171717]"
      >
        <ArrowLeft
          size={16}
          className="transition-transform group-hover:-translate-x-0.5"
        />
        My Orders
      </Link>

      {/* Order Header */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-[#e7e2dd] bg-white sm:mt-5 sm:rounded-3xl">
        <div className="h-1 bg-[#efa7ae]" />

        <div className="p-4 sm:p-7 lg:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-7">
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#969696] sm:text-[11px]">
                Aayesha Fashion
              </p>

              <div className="mt-2.5 flex flex-col items-start gap-2.5 sm:mt-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2">
                <h1 className="max-w-full break-words font-serif text-2xl leading-tight text-[#171717] sm:text-4xl">
                  Order #{order.orderNumber}
                </h1>

                <span
                  className={`inline-flex max-w-full rounded-full border px-3 py-1.5 text-xs font-medium ${getStatusTone(
                    order.status,
                  )}`}
                >
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#6f706f] sm:mt-4 sm:gap-x-5 sm:text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  {formatDate(order.createdAt)}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <ShoppingBag size={14} />
                  {itemCount}{" "}
                  {itemCount === 1 ? "item" : "items"}
                </span>
              </div>
            </div>

            <div className="border-t border-[#eee9e5] pt-4 lg:border-t-0 lg:pt-0 lg:text-right">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#969696]">
                Order Total
              </p>

              <p className="mt-0.5 font-serif text-2xl text-[#171717] sm:text-3xl">
                {formatCurrency(order.total)}
              </p>
            </div>
          </div>

          {/* Mobile-friendly progress */}
          {showTracking && (
            <div className="mt-6 border-t border-[#eee9e5] pt-6 sm:mt-8 sm:pt-7">
              <div className="overflow-x-auto pb-1">
                <div className="grid min-w-[560px] grid-cols-6 gap-2">
                  {trackingStatuses.map(
                    (status, index) => {
                      const isCompleted =
                        currentTrackingIndex >= index;

                      const isCurrent =
                        currentTrackingIndex === index;

                      return (
                        <div
                          key={status}
                          className="relative min-w-0"
                        >
                          {index <
                            trackingStatuses.length -
                              1 && (
                            <div
                              className={`absolute left-[calc(50%+14px)] right-[calc(-50%+14px)] top-3 h-px ${
                                currentTrackingIndex >
                                index
                                  ? "bg-[#d98791]"
                                  : "bg-[#ddd8d3]"
                              }`}
                            />
                          )}

                          <div className="relative flex flex-col items-center">
                            <div
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                                isCompleted
                                  ? "border-[#d98791] bg-[#d98791] text-white"
                                  : "border-[#d8d1ca] bg-white text-[#c4bfba]"
                              }`}
                            >
                              {isCompleted ? (
                                <Check size={12} />
                              ) : (
                                <Circle
                                  size={7}
                                  fill="currentColor"
                                />
                              )}
                            </div>

                            <p
                              className={`mt-2 max-w-[82px] text-center text-[9px] leading-4 sm:max-w-none sm:text-[11px] ${
                                isCurrent
                                  ? "font-semibold text-[#171717]"
                                  : "text-[#969696]"
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

              <p className="mt-2 text-center text-[10px] text-[#aaa6a1] sm:hidden">
                Swipe to view order progress
              </p>
            </div>
          )}

          {/* Cancelled / Returned */}
          {[
            "cancelled",
            "returned",
            "exchanged",
          ].includes(order.status) && (
            <div className="mt-5 rounded-xl border border-[#eadfda] bg-[#faf8f6] px-3.5 py-3 text-xs leading-5 text-[#6f706f] sm:mt-7 sm:rounded-2xl sm:px-4 sm:py-3.5 sm:text-sm">
              <span className="font-medium text-[#171717]">
                {getStatusLabel(order.status)}
              </span>{" "}
              — this order is no longer active.
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mt-4 grid gap-4 sm:mt-5 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
        <div className="space-y-4 sm:space-y-5">
          {/* Items */}
          <div className="overflow-hidden rounded-2xl border border-[#e7e2dd] bg-white sm:rounded-3xl">
            <div className="flex items-center justify-between gap-3 border-b border-[#eee9e5] px-4 py-3.5 sm:px-6 sm:py-4">
              <div className="min-w-0">
                <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#969696] sm:text-[10px]">
                  Your Selection
                </p>

                <h2 className="mt-0.5 font-serif text-xl text-[#171717] sm:text-2xl">
                  Ordered Items
                </h2>
              </div>

              <span className="shrink-0 text-xs text-[#969696] sm:text-sm">
                {itemCount}{" "}
                {itemCount === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="divide-y divide-[#eee9e5]">
              {order.items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="p-4 sm:p-6"
                >
                  <div className="flex gap-3.5 sm:gap-4">
                    <div className="relative h-[112px] w-[88px] shrink-0 overflow-hidden rounded-xl bg-[#f5f1ec] sm:h-32 sm:w-28 sm:rounded-2xl">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#969696]">
                          <Package
                            size={22}
                            strokeWidth={1.5}
                          />
                        </div>
                      )}

                      <div className="absolute bottom-1.5 right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border border-white/80 bg-white/90 px-1.5 text-[9px] font-semibold text-[#171717] shadow-sm sm:bottom-2 sm:right-2 sm:h-6 sm:min-w-6 sm:text-[10px]">
                        {item.quantity}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <div className="min-w-0 pr-1">
                          <p className="text-[9px] uppercase tracking-[0.14em] text-[#969696] sm:text-[10px]">
                            Aayesha Fashion
                          </p>

                          <h3 className="mt-0.5 break-words text-sm font-medium leading-5 text-[#171717] sm:text-base">
                            {item.name}
                          </h3>

                          {item.sku && (
                            <p className="mt-0.5 break-all text-[10px] text-[#969696] sm:text-xs">
                              SKU {item.sku}
                            </p>
                          )}
                        </div>

                        <p className="shrink-0 text-sm font-semibold text-[#171717] sm:text-right">
                          {formatCurrency(
                            item.lineTotal,
                          )}
                        </p>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
                        {item.colorName && (
                          <span className="rounded-full border border-[#e7e2dd] px-2.5 py-1 text-[10px] text-[#6f706f] sm:px-3 sm:text-xs">
                            Color: {item.colorName}
                          </span>
                        )}

                        {item.sizeLabel && (
                          <span className="rounded-full border border-[#e7e2dd] px-2.5 py-1 text-[10px] text-[#6f706f] sm:px-3 sm:text-xs">
                            Size: {item.sizeLabel}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4 sm:gap-3">
                        {item.mrp >
                          item.sellingPrice && (
                          <span className="text-[10px] text-[#9a9691] line-through sm:text-xs">
                            {formatCurrency(
                              item.mrp,
                            )}
                          </span>
                        )}

                        <span className="text-[10px] font-medium text-[#171717] sm:text-xs">
                          {formatCurrency(
                            item.sellingPrice,
                          )}{" "}
                          each
                        </span>

                        {item.mrp >
                          item.sellingPrice && (
                          <span className="rounded-full bg-[#f9e4e6] px-2 py-0.5 text-[9px] font-medium text-[#b86670] sm:px-2.5 sm:py-1 sm:text-[10px]">
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
              ))}
            </div>
          </div>

          {/* Address + Payment */}
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
            {/* Address */}
            <div className="rounded-2xl border border-[#e7e2dd] bg-white p-4 sm:rounded-3xl sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#969696] sm:text-[10px]">
                    Shipping
                  </p>

                  <h2 className="mt-0.5 font-serif text-xl text-[#171717] sm:text-2xl">
                    Delivery Address
                  </h2>
                </div>

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f9e4e6] text-[#c97983] sm:h-9 sm:w-9">
                  <MapPin size={16} />
                </div>
              </div>

              <div className="mt-4 text-xs leading-5 text-[#6f706f] sm:mt-5 sm:text-sm sm:leading-6">
                <p className="font-medium text-[#171717]">
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress.lastName}
                </p>

                <p className="mt-1 break-words">
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
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state}{" "}
                  {
                    order.shippingAddress
                      .postalCode
                  }
                </p>

                <p>
                  {order.shippingAddress.country}
                </p>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-2xl border border-[#e7e2dd] bg-white p-4 sm:rounded-3xl sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#969696] sm:text-[10px]">
                    Payment
                  </p>

                  <h2 className="mt-0.5 font-serif text-xl text-[#171717] sm:text-2xl">
                    Payment Details
                  </h2>
                </div>

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f9e4e6] text-[#c97983] sm:h-9 sm:w-9">
                  <CreditCard size={16} />
                </div>
              </div>

              <div className="mt-4 space-y-3 text-xs sm:mt-5 sm:text-sm">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-[#6f706f]">
                    Method
                  </span>

                  <span className="max-w-[60%] text-right font-medium text-[#171717]">
                    {order.paymentMethod ===
                    "cod"
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#6f706f]">
                    Status
                  </span>

                  <span className="inline-flex items-center gap-1.5 font-medium text-[#171717]">
                    {order.paymentStatus ===
                      "paid" && (
                      <CheckCircle2
                        size={14}
                        className="text-emerald-600"
                      />
                    )}

                    {formatStatus(
                      order.paymentStatus,
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#6f706f]">
                    Delivery
                  </span>

                  <span className="font-medium capitalize text-[#171717]">
                    {formatStatus(
                      order.deliveryMethod,
                    )}
                  </span>
                </div>
              </div>

              {/* Tracking */}
              {order.shippingInfo
                ?.trackingNumber && (
                <div className="mt-5 border-t border-[#eee9e5] pt-4 sm:mt-5 sm:pt-5">
                  <div className="flex items-center gap-2">
                    <Truck
                      size={15}
                      className="text-[#d98791]"
                    />

                    <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#6f706f]">
                      Tracking
                    </span>
                  </div>

                  <div className="mt-3 flex flex-col gap-3">
                    <div className="min-w-0">
                      {order.shippingInfo
                        .courierName && (
                        <p className="text-sm font-medium text-[#171717]">
                          {
                            order
                              .shippingInfo
                              .courierName
                          }
                        </p>
                      )}

                      <p className="mt-0.5 break-all text-[11px] text-[#969696]">
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
                        className="inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-full border border-[#d8d1ca] px-4 py-2.5 text-xs font-medium text-[#171717] transition hover:border-[#171717] sm:w-fit"
                      >
                        Track Shipment
                        <ArrowUpRight
                          size={14}
                        />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary */}
        <aside className="h-fit">
          <div className="overflow-hidden rounded-2xl border border-[#e7e2dd] bg-white sm:rounded-3xl">
            <div className="h-1 bg-[#171717]" />

            <div className="p-4 sm:p-6">
              <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#969696] sm:text-[10px]">
                Price Details
              </p>

              <h2 className="mt-0.5 font-serif text-xl text-[#171717] sm:text-2xl">
                Order Summary
              </h2>

              <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-3.5">
                <div className="flex items-center justify-between gap-4 text-xs sm:text-sm">
                  <span className="text-[#6f706f]">
                    MRP Total
                  </span>

                  <span className="text-right text-[#171717]">
                    {formatCurrency(
                      order.mrpTotal,
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 text-xs sm:text-sm">
                  <span className="text-[#6f706f]">
                    Product Discount
                  </span>

                  <span className="text-right text-emerald-700">
                    -{" "}
                    {formatCurrency(
                      order.productDiscount,
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 text-xs sm:text-sm">
                  <span className="text-[#6f706f]">
                    Subtotal
                  </span>

                  <span className="font-medium text-[#171717]">
                    {formatCurrency(
                      order.subtotal,
                    )}
                  </span>
                </div>

                {order.couponDiscount > 0 && (
                  <div className="rounded-xl bg-[#f9e4e6] px-3 py-2.5 sm:px-3.5 sm:py-3">
                    <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                      <div className="min-w-0">
                        <p className="font-medium text-[#171717]">
                          Coupon Discount
                        </p>

                        {order.couponCode && (
                          <p className="mt-0.5 break-all text-[10px] text-[#b86670] sm:text-xs">
                            {order.couponCode}
                          </p>
                        )}
                      </div>

                      <span className="shrink-0 font-medium text-[#b86670]">
                        -{" "}
                        {formatCurrency(
                          order.couponDiscount,
                        )}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between gap-4 text-xs sm:text-sm">
                  <span className="text-[#6f706f]">
                    Shipping
                  </span>

                  <span className="text-[#171717]">
                    {order.shippingAmount ===
                    0
                      ? "Free"
                      : formatCurrency(
                          order.shippingAmount,
                        )}
                  </span>
                </div>
              </div>

              <div className="my-4 border-t border-[#eee9e5] sm:my-5" />

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] text-[#6f706f] sm:text-xs">
                    Total Amount
                  </p>

                  <p className="mt-0.5 font-serif text-2xl text-[#171717] sm:text-3xl">
                    {formatCurrency(
                      order.total,
                    )}
                  </p>
                </div>

                <span className="pb-1 text-[9px] uppercase tracking-[0.12em] text-[#969696] sm:text-[10px]">
                  {order.currency}
                </span>
              </div>

              <div className="mt-5 rounded-xl bg-[#f7f4f1] px-3.5 py-3 sm:mt-6 sm:rounded-2xl sm:px-4 sm:py-3.5">
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0 text-[#c97983]"
                  />

                  <p className="text-[10px] leading-4.5 text-[#6f706f] sm:text-xs sm:leading-5">
                    Your order details are
                    securely saved in your
                    Aayesha Fashion account.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/shop"
            className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#d8d1ca] bg-white px-5 py-3 text-sm font-medium text-[#171717] transition hover:border-[#171717] sm:mt-4"
          >
            Continue Shopping
            <ChevronRight size={16} />
          </Link>
        </aside>
      </div>
    </section>
  );
}