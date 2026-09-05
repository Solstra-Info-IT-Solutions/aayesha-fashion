import type {
  Product,
  ProductCategory,
  ProductSort,
  ProductType,
} from "@/types/product";

import { apiFetch } from "@/lib/api";

export type ProductListParams = {
  page?: number;
  limit?: number;
  category?: ProductCategory;
  productType?: ProductType;
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
  sort?: ProductSort;
};

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

function buildQuery(
  params: ProductListParams = {},
) {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  if (params.category) {
    searchParams.set("category", params.category);
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
    searchParams.set("color", params.color);
  }

  if (params.size) {
    searchParams.set("size", params.size);
  }

  if (params.badge) {
    searchParams.set("badge", params.badge);
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

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

export async function getProducts(
  params: ProductListParams = {},
) {
  const query = buildQuery(params);

  return apiFetch<ProductListResponse>(
    `/products${query}`,
  );
}

export async function getProductBySlug(
  slug: string,
) {
  return apiFetch<Product>(
    `/products/slug/${encodeURIComponent(slug)}`,
  );
}

export async function getProductById(
  id: string,
) {
  return apiFetch<Product>(
    `/products/id/${encodeURIComponent(id)}`,
  );
}

export async function getNewArrivals(
  limit = 8,
) {
  return getProducts({
    page: 1,
    limit,
    isNew: true,
    sort: "newest",
  });
}

export async function getBestSellers(
  limit = 8,
) {
  return getProducts({
    page: 1,
    limit,
    isBestSeller: true,
    sort: "best-selling",
  });
}

export async function getFeaturedProducts(
  limit = 8,
) {
  return getProducts({
    page: 1,
    limit,
    isFeatured: true,
    sort: "featured",
  });
}

export async function getCollectionProducts(
  collection: string,
  limit = 8,
) {
  return getProducts({
    page: 1,
    limit,
    collection,
    sort: "featured",
  });
}