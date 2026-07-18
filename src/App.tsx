import { useMemo } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Sparkles, Crown, Gem, ArrowRight, Music, Bot, Mic, Palette, Heart, Camera, ArrowLeft } from "lucide-react";
import heroImg from "@/assets/hero-tying.jpg";
import thaliImg from "@/assets/hero-thali.jpg";
import familyImg from "@/assets/hero-family.jpg";
import decorImg from "@/assets/hero-decor.jpg";
import { templatesForTier, type Tier } from "@/data/templates";
import { IMAGES } from "@/data/images";
import { TemplateEngine } from "@/features/template/TemplateEngine";
import { findTemplate } from "@/data/templates";
import { decodeInviteState } from "@/lib/invite-link";
import type { TemplateState } from "@/features/template/useTemplateState";

function App({ tier }: { tier?: Tier }) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [searchParams] = useSearchParams();

  const isViewerRoute = location.pathname.startsWith("/t/");

  const templateData = useMemo(() => {
    if (!isViewerRoute) return null;
    const tierParam = params.tier as Tier | undefined;
    const idParam = params.id;
    const template = tierParam ? findTemplate(tierParam, idParam ?? "") : undefined;
    if (!template) return { template: null, locked: false, initialState: undefined };

    const encoded = searchParams.get("d");
    const initialState = encoded ? decodeInviteState(encoded) : null;
    return initialState
      ? { template, locked: true, initialState: initialState as Partial<TemplateState> }
      : { template, locked: false, initialState: undefined };
  }, [isViewerRoute, params.id, params.tier, searchParams]);

  if (isViewerRoute) {
    if (!templateData?.template) {
      return <div className="flex min-h-screen items-center justify-center">Template not found</div>;
    }
    return <TemplateEngine template={templateData.template} locked={templateData.locked} initialState={templateData.initialState} />;
  }

  if (tier) {
    return <Catalog tier={tier} onNavigate={navigate} />;
  }

  return <Landing onNavigate={navigate} />;
}

function Landing({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[oklch(0.96_0.02_85)] via-[oklch(0.92_0.06_60)] to-[oklch(0.88_0.14_35)] text-[oklch(0.2_0.06_30)]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-60 pointer-events-none mix-blend-multiply">
          <img src={heroImg} alt="" className="h-full w-full object-cover object-center" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-[oklch(0.92_0.06_60)]/30 pointer-events-none" />
        <nav className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
          <div className="font-display text-2xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
            Rakhi Vibes
          </div>
          <div className="flex gap-2 text-sm">
            <button onClick={() => onNavigate("/silver")} className="hidden sm:inline-block px-3 py-1.5 rounded-full hover:bg-white/40">Silver</button>
            <button onClick={() => onNavigate("/gold")} className="hidden sm:inline-block px-3 py-1.5 rounded-full hover:bg-white/40">Gold</button>
            <button onClick={() => onNavigate("/platinum")} className="px-3 py-1.5 rounded-full bg-maroon-gold text-white font-medium shadow-soft">Platinum</button>
          </div>
        </nav>
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-16 sm:py-28 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-current/20 bg-white/80 px-3 py-1 text-xs uppercase tracking-widest backdrop-blur-sm">
            <Sparkles size={12} /> Raksha Bandhan 2026 · 60+ Templates
          </div>
          <h1 className="mt-6 font-display text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.95] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
            A <span className="text-gold-shine">signature</span> card<br />for every brother & sister.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium text-[oklch(0.15_0.04_30)] bg-white/20 sm:bg-transparent rounded-xl p-2 sm:p-0 backdrop-blur-sm sm:backdrop-blur-none">
            Premium Rakhi templates with real Indian family photography, glitter drops, a music player, and an AI chatbot that redesigns your card as you speak.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => onNavigate("/platinum")} className="inline-flex items-center gap-2 rounded-full bg-royal-grad px-6 py-3.5 text-white font-medium shadow-platinum hover:scale-105 transition">
              Try Platinum <ArrowRight size={16} />
            </button>
            <button onClick={() => onNavigate("/silver")} className="inline-flex items-center gap-2 rounded-full border border-current/30 bg-white/80 px-6 py-3.5 font-medium hover:bg-white transition">
              Start with Silver
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="mb-12 text-center">
          <div className="text-xs uppercase tracking-[0.4em] opacity-70">Choose Your Vibe</div>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl font-bold">Three Tiers · One Heartfelt Message</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <TierCard onNavigate={onNavigate} to="/silver" tier="Silver" count="10" icon={<Sparkles className="text-slate-500" />} title="Reshmi Bandhan" bullets={["1 page card", "Editable name & message", "Subtle petals / diyas / sparkles", "8 clean palettes"]} gradient="bg-gradient-to-br from-slate-50 to-slate-200 text-slate-900" img={thaliImg} />
          <TierCard onNavigate={onNavigate} to="/gold" tier="Gold" count="18" icon={<Crown className="text-amber-600" />} title="Sunehri Rishta" bullets={["2-3 pages · Rich layouts", "🎵 Music player + upload", "📸 Photo upload (brother + sister)", "Real monuments · Taj, Qutub, Eiffel, Burj"]} gradient="bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 text-slate-900" img={familyImg} featured />
          <TierCard onNavigate={onNavigate} to="/platinum" tier="Platinum" count="32" icon={<Gem className="text-fuchsia-500" />} title="Rajwada Signature" bullets={["3-5 pages · Cinematic", "🤖 AI Chatbot + 🎤 Voice control", "♾️ Unlimited photos", "Everything from Gold + luxe glow"]} gradient="bg-gradient-to-br from-fuchsia-100 via-rose-100 to-amber-100 text-slate-900" img={decorImg} />
        </div>
      </section>

      <section className="bg-gradient-to-b from-transparent to-white/40 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold">What Makes It Special?</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <Bot />, t: "AI Rakhi Companion", d: "Type or speak — 'make background pink', 'write a poem' — the bot handles it. Hindi/English toggle." },
              { icon: <Mic />, t: "Voice Control", d: "Edit templates with your voice. Powered by the Web Speech API — fully mobile-friendly." },
              { icon: <Music />, t: "Bollywood Music", d: "'Phoolon Ka Taaron Ka', 'Bhaiya Mere Rakhi'… or upload your own song." },
              { icon: <Camera />, t: "Real Photos", d: "Your own brother-sister photos, or AI-generated Indian family scenes." },
              { icon: <Palette />, t: "Live Palette", d: "8+ luxury palettes. Swap anytime — your changes save automatically." },
              { icon: <Heart />, t: "Loving Notes", d: "Ready-made sister-to-brother and brother-to-sister messages, or generate your own with AI." },
            ].map((f, i) => (
              <div key={i} className="rounded-3xl border border-current/10 bg-white/70 p-6 backdrop-blur hover:shadow-soft transition">
                <div className="mb-3 inline-flex rounded-full bg-maroon-gold p-3 text-white">{f.icon}</div>
                <div className="font-display text-xl font-semibold">{f.t}</div>
                <p className="mt-1.5 text-sm opacity-70">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[oklch(0.3_0.1_25)] py-10 text-center text-white">
        <div className="font-hand text-2xl">— Rakhi Vibes —</div>
        <p className="mt-2 text-sm opacity-80">Made with ❤️ for every brother and sister · Raksha Bandhan 2026</p>
      </footer>
    </div>
  );
}

