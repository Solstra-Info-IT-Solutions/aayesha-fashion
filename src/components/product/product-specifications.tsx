import type { Product } from "@/types/product";

interface ProductSpecificationsProps {
  product: Product;
}

export function ProductSpecifications({
  product,
}: ProductSpecificationsProps) {
  const a = product.attributes;

  const specifications = [
    ["Product Type", product.productType],
    ["Category", product.category],
    ["Fabric", a.fabric],
    ["Composition", a.composition],
    ["Fit", a.fit],
    ["Pattern", a.pattern],
    ["Work", a.work],
    ["Neckline", a.neckline],
    ["Sleeve", a.sleeve],
    ["Silhouette", a.silhouette],
    ["Length", a.length],
    ["Lining", a.lining],
    ["Transparency", a.transparency],
    ["Occasion", a.occasion?.join(", ")],
  ].filter(([, value]) => value);

  return (
    <div className="border-y border-[var(--color-border)]">
      {specifications.map(([label, value]) => (
        <div
          key={label}
          className="flex items-start justify-between gap-8 border-b border-[var(--color-border)] py-4 last:border-b-0"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.11em] text-[var(--color-text-muted)]">
            {label}
          </span>

          <span className="max-w-[60%] text-right text-sm text-[var(--color-text-secondary)]">
            {String(value)}
          </span>
        </div>
      ))}
    </div>
  );
}