export const homeHero = {
  eyebrow: "Spring / Summer 2026",

  title: {
    first: "Timeless",
    second: "Elegance",
  },

  description:
    "A new expression of refined femininity. Designed for the woman who makes every moment her own.",

  primaryAction: {
    label: "Explore the Collection",
    href: "/shop",
  },

  secondaryAction: {
    label: "Discover Ayesha",
    href: "#our-story",
  },

  image: {
    src: "/images/hero/aayesha-fashion-hero.png",
    alt: "Ayesha Fashion luxury editorial collection",
  },

  collection: "The Signature Edit",
} as const;

export const brandPhilosophy = {
  eyebrow: "The Aayesha Philosophy",

  title: {
    lineOne: "Fashion is not simply",
    lineTwo: "what you wear.",
    lineThree: "It is how you arrive.",
  },

  description:
    "Aayesha celebrates modern femininity through thoughtfully chosen silhouettes, timeless details, and an effortless sense of elegance.",

  signature: "AAYESHA FASHION",

  href: "/about",
} as const;


export const featuredCollections = [
  {
    id: "festive-edit",
    number: "01",
    eyebrow: "Celebration",
    title: "The Festive Edit",
    description:
      "Statement silhouettes created for celebrations that deserve to be remembered.",
    href: "/collections/festive",
    image: {
      src: "/images/collections/festive.jpg",
      alt: "Ayesha Fashion festive collection",
    },
    size: "large",
  },
  {
    id: "ethnic-elegance",
    number: "02",
    eyebrow: "Heritage",
    title: "Ethnic Elegance",
    description:
      "Timeless craftsmanship interpreted through a modern point of view.",
    href: "/collections/ethnic",
    image: {
      src: "/images/collections/ethnic.jpg",
      alt: "Ayesha Fashion ethnic elegance collection",
    },
    size: "medium",
  },
  {
    id: "modern-classics",
    number: "03",
    eyebrow: "Contemporary",
    title: "Modern Classics",
    description:
      "Refined essentials designed for effortless elegance beyond the season.",
    href: "/collections/contemporary",
    image: {
      src: "/images/collections/contemporary.jpg",
      alt: "Ayesha Fashion modern classics collection",
    },
    size: "small",
  },
] as const;

export const editorialCampaign = {
  eyebrow: "The Art of Dressing",

  title: {
    lineOne: "Tradition,",
    lineTwo: "reimagined.",
  },

  description:
    "A meeting of timeless craftsmanship and contemporary femininity, created for the way you live, celebrate and remember.",

  action: {
    label: "Discover the story",
    href: "/about",
  },

  image: {
    src: "/images/home/editorial-campaign.jpg",
    alt: "Ayesha Fashion editorial campaign",
  },
} as const;

export const ayeshaStandards = [
  {
    number: "01",
    title: "Exceptional Craftsmanship",
    description:
      "Considered details, refined finishes and an uncompromising eye for quality.",
  },
  {
    number: "02",
    title: "Designed with Intention",
    description:
      "Thoughtful silhouettes created to complement the modern woman's individuality.",
  },
  {
    number: "03",
    title: "Timeless by Nature",
    description:
      "Pieces designed to remain relevant beyond a single season or occasion.",
  },
  {
    number: "04",
    title: "An Experience to Remember",
    description:
      "A considered journey from discovering your piece to receiving it.",
  },
] as const;

export const ayeshaExperience = {
  eyebrow: "The Aayesha Experience",

  title: {
    lineOne: "Built around",
    lineTwo: "the details that",
    emphasis: "matter.",
  },

  description:
    "From carefully chosen fabrics to a seamless shopping experience, every detail is designed with you in mind.",

  image: {
    src: "/images/home/ayesha-experience.jpg",
    alt: "Ayesha Fashion editorial experience",
  },

  imageCaption: "Clothes for a more meaningful wardrobe",

  standards: [
    {
      number: "01",
      title: "Premium Quality",
      description:
        "Carefully sourced fabrics and refined craftsmanship.",
    },
    {
      number: "02",
      title: "Thoughtful Design",
      description:
        "Timeless silhouettes created for the modern woman.",
    },
    {
      number: "03",
      title: "Easy Returns",
      description:
        "A simple and considered return experience.",
    },
    {
      number: "04",
      title: "Secure Shopping",
      description:
        "A safe and trusted checkout experience.",
    },
  ],

  action: {
    label: "Learn More",
    href: "/about",
  },

  footerLabel: "A fashion house for modern women",

  fabricImage: {
    src: "/images/home/ayesha-detail.jpg",
    alt: "Detailed embroidery and fabric from Ayesha Fashion",
  },

  footerItems: [
    "Quality",
    "Craftsmanship",
    "Thoughtful Design",
    "You",
  ],
} as const;

