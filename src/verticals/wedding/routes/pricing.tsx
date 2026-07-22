import { Link } from "react-router-dom";
import { SiteShell } from "@/verticals/wedding/components/site/SiteShell";
import { ScrollingBanner } from "@/verticals/wedding/components/site/ScrollingBanner";
import { Reveal } from "@/verticals/wedding/components/site/Reveal";
import { useDocumentHead } from "@/verticals/wedding/lib/use-document-head";
import { TIERS, TEMPLATES, type Tier } from "@/verticals/wedding/data/templates";

const prices: Record<
  Tier,
  { one: string; sub: string; features: string[]; highlight?: boolean }
> = {
  silver: {
    one: "₹ 2,499",
    sub: "one-time · lifetime hosting",
    features: [
      "Any Silver template",
      "Custom names, dates, venue",
      "Photo gallery (up to 12)",
      "Simple RSVP form",
      "Basic support",
    ],
  },
  gold: {
    one: "₹ 4,999",
    sub: "one-time · lifetime hosting",
    highlight: true,
    features: [
      "Any Silver or Gold template",
      "Background music",
      "Ceremonies grid + family section",
      "Animated section reveals",
      "Priority support",
    ],
  },
  platinum: {
    one: "₹ 9,999",
    sub: "one-time · lifetime hosting",
    features: [
      "Any template — Silver, Gold or Platinum",
      "Mandala entry loader + 3D parallax hero",
      "Live chat concierge",
      "Guest wishes wall + story timeline",
      "Custom monument background swap",
      "Dedicated white-glove support",
    ],
  },
};

export default function PricingPage() {
  useDocumentHead({
    title: "Pricing · Dream Wedding",
    description:
      "Simple pricing across Silver, Gold and Platinum wedding invitation template tiers.",
  });

  return (
    <SiteShell>
      <section className="py-24 text-center">
        <div className="mx-auto max-w-3xl px-5">
          <Reveal>
            <p
              className="text-xs uppercase tracking-[0.4em] text-primary"
              style={{ fontFamily: "var(--font-label)" }}
            >
              Simple pricing
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h1
              className="mt-3 wt-text-gradient font-bold"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 6vw, 64px)",
              }}
            >
              Pick a tier. Send an invitation the internet remembers.
            </h1>
          </Reveal>
        </div>
        <div className="mt-12">
          <ScrollingBanner durationSeconds={44} />
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 md:grid-cols-3">
          {TIERS.map((t, i) => {
            const p = prices[t.id];
            const count = TEMPLATES.filter((tp) => tp.tier === t.id).length;
            return (
              <Reveal key={t.id} delay={i * 120}>
                <div
                  className="group relative overflow-hidden rounded-3xl border p-8 backdrop-blur transition-transform duration-500 hover:-translate-y-2"
                  style={{
                    background: p.highlight
                      ? "linear-gradient(160deg, color-mix(in oklab, var(--color-primary) 20%, transparent), transparent)"
                      : "color-mix(in oklab, var(--color-card) 60%, transparent)",
                    borderColor: p.highlight
                      ? "var(--color-primary)"
                      : "color-mix(in oklab, var(--color-primary) 25%, transparent)",
                    boxShadow: p.highlight
                      ? "0 24px 60px rgba(212,175,55,.25)"
                      : "0 24px 60px rgba(0,0,0,.35)",
                  }}
                >
                  {p.highlight && (
                    <div
                      className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-primary-foreground"
                      style={{ fontFamily: "var(--font-label)" }}
                    >
                      Most popular
                    </div>
                  )}
                  <div
                    className="text-[10px] uppercase tracking-[0.35em] text-primary"
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    {t.label}
                  </div>
                  <div
                    className="mt-3 text-5xl font-bold text-foreground"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {p.one}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {p.sub}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {count} templates included
                  </p>
                  <ul className="mt-6 space-y-2 text-sm">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2 text-foreground/90">
                        <span className="mt-1 text-primary">✦</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/wedding/templates?tier=${t.id}`}
                    className="mt-8 inline-block w-full rounded-full py-3 text-center text-xs uppercase tracking-[0.25em] transition-transform duration-300 group-hover:-translate-y-0.5"
                    style={{
                      fontFamily: "var(--font-label)",
                      background: p.highlight
                        ? "var(--gradient-gold)"
                        : "transparent",
                      color: p.highlight
                        ? "var(--primary-foreground)"
                        : "var(--color-primary)",
                      border: p.highlight
                        ? "1px solid transparent"
                        : "1px solid color-mix(in oklab, var(--color-primary) 50%, transparent)",
                    }}
                  >
                    Browse {t.label} Templates
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>
    </SiteShell>
  );
}
