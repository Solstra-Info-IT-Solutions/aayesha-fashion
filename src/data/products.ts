import type {
  Product,
  ProductColor,
  ProductSize,
} from "@/types/product";

/* ============================================================
   SHARED COLORS
============================================================ */

const roseColor: ProductColor = {
  id: "rose",
  name: "Rose",
  slug: "rose",
  hex: "#DFA0A8",
};

const ivoryColor: ProductColor = {
  id: "ivory",
  name: "Ivory",
  slug: "ivory",
  hex: "#F5F0E8",
};

const sageColor: ProductColor = {
  id: "sage",
  name: "Sage",
  slug: "sage",
  hex: "#A8B2A0",
};

const blackColor: ProductColor = {
  id: "black",
  name: "Black",
  slug: "black",
  hex: "#171717",
};

const wineColor: ProductColor = {
  id: "wine",
  name: "Wine",
  slug: "wine",
  hex: "#6F2437",
};

const powderBlueColor: ProductColor = {
  id: "powder-blue",
  name: "Powder Blue",
  slug: "powder-blue",
  hex: "#B8C8D8",
};

/* ============================================================
   SHARED SIZES
============================================================ */

const XS: ProductSize = {
  code: "XS",
  label: "XS",
  sortOrder: 1,
};

const S: ProductSize = {
  code: "S",
  label: "S",
  sortOrder: 2,
};

const M: ProductSize = {
  code: "M",
  label: "M",
  sortOrder: 3,
};

const L: ProductSize = {
  code: "L",
  label: "L",
  sortOrder: 4,
};

const XL: ProductSize = {
  code: "XL",
  label: "XL",
  sortOrder: 5,
};

const XXL: ProductSize = {
  code: "XXL",
  label: "XXL",
  sortOrder: 6,
};

/* ============================================================
   HELPER
============================================================ */

function createVariant({
  id,
  sku,
  color,
  size,
  mrp,
  sellingPrice,
  stock,
  reserved = 0,
  lowStockThreshold = 3,
  mediaIds = [],
  weight = 700,
}: {
  id: string;
  sku: string;
  color: ProductColor;
  size: ProductSize;
  mrp: number;
  sellingPrice: number;
  stock: number;
  reserved?: number;
  lowStockThreshold?: number;
  mediaIds?: string[];
  weight?: number;
}) {
  return {
    id,
    sku,
    barcode: undefined,

    color,
    size,

    pricing: {
      mrp,
      sellingPrice,
      currency: "INR" as const,
    },

    inventory: {
      stock,
      reserved,
      lowStockThreshold,
    },

    mediaIds,

    weight,

    status: "active" as const,
  };
}

/* ============================================================
   ROSE GARDEN ANARKALI
============================================================ */

