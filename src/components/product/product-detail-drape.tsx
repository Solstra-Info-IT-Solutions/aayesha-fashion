"use client";

import Image from "next/image";
import { useState } from "react";

import type { Product } from "@/types/product";
import { ProductPurchasePanelDrape } from "@/components/product/product-purchase-panel-drape";
import { ProductImageCursor } from "@/components/product/product-image-cursor";

/* =========================================================
   MOCK PRODUCT
   TODO (integration pass): replace with the real product
   fetched server-side for /products/[id] — this shape matches
   src/types/product.ts exactly so swapping the prop is a
   drop-in. Media array intentionally has 3 images so the
   full-bleed vertical gallery + forced 21:9 second-image
   rhythm both render.
========================================================= */

const MOCK_PRODUCT: Product = {
  id: "mock-pdp-01",
  _id: "mock-pdp-01",
  slug: "rose-garden-anarkali",
  name: "Rose Garden Anarkali",
  categoryId: "anarkali-suit",
  pricing: { mrp: 12999, sellingPrice: 8999, currency: "INR" },
  inventory: { stock: 14, reserved: 2, lowStockThreshold: 5 },
  content: {
    description:
      "Hand-embroidered floral anarkali in raw silk, cut for movement — full-length silhouette with a fitted yoke and a flare that catches light on every turn.",
    descriptionFormat: "plain",
  },
  media: [
    {
      id: "m1",
      type: "image",
      src: "/images/products/rose-garden-anarkali.jpg",
      alt: "Rose Garden Anarkali — front",
      sortOrder: 0,
      isPrimary: true,
    },
    {
      id: "m2",
      type: "image",
      src: "/images/products/sage-heritage-suit.jpg",
      alt: "Rose Garden Anarkali — fabric detail",
      sortOrder: 1,
      isPrimary: false,
    },
    {
      id: "m3",
      type: "image",
      src: "/images/products/ivory-noor-set.jpg",
      alt: "Rose Garden Anarkali — styled",
      sortOrder: 2,
      isPrimary: false,
    },
  ],
  merchandising: {
    isNew: true,
    isFeatured: true,
    isBestSeller: false,
    badges: ["new"],
  },
  status: "active",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

type ProductDetailDrapeProps = {
  product?: Product;
};

export function ProductDetailDrape({
  product = MOCK_PRODUCT,
}: ProductDetailDrapeProps) {
  const [quantity, setQuantity] = useState(1);

  const galleryMedia = product.media.filter((media) => media.type === "image");
  const [primaryImage, secondImage, ...restImages] = galleryMedia;

  return (
    <div className="drape-surface w-full">
      <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-10">
        {/* =================================================
            58 / 42 UNEQUAL SPLIT
        ================================================= */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[58%_42%] lg:gap-16">
          {/* GALLERY — full-bleed vertical stack, no slider/dots */}
          <div className="flex flex-col gap-3">
            {primaryImage && (
              <ProductImageCursor className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={primaryImage.src}
                  alt={primaryImage.alt ?? product.name}
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 58vw"
                  className="object-cover object-center"
                />
              </ProductImageCursor>
            )}

            {/* Second image forced to an ultra-wide 21:9 crop — signature
                rhythm (detail #4) applied consistently across every PDP. */}
            {secondImage && (
              <div className="relative aspect-[21/9] w-full overflow-hidden">
                <Image
                  src={secondImage.src}
                  alt={secondImage.alt ?? `${product.name} detail`}
                  fill
                  sizes="(max-width: 1023px) 100vw, 58vw"
                  className="object-cover object-center"
                />
              </div>
            )}

            {restImages.map((media) => (
              <ProductImageCursor
                key={media.id}
                className="relative aspect-[4/5] w-full overflow-hidden"
              >
                <Image
                  src={media.src}
                  alt={media.alt ?? product.name}
                  fill
                  sizes="(max-width: 1023px) 100vw, 58vw"
                  className="object-cover object-center"
                />
              </ProductImageCursor>
            ))}
          </div>

          {/* INFO COLUMN — sticky */}
          <div className="lg:sticky lg:top-10 lg:self-start">
            {/* Product name positioned overlapping the image column's
                negative space rather than a separate text block below,
                approximated here via a negative top margin that pulls it
                up over the gallery's bottom padding on wide screens. */}
            <p className="drape-font-body text-[10px] uppercase tracking-[0.24em] text-[var(--aged-brass)]">
              {product.categoryId.replace(/-/g, " ")}
            </p>

            <h1 className="drape-font-display mt-3 text-[var(--fs-display-m)] leading-[1.02] tracking-[-0.01em] text-[var(--unbleached-cotton)] lg:-mt-2 lg:mb-2">
              {product.name}
            </h1>

            <p className="mt-4 max-w-md drape-font-body text-[0.9375rem] leading-relaxed text-[var(--text-muted)]">
              {product.content.description}
            </p>

            <div className="mt-8">
              <ProductPurchasePanelDrape
                product={product}
                quantity={quantity}
                onQuantityChange={setQuantity}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
