# Deploying with payments + AI chatbot

Gold/Platinum templates now require a one-time Cashfree payment to Deploy (see `src/data/pricing.ts`),
and the "Marvels" chat widget calls real Claude AI (`api/chat.js`) instead of the old regex-only
responder. Both need secrets (Cashfree keys, `ANTHROPIC_API_KEY`) that must never reach the browser,
so both live in `/api/*` serverless functions. Hostinger's static hosting (see `HOSTINGER_DEPLOY.md`)
cannot run these, so the `/api` backend needs Vercel. Two ways to arrange it:

- **Combined** — deploy this whole repo (frontend + `/api`) to Vercel, one origin, no CORS needed.
- **Split** — keep the frontend on Hostinger as-is, deploy this same repo to Vercel too but only use
  it for `/api/*` (the frontend Vercel builds is simply unused). Point Hostinger's build at the
  Vercel API URL via `VITE_API_URL`. This is what `api/_lib/cors.js` is for — every `/api` handler
  calls `applyCors()` first so cross-origin requests from Hostinger are allowed and OPTIONS
  preflights are answered.

## 1) Env vars

Copy `.env.example` → `.env.local` for local dev, and add the same keys in
**Vercel → Project Settings → Environment Variables** (Production):

- `CASHFREE_ENV=production`, `CASHFREE_CLIENT_ID`, `CASHFREE_CLIENT_SECRET`
- `FRONTEND_URL` — the origin that's allowed to call the API (used for both the Cashfree return URL
  and the `Access-Control-Allow-Origin` header). Combined: your Vercel domain. Split: your Hostinger
  domain, e.g. `https://rakhivibes.com` (no trailing slash, no path).
- `REFRENS_APP_ID`, `REFRENS_URL_KEY`, `REFRENS_APP_SECRET` (optional — auto-invoicing; payment still unlocks if these fail or are omitted)
- `ANTHROPIC_API_KEY` (optional — powers the real AI chatbot via `api/chat.js`; if missing, unset, or
  the request fails for any reason, the chat widget silently falls back to the offline rule-based
  responder in `src/lib/ai-chat.functions.ts`, so the chat never just breaks)

Frontend build env (Vercel for combined, or wherever you build for Hostinger in the split case):

- `VITE_CASHFREE_ENV=production`
- `VITE_API_URL=` — leave empty for combined (same-origin). For split, set to the Vercel backend's
  URL, e.g. `https://rakhivibes-api.vercel.app` (no trailing slash).

These are **live production Cashfree keys** — any completed checkout charges a real card. Test the
flow with Cashfree's sandbox keys and `CASHFREE_ENV=sandbox` / `VITE_CASHFREE_ENV=sandbox` first if
you want a dry run.

## 2) Deploy the backend to Vercel

```bash
npm i -g vercel   # if not already installed
vercel             # first deploy, follow prompts
vercel --prod      # production deploy
```

Vercel auto-detects the Vite build (`npm run build` → `dist/`) and turns every file under `/api`
into a serverless function — this happens whether or not you end up using the frontend it builds.
`vercel.json` adds the SPA fallback rewrite for the frontend routes, which only matters if you're
using Vercel for the frontend too (combined setup).

**Split setup**: once deployed, copy the Vercel deployment URL (e.g. `https://rakhivibes-api.vercel.app`)
into `VITE_API_URL` for the Hostinger build, rebuild (`npm run build`), and re-upload `dist/` to
Hostinger as usual (`HOSTINGER_DEPLOY.md`).

## 3) Cashfree webhook (optional but recommended)

In the Cashfree dashboard, set the webhook URL to `https://<your-vercel-backend-domain>/api/webhook`.
This is a best-effort server-to-server confirmation log — the actual unlock happens client-side via
`/api/verify` right after checkout, since this project has no database to drive the webhook off of.

## Notes

- No amount is ever trusted from the browser — `/api/create-order` computes the charge from
  `TIER_PRICE` in `api/create-order.js` itself.
- Unlock state is stored in the visitor's own `localStorage` (`rakhi:unlocked:gold` /
  `rakhi:unlocked:platinum`), same pattern as the rest of this app's per-browser state. There's no
  login, so unlocking on one device/browser doesn't carry over to another.
- The AI chatbot ("Marvels") calls `api/chat.js` (Claude Haiku) first — the `ANTHROPIC_API_KEY` stays
  server-side there, unlike the reference implementation this was ported from, which shipped the key
  in the browser bundle via a `VITE_`-prefixed env var. Anyone with devtools open could extract a
  client-side key and run up usage on your account, so it's kept server-only here. If the API call
  fails for any reason (no key configured, network error, rate limit, or `/api` simply not deployed —
  e.g. a Hostinger-only static deploy with no backend at all), `src/lib/ai-chat.functions.ts`
  transparently falls back to its offline rule-based responder instead of showing an error.
