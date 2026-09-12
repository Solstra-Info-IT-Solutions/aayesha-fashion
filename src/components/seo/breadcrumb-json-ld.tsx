import { siteConfig } from "@/config/site";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({
  items,
}: BreadcrumbJsonLdProps) {
  const itemListElement = items.map(
    (item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(
        item.url,
        siteConfig.url,
      ).toString(),
    }),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  );
}