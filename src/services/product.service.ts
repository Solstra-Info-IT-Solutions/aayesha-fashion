import { apiFetch } from "@/lib/api";

import type { Product } from "@/types/product";

/* =========================================================
   PRODUCT LIST PARAMS
========================================================= */

export interface ProductListParams {
  page?: number;
  limit?: number;

  categoryId?: string;

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

  /* -------------------------------------------------------
     PAGINATION
  ------------------------------------------------------- */

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

  /* -------------------------------------------------------
     CATEGORY
  ------------------------------------------------------- */

  if (params.categoryId) {
    searchParams.set(
      "categoryId",
      params.categoryId,
    );
  }

  /* -------------------------------------------------------
     PRICE
  ------------------------------------------------------- */

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

  /* -------------------------------------------------------
     STOCK
  ------------------------------------------------------- */

  if (params.inStockOnly !== undefined) {
    searchParams.set(
      "inStockOnly",
      String(params.inStockOnly),
    );
  }

  /* -------------------------------------------------------
     MERCHANDISING
  ------------------------------------------------------- */

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

  /* -------------------------------------------------------
     SEARCH
  ------------------------------------------------------- */

  if (params.search?.trim()) {
    searchParams.set(
      "search",
      params.search.trim(),
    );
  }

  /* -------------------------------------------------------
     STATUS
  ------------------------------------------------------- */

  if (params.status) {
    searchParams.set(
      "status",
      params.status,
    );
  }

  /* -------------------------------------------------------
     SORT
  ------------------------------------------------------- */

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
    `/products/id/${encodeURIComponent(
      id,
    )}`,
  );
}