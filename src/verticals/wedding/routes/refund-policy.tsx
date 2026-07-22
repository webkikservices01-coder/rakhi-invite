import { Link } from "react-router-dom";
import { InfoPageLayout } from "@/verticals/wedding/components/site/WeddingInfoPageLayout";
import { useDocumentHead } from "@/verticals/wedding/lib/use-document-head";
import { COMPANY } from "@/verticals/wedding/data/company";
import { TIER_PRICE } from "@/verticals/wedding/lib/payment";

export default function RefundPolicyPage() {
  useDocumentHead({
    title: `Refund Policy · ${COMPANY.brand}`,
    description: `When and how refunds are issued for Gold & Platinum invitation unlocks.`,
  });

  return (
    <InfoPageLayout
      title="Refund Policy"
      subtitle="When and how refunds are issued for Gold & Platinum unlocks."
    >
      <p className="info-updated">Last updated: 18 July 2026</p>

      <p>
        Gold (₹{TIER_PRICE.gold}) and Platinum (₹{TIER_PRICE.platinum})
        invitation unlocks on {COMPANY.brand} are{" "}
        <strong>digital products delivered instantly</strong> to your browser
        upon successful payment. Because of this instant, non-returnable nature,
        refunds are limited to the specific situations below.
      </p>

      <h2>1. Eligible for a Refund</h2>
      <ul>
        <li>
          <strong>Payment deducted but unlock failed</strong> — your payment was
          successfully charged but the Gold/Platinum tier did not unlock in your
          browser due to a technical error on our end.
        </li>
        <li>
          <strong>Duplicate payment</strong> — you were accidentally charged
          more than once for the same unlock.
        </li>
        <li>
          <strong>Unauthorised transaction</strong> — a payment was made without
          your authorisation (subject to verification).
        </li>
      </ul>

      <h2>2. Not Eligible for a Refund</h2>
      <ul>
        <li>
          The unlock was delivered successfully and you were able to
          deploy/share your invitation.
        </li>
        <li>Change of mind after a successful purchase.</li>
        <li>
          Dissatisfaction with template design choices that were visible before
          payment.
        </li>
      </ul>

      <h2>3. How to Request a Refund</h2>
      <p>
        Email <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> or message
        us on WhatsApp at {COMPANY.whatsapp} within <strong>7 days</strong> of
        the transaction, with your registered phone/email used at checkout and,
        if available, the order ID or payment reference shown on your Cashfree
        receipt. You can also use our <Link to="/wedding/contact">Contact Us</Link>{" "}
        form.
      </p>

      <h2>4. Processing Time</h2>
      <p>
        Approved refunds are processed back to your original payment method
        within <strong>5–7 business days</strong>, though your bank or payment
        provider may take a few additional days to reflect the credit.
      </p>

      <h2>5. Related Policy</h2>
      <p>
        Please also see our{" "}
        <Link to="/wedding/cancellation-policy">Cancellation Policy</Link> for details
        on cancelling an order before payment completes.
      </p>
    </InfoPageLayout>
  );
}
