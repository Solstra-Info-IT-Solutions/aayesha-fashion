import { AddressForm } from "@/components/account/address-form";
import { Suspense } from "react";

export default function EditAddressPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--color-ivory)]" />
      }
    >
      <AddressForm mode="edit" />
    </Suspense>
  );
}