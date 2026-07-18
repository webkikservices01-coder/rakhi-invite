import { Link } from "react-router-dom";
import { InfoPageLayout } from "@/components/site/InfoPageLayout";
import { COMPANY } from "@/data/company";

export default function TermsPage() {
  return (
    <InfoPageLayout title="Terms & Conditions" subtitle="Please read these terms carefully before using our service.">
      <p className="info-updated">Last updated: 18 July 2026</p>

      <p>
        These Terms & Conditions ("Terms") govern your use of the {COMPANY.brand} website and services,
        operated by <strong>{COMPANY.name}</strong> ("we", "us", "our"). By accessing or using our
        website, you agree to be bound by these Terms. If you do not agree, please do not use our
        service.
      </p>

      <h2>1. Our Service</h2>
      <p>
        {COMPANY.brand} lets you create, personalise, and share digital Raksha Bandhan invite cards
        ("Cards") from a library of templates across three tiers — Silver, Gold, and Platinum. All
        editing happens in your browser; your card data is saved to your own browser's local storage
        and/or encoded into the shareable link you generate. We do not host a database of user accounts.
      </p>

      <h2>2. Pricing & Payment</h2>
      <ul>
        <li>Silver tier templates are free to create, edit, and share.</li>
        <li>Gold tier templates require a one-time payment to unlock deployment/sharing.</li>
        <li>Platinum tier templates require a one-time payment to unlock deployment/sharing.</li>
        <li>
          Exact prices are displayed on the pricing/paywall screen at the time of purchase and are
          charged in Indian Rupees (INR) via our payment partner, Cashfree Payments. We do not store
          your card or UPI credentials — these are handled entirely by Cashfree's secure checkout.
        </li>
        <li>All payments are one-time and non-recurring; we do not run subscriptions.</li>
      </ul>

      <h2>3. Digital Product & Delivery</h2>
      <p>
        Gold and Platinum unlocks are digital goods delivered instantly to your browser upon successful
        payment verification — there is no physical shipment. Because delivery is instant and
        irreversible, please review our <Link to="/refund-policy">Refund Policy</Link> and{" "}
        <Link to="/cancellation-policy">Cancellation Policy</Link> before purchasing.
      </p>

      <h2>4. User Content</h2>
      <p>
        You may upload photos, names, messages, and other personal content ("User Content") to
        personalise your Card. You retain all ownership of your User Content. By uploading it, you
        confirm that you have the right to use it and that it does not violate any law or third-party
        right. User Content is processed in your browser and, where applicable, transmitted only as
        needed to generate your shareable card link — we do not sell or publicly publish your User
        Content.
      </p>

      <h2>5. AI Chatbot ("Marvels")</h2>
      <p>
        Platinum templates include an AI-assisted chat feature that can suggest edits to your card. AI
        responses are generated automatically and may occasionally be inaccurate or unexpected; you are
        responsible for reviewing your final card before sharing it. If the AI service is unavailable,
        the chatbot automatically falls back to a built-in rule-based assistant.
      </p>

      <h2>6. Intellectual Property</h2>
      <p>
        All templates, designs, artwork, code, and branding on {COMPANY.brand} are the property of{" "}
        {COMPANY.name} or its licensors and are protected by applicable intellectual property laws. You
        may use a purchased/unlocked template to create and share your personal Card, but you may not
        resell, redistribute, or repurpose the underlying template or platform itself.
      </p>

      <h2>7. Acceptable Use</h2>
      <p>You agree not to use {COMPANY.brand} to:</p>
      <ul>
        <li>Upload unlawful, obscene, defamatory, or infringing content;</li>
        <li>Attempt to interfere with, disrupt, or gain unauthorised access to our systems;</li>
        <li>Use automated means to scrape, resell, or reverse-engineer our templates or service.</li>
      </ul>

      <h2>8. Limitation of Liability</h2>
      <p>
        {COMPANY.brand} is provided on an "as is" and "as available" basis. To the maximum extent
        permitted by law, {COMPANY.name} shall not be liable for any indirect, incidental, or
        consequential damages arising from your use of the service, including loss of data stored in
        your browser's local storage (e.g. if you clear your browser data, your unlock status and card
        edits on that device may be lost).
      </p>

      <h2>9. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. The updated version will be posted on this page
        with a revised "Last updated" date. Continued use of the service after changes take effect
        constitutes acceptance of the revised Terms.
      </p>

      <h2>10. Governing Law</h2>
      <p>
        These Terms are governed by the laws of India. Any disputes arising from these Terms or your use
        of {COMPANY.brand} shall be subject to the exclusive jurisdiction of the courts of Delhi, India.
      </p>

      <h2>11. Contact Us</h2>
      <p>
        For any questions about these Terms, please reach out via our{" "}
        <Link to="/contact">Contact Us</Link> page, email us at{" "}
        <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>, or call {COMPANY.phone}.
      </p>
    </InfoPageLayout>
  );
}
