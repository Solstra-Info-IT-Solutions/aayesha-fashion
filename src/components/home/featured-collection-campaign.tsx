import Image from "next/image";

import { getFeaturedCollectionCampaign } from "@/services/marketing.service";

import { Container } from "@/components/shared/container";
import { LinkButton } from "@/components/ui/button";

export async function FeaturedCollectionCampaign() {
  const campaign =
    await getFeaturedCollectionCampaign();

  /*
   * No active featured collection campaign:
   * Do not render an empty homepage section.
   */
  if (!campaign) {
    return null;
  }

  const data = campaign.metadata;

  return (
    <section
      id="featured-collection"
      className="relative overflow-hidden bg-[var(--color-charcoal)]"
    >
      {/* =====================================================
          CAMPAIGN IMAGE
      ===================================================== */}

      <div className="relative min-h-[620px] sm:min-h-[680px] lg:min-h-[760px] xl:min-h-[820px]">
        <Image
          src={data.image}
          alt={data.imageAlt}
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority={false}
        />

        {/* ===================================================
            IMAGE OVERLAY
        =================================================== */}

        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* ===================================================
            CONTENT
        =================================================== */}

        <Container className="relative z-10 h-full">
          <div className="flex min-h-[620px] flex-col justify-end pb-12 sm:min-h-[680px] sm:pb-14 lg:min-h-[760px] lg:pb-16 xl:min-h-[820px] xl:pb-20">
            <div className="max-w-[650px]">
              {/* EYEBROW */}

              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[var(--color-rose-light)]" />

                <p className="text-[8px] font-semibold uppercase tracking-[0.32em] text-white/75 sm:text-[9px]">
                  {data.eyebrow}
                </p>
              </div>

              {/* HEADING */}

              <h2
                className="
                  mt-5
                  font-display
                  text-[3.5rem]
                  font-medium
                  leading-[0.88]
                  tracking-[-0.045em]
                  text-white
                  sm:text-[4.5rem]
                  md:text-[5.3rem]
                  lg:text-[6rem]
                  xl:text-[6.6rem]
                "
              >
                {formatCampaignTitle(data.title)}
              </h2>

              {/* DESCRIPTION */}

              <p className="mt-6 max-w-[430px] text-sm leading-7 text-white/72 sm:text-[15px] sm:leading-8">
                {data.description}
              </p>

              {/* CTA */}

              <div className="mt-8">
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

        {/* ===================================================
            CAMPAIGN LABEL
        =================================================== */}

        <div className="absolute right-6 top-6 z-20 hidden sm:block lg:right-10 lg:top-10 xl:right-14">
          <div className="flex items-center gap-3">
            <span className="text-[8px] font-semibold uppercase tracking-[0.28em] text-white/45">
              {data.brandLabel}
            </span>

            <span className="h-px w-8 bg-white/25" />
          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM STRIP
      ===================================================== */}

      <div className="border-t border-white/10 bg-[var(--color-charcoal)]">
        <Container>
          <div className="flex min-h-20 items-center justify-between gap-6 py-5">
            <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-white/45">
              {data.bottomLabel}
            </p>

            <p className="font-display text-lg italic text-white/75">
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

/**
 * Keeps the existing visual treatment:
 *
 * "The Festive Collection."
 *        ↓
 * The Festive
 * Collection.
 *
 * The final word is rendered in italic rose.
 */
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