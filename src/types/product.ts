/* ============================================================
   AAYESHA FASHION — PRODUCT DOMAIN TYPES
   PRODUCT-CENTRIC ARCHITECTURE
============================================================ */

export const PRODUCT_CURRENCY = "INR" as const;

/* ============================================================
   ENUMS / UNION TYPES
============================================================ */

export type ProductStatus =
  | "draft"
  | "active"
  | "archived"
  | "discontinued";

export type ProductMediaType =
  | "image"
  | "video";

export type ProductContentFormat =
  | "plain"
  | "html"
  | "rich";

export type ProductBadge =
  | "new"
  | "best-seller"
  | "featured"
  | "exclusive"
  | "limited"
  | "sale"
  | "trending"
  | "back-in-stock";

export type InventoryStatus =
  | "in-stock"
  | "low-stock"
  | "out-of-stock";

export type ProductSort =
  | "relevance"
  | "newest"
  | "price-low"
  | "price-high"
  | "rating"
  | "best-selling"
  | "featured";

/* ============================================================
   MONEY / PRICING
============================================================ */

export interface ProductPricing {
  mrp: number;
  sellingPrice: number;
  currency: typeof PRODUCT_CURRENCY;
}

/* ============================================================
   INVENTORY
============================================================ */

export interface ProductInventory {
  stock: number;
  reserved: number;
  lowStockThreshold: number;
}

/* ============================================================
   MEDIA
============================================================ */

export interface ProductMedia {
  id: string;

  type: ProductMediaType;

  src: string;

  alt?: string;

  thumbnail?: string;

  poster?: string;

  mimeType?: string;

  width?: number;

  height?: number;

  duration?: number;

  sortOrder: number;

  isPrimary: boolean;
}

/* ============================================================
   RICH CONTENT
============================================================ */

export interface ProductContentBlock {
  type:
    | "heading"
    | "paragraph"
    | "list"
    | "quote"
    | "image"
    | "video"
    | "divider";

  content?: string | string[];

  src?: string;

  alt?: string;

  caption?: string;
}

/* ============================================================
   PRODUCT CONTENT
============================================================ */

export interface ProductContent {
  description: string;

  descriptionFormat: ProductContentFormat;

  richContent?: string | ProductContentBlock[];
}

/* ============================================================
   SEO
============================================================ */

export interface ProductSEO {
  title?: string;

  description?: string;

  keywords?: string[];

  canonical?: string;

  noIndex?: boolean;
}

/* ============================================================
   MERCHANDISING
============================================================ */

export interface ProductMerchandising {
  isNew: boolean;

  isFeatured: boolean;

  isBestSeller: boolean;

  badges: ProductBadge[];

  ranking?: number;
}

/* ============================================================
   AVAILABILITY
============================================================ */

export interface ProductAvailability {
  isSoldOut: boolean;

  isInStock: boolean;

  isLowStock: boolean;

  availableQuantity: number;
}

/* ============================================================
   CORE PRODUCT
============================================================ */

export interface Product {
  id: string;

  _id: string;

  slug: string;

  name: string;

  categoryId: string;

  pricing: ProductPricing;

  inventory: ProductInventory;

  content: ProductContent;

  media: ProductMedia[];

  merchandising: ProductMerchandising;

  seo?: ProductSEO;

  status: ProductStatus;

  publishedAt?: string;

  createdAt: string;

  updatedAt: string;
}

/* ============================================================
   PRODUCT FILTERS
============================================================ */

export interface ProductFilters {
  categoryId?: string[];

  minPrice?: number;

  maxPrice?: number;

  inStockOnly?: boolean;

  isNew?: boolean;

  isBestSeller?: boolean;

  isFeatured?: boolean;

  search?: string;

  status?: ProductStatus;
}

/* ============================================================
   PRODUCT QUERY
============================================================ */

export interface ProductQuery {
  page?: number;

  limit?: number;

  filters?: ProductFilters;

  sort?: ProductSort;
}

/* ============================================================
   HELPER FUNCTIONS
============================================================ */

/**
 * Available stock after reserved quantity.
 */
export function getAvailableStock(
  product: Product,
): number {
  const stock = product.inventory?.stock ?? 0;
  const reserved = product.inventory?.reserved ?? 0;

  return Math.max(0, stock - reserved);
}

/* ------------------------------------------------------------
   INVENTORY STATUS
------------------------------------------------------------ */

export function getInventoryStatus(
  product: Product,
): InventoryStatus {
  const availableStock =
    getAvailableStock(product);

  if (availableStock <= 0) {
    return "out-of-stock";
  }

  if (
    availableStock <=
    Math.max(
      0,
      product.inventory.lowStockThreshold,
    )
  ) {
    return "low-stock";
  }

  return "in-stock";
}

/* ------------------------------------------------------------
   PRODUCT AVAILABILITY
------------------------------------------------------------ */

// export function getProductAvailability(
//   product: Product,
// ): ProductAvailability {
//   const availableQuantity =
//     getAvailableStock(product);

