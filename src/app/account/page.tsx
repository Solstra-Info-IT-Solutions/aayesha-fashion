import Link from "next/link";

export default function AccountPage() {
  return (
    <main className="bg-[var(--color-ivory)]">
      <section className="mx-auto flex min-h-[65vh] max-w-3xl items-center justify-center px-4 py-20 sm:px-6">
        <div className="w-full border border-[var(--color-border)] bg-white p-7 text-center sm:p-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            Ayesha Account
          </p>

          <h1 className="mt-3 font-[var(--font-cormorant)] text-4xl sm:text-5xl">
            Your account.
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[var(--color-text-secondary)]">
            Sign-in, orders, saved addresses and your
            personal Ayesha wishlist will live here.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex min-h-11 items-center justify-center bg-[var(--color-charcoal)] px-6 text-[10px] font-semibold uppercase tracking-[0.15em] text-white"
            >
              Sign In
            </Link>

            <Link
              href="/shop"
              className="inline-flex min-h-11 items-center justify-center border border-[var(--color-charcoal)] px-6 text-[10px] font-semibold uppercase tracking-[0.15em]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}