export const roseGardenAnarkali: Product = {
  id: "signature-01",

  slug: "rose-garden-anarkali",

  name: "Rose Garden Anarkali",

  productType: "anarkali",

  category: "festive",

  subcategory: "Anarkali Sets",

  collectionIds: [
    "signature-edit",
    "festive-edit",
    "new-arrivals",
  ],

  tags: [
    "anarkali",
    "festive",
    "embroidered",
    "rose",
    "occasion-wear",
    "indian-wear",
  ],

  content: {
    description:
      "A softly structured Anarkali designed with graceful movement, delicate detailing and a timeless feminine silhouette.",

    descriptionFormat: "plain",

    highlights: [
      "Elegant floor-length Anarkali silhouette",
      "Soft feminine colour palette",
      "Designed for festive and occasion dressing",
      "Comfort-focused construction",
    ],

    stylingNotes:
      "Style with minimal jewellery, a structured potli and delicate heels for an understated festive look.",

    fitNote:
      "Designed for a graceful, comfortable fit through the bodice with an easy-flowing lower silhouette.",

    materialsAndCare: [
      "Dry clean recommended.",
      "Store in a breathable garment bag.",
      "Avoid prolonged exposure to direct sunlight.",
      "Steam lightly before wear.",
    ],

    shippingContent:
      "Orders are carefully packed and shipped across India. Estimated delivery depends on your delivery location and order processing time.",

    returnContent:
      "Eligible products may be exchanged or returned according to the Ayesha Fashion return policy.",
  },

  attributes: {
    fabric: "Premium blended fabric",

    composition: "Comfort-focused premium blend",

    fit: "Comfortable regular fit",

    occasion: [
      "Festive",
      "Wedding",
      "Celebration",
      "Evening",
    ],

    pattern: "Solid",

    work: "Minimal hand-inspired detailing",

    neckline: "Round",

    sleeve: "Full Sleeve",

    silhouette: "Flared Anarkali",

    length: "Floor Length",

    lining: "Partial lining",

    transparency: "Opaque",

    careInstructions: [
      "Dry clean recommended",
      "Do not bleach",
      "Iron on low heat",
      "Store away from direct sunlight",
    ],
  },

  media: [
    {
      id: "rose-garden-main",
      type: "image",
      src: "/images/products/rose-garden-anarkali.jpg",
      alt: "Rose Garden Anarkali by Ayesha Fashion",
      imageType: "model",
      sortOrder: 1,
      isPrimary: true,
    },
  ],

  sizeChart: {
    unit: "inch",

    measurements: [
      {
        size: "XS",
        bust: 32,
        waist: 26,
        hip: 35,
        shoulder: 13.5,
        sleeveLength: 22,
        garmentLength: 54,
      },
      {
        size: "S",
        bust: 34,
        waist: 28,
        hip: 37,
        shoulder: 14,
        sleeveLength: 22,
        garmentLength: 54,
      },
      {
        size: "M",
        bust: 36,
        waist: 30,
        hip: 39,
        shoulder: 14.5,
        sleeveLength: 22.5,
        garmentLength: 55,
      },
      {
        size: "L",
        bust: 38,
        waist: 32,
        hip: 41,
        shoulder: 15,
        sleeveLength: 23,
        garmentLength: 55,
      },
      {
        size: "XL",
        bust: 40,
        waist: 34,
        hip: 43,
        shoulder: 15.5,
        sleeveLength: 23,
        garmentLength: 56,
      },
      {
        size: "XXL",
        bust: 42,
        waist: 36,
        hip: 45,
        shoulder: 16,
        sleeveLength: 23.5,
        garmentLength: 56,
      },
    ],

    fitNote:
      "Choose your usual size. For a more relaxed fit, consider sizing up.",
  },

  variants: [
    createVariant({
      id: "rose-garden-rose-xs",
      sku: "AAF-RGA-ROSE-XS",
      color: roseColor,
      size: XS,
      mrp: 10999,
      sellingPrice: 8999,
      stock: 4,
      mediaIds: ["rose-garden-main"],
    }),

    createVariant({
      id: "rose-garden-rose-s",
      sku: "AAF-RGA-ROSE-S",
      color: roseColor,
      size: S,
      mrp: 10999,
      sellingPrice: 8999,
      stock: 7,
      mediaIds: ["rose-garden-main"],
    }),

    createVariant({
      id: "rose-garden-rose-m",
      sku: "AAF-RGA-ROSE-M",
      color: roseColor,
      size: M,
      mrp: 10999,
      sellingPrice: 8999,
      stock: 8,
      mediaIds: ["rose-garden-main"],
    }),

    createVariant({
      id: "rose-garden-rose-l",
      sku: "AAF-RGA-ROSE-L",
      color: roseColor,
      size: L,
      mrp: 10999,
      sellingPrice: 8999,
      stock: 5,
      mediaIds: ["rose-garden-main"],
    }),

    createVariant({
      id: "rose-garden-rose-xl",
      sku: "AAF-RGA-ROSE-XL",
      color: roseColor,
      size: XL,
      mrp: 10999,
      sellingPrice: 8999,
      stock: 2,
      lowStockThreshold: 3,
      mediaIds: ["rose-garden-main"],
    }),

    createVariant({
      id: "rose-garden-rose-xxl",
      sku: "AAF-RGA-ROSE-XXL",
      color: roseColor,
      size: XXL,
      mrp: 10999,
      sellingPrice: 8999,
      stock: 0,
      mediaIds: ["rose-garden-main"],
    }),
  ],

  faqs: [
    {
      id: "rga-faq-1",
      question: "Is the product true to size?",
      answer:
        "The product follows a comfortable regular fit. Please refer to the size chart before ordering.",
      answerFormat: "plain",
    },
    {
      id: "rga-faq-2",
      question: "How should I care for this outfit?",
      answer:
        "Dry cleaning is recommended to preserve the fabric and detailing.",
      answerFormat: "plain",
    },
    {
      id: "rga-faq-3",
      question: "Is this suitable for festive occasions?",
      answer:
        "Yes. The silhouette is designed for festive, wedding and evening occasions.",
      answerFormat: "plain",
    },
  ],

  reviews: {
    averageRating: 4.8,
    reviewCount: 24,

    breakdown: {
      5: 20,
      4: 3,
      3: 1,
      2: 0,
      1: 0,
    },
  },

  merchandising: {
    isNew: true,
    isFeatured: true,
    isBestSeller: false,

    badges: [
      "new",
      "featured",
    ],

    ranking: 1,
  },

  seo: {
    title:
      "Rose Garden Anarkali | Ayesha Fashion",

    description:
      "Discover the Rose Garden Anarkali by Ayesha Fashion, designed for elegant festive and occasion dressing.",

    keywords: [
      "anarkali",
      "festive wear",
      "indian wear",
      "ayesha fashion",
    ],
  },

  status: "active",

  publishedAt: "2026-08-20T10:00:00.000Z",

  createdAt: "2026-08-18T10:00:00.000Z",

  updatedAt: "2026-09-04T10:00:00.000Z",
};

