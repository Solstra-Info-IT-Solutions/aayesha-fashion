import type { Product } from "@/types/product";

export const signatureProducts: Product[] = [
  {
    id: "signature-01",
    slug: "rose-garden-anarkali",
    name: "Rose Garden Anarkali",
    price: 8999,
    category: "festive",

    image: {
      src: "/images/products/rose-garden-anarkali.jpg",
      alt: "Rose Garden Anarkali by Ayesha Fashion",
    },

    badge: "New Arrival",
    colors: 3,
    isNew: true,
  },

  {
    id: "signature-02",
    slug: "ivory-noor-set",
    name: "Ivory Noor Set",
    price: 10999,
    category: "ethnic",

    image: {
      src: "/images/products/ivory-noor-set.jpg",
      alt: "Ivory Noor Set by Ayesha Fashion",
    },

    badge: "Signature",
    colors: 2,
    isNew: true,
  },

  {
    id: "signature-03",
    slug: "sage-heritage-suit",
    name: "Sage Heritage Suit",
    price: 7499,
    category: "contemporary",

    image: {
      src: "/images/products/sage-heritage-suit.jpg",
      alt: "Sage Heritage Suit by Ayesha Fashion",
    },

    badge: "Best Seller",
    colors: 4,
    isBestSeller: true,
  },
];