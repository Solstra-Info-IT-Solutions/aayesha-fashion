"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { useCheckoutStore } from "@/store/checkout-store";

export function CheckoutCoupon() {
  const couponCode = useCheckoutStore(
    (state) => state.couponCode,
  );

  const setCouponCode = useCheckoutStore(
    (state) => state.setCouponCode,
  );

  const [input, setInput] =
    useState(couponCode);

  const applyCoupon = () => {
    const code = input.trim().toUpperCase();

    if (!code) {
      toast.error("Enter a coupon code.");
      return;
    }

    /*
     * Temporary frontend validation.
     * Replace with API validation later.
     */
    if (code === "AYESHA10") {
      setCouponCode(code);
      toast.success("Coupon applied.");
      return;
    }

    toast.error("This coupon is not valid.");
  };

  return (
    <section className="border border-[var(--color-border)] bg-white p-5 sm:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em]">
        Have a coupon?
      </p>

      <div className="mt-4 flex">
        <input
          value={input}
          onChange={(event) =>
            setInput(
              event.target.value
                .toUpperCase()
                .slice(0, 30),
            )
          }
          placeholder="Enter code"
          className="h-11 min-w-0 flex-1 border border-r-0 border-[var(--color-border-dark)] bg-transparent px-4 text-xs uppercase outline-none placeholder:normal-case placeholder:text-[var(--color-text-muted)]"
        />

        <button
          type="button"
          onClick={applyCoupon}
          className="h-11 bg-[var(--color-charcoal)] px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white"
        >
          Apply
        </button>
      </div>

      {couponCode && (
        <p className="mt-3 text-[10px] font-semibold text-[var(--color-success)]">
          {couponCode} applied
        </p>
      )}
    </section>
  );
}