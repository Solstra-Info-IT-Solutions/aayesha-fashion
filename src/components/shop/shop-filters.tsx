"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, RotateCcw } from "lucide-react";

import type {
  Product,
  ProductCategory,
  ProductType,
} from "@/types/product";

import {
  getProductColors,
  getProductSizes,
  getProductStartingPrice,
  getProductAvailability,
} from "@/types/product";

interface ShopFiltersProps {
  products: Product[];
  selectedCategory?: ProductCategory;
  mobile?: boolean;
  onClose?: () => void;
}

type FilterSection =
  | "category"
  | "type"
  | "color"
  | "size"
  | "price"
  | "availability";

const categoryLabels: Record<ProductCategory, string> = {
  festive: "Festive",
  ethnic: "Ethnic",
  contemporary: "Contemporary",
  "new-arrival": "New Arrivals",
};

const productTypeLabels: Record<ProductType, string> = {
  anarkali: "Anarkali",
  kurta: "Kurta",
  "kurta-set": "Kurta Set",
  "suit-set": "Suit Set",
  lehenga: "Lehenga",
  saree: "Saree",
  dress: "Dress",
  top: "Top",
  bottom: "Bottom",
  "co-ord": "Co-ord",
  jacket: "Jacket",
  dupatta: "Dupatta",
  other: "Other",
};

const availabilityLabels = {
  "in-stock": "In Stock",
  low: "Low Stock",
  "out-of-stock": "Out of Stock",
} as const;

const priceRanges = [
  {
    label: "Under ₹5,000",
    min: 0,
    max: 5000,
  },
  {
    label: "₹5,000 – ₹8,000",
    min: 5000,
    max: 8000,
  },
  {
    label: "₹8,000 – ₹12,000",
    min: 8000,
    max: 12000,
  },
  {
    label: "Above ₹12,000",
    min: 12000,
    max: Infinity,
  },
];

const sectionLabels: Record<FilterSection, string> = {
  category: "Category",
  type: "Product Type",
  color: "Color",
  size: "Size",
  price: "Price",
  availability: "Availability",
};

export function ShopFilters({
  products,
  selectedCategory,
  mobile = false,
  onClose,
}: ShopFiltersProps) {
  const [openSections, setOpenSections] = useState<
    FilterSection[]
  >([
    "category",
    "type",
    "color",
    "size",
    "price",
    "availability",
  ]);

  const [selectedPrice, setSelectedPrice] = useState<
    string | null
  >(null);

  const categoryOptions = useMemo(() => {
    const values = new Set<ProductCategory>();

    products.forEach((product) => {
      values.add(product.category);
    });

    return Array.from(values);
  }, [products]);

  const typeOptions = useMemo(() => {
    const values = new Set<ProductType>();

    products.forEach((product) => {
      values.add(product.productType);
    });

    return Array.from(values);
  }, [products]);

  const colorOptions = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string;
        name: string;
        hex?: string;
      }
    >();

    products.forEach((product) => {
      getProductColors(product).forEach((color) => {
        if (!map.has(color.id)) {
          map.set(color.id, {
            id: color.id,
            name: color.name,
            hex: color.hex,
          });
        }
      });
    });

    return Array.from(map.values());
  }, [products]);

  const sizeOptions = useMemo(() => {
    const map = new Map<
      string,
      {
        code: string;
        label: string;
      }
    >();

    products.forEach((product) => {
      getProductSizes(product).forEach((size) => {
        if (!map.has(size.code)) {
          map.set(size.code, {
            code: size.code,
            label: size.label,
          });
        }
      });
    });

    return Array.from(map.values());
  }, [products]);