/* ============================================================
   IVORY NOOR SET
============================================================ */

export const ivoryNoorSet: Product = {
  id: "signature-02",

  slug: "ivory-noor-set",

  name: "Ivory Noor Set",

  productType: "suit-set",

  category: "ethnic",

  subcategory: "Suit Sets",

  collectionIds: [
    "signature-edit",
    "ethnic-edit",
  ],

  tags: [
    "ivory",
    "suit-set",
    "ethnic",
    "elegant",
    "occasion-wear",
  ],

  content: {
    description:
      "An elegant ivory suit set created for quiet sophistication with graceful Indian detailing.",

    descriptionFormat: "plain",

    highlights: [
      "Elegant ivory colourway",
      "Timeless ethnic silhouette",
      "Easy occasion-to-evening styling",
      "Lightweight and comfortable construction",
    ],

    stylingNotes:
      "Pair with pearl or antique-gold jewellery and neutral heels for a refined occasion look.",

    fitNote:
      "Regular fit with an easy silhouette designed to allow comfortable movement.",

    materialsAndCare: [
      "Dry clean recommended.",
      "Do not bleach.",
      "Use low-temperature steam.",
      "Store folded or on a padded hanger.",
    ],

    shippingContent:
      "Orders are packed with care and shipped across India.",

    returnContent:
      "Eligible orders can be returned or exchanged according to the current return policy.",
  },

  attributes: {
    fabric: "Soft premium blend",

    composition: "Premium blended composition",

    fit: "Regular fit",

    occasion: [
      "Festive",
      "Family Gatherings",
      "Evening",
      "Celebration",
    ],

    pattern: "Subtle texture",

    work: "Fine surface detailing",

    neckline: "Round",

    sleeve: "Three Quarter Sleeve",

    silhouette: "Straight Suit",

    length: "Mid-Calf",

    lining: "Partial lining",

    transparency: "Opaque",

    careInstructions: [
      "Dry clean recommended",
      "Do not bleach",
      "Iron on low heat",
      "Store in breathable packaging",
    ],
  },

  media: [
    {
      id: "ivory-noor-main",
      type: "image",
      src: "/images/products/ivory-noor-set.jpg",
      alt: "Ivory Noor Set by Ayesha Fashion",
      imageType: "model",
      sortOrder: 1,
      isPrimary: true,
    },
  ],

  sizeChart: {
    unit: "inch",

    measurements: [
      {
        size: "XS",
        bust: 32,
        waist: 26,
        hip: 35,
        shoulder: 13.5,
        sleeveLength: 17,
        garmentLength: 42,
      },
      {
        size: "S",
        bust: 34,
        waist: 28,
        hip: 37,
        shoulder: 14,
        sleeveLength: 17.5,
        garmentLength: 42,
      },
      {
        size: "M",
        bust: 36,
        waist: 30,
        hip: 39,
        shoulder: 14.5,
        sleeveLength: 18,
        garmentLength: 43,
      },
      {
        size: "L",
        bust: 38,
        waist: 32,
        hip: 41,
        shoulder: 15,
        sleeveLength: 18,
        garmentLength: 43,
      },
      {
        size: "XL",
        bust: 40,
        waist: 34,
        hip: 43,
        shoulder: 15.5,
        sleeveLength: 18.5,
        garmentLength: 44,
      },
      {
        size: "XXL",
        bust: 42,
        waist: 36,
        hip: 45,
        shoulder: 16,
        sleeveLength: 19,
        garmentLength: 44,
      },
    ],

    fitNote:
      "Choose your usual size for the intended relaxed silhouette.",
  },

  variants: [
    createVariant({
      id: "ivory-noor-ivory-xs",
      sku: "AAF-INS-IVORY-XS",
      color: ivoryColor,
      size: XS,
      mrp: 12999,
      sellingPrice: 10999,
      stock: 3,
      mediaIds: ["ivory-noor-main"],
    }),

    createVariant({
      id: "ivory-noor-ivory-s",
      sku: "AAF-INS-IVORY-S",
      color: ivoryColor,
      size: S,
      mrp: 12999,
      sellingPrice: 10999,
      stock: 6,
      mediaIds: ["ivory-noor-main"],
    }),

    createVariant({
      id: "ivory-noor-ivory-m",
      sku: "AAF-INS-IVORY-M",
      color: ivoryColor,
      size: M,
      mrp: 12999,
      sellingPrice: 10999,
      stock: 8,
      mediaIds: ["ivory-noor-main"],
    }),

    createVariant({
      id: "ivory-noor-ivory-l",
      sku: "AAF-INS-IVORY-L",
      color: ivoryColor,
      size: L,
      mrp: 12999,
      sellingPrice: 10999,
      stock: 4,
      mediaIds: ["ivory-noor-main"],
    }),

    createVariant({
      id: "ivory-noor-ivory-xl",
      sku: "AAF-INS-IVORY-XL",
      color: ivoryColor,
      size: XL,
      mrp: 12999,
      sellingPrice: 10999,
      stock: 2,
      mediaIds: ["ivory-noor-main"],
    }),

    createVariant({
      id: "ivory-noor-ivory-xxl",
      sku: "AAF-INS-IVORY-XXL",
      color: ivoryColor,
      size: XXL,
      mrp: 12999,
      sellingPrice: 10999,
      stock: 0,
      mediaIds: ["ivory-noor-main"],
    }),
  ],

  faqs: [
    {
      id: "ins-faq-1",
      question: "What fit does this set have?",
      answer:
        "It has a comfortable regular fit with an easy ethnic silhouette.",
      answerFormat: "plain",
    },
    {
      id: "ins-faq-2",
      question: "Can I wear it to festive events?",
      answer:
        "Yes. The Ivory Noor Set is designed for festive and elegant evening dressing.",
      answerFormat: "plain",
    },
  ],

  reviews: {
    averageRating: 4.7,
    reviewCount: 18,

    breakdown: {
      5: 14,
      4: 3,
      3: 1,
      2: 0,
      1: 0,
    },
  },

  merchandising: {
    isNew: true,
    isFeatured: true,
    isBestSeller: true,

    badges: [
      "new",
      "best-seller",
      "featured",
    ],

    ranking: 2,
  },

  seo: {
    title:
      "Ivory Noor Set | Ayesha Fashion",

    description:
      "Shop the Ivory Noor Set by Ayesha Fashion — a refined ethnic ensemble designed for elegant occasions.",

    keywords: [
      "ivory suit",
      "suit set",
      "ethnic wear",
      "ayesha fashion",
    ],
  },

  status: "active",

  publishedAt: "2026-08-22T10:00:00.000Z",

  createdAt: "2026-08-20T10:00:00.000Z",

  updatedAt: "2026-09-04T10:00:00.000Z",
};

