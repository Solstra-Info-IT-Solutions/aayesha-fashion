import { apiFetch } from "@/lib/api";

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
  status: "draft" | "active" | "archived" | "discontinued";
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

export async function getCart(): Promise<Cart> {
  return apiFetch<Cart>("/carts");
}

export async function addToCart(
  productId: string,
  quantity = 1,
): Promise<Cart> {
  return apiFetch<Cart>("/carts", {
    method: "POST",
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });
}

export async function updateCartItem(
  productId: string,
  quantity: number,
): Promise<Cart> {
  return apiFetch<Cart>(
    `/carts/${encodeURIComponent(productId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        quantity,
      }),
    },
  );
}

export async function removeFromCart(
  productId: string,
): Promise<Cart> {
  return apiFetch<Cart>(
    `/carts/${encodeURIComponent(productId)}`,
    {
      method: "DELETE",
    },
  );
}

export async function clearCart(): Promise<Cart> {
  return apiFetch<Cart>("/carts", {
    method: "DELETE",
  });
}