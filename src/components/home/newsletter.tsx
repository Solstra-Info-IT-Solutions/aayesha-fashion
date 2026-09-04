"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";

import { Container } from "@/components/shared/container";
import { newsletter } from "@/data/home";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return;
    }

    setSubmitted(true);
    setEmail("");
  }

  return (
    <section
      id="newsletter"
      className="bg-[var(--color-charcoal)] text-white"
    >
      <Container>
        <div className="py-14 sm:py-16 lg:py-20">
          {/* TOP LABEL */}
          <div className="flex items-center justify-between border-t border-white/15 pt-5">
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-[var(--color-rose)]" />

              <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-white/55 sm:text-[9px]">
                {newsletter.eyebrow}
              </p>
            </div>

            <span className="font-display text-base text-white/35 sm:text-lg">
              09
            </span>
          </div>

          {/* HEADER */}
          <div className="mt-10 max-w-2xl">
            <h2 className="font-display text-[2.9rem] font-medium leading-[0.92] tracking-[-0.04em] text-white sm:text-[3.8rem] md:text-[4.5rem] lg:text-[5rem]">
              {newsletter.title.lineOne}

              <span className="block italic text-[var(--color-rose-light)]">
                {newsletter.title.lineTwo}
              </span>
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-6 text-white/55 sm:text-[15px] sm:leading-7">
              {newsletter.description}
            </p>
          </div>

          {/* FORM AREA */}
          <div className="mt-10 max-w-4xl sm:mt-12">
            {submitted ? (
              <div className="flex items-center gap-4 border border-white/20 bg-white/[0.03] px-5 py-4 sm:px-6 sm:py-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-rose)] text-[var(--color-charcoal)]">
                  <Check size={15} strokeWidth={2} />
                </span>

                <div>
                  <p className="font-display text-xl text-white sm:text-2xl">
                    Welcome to the Private Edit.
                  </p>

                  <p className="mt-1 text-xs text-white/45">
                    You&apos;re now part of Ayesha Fashion.
                  </p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
              >
                {/* INPUT */}
                <div className="flex min-h-14 flex-1 items-center border border-white/20 bg-white/[0.025] px-5 transition-colors duration-300 focus-within:border-white/45 sm:min-h-16 sm:px-6">
                  <div className="w-full">
                    <label
                      htmlFor="newsletter-email"
                      className="mb-1.5 block text-[7px] font-semibold uppercase tracking-[0.22em] text-white/35 sm:text-[8px]"
                    >
                      Email Address
                    </label>

                    <input
                      id="newsletter-email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder={newsletter.placeholder}
                      autoComplete="email"
                      required
                      className="w-full border-none bg-transparent p-0 text-sm text-white outline-none placeholder:text-white/25 sm:text-[15px]"
                    />
                  </div>
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="group flex min-h-14 items-center justify-between gap-8 border border-[var(--color-rose)] bg-[var(--color-rose)] px-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-charcoal)] transition-all duration-300 hover:bg-[var(--color-rose-dark)] sm:min-h-16 sm:min-w-[190px] sm:px-6"
                >
                  <span>
                    {newsletter.buttonLabel}
                  </span>

                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.4}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </button>
              </form>
            )}

            {/* NOTE */}
            {!submitted && (
              <p className="mt-3 max-w-xl text-[7px] leading-5 text-white/25 sm:text-[8px]">
                {newsletter.note}
              </p>
            )}
          </div>

          {/* BOTTOM BRAND */}
          <div className="mt-12 flex items-center justify-between border-t border-white/15 pt-5 sm:mt-14">
            <p className="text-[8px] font-semibold uppercase tracking-[0.26em] text-white/30">
              Ayesha Fashion
            </p>

            <p className="font-display text-lg text-white/55">
              Ayesha
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}