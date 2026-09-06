import { ContentPage } from "@/components/content/content-page";

export default function TermsPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Terms & Conditions"
      description="These Terms & Conditions govern your access to and use of the Aayesha Fashion website, including purchases, accounts, communications and related services."
      updatedAt="September 2026"
      highlights={[
        {
          label: "Website use",
          value: "Use the platform lawfully and responsibly",
        },
        {
          label: "Orders",
          value: "Orders remain subject to confirmation and availability",
        },
        {
          label: "Information",
          value: "Keep account and delivery details accurate",
        },
      ]}
      sections={[
        {
          title: "1. Acceptance of terms",
          paragraphs: [
            "By accessing, browsing or using the Aayesha Fashion website, you agree to comply with these Terms & Conditions and any additional terms or policies referenced on the website.",
            "If you do not agree with these terms, please do not use the website or place an order through it.",
          ],
        },
        {
          title: "2. Website content",
          paragraphs: [
            "The website may contain product images, descriptions, editorial content, pricing, graphics, logos and other materials. We make reasonable efforts to keep this information accurate, but minor differences may occur because of screen settings, photography, lighting, product batches or other factors.",
          ],
        },
        {
          title: "3. Product availability",
          paragraphs: [
            "Products displayed on the website are subject to availability. A product being visible on the website does not guarantee that it will remain available until checkout or fulfilment.",
            "We may limit quantities, discontinue products, correct listing errors or update availability without prior notice.",
          ],
        },
        {
          title: "4. Pricing and taxes",
          paragraphs: [
            "Product prices displayed on the website are subject to change. Applicable taxes, delivery charges or other costs may be presented during checkout where relevant.",
            "In the event of an obvious pricing or listing error, we reserve the right to investigate and take appropriate action in accordance with applicable law.",
          ],
        },
        {
          title: "5. Accounts",
          paragraphs: [
            "When creating an account, you are responsible for providing information that is accurate and reasonably current.",
            "You are responsible for maintaining the confidentiality of your account credentials and for activity conducted through your account, except where unauthorised activity results from circumstances outside your reasonable control.",
          ],
        },
        {
          title: "6. Orders and acceptance",
          paragraphs: [
            "Submitting an order constitutes a request to purchase the selected products. An order may be subject to confirmation, payment verification, inventory availability and other fulfilment checks.",
            "Where an order cannot be fulfilled, we may contact you and provide an appropriate resolution based on the circumstances and applicable policy.",
          ],
        },
        {
          title: "7. Cancellations",
          paragraphs: [
            "Cancellation requests are subject to the stage of order processing. Once an order has entered fulfilment, been packed, dispatched or otherwise progressed beyond a cancellable stage, cancellation may no longer be possible.",
          ],
        },
        {
          title: "8. Prohibited use",
          items: [
            "Using the website for unlawful, fraudulent or misleading activity.",
            "Attempting to interfere with website security, infrastructure or availability.",
            "Copying, reproducing or commercially exploiting website content without appropriate permission.",
            "Using automated systems in a manner that places unreasonable load on the website or interferes with normal operation.",
          ],
        },
        {
          title: "9. Intellectual property",
          paragraphs: [
            "Unless otherwise stated, the Aayesha Fashion name, branding, website design, product photography, written content, graphics and other original materials are protected by applicable intellectual-property rights.",
            "Nothing in these terms grants you ownership of those materials merely because they are accessible through the website.",
          ],
        },
        {
          title: "10. Third-party services",
          paragraphs: [
            "The website may depend upon third-party services, including payment, delivery, hosting or communication providers. Their services may be governed by separate terms and privacy policies.",
          ],
        },
        {
          title: "11. Limitation of responsibility",
          paragraphs: [
            "To the extent permitted by applicable law, Aayesha Fashion is not responsible for losses arising solely from circumstances outside reasonable operational control, including certain technology failures, courier disruptions, public infrastructure issues or unforeseen events.",
          ],
        },
        {
          title: "12. Changes to the terms",
          paragraphs: [
            "We may update these Terms & Conditions from time to time. Revised terms become applicable when published on the website unless a different effective date is stated.",
          ],
        },
        {
          title: "13. Governing framework",
          paragraphs: [
            "These terms are intended to operate subject to applicable laws and regulations governing the relevant transaction and the parties involved.",
          ],
        },
        {
          title: "14. Contact",
          paragraphs: [
            "Questions regarding these Terms & Conditions may be directed to Aayesha Fashion through the customer-care channels provided on the website.",
          ],
        },
      ]}
    />
  );
}