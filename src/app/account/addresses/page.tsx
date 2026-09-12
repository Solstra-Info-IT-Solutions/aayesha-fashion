import { SavedAddresses } from "@/components/account/saved-addresses";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SavedAddressesPage() {
  return <SavedAddresses />;
}