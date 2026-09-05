import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

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