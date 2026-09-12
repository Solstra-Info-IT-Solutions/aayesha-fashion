import { HeroSection } from "@/components/home/hero-section";
import { BrandPhilosophy } from "@/components/home/brand-philosophy";
import { FeaturedCollections } from "@/components/home/featured-collections";
import { SignatureEdit } from "@/components/home/signature-edit";
import { EditorialCampaign } from "@/components/home/editorial-campaign";
import { AyeshaExperience } from "@/components/home/ayesha-experience";
import { Newsletter } from "@/components/home/newsletter";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { NewArrivals } from "@/components/home/new-arrivals";
import { BrandStory } from "@/components/home/brand-story";
import { FeaturedCollectionCampaign } from "@/components/home/featured-collection-campaign";
import { BestSellers } from "@/components/home/best-sellers";
import { PromotionalBanner } from "@/components/home/promotional-banner";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { Testimonials } from "@/components/home/testimonials";
import { InstagramGallery } from "@/components/home/instagram-gallery";
import { SiteJsonLd } from "@/components/seo/site-json-ld";

export default function HomePage() {
  return (
    <>
      <SiteJsonLd />
      <HeroSection />
      <FeaturedCategories />
      <NewArrivals />
      <BrandStory />
      <FeaturedCollectionCampaign />
      <BestSellers />
      <PromotionalBanner />
      <WhyChooseUs />
      <Testimonials />
      <InstagramGallery />
      <Newsletter />
      {/*<BrandPhilosophy />
      <FeaturedCollections />
      <SignatureEdit />
      <EditorialCampaign />
      <AyeshaExperience />
      <Newsletter />*/}
    </>
  );
}