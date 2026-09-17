"use client";

import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

/* =========================================================
   TYPES
========================================================= */

export interface CartProductPricing {
  mrp: number;
  sellingPrice: number;
  currency: "INR";
}

export interface CartProductInventory {
  stock: number;
  reserved: number;
  lowStockThreshold: number;
}

export interface CartProduct {
  id: string;
  slug: string;
  name: string;
  categoryId: string;

  pricing: CartProductPricing;

  inventory: CartProductInventory;

  media: Array<{
    id?: string;
    url: string;
    type?: "image" | "video";
    alt?: string;
  }>;

  status:
    | "draft"
    | "active"
    | "archived"
    | "discontinued";
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: CartProduct;
}

export interface Cart {
  id: string | null;
  userId: string;
  items: CartItem[];
}

export interface AddToCartInput {
  productId: string;
  quantity?: number;
}

/* =========================================================
   AUTH TOKEN
========================================================= */

function getAccessToken(): string {
  const accessToken =
    useAuthStore.getState().accessToken;

  if (!accessToken) {
    throw new Error(
      "Authentication is required.",
    );
  }

  return accessToken;
}

/* =========================================================
   GET CART
========================================================= */

export async function getCart(): Promise<Cart> {
  const accessToken =
    getAccessToken();

  return apiFetch<Cart>(
    "/carts",
    {
      method: "GET",
      accessToken,
    },
  );
}

/* =========================================================
   ADD TO CART
========================================================= */

export async function addToCart(
  productId: string,
  quantity = 1,
): Promise<Cart> {
  const accessToken =
    getAccessToken();

  return apiFetch<Cart>(
    "/carts",
    {
      method: "POST",

      accessToken,

      body: JSON.stringify({
        productId,
        quantity,
      }),
    },
  );
}

/* =========================================================
   UPDATE CART ITEM
========================================================= */

export async function updateCartItem(
  productId: string,
  quantity: number,
): Promise<Cart> {
  const accessToken =
    getAccessToken();

  return apiFetch<Cart>(
    `/carts/${encodeURIComponent(productId)}`,
    {
      method: "PATCH",

      accessToken,

      body: JSON.stringify({
        quantity,
      }),
    },
  );
}

/* =========================================================
   REMOVE FROM CART
========================================================= */

export async function removeFromCart(
  productId: string,
): Promise<Cart> {
  const accessToken =
    getAccessToken();

  return apiFetch<Cart>(
    `/carts/${encodeURIComponent(productId)}`,
    {
      method: "DELETE",

      accessToken,
    },
  );
}

/* =========================================================
   CLEAR CART
========================================================= */

export async function clearCart(): Promise<Cart> {
  const accessToken =
    getAccessToken();

  return apiFetch<Cart>(
    "/carts",
    {
      method: "DELETE",

      accessToken,
    },
  );
}