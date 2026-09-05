"use client";

import type {
  ReactNode,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
} from "lucide-react";

import {
  BrandLogo,
} from "@/components/layout/brand-logo";

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
    <main className="min-h-screen bg-[var(--color-ivory)] text-[var(--color-charcoal)]">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1.05fr)_minmax(460px,0.95fr)]">
        {/* =====================================================
            BRAND SIDE
        ===================================================== */}

        <section className="relative hidden overflow-hidden bg-[var(--color-charcoal)] lg:flex">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#171717_0%,#292c2c_100%)]" />

          <div className="relative z-10 flex min-h-screen w-full flex-col justify-between px-12 py-12 xl:px-16 xl:py-14">
            {/* TOP */}

            <div className="w-fit rounded-sm bg-[var(--color-ivory)] px-5 py-3">
              <BrandLogo />
            </div>

            {/* CENTER */}

            <div className="max-w-xl py-16">
              <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--color-rose)]">
                AAYESHA FASHION
              </p>

              <h2 className="font-display text-5xl leading-[0.95] text-[var(--color-ivory)] xl:text-6xl">
                Elegance,
                <br />
                made personal.
              </h2>

              <p className="mt-7 max-w-md text-sm leading-7 text-white/65">
                Discover timeless Indian fashion
                crafted for confidence, celebration,
                and everyday beauty.
              </p>
            </div>

            {/* BOTTOM */}

            <p className="text-xs tracking-wide text-white/40">
              © {new Date().getFullYear()} Aayesha
              Fashion
            </p>
          </div>
        </section>

        {/* =====================================================
            FORM SIDE
        ===================================================== */}

        <section className="flex min-h-screen flex-col">
          {/* HEADER */}

          <div className="flex items-center justify-between px-5 py-5 sm:px-8 sm:py-7 lg:px-12">
            <Link
              href={backHref}
              className="inline-flex min-h-10 items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--color-secondary)] transition-colors duration-200 hover:text-[var(--color-charcoal)]"
            >
              <ArrowLeft
                size={15}
                strokeWidth={1.7}
              />

              {backLabel}
            </Link>

            {/* Mobile logo */}

            <div className="lg:hidden">
              <BrandLogo />
            </div>
          </div>

          {/* CONTENT */}

          <div className="mx-auto flex w-full max-w-[520px] flex-1 items-center px-5 pb-10 pt-3 sm:px-8 lg:px-12 lg:py-10">
            <div className="w-full">
              {/* HEADING */}

              <div className="mb-8">
                <h1 className="font-display text-[38px] leading-[0.98] text-[var(--color-charcoal)] sm:text-[46px]">
                  {title}
                </h1>

                {subtitle ? (
                  <p className="mt-4 max-w-md text-[13px] leading-6 text-[var(--color-secondary)] sm:text-sm">
                    {subtitle}
                  </p>
                ) : null}
              </div>

              {/* FORM */}

              {children}

              {/* FOOTER */}

              {footer ? (
                <div className="mt-8">
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

export type {
  AuthShellProps,
};