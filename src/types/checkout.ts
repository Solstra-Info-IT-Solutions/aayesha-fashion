/* ============================================================
   AAYESHA FASHION — CHECKOUT TYPES
============================================================ */

export type CheckoutPaymentMethod =
  | "cod"
  | "online";

export type CheckoutDeliveryMethod =
  | "standard"
  | "express";

export type CheckoutStep =
  | "contact"
  | "address"
  | "delivery"
  | "payment"
  | "review";

export interface CheckoutContact {
  email: string;
  phone: string;
}

export interface CheckoutAddress {
  firstName: string;
  lastName: string;

  addressLine1: string;
  addressLine2?: string;

  landmark?: string;

  city: string;
  state: string;
  postalCode: string;

  country: string;

  isDefault?: boolean;
}

export interface CheckoutDeliveryOption {
  id: CheckoutDeliveryMethod;

  label: string;

  description: string;

  price: number;

  estimatedDays: string;
}

export interface CheckoutSelection {
  deliveryMethod: CheckoutDeliveryMethod;

  paymentMethod: CheckoutPaymentMethod;
}

export interface CheckoutDiscount {
  code: string;

  type: "percentage" | "fixed";

  value: number;

  amount: number;
}

export interface CheckoutSummary {
  subtotal: number;

  shipping: number;

  discount: number;

  tax: number;

  total: number;

  savings: number;
}

export interface CheckoutStateData {
  contact: CheckoutContact;

  address: CheckoutAddress;

  delivery: CheckoutDeliveryMethod;

  payment: CheckoutPaymentMethod;

  coupon?: CheckoutDiscount;
}

export interface CheckoutFormErrors {
  [field: string]: string | undefined;
}