/* ============================================================
   AAYESHA FASHION — ORDER TYPES
============================================================ */

import type {
  ProductColor,
  ProductPricing,
  ProductSize,
} from "@/types/product";

import type {
  CheckoutAddress,
  CheckoutContact,
  CheckoutDeliveryMethod,
  CheckoutPaymentMethod,
} from "@/types/checkout";

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

export type PaymentStatus =
  | "pending"
  | "authorized"
  | "paid"
  | "failed"
  | "refunded"
  | "partially-refunded";

export interface OrderItem {
  productId: string;

  variantId: string;

  sku: string;

  productName: string;

  slug: string;

  quantity: number;

  color: ProductColor;

  size: ProductSize;

  pricing: ProductPricing;

  image?: string;

  lineTotal: number;
}

export interface OrderPricing {
  subtotal: number;

  shipping: number;

  discount: number;

  tax: number;

  total: number;

  savings: number;

  currency: "INR";
}

export interface OrderPayment {
  method: CheckoutPaymentMethod;

  status: PaymentStatus;

  transactionId?: string;

  gateway?: string;
}

export interface OrderDelivery {
  method: CheckoutDeliveryMethod;

  estimatedDays: string;

  trackingNumber?: string;

  carrier?: string;
}

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