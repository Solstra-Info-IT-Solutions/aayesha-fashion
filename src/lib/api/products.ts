import type {
  Product,
  ProductSort,
  ProductStatus,
} from "@/types/product";

import { apiFetch } from "@/lib/api";

/* ============================================================
   PRODUCT LIST PARAMS
============================================================ */

export type ProductListParams = {
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

  status?: ProductStatus;

  sort?: ProductSort;
};

/* ============================================================
   PRODUCT LIST RESPONSE
============================================================ */

export type ProductListResponse = {
  products: Product[];

  pagination: {
    page: number;

    limit: number;

    total: number;

    totalPages: number;

    hasNextPage: boolean;

    hasPreviousPage: boolean;
  };
};

/* ============================================================
   BUILD QUERY
============================================================ */

function buildQuery(
  params: ProductListParams = {},
): string {
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

  if (params.categoryId) {
    searchParams.set(
      "categoryId",
      params.categoryId,
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

  return query
    ? `?${query}`
    : "";
}

/* ============================================================
   GET PRODUCTS
============================================================ */

export async function getProducts(
  params: ProductListParams = {},
): Promise<ProductListResponse> {
  const query =
    buildQuery(params);

  return apiFetch<ProductListResponse>(
    `/products${query}`,
  );
}

/* ============================================================
   GET PRODUCT BY SLUG
============================================================ */

export async function getProductBySlug(
  slug: string,
): Promise<Product> {
  return apiFetch<Product>(
    `/products/slug/${encodeURIComponent(
      slug,
    )}`,
  );
}

/* ============================================================
   GET PRODUCT BY ID
============================================================ */

export async function getProductById(
  id: string,
): Promise<Product> {
  return apiFetch<Product>(
    `/products/id/${encodeURIComponent(
      id,
    )}`,
  );
}

/* ============================================================
   NEW ARRIVALS
============================================================ */

export async function getNewArrivals(
  limit = 8,
): Promise<ProductListResponse> {
  return getProducts({
    page: 1,
    limit,
    isNew: true,
    sort: "newest",
  });
}

/* ============================================================
   BEST SELLERS
============================================================ */

export async function getBestSellers(
  limit = 8,
): Promise<ProductListResponse> {
  return getProducts({
    page: 1,
    limit,
    isBestSeller: true,
    sort: "best-selling",
  });
}

/* ============================================================
   FEATURED PRODUCTS
============================================================ */

export async function getFeaturedProducts(
  limit = 8,
): Promise<ProductListResponse> {
  return getProducts({
    page: 1,
    limit,
    isFeatured: true,
    sort: "featured",
  });
}

/* ============================================================
   CATEGORY PRODUCTS
============================================================ */

export async function getCategoryProducts(
  categoryId: string,
  limit = 8,
): Promise<ProductListResponse> {
  return getProducts({
    page: 1,
    limit,
    categoryId,
    sort: "featured",
  });
}