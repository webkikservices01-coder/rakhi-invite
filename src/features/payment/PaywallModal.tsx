import { useState } from "react";
import { X, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createOrder, verifyOrder, unlockTier, type PaidTier } from "@/lib/payment";
import { TIER_PRICE } from "@/data/pricing";

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

  const price = TIER_PRICE[tier];

  const pay = async () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("Please enter your name and phone number.");
      return;
    }
    setBusy(true);
    try {
      const { orderId, paymentSessionId } = await createOrder({
        tier,
        templateId,
        customer: { name, email, phone },
      });

      const { load } = await import("@cashfreepayments/cashfree-js");
      const cashfree = await load({
        mode: import.meta.env.VITE_CASHFREE_ENV === "production" ? "production" : "sandbox",
      });
      const result = await cashfree.checkout({ paymentSessionId, redirectTarget: "_modal" });
      if (result.error) {
        toast.error("Payment was cancelled or failed.");
        return;
      }

      const verified = await verifyOrder(orderId);
      if (verified.status === "PAID") {
        unlockTier(tier);
        toast.success(`${tier === "gold" ? "Gold" : "Platinum"} unlocked!`);
        onUnlocked();
      } else {
        toast("Payment is still processing — please try again in a moment.", { icon: "⏳" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't start the payment.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 text-slate-900 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700">
          <X size={18} />
        </button>
        <div className="mb-4 flex items-center gap-2 text-amber-600">
          <Lock size={18} />
          <span className="text-xs font-bold uppercase tracking-widest">{tier} Unlock</span>
        </div>
        <h2 className="font-display text-2xl font-bold">Unlock to deploy</h2>
        <p className="mt-1 text-sm text-slate-600">
          Pay a one-time ₹{price} to deploy/share {tier === "gold" ? "Gold" : "Platinum"} templates.
        </p>
        <div className="mt-5 space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-amber-400"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (for invoice, optional)"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-amber-400"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-amber-400"
          />
        </div>
        <button
          onClick={() => void pay()}
          disabled={busy}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-5 py-3 font-semibold text-white shadow-lg disabled:opacity-60"
        >
          {busy ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Processing…
            </>
          ) : (
            <>Pay ₹{price} & Unlock</>
          )}
        </button>
        <p className="mt-3 text-center text-[11px] text-slate-400">Secured by Cashfree</p>
      </div>
    </div>
  );
}
