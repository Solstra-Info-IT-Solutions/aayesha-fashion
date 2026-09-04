import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { Container } from "@/components/shared/container";
import { ayeshaExperience } from "@/data/home";

export function AyeshaExperience() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-ivory)]">
      {/* =========================================================
          MAIN EXPERIENCE
      ========================================================== */}

      <div className="grid lg:grid-cols-2">
        {/* =======================================================
            LEFT — EDITORIAL IMAGE
        ======================================================== */}

        <div className="relative min-h-[620px] overflow-hidden bg-[var(--color-warm-gray)] sm:min-h-[700px] lg:min-h-[760px] xl:min-h-[820px]">
          <Image
            src={ayeshaExperience.image.src}
            alt={ayeshaExperience.image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center transition-transform duration-1000 hover:scale-[1.015]"
          />

          {/* Subtle editorial overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

          {/* Image caption */}
          <div className="absolute bottom-7 left-7 max-w-[190px] sm:bottom-9 sm:left-9">
            <p className="text-[8px] font-semibold uppercase leading-[1.8] tracking-[0.28em] text-white/80">
              {ayeshaExperience.imageCaption}
            </p>
          </div>
        </div>

        {/* =======================================================
            RIGHT — EXPERIENCE CONTENT
        ======================================================== */}

        <div className="bg-[var(--color-ivory)]">
          <Container className="h-full !px-6 sm:!px-8 lg:!px-12 xl:!px-16">
            <div className="flex h-full min-h-[620px] flex-col py-10 sm:min-h-[700px] sm:py-12 lg:min-h-[760px] lg:py-14 xl:min-h-[820px] xl:py-16">
              {/* TOP LABEL */}
              <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-5">
                <div className="flex items-center gap-4">
                  <span className="h-px w-9 bg-[var(--color-rose-dark)]" />

                  <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[var(--color-text-secondary)] sm:text-[9px]">
                    {ayeshaExperience.eyebrow}
                  </p>
                </div>

                <span className="font-display text-lg text-[var(--color-text-muted)]">
                  05
                </span>
              </div>

              {/* INTRO */}
              <div className="mt-12 sm:mt-14 lg:mt-16">
                <h2 className="max-w-2xl font-display text-[3.4rem] font-medium leading-[0.91] tracking-[-0.04em] text-[var(--color-charcoal)] sm:text-[4.5rem] md:text-[5.2rem] xl:text-[5.8rem]">
                  {ayeshaExperience.title.lineOne}

                  <span className="block">
                    {ayeshaExperience.title.lineTwo}
                  </span>

                  <span className="block italic text-[var(--color-rose-dark)]">
                    {ayeshaExperience.title.emphasis}
                  </span>
                </h2>

                <p className="mt-7 max-w-lg text-sm leading-7 text-[var(--color-text-secondary)] sm:mt-8">
                  {ayeshaExperience.description}
                </p>
              </div>

              {/* STANDARDS */}
              <div className="mt-10 border-t border-[var(--color-border)] sm:mt-12">
                <div className="grid sm:grid-cols-2">
                  {ayeshaExperience.standards.map((item, index) => (
                    <div
                      key={item.number}
                      className={`py-6 sm:py-7 ${
                        index % 2 === 0
                          ? "sm:border-r sm:border-[var(--color-border)] sm:pr-7"
                          : "sm:pl-7"
                      } ${
                        index > 1
                          ? "border-t border-[var(--color-border)]"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <span className="font-display text-xl leading-none text-[var(--color-text-muted)]">
                          {item.number}
                        </span>

                        <div>
                          <h3 className="font-display text-2xl leading-none tracking-[-0.02em] text-[var(--color-charcoal)]">
                            {item.title}
                          </h3>

                          <p className="mt-3 max-w-[240px] text-xs leading-6 text-[var(--color-text-secondary)]">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* BOTTOM CTA */}
              <div className="mt-auto flex flex-col gap-8 border-t border-[var(--color-border)] pt-7 sm:flex-row sm:items-end sm:justify-between">
                <Link
                  href={ayeshaExperience.action.href}
                  className="group inline-flex w-fit items-center gap-4 text-[9px] font-semibold uppercase tracking-[0.24em] text-[var(--color-charcoal)] transition-colors duration-300 hover:text-[var(--color-rose-dark)]"
                >
                  {ayeshaExperience.action.label}

                  <span className="flex h-9 w-9 items-center justify-center border border-[var(--color-charcoal)] transition-all duration-300 group-hover:border-[var(--color-rose-dark)] group-hover:bg-[var(--color-rose-dark)] group-hover:text-white">
                    <ArrowRight
                      size={15}
                      strokeWidth={1.3}
                    />
                  </span>
                </Link>

                <p className="max-w-[180px] text-[8px] font-semibold uppercase leading-[1.8] tracking-[0.25em] text-[var(--color-text-muted)] sm:text-right">
                  {ayeshaExperience.footerLabel}
                </p>
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* =========================================================
          BOTTOM BRAND SIGNATURE
      ========================================================== */}

      <div className="border-t border-[var(--color-border)] bg-[var(--color-cream)]">
        <Container>
          <div className="flex min-h-24 items-center justify-between gap-6 py-6 sm:min-h-28">
            <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
              Refined · Feminine · Considered
            </p>

            <p className="font-display text-2xl text-[var(--color-charcoal)]">
              Aayesha
            </p>
          </div>
        </Container>
      </div>
    </section>
  );
}