import { AddressForm } from "@/components/account/address-form";
import { Suspense } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  robots: {
    index: false,
    follow: false,
  },
};

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