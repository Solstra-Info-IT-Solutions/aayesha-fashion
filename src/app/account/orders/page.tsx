import { OrdersList } from "@/components/account/orders/orders-list";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrdersPage() {
  return <OrdersList />;
}