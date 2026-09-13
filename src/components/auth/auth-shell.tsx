"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { BrandLogo } from "@/components/layout/brand-logo";

/* =========================================================
   TYPES
========================================================= */

type AuthShellProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  footer?: ReactNode;
};

/* =========================================================
   COMPONENT
========================================================= */

export function AuthShell({
  children,
  title,
  subtitle,
  backHref = "/",
  backLabel = "Back to home",
  footer,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1.05fr)_minmax(460px,0.95fr)]">
        {/* =====================================================
            BRAND SIDE
        ===================================================== */}

        <section className="relative hidden min-h-screen overflow-hidden bg-[var(--color-text)] lg:flex">
          {/* Editorial background */}
          <div className="absolute inset-0 bg-[var(--color-text)]" />

          {/* Subtle texture / framing */}
          <div className="absolute inset-8 border border-white/10 xl:inset-10" />

          <div className="relative z-10 flex min-h-screen w-full flex-col justify-between px-12 py-12 xl:px-16 xl:py-14">
            {/* =================================================
                TOP
            ================================================= */}

            <div className="w-fit border border-white/10 bg-[var(--color-surface)] px-5 py-3">
              <BrandLogo />
            </div>

            {/* =================================================
                CENTER
            ================================================= */}

            <div className="max-w-xl py-16">
              <p className="eyebrow mb-5 text-[var(--color-accent-soft)]">
                AAYESHA FASHION
              </p>

              <h2 className="font-display text-5xl font-normal leading-[0.9] tracking-tight text-white xl:text-7xl">
                Elegance,
                <br />
                made personal.
              </h2>

              <div className="mt-7 h-px w-16 bg-[var(--color-accent)]" />

              <p className="mt-7 max-w-md text-sm leading-7 text-white/60">
                Discover timeless Indian fashion crafted for
                confidence, celebration, and everyday beauty.
              </p>
            </div>

            {/* =================================================
                BOTTOM
            ================================================= */}

            <div className="flex items-center justify-between gap-6">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/35">
                © {new Date().getFullYear()} Aayesha Fashion
              </p>

              <span className="hidden h-px flex-1 bg-white/10 sm:block" />
            </div>
          </div>
        </section>

        {/* =====================================================
            FORM SIDE
        ===================================================== */}

        <section className="flex min-h-screen flex-col bg-[var(--color-bg)]">
          {/* =================================================
              HEADER
          ================================================= */}

          <header className="flex items-center justify-between border-b border-[var(--color-border-light)] px-5 py-5 sm:px-8 sm:py-6 lg:border-b-0 lg:px-12 lg:py-8">
            <Link
              href={backHref}
              className="
                group
                inline-flex
                min-h-10
                items-center
                gap-2
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-[var(--color-text-secondary)]
                transition-colors
                duration-[var(--duration-base)]
                hover:text-[var(--color-text)]
              "
            >
              <ArrowLeft
                size={15}
                strokeWidth={1.6}
                className="
                  transition-transform
                  duration-[var(--duration-base)]
                  group-hover:-translate-x-0.5
                "
              />

              {backLabel}
            </Link>

            {/* Mobile logo */}
            <div className="lg:hidden">
              <BrandLogo />
            </div>
          </header>

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="mx-auto flex w-full max-w-[520px] flex-1 items-center px-5 pb-10 pt-8 sm:px-8 lg:px-12 lg:py-12">
            <div className="w-full">
              {/* =================================================
                  HEADING
              ================================================= */}

              <div className="mb-9">
                <p className="eyebrow mb-4 text-[var(--color-accent-dark)]">
                  AAYESHA FASHION
                </p>

                <h1 className="font-display text-[40px] font-normal leading-[0.94] tracking-tight text-[var(--color-text)] sm:text-[50px]">
                  {title}
                </h1>

                {subtitle ? (
                  <p className="mt-4 max-w-md text-[13px] leading-6 text-[var(--color-text-secondary)] sm:text-sm">
                    {subtitle}
                  </p>
                ) : null}
              </div>

              {/* =================================================
                  FORM
              ================================================= */}

              <div className="w-full">
                {children}
              </div>

              {/* =================================================
                  FOOTER
              ================================================= */}

              {footer ? (
                <div className="mt-8 border-t border-[var(--color-border-light)] pt-7">
                  {footer}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export type { AuthShellProps };