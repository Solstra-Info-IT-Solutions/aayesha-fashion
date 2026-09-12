import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your registered email address and we’ll help you securely regain access to your account."
      backHref="/login"
      backLabel="Back to sign in"
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}