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

export default function NewAddressPage() {
  // return <AddressForm mode="create" />;
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--color-ivory)]" />
      }
    >
      <AddressForm mode="create" />
    </Suspense>
  );
}