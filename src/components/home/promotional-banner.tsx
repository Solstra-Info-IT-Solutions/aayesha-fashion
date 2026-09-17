import Image from "next/image";

import {
  getPromotionalBanner,
} from "@/services/marketing.service";

import { Container } from "@/components/shared/container";
import { LinkButton } from "@/components/ui/button";

export async function PromotionalBanner() {
  const campaign =
    await getPromotionalBanner();

  if (!campaign) {
    return null;
  }

  const data = campaign.metadata;

  return (
    <section
      id="promotion"
      className="relative overflow-hidden bg-[var(--color-cream)]"
    >
      <div className="relative">

        <Image
          src={data.image}
          alt={data.imageAlt}
          width={1920}
          height={900}
          sizes="100vw"
          className="h-auto w-full object-cover"
          priority={false}
        />

        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-black/[0.02]" />

        {/* CTA */}
        {data.href && data.ctaLabel && (
          <Container className="pointer-events-none absolute inset-0">
            <div className="flex h-full items-end pb-5 sm:pb-6 lg:pb-8">
              <LinkButton
                href={data.href}
                variant="secondary"
                size="md"
                icon={
                  <span aria-hidden="true">
                    ↗
                  </span>
                }
                className="
                  pointer-events-auto
                  bg-[var(--color-ivory)]/95
                  backdrop-blur-sm
                "
              >
                {data.ctaLabel}
              </LinkButton>
            </div>
          </Container>
        )}
      </div>
    </section>
  );
}