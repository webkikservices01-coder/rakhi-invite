// Thin wrapper around the Upstash Redis REST API — no SDK dependency needed,
// just two fetch calls. This is also what Vercel's own "KV" storage
// integration provisions under the hood, so either a Vercel KV or a
// standalone Upstash account works with these same env var names.
const BASE_URL = process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

function assertConfigured() {
  if (!BASE_URL || !TOKEN) {
    throw new Error(
      "UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not configured",
    );
  }
}

export async function kvGet(key) {
  assertConfigured();
  const res = await fetch(`${BASE_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) throw new Error(`kv get failed: ${res.status}`);
  const data = await res.json();
  return data.result ? JSON.parse(data.result) : null;
}

export async function kvSet(key, value) {
  assertConfigured();
  // Upstash's REST /set/<key> takes the raw value as the POST body — not a
  // JSON envelope — so the JSON-serialized value itself is the whole body.
  const res = await fetch(`${BASE_URL}/set/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify(value),
  });
  if (!res.ok) throw new Error(`kv set failed: ${res.status}`);
}
