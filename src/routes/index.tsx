import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Crown, Gem, ArrowRight, Music, Bot, Mic, Palette, Heart, Camera } from "lucide-react";
import heroImg from "@/assets/hero-tying.jpg";
import thaliImg from "@/assets/hero-thali.jpg";
import familyImg from "@/assets/hero-family.jpg";
import decorImg from "@/assets/hero-decor.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rakhi Vibes — 60+ Premium Raksha Bandhan Templates | Silver Gold Platinum" },
      { name: "description", content: "Choose from 60+ luxury Rakhi templates with music, AI chatbot, voice control, real Indian family visuals. Silver, Gold aur Platinum tiers." },
      { property: "og:title", content: "Rakhi Vibes — 60+ Premium Raksha Bandhan Templates | Silver Gold Platinum" },
      { property: "og:description", content: "Choose from 60+ luxury Rakhi templates with music, AI chatbot, voice control, real Indian family visuals. Silver, Gold aur Platinum tiers." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[oklch(0.96_0.02_85)] via-[oklch(0.92_0.06_60)] to-[oklch(0.88_0.14_35)] text-[oklch(0.2_0.06_30)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-60 pointer-events-none mix-blend-multiply">
          <img src={heroImg} alt="" className="h-full w-full object-cover object-center" />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-[oklch(0.92_0.06_60)]/30 pointer-events-none" />

        <nav className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
          <div className="font-display text-2xl font-bold">
            <span className="text-gold-shine">Rakhi</span> <span className="font-hand">Vibes</span>
          </div>
          <div className="flex gap-2 text-sm">
            <Link to="/silver" className="hidden sm:inline-block px-3 py-1.5 rounded-full hover:bg-white/40">Silver</Link>
            <Link to="/gold" className="hidden sm:inline-block px-3 py-1.5 rounded-full hover:bg-white/40">Gold</Link>
            <Link to="/platinum" className="px-3 py-1.5 rounded-full bg-maroon-gold text-white font-medium shadow-soft">Platinum</Link>
          </div>
        </nav>

        <div className="relative z-10 mx-auto max-w-5xl px-6 py-16 sm:py-28 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-current/20 bg-white/80 px-3 py-1 text-xs uppercase tracking-widest backdrop-blur-sm">
            <Sparkles size={12} /> Raksha Bandhan 2026 · 60+ Templates · 100% Indian Vibes
          </div>
          <h1 className="mt-6 font-display text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.95]">
            Har Bhai-Behen<br />ke liye ek <span className="text-gold-shine">signature</span> card.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium text-[oklch(0.15_0.04_30)] bg-white/20 sm:bg-transparent rounded-xl p-2 sm:p-0 backdrop-blur-sm sm:backdrop-blur-none">
            Premium Rakhi templates with real Indian family photography, glitter drops, music player, aur AI chatbot jo aapke bolne pe design badal de.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/platinum" className="inline-flex items-center gap-2 rounded-full bg-royal-grad px-6 py-3.5 text-white font-medium shadow-platinum hover:scale-105 transition">
              Try Platinum <ArrowRight size={16} />
            </Link>
            <Link to="/silver" className="inline-flex items-center gap-2 rounded-full border border-current/30 bg-white/80 px-6 py-3.5 font-medium hover:bg-white transition">
              Start with Silver
            </Link>
          </div>
        </div>
      </section>

      {/* Tier cards Section with Light/Pastel gradients */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="mb-12 text-center">
          <div className="text-xs uppercase tracking-[0.4em] opacity-70">Choose Your Vibe</div>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl font-bold">Teen Categories · Ek Pyaara Message</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Silver Card */}
          <TierCard
            to="/silver" tier="Silver" count="10" icon={<Sparkles className="text-slate-500" />}
            title="Reshmi Bandhan"
            bullets={["1 page card", "Editable name & message", "Subtle petals / diyas / sparkles", "8 clean palettes"]}
            gradient="bg-gradient-to-br from-slate-50 to-slate-200 text-slate-900"
            img={thaliImg}
          />
          {/* Gold Card */}
          <TierCard
            to="/gold" tier="Gold" count="18" icon={<Crown className="text-amber-600" />}
            title="Sunehri Rishta"
            bullets={["2-3 pages · Rich layouts", "🎵 Music player + upload", "📸 Photo upload (bhai + behen)", "Real monuments · Taj, Qutub, Eiffel, Burj"]}
            gradient="bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 text-slate-900"
            img={familyImg}
            featured
          />
          {/* Platinum Card */}
          <TierCard
            to="/platinum" tier="Platinum" count="32" icon={<Gem className="text-fuchsia-500" />}
            title="Rajwada Signature"
            bullets={["3-5 pages · Cinematic", "🤖 AI Chatbot + 🎤 Voice control", "♾️ Unlimited photos", "Everything from Gold + luxe glow"]}
            gradient="bg-gradient-to-br from-fuchsia-100 via-rose-100 to-amber-100 text-slate-900"
            img={decorImg}
          />
        </div>
      </section>

      {/* Features */}
      <section className="bg-gradient-to-b from-transparent to-white/40 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Kya khaas hai?</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <Bot />, t: "AI Rakhi Sathi", d: "Bolo ya likho — 'background gulabi karo', 'poem likho' — bot sab kar dega. Hindi/English toggle." },
              { icon: <Mic />, t: "Voice Detector", d: "Awaz se templates edit karo. Web Speech API — bilkul mobile-friendly." },
              { icon: <Music />, t: "Bollywood Music", d: "'Phoolon Ka Taaron Ka', 'Bhaiya Mere Rakhi'… ya apna gaana upload karo." },
              { icon: <Camera />, t: "Real Photos", d: "Bhai-behen ki apni photos ya AI-generated Indian family scenes." },
              { icon: <Palette />, t: "Live Palette", d: "8+ luxury palettes. Kabhi bhi swap karo — data auto save." },
              { icon: <Heart />, t: "Loving Notes", d: "Ready-made sister→brother aur brother→sister messages, ya AI se generate karo." },
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
        <p className="mt-2 text-sm opacity-80">Made with ❤️ for every bhai-behen · Raksha Bandhan 2026</p>
      </footer>
    </div>
  );
}

function TierCard({ to, tier, count, icon, title, bullets, gradient, img, featured }: {
  to: "/silver" | "/gold" | "/platinum"; tier: string; count: string; icon: React.ReactNode; title: string; bullets: string[]; gradient: string; img: string; featured?: boolean;
}) {
  return (
    <Link to={to} className={`group relative overflow-hidden rounded-[2rem] p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-2xl ${gradient} ${featured ? "sm:scale-105 ring-4 ring-amber-200/40" : ""}`}>
      {/* Background visual element adjusted for lighter theme */}
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
    </Link>
  );
}