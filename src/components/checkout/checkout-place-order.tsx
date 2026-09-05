"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  LockKeyhole,
  ShoppingBag,
} from "lucide-react";
import toast from "react-hot-toast";

import { getProductById } from "@/lib/api/products";
import {
  createOrder,
  type CreateOrderPayload,
} from "@/lib/api/orders";
import { useCartStore } from "@/store/cart-store";
import { useCheckoutStore } from "@/store/checkout-store";
import type { Product } from "@/types/product";

type ResolvedItem = {
  product: Product;
  variantId: string;
  quantity: number;
};

export function CheckoutPlaceOrder() {
  const router = useRouter();

  const items = useCartStore(
    (state) => state.items,
  );

  const clearCart = useCartStore(
    (state) => state.clearCart,
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

  const [resolvedItems, setResolvedItems] =
    useState<ResolvedItem[]>([]);

  const [loadingProducts, setLoadingProducts] =
    useState(true);

  const [placingOrder, setPlacingOrder] =
    useState(false);

  /*
   * Keep the same idempotency key while an order request
   * is being retried. This prevents accidental duplicate
   * orders when the first request succeeded but the client
   * did not receive the response.
   */
  const idempotencyKeyRef = useRef<string | null>(
    null,
  );

  /* ==========================================================
     RESOLVE CART ITEMS FROM BACKEND
  ========================================================== */

  useEffect(() => {
    let cancelled = false;

    async function resolveItems() {
      if (!items.length) {
        setResolvedItems([]);
        setLoadingProducts(false);
        return;
      }

      setLoadingProducts(true);

      try {
        const productIds = Array.from(
          new Set(
            items.map(
              (item) => item.productId,
            ),
          ),
        );

        const products = await Promise.all(
          productIds.map(
            async (productId) => {
              try {
                return await getProductById(
                  productId,
                );
              } catch {
                return null;
              }
            },
          ),
        );

        if (cancelled) {
          return;
        }

        const productMap = new Map<
          string,
          Product
        >();

        products.forEach((product) => {
          if (product) {
            productMap.set(
              product.id,
              product,
            );
          }
        });

        const nextItems: ResolvedItem[] =
          [];

        for (const item of items) {
          const product = productMap.get(
            item.productId,
          );

          if (!product) {
            continue;
          }

          const variant =
            product.variants.find(
              (productVariant) =>
                productVariant.id ===
                item.variantId &&
                productVariant.status ===
                  "active",
            );

          if (!variant) {
            continue;
          }

          nextItems.push({
            product,
            variantId: item.variantId,
            quantity: item.quantity,
          });
        }

        setResolvedItems(nextItems);
      } finally {
        if (!cancelled) {
          setLoadingProducts(false);
        }
      }
    }

    void resolveItems();

    return () => {
      cancelled = true;
    };
  }, [items]);

  /* ==========================================================
     CLIENT-SIDE DISPLAY TOTAL
     ========================================================== */

  let subtotal = 0;

  for (const item of resolvedItems) {
    const variant =
      item.product.variants.find(
        (productVariant) =>
          productVariant.id ===
          item.variantId,
      );

    if (!variant) {
      continue;
    }

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

  const normalizedCoupon =
    couponCode.trim().toUpperCase();

  const couponDiscount =
    normalizedCoupon === "AYESHA10"
      ? Math.round(subtotal * 0.1)
      : 0;

  const total = Math.max(
    0,
    subtotal +
      shipping -
      couponDiscount,
  );

  /* ==========================================================
     HELPERS
  ========================================================== */

  const getCustomerName = () => {
    return [
      address.firstName.trim(),
      address.lastName.trim(),
    ]
      .filter(Boolean)
      .join(" ");
  };

  const createIdempotencyKey = () => {
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current =
        crypto.randomUUID();
    }

    return idempotencyKeyRef.current;
  };

  /* ==========================================================
     VALIDATION
  ========================================================== */

  const validateCheckout = () => {
    if (!contact.email.trim()) {
      toast.error(
        "Please enter your email address.",
      );
      return false;
    }

    if (
      !/^\d{10}$/.test(
        contact.phone.trim(),
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
        address.postalCode.trim(),
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

    if (
      resolvedItems.length !==
      items.length
    ) {
      toast.error(
        "Some items in your bag are no longer available. Please review your bag.",
      );
      return false;
    }

    /*
     * Current backend supports COD only.
     */
    if (payment !== "cod") {
      toast.error(
        "Online payment is not available yet. Please select Cash on Delivery.",
      );
      return false;
    }

    return true;
  };

  /* ==========================================================
     PLACE ORDER
  ========================================================== */

  const handlePlaceOrder = async () => {
    if (placingOrder || loadingProducts) {
      return;
    }

    if (!validateCheckout()) {
      return;
    }

    setPlacingOrder(true);

    try {
      const orderPayload: CreateOrderPayload =
        {
          customerName:
            getCustomerName(),

          customerEmail:
            contact.email.trim(),

          customerPhone:
            contact.phone.trim(),

          shippingAddress: {
            firstName:
              address.firstName.trim(),

            lastName:
              address.lastName.trim(),

            addressLine1:
              address.addressLine1.trim(),

            addressLine2:
              address.addressLine2?.trim() ||
              "",

            city:
              address.city.trim(),

            state:
              address.state.trim(),

            postalCode:
              address.postalCode.trim(),

            country:
              address.country?.trim() ||
              "India",
          },

          deliveryMethod:
            delivery === "express"
              ? "express"
              : "standard",

          paymentMethod: "cod",

          couponCode:
            normalizedCoupon ||
            undefined,

          items: items.map(
            (item) => ({
              productId:
                item.productId,

              variantId:
                item.variantId,

              quantity:
                item.quantity,
            }),
          ),
        };

      const idempotencyKey =
        createIdempotencyKey();

      const response =
        await createOrder(
          orderPayload,
          idempotencyKey,
        );

      const order =
        response.order;

      /*
       * Order created successfully.
       *
       * Backend is the source of truth for the final
       * amount, inventory and order status.
       */
      clearCart();

      /*
       * Reset the idempotency key only after
       * successful order creation.
       */
      idempotencyKeyRef.current = null;

      toast.success(
        "Your order has been placed successfully.",
      );

      router.replace(
        `/checkout/success?orderNumber=${encodeURIComponent(
          order.orderNumber,
        )}`,
      );
    } catch (error) {
      console.error(
        "Place order error:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to place your order. Please try again.",
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <section className="border border-[var(--color-border)] bg-white p-5 sm:p-6">
      {/* SECURITY */}

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
            Your order information is handled
            securely.
          </p>
        </div>
      </div>

      {/* PAYMENT */}

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
              : shipping === 0
                ? "FREE"
                : `₹${shipping}`}
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
            Final amount is verified securely by
            the server.
          </p>
        </div>

        <p className="text-xl font-semibold">
          ₹
          {total.toLocaleString(
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
          loadingProducts ||
          !items.length ||
          payment !== "cod"
        }
        className="flex min-h-[52px] w-full items-center justify-center gap-2 bg-[var(--color-charcoal)] px-5 text-[10px] font-semibold uppercase tracking-[0.17em] text-white transition hover:bg-[var(--color-charcoal-soft)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ShoppingBag size={16} />

        {loadingProducts
          ? "Preparing Order..."
          : placingOrder
            ? "Placing Order..."
            : payment === "cod"
              ? `Place COD Order · ₹${total.toLocaleString(
                  "en-IN",
                )}`
              : "Online Payment Unavailable"}
      </button>

      <p className="mt-3 text-center text-[9px] leading-5 text-[var(--color-text-muted)]">
        By placing your order, you agree to
        Ayesha Fashion&apos;s applicable terms,
        shipping and return policies.
      </p>
    </section>
  );
}