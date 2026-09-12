export interface HomepageHeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  mobileImage: string;
  href: string;
  buttonLabel: string;
  sortOrder: number;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
}

export interface HomepageHero {
  enabled: boolean;
  slides: HomepageHeroSlide[];
}

export interface HomepageBrandStory {
  enabled: boolean;
  eyebrow: string;
  number: string;
  title: string;
  descriptions: string[];
  ctaLabel: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
  caption: string;
  brandLabel: string;
  statement: string;
}

export interface HomepageWhyChooseUsValue {
  id: string;
  title: string;
  description: string;
  icon:
    | "scissors"
    | "gem"
    | "heart"
    | "sparkles";
  sortOrder: number;
  isActive: boolean;
}

export interface HomepageWhyChooseUs {
  enabled: boolean;
  eyebrow: string;
  number: string;
  title: string;
  description: string;
  values: HomepageWhyChooseUsValue[];
  closingStatement: string;
}

export interface HomepageTestimonial {
  id: string;
  quote: string;
  name: string;
  location: string;
  image: string;
  imageAlt: string;
  sortOrder: number;
  isActive: boolean;
}

export interface HomepageTestimonials {
  enabled: boolean;
  testimonials: HomepageTestimonial[];
}

export interface HomepageNewsletter {
  enabled: boolean;
  eyebrow: string;
  title: {
    lineOne: string;
    lineTwo: string;
  };
  description: string;
  inputPlaceholder: string;
  buttonLabel: string;
  disclaimer: string;
}

export interface HomepageInstagramPost {
  id: string;
  src: string;
  alt: string;
  href: string;
  sortOrder: number;
  isActive: boolean;
}

export interface HomepageInstagram {
  enabled: boolean;
  eyebrow: string;
  title: {
    lineOne: string;
    lineTwo: string;
  };
  handle: string;
  instagramUrl: string;
  ctaLabel: string;
  posts: HomepageInstagramPost[];
}

export interface HomepageData {
  hero: HomepageHero | null;
  brandStory: HomepageBrandStory | null;
  whyChooseUs: HomepageWhyChooseUs | null;
  testimonials: HomepageTestimonials | null;
  newsletter: HomepageNewsletter | null;
  instagram: HomepageInstagram | null;
}

export interface HomepageApiResponse {
  success: boolean;
  data: HomepageData;
}