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

        address: emptyAddress,

        delivery: "standard",

        payment: "cod",

        couponCode: "",

        step: "contact",

        setContact: (contact) =>
          set((state) => ({
            contact: {
              ...state.contact,
              ...contact,
            },
          })),

        setAddress: (address) =>
          set((state) => ({
            address: {
              ...state.address,
              ...address,
            },
          })),

        setDelivery: (delivery) =>
          set({
            delivery,
          }),

        setPayment: (payment) =>
          set({
            payment,
          }),

        setCouponCode: (couponCode) =>
          set({
            couponCode: couponCode.toUpperCase(),
          }),

        setStep: (step) =>
          set({
            step,
          }),

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

            step: "contact",
          }),
      }),

      {
        name: "aayesha-checkout",
      },
    ),
  );