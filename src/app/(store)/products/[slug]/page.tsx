import { notFound } from "next/navigation";

import { products } from "@/data/products";
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

  const product = products.find(
    (item) => item.slug === slug,
  );

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}