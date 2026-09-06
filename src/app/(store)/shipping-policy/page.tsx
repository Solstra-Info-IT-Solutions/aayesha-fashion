import { ContentPage } from "@/components/content/content-page";

export default function ShippingPolicyPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Shipping Policy"
      description="This policy explains how orders are prepared, dispatched and delivered, along with the responsibilities that help ensure a successful delivery."
      updatedAt="September 2026"
      highlights={[
        {
          label: "Preparation",
          value: "Orders move into processing after confirmation",
        },
        {
          label: "Tracking",
          value: "Shared where supported by the courier",
        },
        {
          label: "Address",
          value: "Customers are responsible for accurate delivery details",
        },
      ]}
      sections={[
        {
          title: "1. Order processing",
          paragraphs: [
            "Orders are generally processed after successful confirmation. Processing time may vary depending on product availability, order volume, operational requirements and other factors.",
          ],
        },
        {
          title: "2. Dispatch",
          paragraphs: [
            "An order is considered dispatched when it has been handed over to the applicable delivery or logistics partner. Dispatch and delivery are separate stages, and a dispatched order may continue to pass through multiple courier facilities before reaching its destination.",
          ],
        },
        {
          title: "3. Delivery timelines",
          paragraphs: [
            "Any delivery estimate displayed at checkout or communicated separately is an estimate rather than an unconditional guarantee unless a specific commitment is expressly provided.",
            "Actual delivery can vary according to destination, courier network conditions, weekends, holidays, weather, regional restrictions and other operational factors.",
          ],
        },
        {
          title: "4. Tracking information",
          paragraphs: [
            "Where tracking is available, a tracking reference may be shared or displayed after dispatch. Tracking systems are operated by the relevant logistics provider and updates may not always appear immediately.",
          ],
        },
        {
          title: "5. Address accuracy",
          paragraphs: [
            "Customers must verify shipping information before completing checkout. Aayesha Fashion should be notified as quickly as possible if an error is discovered, although an address change may not be possible once fulfilment or dispatch has begun.",
          ],
        },
        {
          title: "6. Failed delivery attempts",
          paragraphs: [
            "If the courier cannot complete delivery because the recipient is unavailable, the address is incorrect, the phone number cannot be reached or another delivery issue occurs, the courier may attempt re-delivery or follow its standard exception process.",
          ],
        },
        {
          title: "7. Damaged or tampered shipments",
          paragraphs: [
            "Where the package appears materially damaged or tampered with at the time of delivery, customers are encouraged to document the package condition and contact customer care promptly with photographs and order details.",
          ],
        },
        {
          title: "8. External disruptions",
          paragraphs: [
            "We are not responsible for delays caused by circumstances outside reasonable operational control, including severe weather, natural events, public emergencies, regional restrictions, courier disruptions or infrastructure failures.",
          ],
        },
      ]}
    />
  );
}