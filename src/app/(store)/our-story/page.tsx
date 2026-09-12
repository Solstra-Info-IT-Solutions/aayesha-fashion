import type { Metadata } from "next";
import { ContentPage } from "@/components/content/content-page";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Discover the story behind Aayesha Fashion and our approach to elegant, contemporary Indian fashion.",
  alternates: {
    canonical: "/our-story",
  },
};

export default function OurStoryPage() {
  return (
    <ContentPage
      eyebrow="The House"
      title="Our Story"
      description="Aayesha Fashion is built around a simple belief: Indian fashion can feel deeply rooted and distinctly modern at the same time."
      highlights={[
        {
          label: "Our perspective",
          value: "Modern Indian elegance",
        },
        {
          label: "Our design language",
          value: "Graceful, refined and wearable",
        },
        {
          label: "Our promise",
          value: "Thoughtful fashion without unnecessary excess",
        },
      ]}
      sections={[
        {
          title: "Where tradition meets modern life",
          paragraphs: [
            "The way we dress is constantly changing. Occasion wardrobes have become more versatile, everyday dressing has become more expressive, and Indian silhouettes continue to evolve across generations.",
            "Aayesha Fashion exists within that movement. We look to the richness of Indian clothing while approaching proportion, colour, styling and versatility through a modern lens.",
          ],
        },
        {
          title: "Designed around the woman wearing it",
          paragraphs: [
            "A beautiful garment should do more than look good in an image. It should feel comfortable when you move, natural when you style it and appropriate to the moment you are stepping into.",
            "That is why our collections are approached as wardrobes rather than isolated pieces. Festive dressing, everyday ethnic wear and contemporary silhouettes are brought together with an emphasis on confidence, ease and repeat wear.",
          ],
        },
        {
          title: "A quieter kind of luxury",
          paragraphs: [
            "We believe luxury is often found in restraint. A considered neckline, a balanced silhouette, a fabric that falls naturally, or a detail that becomes visible only when you look closer can have more impact than excess.",
            "Our visual language follows the same philosophy. Clean composition, warm neutrals, soft rose accents and editorial imagery create an environment where the clothing remains the focus.",
          ],
        },
        {
          title: "Building a wardrobe with meaning",
          paragraphs: [
            "Fashion becomes personal when a piece starts carrying memories. A first celebration, a family gathering, a festival, a dinner, a new beginning — clothing becomes part of the moments we remember.",
            "Aayesha Fashion aims to create pieces worthy of that role: beautiful enough to feel special, wearable enough to return to, and considered enough to remain relevant beyond a single season.",
          ],
        },
      ]}
    />
  );
}