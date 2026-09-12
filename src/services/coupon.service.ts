import { apiFetch } from "@/lib/api";

/* =========================================================
   TYPES
========================================================= */

export type CustomerCouponDiscountType =
  | "percentage"
  | "fixed"
  | "free_shipping";

export interface CustomerCouponItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface ValidateCustomerCouponInput {
  code: string;
  subtotal: number;
  customerEmail?: string;
  deliveryMethod:
    | "standard"
    | "express";
  items: CustomerCouponItem[];
}

export interface ValidateCustomerCouponResponse {
  couponCode: string;

  description: string;

  discountType:
    | "percentage"
    | "fixed"
    | "free_shipping";

  discountValue: number;

  maxDiscountAmount:
    | number
    | null;

  discountAmount: number;

  shippingDiscount: number;

  deliveryMethod:
    | "standard"
    | "express";

  message: string;
}

interface CouponApiResponse {
  success: boolean;
  data: ValidateCustomerCouponResponse;
}

/* =========================================================
   VALIDATE CUSTOMER COUPON
========================================================= */

export const validateCustomerCoupon =
  async (
    input: ValidateCustomerCouponInput,
  ): Promise<ValidateCustomerCouponResponse> => {
    const response =
      await apiFetch<CouponApiResponse>(
        "/coupons/validate",
        {
          method: "POST",

          body: JSON.stringify({
            code:
              input.code
                .trim()
                .toUpperCase(),

            subtotal:
              input.subtotal,

            ...(input.customerEmail
              ? {
                  customerEmail:
                    input.customerEmail
                      .trim()
                      .toLowerCase(),
                }
              : {}),

            deliveryMethod:
              input.deliveryMethod,

            items:
              input.items,
          }),
        },
      );

    if (
      !response.success
    ) {
      throw new Error(
        "Unable to validate coupon.",
      );
    }

    return response.data;
  };