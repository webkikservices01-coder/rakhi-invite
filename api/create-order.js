import crypto from "node:crypto";
import { CF_BASE_URL, cfHeaders } from "./_lib/cashfree.js";
import { applyCors } from "./_lib/cors.js";

// One endpoint serves both product verticals — keep in sync with
// src/lib/payment.ts and src/verticals/wedding/lib/payment.ts (those are
// display-only copies; this is the value actually charged, computed
// server-side so a client can never submit a tampered amount).
const TIER_PRICE = {
  rakhi: { gold: 149, platinum: 299 },
  wedding: { gold: 499, platinum: 999 },
};
const GUEST_EMAIL = { rakhi: "guest@rakhivibes.app", wedding: "guest@dreamwedding.app" };
const returnPath = (vertical, tier, templateId) =>
  vertical === "wedding" ? `/wedding/templates/${templateId}` : `/rakhi/t/${tier}/${templateId}`;

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    const { vertical, tier, templateId, customer } = req.body || {};
    const prices = TIER_PRICE[vertical];
    if (!prices) return res.status(400).json({ message: "Invalid vertical" });
    if (!Object.prototype.hasOwnProperty.call(prices, tier)) {
      return res.status(400).json({ message: "Invalid tier" });
    }
    if (!templateId) return res.status(400).json({ message: "templateId is required" });
    if (!customer?.name?.trim() || !customer?.phone?.trim()) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    const amount = prices[tier];
    const orderId = `${vertical}_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

    const cfRes = await fetch(`${CF_BASE_URL}/orders`, {
      method: "POST",
      headers: cfHeaders(),
      body: JSON.stringify({
        order_id: orderId,
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: `cust_${crypto.randomBytes(6).toString("hex")}`,
          customer_name: customer.name.trim(),
          customer_email: customer.email?.trim() || GUEST_EMAIL[vertical],
          customer_phone: customer.phone.trim(),
        },
        order_meta: {
          return_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}${returnPath(vertical, tier, templateId)}?order_id={order_id}`,
        },
        // No database in this project — order_tags round-trips what /verify
        // needs (vertical + tier + templateId to unlock, customer info for the invoice).
        order_tags: {
          vertical,
          tier,
          templateId,
          customerName: customer.name.trim(),
          customerEmail: customer.email?.trim() || "",
        },
      }),
    });
    const data = await cfRes.json();
    if (!cfRes.ok) {
      return res.status(400).json({ message: data.message || "Failed to create payment order" });
    }

    res.status(200).json({ orderId: data.order_id, paymentSessionId: data.payment_session_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
