import type { Product } from "@/types/product";
import { ProductContentRenderer } from "@/components/product/product-content-renderer";

interface ProductDescriptionProps {
  product: Product;
}

export function ProductDescription({
  product,
}: ProductDescriptionProps) {
  return (
    <div className="max-w-2xl">
      <ProductContentRenderer content={product.content} />
    </div>
  );
}