/* ============================================================
   SAGE HERITAGE SUIT
============================================================ */

export const sageHeritageSuit: Product = {
  id: "signature-03",

  slug: "sage-heritage-suit",

  name: "Sage Heritage Suit",

  productType: "suit-set",

  category: "contemporary",

  subcategory: "Contemporary Ethnic",

  collectionIds: [
    "signature-edit",
    "contemporary-edit",
  ],

  tags: [
    "sage",
    "suit",
    "contemporary",
    "indian",
    "minimal",
    "everyday-luxury",
  ],

  content: {
    description:
      "A modern take on Indian dressing, the Sage Heritage Suit balances clean tailoring with understated feminine detailing.",

    descriptionFormat: "plain",

    highlights: [
      "Contemporary Indian silhouette",
      "Soft sage colour",
      "Minimal refined detailing",
      "Versatile occasion-to-everyday styling",
    ],

    stylingNotes:
      "Keep accessories minimal with structured footwear and delicate jewellery for a contemporary finish.",

    fitNote:
      "Designed with a clean regular fit and comfortable ease through the body.",

    materialsAndCare: [
      "Dry clean recommended.",
      "Do not bleach.",
      "Steam gently.",
      "Store in a cool, dry place.",
    ],

    shippingContent:
      "Orders are carefully packed and delivered across India.",

    returnContent:
      "Eligible products are covered under the Ayesha Fashion exchange and return policy.",
  },

  attributes: {
    fabric: "Premium structured blend",

    composition: "Premium blended composition",

    fit: "Regular fit",

    occasion: [
      "Brunch",
      "Festive",
      "Office",
      "Evening",
      "Gatherings",
    ],

    pattern: "Solid",

    work: "Minimal surface detailing",

    neckline: "V-Neck",

    sleeve: "Full Sleeve",

    silhouette: "Straight Suit",

    length: "Mid-Calf",

    lining: "Partial lining",

    transparency: "Opaque",

    careInstructions: [
      "Dry clean recommended",
      "Do not bleach",
      "Iron on low heat",
      "Store away from moisture",
    ],
  },

  media: [
    {
      id: "sage-heritage-main",
      type: "image",
      src: "/images/products/sage-heritage-suit.jpg",
      alt: "Sage Heritage Suit by Ayesha Fashion",
      imageType: "model",
      sortOrder: 1,
      isPrimary: true,
    },
  ],

  sizeChart: {
    unit: "inch",

    measurements: [
      {
        size: "XS",
        bust: 32,
        waist: 26,
        hip: 35,
        shoulder: 13.5,
        sleeveLength: 22,
        garmentLength: 43,
      },
      {
        size: "S",
        bust: 34,
        waist: 28,
        hip: 37,
        shoulder: 14,
        sleeveLength: 22,
        garmentLength: 43,
      },
      {
        size: "M",
        bust: 36,
        waist: 30,
        hip: 39,
        shoulder: 14.5,
        sleeveLength: 22.5,
        garmentLength: 44,
      },
      {
        size: "L",
        bust: 38,
        waist: 32,
        hip: 41,
        shoulder: 15,
        sleeveLength: 23,
        garmentLength: 44,
      },
      {
        size: "XL",
        bust: 40,
        waist: 34,
        hip: 43,
        shoulder: 15.5,
        sleeveLength: 23,
        garmentLength: 45,
      },
      {
        size: "XXL",
        bust: 42,
        waist: 36,
        hip: 45,
        shoulder: 16,
        sleeveLength: 23.5,
        garmentLength: 45,
      },
    ],

    fitNote:
      "Choose your regular size for a clean contemporary fit.",
  },

  variants: [
    createVariant({
      id: "sage-heritage-sage-xs",
      sku: "AAF-SHS-SAGE-XS",
      color: sageColor,
      size: XS,
      mrp: 9499,
      sellingPrice: 7499,
      stock: 4,
      mediaIds: ["sage-heritage-main"],
    }),

    createVariant({
      id: "sage-heritage-sage-s",
      sku: "AAF-SHS-SAGE-S",
      color: sageColor,
      size: S,
      mrp: 9499,
      sellingPrice: 7499,
      stock: 7,
      mediaIds: ["sage-heritage-main"],
    }),

    createVariant({
      id: "sage-heritage-sage-m",
      sku: "AAF-SHS-SAGE-M",
      color: sageColor,
      size: M,
      mrp: 9499,
      sellingPrice: 7499,
      stock: 9,
      mediaIds: ["sage-heritage-main"],
    }),

    createVariant({
      id: "sage-heritage-sage-l",
      sku: "AAF-SHS-SAGE-L",
      color: sageColor,
      size: L,
      mrp: 9499,
      sellingPrice: 7499,
      stock: 5,
      mediaIds: ["sage-heritage-main"],
    }),

    createVariant({
      id: "sage-heritage-sage-xl",
      sku: "AAF-SHS-SAGE-XL",
      color: sageColor,
      size: XL,
      mrp: 9499,
      sellingPrice: 7499,
      stock: 2,
      lowStockThreshold: 3,
      mediaIds: ["sage-heritage-main"],
    }),

    createVariant({
      id: "sage-heritage-sage-xxl",
      sku: "AAF-SHS-SAGE-XXL",
      color: sageColor,
      size: XXL,
      mrp: 9499,
      sellingPrice: 7499,
      stock: 1,
      lowStockThreshold: 3,
      mediaIds: ["sage-heritage-main"],
    }),
  ],

  faqs: [
    {
      id: "shs-faq-1",
      question: "Is this suitable for everyday styling?",
      answer:
        "Yes. Its clean silhouette makes it suitable for elevated everyday and occasion styling.",
      answerFormat: "plain",
    },
    {
      id: "shs-faq-2",
      question: "What fit should I choose?",
      answer:
        "Choose your regular size for the intended contemporary fit.",
      answerFormat: "plain",
    },
  ],

  reviews: {
    averageRating: 4.6,
    reviewCount: 31,

    breakdown: {
      5: 24,
      4: 5,
      3: 2,
      2: 0,
      1: 0,
    },
  },

  merchandising: {
    isNew: false,
    isFeatured: true,
    isBestSeller: true,

    badges: [
      "best-seller",
      "featured",
    ],

    ranking: 3,
  },

  seo: {
    title:
      "Sage Heritage Suit | Ayesha Fashion",

    description:
      "Discover the Sage Heritage Suit by Ayesha Fashion, a contemporary Indian silhouette designed for effortless elegance.",

    keywords: [
      "sage suit",
      "contemporary suit",
      "indian wear",
      "ayesha fashion",
    ],
  },

  status: "active",

  publishedAt: "2026-08-25T10:00:00.000Z",

  createdAt: "2026-08-23T10:00:00.000Z",

  updatedAt: "2026-09-04T10:00:00.000Z",
};