//   return {
//     isSoldOut:
//       availableQuantity <= 0,

//     isInStock:
//       availableQuantity > 0,

//     isLowStock:
//       availableQuantity > 0 &&
//       availableQuantity <=
//         Math.max(
//           0,
//           product.inventory.lowStockThreshold,
//         ),

//     availableQuantity,
//   };
// }


export function getProductAvailability(
  product: {
    inventory?: {
      stock?: number;
      reserved?: number;
      lowStockThreshold?: number;
    };
  },
) {
  const stock =
    product.inventory?.stock ?? 0;

  const reserved =
    product.inventory?.reserved ?? 0;

  const lowStockThreshold =
    product.inventory?.lowStockThreshold ?? 2;

  const availableQuantity =
    Math.max(
      0,
      stock - reserved,
    );

  return {
    isSoldOut:
      availableQuantity <= 0,

    isInStock:
      availableQuantity > 0,

    isLowStock:
      availableQuantity > 0 &&
      availableQuantity <=
        lowStockThreshold,

    availableQuantity,
  };
}
/* ------------------------------------------------------------
   DISCOUNT AMOUNT
------------------------------------------------------------ */

export function getDiscountAmount(
  pricing: ProductPricing,
): number {
  return Math.max(
    0,
    pricing.mrp -
      pricing.sellingPrice,
  );
}

/* ------------------------------------------------------------
   DISCOUNT %
------------------------------------------------------------ */

export function getDiscountPercentage(
  pricing: ProductPricing,
): number {
  if (
    pricing.mrp <= 0 ||
    pricing.sellingPrice >= pricing.mrp
  ) {
    return 0;
  }

  return Math.round(
    ((pricing.mrp -
      pricing.sellingPrice) /
      pricing.mrp) *
      100,
  );
}

/* ------------------------------------------------------------
   DISPLAY PRICE
------------------------------------------------------------ */

export function getProductStartingPrice(
  product: Product,
): number {
  return Math.max(
    0,
    product.pricing.sellingPrice,
  );
}

/* ------------------------------------------------------------
   PRODUCT MRP
------------------------------------------------------------ */

export function getProductStartingMrp(
  product: Product,
): number {
  return Math.max(
    0,
    product.pricing.mrp,
  );
}

/* ------------------------------------------------------------
   PRIMARY MEDIA
------------------------------------------------------------ */

export function getPrimaryProductMedia(
  product: Product,
): ProductMedia | undefined {
  return (
    product.media.find(
      (media) =>
        media.isPrimary &&
        media.type === "image",
    ) ??
    product.media.find(
      (media) =>
        media.type === "image",
    ) ??
    product.media[0]
  );
}

/* ------------------------------------------------------------
   PRODUCT ACTIVE CHECK
------------------------------------------------------------ */

export function isProductActive(
  product: Product,
): boolean {
  return product.status === "active";
}

/* ------------------------------------------------------------
   PRODUCT AVAILABLE CHECK
------------------------------------------------------------ */

export function isProductAvailable(
  product: Product,
): boolean {
  return (
    product.status === "active" &&
    getAvailableStock(product) > 0
  );
}

/* ------------------------------------------------------------
   BADGE LABEL
------------------------------------------------------------ */

export function formatProductBadge(
  badge: ProductBadge,
): string {
  return badge
    .replaceAll("-", " ")
    .replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase(),
    );
}

/* ============================================================
   DEVELOPMENT VALIDATION
============================================================ */

export function validateProduct(
  product: Product,
): string[] {
  const errors: string[] = [];

  if (!product.id) {
    errors.push(
      "Product id is required.",
    );
  }

  if (!product.slug) {
    errors.push(
      "Product slug is required.",
    );
  }

  if (!product.name) {
    errors.push(
      "Product name is required.",
    );
  }

  if (!product.categoryId) {
    errors.push(
      "Product categoryId is required.",
    );
  }

  if (!product.content) {
    errors.push(
      "Product content is required.",
    );
  }

  if (!product.merchandising) {
    errors.push(
      "Product merchandising is required.",
    );
  }

  if (!product.pricing) {
    errors.push(
      "Product pricing is required.",
    );
  } else {
    if (
      product.pricing.mrp < 0 ||
      product.pricing.sellingPrice < 0
    ) {
      errors.push(
        "Product pricing cannot be negative.",
      );
    }

    if (
      product.pricing.sellingPrice >
      product.pricing.mrp
    ) {
      errors.push(
        "Selling price cannot exceed MRP.",
      );
    }
  }

  if (!product.inventory) {
    errors.push(
      "Product inventory is required.",
    );
  } else {
    if (
      product.inventory.stock < 0
    ) {
      errors.push(
        "Product stock cannot be negative.",
      );
    }

    if (
      product.inventory.reserved < 0
    ) {
      errors.push(
        "Reserved stock cannot be negative.",
      );
    }

    if (
      product.inventory.reserved >
      product.inventory.stock
    ) {
      errors.push(
        "Reserved stock cannot exceed stock.",
      );
    }
  }

  return errors;
}