import { apiFetch } from "@/lib/api";

/* =========================================================
   FEATURED COLLECTION CAMPAIGN
========================================================= */

export interface FeaturedCollectionCampaignMetadata {
  image: string;
  imageAlt: string;

  eyebrow: string;

  title: string;

  description: string;

  ctaLabel: string;
  ctaHref: string;

  brandLabel: string;

  bottomLabel: string;
  bottomTitle: string;
}

/* =========================================================
   PROMOTIONAL BANNER
========================================================= */

export interface PromotionalBannerMetadata {
  placement: "promotional_banner";

  image: string;
  imageAlt: string;

  href: string;
  ctaLabel: string;
}

/* =========================================================
   MARKETING CAMPAIGN
========================================================= */

export interface FeaturedCollectionCampaign {
  _id: string;

  name: string;
  slug: string;
  description: string;

  type:
    | "homepage"
    | "collection"
    | "product"
    | "email"
    | "whatsapp"
    | "social";

  status:
    | "draft"
    | "scheduled"
    | "active"
    | "paused"
    | "completed"
    | "archived";

  startsAt: string | null;
  endsAt: string | null;

  budget: number;

  metadata: FeaturedCollectionCampaignMetadata;

  createdBy: string | null;
  updatedBy: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface PromotionalBannerCampaign {
  _id: string;

  name: string;
  slug: string;
  description: string;

  type:
    | "homepage"
    | "collection"
    | "product"
    | "email"
    | "whatsapp"
    | "social";

  status:
    | "draft"
    | "scheduled"
    | "active"
    | "paused"
    | "completed"
    | "archived";

  startsAt: string | null;
  endsAt: string | null;

  budget: number;

  metadata: PromotionalBannerMetadata;

  createdBy: string | null;
  updatedBy: string | null;

  createdAt: string;
  updatedAt: string;
}

/* =========================================================
   GET FEATURED COLLECTION CAMPAIGN
========================================================= */

export async function getFeaturedCollectionCampaign(): Promise<
  FeaturedCollectionCampaign | null
> {
  return apiFetch<FeaturedCollectionCampaign | null>(
    "/marketing/featured-collection",
  );
}

/* =========================================================
   GET PROMOTIONAL BANNER
========================================================= */

export async function getPromotionalBanner(): Promise<
  PromotionalBannerCampaign | null
> {
  return apiFetch<PromotionalBannerCampaign | null>(
    "/marketing/promotional-banner",
  );
}