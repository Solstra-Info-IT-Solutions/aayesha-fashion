"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  LockKeyhole,
  ShoppingBag,
} from "lucide-react";
import toast from "react-hot-toast";

import { getProductById } from "@/data/products";
import { useCartStore } from "@/store/cart-store";
import { useCheckoutStore } from "@/store/checkout-store";

export function CheckoutPlaceOrder() {
  const items = useCartStore(
    (state) => state.items,
  );

  const contact = useCheckoutStore(
    (state) => state.contact,
  );

  const address = useCheckoutStore(
    (state) => state.address,
  );

  const delivery = useCheckoutStore(
    (state) => state.delivery,
  );

  const payment = useCheckoutStore(
    (state) => state.payment,
  );

  const couponCode = useCheckoutStore(
    (state) => state.couponCode,
  );

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const summary = useMemo(() => {
    let subtotal = 0;

    for (const item of items) {
      const product = getProductById(
        item.productId,
      );

      if (!product) continue;

      const variant = product.variants.find(
        (productVariant) =>
          productVariant.id === item.variantId,
      );

      if (!variant) continue;

      subtotal +=
        variant.pricing.sellingPrice *
        item.quantity;
    }

    const shipping =
      delivery === "express"
        ? 199
        : subtotal >= 2999
          ? 0
          : 99;

    const couponDiscount =
      couponCode === "AYESHA10"
        ? Math.round(subtotal * 0.1)
        : 0;

    const total = Math.max(
      0,
      subtotal +
        shipping -
        couponDiscount,
    );

    return {
      subtotal,
      shipping,
      couponDiscount,
      total,
    };
  }, [
    items,
    delivery,
    couponCode,
  ]);

  const validateCheckout = () => {
    if (!contact.email.trim()) {
      toast.error(
        "Please enter your email address.",
      );
      return false;
    }

    if (
      !/^\d{10}$/.test(
        contact.phone,
      )
    ) {
      toast.error(
        "Please enter a valid 10-digit phone number.",
      );
      return false;
    }

    if (
      !address.firstName.trim() ||
      !address.lastName.trim()
    ) {
      toast.error(
        "Please enter your full name.",
      );
      return false;
    }

    if (!address.addressLine1.trim()) {
      toast.error(
        "Please enter your delivery address.",
      );
      return false;
    }

    if (
      !address.city.trim() ||
      !address.state.trim()
    ) {
      toast.error(
        "Please enter your city and state.",
      );
      return false;
    }

    if (
      !/^\d{6}$/.test(
        address.postalCode,
      )
    ) {
      toast.error(
        "Please enter a valid 6-digit PIN code.",
      );
      return false;
    }

    if (!items.length) {
      toast.error(
        "Your bag is empty.",
      );
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (placingOrder) return;

    if (!validateCheckout()) {
      return;
    }

    setPlacingOrder(true);

    try {
      /*
       * TEMPORARY FRONTEND ORDER FLOW
       *
       * Backend integration will replace this block.
       *
       * COD:
       * POST /api/orders
       *
       * Online:
       * POST /api/orders
       * -> create pending order
       * -> payment gateway
       * -> verify payment
       */

      const orderPayload = {
        customer: {
          email: contact.email,
          phone: contact.phone,
        },

        shippingAddress: address,

        delivery: {
          method: delivery,
        },

        payment: {
          method: payment,
        },

        couponCode:
          couponCode || undefined,

        items,
      };

      console.log(
        "Checkout order payload:",
        orderPayload,
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 900),
      );

      if (payment === "cod") {
        toast.success(
          "COD order details validated successfully.",
        );
      } else {
        toast.success(
          "Order details validated. Payment integration is next.",
        );
      }
    } catch (error) {
      console.error(
        "Checkout error:",
        error,
      );

      toast.error(
        "Unable to process your order. Please try again.",
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <section className="border border-[var(--color-border)] bg-white p-5 sm:p-6">
      {/* SECURITY HEADER */}
      <div className="flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[var(--color-cream)]">
          <LockKeyhole
            size={16}
            strokeWidth={1.5}
          />
        </div>

        <div>
          <p className="text-xs font-semibold">
            Secure Order Placement
          </p>

          <p className="mt-1 text-[10px] leading-5 text-[var(--color-text-muted)]">
            Your order information is handled securely.
          </p>
        </div>
      </div>

      {/* PAYMENT STATUS */}
      <div className="mt-5 border-y border-[var(--color-border)] py-4">
        <div className="flex items-center justify-between gap-5">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              Payment Method
            </p>

            <p className="mt-1 text-sm font-medium">
              {payment === "cod"
                ? "Cash on Delivery"
                : "Online Payment"}
            </p>
          </div>

          <CheckCircle2
            size={17}
            className="text-[var(--color-success)]"
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-5">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              Delivery
            </p>

            <p className="mt-1 text-sm font-medium">
              {delivery === "express"
                ? "Express Delivery"
                : "Standard Delivery"}
            </p>
          </div>

          <span className="text-xs font-semibold">
            {delivery === "express"
              ? "₹199"
              : summary.shipping === 0
                ? "FREE"
                : `₹${summary.shipping}`}
          </span>
        </div>
      </div>

      {/* TOTAL */}
      <div className="flex items-end justify-between gap-5 py-5">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            Payable Total
          </p>

          <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
            Inclusive of applicable taxes
          </p>
        </div>

        <p className="text-xl font-semibold">
          ₹
          {summary.total.toLocaleString(
            "en-IN",
          )}
        </p>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={handlePlaceOrder}
        disabled={
          placingOrder ||
          !items.length
        }
        className="flex min-h-[52px] w-full items-center justify-center gap-2 bg-[var(--color-charcoal)] px-5 text-[10px] font-semibold uppercase tracking-[0.17em] text-white transition hover:bg-[var(--color-charcoal-soft)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ShoppingBag size={16} />

        {placingOrder
          ? "Processing..."
          : payment === "cod"
            ? `Place COD Order · ₹${summary.total.toLocaleString("en-IN")}`
            : `Continue to Payment · ₹${summary.total.toLocaleString("en-IN")}`}
      </button>

      <p className="mt-3 text-center text-[9px] leading-5 text-[var(--color-text-muted)]">
        By placing your order, you agree to Ayesha
        Fashion's applicable terms, shipping and return
        policies.
      </p>
    </section>
  );
}