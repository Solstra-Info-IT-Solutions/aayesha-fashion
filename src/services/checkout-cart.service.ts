"use client";

import {
  clearBuyNowSelection,
  getBuyNowSelection,
  isBuyNowCheckout,
} from "@/lib/buy-now";

import {
  clearCart,
  getCart,
  type Cart,
} from "@/services/cart.service";

import { getProductById } from "@/services/product.service";

/**
 * Cart-shaped data for checkout.
 *
 * Normal checkout  → the customer's server cart.
 * Buy Now checkout → the single selected product, without
 *                    touching the customer's cart.
 */
export async function getCheckoutCart(): Promise<Cart> {
  if (isBuyNowCheckout()) {
    const selection = getBuyNowSelection();

    if (!selection) {
      return { id: null, userId: "", items: [] };
    }

    const product = await getProductById(selection.productId);

    return {
      id: null,
      userId: "",
      items: [
        {
          productId: product._id,
          quantity: selection.quantity,
          product: {
            _id: product._id,
            id: product.id,
            slug: product.slug,
            name: product.name,
            categoryId: product.categoryId,
            pricing: {
              mrp: product.pricing.mrp,
              sellingPrice: product.pricing.sellingPrice,
              currency: "INR",
            },
            inventory: {
              stock: product.inventory.stock,
              reserved: product.inventory.reserved ?? 0,
              lowStockThreshold:
                product.inventory.lowStockThreshold ?? 0,
            },
            media: product.media.map((item) => ({
              id: item.id,
              url: item.src,
              type: item.type,
              alt: item.alt ?? "",
            })),
            status: product.status,
          },
        },
      ],
    };
  }

  return getCart();
}

/**
 * Called after a successful order. A Buy Now order must not
 * clear the customer's cart.
 */
export async function finishCheckoutCart(): Promise<void> {
  if (isBuyNowCheckout()) {
    clearBuyNowSelection();
    return;
  }

  await clearCart();
}
