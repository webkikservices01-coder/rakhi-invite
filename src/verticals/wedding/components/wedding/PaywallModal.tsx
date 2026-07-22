import { useState } from "react";
import { X, Lock, Loader2 } from "lucide-react";
import {
  createOrder,
  verifyOrder,
  TIER_PRICE,
  type PaidTier,
} from "@/verticals/wedding/lib/payment";

export function PaywallModal({
  tier,
  templateId,
  onUnlocked,
  onClose,
}: {
  tier: PaidTier;
  templateId: string;
  onUnlocked: () => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const price = TIER_PRICE[tier];

  const pay = async () => {
    if (!name.trim() || !phone.trim()) {
      setError("Please enter your name and phone number.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const { orderId, paymentSessionId } = await createOrder({
        tier,
        templateId,
        customer: { name, email, phone },
      });

      const { load } = await import("@cashfreepayments/cashfree-js");
      const cashfree = await load({
        mode:
          import.meta.env.VITE_CASHFREE_ENV === "production"
            ? "production"
            : "sandbox",
      });
      const result = await cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_modal",
      });
      if (result.error) {
        setError("Payment was cancelled or failed.");
        return;
      }

      const verified = await verifyOrder(orderId);
      if (verified.status === "PAID") {
        onUnlocked();
      } else {
        setError("Payment is still processing — please try again in a moment.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't start the payment.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        className="relative w-full max-w-sm rounded-3xl border-2 p-6"
        style={{
          background: "var(--wt-bg-1)",
          borderColor: "var(--wt-gold)",
          color: "var(--wt-ink)",
          boxShadow: "0 34px 90px rgba(0,0,0,.65)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 opacity-60 transition hover:opacity-100"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <div
          className="mb-4 flex items-center gap-2"
          style={{ color: "var(--wt-gold-lite)" }}
        >
          <Lock size={18} />
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ fontFamily: "var(--wt-label)" }}
          >
            {tier} Unlock
          </span>
        </div>
        <h2
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--wt-display)" }}
        >
          Unlock to deploy
        </h2>
        <p className="mt-1 text-sm opacity-75">
          Pay a one-time ₹{price} to deploy/share your{" "}
          {tier === "gold" ? "Gold" : "Platinum"} invitation.
        </p>
        <div className="mt-5 space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
            style={{
              borderColor: "var(--wt-gold)",
              background: "rgba(255,255,255,0.05)",
              color: "var(--wt-ink)",
            }}
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (for invoice, optional)"
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
            style={{
              borderColor: "var(--wt-gold)",
              background: "rgba(255,255,255,0.05)",
              color: "var(--wt-ink)",
            }}
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
            style={{
              borderColor: "var(--wt-gold)",
              background: "rgba(255,255,255,0.05)",
              color: "var(--wt-ink)",
            }}
          />
        </div>
        {error && (
          <p className="mt-3 text-sm" style={{ color: "#ff6b81" }}>
            {error}
          </p>
        )}
        <button
          onClick={() => void pay()}
          disabled={busy}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold shadow-lg transition disabled:opacity-60"
          style={{
            background:
              "linear-gradient(135deg, var(--wt-accent), var(--wt-accent-deep))",
            color: "#fff",
          }}
        >
          {busy ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Processing…
            </>
          ) : (
            <>Pay ₹{price} & Unlock</>
          )}
        </button>
        <p className="mt-3 text-center text-[11px] opacity-50">
          Secured by Cashfree
        </p>
      </div>
    </div>
  );
}
