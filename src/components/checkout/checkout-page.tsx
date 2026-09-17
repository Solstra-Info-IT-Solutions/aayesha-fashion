"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

import { getCart } from "@/services/cart.service";

import { CheckoutContact } from "@/components/checkout/checkout-contact";
import { CheckoutAddress } from "@/components/checkout/checkout-address";
import { CheckoutDelivery } from "@/components/checkout/checkout-delivery";
import { CheckoutPayment } from "@/components/checkout/checkout-payment";
import { CheckoutCoupon } from "@/components/checkout/checkout-coupon";
import { CheckoutSummary } from "@/components/checkout/checkout-summary";
import { CheckoutPlaceOrder } from "@/components/checkout/checkout-place-order";

export function CheckoutPage() {
  const [hasItems, setHasItems] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /* ==========================================================
     LOAD CART FROM BACKEND
  ========================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadCart() {
      try {
        const cart = await getCart();

        if (cancelled) {
          return;
        }

        setHasItems(cart.items.length > 0);
      } catch (error) {
        console.error(
          "CHECKOUT CART ERROR:",
          error,
        );

        if (!cancelled) {
          setHasItems(false);
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
     LOADING
  ========================================================== */

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[var(--color-bg)]">
        <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="border-b border-[var(--color-border-light)] pb-7">
            <div className="h-4 w-28 animate-pulse bg-[var(--color-bg-soft)]" />

            <div className="mt-7 h-12 w-48 animate-pulse bg-[var(--color-bg-soft)]" />

            <div className="mt-4 h-4 w-full max-w-xl animate-pulse bg-[var(--color-bg-soft)]" />
          </div>

          <div className="mt-9 grid gap-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start lg:gap-16 xl:gap-20">
            <div className="space-y-4">
              <div className="h-28 animate-pulse border border-[var(--color-border-light)] bg-[var(--color-surface)]" />
              <div className="h-28 animate-pulse border border-[var(--color-border-light)] bg-[var(--color-surface)]" />
              <div className="h-28 animate-pulse border border-[var(--color-border-light)] bg-[var(--color-surface)]" />
              <div className="h-28 animate-pulse border border-[var(--color-border-light)] bg-[var(--color-surface)]" />
            </div>

            <div className="h-[360px] animate-pulse border border-[var(--color-border-light)] bg-[var(--color-surface)]" />
          </div>
        </div>
      </main>
    );
  }

  /* ==========================================================
     EMPTY CART
  ========================================================== */

  if (!hasItems) {
    return (
      <main className="min-h-[70vh] bg-[var(--color-bg)]">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
          <div className="flex h-16 w-16 items-center justify-center border border-[var(--color-border)]">
            <ShieldCheck
              size={22}
              strokeWidth={1.25}
              className="text-[var(--color-text)]"
            />
          </div>

          <p className="eyebrow mt-7 text-[var(--color-accent)]">
            Checkout
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
            Add something beautiful before continuing to
            checkout.
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
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  /* ==========================================================
     CHECKOUT
  ========================================================== */

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="border-b border-[var(--color-border-light)] pb-7">
          <div className="flex items-center justify-between gap-5">
            <Link
              href="/cart"
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

              Back to Bag
            </Link>

            <div
              className="
                hidden
                items-center
                gap-2
                font-body
                text-[10px]
                font-semibold
                uppercase
                tracking-[var(--tracking-wider)]
                text-[var(--color-text-muted)]
                sm:flex
              "
            >
              <ShieldCheck
                size={15}
                strokeWidth={1.3}
                className="text-[var(--color-accent)]"
              />

              Secure Checkout
            </div>
          </div>

          <div className="mt-7">
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
              Checkout
            </h1>

            <p className="mt-4 max-w-xl font-body text-sm leading-7 text-[var(--color-text-secondary)]">
              Complete your details below to place your order
              with Aayesha Fashion.
            </p>
          </div>
        </div>

        {/* ====================================================
            CHECKOUT BODY
        ==================================================== */}

        <div className="mt-9 grid gap-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start lg:gap-16 xl:gap-20">
          {/* ==================================================
              LEFT — CHECKOUT STEPS
          ================================================== */}

          <div className="min-w-0 space-y-4 sm:space-y-5">
            <CheckoutContact />

            <CheckoutAddress />

            <CheckoutDelivery />

            <CheckoutPayment />

            <CheckoutCoupon />

            <CheckoutPlaceOrder />
          </div>

          {/* ==================================================
              RIGHT — ORDER SUMMARY
          ================================================== */}

          <aside className="lg:sticky lg:top-24">
            <CheckoutSummary />
          </aside>
        </div>
      </div>
    </main>
  );
}