import type {
  ReactNode,
} from "react";

import { Suspense } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-ivory)]">
      <Suspense
        fallback={
          <div className="min-h-screen bg-[var(--color-ivory)]" />
        }
      >
        {children}
      </Suspense>
    </div>
  );
}