export const newsletter = {
  eyebrow: "The Private Edit",

  title: {
    lineOne: "Be the first to",
    lineTwo: "discover what’s next.",
  },

  description:
    "Receive new collection previews, private launches and stories from the world of Ayesha Fashion.",

  placeholder: "Your email address",

  buttonLabel: "Join the Edit",

  note: "By subscribing, you agree to receive updates from Ayesha Fashion.",

  href: "#newsletter",
} as const;


/* =========================================================
   HERO SLIDES
========================================================= */

export const homeHeroSlides = [
  {
    id: "hero-01",

    eyebrow: "New Season",

    title: {
      lineOne: "Timeless",
      lineTwo: "Elegance",
    },

    description: "Modern designs rooted in tradition.",

    action: {
      label: "Shop New Arrivals",
      href: "/collections/new-arrivals",
    },

    desktopImage: {
      src: "/images/hero/hero-01-desktop.jpg",
      alt: "Elegant blush pink Indian fashion ensemble",
    },

    mobileImage: {
      src: "/images/hero/hero-01-mobile.jpg",
      alt: "Elegant blush pink Indian fashion ensemble",
    },
  },

  {
    id: "hero-02",

    eyebrow: "Festive Edit",

    title: {
      lineOne: "Made for",
      lineTwo: "Celebrations",
    },

    description:
      "Exquisite silhouettes for your most special moments.",

    action: {
      label: "Explore Festive Edit",
      href: "/collections/festive",
    },

    desktopImage: {
      src: "/images/hero/hero-02-desktop.jpg",
      alt: "Luxury burgundy festive Indian fashion ensemble",
    },

    mobileImage: {
      src: "/images/hero/hero-02-mobile.jpg",
      alt: "Luxury burgundy festive Indian fashion ensemble",
    },
  },

  {
    id: "hero-03",

    eyebrow: "The Signature Edit",

    title: {
      lineOne: "Effortless",
      lineTwo: "Grace",
    },

    description:
      "Thoughtfully designed for every chapter of modern femininity.",

    action: {
      label: "Discover the Edit",
      href: "/collections/contemporary",
    },

    desktopImage: {
      src: "/images/hero/hero-03-desktop.jpg",
      alt: "Elegant sage green contemporary Indian fashion ensemble",
    },

    mobileImage: {
      src: "/images/hero/hero-03-mobile.jpg",
      alt: "Elegant sage green contemporary Indian fashion ensemble",
    },
  },
] as const;


export const featuredCategories = [
  {
    id: "festive",
    title: "Festive",
    href: "/collections/festive",
    image: {
      src: "/images/categories/festive.jpg",
      alt: "Ayesha Fashion festive collection",
    },
  },
  {
    id: "ethnic",
    title: "Ethnic",
    href: "/collections/ethnic",
    image: {
      src: "/images/categories/ethnic.jpg",
      alt: "Ayesha Fashion ethnic collection",
    },
  },
  {
    id: "contemporary",
    title: "Contemporary",
    href: "/collections/contemporary",
    image: {
      src: "/images/categories/contemporary.jpg",
      alt: "Ayesha Fashion contemporary collection",
    },
  },
  {
    id: "new-arrivals",
    title: "New Arrivals",
    href: "/collections/new-arrivals",
    image: {
      src: "/images/categories/new-arrivals.jpg",
      alt: "Ayesha Fashion new arrivals collection",
    },
  },
] as const;