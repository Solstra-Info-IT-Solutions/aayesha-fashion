import type { Metadata } from "next";

import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/services/category.service";

import type { Product } from "@/types/product";
import type { Category } from "@/types/category";

import { CategoryBrowser } from "@/components/categories/category-browser";

type CategoriesPageProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Shop by Category",
  description:
    "Explore Aayesha Fashion's collection by category, from Garara and Plazo to Frock, Printed Dress, Pakistani Design and Custom styles.",
  alternates: {
    canonical: "/categories",
  },
  openGraph: {
    title: "Shop by Category | Aayesha Fashion",
    description:
      "Explore the latest Aayesha Fashion styles by category.",
    url: "/categories",
    type: "website",
  },
};

export default async function CategoriesPage({
  searchParams,
}: CategoriesPageProps) {
  const params = await searchParams;

  let categories: Category[] = [];

  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }

  /*
   * First active category is the default selection.
   * If a valid category is present in the URL, use that instead.
   */
  const activeCategories = categories;

  const requestedCategoryId = params.category;

  const selectedCategory =
    activeCategories.find(
      (category) => category.id === requestedCategoryId,
    ) ?? activeCategories[0];

  let products: Product[] = [];

  if (selectedCategory) {
    try {
      const response = await getProducts({
        page: 1,
        limit: 48,
        categoryId: selectedCategory.id,
        status: "active",
        sort: "newest",
      });

      products = response.products ?? [];
    } catch {
      products = [];
    }
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <CategoryBrowser
        categories={activeCategories}
        selectedCategoryId={selectedCategory?.id}
        products={products}
      />
    </main>
  );
}