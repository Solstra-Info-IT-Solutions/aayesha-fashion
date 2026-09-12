import { EditAccountForm } from "@/components/account/edit-account-form";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EditAccountPage() {
  return <EditAccountForm />;
}