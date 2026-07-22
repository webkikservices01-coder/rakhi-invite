import { API_BASE } from "@/verticals/wedding/lib/api-base";

export type PaidTier = "gold" | "platinum";

// Keep in sync with api/create-order.js's TIER_PRICE — that's the value
// actually charged; this is display-only.
export const TIER_PRICE: Record<PaidTier, number> = {
  gold: 499,
  platinum: 999,
};

export async function createOrder(input: {
  tier: PaidTier;
  templateId: string;
  customer: { name: string; email?: string; phone: string };
}) {
  const res = await fetch(`${API_BASE}/api/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, vertical: "wedding" }),
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
  return data as { status: string; tier?: PaidTier };
}

const unlockKey = (tier: PaidTier) => `wedding:unlocked:${tier}`;

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
