/* ============================================================
   AAYESHA FASHION — PRODUCT DOMAIN TYPES
   API / CMS / ADMIN / STOREFRONT READY
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

export type VariantStatus =
  | "active"
  | "inactive"
  | "discontinued";

export type ProductType =
  | "anarkali"
  | "kurta"
  | "kurta-set"
  | "suit-set"
  | "lehenga"
  | "saree"
  | "dress"
  | "top"
  | "bottom"
  | "co-ord"
  | "jacket"
  | "dupatta"
  | "other";

export type ProductCategory =
  | "festive"
  | "ethnic"
  | "contemporary"
  | "new-arrival";

export type InventoryStatus =
  | "in-stock"
  | "low-stock"
  | "out-of-stock"
  | "backorder";

export type ProductBadge =
  | "new"
  | "best-seller"
  | "featured"
  | "exclusive"
  | "limited"
  | "sale"
  | "trending"
  | "back-in-stock";

export type ProductMediaType =
  | "image"
  | "video"
  | "external-video"
  | "360";

export type ProductImageType =
  | "model"
  | "front"
  | "back"
  | "detail"
  | "flat-lay"
  | "lifestyle"
  | "video-poster";

export type ProductContentFormat =
  | "plain"
  | "html"
  | "rich";

export type ProductContentBlockType =
  | "heading"
  | "paragraph"
  | "list"
  | "quote"
  | "image"
  | "video"
  | "divider";

export type SizeChartUnit =
  | "inch"
  | "cm";

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
  compareAtPrice?: number;
}

/* ============================================================
   COLOR
============================================================ */

export interface ProductColor {
  id: string;
  name: string;
  slug: string;
  hex?: string;
  swatchImage?: string;
}

/* ============================================================
   SIZE
============================================================ */

export interface ProductSize {
  code: string;
  label: string;
  sortOrder: number;
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

  colorId?: string;

  imageType?: ProductImageType;

  sortOrder: number;

  isPrimary?: boolean;
}

/* ============================================================
   VARIANT
============================================================ */

export interface ProductVariant {
  id: string;
  sku: string;

  barcode?: string;

  color: ProductColor;
  size: ProductSize;

  pricing: ProductPricing;

  inventory: ProductInventory;

  mediaIds?: string[];

  weight?: number;

  status: VariantStatus;
}

/* ============================================================
   PRODUCT ATTRIBUTES
============================================================ */

export interface ProductAttributes {
  fabric?: string;

  composition?: string;

  fit?: string;

  occasion?: string[];

  pattern?: string;

  work?: string;

  neckline?: string;

  sleeve?: string;

  silhouette?: string;

  length?: string;

  lining?: string;

  transparency?: string;

  careInstructions?: string[];
}

/* ============================================================
   SIZE MEASUREMENTS
============================================================ */

export interface SizeMeasurement {
  size: string;

  bust?: number | string;
  waist?: number | string;
  hip?: number | string;

  shoulder?: number | string;
  armhole?: number | string;

  sleeveLength?: number | string;

  garmentLength?: number | string;

  bottomLength?: number | string;

  inseam?: number | string;

  rise?: number | string;
}

/* ============================================================
   SIZE CHART
============================================================ */

export interface ProductSizeChart {
  unit: SizeChartUnit;

  measurements: SizeMeasurement[];

  fitNote?: string;
}

/* ============================================================
   RICH CONTENT
============================================================ */

export interface ProductContentBlock {
  type: ProductContentBlockType;

  content?: string | string[];

  src?: string;

  alt?: string;

  caption?: string;
}

/* ============================================================
   PRODUCT CONTENT
============================================================ */

export interface ProductContent {
  description?: string;

  descriptionFormat: ProductContentFormat;

  /**
   * For plain content:
   * not required.
   *
   * For html:
   * sanitized HTML string supplied by CMS/admin.
   *
   * For rich:
   * structured content blocks.
   */
  richContent?: string | ProductContentBlock[];

  highlights?: string[];

  stylingNotes?: string;

  fitNote?: string;

  materialsAndCare?: string | string[];

  shippingContent?: string;

  returnContent?: string;
}

/* ============================================================
   FAQ
============================================================ */

export interface ProductFAQ {
  id: string;

  question: string;

  answer: string;

  answerFormat: "plain" | "html";
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
   REVIEWS
============================================================ */

export interface ProductReviewSummary {
  averageRating: number;

  reviewCount: number;

  breakdown?: {
    5?: number;
    4?: number;
    3?: number;
    2?: number;
    1?: number;
  };
}

/* ============================================================
   AVAILABILITY
============================================================ */

export interface ProductAvailability {
  isSoldOut: boolean;

