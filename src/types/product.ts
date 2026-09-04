export type ProductCategory =
  | "festive"
  | "ethnic"
  | "contemporary"
  | "new-arrival";

export type ProductImage = {
  src: string;
  alt: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;

  price: number;
  compareAtPrice?: number;

  category: ProductCategory;

  image: ProductImage;

  badge?: string;

  colors?: number;

  isNew?: boolean;
  isBestSeller?: boolean;
};