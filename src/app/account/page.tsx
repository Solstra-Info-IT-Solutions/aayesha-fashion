import { ProfileDetails } from "@/components/account/profile-details";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccountPage() {
  return <ProfileDetails />;
}