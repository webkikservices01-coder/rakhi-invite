import { Link } from "react-router-dom";
import { InfoPageLayout } from "@/components/site/InfoPageLayout";
import { COMPANY } from "@/data/company";

export default function PrivacyPage() {
  return (
    <InfoPageLayout title="Privacy Policy" subtitle="How we collect, use, and protect your information.">
      <p className="info-updated">Last updated: 18 July 2026</p>

      <p>
        This Privacy Policy explains how <strong>{COMPANY.name}</strong> ("we", "us", "our") collects,
        uses, and protects information when you use {COMPANY.brand}. By using our website, you consent
        to the practices described in this policy.
      </p>

      <h2>1. Information We Collect</h2>
      <h3>a) Information you provide</h3>
      <ul>
        <li>
          <strong>Card content:</strong> names, messages, and photos you enter or upload while
          personalising a template. This is stored in your own browser's local storage and/or encoded
          into your shareable card link — not in a central database.
        </li>
        <li>
          <strong>Checkout details:</strong> name, phone number, and (optionally) email address, entered
          when unlocking a Gold or Platinum template, used to create your payment order and invoice.
        </li>
        <li>
          <strong>Contact form details:</strong> name, email, phone, subject, and message, if you reach
          out via our <Link to="/rakhi/contact">Contact Us</Link> page.
        </li>
      </ul>
      <h3>b) Information collected automatically</h3>
      <p>
        We may collect basic technical information such as browser type, device type, and general usage
        patterns to help us maintain and improve the service. We do not use invasive tracking or sell
        this data.
      </p>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To generate and deliver the digital Rakhi card you create;</li>
        <li>To process one-time payments and generate invoices;</li>
        <li>To respond to support requests and enquiries;</li>
        <li>To improve our templates, features, and overall service quality.</li>
      </ul>

      <h2>3. Third-Party Services We Use</h2>
      <p>We work with the following trusted third parties, who process limited data strictly to provide their service to us:</p>
      <ul>
        <li>
          <strong>Cashfree Payments</strong> — processes your payment securely. We never see or store
          your full card/UPI credentials.
        </li>
        <li>
          <strong>Refrens</strong> — generates invoices for completed purchases (name/email may be
          shared for this purpose).
        </li>
        <li>
          <strong>Anthropic (Claude AI)</strong> — powers the optional "Marvels" AI chat assistant on
          Platinum templates. Messages you send to the chatbot may be processed by this service to
          generate a response.
        </li>
      </ul>
      <p>Each of these providers has its own privacy policy governing how it handles data on our behalf.</p>

      <h2>4. Local Storage & Cookies</h2>
      <p>
        {COMPANY.brand} primarily uses your browser's local storage (not third-party tracking cookies)
        to remember your card edits and unlock status on that device/browser. Clearing your browser data
        will remove this information. We do not use local storage to track you across other websites.
      </p>

      <h2>5. Data Sharing</h2>
      <p>
        We do not sell your personal information. We only share data with the third-party service
        providers listed above, and where required by law (e.g. a valid legal request from Indian
        authorities).
      </p>

      <h2>6. Data Security</h2>
      <p>
        We use industry-standard measures, including encrypted (HTTPS) connections and secure
        third-party payment processing, to protect your information. However, no method of transmission
        or storage is 100% secure, and we cannot guarantee absolute security.
      </p>

      <h2>7. Your Rights</h2>
      <p>
        You may request access to, correction of, or deletion of any personal information you have
        shared with us (e.g. via the contact form or checkout) by writing to{" "}
        <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>. Since most card content lives in your
        own browser, you can also delete it at any time by clearing your browser's local storage for our
        site.
      </p>

      <h2>8. Children's Privacy</h2>
      <p>
        {COMPANY.brand} is not directed at children under 13. We do not knowingly collect personal
        information from children under 13.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Changes will be posted on this page with a
        revised "Last updated" date.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        For privacy-related questions, contact us at{" "}
        <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> or {COMPANY.phone}, or visit our{" "}
        <Link to="/rakhi/contact">Contact Us</Link> page.
      </p>
    </InfoPageLayout>
  );
}
