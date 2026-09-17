import Image from "next/image";

import { getFeaturedCollectionCampaign } from "@/services/marketing.service";

import { Container } from "@/components/shared/container";
import { LinkButton } from "@/components/ui/button";

export async function FeaturedCollectionCampaign() {
  const campaign =
    await getFeaturedCollectionCampaign();

  if (!campaign) {
    return null;
  }

  const data = campaign.metadata;

  return (
    <section
      id="featured-collection"
      className="relative overflow-hidden bg-[var(--color-charcoal)]"
    >
      {/* Campaign */}
      <div className="relative min-h-[500px] sm:min-h-[560px] lg:min-h-[650px] xl:min-h-[700px]">

        <Image
          src={data.image}
          alt={data.imageAlt}
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority={false}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

        {/* Content */}
        <Container className="relative z-10 h-full">
          <div className="flex min-h-[500px] flex-col justify-end pb-8 sm:min-h-[560px] sm:pb-10 lg:min-h-[650px] lg:pb-14 xl:min-h-[700px] xl:pb-16">

            <div className="max-w-[580px]">

              {/* Eyebrow */}
              <div className="flex items-center gap-3">
                <span className="h-px w-7 bg-[var(--color-rose-light)]" />

                <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-white/70 sm:text-[9px]">
                  {data.eyebrow}
                </p>
              </div>

              {/* Heading */}
              <h2
                className="
                  mt-4
                  max-w-[560px]
                  font-display
                  text-[3rem]
                  font-medium
                  leading-[0.92]
                  tracking-[-0.04em]
                  text-white
                  sm:mt-5
                  sm:text-[4rem]
                  md:text-[4.8rem]
                  lg:text-[5.5rem]
                  xl:text-[6rem]
                "
              >
                {formatCampaignTitle(data.title)}
              </h2>

              {/* Description */}
              <p className="mt-5 max-w-[420px] text-[13px] leading-6 text-white/70 sm:mt-6 sm:text-sm sm:leading-7">
                {data.description}
              </p>

              {/* CTA */}
              <div className="mt-6 sm:mt-7">
                <LinkButton
                  href={data.ctaHref}
                  variant="darkOutline"
                  size="lg"
                  icon={
                    <span
                      aria-hidden="true"
                      className="text-base"
                    >
                      ↗
                    </span>
                  }
                >
                  {data.ctaLabel}
                </LinkButton>
              </div>
            </div>
          </div>
        </Container>

        {/* Brand Label */}
        <div className="absolute right-5 top-5 z-20 hidden sm:block lg:right-8 lg:top-8">
          <div className="flex items-center gap-3">
            <span className="text-[8px] font-semibold uppercase tracking-[0.25em] text-white/40">
              {data.brandLabel}
            </span>

            <span className="h-px w-7 bg-white/20" />
          </div>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="border-t border-white/10 bg-[var(--color-charcoal)]">
        <Container>
          <div className="flex items-center justify-between gap-4 py-4 sm:py-5">
            <p className="text-[7px] font-semibold uppercase tracking-[0.25em] text-white/40 sm:text-[8px]">
              {data.bottomLabel}
            </p>

            <p className="text-right font-display text-base italic text-white/70 sm:text-lg">
              {data.bottomTitle}
            </p>
          </div>
        </Container>
      </div>
    </section>
  );
}

/* =========================================================
   TITLE FORMATTER
========================================================= */

function formatCampaignTitle(title: string) {
  const words = title.trim().split(/\s+/);

  if (words.length <= 1) {
    return (
      <span className="italic text-[var(--color-rose-light)]">
        {title}
      </span>
    );
  }

  const lastWord = words.pop();

  return (
    <>
      {words.join(" ")}

      <span className="block italic text-[var(--color-rose-light)]">
        {lastWord}
      </span>
    </>
  );
}