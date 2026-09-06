import { ContentPage } from "@/components/content/content-page";

export default function ReturnsPage() {
  return (
    <ContentPage
      eyebrow="Customer Care"
      title="Returns & Exchange"
      description="A straightforward guide to requesting a return or exchange and keeping your product eligible throughout the process."
      highlights={[
        {
          label: "Condition",
          value: "Items should remain unused and unworn",
        },
        {
          label: "Packaging",
          value: "Retain original tags and packaging",
        },
        {
          label: "Request",
          value: "Contact customer care with your order details",
        },
      ]}
      sections={[
        {
          title: "Before requesting a return",
          paragraphs: [
            "Please review the applicable product and order conditions before initiating a return or exchange. Eligibility can vary depending on product type, condition and the specific order.",
            "Products should remain unused, unworn, unwashed and unaltered, with original tags, packaging and other applicable components intact.",
          ],
        },
        {
          title: "How to initiate a request",
          paragraphs: [
            "Contact customer care with your order number, registered contact information and a clear description of your request. Where relevant, include photographs that help explain an issue with the product.",
            "Our team may review the request before providing return or exchange instructions.",
          ],
        },
        {
          title: "Product inspection",
          paragraphs: [
            "Returned items may be inspected once received. Approval of a return, exchange or refund may depend on whether the product meets the applicable eligibility requirements.",
            "Items showing signs of use, washing, damage, alteration, stains, strong fragrance or missing original components may not qualify.",
          ],
        },
        {
          title: "Exchange requests",
          paragraphs: [
            "An exchange may depend on stock availability, product condition and the applicable exchange terms. If the requested replacement is unavailable, customer care may provide an alternative resolution where applicable.",
          ],
        },
        {
          title: "Items that may not qualify",
          items: [
            "Products that have been worn, washed, altered, repaired or damaged after delivery.",
            "Products returned without required tags, packaging or other original components.",
            "Products affected by stains, make-up, perfume, odour or other signs of use.",
            "Any product specifically identified as non-returnable or otherwise excluded under the applicable product policy.",
          ],
        },
      ]}
    />
  );
}