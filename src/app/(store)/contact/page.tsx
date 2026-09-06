import { ContentPage } from "@/components/content/content-page";
import { siteConfig } from "@/config/site";

export default function ContactPage() {
  return (
    <>
      <ContentPage
        eyebrow="Customer Care"
        title="Contact Us"
        description="Whether you need help with an order, sizing, delivery, returns or finding the right piece, our customer care team is here to assist."
        highlights={[
          {
            label: "Order support",
            value: "Keep your order number ready",
          },
          {
            label: "Product help",
            value: "Ask us about sizing and details",
          },
          {
            label: "General enquiries",
            value: "We're happy to guide you",
          },
        ]}
        sections={[
          {
            title: "A considered customer experience",
            paragraphs: [
              "Good service begins with clear information. We aim to make every stage of your shopping experience easy to understand, from product discovery and checkout through dispatch, delivery and after-sales support.",
              "When contacting us, sharing your order number, registered email address and a clear description of your question helps us respond more efficiently.",
            ],
          },
          {
            title: "Order enquiries",
            paragraphs: [
              "For questions about order confirmation, dispatch, tracking, delivery status, product availability or an issue with an order, please contact customer care with the relevant order details.",
            ],
          },
          {
            title: "Product and sizing assistance",
            paragraphs: [
              "Before placing an order, you may contact us about product measurements, fit, styling or general product information. Where a product-specific size chart is available, we recommend checking those measurements before ordering.",
            ],
          },
          {
            title: "Returns and exchanges",
            paragraphs: [
              "For return or exchange assistance, please review the relevant policy first and contact customer care with your order number and request details. Our team will guide you through the applicable process.",
            ],
          },
        ]}
      />

      <section className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto max-w-[1180px] px-5 py-10 sm:px-7 lg:px-8">
          <div className="grid gap-3 sm:grid-cols-2">
            {siteConfig.contact.phone && (
              <a
                href={`tel:+${siteConfig.contact.phone}`}
                className="group border border-[var(--color-border)] bg-[var(--color-ivory)] p-6 transition-colors duration-300 hover:bg-[var(--color-cream)]"
              >
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                  Phone
                </p>

                <p className="mt-3 text-base font-medium text-[var(--color-charcoal)]">
                  +{siteConfig.contact.phone}
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--color-secondary)]">
                  Call customer care
                </span>
              </a>
            )}

            {siteConfig.contact.email && (
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="group border border-[var(--color-border)] bg-[var(--color-ivory)] p-6 transition-colors duration-300 hover:bg-[var(--color-cream)]"
              >
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                  Email
                </p>

                <p className="mt-3 break-all text-base font-medium text-[var(--color-charcoal)]">
                  {siteConfig.contact.email}
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--color-secondary)]">
                  Send an enquiry
                </span>
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}