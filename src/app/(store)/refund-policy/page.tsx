import { ContentPage } from "@/components/content/content-page";

export default function RefundPolicyPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Refund Policy"
      description="This policy explains when a refund may be issued, how returned products are assessed, and what happens after a refund is approved."
      updatedAt="September 2026"
      highlights={[
        {
          label: "Eligibility",
          value: "Depends on the applicable return conditions",
        },
        {
          label: "Assessment",
          value: "Returned products may be inspected",
        },
        {
          label: "Processing",
          value: "Timing depends on the payment method and provider",
        },
      ]}
      sections={[
        {
          title: "1. Refund eligibility",
          paragraphs: [
            "A refund may be available where an order or returned product satisfies the applicable return and refund conditions.",
            "Eligibility can depend on product condition, return timing, product category, original packaging, applicable exclusions and the circumstances of the request.",
          ],
        },
        {
          title: "2. Return assessment",
          paragraphs: [
            "Where a physical return is required, the returned product may be inspected before a refund is approved.",
            "The inspection may consider whether the item remains unused, unworn, unwashed, unaltered and in its original condition with applicable tags and packaging intact.",
          ],
        },
        {
          title: "3. Approved refunds",
          paragraphs: [
            "After a refund is approved, the amount may be processed through the applicable payment mechanism associated with the original transaction or another permitted method, depending on the circumstances.",
          ],
        },
        {
          title: "4. Refund timing",
          paragraphs: [
            "Once initiated, the time taken for the refund to appear may vary because banks, card networks, payment gateways and other financial institutions follow their own processing cycles.",
            "The date on which a refund is initiated and the date on which it becomes visible in the customer's account may therefore be different.",
          ],
        },
        {
          title: "5. Partial refunds and deductions",
          paragraphs: [
            "Where permitted under the applicable policy or circumstances, an approved refund may differ from the original amount due to non-refundable charges, deductions, adjustments or other applicable costs.",
          ],
        },
        {
          title: "6. Orders cancelled before dispatch",
          paragraphs: [
            "Where a cancellation is accepted before fulfilment or dispatch, the applicable refund process may differ from a return initiated after delivery.",
          ],
        },
        {
          title: "7. Failed or reversed payments",
          paragraphs: [
            "If a payment is declined, reversed or otherwise unsuccessful, the handling of any temporary debit or reversal may depend on the payment provider and banking network involved.",
          ],
        },
        {
          title: "8. Refund disputes",
          paragraphs: [
            "If you believe a refund has not been processed correctly, please contact customer care with the relevant order number and payment details. Additional verification may be required before financial information relating to an order is discussed.",
          ],
        },
      ]}
    />
  );
}