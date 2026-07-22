// In a split deployment (static frontend on Hostinger, /api on Vercel) this
// points at the Vercel deployment; same-origin deploys leave it empty.
export const API_BASE = import.meta.env.VITE_API_URL || "";
