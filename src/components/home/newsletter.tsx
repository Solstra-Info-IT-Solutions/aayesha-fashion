"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";

import { Container } from "@/components/shared/container";
import type { HomepageNewsletter } from "@/types/homepage";

interface NewsletterProps {
  data: HomepageNewsletter;
}

export function Newsletter({
  data,
}: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] =
    useState(false);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
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
      className="bg-[var(--color-cream)] text-[var(--color-charcoal)]"
    >
      <Container>
        <div className="py-16 sm:py-20 lg:py-24 xl:py-28">
          {/* =====================================================
              TOP LINE
          ===================================================== */}

          <div className="border-t border-[var(--color-border-dark)] pt-5 sm:pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="h-px w-9 bg-[var(--color-rose-dark)]" />

                <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[var(--color-text-secondary)] sm:text-[9px]">
                  {data.eyebrow}
                </p>
              </div>

              <span className="font-display text-lg text-[var(--color-text-muted)] sm:text-xl">
                13
              </span>
            </div>
          </div>

          {/* =====================================================
              INTRO
          ===================================================== */}

          <div className="mx-auto mt-10 max-w-3xl text-center sm:mt-12">
            <h2
              className="
                font-display
                text-[3rem]
                font-medium
                leading-[0.9]
                tracking-[-0.045em]
                text-[var(--color-charcoal)]
                sm:text-[4rem]
                md:text-[4.8rem]
                lg:text-[5.4rem]
              "
            >
              {data.title.lineOne}

              <span className="block italic text-[var(--color-rose-dark)]">
                {data.title.lineTwo}
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[var(--color-text-secondary)] sm:text-[15px] sm:leading-8">
              {data.description}
            </p>
          </div>

          {/* =====================================================
              FORM
          ===================================================== */}

          <div className="mx-auto mt-10 max-w-3xl sm:mt-12">
            {submitted ? (
              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-4
                  border
                  border-[var(--color-border-dark)]
                  bg-[var(--color-ivory)]
                  px-6
                  py-6
                  text-center
                "
              >
                <span
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    border
                    border-[var(--color-rose)]
                    bg-[var(--color-rose-light)]
                    text-[var(--color-charcoal)]
                  "
                >
                  <Check
                    size={16}
                    strokeWidth={1.5}
                  />
                </span>

                <div>
                  <p className="text-sm font-semibold text-[var(--color-charcoal)]">
                    Welcome to the Private Edit.
                  </p>

                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    You&apos;re now part of Ayesha Fashion.
                  </p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 sm:flex-row"
              >
                {/* EMAIL */}

                <div className="flex min-h-14 flex-1 items-center border border-[var(--color-border-dark)] bg-[var(--color-ivory)] px-5 transition-colors duration-300 focus-within:border-[var(--color-charcoal)] sm:min-h-16">
                  <div className="w-full">
                    <label
                      htmlFor="newsletter-email"
                      className="
                        block
                        text-[7px]
                        font-semibold
                        uppercase
                        tracking-[0.24em]
                        text-[var(--color-text-muted)]
                      "
                    >
                      Email Address
                    </label>

                    <input
                      id="newsletter-email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(
                          event.target.value
                        )
                      }
                      placeholder={
                        data.inputPlaceholder
                      }
                      autoComplete="email"
                      required
                      className="
                        mt-1
                        w-full
                        border-none
                        bg-transparent
                        p-0
                        text-sm
                        text-[var(--color-charcoal)]
                        outline-none
                        placeholder:text-[var(--color-text-muted)]
                        sm:text-[15px]
                      "
                    />
                  </div>
                </div>

                {/* BUTTON */}

                <button
                  type="submit"
                  className="
                    group
                    flex
                    min-h-14
                    items-center
                    justify-between
                    gap-8
                    border
                    border-[var(--color-charcoal)]
                    bg-[var(--color-charcoal)]
                    px-5
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-white
                    transition-all
                    duration-300
                    hover:border-[var(--color-rose-dark)]
                    hover:bg-[var(--color-rose-dark)]
                    sm:min-h-16
                    sm:min-w-[190px]
                    sm:px-6
                  "
                >
                  <span>
                    {data.buttonLabel}
                  </span>

                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.4}
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                  />
                </button>
              </form>
            )}

            {!submitted && (
              <p className="mt-4 text-center text-[8px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                {data.disclaimer}
              </p>
            )}
          </div>

          {/* =====================================================
              BRAND SIGN-OFF
          ===================================================== */}

          <div className="mt-12 flex items-center justify-between border-t border-[var(--color-border-dark)] pt-5 sm:mt-14">
            <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
              Ayesha Fashion
            </p>

            <p className="font-display text-lg italic text-[var(--color-charcoal)]">
              Ayesha
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}