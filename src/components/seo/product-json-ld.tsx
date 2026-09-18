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
  const availability = getProductAvailability({
    inventory: {
      stock: product.inventory?.stock ?? 0,
      reserved: product.inventory?.reserved ?? 0,
      lowStockThreshold:
        product.inventory?.lowStockThreshold ?? 2,
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
  return Array.from(
    new Set(
      (product.media ?? [])
        .filter(
          (media) =>
            media.type === "image" &&
            Boolean(media.src),
        )
        .sort(
          (a, b) =>
            a.sortOrder - b.sortOrder,
        )
        .map((media) =>
          absoluteUrl(media.src),
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
  return {
    "@type": "Offer",
    url: `${siteConfig.url}/products/${product.slug}`,
    sku: product.id,
    price: product.pricing.sellingPrice,
    priceCurrency: product.pricing.currency,
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
  const productUrl =
    `${siteConfig.url}/products/${product.slug}`;

  const images = getImages(product);
  const availableStock = getAvailableStock(product);

  const productNode: Record<string, unknown> = {
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.name,
    description: getDescription(product),
    url: productUrl,
    image: images,
    sku: product.id,

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