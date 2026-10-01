"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  getCart,
} from "@/services/cart.service";

import {
  validateCustomerCoupon,
} from "@/services/coupon.service";

import {
  useCheckoutStore,
} from "@/store/checkout-store";

/* =========================================================
   COMPONENT
========================================================= */

export function CheckoutCoupon() {
  const couponCode = useCheckoutStore(
    (state) => state.couponCode,
  );

  const couponDiscount = useCheckoutStore(
    (state) => state.couponDiscount,
  );

  const couponShippingDiscount =
    useCheckoutStore(
      (state) =>
        state.couponShippingDiscount,
    );

  const contactEmail = useCheckoutStore(
    (state) => state.contact.email,
  );

  const delivery = useCheckoutStore(
    (state) => state.delivery,
  );

  const setCouponCode = useCheckoutStore(
    (state) => state.setCouponCode,
  );

  const setCouponDiscount = useCheckoutStore(
    (state) => state.setCouponDiscount,
  );

  const setCouponShippingDiscount =
    useCheckoutStore(
      (state) =>
        state.setCouponShippingDiscount,
    );

  const setCouponDiscountType =
    useCheckoutStore(
      (state) =>
        state.setCouponDiscountType,
    );

  const [input, setInput] = useState(
    couponCode,
  );

  const [loadingCart, setLoadingCart] =
    useState(true);

  const [cartItemCount, setCartItemCount] =
    useState(0);

  const [cartItems, setCartItems] =
    useState<
      Array<{
        productId: string;
        quantity: number;
      }>
    >([]);

  const [subtotal, setSubtotal] =
    useState(0);

  const [applying, setApplying] =
    useState(false);

  /* =========================================================
     KEEP INPUT IN SYNC WITH STORE
  ========================================================= */

  useEffect(() => {
    setInput(couponCode);
  }, [couponCode]);

  /* =========================================================
     LOAD CART FROM BACKEND
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    async function loadCart() {
      setLoadingCart(true);

      try {
        const cart = await getCart();

        if (cancelled) {
          return;
        }

        const items = cart.items.map(
          (item) => ({
            productId:
              item.productId,
            quantity:
              item.quantity,
          }),
        );

        let calculatedSubtotal = 0;

        for (const item of cart.items) {
          calculatedSubtotal +=
            Number(
              item.product.pricing
                .sellingPrice,
            ) *
            item.quantity;
        }

        setCartItems(items);

        setCartItemCount(
          cart.items.reduce(
            (total, item) =>
              total + item.quantity,
            0,
          ),
        );

        setSubtotal(
          calculatedSubtotal,
        );
      } catch (error) {
        console.error(
          "CHECKOUT COUPON CART ERROR:",
          error,
        );

        if (!cancelled) {
          setCartItems([]);
          setCartItemCount(0);
          setSubtotal(0);
        }
      } finally {
        if (!cancelled) {
          setLoadingCart(false);
        }
      }
    }

    void loadCart();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =========================================================
     CLEAR COUPON
  ========================================================= */

  const clearCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponShippingDiscount(0);
    setCouponDiscountType(null);
    setInput("");
  };

  /* =========================================================
     APPLY COUPON
  ========================================================= */

  const applyCoupon = async () => {
    const code = input
      .trim()
      .toUpperCase();

    if (!code) {
      toast.error(
        "Enter a coupon code.",
      );
      return;
    }

    if (!cartItemCount) {
      toast.error(
        "Your bag is empty.",
      );
      return;
    }

    if (loadingCart) {
      toast.error(
        "Please wait while your bag is loading.",
      );
      return;
    }

    if (!cartItems.length) {
      toast.error(
        "Unable to validate your cart items.",
      );
      return;
    }

    if (subtotal <= 0) {
      toast.error(
        "Your order subtotal must be greater than zero.",
      );
      return;
    }

    setApplying(true);

    try {
      const result =
        await validateCustomerCoupon({
          code,
          subtotal,
          customerEmail:
            contactEmail
              .trim()
              .toLowerCase() ||
            undefined,
          deliveryMethod:
            delivery,
          items: cartItems,
        });

      setCouponCode(
        result.couponCode,
      );

      setCouponDiscount(
        result.discountAmount,
      );

      setCouponShippingDiscount(
        result.shippingDiscount,
      );

      setCouponDiscountType(
        result.discountType,
      );

      setInput(
        result.couponCode,
      );

      toast.success(
        result.message ||
          "Coupon applied.",
      );
    } catch (error) {
      setCouponCode("");
      setCouponDiscount(0);
      setCouponShippingDiscount(0);
      setCouponDiscountType(null);
      setInput("");

      const message =
        error instanceof Error &&
        error.message
          ? error.message
          : "This coupon is not valid.";

      toast.error(message);
    } finally {
      setApplying(false);
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section className="overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]">
      {/* HEADER */}

      <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border-light)] px-5 py-5 sm:px-6 sm:py-6">
        <div>
          <p className="eyebrow text-[var(--color-text-muted)]">
            Offers
          </p>

          <h2 className="mt-2 font-[var(--font-display)] text-2xl font-medium leading-none text-[var(--color-text)] sm:text-3xl">
            Have a coupon?
          </h2>

          <p className="mt-2 text-[11px] leading-5 text-[var(--color-text-secondary)]">
            Apply an available offer to your order.
          </p>
        </div>

        {couponCode ? (
          <button
            type="button"
            onClick={clearCoupon}
            disabled={applying}
            className="shrink-0 pt-1 text-[10px] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Remove
          </button>
        ) : null}
      </div>

      {/* COUPON FORM */}

      <div className="px-5 py-6 sm:px-6 sm:py-7">
        <div className="flex">
          <input
            value={input}
            onChange={(event) =>
              setInput(
                event.target.value
                  .toUpperCase()
                  .slice(0, 40),
              )
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void applyCoupon();
              }
            }}
            disabled={
              applying ||
              loadingCart
            }
            placeholder="Enter code"
            aria-label="Coupon code"
            className="h-12 min-w-0 flex-1 border border-r-0 border-[var(--color-border-dark)] bg-[var(--color-surface-soft)] px-4 text-xs font-medium uppercase tracking-[0.06em] text-[var(--color-text)] outline-none transition-colors placeholder:normal-case placeholder:tracking-normal placeholder:text-[var(--color-text-muted)] hover:border-[var(--color-accent-soft)] focus:border-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-60"
          />

          <button
            type="button"
            onClick={() =>
              void applyCoupon()
            }
            disabled={
              applying ||
              loadingCart
            }
            className="h-12 min-w-[90px] bg-[var(--color-text)] px-5 text-[10px] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-inverse)] transition-all duration-[var(--duration-base)] hover:bg-[var(--color-accent-dark)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {applying
              ? "Applying..."
              : "Apply"}
          </button>
        </div>

        {/* APPLIED COUPON */}

        {couponCode ? (
          <div className="mt-4 border border-[var(--color-accent-soft)] bg-[var(--color-bg-subtle)] px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center bg-[var(--color-accent)] text-[var(--color-text-inverse)]">
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="h-3 w-3"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 10.5L8.2 13.5L15 6.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <p className="text-[10px] font-semibold uppercase tracking-[var(--tracking-wide)] text-[var(--color-success)]">
                  {couponCode} applied
                </p>
              </div>

              {couponDiscount > 0 ? (
                <p className="text-[10px] font-semibold text-[var(--color-success)]">
                  Save ₹
                  {couponDiscount.toLocaleString(
                    "en-IN",
                  )}
                </p>
              ) : null}

              {couponShippingDiscount >
              0 ? (
                <p className="text-[10px] font-semibold uppercase tracking-[var(--tracking-wide)] text-[var(--color-success)]">
                  Free shipping
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* SUPPORTING NOTE */}

        {!couponCode ? (
          <p className="mt-4 text-[10px] leading-5 text-[var(--color-text-muted)]">
            Coupon eligibility is checked against your
            current bag, delivery method and account details.
          </p>
        ) : null}
      </div>
    </section>
  );
}