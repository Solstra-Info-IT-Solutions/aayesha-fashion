import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Create a new password"
      subtitle="Choose a strong password to secure your Aayesha Fashion account."
      backHref="/login"
      backLabel="Back to sign in"
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}