import crypto from "node:crypto";

export const config = { api: { bodyParser: false } };

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => { data += chunk; });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

// Server-to-server confirmation channel. This project has no database, so the
// actual unlock happens client-side via POST /api/verify right after the
// Cashfree checkout modal closes — that's the primary, reliable path. This
// webhook exists as a signed audit log (and a place to plug in real
// persistence later) for the edge case where a user pays and closes the tab
// before /verify runs.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  try {
    const rawBody = await readRawBody(req);
    const timestamp = req.headers["x-webhook-timestamp"];
    const signature = req.headers["x-webhook-signature"];

    const expected = crypto
      .createHmac("sha256", process.env.CASHFREE_CLIENT_SECRET)
      .update(timestamp + rawBody)
      .digest("base64");

    if (expected !== signature) return res.status(400).send("Invalid signature");

    const event = JSON.parse(rawBody);
    console.log(
      "Cashfree webhook:",
      event?.data?.order?.order_id,
      event?.data?.order?.order_status || event?.data?.payment?.payment_status,
    );

    res.status(200).send("ok");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}
