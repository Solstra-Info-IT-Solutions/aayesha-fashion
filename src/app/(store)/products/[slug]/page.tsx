import { notFound } from "next/navigation";

import {
  getProductBySlug,
  getProducts,
} from "@/lib/api/products";

import { ProductDetail } from "@/components/product/product-detail";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  let product;

  try {
    product = await getProductBySlug(slug);
  } catch {
    notFound();
  }

  if (!product) {
    notFound();
  }

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

  const recommendationMap =
    new Map(
      [
        ...categoryResponse.products,
        ...productTypeResponse.products,
      ].map((item) => [
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
        (item.category === product.category ||
          item.productType ===
            product.productType),
    )
    .slice(0, 4);

  return (
    <ProductDetail
      product={product}
      recommendations={recommendations}
    />
  );
}