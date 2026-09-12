import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Join Aayesha Fashion and discover timeless styles curated for every occasion."
      backHref="/"
      backLabel="Back to home"
    >
      <RegisterForm />
    </AuthShell>
  );
}