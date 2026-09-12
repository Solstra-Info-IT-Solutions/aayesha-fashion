import { ContentPage } from "@/components/content/content-page";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery",
  description:
    "Learn about Aayesha Fashion's shipping and delivery information for online orders.",
  alternates: {
    canonical: "/shipping",
  },
};

export default function ShippingPage() {
  return (
    <ContentPage
      eyebrow="Customer Care"
      title="Shipping & Delivery"
      description="From order confirmation to your doorstep, here is how delivery works at Aayesha Fashion."
      highlights={[
        {
          label: "Before dispatch",
          value: "Orders are prepared after confirmation",
        },
        {
          label: "After dispatch",
          value: "Tracking may be shared where available",
        },
        {
          label: "Delivery",
          value: "Timing depends on destination and courier",
        },
      ]}
      sections={[
        {
          title: "Order processing",
          paragraphs: [
            "Once an order is successfully placed and confirmed, it enters the order preparation process. Preparation time can vary depending on product availability, order volume, and the nature of the item purchased.",
            "Orders may be subject to additional verification where necessary to protect customers and the business from incorrect or fraudulent transactions.",
          ],
        },
        {
          title: "Dispatch and tracking",
          paragraphs: [
            "After an order has been prepared and handed over to the delivery partner, dispatch information may be updated on the order where tracking is supported.",
            "Tracking information can take some time to become active after the courier receives the shipment. A tracking reference does not necessarily mean that the shipment has already completed its first movement through the courier network.",
          ],
        },
        {
          title: "Delivery address",
          paragraphs: [
            "Customers are responsible for providing a complete and accurate delivery address, including the recipient's name, contact number, locality, city, state and postal code.",
            "An incorrect or incomplete address can result in delays, failed delivery attempts or additional handling by the courier partner.",
          ],
        },
        {
          title: "Delivery delays",
          paragraphs: [
            "Estimated delivery timelines are indicative rather than guaranteed unless a specific delivery commitment has been expressly communicated for an order.",
            "Unexpected courier congestion, public holidays, extreme weather, regional restrictions, operational disruptions and other circumstances outside reasonable control may affect delivery.",
          ],
        },
        {
          title: "Receiving your order",
          paragraphs: [
            "Please inspect the outer package at the time of delivery where reasonably possible. If the package appears visibly damaged or tampered with, customers are encouraged to document the condition and contact customer care promptly.",
          ],
        },
      ]}
    />
  );
}