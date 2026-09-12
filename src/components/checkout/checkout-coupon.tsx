"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  getProductById,
} from "@/lib/api/products";

import {
  validateCustomerCoupon,
} from "@/services/coupon.service";

import {
  useCartStore,
} from "@/store/cart-store";

import {
  useCheckoutStore,
} from "@/store/checkout-store";

import type {
  Product,
} from "@/types/product";

type ResolvedCouponItem = {
  product: Product;
  variantId: string;
  productId: string;
  quantity: number;
  sellingPrice: number;
};

/* =========================================================
   COMPONENT
========================================================= */

export function CheckoutCoupon() {
  const cartItems = useCartStore(
    (state) => state.items,
  );

  const couponCode = useCheckoutStore(
    (state) => state.couponCode,
  );

  const couponDiscount = useCheckoutStore(
    (state) => state.couponDiscount,
  );

  const couponShippingDiscount =
    useCheckoutStore(
      (state) => state.couponShippingDiscount,
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
      (state) => state.setCouponShippingDiscount,
    );

  const setCouponDiscountType =
    useCheckoutStore(
      (state) => state.setCouponDiscountType,
    );

  const [input, setInput] = useState(
    couponCode,
  );

  const [items, setItems] = useState<
    ResolvedCouponItem[]
  >([]);

  const [loadingProducts, setLoadingProducts] =
    useState(true);

  const [applying, setApplying] =
    useState(false);

  /* =========================================================
     KEEP INPUT IN SYNC WITH STORE
  ========================================================= */

  useEffect(() => {
    setInput(couponCode);
  }, [couponCode]);

  /* =========================================================
     LOAD CART PRODUCTS
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      if (!cartItems.length) {
        setItems([]);
        setLoadingProducts(false);
        return;
      }

      setLoadingProducts(true);

      try {
        const productIds = Array.from(
          new Set(
            cartItems.map(
              (item) => item.productId,
            ),
          ),
        );

        const responses =
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

        const productMap = new Map<
          string,
          Product
        >();

        responses.forEach((product) => {
          if (product) {
            productMap.set(
              product.id,
              product,
            );
          }
        });

        const resolved: ResolvedCouponItem[] =
          [];

        for (const cartItem of cartItems) {
          const product =
            productMap.get(
              cartItem.productId,
            );

          if (!product) {
            continue;
          }

          const variant =
            product.variants.find(
              (item) =>
                item.id ===
                cartItem.variantId,
            );

          if (!variant) {
            continue;
          }

          resolved.push({
            product,
            productId:
              cartItem.productId,
            variantId:
              cartItem.variantId,
            quantity:
              cartItem.quantity,
            sellingPrice:
              Number(
                variant.pricing.sellingPrice,
              ),
          });
        }

        setItems(resolved);
      } finally {
        if (!cancelled) {
          setLoadingProducts(false);
        }
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, [cartItems]);

  /* =========================================================
     CALCULATE SUBTOTAL
  ========================================================= */

  const subtotal = items.reduce(
    (total, item) =>
      total +
      item.sellingPrice *
        item.quantity,
    0,
  );

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

    if (!cartItems.length) {
      toast.error(
        "Your bag is empty.",
      );
      return;
    }

    if (loadingProducts) {
      toast.error(
        "Please wait while your bag is loading.",
      );
      return;
    }

    if (!items.length) {
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
    <section className="border border-[var(--color-border)] bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em]">
          Have a coupon?
        </p>

        {couponCode && (
          <button
            type="button"
            onClick={clearCoupon}
            disabled={applying}
            className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)] transition hover:text-[var(--color-charcoal)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Remove
          </button>
        )}
      </div>

      <div className="mt-4 flex">
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
          disabled={applying}
          placeholder="Enter code"
          className="h-11 min-w-0 flex-1 border border-r-0 border-[var(--color-border-dark)] bg-transparent px-4 text-xs uppercase outline-none placeholder:normal-case placeholder:text-[var(--color-text-muted)] disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="button"
          onClick={() =>
            void applyCoupon()
          }
          disabled={
            applying ||
            loadingProducts
          }
          className="h-11 min-w-[82px] bg-[var(--color-charcoal)] px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {applying
            ? "Applying..."
            : "Apply"}
        </button>
      </div>

      {couponCode && (
        <div className="mt-3 flex items-center justify-between gap-4">
          <p className="text-[10px] font-semibold text-[var(--color-success)]">
            {couponCode} applied
          </p>

          {couponDiscount > 0 && (
            <p className="text-[10px] font-semibold text-[var(--color-success)]">
              Save ₹
              {couponDiscount.toLocaleString(
                "en-IN",
              )}
            </p>
          )}

          {couponShippingDiscount >
            0 && (
            <p className="text-[10px] font-semibold text-[var(--color-success)]">
              Free shipping
            </p>
          )}
        </div>
      )}
    </section>
  );
}