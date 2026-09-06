import { Suspense } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue your Aayesha Fashion journey and manage your orders, wishlist, and account."
      backHref="/"
      backLabel="Back to home"
    >
      <Suspense
        fallback={
          <div className="w-full">
            <div className="h-12 w-full animate-pulse bg-[var(--color-cream)]" />
            <div className="mt-4 h-12 w-full animate-pulse bg-[var(--color-cream)]" />
            <div className="mt-6 h-12 w-full animate-pulse bg-[var(--color-charcoal)]/10" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}