const availabilityOptions = useMemo(() => {
  const values = new Set<
    "in-stock" | "low" | "out-of-stock"
  >();

  products.forEach((product) => {
    const availableVariants = product.variants.filter(
      (variant) =>
        variant.status === "active" &&
        variant.inventory.stock > variant.inventory.reserved,
    );

    if (availableVariants.length === 0) {
      values.add("out-of-stock");
      return;
    }

    const hasLowStock = availableVariants.some(
      (variant) => {
        const available =
          variant.inventory.stock -
          variant.inventory.reserved;

        return (
          available <=
          variant.inventory.lowStockThreshold
        );
      },
    );

    if (hasLowStock) {
      values.add("low");
    } else {
      values.add("in-stock");
    }
  });

  return Array.from(values);
}, [products]);

  function toggleSection(section: FilterSection) {
    setOpenSections((current) =>
      current.includes(section)
        ? current.filter((item) => item !== section)
        : [...current, section],
    );
  }

  function resetFilters() {
    setSelectedPrice(null);

    window.location.href = "/shop";
  }

  return (
    <div className={mobile ? "pb-8" : "sticky top-[116px]"}>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
            Refine
          </p>

          <h2 className="mt-1 font-serif text-2xl text-[var(--color-charcoal)]">
            Shop by
          </h2>
        </div>

        <button
          type="button"
          onClick={resetFilters}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-charcoal)]"
        >
          <RotateCcw size={13} strokeWidth={1.7} />
          Reset
        </button>
      </div>

      <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
        <FilterSectionUI
          title={sectionLabels.category}
          open={openSections.includes("category")}
          onToggle={() => toggleSection("category")}
        >
          <div className="space-y-1.5">
            {categoryOptions.map((category) => {
              const active =
                selectedCategory === category;

              return (
                <Link
                  key={category}
                  href={`/shop?category=${category}`}
                  onClick={onClose}
                  className={`flex items-center justify-between py-2 text-sm transition-colors ${
                    active
                      ? "font-medium text-[var(--color-charcoal)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-charcoal)]"
                  }`}
                >
                  <span>
                    {categoryLabels[category]}
                  </span>

                  <span className="text-xs text-[var(--color-muted)]">
                    {
                      products.filter(
                        (product) =>
                          product.category === category,
                      ).length
                    }
                  </span>
                </Link>
              );
            })}
          </div>
        </FilterSectionUI>

        <FilterSectionUI
          title={sectionLabels.type}
          open={openSections.includes("type")}
          onToggle={() => toggleSection("type")}
        >
          <div className="grid grid-cols-1 gap-1.5">
            {typeOptions.map((type) => (
              <Link
                key={type}
                href={`/shop?type=${type}`}
                onClick={onClose}
                className="py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-charcoal)]"
              >
                {productTypeLabels[type]}
              </Link>
            ))}
          </div>
        </FilterSectionUI>

        <FilterSectionUI
          title={sectionLabels.color}
          open={openSections.includes("color")}
          onToggle={() => toggleSection("color")}
        >
          <div className="grid grid-cols-2 gap-2">
            {colorOptions.map((color) => (
              <Link
                key={color.id}
                href={`/shop?color=${color.id}`}
                onClick={onClose}
                className="flex items-center gap-2.5 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-charcoal)]"
              >
                <span
                  className="size-5 rounded-full border border-[var(--color-border-dark)]"
                  style={{
                    backgroundColor:
                      color.hex ?? "#e8e3de",
                  }}
                />

                <span className="truncate">
                  {color.name}
                </span>
              </Link>
            ))}
          </div>
        </FilterSectionUI>

        <FilterSectionUI
          title={sectionLabels.size}
          open={openSections.includes("size")}
          onToggle={() => toggleSection("size")}
        >
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((size) => (
              <Link
                key={size.code}
                href={`/shop?size=${size.code}`}
                onClick={onClose}
                className="flex h-9 min-w-9 items-center justify-center border border-[var(--color-border)] px-3 text-xs font-medium text-[var(--color-charcoal)] transition-colors hover:border-[var(--color-charcoal)]"
              >
                {size.label}
              </Link>
            ))}
          </div>
        </FilterSectionUI>

        <FilterSectionUI
          title={sectionLabels.price}
          open={openSections.includes("price")}
          onToggle={() => toggleSection("price")}
        >
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <label
                key={range.label}
                className="flex cursor-pointer items-center gap-3 py-1.5"
              >
                <input
                  type="radio"
                  name="price"
                  checked={selectedPrice === range.label}
                  onChange={() =>
                    setSelectedPrice(range.label)
                  }
                  className="size-4 accent-[var(--color-charcoal)]"
                />

                <span className="text-sm text-[var(--color-text-secondary)]">
                  {range.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSectionUI>

        <FilterSectionUI
          title={sectionLabels.availability}
          open={openSections.includes("availability")}
          onToggle={() =>
            toggleSection("availability")
          }
        >
          <div className="space-y-2">
            {availabilityOptions.map((status) => (
              <Link
                key={status}
                href={`/shop?availability=${status}`}
                onClick={onClose}
                className="flex py-1.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-charcoal)]"
              >
                {
                  availabilityLabels[
                    status
                  ]
                }
              </Link>
            ))}
          </div>
        </FilterSectionUI>
      </div>

      {!mobile && (
        <div className="mt-6 border border-[var(--color-border)] bg-[var(--color-cream)] p-5">
          <p className="font-serif text-xl text-[var(--color-charcoal)]">
            Find your signature style
          </p>

          <p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">
            Explore refined silhouettes designed for
            celebrations, everyday elegance and modern
            Indian dressing.
          </p>
        </div>
      )}
    </div>
  );
}

interface FilterSectionUIProps {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterSectionUI({
  title,
  open,
  onToggle,
  children,
}: FilterSectionUIProps) {
  return (
    <div className="py-4">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-charcoal)]">
          {title}
        </span>

        <ChevronDown
          size={15}
          strokeWidth={1.7}
          className={`transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="pt-4">
          {children}
        </div>
      )}
    </div>
  );
}