function Catalog({ tier, onNavigate }: { tier: Tier; onNavigate: (path: string) => void }) {
  const templates = templatesForTier(tier);
  const meta = {
    silver: { title: "Silver Templates", desc: "10 elegant 1-page cards — simple, sweet, and full of blessings.", badge: "SILVER · 10", hero: "bg-gradient-to-br from-slate-100 to-slate-300 text-slate-900" },
    gold: { title: "Gold Templates", desc: "18 rich 2-3 page templates with music, monuments, and family photos.", badge: "GOLD · 18", hero: "bg-gradient-to-br from-amber-200 via-yellow-300 to-orange-400 text-black" },
    platinum: { title: "Platinum Templates", desc: "32 immersive 3-5 page experiences with AI chatbot, voice control, and unlimited photos.", badge: "PLATINUM · 32", hero: "bg-gradient-to-br from-fuchsia-500 via-rose-500 to-amber-400 text-white" },
  }[tier];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[oklch(0.98_0.02_85)] to-[oklch(0.9_0.08_50)]">
      <div className={`${meta.hero} px-6 py-14 sm:py-20 relative overflow-hidden`}>
        <button onClick={() => onNavigate("/")} className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest opacity-90 hover:opacity-100">
          <ArrowLeft size={14} /> Home
        </button>
        <div className="mt-4 max-w-4xl">
          <div className="inline-flex items-center gap-1 rounded-full bg-black/20 px-3 py-1 text-[10px] font-bold tracking-widest">{meta.badge}</div>
          <h1 className="mt-3 font-display text-5xl sm:text-7xl font-bold">{meta.title}</h1>
          <p className="mt-2 text-lg opacity-90 max-w-2xl">{meta.desc}</p>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t, idx) => {
            const hash = [...t.id].reduce((a, c) => a + c.charCodeAt(0), 0) + idx * 37;
            const hue = (hash * 47) % 360;
            const sat = 110 + (hash % 60);
            const rot = ((hash % 7) - 3);
            return (
              <button key={t.id} onClick={() => onNavigate(`/t/${t.tier}/${t.id}`)} className="group overflow-hidden rounded-3xl bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-2xl animate-fade-up text-left" style={{ animationDelay: `${idx * 30}ms` }}>
                <div className="relative aspect-[4/5] overflow-hidden" style={{ background: t.palette.bg }}>
                  <img src={IMAGES[t.heroImage]} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-110" style={{ filter: `hue-rotate(${hue}deg) saturate(${sat}%)`, transform: `rotate(${rot}deg) scale(1.08)` }} />
                  <div className="absolute inset-0 opacity-40 mix-blend-soft-light" style={{ background: `radial-gradient(circle at ${(hash % 80) + 10}% ${(hash * 3 % 80) + 10}%, ${t.palette.accent}, transparent 65%)` }} />
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
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TierCard({ to, tier, count, icon, title, bullets, gradient, img, featured, onNavigate }: { to: string; tier: string; count: string; icon: React.ReactNode; title: string; bullets: string[]; gradient: string; img: string; featured?: boolean; onNavigate: (path: string) => void; }) {
  return (
    <button onClick={() => onNavigate(to)} className={`group relative overflow-hidden rounded-[2rem] p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-2xl ${gradient} ${featured ? "sm:scale-105 ring-4 ring-amber-200/40" : ""} text-left`}>
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-20 overflow-hidden mix-blend-multiply">
        <img src={img} alt="" className="h-full w-full object-cover blur-sm" />
      </div>
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-75 font-semibold">
            {icon} {tier}
          </div>
          <div className="text-3xl font-bold font-display opacity-85">{count}</div>
        </div>
        <h3 className="mt-4 font-display text-3xl font-bold">{title}</h3>
        <ul className="mt-4 space-y-1.5 text-sm opacity-90">
          {bullets.map((b, i) => <li key={i}>• {b}</li>)}
        </ul>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest group-hover:gap-3 transition-all">
          Browse {tier} <ArrowRight size={14} />
        </div>
      </div>
    </button>
  );
}

export default App;
