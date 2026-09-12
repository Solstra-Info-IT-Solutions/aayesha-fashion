import { apiFetch } from "@/lib/api";

import type { Product } from "@/types/product";

/* =========================================================
   PRODUCT LIST PARAMS
========================================================= */

export interface ProductListParams {
  page?: number;
  limit?: number;

  category?: string;
  productType?: string;
  collection?: string;

  color?: string;
  size?: string;

  badge?: string;

  minPrice?: number;
  maxPrice?: number;

  inStockOnly?: boolean;

  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;

  search?: string;

  status?: string;
  sort?: string;
}

/* =========================================================
   PRODUCT LIST RESPONSE
========================================================= */

export interface ProductListResponse {
  products: Product[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/* =========================================================
   LIST PRODUCTS
========================================================= */

export async function getProducts(
  params: ProductListParams = {},
): Promise<ProductListResponse> {
  const searchParams =
    new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set(
      "page",
      String(params.page),
    );
  }

  if (params.limit !== undefined) {
    searchParams.set(
      "limit",
      String(params.limit),
    );
  }

  if (params.category) {
    searchParams.set(
      "category",
      params.category,
    );
  }

  if (params.productType) {
    searchParams.set(
      "productType",
      params.productType,
    );
  }

  if (params.collection) {
    searchParams.set(
      "collection",
      params.collection,
    );
  }

  if (params.color) {
    searchParams.set(
      "color",
      params.color,
    );
  }

  if (params.size) {
    searchParams.set(
      "size",
      params.size,
    );
  }

  if (params.badge) {
    searchParams.set(
      "badge",
      params.badge,
    );
  }

  if (params.minPrice !== undefined) {
    searchParams.set(
      "minPrice",
      String(params.minPrice),
    );
  }

  if (params.maxPrice !== undefined) {
    searchParams.set(
      "maxPrice",
      String(params.maxPrice),
    );
  }

  if (params.inStockOnly !== undefined) {
    searchParams.set(
      "inStockOnly",
      String(params.inStockOnly),
    );
  }

  if (params.isNew !== undefined) {
    searchParams.set(
      "isNew",
      String(params.isNew),
    );
  }

  if (params.isBestSeller !== undefined) {
    searchParams.set(
      "isBestSeller",
      String(params.isBestSeller),
    );
  }

  if (params.isFeatured !== undefined) {
    searchParams.set(
      "isFeatured",
      String(params.isFeatured),
    );
  }

  if (params.search) {
    searchParams.set(
      "search",
      params.search,
    );
  }

  if (params.status) {
    searchParams.set(
      "status",
      params.status,
    );
  }

  if (params.sort) {
    searchParams.set(
      "sort",
      params.sort,
    );
  }

  const query =
    searchParams.toString();

  return apiFetch<ProductListResponse>(
    query
      ? `/products?${query}`
      : "/products",
  );
}

/* =========================================================
   GET PRODUCT BY SLUG
========================================================= */

export async function getProductBySlug(
  slug: string,
): Promise<Product> {
  return apiFetch<Product>(
    `/products/slug/${encodeURIComponent(
      slug,
    )}`,
  );
}

/* =========================================================
   GET PRODUCT BY ID
========================================================= */

export async function getProductById(
  id: string,
): Promise<Product> {
  return apiFetch<Product>(
    `/products/id/${encodeURIComponent(id)}`,
  );
}