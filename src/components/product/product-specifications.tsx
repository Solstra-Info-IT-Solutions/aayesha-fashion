"use client";

import { useEffect, useState } from "react";

import { getCategories } from "@/services/category.service";

import type { Product } from "@/types/product";

interface ProductSpecificationsProps {
  product: Product;
}

export function ProductSpecifications({
  product,
}: ProductSpecificationsProps) {
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCategory() {
      try {
        const categories = await getCategories();

        const category = categories.find(
          (item) => item.id === product.categoryId,
        );

        if (!cancelled) {
          setCategoryName(category?.name ?? "");
        }
      } catch (error) {
        console.error(
          "Failed to load product category:",
          error,
        );

        if (!cancelled) {
          setCategoryName("");
        }
      }
    }

    if (product.categoryId) {
      loadCategory();
    } else {
      setCategoryName("");
    }

    return () => {
      cancelled = true;
    };
  }, [product.categoryId]);

  const specifications = [
    ["Category", categoryName],
    ["Product Status", product.status],
    ["Currency", product.pricing.currency],
    [
      "MRP",
      `₹${product.pricing.mrp.toLocaleString("en-IN")}`,
    ],
    [
      "Selling Price",
      `₹${product.pricing.sellingPrice.toLocaleString(
        "en-IN",
      )}`,
    ],
    ["Stock", product.inventory.stock],
    [
      "Available Stock",
      product.inventory.stock -
        product.inventory.reserved,
    ],
    [
      "Description Format",
      product.content.descriptionFormat,
    ],
  ].filter(
    ([, value]) =>
      value !== undefined &&
      value !== null &&
      value !== "",
  );

  return (
    <div className="border-y border-[var(--color-border)]">
      {specifications.map(([label, value]) => (
        <div
          key={label}
          className="
            flex
            items-start
            justify-between
            gap-8
            border-b
            border-[var(--color-border)]
            py-4
            last:border-b-0
          "
        >
          <span
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.11em]
              text-[var(--color-text-muted)]
            "
          >
            {label}
          </span>

          <span
            className="
              max-w-[60%]
              text-right
              text-sm
              text-[var(--color-text-secondary)]
            "
          >
            {String(value)}
          </span>
        </div>
      ))}
    </div>
  );
}