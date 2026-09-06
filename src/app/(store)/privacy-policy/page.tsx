import { ContentPage } from "@/components/content/content-page";

export default function PrivacyPolicyPage() {
  return (
    <ContentPage
      eyebrow="Legal & Privacy"
      title="Privacy Policy"
      description="Your privacy matters to us. This policy explains what information may be collected through Aayesha Fashion, why it is used, how it may be protected, and the choices available to you."
      updatedAt="September 2026"
      highlights={[
        {
          label: "Purpose",
          value: "Provide and improve our services",
        },
        {
          label: "Transparency",
          value: "Clear use of customer information",
        },
        {
          label: "Security",
          value: "Reasonable safeguards for personal data",
        },
      ]}
      sections={[
        {
          title: "1. Scope of this policy",
          paragraphs: [
            "This Privacy Policy applies to information collected through the Aayesha Fashion website, account functionality, shopping and checkout experiences, customer service interactions and other digital touchpoints operated in connection with the website.",
            "By using the website or providing personal information to us, you acknowledge that information may be handled as described in this policy, subject to applicable law and the specific circumstances of your interaction with us.",
          ],
        },
        {
          title: "2. Information you may provide",
          paragraphs: [
            "Depending on how you use the website, we may receive information such as your name, email address, mobile number, billing information, shipping address, account details, order information, preferences and communications you choose to send to us.",
            "When you contact customer care, we may retain the information necessary to understand, investigate and resolve your enquiry or support request.",
          ],
        },
        {
          title: "3. Information collected through use of the website",
          paragraphs: [
            "Certain technical and usage information may be collected automatically when you visit the website. This can include device type, browser information, approximate location derived from network information, pages visited, referring pages, interaction information and technical logs.",
            "This information may help us maintain website security, diagnose technical issues, understand website performance and improve the overall customer experience.",
          ],
        },
        {
          title: "4. How we use information",
          paragraphs: [
            "Personal information may be used to create and manage accounts, process and fulfil orders, communicate order-related information, support returns and exchanges, respond to enquiries, improve products and services, prevent misuse and maintain the security of the platform.",
            "Where appropriate, information may also be used to understand customer preferences and improve how products and content are presented across the website.",
          ],
        },
        {
          title: "5. Payments",
          paragraphs: [
            "Payment transactions may be handled through third-party payment service providers. Depending on the payment method, payment information may be processed directly by the relevant payment provider rather than stored by Aayesha Fashion in full.",
            "Customers should review the privacy and security terms of the payment provider where applicable.",
          ],
        },
        {
          title: "6. Service providers and third parties",
          paragraphs: [
            "We may use trusted third-party providers for services such as hosting, website infrastructure, payment processing, delivery, communications, analytics, customer support and security.",
            "Such providers may process information only to the extent reasonably necessary to perform the services they provide, subject to their own contractual, technical and legal obligations.",
          ],
        },
        {
          title: "7. Cookies and similar technologies",
          paragraphs: [
            "The website may use cookies or similar technologies to support essential functionality, maintain sessions, remember preferences, understand usage patterns and improve website performance.",
            "Browser settings may allow you to control or restrict certain cookies. Disabling some technologies can affect portions of the website or reduce the functionality available to you.",
          ],
        },
        {
          title: "8. Communications",
          paragraphs: [
            "We may send transactional communications relating to your account, orders, delivery, returns, security or other important service events.",
            "Where applicable and where legally permitted, promotional communications may be sent in accordance with your preferences. You may use the available unsubscribe or preference controls for marketing communications.",
          ],
        },
        {
          title: "9. Data security",
          paragraphs: [
            "We use reasonable administrative, technical and organisational safeguards designed to protect information against unauthorised access, misuse, alteration, disclosure or destruction.",
            "No internet transmission or digital storage system can be guaranteed to be completely secure. Customers should also take reasonable precautions when using accounts and devices, including protecting passwords and avoiding sharing account credentials.",
          ],
        },
        {
          title: "10. Data retention",
          paragraphs: [
            "Information may be retained for as long as reasonably necessary to provide services, maintain business and transaction records, comply with applicable obligations, resolve disputes, prevent fraud and enforce agreements.",
            "Retention periods may differ depending on the nature and purpose of the information.",
          ],
        },
        {
          title: "11. Your choices and rights",
          paragraphs: [
            "Depending on applicable law, you may have rights relating to access, correction, updating or deletion of certain personal information, as well as choices regarding specific communications or data uses.",
            "Requests may be subject to identity verification and applicable legal or operational limitations.",
          ],
        },
        {
          title: "12. Children's privacy",
          paragraphs: [
            "The website is intended for general ecommerce use and is not designed to knowingly collect personal information from children without appropriate lawful involvement or consent.",
          ],
        },
        {
          title: "13. Changes to this policy",
          paragraphs: [
            "This policy may be updated periodically to reflect changes in our operations, technology, services, legal requirements or privacy practices.",
            "When changes are made, the revised version will be published on the website with an updated revision date where appropriate.",
          ],
        },
        {
          title: "14. Contact regarding privacy",
          paragraphs: [
            "For questions, requests or concerns regarding privacy or personal information, please contact Aayesha Fashion through the customer-care channels published on the website.",
          ],
        },
      ]}
    />
  );
}