import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getProductBySlug,
  getProducts,
} from "@/lib/api/products";

import { getCategories } from "@/services/category.service";

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

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
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
     LOAD CATEGORY
  ---------------------------------------------------------- */

  let categoryName: string | undefined;

  try {
    const categories = await getCategories();

    const category = categories.find(
      (item) => item.id === product.categoryId,
    );

    categoryName = category?.name;
  } catch (error) {
    console.error(
      "Failed to load product category:",
      error,
    );
  }

  /* ----------------------------------------------------------
     LOAD RECOMMENDATIONS

     Products are now independent products.
     Recommendations are based on the same category.
  ---------------------------------------------------------- */

  const categoryResponse = await getProducts({
    page: 1,
    limit: 8,
    categoryId: product.categoryId,
    status: "active",
    sort: "featured",
  });

  /* ----------------------------------------------------------
     MERGE + DEDUPLICATE RECOMMENDATIONS
  ---------------------------------------------------------- */

  const recommendationMap = new Map(
    categoryResponse.products.map((item) => [
      item.id,
      item,
    ]),
  );

  const recommendations = Array.from(
    recommendationMap.values(),
  )
    .filter(
      (item) =>
        item.id !== product.id &&
        item.status === "active" &&
        item.categoryId === product.categoryId,
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

      <ProductJsonLd
        product={product}
        categoryName={categoryName}
      />

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
          ...(categoryName
            ? [
                {
                  name: categoryName,
                  url: `/shop?category=${product.categoryId}`,
                },
              ]
            : []),
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