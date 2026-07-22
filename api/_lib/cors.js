// Frontend (Hostinger) and backend (Vercel) are different origins in a split
// deployment, so cross-origin requests need explicit CORS headers. Returns
// true if the request was a handled OPTIONS preflight (caller should return
// immediately without running any handler logic).
export function applyCors(req, res) {
  const origin = process.env.FRONTEND_URL || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
}
