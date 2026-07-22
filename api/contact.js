import { applyCors } from "./_lib/cors.js";

const TO_EMAIL = "webkikservices01@gmail.com";
// Resend requires the "from" address to be on a domain you've verified in
// your Resend account. onboarding@resend.dev works out of the box for
// testing — swap it for something like contact@dreamwedding.com once a
// domain is verified (see VERCEL_DEPLOY.md).
const FROM_EMAIL = "Dream Wedding <onboarding@resend.dev>";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    const { name, email, phone, subject, message } = req.body || {};
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res
        .status(400)
        .json({ message: "Name, email, and message are required" });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      return res
        .status(503)
        .json({ message: "Contact form is not configured yet" });
    }

    const mailSubject = subject?.trim() || `New enquiry from ${name.trim()}`;
    const html = `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      ${phone?.trim() ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
    `;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email.trim(),
        subject: mailSubject,
        html,
      }),
    });

    if (!resendRes.ok) {
      const data = await resendRes.json().catch(() => ({}));
      console.error("Resend error:", data);
      return res
        .status(502)
        .json({ message: "Couldn't send your message. Please try again." });
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
