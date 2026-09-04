import { Container } from "@/components/shared/container";
import { ayeshaStandards } from "@/data/home";

export function AyeshaStandard() {
  return (
    <section className="bg-[var(--color-ivory)]">
      <Container>
        <div className="py-24 sm:py-28 lg:py-32 xl:py-40">
          {/* =====================================================
              HEADER
          ====================================================== */}

          <div className="border-t border-[var(--color-border)] pt-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="h-px w-9 bg-[var(--color-rose-dark)]" />

                <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[var(--color-text-muted)] sm:text-[9px]">
                  The Aayesha Standard
                </p>
              </div>

              <span className="font-display text-lg text-[var(--color-text-muted)]">
                05
              </span>
            </div>
          </div>

          {/* =====================================================
              INTRO
          ====================================================== */}

          <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <h2 className="max-w-4xl font-display text-[3.6rem] font-medium leading-[0.92] tracking-[-0.04em] text-[var(--color-charcoal)] sm:text-6xl md:text-7xl lg:text-[5.8rem] xl:text-[6.8rem]">
                Thoughtfully considered,
                <span className="block pl-[7%]">
                  from first impression
                </span>
                <span className="block pl-[14%] italic text-[var(--color-rose-dark)]">
                  to the final detail.
                </span>
              </h2>
            </div>

            <div className="flex items-end lg:col-span-4 lg:col-start-9">
              <p className="max-w-sm border-l border-[var(--color-border)] pl-6 text-sm leading-7 text-[var(--color-text-secondary)]">
                Every element of Ayesha Fashion is approached with
                intention — from the silhouette and finish of each piece
                to the experience surrounding it.
              </p>
            </div>
          </div>

          {/* =====================================================
              STANDARDS LIST
          ====================================================== */}

          <div className="mt-20 border-t border-[var(--color-border)] lg:mt-28">
            {ayeshaStandards.map((standard) => (
              <div
                key={standard.number}
                className="
                  grid
                  gap-5
                  border-b
                  border-[var(--color-border)]
                  py-7

                  sm:grid-cols-[70px_1fr_auto]
                  sm:items-start
                  sm:gap-8

                  lg:grid-cols-[80px_minmax(280px,420px)_1fr]
                  lg:gap-12

                  xl:py-9
                "
              >
                {/* NUMBER */}

                <span className="font-display text-xl text-[var(--color-text-muted)]">
                  {standard.number}
                </span>

                {/* TITLE */}

                <h3 className="font-display text-2xl leading-tight tracking-[-0.02em] text-[var(--color-charcoal)] sm:text-3xl">
                  {standard.title}
                </h3>

                {/* DESCRIPTION */}

                <p className="max-w-md text-sm leading-7 text-[var(--color-text-secondary)] lg:justify-self-end">
                  {standard.description}
                </p>
              </div>
            ))}
          </div>

          {/* =====================================================
              SIGNATURE LINE
          ====================================================== */}

          <div className="mt-16 flex items-center justify-between sm:mt-20">
            <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
              Refined · Feminine · Considered
            </p>

            <p className="font-display text-xl text-[var(--color-charcoal)]">
              Aayesha
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}