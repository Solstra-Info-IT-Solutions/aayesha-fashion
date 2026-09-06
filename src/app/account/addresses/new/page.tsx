import { AddressForm } from "@/components/account/address-form";

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