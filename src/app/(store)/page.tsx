import { apiFetch } from "@/lib/api";
import type { HomepageData } from "@/types/homepage";

import { HeroSection } from "@/components/home/hero-section";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { NewArrivals } from "@/components/home/new-arrivals";
import { BrandStory } from "@/components/home/brand-story";
import { FeaturedCollectionCampaign } from "@/components/home/featured-collection-campaign";
import { BestSellers } from "@/components/home/best-sellers";
import { PromotionalBanner } from "@/components/home/promotional-banner";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { Testimonials } from "@/components/home/testimonials";
import { InstagramGallery } from "@/components/home/instagram-gallery";
import { Newsletter } from "@/components/home/newsletter";
import { SiteJsonLd } from "@/components/seo/site-json-ld";

/* =========================================================
   HOMEPAGE DATA
========================================================= */

async function getHomepage(): Promise<HomepageData> {
  try {
    return await apiFetch<HomepageData>(
      "/homepage",
    );
  } catch (error) {
    console.error(
      "Failed to load homepage:",
      error,
    );

    return {
      hero: null,
      brandStory: null,
      whyChooseUs: null,
      testimonials: null,
      newsletter: null,
      instagram: null,
    };
  }
}

/* =========================================================
   HOMEPAGE
========================================================= */

export default async function HomePage() {
  const homepage = await getHomepage();

  return (
    <>
      <SiteJsonLd />

      {/* ===================================================
          HERO
      =================================================== */}

      {homepage.hero?.enabled &&
        homepage.hero.slides.length > 0 && (
          <HeroSection
            slides={homepage.hero.slides}
          />
        )}

      {/* ===================================================
          FEATURED CATEGORIES
          Source: Category API
      =================================================== */}

      <FeaturedCategories />

      {/* ===================================================
          NEW ARRIVALS
          Source: Product API
      =================================================== */}

      <NewArrivals />

      {/* ===================================================
          BRAND STORY
          Source: Homepage CMS
      =================================================== */}

      {homepage.brandStory?.enabled && (
        <BrandStory
          data={homepage.brandStory}
        />
      )}

      {/* ===================================================
          FEATURED COLLECTION CAMPAIGN
          Source: Marketing API
      =================================================== */}

      <FeaturedCollectionCampaign />

      {/* ===================================================
          BEST SELLERS
          Source: Product API
      =================================================== */}

      <BestSellers />

      {/* ===================================================
          PROMOTIONAL BANNER
          Source: Marketing API
      =================================================== */}

      <PromotionalBanner />

      {/* ===================================================
          WHY AYESHA
          Source: Homepage CMS
      =================================================== */}

      {homepage.whyChooseUs?.enabled && (
        <WhyChooseUs
          data={homepage.whyChooseUs}
        />
      )}

      {/* ===================================================
          TESTIMONIALS
          Source: Homepage CMS
      =================================================== */}

      {homepage.testimonials?.enabled &&
        homepage.testimonials.testimonials.length >
          0 && (
          <Testimonials
            data={homepage.testimonials}
          />
        )}

      {/* ===================================================
          INSTAGRAM
          Source: Homepage CMS
      =================================================== */}

      {homepage.instagram?.enabled &&
        homepage.instagram.posts.length > 0 && (
          <InstagramGallery
            data={homepage.instagram}
          />
        )}

      {/* ===================================================
          NEWSLETTER
          Source: Homepage CMS
      =================================================== */}

      {homepage.newsletter?.enabled && (
        <Newsletter
          data={homepage.newsletter}
        />
      )}
    </>
  );
}