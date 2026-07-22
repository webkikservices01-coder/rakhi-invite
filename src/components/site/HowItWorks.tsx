import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MousePointerClick,
  Palette,
  CreditCard,
  Share2,
  Heart,
  Gem,
  ArrowRight,
} from "lucide-react";

type VerticalKey = "rakhi" | "wedding";

const STEPS: Record<VerticalKey, { icon: typeof MousePointerClick; title: string; desc: string }[]> = {
  rakhi: [
    {
      icon: MousePointerClick,
      title: "Pick a template",
      desc: "Browse 60+ Rakhi designs across Silver (free to try), Gold (₹149) and Platinum (₹299).",
    },
    {
      icon: Palette,
      title: "Personalize it",
      desc: "Add brother & sister names, upload photos, pick a song and write your message — it saves as you type.",
    },
    {
      icon: CreditCard,
      title: "Preview, then unlock",
      desc: "Try Silver free. Loved it? Unlock Gold or Platinum instantly with one secure payment.",
    },
    {
      icon: Share2,
      title: "Share your link",
      desc: "Get one unique link — send it on WhatsApp, SMS or Instagram. Opens like a mini website, no app needed.",
    },
  ],
  wedding: [
    {
      icon: MousePointerClick,
      title: "Choose country & tier",
      desc: "65 cinematic templates across India, UAE, France, USA & Italy in Silver, Gold or Platinum.",
    },
    {
      icon: Palette,
      title: "Customize every detail",
      desc: "Names, dates, venue map, ceremonies & photos — or just chat with the AI concierge to tweak it for you.",
    },
    {
      icon: CreditCard,
      title: "Preview, then unlock",
      desc: "Browse free, then unlock Gold (₹499) or Platinum (₹999) for music, RSVP and the guest wishes wall.",
    },
    {
      icon: Share2,
      title: "Share & collect RSVPs",
      desc: "Send your link anywhere — guests can view, RSVP and leave wishes right on the page.",
    },
  ],
};

const THEME: Record<
  VerticalKey,
  { label: string; icon: typeof Heart; iconBg: string; activeTab: string; cta: string; ctaLabel: string }
> = {
  rakhi: {
    label: "Rakhi",
    icon: Heart,
    iconBg: "bg-gradient-to-br from-rose-500 to-red-600",
    activeTab: "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-soft",
    cta: "/rakhi",
    ctaLabel: "Start a Rakhi Invitation",
  },
  wedding: {
    label: "Wedding",
    icon: Gem,
    iconBg: "bg-gradient-to-br from-fuchsia-500 to-amber-500",
    activeTab: "bg-gradient-to-r from-fuchsia-500 to-amber-500 text-white shadow-soft",
    cta: "/wedding",
    ctaLabel: "Start a Wedding Invitation",
  },
};

export function HowItWorks() {
  const [active, setActive] = useState<VerticalKey>("rakhi");
  const steps = STEPS[active];
  const theme = THEME[active];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <div className="mb-10 text-center">
        <div className="text-xs uppercase tracking-[0.4em] opacity-70">Simple by design</div>
        <h2 className="mt-2 font-display text-4xl sm:text-5xl font-bold">How It Works</h2>
        <p className="mx-auto mt-3 max-w-md text-sm opacity-70">
          Same easy flow either way — pick which one you're sending to see the exact steps.
        </p>

        <div className="mt-6 inline-flex items-center gap-1 rounded-full border border-current/15 bg-white/60 p-1 backdrop-blur">
          {(Object.keys(THEME) as VerticalKey[]).map((key) => {
            const t = THEME[key];
            const isActive = active === key;
            return (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all ${
                  isActive ? t.activeTab : "opacity-60 hover:opacity-100"
                }`}
              >
                <t.icon size={13} /> {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <div
            key={step.title}
            className="relative rounded-3xl border border-current/10 bg-white/70 p-6 backdrop-blur transition hover:-translate-y-1 hover:shadow-soft"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-white shadow-soft ${theme.iconBg}`}>
                <step.icon size={19} />
              </div>
              <div className="font-display text-2xl font-bold opacity-30">{i + 1}</div>
            </div>
            <div className="font-display text-lg font-semibold">{step.title}</div>
            <p className="mt-1.5 text-sm opacity-70">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          to={theme.cta}
          className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:scale-105 ${theme.iconBg}`}
        >
          {theme.ctaLabel} <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
