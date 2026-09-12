import type { Product } from "@/types/product";
import {
  getProductAvailability,
  getVariantAvailableStock,
} from "@/types/product";
import { siteConfig } from "@/config/site";

interface ProductJsonLdProps {
  product: Product;
}

function absoluteUrl(value: string): string {
  try {
    return new URL(value, siteConfig.url).toString();
  } catch {
    return value;
  }
}

function getAvailabilityUrl(
  product: Product,
): string {
  const availability =
    getProductAvailability(product);

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
      product.media
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

function getVariantImage(
  product: Product,
  variant: Product["variants"][number],
): string | undefined {
  const media =
    product.media.find(
      (item) =>
        variant.mediaIds?.includes(item.id) &&
        item.type === "image",
    ) ??
    product.media.find(
      (item) =>
        item.colorId === variant.color.id &&
        item.type === "image",
    ) ??
    product.media.find(
      (item) =>
        item.isPrimary &&
        item.type === "image",
    ) ??
    product.media.find(
      (item) => item.type === "image",
    );

  return media?.src
    ? absoluteUrl(media.src)
    : undefined;
}

function getVariantOffer(
  product: Product,
  variant: Product["variants"][number],
) {
  const availableStock =
    getVariantAvailableStock(variant);

  const available =
    variant.status === "active" &&
    availableStock > 0;

  const availability = available
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";

  return {
    "@type": "Offer",
    url: `${siteConfig.url}/products/${product.slug}`,
    sku: variant.sku,
    price: variant.pricing.sellingPrice,
    priceCurrency: variant.pricing.currency,
    availability,
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
}: ProductJsonLdProps) {
  const productUrl =
    `${siteConfig.url}/products/${product.slug}`;

  const images = getImages(product);

  const activeVariants =
    product.variants.filter(
      (variant) =>
        variant.status === "active",
    );

  const defaultVariant =
    activeVariants.find(
      (variant) =>
        getVariantAvailableStock(variant) > 0,
    ) ??
    activeVariants[0] ??
    product.variants[0];

  const reviews = product.reviews;

  const productNode: Record<string, unknown> = {
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.name,
    description: getDescription(product),
    url: productUrl,
    image: images,
    sku: defaultVariant?.sku,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: defaultVariant
      ? getVariantOffer(product, defaultVariant)
      : undefined,
  };

  if (product.attributes?.fabric) {
    productNode.material =
      product.attributes.fabric;
  }

  if (reviews?.reviewCount && reviews.averageRating) {
    productNode.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: reviews.averageRating,
      reviewCount: reviews.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  const variantNodes = activeVariants.map(
    (variant) => {
      const variantImage =
        getVariantImage(
          product,
          variant,
        );

      const node: Record<string, unknown> = {
        "@type": "Product",
        "@id": `${productUrl}#variant-${variant.id}`,
        name: `${product.name} - ${variant.color.name} - ${variant.size.label}`,
        isVariantOf: {
          "@id": `${productUrl}#product-group`,
        },
        sku: variant.sku,
        color: variant.color.name,
        size: variant.size.label,
        offers: getVariantOffer(
          product,
          variant,
        ),
      };

      if (variantImage) {
        node.image = variantImage;
      }

      return node;
    },
  );

  const productGroup = {
    "@type": "ProductGroup",
    "@id": `${productUrl}#product-group`,
    name: product.name,
    description: getDescription(product),
    url: productUrl,
    productGroupID: product.id,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    variesBy: [
      "https://schema.org/color",
      "https://schema.org/size",
    ],
    hasVariant: variantNodes.map(
      (variant) => ({
        "@id": variant["@id"],
      }),
    ),
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      productGroup,
      productNode,
      ...variantNodes,
    ],
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