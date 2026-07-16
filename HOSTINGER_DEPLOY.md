# Hostinger deployment guide

This app is an SSR/Node-based TanStack Start project (with an AI chat server function). It will not work on basic shared Apache hosting without a Node.js runtime.

## Recommended setup — Hostinger Node.js hosting or VPS
This gets you the full site **and** the working AI chat ("Marvels").

### 1) Install dependencies
```bash
npm install
```

### 2) Build for production
```bash
npm run build
```
`vite.config.ts` pins the Nitro build to the `node-server` preset, so this produces a plain Node server bundle at `.output/server/index.mjs` (not a Cloudflare Worker bundle).

### 3) Set environment variables
In Hostinger's Node app environment settings:
- `PORT=3000`
- `ANTHROPIC_API_KEY=your_api_key`

The AI chat ("Marvels") feature calls Anthropic directly — without the key it replies with a friendly "not available" message instead of failing.

### 4) Start the app
```bash
npm start
```
This runs `node .output/server/index.mjs`.

## If your Hostinger plan only supports static hosting
```bash
npm run build:hostinger
```
This creates a static-only package at `dist/` (with an `.htaccess` for SPA-style routing) that you can upload directly. Note the trade-off:
- The template pages, colors, and layouts work fine.
- The AI chat will **not** work — it's a server function that needs the Node runtime from the option above, not a static file server.
