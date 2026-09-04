import Image from "next/image";

import { Container } from "@/components/shared/container";
import { LinkButton } from "@/components/ui/button";

export function PromotionalBanner() {
  return (
    <section
      id="promotion"
      className="relative overflow-hidden bg-[var(--color-cream)]"
    >
      <div className="relative">
        <Image
          src="/images/home/promotional-banner.jpg"
          alt="Ayesha Fashion promotional campaign"
          width={1920}
          height={900}
          sizes="100vw"
          className="h-auto w-full object-cover"
        />

        {/* Overlay for readability */}

        <div className="absolute inset-0 bg-black/[0.03]" />

        {/* Optional live content layer */}

        {/*<Container className="pointer-events-none absolute inset-0">
          <div className="flex h-full items-end pb-8 sm:pb-10 lg:pb-14">
            <LinkButton
              href="/shop"
              variant="secondary"
              size="md"
              icon={
                <span aria-hidden="true">
                  ↗
                </span>
              }
              className="pointer-events-auto bg-[var(--color-ivory)]/95"
            >
              Shop Now
            </LinkButton>
          </div>
        </Container>*/}
      </div>
    </section>
  );
}