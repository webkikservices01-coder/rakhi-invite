import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Extracted by regex rather than importing the data modules directly — those
// also import real image assets via Vite's `?url`-style resolution, which
// plain Node can't load outside a Vite build.
const rootDir = process.cwd();

const rakhiSource = readFileSync(join(rootDir, "src/data/templates.ts"), "utf8");
const rakhiTemplates = [
  ...rakhiSource.matchAll(/t\("(\w+)",\s*"(silver|gold|platinum)"/g),
].map((m) => ({ id: m[1], tier: m[2] }));

const weddingSource = readFileSync(
  join(rootDir, "src/verticals/wedding/data/templates.ts"),
  "utf8",
);
const weddingSlugs = [
  ...weddingSource.matchAll(/^\s*slug:\s*"([a-z0-9-]+)"/gm),
].map((m) => m[1]);

const BASE_URL = "";

const entries = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/rakhi", changefreq: "weekly", priority: "0.9" },
  { path: "/rakhi/silver", changefreq: "weekly", priority: "0.8" },
  { path: "/rakhi/gold", changefreq: "weekly", priority: "0.8" },
  { path: "/rakhi/platinum", changefreq: "weekly", priority: "0.8" },
  ...rakhiTemplates.map(({ tier, id }) => ({
    path: `/rakhi/t/${tier}/${id}`,
    changefreq: "monthly",
    priority: "0.7",
  })),
  { path: "/wedding", changefreq: "weekly", priority: "0.9" },
  { path: "/wedding/templates", changefreq: "weekly", priority: "0.8" },
  { path: "/wedding/pricing", changefreq: "monthly", priority: "0.7" },
  ...weddingSlugs.map((slug) => ({
    path: `/wedding/templates/${slug}`,
    changefreq: "monthly",
    priority: "0.7",
  })),
];

const urls = entries.map(
  (e) =>
    `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
);
const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...urls,
  `</urlset>`,
].join("\n");

writeFileSync(join(rootDir, "public/sitemap.xml"), xml, "utf8");
console.log(`Generated sitemap.xml with ${entries.length} URLs`);
