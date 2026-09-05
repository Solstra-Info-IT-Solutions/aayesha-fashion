import { apiFetch } from "@/lib/api";

export interface CreateOrderItemPayload {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface CreateOrderAddressPayload {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CreateOrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  shippingAddress: CreateOrderAddressPayload;

  deliveryMethod: "standard" | "express";
  paymentMethod: "cod";

  couponCode?: string;

  items: CreateOrderItemPayload[];
}

export interface CreatedOrder {
  id: string;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;

  subtotal: number;
  shippingAmount: number;
  productDiscount: number;
  couponDiscount: number;
  total: number;

  currency: "INR";

  createdAt: string;
}

export interface OrderItem {
  productId: string;
  variantId: string;
  name: string;
  sku: string;
  colorId: string;
  colorName: string;
  sizeCode: string;
  sizeLabel: string;
  image: string;
  mrp: number;
  sellingPrice: number;
  currency: "INR";
  quantity: number;
  lineTotal: number;
}

export interface OrderAddress {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderDetails {
  id: string;
  orderNumber: string;

  customerName: string;
  customerEmail: string;
  customerPhone: string;

  shippingAddress: OrderAddress;

  deliveryMethod: "standard" | "express";
  shippingAmount: number;

  subtotal: number;
  mrpTotal: number;
  productDiscount: number;

  couponCode?: string;
  couponDiscount: number;

  total: number;
  currency: "INR";

  paymentMethod: "cod" | "online";
  paymentStatus:
    | "pending"
    | "paid"
    | "failed"
    | "refunded"
    | "partially_refunded";

  status:
    | "confirmed"
    | "processing"
    | "packed"
    | "shipped"
    | "in_transit"
    | "out_for_delivery"
    | "delivered"
    | "cancelled"
    | "returned"
    | "exchanged";

  items: OrderItem[];

  createdAt: string;
  stockReducedAt?: string;
}

interface CreateOrderResponse {
  order: CreatedOrder;
}

interface GetOrderResponse {
  order: OrderDetails;
}

export async function createOrder(
  payload: CreateOrderPayload,
  idempotencyKey: string,
) {
  return apiFetch<CreateOrderResponse>("/orders", {
    method: "POST",
    headers: {
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(payload),
  });
}

export async function getOrder(
  orderNumber: string,
) {
  return apiFetch<GetOrderResponse>(
    `/orders/${encodeURIComponent(orderNumber)}`,
  );
}