/* ============================================================
   MASTER PRODUCT COLLECTION
============================================================ */

export const products: Product[] = [
  roseGardenAnarkali,
  ivoryNoorSet,
  sageHeritageSuit,
];

/* ============================================================
   LEGACY / SECTION EXPORTS
============================================================ */

export const signatureProducts = products;

export const newArrivals = products
  .filter(
    (product) =>
      product.status === "active" &&
      product.merchandising.isNew,
  )
  .sort(
    (a, b) =>
      new Date(
        b.publishedAt ?? b.createdAt,
      ).getTime() -
      new Date(
        a.publishedAt ?? a.createdAt,
      ).getTime(),
  );

export const bestSellers = products
  .filter(
    (product) =>
      product.status === "active" &&
      product.merchandising.isBestSeller,
  )
  .sort(
    (a, b) =>
      (a.merchandising.ranking ?? 999) -
      (b.merchandising.ranking ?? 999),
  );

export const featuredProducts = products
  .filter(
    (product) =>
      product.status === "active" &&
      product.merchandising.isFeatured,
  )
  .sort(
    (a, b) =>
      (a.merchandising.ranking ?? 999) -
      (b.merchandising.ranking ?? 999),
  );

/* ============================================================
   LOOKUPS
============================================================ */

export function getProductBySlug(
  slug: string,
): Product | undefined {
  return products.find(
    (product) =>
      product.slug === slug,
  );
}

export function getProductById(
  id: string,
): Product | undefined {
  return products.find(
    (product) =>
      product.id === id,
  );
}

export function getVariantById(
  variantId: string,
): {
  product: Product;
  variant: Product["variants"][number];
} | undefined {
  for (const product of products) {
    const variant = product.variants.find(
      (item) =>
        item.id === variantId,
    );

    if (variant) {
      return {
        product,
        variant,
      };
    }
  }

  return undefined;
}

export function getActiveVariants(
  product: Product,
) {
  return product.variants.filter(
    (variant) =>
      variant.status === "active",
  );
}

export function getAvailableVariants(
  product: Product,
) {
  return product.variants.filter(
    (variant) =>
      variant.status === "active" &&
      variant.inventory.stock -
        variant.inventory.reserved >
        0,
  );
}