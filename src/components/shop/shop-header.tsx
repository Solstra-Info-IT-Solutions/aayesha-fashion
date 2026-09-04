import { Container } from "@/components/shared/container";

export function ShopHeader() {
  return (
    <section className="bg-[var(--color-ivory)]">
      <Container>
        <div className="py-14 sm:py-16 lg:py-20">
          <div className="text-center">
            <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-[var(--color-text-secondary)]">
              The Ayesha Collection
            </p>

            <h1
              className="
                mt-4
                font-display
                text-[3.5rem]
                font-medium
                leading-none
                tracking-[-0.045em]
                text-[var(--color-charcoal)]
                sm:text-[4.5rem]
                md:text-[5.3rem]
                lg:text-[6rem]
              "
            >
              Shop
              <span className="italic text-[var(--color-rose-dark)]">
                {" "}
                Ayesha.
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--color-text-secondary)] sm:text-[15px] sm:leading-8">
              Discover thoughtfully designed pieces,
              from timeless essentials to the latest seasonal
              arrivals.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}