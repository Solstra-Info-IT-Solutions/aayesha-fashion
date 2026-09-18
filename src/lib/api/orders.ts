import { apiFetch } from "@/lib/api";

/* ============================================================
   CREATE ORDER ITEM
============================================================ */

export interface CreateOrderItemPayload {
  /**
   * MongoDB Product _id
   */
  productId: string;

  quantity: number;
}

/* ============================================================
   CREATE ORDER ADDRESS
============================================================ */

export interface CreateOrderAddressPayload {
  firstName: string;
  lastName: string;

  addressLine1: string;
  addressLine2?: string;
  landmark?: string;

  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/* ============================================================
   CREATE ORDER PAYLOAD
============================================================ */

export interface CreateOrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  shippingAddress: CreateOrderAddressPayload;

  deliveryMethod: "standard" | "express";

  paymentMethod: "cod";

  couponCode?: string;

  /**
   * Product-only order items.
   * Each product is an independent product.
   */
  items: CreateOrderItemPayload[];
}

/* ============================================================
   CREATED ORDER
============================================================ */

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

/* ============================================================
   ORDER ITEM
============================================================ */

export interface OrderItem {
  /**
   * MongoDB Product _id stored on the order item.
   */
  productId: string;

  /**
   * Product snapshot fields stored at order time.
   */
  name: string;
  sku: string;

  image: string;

  mrp: number;
  sellingPrice: number;

  currency: "INR";

  quantity: number;
  lineTotal: number;
}

/* ============================================================
   ORDER ADDRESS
============================================================ */

export interface OrderAddress {
  firstName: string;
  lastName: string;

  addressLine1: string;
  addressLine2?: string;
  landmark?: string;

  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/* ============================================================
   SHIPPING INFO
============================================================ */

export interface OrderShippingInfo {
  courierName?: string;
  trackingNumber?: string;
  trackingUrl?: string;
}

/* ============================================================
   ORDER DETAILS
============================================================ */

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

  /**
   * Product-only order items.
   */
  items: OrderItem[];

  createdAt: string;

  stockReducedAt?: string;

  deliveredAt?: string;

  shippingInfo?: OrderShippingInfo;
}

/* ============================================================
   API RESPONSES
============================================================ */

export interface CreateOrderResponse {
  order: CreatedOrder;
  publicAccessToken: string;
}

interface GetOrderResponse {
  order: OrderDetails;
}

interface GetCustomerOrdersResponse {
  orders: OrderDetails[];
}

/* ============================================================
   CREATE ORDER
============================================================ */

/**
 * Creates a customer order.
 *
 * Endpoint:
 * POST /api/orders
 *
 * Product ID:
 * MongoDB Product._id
 */
export async function createOrder(
  payload: CreateOrderPayload,
  idempotencyKey: string,
  accessToken?: string | null,
): Promise<CreateOrderResponse> {
  if (!idempotencyKey.trim()) {
    throw new Error(
      "Idempotency key is required.",
    );
  }

  if (!payload.items.length) {
    throw new Error(
      "Cannot create an order with an empty cart.",
    );
  }

  return apiFetch<CreateOrderResponse>(
    "/orders",
    {
      method: "POST",

      headers: {
        "Idempotency-Key":
          idempotencyKey.trim(),
      },

      ...(accessToken
        ? {
            accessToken,
          }
        : {}),

      body: JSON.stringify(payload),
    },
  );
}

/* ============================================================
   GET CUSTOMER ORDERS
============================================================ */

/**
 * Returns only orders belonging to
 * the authenticated customer.
 *
 * GET /api/orders/my-orders
 */
export async function getCustomerOrders(
  accessToken: string,
): Promise<GetCustomerOrdersResponse> {
  return apiFetch<GetCustomerOrdersResponse>(
    "/orders/my-orders",
    {
      method: "GET",
      accessToken,
    },
  );
}

/* ============================================================
   GET SINGLE ORDER — CUSTOMER / GUEST
============================================================ */

/**
 * Customer-safe order lookup using the secure
 * publicAccessToken returned at order creation.
 *
 * GET /api/orders/:orderNumber?accessToken=...
 */
export async function getOrder(
  orderNumber: string,
  accessToken: string,
): Promise<GetOrderResponse> {
  const params = new URLSearchParams();

  params.set(
    "accessToken",
    accessToken,
  );

  return apiFetch<GetOrderResponse>(
    `/orders/${encodeURIComponent(
      orderNumber,
    )}?${params.toString()}`,
    {
      method: "GET",
    },
  );
}

/* ============================================================
   GET CUSTOMER ORDER
============================================================ */

/**
 * Authenticated customer order lookup.
 *
 * GET /api/orders/my-orders/:orderNumber
 */
export async function getCustomerOrder(
  accessToken: string,
  orderNumber: string,
): Promise<GetOrderResponse> {
  return apiFetch<GetOrderResponse>(
    `/orders/my-orders/${encodeURIComponent(
      orderNumber,
    )}`,
    {
      method: "GET",
      accessToken,
    },
  );
}