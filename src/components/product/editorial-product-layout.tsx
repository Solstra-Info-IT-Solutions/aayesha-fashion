"use client";

import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/types/product";
import { getPrimaryProductMedia } from "@/types/product";

import { EditorialProductCard } from "@/components/product/editorial-product-card";
import { ProductImageCursor } from "@/components/product/product-image-cursor";

/* =========================================================
   EDITORIAL PRODUCT LAYOUT
   Hand-built compositions per item count — deliberately NOT
   CSS grid repeat(). No borders, no box-shadow, no rounded
   corners on any card per the design bible.
========================================================= */

type EditorialProductLayoutProps = {
  products: Product[];
  categoryName?: string;
};

export function EditorialProductLayout({
  products,
  categoryName,
}: EditorialProductLayoutProps) {
  if (products.length === 0) {
    return null;
  }

  if (products.length === 1) {
    return <SingleSpread product={products[0]} categoryName={categoryName} />;
  }

  if (products.length === 2) {
    return <TwoUp products={products} categoryName={categoryName} />;
  }

  if (products.length === 3) {
    return <ThreeUp products={products} categoryName={categoryName} />;
  }

  return <StaggeredFlow products={products} categoryName={categoryName} />;
}

/* =========================================================
   1 ITEM — full-bleed editorial spread with a floating detail
   crop in a corner (also satisfies the 21:9 second-image rule).
========================================================= */

function SingleSpread({
  product,
  categoryName,
}: {
  product: Product;
  categoryName?: string;
}) {
  const primary = getPrimaryProductMedia(product);
  const detail = product.media.find(
    (media) => media.type === "image" && media.id !== primary?.id,
  );

  if (!primary) return null;

  return (
    <div className="relative w-full">
      <ProductImageCursor className="relative aspect-[16/10] w-full overflow-hidden">
        <Link href={`/products/${product._id}`} className="absolute inset-0 block">
          <Image
            src={primary.src}
            alt={primary.alt ?? product.name}
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </Link>
      </ProductImageCursor>

      {detail && (
        <div className="absolute bottom-6 right-6 z-10 w-[38%] max-w-[420px] overflow-hidden aspect-[21/9] sm:bottom-10 sm:right-10">
          <Image
            src={detail.src}
            alt={detail.alt ?? `${product.name} detail`}
            fill
            sizes="40vw"
            className="object-cover object-center"
          />
        </div>
      )}

      <div className="relative z-10 -mt-10 ml-6 max-w-sm drape-panel px-5 py-4 sm:ml-10">
        <p className="drape-font-body text-[10px] uppercase tracking-[0.16em] text-[var(--aged-brass)]">
          {categoryName ?? product.categoryId.replace(/-/g, " ")}
        </p>
        <h3 className="drape-font-display mt-1 text-[1.3rem] text-[var(--unbleached-cotton)]">
          {product.name}
        </h3>
      </div>
    </div>
  );
}

/* =========================================================
   2 ITEMS — item 1 large (~58%), item 2 offset down ~15% and
   smaller (~38%), with intentional negative space between.
========================================================= */

function TwoUp({
  products,
  categoryName,
}: {
  products: Product[];
  categoryName?: string;
}) {
  return (
    <div className="relative flex w-full flex-col gap-16 sm:flex-row sm:items-start sm:gap-0">
      <div className="w-full sm:w-[58%]">
        <EditorialProductCard
          product={products[0]}
          size="large"
          categoryName={categoryName}
        />
      </div>

      <div className="w-full sm:mt-[15%] sm:w-[38%]">
        <EditorialProductCard
          product={products[1]}
          size="medium"
          categoryName={categoryName}
        />
      </div>
    </div>
  );
}

/* =========================================================
   3 ITEMS — item 1 large, item 2 offset+smaller, item 3 a
   small inset "detail" card overlapping the seam between 1
   and 2.
========================================================= */

function ThreeUp({
  products,
  categoryName,
}: {
  products: Product[];
  categoryName?: string;
}) {
  return (
    <div className="relative flex w-full flex-col gap-16 sm:flex-row sm:items-start sm:gap-0">
      <div className="relative w-full sm:w-[55%]">
        <EditorialProductCard
          product={products[0]}
          size="large"
          categoryName={categoryName}
        />
      </div>

      <div className="w-full sm:mt-[15%] sm:w-[35%]">
        <EditorialProductCard
          product={products[1]}
          size="medium"
          categoryName={categoryName}
        />
      </div>

      {/* Inset detail card, overlapping the seam between 1 and 2 */}
      <div className="relative z-20 mx-auto -mt-10 w-40 sm:absolute sm:left-[48%] sm:top-[40%] sm:mt-0 sm:w-36">
        <EditorialProductCard
          product={products[2]}
          size="detail"
          categoryName={categoryName}
        />
      </div>
    </div>
  );
}

/* =========================================================
   4+ ITEMS — manually staggered flow. Sizes cycle in a
   repeating large / small / medium rhythm (not grid-cols-4).
========================================================= */

const SIZE_RHYTHM: Array<"large" | "small" | "medium"> = [
  "large",
  "small",
  "medium",
];

const OFFSET_RHYTHM = ["mt-0", "mt-16", "mt-8"];

function StaggeredFlow({
  products,
  categoryName,
}: {
  products: Product[];
  categoryName?: string;
}) {
  return (
    <div className="flex w-full flex-wrap items-start gap-x-6 gap-y-16">
      {products.map((product, index) => {
        const size = SIZE_RHYTHM[index % SIZE_RHYTHM.length];
        const offset = OFFSET_RHYTHM[index % OFFSET_RHYTHM.length];

        const widthClass =
          size === "large"
            ? "w-full sm:w-[46%]"
            : size === "medium"
              ? "w-full sm:w-[30%]"
              : "w-full sm:w-[20%]";

        return (
          <div key={product._id} className={`${widthClass} ${offset}`}>
            <EditorialProductCard
              product={product}
              size={size}
              categoryName={categoryName}
            />
          </div>
        );
      })}
    </div>
  );
}