  isInStock: boolean;

  isLowStock: boolean;

  availableVariants: number;

  totalAvailableUnits: number;
}

/* ============================================================
   CORE PRODUCT
============================================================ */

export interface Product {
  id: string;

  slug: string;

  name: string;

  productType: ProductType;

  category: ProductCategory;

  subcategory?: string;

  collectionIds?: string[];

  tags: string[];

  content: ProductContent;

  attributes: ProductAttributes;

  media: ProductMedia[];

  sizeChart?: ProductSizeChart;

  variants: ProductVariant[];

  faqs?: ProductFAQ[];

  reviews?: ProductReviewSummary;

  merchandising: ProductMerchandising;

  seo?: ProductSEO;

  status: ProductStatus;

  publishedAt?: string;

  createdAt: string;

  updatedAt: string;
}

/* ============================================================
   FILTERS
============================================================ */

export interface ProductFilters {
  category?: ProductCategory[];

  subcategory?: string[];

  productType?: ProductType[];

  collectionIds?: string[];

  colors?: string[];

  sizes?: string[];

  badges?: ProductBadge[];

  minPrice?: number;

  maxPrice?: number;

  inStockOnly?: boolean;

  isNew?: boolean;

  isBestSeller?: boolean;

  isFeatured?: boolean;

  search?: string;

  tags?: string[];
}

/* ============================================================
   QUERY
============================================================ */

export interface ProductQuery {
  page?: number;

  limit?: number;

  filters?: ProductFilters;

  sort?: ProductSort;
}

/* ============================================================
   CART VARIANT SNAPSHOT
============================================================ */

export interface ProductVariantSnapshot {
  variantId: string;

  sku: string;

  color: ProductColor;

  size: ProductSize;

  pricing: ProductPricing;

