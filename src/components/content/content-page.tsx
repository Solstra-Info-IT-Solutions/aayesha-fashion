import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

type ContentSection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
};

type ContentHighlight = {
  label: string;
  value: string;
};

type ContentPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  updatedAt?: string;
  sections: ContentSection[];
  highlights?: ContentHighlight[];
  backHref?: string;
  backLabel?: string;
};

export function ContentPage({
  eyebrow,
  title,
  description,
  updatedAt,
  sections,
  highlights = [],
  backHref = "/",
  backLabel = "Back to home",
}: ContentPageProps) {
  return (
    <main className="min-h-screen bg-[var(--color-ivory)]">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-ivory)]">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-7 lg:px-8">
          <div className="relative py-14 sm:py-16 lg:py-20">
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -right-12
                -top-14
                h-48
                w-48
                rounded-full
                border
                border-[var(--color-rose)]/30
                sm:h-64
                sm:w-64
                lg:h-80
                lg:w-80
              "
            />

            <Link
              href={backHref}
              className="
                relative
                inline-flex
                items-center
                gap-2
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-[var(--color-secondary)]
                transition-colors
                hover:text-[var(--color-charcoal)]
              "
            >
              <ArrowLeft
                size={14}
                strokeWidth={1.35}
              />

              {backLabel}
            </Link>

            <div className="relative mt-12 max-w-4xl">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[var(--color-rose-dark)]" />

                <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--color-rose-dark)]">
                  {eyebrow}
                </p>
              </div>

              <h1
                className="
                  mt-5
                  font-[var(--font-display)]
                  text-[3rem]
                  font-medium
                  leading-[0.92]
                  tracking-[-0.035em]
                  text-[var(--color-charcoal)]
                  sm:text-[4rem]
                  lg:text-[5.15rem]
                "
              >
                {title}
              </h1>

              <p
                className="
                  mt-7
                  max-w-3xl
                  text-sm
                  leading-7
                  text-[var(--color-text-secondary)]
                  sm:text-[15px]
                  sm:leading-8
                "
              >
                {description}
              </p>

              {updatedAt && (
                <div className="mt-7 flex items-center gap-3">
                  <span className="h-px w-6 bg-[var(--color-border)]" />

                  <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[var(--color-muted)]">
                    Last updated {updatedAt}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          HIGHLIGHTS
      ===================================================== */}

      {highlights.length > 0 && (
        <section className="border-b border-[var(--color-border)] bg-white">
          <div className="mx-auto max-w-[1180px] px-5 sm:px-7 lg:px-8">
            <div className="grid divide-y divide-[var(--color-border)] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
              {highlights.map(
                (highlight) => (
                  <div
                    key={highlight.label}
                    className="
                      px-0
                      py-6
                      sm:px-7
                      sm:py-7
                      first:sm:pl-0
                      last:sm:pr-0
                    "
                  >
                    <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                      {highlight.label}
                    </p>

                    <p className="mt-2 text-sm font-medium leading-6 text-[var(--color-charcoal)]">
                      {highlight.value}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="bg-white">
        <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-7 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-20">
            {/* SIDE INTRO */}

            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                  Aayesha Fashion
                </p>

                <div className="mt-4 h-px w-12 bg-[var(--color-rose)]" />

                <p className="mt-5 max-w-[180px] text-xs leading-6 text-[var(--color-secondary)]">
                  Thoughtful fashion, considered service and a shopping experience designed around clarity.
                </p>
              </div>
            </aside>

            {/* SECTIONS */}

            <div className="max-w-3xl">
              {sections.map(
                (section, index) => (
                  <article
                    key={`${section.title}-${index}`}
                    className={
                      index === 0
                        ? ""
                        : "mt-14 border-t border-[var(--color-border)] pt-11 sm:mt-16 sm:pt-12"
                    }
                  >
                    <div className="flex items-start gap-4">
                      <span className="mt-3 h-px w-6 shrink-0 bg-[var(--color-rose)]" />

                      <h2
                        className="
                          font-[var(--font-display)]
                          text-2xl
                          font-medium
                          leading-tight
                          tracking-[-0.015em]
                          text-[var(--color-charcoal)]
                          sm:text-3xl
                        "
                      >
                        {section.title}
                      </h2>
                    </div>

                    {section.paragraphs?.map(
                      (
                        paragraph,
                        paragraphIndex,
                      ) => (
                        <p
                          key={
                            paragraphIndex
                          }
                          className="
                            mt-5
                            text-sm
                            leading-7
                            text-[var(--color-text-secondary)]
                            sm:text-[15px]
                            sm:leading-8
                          "
                        >
                          {paragraph}
                        </p>
                      ),
                    )}

                    {section.items &&
                      section.items.length > 0 && (
                        <div className="mt-6 space-y-3">
                          {section.items.map(
                            (
                              item,
                              itemIndex,
                            ) => (
                              <div
                                key={
                                  itemIndex
                                }
                                className="
                                  border
                                  border-[var(--color-border)]
                                  bg-[var(--color-ivory)]
                                  px-5
                                  py-4
                                "
                              >
                                <div className="flex items-start gap-3">
                                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-rose-dark)]" />

                                  <p className="text-sm leading-7 text-[var(--color-text-secondary)]">
                                    {item}
                                  </p>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                  </article>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="border-t border-[var(--color-border)] bg-[var(--color-cream)]">
        <div className="mx-auto max-w-[1180px] px-5 py-11 sm:px-7 sm:py-13 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--color-rose-dark)]">
                Continue exploring
              </p>

              <p className="mt-2 font-[var(--font-display)] text-2xl text-[var(--color-charcoal)]">
                Discover the Aayesha Fashion edit.
              </p>
            </div>

            <Link
              href="/shop"
              className="
                group
                inline-flex
                items-center
                gap-3
                border
                border-[var(--color-charcoal)]
                bg-[var(--color-charcoal)]
                px-5
                py-3.5
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-white
                transition-opacity
                hover:opacity-90
              "
            >
              Explore collection

              <ArrowRight
                size={14}
                strokeWidth={1.35}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}