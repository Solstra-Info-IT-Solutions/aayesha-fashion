import { OrderDetails } from "@/components/account/orders/order-details";

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