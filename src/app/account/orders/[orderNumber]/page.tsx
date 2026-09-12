import { OrderDetails } from "@/components/account/orders/order-details";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  robots: {
    index: false,
    follow: false,
  },
};

interface OrderDetailsPageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { orderNumber } = await params;

  return <OrderDetails orderNumber={orderNumber} />;
}