# Deploy guide

> **Note:** Gold/Platinum templates now require a Cashfree payment to Deploy, which needs the
> `/api/*` serverless functions in this repo — those don't run on Hostinger's static hosting. See
> `VERCEL_DEPLOY.md` if you want payments working. This guide still applies for a Silver-only /
> no-payments static deploy (the Deploy button will fail on Gold/Platinum since `/api` won't exist).

This is a plain **React SPA** (Vite + react-router-dom) — no server, no API keys, no Node runtime needed at runtime for the Silver tier. The AI chatbot ("Marvels") runs entirely in the browser (rule-based, in `src/lib/ai-chat.functions.ts`), so it works on any static host.

## 1) Install dependencies
```bash
npm install
```

## 2) Build for production
```bash
npm run build
```
This produces a fully static site in `dist/` — `index.html`, `assets/`, and a copy of everything in `public/` (including `.htaccess` and `_redirects`).

## 3) Deploy `dist/` anywhere static

**Hostinger (shared hosting)**
Upload the contents of `dist/` to `public_html/` (via File Manager or FTP). The included `.htaccess` handles SPA routing (`/silver`, `/t/:tier/:id`, etc. all resolve to `index.html`) and asset caching.

**Netlify / Vercel / Cloudflare Pages**
Point the build command to `npm run build` and the publish/output directory to `dist`. The included `public/_redirects` (`/* /index.html 200`) already handles SPA routing for Netlify; Vercel and Cloudflare Pages auto-detect the Vite SPA pattern.

**Any other static host (S3, GitHub Pages, nginx, etc.)**
Upload `dist/` as-is. Just make sure unknown paths fall back to `index.html` (client-side routing) — e.g. an nginx `try_files $uri /index.html;` rule.

## Notes
- For Silver, "Deploying" an invite (the Deploy button) just saves the card to the visitor's own browser `localStorage` and copies a shareable link — it does not call any backend. No environment variables are required for Silver-only.
- For Gold/Platinum, Deploy first requires a Cashfree payment (see `VERCEL_DEPLOY.md`) — this needs a deploy target that runs `/api/*`, which Hostinger's static hosting does not.
