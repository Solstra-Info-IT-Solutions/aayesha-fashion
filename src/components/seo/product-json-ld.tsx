import type { Product } from "@/types/product";
import {
  getAvailableStock,
  getProductAvailability,
} from "@/types/product";
import { siteConfig } from "@/config/site";

interface ProductJsonLdProps {
  product: Product;
  categoryName?: string;
}

function absoluteUrl(value: string): string {
  try {
    return new URL(value, siteConfig.url).toString();
  } catch {
    return value;
  }
}

function getAvailabilityUrl(product: Product): string {
  const inventory = product.inventory ?? {
    stock: 0,
    reserved: 0,
    lowStockThreshold: 2,
  };

  const availability = getProductAvailability({
    inventory: {
      stock: inventory.stock ?? 0,
      reserved: inventory.reserved ?? 0,
      lowStockThreshold:
        inventory.lowStockThreshold ?? 2,
    },
  });

  if (availability.isSoldOut) {
    return "https://schema.org/OutOfStock";
  }

  if (availability.isLowStock) {
    return "https://schema.org/LimitedAvailability";
  }

  return "https://schema.org/InStock";
}

function getImages(product: Product): string[] {
  const media = Array.isArray(product.media)
    ? product.media
    : [];

  return Array.from(
    new Set(
      media
        .filter(
          (item) =>
            item?.type === "image" &&
            Boolean(item?.src),
        )
        .sort(
          (a, b) =>
            (a?.sortOrder ?? 0) -
            (b?.sortOrder ?? 0),
        )
        .map((item) =>
          absoluteUrl(item.src),
        ),
    ),
  );
}

function getDescription(product: Product): string {
  return (
    product.seo?.description ||
    product.content?.description ||
    `Discover ${product.name} from ${siteConfig.name}.`
  );
}

function getOffer(product: Product) {
  const pricing = product.pricing ?? {
    mrp: 0,
    sellingPrice: 0,
    currency: "INR" as const,
  };

  const productId =
    product._id ||
    product.id;

  return {
    "@type": "Offer",
    url: `${siteConfig.url}/products/${productId}`,
    sku: product.id || product._id,
    price: pricing.sellingPrice ?? 0,
    priceCurrency: pricing.currency ?? "INR",
    availability: getAvailabilityUrl(product),
    itemCondition:
      "https://schema.org/NewCondition",
    seller: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export function ProductJsonLd({
  product,
  categoryName,
}: ProductJsonLdProps) {
  const productId =
    product._id ||
    product.id;

  const productUrl =
    `${siteConfig.url}/products/${productId}`;

  const images = getImages(product);

  const availableStock = getAvailableStock(
    product,
  );

  const productNode: Record<string, unknown> = {
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.name,
    description: getDescription(product),
    url: productUrl,
    image: images,
    sku: product.id || product._id,

    ...(categoryName
      ? {
          category: categoryName,
        }
      : {}),

    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },

    offers: getOffer(product),
  };

  if (availableStock >= 0) {
    productNode.inventoryLevel = {
      "@type": "QuantitativeValue",
      value: availableStock,
    };
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [productNode],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  );
}