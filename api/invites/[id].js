import { applyCors } from "../_lib/cors.js";
import { kvGet, kvSet } from "../_lib/kv.js";

// Wedding invite ids come from the client as `${slug}-${Date.now()}`; guard
// against unexpected keys before touching the store.
const ID_PATTERN = /^[a-zA-Z0-9_-]+$/;
const keyFor = (id) => `wedding:invite:${id}`;

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  // Vercel's file-based routing puts the dynamic segment in req.query; the
  // local Express wrapper (backend/index.js) puts it in req.params instead —
  // support both so invites work the same way in both run modes.
  const id = req.query?.id ?? req.params?.id;
  if (typeof id !== "string" || !ID_PATTERN.test(id)) {
    return res.status(400).json({ error: "Invalid invite id" });
  }

  try {
    if (req.method === "GET") {
      const invite = await kvGet(keyFor(id));
      if (!invite) return res.status(404).json({ error: "Not found" });
      return res.status(200).json(invite);
    }

    if (req.method === "POST") {
      const body = req.body || {};
      if (!body.slug) {
        return res.status(400).json({ error: "Missing template slug" });
      }
      const invite = {
        slug: body.slug,
        overrides: body.overrides ?? {},
        customMusicUrl: body.customMusicUrl,
        createdAt: body.createdAt ?? new Date().toISOString(),
      };
      await kvSet(keyFor(id), invite);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
