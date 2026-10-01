/* ============================================================
   BUY NOW — direct checkout of a single product

   Stored in sessionStorage so the customer's cart is left
   untouched. The checkout page reads it when opened with
   /checkout?buyNow=1.
============================================================ */

const BUY_NOW_KEY = "aayesha-buy-now";

export const BUY_NOW_CHECKOUT_URL = "/checkout?buyNow=1";

export interface BuyNowSelection {
  productId: string;
  quantity: number;
}

export function setBuyNowSelection(
  selection: BuyNowSelection,
): void {
  try {
    sessionStorage.setItem(
      BUY_NOW_KEY,
      JSON.stringify(selection),
    );
  } catch {
    throw new Error(
      "Unable to start Buy Now. Please enable browser storage and try again.",
    );
  }
}

export function getBuyNowSelection(): BuyNowSelection | null {
  try {
    const raw = sessionStorage.getItem(BUY_NOW_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<BuyNowSelection>;

    if (
      typeof parsed.productId !== "string" ||
      !parsed.productId ||
      typeof parsed.quantity !== "number" ||
      !Number.isInteger(parsed.quantity) ||
      parsed.quantity < 1
    ) {
      return null;
    }

    return {
      productId: parsed.productId,
      quantity: parsed.quantity,
    };
  } catch {
    return null;
  }
}

export function clearBuyNowSelection(): void {
  try {
    sessionStorage.removeItem(BUY_NOW_KEY);
  } catch {
    /* ignore */
  }
}

export function isBuyNowCheckout(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    new URLSearchParams(window.location.search).get("buyNow") ===
    "1"
  );
}
