import { AuthShell } from "@/components/auth/auth-shell";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyEmailPage() {
  return (
    <AuthShell
      title="Verify your email"
      subtitle="A quick verification helps us keep your Aayesha Fashion account secure."
      backHref="/register"
      backLabel="Back to register"
    >
      <VerifyEmailForm />
    </AuthShell>
  );
}