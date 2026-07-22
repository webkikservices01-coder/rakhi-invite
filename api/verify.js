import { CF_BASE_URL, cfHeaders } from "./_lib/cashfree.js";
import { isRefrensConfigured, createRefrensInvoice } from "./_lib/refrens.js";
import { applyCors } from "./_lib/cors.js";

// Only Rakhi issues Refrens invoices today — Wedding never had this feature.
const TIER_LABEL = { gold: "Rakhi Vibes — Gold Tier Unlock", platinum: "Rakhi Vibes — Platinum Tier Unlock" };

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    const { orderId } = req.body || {};
    if (!orderId) return res.status(400).json({ message: "orderId is required" });

    const cfRes = await fetch(`${CF_BASE_URL}/orders/${orderId}`, { method: "GET", headers: cfHeaders() });
    const data = await cfRes.json();
    if (!cfRes.ok) return res.status(400).json({ message: data.message || "Could not verify payment" });

    if (data.order_status !== "PAID") {
      return res.status(200).json({ status: data.order_status });
    }

    const vertical = data.order_tags?.vertical;
    const tier = data.order_tags?.tier;
    const templateId = data.order_tags?.templateId;
    let invoicePdfUrl = "";

    // Best-effort — invoice failure never blocks the unlock itself.
    if (vertical === "rakhi" && isRefrensConfigured()) {
      try {
        const invoice = await createRefrensInvoice({
          name: data.customer_details?.customer_name,
          email: data.customer_details?.customer_email,
          phone: data.customer_details?.customer_phone,
          itemName: TIER_LABEL[tier] || "Rakhi Vibes Unlock",
          amount: data.order_amount,
        });
        invoicePdfUrl = invoice.pdfUrl;
      } catch (err) {
        console.error("Refrens invoice creation failed:", err.message);
      }
    }

    res.status(200).json({ status: "PAID", tier, templateId, invoicePdfUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
