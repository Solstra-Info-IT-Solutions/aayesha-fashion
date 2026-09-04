import { HeroSection } from "@/components/home/hero-section";
import { BrandPhilosophy } from "@/components/home/brand-philosophy";
import { FeaturedCollections } from "@/components/home/featured-collections";
import { SignatureEdit } from "@/components/home/signature-edit";
import { EditorialCampaign } from "@/components/home/editorial-campaign";
import { AyeshaExperience } from "@/components/home/ayesha-experience";
import { Newsletter } from "@/components/home/newsletter";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandPhilosophy />
      <FeaturedCollections />
      <SignatureEdit />
      <EditorialCampaign />
      <AyeshaExperience />
      <Newsletter />
    </>
  );
}