import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Music, Bot, Mic } from "lucide-react";
import { templatesForTier, type Tier } from "@/data/templates";
import { IMAGES } from "@/data/images";

const TITLES: Record<Tier, { title: string; desc: string; badge: string; hero: string }> = {
  silver: { title: "Silver Templates", desc: "10 elegant 1-page cards — simple, sweet, aur ekdum shubh.", badge: "SILVER · 10", hero: "bg-gradient-to-br from-slate-100 to-slate-300 text-slate-900" },
  gold: { title: "Gold Templates", desc: "18 rich 2-3 page templates with music, monuments, aur family photos.", badge: "GOLD · 18", hero: "bg-gradient-to-br from-amber-200 via-yellow-300 to-orange-400 text-black" },
  platinum: { title: "Platinum Templates", desc: "32 immersive 3-5 page experiences with AI chatbot, voice control, aur unlimited photos.", badge: "PLATINUM · 32", hero: "bg-gradient-to-br from-fuchsia-500 via-rose-500 to-amber-400 text-white" },
};

export const Route = createFileRoute("/$tier")({
  head: ({ params }) => {
    const tier = params.tier as Tier;
    if (!TITLES[tier]) return { meta: [{ title: "Not found" }] };
    const t = TITLES[tier];
    return {
      meta: [
        { title: `${t.title} — Rakhi Vibes` },
        { name: "description", content: t.desc },
        { property: "og:title", content: `${t.title} — Rakhi Vibes` },
        { property: "og:description", content: t.desc },
      ],
    };
  },
  loader: ({ params }) => {
    if (!["silver", "gold", "platinum"].includes(params.tier)) throw notFound();
    return { tier: params.tier as Tier };
  },
  component: Catalog,
});

function Catalog() {
  const data = Route.useLoaderData();
  const tier = data.tier as Tier;
  const templates = templatesForTier(tier);
  const meta = TITLES[tier];
  return (
    <div className="min-h-screen bg-gradient-to-b from-[oklch(0.98_0.02_85)] to-[oklch(0.9_0.08_50)]">
      <div className={`${meta.hero} px-6 py-14 sm:py-20 relative overflow-hidden`}>
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest opacity-90 hover:opacity-100">
          <ArrowLeft size={14} /> Home
        </Link>
        <div className="mt-4 max-w-4xl">
          <div className="inline-flex items-center gap-1 rounded-full bg-black/20 px-3 py-1 text-[10px] font-bold tracking-widest">{meta.badge}</div>
          <h1 className="mt-3 font-display text-5xl sm:text-7xl font-bold">{meta.title}</h1>
          <p className="mt-2 text-lg opacity-90 max-w-2xl">{meta.desc}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {tier !== "silver" && <Chip icon={<Music size={12} />} label="Music Player" />}
            {tier === "platinum" && <Chip icon={<Bot size={12} />} label="AI Chatbot" />}
            {tier === "platinum" && <Chip icon={<Mic size={12} />} label="Voice Control" />}
            <Chip icon={<Sparkles size={12} />} label="Editable Live" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t, idx) => {
            // Deterministic visual differentiation per template — same base image
            // gets a unique hue, saturation, and blend so no two covers look alike.
            const hash = [...t.id].reduce((a, c) => a + c.charCodeAt(0), 0) + idx * 37;
            const hue = (hash * 47) % 360;
            const sat = 110 + (hash % 60);
            const rot = ((hash % 7) - 3);
            const blends = ["overlay", "soft-light", "multiply", "screen", "color-burn", "hard-light"] as const;
            const blend = blends[hash % blends.length];
            return (
            <Link
              key={t.id}
              to="/t/$tier/$id"
              params={{ tier: t.tier, id: t.id }}
              className="group overflow-hidden rounded-3xl bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-2xl animate-fade-up"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <div className="relative aspect-[4/5] overflow-hidden" style={{ background: t.palette.bg }}>
                <img
                  src={IMAGES[t.heroImage]}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-75 transition-transform group-hover:scale-110"
                  style={{ filter: `hue-rotate(${hue}deg) saturate(${sat}%)`, mixBlendMode: blend, transform: `rotate(${rot}deg) scale(1.08)` }}
                />
                <div
                  className="absolute inset-0 opacity-60"
                  style={{ background: `radial-gradient(circle at ${(hash % 80) + 10}% ${(hash * 3 % 80) + 10}%, ${t.palette.accent}55, transparent 60%), ${t.palette.bg}` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                  <span className="rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-bold tracking-widest text-white backdrop-blur">#{t.id.toUpperCase()}</span>
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">{t.decoration}</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <div className="font-display text-3xl font-bold drop-shadow-lg">{t.name}</div>
                  <div className="mt-1 text-xs italic opacity-90">{t.tagline}</div>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-3 text-xs">
                <span className="uppercase tracking-widest opacity-70">{t.layout.replace(/-/g, " ")}</span>
                <span className="font-medium text-primary group-hover:underline">Open →</span>
              </div>
            </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-black/20 px-2.5 py-1 backdrop-blur">
      {icon} {label}
    </span>
  );
}
