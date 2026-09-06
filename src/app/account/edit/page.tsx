import { Suspense } from "react";

import { EditAccountForm } from "@/components/account/edit-account-form";

export default function EditAccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--color-ivory)]" />
      }
    >
      <EditAccountForm />
    </Suspense>
  );
}