import Link from "next/link";
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

interface CheckoutSuccessPageProps {
  searchParams: Promise<{
    orderNumber?: string;
  }>;
}

const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  ).format(new Date(date));
};

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const params = await searchParams;

  const orderNumber =
    params.orderNumber?.trim();

  /*
   * Invalid/missing order number
   */
  if (!orderNumber) {
    return (
      <main className="min-h-[70vh] bg-[var(--color-ivory)]">
        <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center justify-center px-5 py-16 sm:px-8">
          <div className="w-full border border-[var(--color-border)] bg-white p-8 text-center sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center bg-[var(--color-cream)]">
              <ShoppingBag
                size={25}
                strokeWidth={1.5}
              />
            </div>

            <p className="mt-7 font-[var(--font-display)] text-3xl leading-none text-[var(--color-charcoal)] sm:text-4xl">
              Order details unavailable
            </p>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[var(--color-text-muted)]">
              We could not find an order number for
              this confirmation page.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-[var(--color-charcoal)] px-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[var(--color-charcoal-soft)]"
              >
                Continue Shopping
                <ArrowRight size={15} />
              </Link>

              <Link
                href="/account/orders"
                className="inline-flex min-h-12 items-center justify-center border border-[var(--color-border)] bg-white px-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-charcoal)] transition hover:bg-[var(--color-cream)]"
              >
                View Orders
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  let order = null;

  try {
    const response =
      await getOrder(orderNumber);

    order = response.order;
  } catch {
    order = null;
  }

  /*
   * Order not found
   */
  if (!order) {
    return (
      <main className="min-h-[70vh] bg-[var(--color-ivory)]">
        <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center justify-center px-5 py-16 sm:px-8">
          <div className="w-full border border-[var(--color-border)] bg-white p-8 text-center sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center bg-[var(--color-rose-light)]">
              <Clock3
                size={25}
                strokeWidth={1.5}
              />
            </div>

            <p className="mt-7 font-[var(--font-display)] text-3xl leading-none text-[var(--color-charcoal)] sm:text-4xl">
              We&apos;re checking your order
            </p>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[var(--color-text-muted)]">
              Your order may still be processing.
              Please check your orders shortly.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/account/orders"
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-[var(--color-charcoal)] px-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[var(--color-charcoal-soft)]"
              >
                View My Orders
                <ArrowRight size={15} />
              </Link>

              <Link
                href="/shop"
                className="inline-flex min-h-12 items-center justify-center border border-[var(--color-border)] bg-white px-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-charcoal)] transition hover:bg-[var(--color-cream)]"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const isCod =
    order.paymentMethod === "cod";

  const fullAddress = [
    order.shippingAddress.addressLine1,
    order.shippingAddress.addressLine2,
    order.shippingAddress.city,
    order.shippingAddress.state,
    order.shippingAddress.postalCode,
    order.shippingAddress.country,
  ].filter(Boolean);

  return (
    <main className="bg-[var(--color-ivory)]">
      {/* =====================================================
          HERO CONFIRMATION
      ===================================================== */}

      <section className="border-b border-[var(--color-border)]">
        <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-charcoal)] text-white">
              <Check
                size={29}
                strokeWidth={1.6}
              />
            </div>

            <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.24em] text-[var(--color-rose-dark)]">
              Order Confirmed
            </p>

            <h1 className="mt-3 font-[var(--font-display)] text-4xl leading-[0.95] text-[var(--color-charcoal)] sm:text-5xl lg:text-6xl">
              Thank you for your order.
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[var(--color-text-secondary)] sm:text-[15px]">
              Your order has been received and is now
              being prepared with care.
            </p>

            <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border border-[var(--color-border)] bg-white px-5 py-3">
              <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                Order Number
              </span>

              <span className="text-sm font-semibold tracking-[0.04em] text-[var(--color-charcoal)]">
                {order.orderNumber}
              </span>

              <span className="hidden h-4 w-px bg-[var(--color-border)] sm:block" />

              <span className="text-[10px] text-[var(--color-text-muted)]">
                {formatDate(order.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ORDER DETAILS
      ===================================================== */}

      <section>
        <div className="mx-auto grid w-full max-w-6xl gap-5 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.35fr_0.65fr] lg:px-10 lg:py-14">
          {/* LEFT */}
          <div className="space-y-5">
            {/* PAYMENT STATUS */}

            <div className="border border-[var(--color-border)] bg-white p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[var(--color-rose-light)]">
                  <CheckCircle2
                    size={19}
                    strokeWidth={1.5}
                    className="text-[var(--color-rose-dark)]"
                  />
                </div>

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                    Payment
                  </p>

                  <h2 className="mt-1 text-base font-semibold text-[var(--color-charcoal)]">
                    {isCod
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </h2>

                  <p className="mt-2 text-xs leading-6 text-[var(--color-text-secondary)]">
                    {isCod
                      ? "Please keep the payable amount ready when your order is delivered."
                      : "Your payment has been recorded successfully."}
                  </p>
                </div>
              </div>
            </div>

            {/* ORDER ITEMS */}

            <div className="border border-[var(--color-border)] bg-white">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-5 sm:px-7">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                    Your Selection
                  </p>

                  <h2 className="mt-1 font-[var(--font-display)] text-2xl text-[var(--color-charcoal)]">
                    Order Items
                  </h2>
                </div>

                <span className="text-xs text-[var(--color-text-muted)]">
                  {order.items.length}{" "}
                  {order.items.length === 1
                    ? "item"
                    : "items"}
                </span>
              </div>

              <div className="divide-y divide-[var(--color-border)]">
                {order.items.map(
                  (item) => (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      className="flex gap-4 px-6 py-5 sm:px-7"
                    >
                      <div className="h-24 w-20 shrink-0 overflow-hidden bg-[var(--color-cream)] sm:h-28 sm:w-24">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ShoppingBag
                              size={18}
                              strokeWidth={1.4}
                              className="text-[var(--color-text-muted)]"
                            />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col justify-between gap-3 sm:flex-row">
                          <div>
                            <Link
                              href={`/products/${item.productId}`}
                              className="text-sm font-semibold text-[var(--color-charcoal)] transition hover:text-[var(--color-rose-dark)]"
                            >
                              {item.name}
                            </Link>

                            <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                              {item.colorName}
                              {item.colorName &&
                              item.sizeLabel
                                ? " · "
                                : ""}
                              {item.sizeLabel}
                            </p>

                            <p className="mt-2 text-[11px] text-[var(--color-text-secondary)]">
                              Qty:{" "}
                              {item.quantity}
                            </p>
                          </div>

                          <div className="text-left sm:text-right">
                            <p className="text-sm font-semibold text-[var(--color-charcoal)]">
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

            <div className="border border-[var(--color-border)] bg-white p-6 sm:p-7">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[var(--color-cream)]">
                  <MapPin
                    size={18}
                    strokeWidth={1.5}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                    Delivery Address
                  </p>

                  <h2 className="mt-1 text-base font-semibold text-[var(--color-charcoal)]">
                    {order.shippingAddress.firstName}{" "}
                    {order.shippingAddress.lastName}
                  </h2>

                  <div className="mt-3 space-y-1 text-xs leading-5 text-[var(--color-text-secondary)]">
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

                  <div className="mt-3 space-y-1 text-xs text-[var(--color-text-secondary)]">
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

          {/* RIGHT */}
          <aside className="space-y-5">
            {/* SUMMARY */}

            <div className="border border-[var(--color-border)] bg-white p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <PackageCheck
                  size={19}
                  strokeWidth={1.5}
                />

                <h2 className="font-[var(--font-display)] text-2xl text-[var(--color-charcoal)]">
                  Order Summary
                </h2>
              </div>

              <div className="mt-6 space-y-3 border-t border-[var(--color-border)] pt-5">
                <div className="flex items-center justify-between gap-5 text-xs">
                  <span className="text-[var(--color-text-muted)]">
                    Subtotal
                  </span>

                  <span className="font-medium text-[var(--color-charcoal)]">
                    {formatCurrency(
                      order.subtotal,
                    )}
                  </span>
                </div>

                {order.productDiscount >
                  0 && (
                  <div className="flex items-center justify-between gap-5 text-xs">
                    <span className="text-[var(--color-text-muted)]">
                      Product Savings
                    </span>

                    <span className="font-medium text-[var(--color-rose-dark)]">
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

                    <span className="font-medium text-[var(--color-rose-dark)]">
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

                  <span className="font-medium text-[var(--color-charcoal)]">
                    {order.shippingAmount ===
                    0
                      ? "FREE"
                      : formatCurrency(
                          order.shippingAmount,
                        )}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-end justify-between gap-5 border-t border-[var(--color-border)] pt-5">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                    Total
                  </p>

                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    {isCod
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

            {/* STATUS */}

            <div className="border border-[var(--color-border)] bg-[var(--color-charcoal)] p-6 text-white sm:p-7">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/55">
                Current Status
              </p>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center border border-white/15 bg-white/5">
                  <Check
                    size={16}
                    strokeWidth={1.7}
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold capitalize">
                    {order.status.replace(
                      /_/g,
                      " ",
                    )}
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-white/55">
                    We&apos;ll keep you updated as
                    your order progresses.
                  </p>
                </div>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="border border-[var(--color-border)] bg-white p-6 sm:p-7">
              <Link
                href={`/account/orders/${encodeURIComponent(
                  order.orderNumber,
                )}`}
                className="flex min-h-12 w-full items-center justify-center gap-2 bg-[var(--color-charcoal)] px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[var(--color-charcoal-soft)]"
              >
                View Order
                <ArrowRight size={15} />
              </Link>

              <Link
                href="/shop"
                className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 border border-[var(--color-border)] bg-white px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-charcoal)] transition hover:bg-[var(--color-cream)]"
              >
                Continue Shopping
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* =====================================================
          FOOTNOTE
      ===================================================== */}

      <section className="border-t border-[var(--color-border)]">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-5 py-8 sm:px-8 lg:px-10">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[var(--color-cream)]">
            <CheckCircle2
              size={16}
              strokeWidth={1.5}
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