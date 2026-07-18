import { Link } from "react-router-dom";
import { InfoPageLayout } from "@/components/site/InfoPageLayout";
import { COMPANY } from "@/data/company";

export default function CancellationPolicyPage() {
  return (
    <InfoPageLayout title="Cancellation Policy" subtitle="Cancelling an order before and after payment.">
      <p className="info-updated">Last updated: 18 July 2026</p>

      <h2>1. Before Payment</h2>
      <p>
        You may close the payment window or navigate away at any time before completing checkout — no
        charge is made and no order is created until Cashfree confirms a successful payment.
      </p>

      <h2>2. After Payment</h2>
      <p>
        Since Gold and Platinum unlocks are digital products delivered instantly upon successful payment,
        <strong> orders cannot be cancelled once payment is completed and the unlock is delivered.</strong>{" "}
        If your payment was deducted but the unlock did not reflect in your browser, this is treated as a
        failed delivery, not a cancellation — see our <Link to="/refund-policy">Refund Policy</Link> for
        how to get this resolved.
      </p>

      <h2>3. Silver Tier</h2>
      <p>
        Silver templates are free and require no payment, so there is nothing to cancel — you may stop
        using or discard a Silver card at any time by simply not sharing it.
      </p>

      <h2>4. Need Help?</h2>
      <p>
        If a payment is stuck, pending, or you're unsure of its status, contact us immediately at{" "}
        <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> or {COMPANY.phone} (WhatsApp available)
        and we'll help you sort it out. You can also use our <Link to="/contact">Contact Us</Link> form.
      </p>
    </InfoPageLayout>
  );
}
