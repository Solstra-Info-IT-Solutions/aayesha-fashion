"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  CheckoutAddress,
  CheckoutDeliveryMethod,
  CheckoutPaymentMethod,
  CheckoutStep,
} from "@/types/checkout";

interface CheckoutStore {
  contact: {
    email: string;
    phone: string;
  };

  address: CheckoutAddress;

  delivery: CheckoutDeliveryMethod;

  payment: CheckoutPaymentMethod;

  couponCode: string;

  couponDiscount: number;

  couponShippingDiscount: number;

  couponDiscountType:
    | "percentage"
    | "fixed"
    | "free_shipping"
    | null;

  step: CheckoutStep;

  setContact: (
    contact: Partial<CheckoutStore["contact"]>,
  ) => void;

  setAddress: (
    address: Partial<CheckoutAddress>,
  ) => void;

  setDelivery: (
    delivery: CheckoutDeliveryMethod,
  ) => void;

  setPayment: (
    payment: CheckoutPaymentMethod,
  ) => void;

  setCouponCode: (
    code: string,
  ) => void;

  setCouponDiscount: (
    couponDiscount: number,
  ) => void;

  setCouponShippingDiscount: (
    couponShippingDiscount: number,
  ) => void;

  setCouponDiscountType: (
    couponDiscountType:
      | "percentage"
      | "fixed"
      | "free_shipping"
      | null,
  ) => void;

  setStep: (
    step: CheckoutStep,
  ) => void;

  resetCheckout: () => void;
}

const emptyAddress: CheckoutAddress = {
  firstName: "",
  lastName: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

export const useCheckoutStore =
  create<CheckoutStore>()(
    persist(
      (set) => ({
        contact: {
          email: "",
          phone: "",
        },

        address: {
          ...emptyAddress,
        },

        delivery: "standard",

        payment: "cod",

        couponCode: "",

        couponDiscount: 0,

        couponShippingDiscount: 0,

        couponDiscountType: null,

        step: "contact",

        /* =====================================================
           CONTACT
        ===================================================== */

        setContact: (contact) =>
          set((state) => ({
            contact: {
              ...state.contact,
              ...contact,
            },
          })),

        /* =====================================================
           ADDRESS
        ===================================================== */

        setAddress: (address) =>
          set((state) => ({
            address: {
              ...state.address,
              ...address,
            },
          })),

        /* =====================================================
           DELIVERY
        ===================================================== */

        setDelivery: (delivery) =>
          set({
            delivery,
          }),

        /* =====================================================
           PAYMENT
        ===================================================== */

        setPayment: (payment) =>
          set({
            payment,
          }),

        /* =====================================================
           COUPON
        ===================================================== */

        setCouponCode: (couponCode) =>
          set({
            couponCode:
              couponCode
                .trim()
                .toUpperCase(),
          }),

        setCouponDiscount: (
          couponDiscount,
        ) =>
          set({
            couponDiscount:
              Math.max(
                0,
                couponDiscount,
              ),
          }),

        setCouponShippingDiscount: (
          couponShippingDiscount,
        ) =>
          set({
            couponShippingDiscount:
              Math.max(
                0,
                couponShippingDiscount,
              ),
          }),

        setCouponDiscountType: (
          couponDiscountType,
        ) =>
          set({
            couponDiscountType,
          }),

        /* =====================================================
           STEP
        ===================================================== */

        setStep: (step) =>
          set({
            step,
          }),

        /* =====================================================
           RESET
        ===================================================== */

        resetCheckout: () =>
          set({
            contact: {
              email: "",
              phone: "",
            },

            address: {
              ...emptyAddress,
            },

            delivery: "standard",

            payment: "cod",

            couponCode: "",

            couponDiscount: 0,

            couponShippingDiscount: 0,

            couponDiscountType: null,

            step: "contact",
          }),
      }),

      {
        name: "aayesha-checkout",
      },
    ),
  );