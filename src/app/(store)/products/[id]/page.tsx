import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getProductById,
  getProducts,
} from "@/lib/api/products";

import { getCategories } from "@/services/category.service";

import { ProductJsonLd } from "@/components/seo/product-json-ld";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { ProductDetail } from "@/components/product/product-detail";

import type { Product } from "@/types/product";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

function normalizeProduct(
  product: Product,
): Product {
  const safeProduct =
    product ?? ({} as Product);

  return {
    ...safeProduct,

    _id:
      safeProduct._id ??
      safeProduct.id ??
      "",

    id:
      safeProduct.id ??
      safeProduct._id ??
      "",

    slug:
      safeProduct.slug ?? "",

    name:
      safeProduct.name ??
      "Product",

    categoryId:
      safeProduct.categoryId ??
      "",

    pricing: {
      mrp:
        safeProduct.pricing?.mrp ??
        0,

      sellingPrice:
        safeProduct.pricing
          ?.sellingPrice ??
        0,

      currency:
        safeProduct.pricing
          ?.currency ??
        "INR",
    },

    inventory: {
      stock:
        safeProduct.inventory
          ?.stock ?? 0,

      reserved:
        safeProduct.inventory
          ?.reserved ?? 0,

      lowStockThreshold:
        safeProduct.inventory
          ?.lowStockThreshold ??
        2,
    },

    content: {
      description:
        safeProduct.content
          ?.description ?? "",

      descriptionFormat:
        safeProduct.content
          ?.descriptionFormat ??
        "plain",

      richContent:
        safeProduct.content
          ?.richContent,
    },

    media: Array.isArray(
      safeProduct.media,
    )
      ? safeProduct.media
      : [],

    merchandising: {
      isNew:
        safeProduct.merchandising
          ?.isNew ?? false,

      isFeatured:
        safeProduct.merchandising
          ?.isFeatured ?? false,

      isBestSeller:
        safeProduct.merchandising
          ?.isBestSeller ?? false,

      badges:
        Array.isArray(
          safeProduct.merchandising
            ?.badges,
        )
          ? safeProduct.merchandising
              .badges
          : [],

      ranking:
        safeProduct.merchandising
          ?.ranking,
    },

    seo: safeProduct.seo
      ? {
          ...safeProduct.seo,
          keywords:
            Array.isArray(
              safeProduct.seo
                .keywords,
            )
              ? safeProduct.seo
                  .keywords
              : [],
        }
      : undefined,

    status:
      safeProduct.status ??
      "draft",

    publishedAt:
      safeProduct.publishedAt,

    createdAt:
      safeProduct.createdAt ??
      "",

    updatedAt:
      safeProduct.updatedAt ??
      "",
  };
}

/* ============================================================
   DYNAMIC PRODUCT METADATA
============================================================ */

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const response =
      await getProductById(id);

    if (!response) {
      return {
        title:
          "Product Not Found",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const product =
      normalizeProduct(response);

    const title =
      product.seo?.title ||
      `${product.name} | Aayesha Fashion`;

    const description =
      product.seo?.description ||
      product.content?.description ||
      `Discover ${product.name} from Aayesha Fashion.`;

    const canonical =
      product.seo?.canonical ||
      `/products/${product._id}`;

    const media =
      Array.isArray(product.media)
        ? product.media
        : [];

    const primaryMedia =
      media.find(
        (item) =>
          item?.isPrimary &&
          item?.type === "image",
      ) ??
      media.find(
        (item) =>
          item?.type === "image",
      );

    const primaryImage =
      primaryMedia?.src;

    return {
      title,
      description,

      keywords:
        product.seo?.keywords
          ?.length
          ? product.seo.keywords
          : undefined,

      alternates: {
        canonical,
      },

      robots: product.seo
        ?.noIndex
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
                url:
                  primaryImage,
                alt:
                  primaryMedia?.alt ||
                  product.name,
              },
            ]
          : undefined,
      },

      twitter: {
        card:
          "summary_large_image",

        title,
        description,

        images: primaryImage
          ? [primaryImage]
          : undefined,
      },
    };
  } catch (error) {
    console.error(
      "Failed to generate product metadata:",
      error,
    );

    return {
      title:
        "Product Not Found",

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
  const { id } = await params;

  if (!id) {
    notFound();
  }

  let product: Product;

  try {
    const response =
      await getProductById(id);

    if (!response) {
      notFound();
    }

    product =
      normalizeProduct(response);
  } catch (error) {
    console.error(
      "Failed to load product:",
      error,
    );

    notFound();
  }

  /* ----------------------------------------------------------
     LOAD CATEGORY
  ---------------------------------------------------------- */

  let categoryName:
    | string
    | undefined;

  try {
    const categories =
      await getCategories();

    if (Array.isArray(categories)) {
      const category =
        categories.find(
          (item) =>
            item.id ===
            product.categoryId,
        );

      categoryName =
        category?.name;
    }
  } catch (error) {
    console.error(
      "Failed to load product category:",
      error,
    );
  }

  /* ----------------------------------------------------------
     LOAD RELATED PRODUCTS
  ---------------------------------------------------------- */

  let recommendations:
    Product[] = [];

  try {
    if (product.categoryId) {
      const categoryResponse =
        await getProducts({
          page: 1,
          limit: 8,
          categoryId:
            product.categoryId,
          status: "active",
          sort: "featured",
        });

      const relatedProducts =
        Array.isArray(
          categoryResponse?.products,
        )
          ? categoryResponse.products
          : [];

      recommendations =
        relatedProducts
          .filter(
            (item) =>
              item &&
              item._id !==
                product._id &&
              item.status ===
                "active" &&
              item.categoryId ===
                product.categoryId,
          )
          .slice(0, 4)
          .map(normalizeProduct);
    }
  } catch (error) {
    console.error(
      "Failed to load product recommendations:",
      error,
    );
  }

  /* ----------------------------------------------------------
     RENDER
  ---------------------------------------------------------- */

  return (
    <>
      <ProductJsonLd
        product={product}
        categoryName={
          categoryName
        }
      />

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
                  name:
                    categoryName,

                  url:
                    `/shop?category=${encodeURIComponent(
                      product.categoryId,
                    )}`,
                },
              ]
            : []),

          {
            name:
              product.name,

            url:
              `/products/${product._id}`,
          },
        ]}
      />

      <ProductDetail
        product={product}
        recommendations={
          recommendations
        }
      />
    </>
  );
}