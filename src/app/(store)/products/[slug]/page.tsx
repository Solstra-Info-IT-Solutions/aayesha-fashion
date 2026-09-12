import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getProductBySlug,
  getProducts,
} from "@/lib/api/products";

import { ProductJsonLd } from "@/components/seo/product-json-ld";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { ProductDetail } from "@/components/product/product-detail";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/* ============================================================
   DYNAMIC PRODUCT METADATA
============================================================ */

export async function generateMetadata(
  { params }: ProductPageProps,
): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await getProductBySlug(slug);

    const title =
      product.seo?.title ||
      `${product.name} | Aayesha Fashion`;

    const description =
      product.seo?.description ||
      product.content?.description ||
      `Discover ${product.name} from Aayesha Fashion.`;

    const canonical =
      product.seo?.canonical ||
      `/products/${product.slug}`;

    const primaryMedia =
      product.media?.find(
        (media) =>
          media.isPrimary &&
          media.type === "image",
      ) ??
      product.media?.find(
        (media) => media.type === "image",
      );

    const primaryImage = primaryMedia?.src;

    return {
      title,
      description,

      keywords:
        product.seo?.keywords?.length
          ? product.seo.keywords
          : product.tags?.length
            ? product.tags
            : undefined,

      alternates: {
        canonical,
      },

      robots: product.seo?.noIndex
        ? {
            index: false,
            follow: false,
          }
        : {
            index: true,
            follow: true,
          },

      openGraph: {
        title,
        description,
        url: canonical,
        type: "website",

        images: primaryImage
          ? [
              {
                url: primaryImage,
                alt:
                  primaryMedia?.alt ||
                  product.name,
              },
            ]
          : undefined,
      },

      twitter: {
        card: "summary_large_image",
        title,
        description,

        images: primaryImage
          ? [primaryImage]
          : undefined,
      },
    };
  } catch {
    return {
      title: "Product Not Found",
      description:
        "The requested product could not be found.",

      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

/* ============================================================
   PRODUCT PAGE
============================================================ */

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  /* ----------------------------------------------------------
     LOAD PRODUCT
  ---------------------------------------------------------- */

  let product;

  try {
    product = await getProductBySlug(slug);
  } catch {
    notFound();
  }

  if (!product) {
    notFound();
  }

  /* ----------------------------------------------------------
     LOAD RECOMMENDATIONS
     
     We intentionally fetch both:
     - same category
     - same product type
     
     Then merge + deduplicate the results.
  ---------------------------------------------------------- */

  const [
    categoryResponse,
    productTypeResponse,
  ] = await Promise.all([
    getProducts({
      page: 1,
      limit: 8,
      category: product.category,
      status: "active",
      sort: "featured",
    }),

    getProducts({
      page: 1,
      limit: 8,
      productType: product.productType,
      status: "active",
      sort: "featured",
    }),
  ]);

  /* ----------------------------------------------------------
     MERGE + DEDUPLICATE RECOMMENDATIONS
  ---------------------------------------------------------- */

  const recommendationMap = new Map(
    [
      ...categoryResponse.products,
      ...productTypeResponse.products,
    ].map((item) => [item.id, item]),
  );

  const recommendations = Array.from(
    recommendationMap.values(),
  )
    .filter(
      (item) =>
        item.id !== product.id &&
        item.status === "active" &&
        (item.category === product.category ||
          item.productType ===
            product.productType),
    )
    .slice(0, 4);

  /* ----------------------------------------------------------
     JSON-LD
  ---------------------------------------------------------- */

  return (
    <>
      {/* ======================================================
          PRODUCT STRUCTURED DATA
      ====================================================== */}

      <ProductJsonLd product={product} />

      {/* ======================================================
          BREADCRUMB STRUCTURED DATA
      ====================================================== */}

      <BreadcrumbJsonLd
        items={[
          {
            name: "Home",
            url: "/",
          },
          {
            name: "Shop",
            url: "/shop",
          },
          {
            name: product.name,
            url: `/products/${product.slug}`,
          },
        ]}
      />

      {/* ======================================================
          PRODUCT UI
      ====================================================== */}

      <ProductDetail
        product={product}
        recommendations={recommendations}
      />
    </>
  );
}