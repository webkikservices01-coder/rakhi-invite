export type PaidTier = "gold" | "platinum";

const API_BASE = import.meta.env.VITE_API_URL || "";

export async function createOrder(input: {
  tier: PaidTier;
  templateId: string;
  customer: { name: string; email?: string; phone: string };
}) {
  const res = await fetch(`${API_BASE}/api/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, vertical: "rakhi" }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Couldn't create the order.");
  return data as { orderId: string; paymentSessionId: string };
}

export async function verifyOrder(orderId: string) {
  const res = await fetch(`${API_BASE}/api/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Couldn't verify the payment.");
  return data as { status: string; tier?: PaidTier; invoicePdfUrl?: string };
}

const unlockKey = (tier: PaidTier) => `rakhi:unlocked:${tier}`;

export function isTierUnlocked(tier: "silver" | PaidTier): boolean {
  if (tier === "silver") return true;
  try {
    return localStorage.getItem(unlockKey(tier)) === "1";
  } catch {
    return false;
  }
}

export function unlockTier(tier: PaidTier) {
  try {
    localStorage.setItem(unlockKey(tier), "1");
  } catch {
    /* ignore */
  }
}
