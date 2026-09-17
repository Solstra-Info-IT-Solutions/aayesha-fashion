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
        <div className="py-7 sm:py-9 lg:py-11">

          {/* INTRO */}
          <div className="mx-auto mt-7 max-w-3xl text-center sm:mt-9">
            <h2
              className="
                font-display
                text-[2.7rem]
                font-medium
                leading-[0.94]
                tracking-[-0.045em]
                text-[var(--color-charcoal)]
                sm:text-[3.6rem]
                md:text-[4.3rem]
                lg:text-[4.9rem]
                xl:text-[5.2rem]
              "
            >
              {data.title.lineOne}

              <span className="block italic text-[var(--color-rose-dark)]">
                {data.title.lineTwo}
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-[13px] leading-6 text-[var(--color-text-secondary)] sm:text-sm sm:leading-7">
              {data.description}
            </p>
          </div>

          {/* FORM */}
          <div className="mx-auto mt-7 max-w-3xl sm:mt-9">
            {submitted ? (
              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-3
                  border
                  border-[var(--color-border-dark)]
                  bg-[var(--color-ivory)]
                  px-5
                  py-5
                  text-center
                "
              >
                <span
                  className="
                    flex
                    h-8
                    w-8
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
                    size={15}
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
                className="flex flex-col gap-2.5 sm:flex-row"
              >
                {/* EMAIL */}
                <div
                  className="
                    flex
                    min-h-13
                    flex-1
                    items-center
                    border
                    border-[var(--color-border-dark)]
                    bg-[var(--color-ivory)]
                    px-4
                    transition-colors
                    duration-300
                    focus-within:border-[var(--color-charcoal)]
                    sm:min-h-14
                    sm:px-5
                  "
                >
                  <div className="w-full">
                    <label
                      htmlFor="newsletter-email"
                      className="
                        block
                        text-[7px]
                        font-semibold
                        uppercase
                        tracking-[0.22em]
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
                    min-h-13
                    items-center
                    justify-between
                    gap-6
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
                    sm:min-h-14
                    sm:min-w-[180px]
                    sm:px-6
                  "
                >
                  <span>
                    {data.buttonLabel}
                  </span>

                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.4}
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                  />
                </button>
              </form>
            )}

            {!submitted && (
              <p className="mt-3 text-center text-[8px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                {data.disclaimer}
              </p>
            )}
          </div>

          {/* BRAND SIGN-OFF */}
          <div className="mt-8 flex items-center justify-between sm:mt-10">
            <p className="text-[8px] font-semibold uppercase tracking-[0.26em] text-[var(--color-text-muted)]">
              Ayesha Fashion
            </p>

            <p className="font-display text-base italic text-[var(--color-charcoal)] sm:text-lg">
              Ayesha
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}