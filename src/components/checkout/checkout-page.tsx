"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ShieldCheck,
} from "lucide-react";

import { useCartStore } from "@/store/cart-store";

import { CheckoutContact } from "@/components/checkout/checkout-contact";
import { CheckoutAddress } from "@/components/checkout/checkout-address";
import { CheckoutDelivery } from "@/components/checkout/checkout-delivery";
import { CheckoutPayment } from "@/components/checkout/checkout-payment";
import { CheckoutCoupon } from "@/components/checkout/checkout-coupon";
import { CheckoutSummary } from "@/components/checkout/checkout-summary";
import { CheckoutPlaceOrder } from "@/components/checkout/checkout-place-order";

export function CheckoutPage() {
  const items = useCartStore(
    (state) => state.items,
  );

  if (!items.length) {
    return (
      <main className="min-h-[65vh] bg-[var(--color-ivory)]">
        <div className="mx-auto flex min-h-[65vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            Checkout
          </p>

          <h1 className="mt-3 font-[var(--font-cormorant)] text-4xl">
            Your bag is empty.
          </h1>

          <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
            Add something beautiful before continuing to
            checkout.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-flex min-h-12 items-center justify-center bg-[var(--color-charcoal)] px-7 text-[10px] font-semibold uppercase tracking-[0.16em] text-white"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[var(--color-ivory)]">
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-12 lg:px-10 lg:py-16">
        {/* HEADER */}
        <div className="border-b border-[var(--color-border)] pb-7">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)] transition hover:text-[var(--color-charcoal)]"
          >
            <ChevronLeft size={14} />
            Back to Bag
          </Link>

          <div className="mt-5 flex items-end justify-between gap-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                Ayesha Fashion
              </p>

              <h1 className="mt-2 font-[var(--font-cormorant)] text-4xl leading-none sm:text-5xl">
                Checkout
              </h1>
            </div>

            <div className="hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)] sm:flex">
              <ShieldCheck size={15} />
              Secure Checkout
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start lg:gap-16">
          {/* LEFT */}
          <div className="space-y-5">
            <CheckoutContact />

            <CheckoutAddress />

            <CheckoutDelivery />

            <CheckoutPayment />

            <CheckoutCoupon />

            <CheckoutPlaceOrder />
          </div>

          {/* RIGHT */}
          <CheckoutSummary />
        </div>
      </div>
    </main>
  );
}