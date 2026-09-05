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
      <LoginForm />
    </AuthShell>
  );
}