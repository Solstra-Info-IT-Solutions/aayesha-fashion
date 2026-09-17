/* ============================================================
   AAYESHA FASHION — ORDER TYPES
============================================================ */

import type {
  CheckoutAddress,
  CheckoutContact,
  CheckoutDeliveryMethod,
  CheckoutPaymentMethod,
} from "@/types/checkout";

/* ============================================================
   ORDER STATUS
============================================================ */

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded";

/* ============================================================
   PAYMENT STATUS
============================================================ */

export type PaymentStatus =
  | "pending"
  | "authorized"
  | "paid"
  | "failed"
  | "refunded"
  | "partially-refunded";

/* ============================================================
   ORDER ITEM
============================================================ */

export interface OrderItem {
  productId: string;

  sku: string;

  productName: string;

  slug: string;

  quantity: number;

  pricing: {
    mrp: number;

    sellingPrice: number;

    currency: "INR";
  };

  image?: string;

  lineTotal: number;
}

/* ============================================================
   ORDER PRICING
============================================================ */

export interface OrderPricing {
  subtotal: number;

  shipping: number;

  discount: number;

  tax: number;

  total: number;

  savings: number;

  currency: "INR";
}

/* ============================================================
   ORDER PAYMENT
============================================================ */

export interface OrderPayment {
  method: CheckoutPaymentMethod;

  status: PaymentStatus;

  transactionId?: string;

  gateway?: string;
}

/* ============================================================
   ORDER DELIVERY
============================================================ */

export interface OrderDelivery {
  method: CheckoutDeliveryMethod;

  estimatedDays: string;

  trackingNumber?: string;

  carrier?: string;
}

/* ============================================================
   ORDER
============================================================ */

export interface Order {
  id: string;

  orderNumber: string;

  customer: CheckoutContact;

  shippingAddress: CheckoutAddress;

  items: OrderItem[];

  pricing: OrderPricing;

  payment: OrderPayment;

  delivery: OrderDelivery;

  status: OrderStatus;

  couponCode?: string;

  createdAt: string;

  updatedAt: string;
}