  mediaIds?: string[];
}

/* ============================================================
   HELPER FUNCTIONS
============================================================ */

export function getVariantAvailableStock(
  variant: ProductVariant,
): number {
  return Math.max(
    0,
    variant.inventory.stock - variant.inventory.reserved,
  );
}

/* ------------------------------------------------------------
   VARIANT INVENTORY STATUS
------------------------------------------------------------ */

export function getVariantInventoryStatus(
  variant: ProductVariant,
): InventoryStatus {
  const availableStock = getVariantAvailableStock(variant);

  if (
    variant.status === "discontinued" ||
    variant.status === "inactive"
  ) {
    return "out-of-stock";
  }

  if (availableStock <= 0) {
    return "out-of-stock";
  }

  if (
    availableStock <=
    Math.max(0, variant.inventory.lowStockThreshold)
  ) {
    return "low-stock";
  }

  return "in-stock";
}

/* ------------------------------------------------------------
   PRODUCT AVAILABILITY
------------------------------------------------------------ */

export function getProductAvailability(
  product: Product,
): ProductAvailability {
  const activeVariants = product.variants.filter(
    (variant) => variant.status === "active",
  );

  const availableVariants = activeVariants.filter(
    (variant) =>
      getVariantAvailableStock(variant) > 0,
  );

  const totalAvailableUnits = availableVariants.reduce(
    (total, variant) =>
      total + getVariantAvailableStock(variant),
    0,
  );

  const lowStockVariants = availableVariants.filter(
    (variant) =>
      getVariantInventoryStatus(variant) === "low-stock",
  );

  return {
    isSoldOut:
      availableVariants.length === 0,

    isInStock:
      availableVariants.length > 0,

    isLowStock:
      lowStockVariants.length > 0,

    availableVariants:
      availableVariants.length,

    totalAvailableUnits,
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
    pricing.mrp - pricing.sellingPrice,
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
    ((pricing.mrp - pricing.sellingPrice) /
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
  const prices = product.variants
    .filter(
      (variant) =>
        variant.status === "active",
    )
    .map(
      (variant) =>
        variant.pricing.sellingPrice,
    );

  if (!prices.length) {
    return 0;
  }

  return Math.min(...prices);
}

/* ------------------------------------------------------------
   PRODUCT MRP
------------------------------------------------------------ */

export function getProductStartingMrp(
  product: Product,
): number {
  const prices = product.variants
    .filter(
      (variant) =>
        variant.status === "active",
    )
    .map(
      (variant) =>
        variant.pricing.mrp,
    );

  if (!prices.length) {
    return 0;
  }

  return Math.min(...prices);
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
   VARIANT LOOKUP
------------------------------------------------------------ */

export function getVariantById(
  product: Product,
  variantId: string,
): ProductVariant | undefined {
  return product.variants.find(
    (variant) =>
      variant.id === variantId,
  );
}

/* ------------------------------------------------------------
   COLOR VARIANTS
------------------------------------------------------------ */

export function getVariantsByColor(
  product: Product,
  colorId: string,
): ProductVariant[] {
  return product.variants.filter(
    (variant) =>
      variant.color.id === colorId &&
      variant.status === "active",
  );
}

/* ------------------------------------------------------------
   SIZE VARIANT
------------------------------------------------------------ */

export function getVariantBySelection(
  product: Product,
  colorId: string,
  sizeCode: string,
): ProductVariant | undefined {
  return product.variants.find(
    (variant) =>
      variant.color.id === colorId &&
      variant.size.code === sizeCode &&
      variant.status === "active",
  );
}

/* ------------------------------------------------------------
   ACTIVE VARIANTS
------------------------------------------------------------ */

export function getActiveVariants(
  product: Product,
): ProductVariant[] {
  return product.variants.filter(
    (variant) =>
      variant.status === "active",
  );
}

/* ------------------------------------------------------------
   AVAILABLE VARIANTS
------------------------------------------------------------ */

export function getAvailableVariants(
  product: Product,
): ProductVariant[] {
  return product.variants.filter(
    (variant) =>
      variant.status === "active" &&
      getVariantAvailableStock(variant) > 0,
  );
}

/* ------------------------------------------------------------
   UNIQUE COLORS
------------------------------------------------------------ */

export function getProductColors(
  product: Product,
): ProductColor[] {
  const map = new Map<
    string,
    ProductColor
  >();

  product.variants.forEach((variant) => {
    if (
      variant.status !== "active"
    ) {
      return;
    }

    if (!map.has(variant.color.id)) {
      map.set(
        variant.color.id,
        variant.color,
      );
    }
  });

  return Array.from(map.values());
}

/* ------------------------------------------------------------
   UNIQUE SIZES
------------------------------------------------------------ */

export function getProductSizes(
  product: Product,
): ProductSize[] {
  const map = new Map<
    string,
    ProductSize
  >();

  product.variants.forEach((variant) => {
    if (
      variant.status !== "active"
    ) {
      return;
    }

    if (!map.has(variant.size.code)) {
      map.set(
        variant.size.code,
        variant.size,
      );
    }
  });

  return Array.from(
    map.values(),
  ).sort(
    (a, b) =>
      a.sortOrder -
      b.sortOrder,
  );
}

/* ------------------------------------------------------------
   SIZE AVAILABILITY
------------------------------------------------------------ */

export function isSizeAvailableForColor(
  product: Product,
  colorId: string,
  sizeCode: string,
): boolean {
  const variant =
    getVariantBySelection(
      product,
      colorId,
      sizeCode,
    );

  return !!variant &&
    getVariantAvailableStock(
      variant,
    ) > 0;
}

/* ------------------------------------------------------------
   COLOR AVAILABILITY
------------------------------------------------------------ */

export function isColorAvailable(
  product: Product,
  colorId: string,
): boolean {
  return product.variants.some(
    (variant) =>
      variant.color.id === colorId &&
      variant.status === "active" &&
      getVariantAvailableStock(
        variant,
      ) > 0,
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
   TYPE GUARDS
============================================================ */

export function isProductActive(
  product: Product,
): boolean {
  return product.status === "active";
}

export function isVariantAvailable(
  variant: ProductVariant,
): boolean {
  return (
    variant.status === "active" &&
    getVariantAvailableStock(
      variant,
    ) > 0
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

  if (!product.productType) {
    errors.push(
      "Product type is required.",
    );
  }

  if (!product.category) {
    errors.push(
      "Product category is required.",
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

  if (!product.variants.length) {
    errors.push(
      "At least one product variant is required.",
    );
  }

  const variantIds = new Set<string>();
  const skus = new Set<string>();

  product.variants.forEach(
    (variant) => {
      if (variantIds.has(variant.id)) {
        errors.push(
          `Duplicate variant id: ${variant.id}`,
        );
      }

      variantIds.add(
        variant.id,
      );

      if (skus.has(variant.sku)) {
        errors.push(
          `Duplicate SKU: ${variant.sku}`,
        );
      }

      skus.add(variant.sku);

      if (
        variant.pricing.mrp < 0 ||
        variant.pricing.sellingPrice < 0
      ) {
        errors.push(
          `Invalid pricing for variant ${variant.id}`,
        );
      }

      if (
        variant.inventory.stock < 0 ||
        variant.inventory.reserved < 0
      ) {
        errors.push(
          `Invalid inventory for variant ${variant.id}`,
        );
      }
    },
  );

  return errors;
}