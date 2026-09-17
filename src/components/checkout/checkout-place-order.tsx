"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

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

import {
  createCustomerAddress,
  getCustomerAddresses,
} from "@/lib/customer-api";

import { useAuthStore } from "@/store/auth-store";

import { useCartStore } from "@/store/cart-store";

import {
  useCheckoutStore,
} from "@/store/checkout-store";

import type { Product } from "@/types/product";

/* ==========================================================
   TYPES
========================================================== */

type ResolvedItem = {
  product: Product;
  productId: string;
  quantity: number;
};

/* ==========================================================
   ORDER ACCESS TOKEN STORAGE
========================================================== */

const getOrderAccessTokenKey = (
  orderNumber: string,
) =>
  `aayesha-order-access-token:${orderNumber}`;

/* ==========================================================
   COMPONENT
========================================================== */

export function CheckoutPlaceOrder() {
  const router = useRouter();

  /* ========================================================
     AUTH
  ======================================================== */

  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  /* ========================================================
     CART
  ======================================================== */

  const items = useCartStore(
    (state) => state.items,
  );

  const clearCart = useCartStore(
    (state) => state.clearCart,
  );

  /* ========================================================
     CHECKOUT
  ======================================================== */

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

  const couponDiscount = useCheckoutStore(
    (state) => state.couponDiscount,
  );

  const couponShippingDiscount =
    useCheckoutStore(
      (state) =>
        state.couponShippingDiscount,
    );

  /* ========================================================
     LOCAL STATE
  ======================================================== */

  const [
    resolvedItems,
    setResolvedItems,
  ] = useState<ResolvedItem[]>([]);

  const [
    loadingProducts,
    setLoadingProducts,
  ] = useState(true);

  const [
    placingOrder,
    setPlacingOrder,
  ] = useState(false);

  /*
   * Keep the same idempotency key during one
   * order attempt / retry sequence.
   */
  const idempotencyKeyRef =
    useRef<string | null>(null);

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

        const products =
          await Promise.all(
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

        const productMap =
          new Map<string, Product>();

        products.forEach(
          (product) => {
            if (product) {
              productMap.set(
                product.id,
                product,
              );
            }
          },
        );

        const nextItems: ResolvedItem[] =
          [];

        for (const item of items) {
          const product =
            productMap.get(
              item.productId,
            );

          if (!product) {
            continue;
          }

          nextItems.push({
            product,
            productId:
              item.productId,
            quantity:
              item.quantity,
          });
        }

        setResolvedItems(
          nextItems,
        );
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
    subtotal +=
      Number(
        item.product.pricing.sellingPrice,
      ) *
      item.quantity;
  }

  const baseShipping =
    delivery === "express"
      ? 199
      : subtotal >= 2999
        ? 0
        : 99;

  /*
   * Coupon values come from the server-validated
   * coupon stored in the checkout store.
   */
  const shipping = Math.max(
    0,
    baseShipping -
      couponShippingDiscount,
  );

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

  const createIdempotencyKey =
    () => {
      if (
        !idempotencyKeyRef.current
      ) {
        idempotencyKeyRef.current =
          crypto.randomUUID();
      }

      return idempotencyKeyRef.current;
    };

  /* ==========================================================
     SAVE ADDRESS FOR FUTURE ORDERS
  ========================================================== */

  const saveAddressForFutureOrders =
    async () => {
      if (
        !isAuthenticated ||
        !accessToken ||
        !address.isDefault
      ) {
        return;
      }

      const customerName =
        getCustomerName();

      if (!customerName) {
        return;
      }

      const existingAddresses =
        await getCustomerAddresses(
          accessToken,
        );

      const alreadySaved =
        existingAddresses.some(
          (savedAddress) =>
            savedAddress.name
              .trim()
              .toLowerCase() ===
              customerName
                .trim()
                .toLowerCase() &&
            savedAddress.addressLine
              .trim()
              .toLowerCase() ===
              address.addressLine1
                .trim()
                .toLowerCase() &&
            savedAddress.city
              .trim()
              .toLowerCase() ===
              address.city
                .trim()
                .toLowerCase() &&
            savedAddress.state
              .trim()
              .toLowerCase() ===
              address.state
                .trim()
                .toLowerCase() &&
            savedAddress.pincode
              .trim() ===
              address.postalCode
                .trim(),
        );

      if (alreadySaved) {
        return;
      }

      await createCustomerAddress(
        accessToken,
        {
          name: customerName,

          phone:
            contact.phone.trim(),

          addressLine:
            address.addressLine1.trim(),

          city:
            address.city.trim(),

          state:
            address.state.trim(),

          pincode:
            address.postalCode.trim(),

          landmark:
            address.landmark?.trim() ||
            "",

          isDefault: true,
        },
      );
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

    if (
      !address.addressLine1.trim()
    ) {
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

  const handlePlaceOrder =
    async () => {
      if (
        placingOrder ||
        loadingProducts
      ) {
        return;
      }

      if (!validateCheckout()) {
        return;
      }

      setPlacingOrder(true);

      try {
        /* ----------------------------------------------------
           SAVE ADDRESS
        ---------------------------------------------------- */

        console.log(
          "CHECKOUT AUTH STATE:",
          {
            isAuthenticated,
            accessTokenExists:
              Boolean(accessToken),
            accessTokenLength:
              accessToken?.length ?? 0,
          },
        );

        try {
          await saveAddressForFutureOrders();
        } catch (error) {
          /*
           * Address saving should never block an order.
           */
          console.error(
            "Save checkout address error:",
            error,
          );
        }

        /* ----------------------------------------------------
           ORDER PAYLOAD
        ---------------------------------------------------- */

        const normalizedCoupon =
          couponCode
            .trim()
            .toUpperCase();

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

              landmark:
                address.landmark?.trim() ||
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
              delivery ===
              "express"
                ? "express"
                : "standard",

            paymentMethod:
              "cod",

            couponCode:
              normalizedCoupon ||
              undefined,

            items: items.map(
              (item) => ({
                productId:
                  item.productId,

                quantity:
                  item.quantity,
              }),
            ),
          };

        /* ----------------------------------------------------
           IDEMPOTENCY
        ---------------------------------------------------- */

        const idempotencyKey =
          createIdempotencyKey();

        /* ----------------------------------------------------
           CREATE ORDER
        ---------------------------------------------------- */

        console.log(
          "BEFORE CREATE ORDER:",
          {
            accessTokenExists:
              Boolean(accessToken),
            accessTokenLength:
              accessToken?.length ?? 0,
          },
        );

        const response =
          await createOrder(
            orderPayload,
            idempotencyKey,
            accessToken,
          );

        const order =
          response.order;

        const publicAccessToken =
          response.publicAccessToken;

        /* ----------------------------------------------------
           VERIFY PUBLIC ORDER ACCESS TOKEN
        ---------------------------------------------------- */

        if (
          !publicAccessToken ||
          typeof publicAccessToken !==
            "string"
        ) {
          throw new Error(
            "Order was created, but secure order access information was not returned.",
          );
        }

        /* ----------------------------------------------------
           SAVE PUBLIC ACCESS TOKEN
        ---------------------------------------------------- */

        const storageKey =
          getOrderAccessTokenKey(
            order.orderNumber,
          );

        try {
          sessionStorage.setItem(
            storageKey,
            publicAccessToken,
          );
        } catch (storageError) {
          console.error(
            "Unable to store order access token:",
            storageError,
          );

          throw new Error(
            "Your order was created, but we could not securely prepare the confirmation page. Please check your order shortly.",
          );
        }

        /* ----------------------------------------------------
           CLEAR CART
        ---------------------------------------------------- */

        clearCart();

        idempotencyKeyRef.current =
          null;

        /* ----------------------------------------------------
           SUCCESS MESSAGE
        ---------------------------------------------------- */

        toast.success(
          "Your order has been placed successfully.",
        );

        /* ----------------------------------------------------
           REDIRECT
        ---------------------------------------------------- */

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
    <section className="overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]">
      {/* =====================================================
          HEADER / SECURITY
      ===================================================== */}

      <div className="border-b border-[var(--color-border-light)] px-5 py-6 sm:px-7 sm:py-7">
        <div className="flex items-start gap-4">
          <span className="mt-0.5 font-[var(--font-display)] text-lg text-[var(--color-accent)]">
            05
          </span>

          <div>
            <p className="eyebrow text-[var(--color-text-muted)]">
              Complete Order
            </p>

            <h2 className="mt-2 font-[var(--font-display)] text-3xl font-medium leading-none tracking-[var(--tracking-tight)] text-[var(--color-text)] sm:text-4xl">
              Review &amp; place order
            </h2>

            <p className="mt-3 max-w-lg text-xs leading-5 text-[var(--color-text-secondary)] sm:text-sm">
              Review your selections before completing your
              purchase.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {/* ===================================================
            SECURITY
        =================================================== */}

        <div className="flex gap-3 border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-4 sm:px-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[var(--color-surface)] text-[var(--color-accent)]">
            <LockKeyhole
              size={16}
              strokeWidth={1.5}
            />
          </div>

          <div>
            <p className="text-xs font-semibold text-[var(--color-text)]">
              Secure order placement
            </p>

            <p className="mt-1 text-[10px] leading-5 text-[var(--color-text-secondary)]">
              Your order information is handled securely and
              your final amount is verified by our server.
            </p>
          </div>
        </div>

        {/* ===================================================
            PAYMENT + DELIVERY
        =================================================== */}

        <div className="mt-6 border-y border-[var(--color-border-light)] py-5">
          <div className="flex items-center justify-between gap-5">
            <div>
              <p className="eyebrow text-[var(--color-text-muted)]">
                Payment Method
              </p>

              <p className="mt-1 text-sm font-medium text-[var(--color-text)]">
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

          <div className="mt-5 flex items-center justify-between gap-5">
            <div>
              <p className="eyebrow text-[var(--color-text-muted)]">
                Delivery
              </p>

              <p className="mt-1 text-sm font-medium text-[var(--color-text)]">
                {delivery ===
                "express"
                  ? "Express Delivery"
                  : "Standard Delivery"}
              </p>
            </div>

            <span className="text-xs font-semibold text-[var(--color-text)]">
              {shipping === 0
                ? "FREE"
                : `₹${shipping}`}
            </span>
          </div>
        </div>

        {/* ===================================================
            COUPON
        =================================================== */}

        {couponCode ? (
          <div className="border-b border-[var(--color-border-light)] py-5">
            <div className="flex items-center justify-between gap-4">
              <span className="eyebrow text-[var(--color-text-muted)]">
                Coupon
              </span>

              <span className="text-xs font-semibold uppercase tracking-[var(--tracking-wide)] text-[var(--color-success)]">
                {couponCode}
              </span>
            </div>

            {couponDiscount > 0 ? (
              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-[10px] text-[var(--color-text-muted)]">
                  Coupon Discount
                </span>

                <span className="text-[10px] font-semibold text-[var(--color-success)]">
                  - ₹
                  {couponDiscount.toLocaleString(
                    "en-IN",
                  )}
                </span>
              </div>
            ) : null}

            {couponShippingDiscount >
            0 ? (
              <div className="mt-2 flex items-center justify-between gap-4">
                <span className="text-[10px] text-[var(--color-text-muted)]">
                  Shipping Discount
                </span>

                <span className="text-[10px] font-semibold text-[var(--color-success)]">
                  - ₹
                  {couponShippingDiscount.toLocaleString(
                    "en-IN",
                  )}
                </span>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* ===================================================
            TOTAL
        =================================================== */}

        <div className="flex items-end justify-between gap-5 py-6">
          <div>
            <p className="eyebrow text-[var(--color-text-muted)]">
              Payable Total
            </p>

            <p className="mt-2 max-w-[230px] text-[10px] leading-5 text-[var(--color-text-muted)]">
              Final amount is verified securely by the server.
            </p>
          </div>

          <p className="shrink-0 font-[var(--font-display)] text-3xl font-medium leading-none text-[var(--color-text)] sm:text-4xl">
            ₹
            {total.toLocaleString(
              "en-IN",
            )}
          </p>
        </div>

        {/* ===================================================
            PLACE ORDER
        =================================================== */}

        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={
            placingOrder ||
            loadingProducts ||
            !items.length ||
            payment !== "cod"
          }
          className="group flex min-h-[54px] w-full items-center justify-center gap-2 bg-[var(--color-text)] px-5 text-[10px] font-semibold uppercase tracking-[var(--tracking-luxury)] text-[var(--color-text-inverse)] transition-all duration-[var(--duration-base)] hover:bg-[var(--color-accent-dark)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingBag
            size={16}
            className="transition-transform duration-[var(--duration-base)] group-hover:-translate-y-px"
          />

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

        {/* ===================================================
            TERMS
        =================================================== */}

        <p className="mt-4 text-center text-[9px] leading-5 text-[var(--color-text-muted)]">
          By placing your order, you agree to Aayesha
          Fashion&apos;s applicable terms, shipping and return
          policies.
        </p>
      </div>
    </section>
  );
}