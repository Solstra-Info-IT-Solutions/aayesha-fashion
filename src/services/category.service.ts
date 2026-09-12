import { apiFetch } from "@/lib/api";
import type {
  Category,
  CategoryListParams,
} from "@/types/category";

/* =========================================================
   LIST CATEGORIES
========================================================= */

export async function getCategories(
  params: CategoryListParams = {}
): Promise<Category[]> {
  const searchParams =
    new URLSearchParams();

  if (params.includeInactive) {
    searchParams.set(
      "includeInactive",
      "true"
    );
  }

  const query =
    searchParams.toString();

  return apiFetch<Category[]>(
    query
      ? `/categories?${query}`
      : "/categories"
  );
}

/* =========================================================
   GET CATEGORY BY SLUG
========================================================= */

export async function getCategoryBySlug(
  slug: string
): Promise<Category> {
  return apiFetch<Category>(
    `/categories/slug/${encodeURIComponent(
      slug
    )}`
  );
}