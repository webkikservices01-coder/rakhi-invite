import crypto from "node:crypto";
import { CF_BASE_URL, cfHeaders } from "./_lib/cashfree.js";
import { applyCors } from "./_lib/cors.js";

// Keep in sync with src/data/pricing.ts (the frontend copy is display-only —
// this is the value that's actually charged, computed server-side so a client
// can never submit a tampered amount).
const TIER_PRICE = { gold: 149, platinum: 299 };

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    const { tier, templateId, customer } = req.body || {};
    if (!Object.prototype.hasOwnProperty.call(TIER_PRICE, tier)) {
      return res.status(400).json({ message: "Invalid tier" });
    }
    if (!templateId) return res.status(400).json({ message: "templateId is required" });
    if (!customer?.name?.trim() || !customer?.phone?.trim()) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    const amount = TIER_PRICE[tier];
    const orderId = `rakhi_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

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
          customer_email: customer.email?.trim() || "guest@rakhivibes.app",
          customer_phone: customer.phone.trim(),
        },
        order_meta: {
          return_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/t/${tier}/${templateId}?order_id={order_id}`,
        },
        // No database in this project — order_tags round-trips what /verify
        // needs (tier + templateId to unlock, customer info for the invoice).
        order_tags: {
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
