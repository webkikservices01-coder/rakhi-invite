import { useRef } from "react";
import { Link } from "react-router-dom";
import { SiteShell } from "@/verticals/wedding/components/site/SiteShell";
import { Reveal } from "@/verticals/wedding/components/site/Reveal";
import { CountUp } from "@/verticals/wedding/components/site/CountUp";
import { useDocumentHead } from "@/verticals/wedding/lib/use-document-head";
import { COUNTRIES, TEMPLATES, TIERS, type Tier } from "@/verticals/wedding/data/templates";
import monumentTaj from "@/verticals/wedding/assets/monument-taj.jpg";
import monumentBurj from "@/verticals/wedding/assets/monument-burj.jpg";
import monumentEiffel from "@/verticals/wedding/assets/monument-eiffel.jpg";
import monumentVenice from "@/verticals/wedding/assets/monument-venice.jpg";
import monumentBeach from "@/verticals/wedding/assets/monument-beach.jpg";

const heroImages = [
  monumentTaj,
  monumentBurj,
  monumentEiffel,
  monumentVenice,
  monumentBeach,
];

export default function Home() {
  useDocumentHead({
    title: "Dream Wedding · Premium Wedding Invitation Templates",
    description:
      "65 country-based wedding invitation templates — a large India-focused collection alongside UAE, France, USA and Italy — in Silver, Gold and Platinum tiers with 3D parallax and monument backdrops.",
  });
  const platinum = TEMPLATES.filter((t) => t.tier === "platinum");

  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="wt-kb absolute inset-0"
            style={{
              backgroundImage: `url(${monumentTaj})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 40%, var(--color-background) 95%)",
            }}
          />
          <div
            className="site-orb"
            style={{
              top: "-6%",
              left: "8%",
              width: "340px",
              height: "340px",
              background: "radial-gradient(circle, #f4e0b4, transparent 70%)",
            }}
          />
          <div
            className="site-orb"
            style={{
              top: "18%",
              right: "6%",
              width: "280px",
              height: "280px",
              background: "radial-gradient(circle, #e08c74, transparent 70%)",
              animationDelay: "-6s",
            }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl px-5 pt-24 pb-28 text-center md:pt-36 md:pb-40">
          <Reveal>
            <p
              className="text-xs uppercase tracking-[0.5em] text-primary"
              style={{ fontFamily: "var(--font-label)" }}
            >
              Silver · Gold · Platinum
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h1
              className="mt-4 wt-text-gradient font-bold"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 5vw, 60px)",
                lineHeight: 1.08,
                letterSpacing: "0.02em",
                filter: "drop-shadow(0 6px 30px rgba(0,0,0,.6))",
              }}
            >
              The World's Weddings,
              <span className="block wt-shimmer-gold">One Studio.</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Cinematic invitation templates set against the Taj, Burj Khalifa,
              Eiffel Tower, Venice canals and the Malibu coast. Pick a country,
              pick a tier — every one is a live, feature-rich site.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/wedding/templates"
                className="group relative overflow-hidden rounded-full px-8 py-4 text-sm uppercase tracking-[0.25em] text-primary-foreground transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(212,175,55,0.35)]"
                style={{
                  fontFamily: "var(--font-label)",
                  background: "var(--gradient-gold)",
                  boxShadow: "var(--shadow-glow)",
                }}
              >
                <span className="relative">
                  Browse {TEMPLATES.length} Templates
                </span>
              </Link>
              <Link
                to="/wedding/templates/india-taj-heritage"
                className="rounded-full border border-primary/60 px-8 py-4 text-sm uppercase tracking-[0.25em] text-primary transition duration-300 hover:-translate-y-1 hover:bg-primary/10"
                style={{ fontFamily: "var(--font-label)" }}
              >
                Live Preview
              </Link>
            </div>
          </Reveal>

          {/* Floating monument strip */}
          <Reveal delay={420}>
            <div className="mt-16 flex flex-wrap items-center justify-center gap-4 opacity-80">
              {heroImages.map((src, i) => (
                <div
                  key={i}
                  className="wt-float relative h-16 w-24 overflow-hidden rounded-lg border border-primary/40 transition-transform duration-500 hover:scale-110 hover:border-primary md:h-20 md:w-32"
                  style={{ animationDelay: `${i * 0.4}s` }}
                >
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-b border-border/40 py-14">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-4 px-5 text-center">
          {[
            { value: TEMPLATES.length, label: "Templates" },
            { value: COUNTRIES.length, label: "Countries" },
            { value: TIERS.length, label: "Tiers" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 120}>
              <div
                className="text-4xl font-bold text-primary md:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <CountUp value={s.value} />
              </div>
              <div
                className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground"
                style={{ fontFamily: "var(--font-label)" }}
              >
                {s.label}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TIERS */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <SectionHeader
              eyebrow="Choose your tier"
              title="Silver, Gold, Platinum"
              sub="Every tier is polished. Higher tiers unlock more features, more motion, more monuments."
            />
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {TIERS.map((t, i) => (
              <Reveal key={t.id} delay={i * 110}>
                <TierCard tier={t.id} label={t.label} blurb={t.blurb} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COUNTRIES */}
      <section className="py-24 border-t border-border/40">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <SectionHeader
              eyebrow="Five countries · 65 templates"
              title="A story for every skyline"
              sub="India leads with dozens of region-specific editions — Punjabi, Bengali, Tamil, Kerala, Rajasthani and more — alongside curated UAE, France, USA and Italy collections."
            />
          </Reveal>
          <div className="mt-14 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {COUNTRIES.map((c, i) => {
              const t = TEMPLATES.find(
                (tp) => tp.country === c.id && tp.tier === "platinum",
              )!;
              return (
                <Reveal key={c.id} delay={i * 90}>
                  <Link
                    to={`/wedding/templates?country=${c.id}`}
                    className="group relative block aspect-[3/4] overflow-hidden rounded-3xl border border-primary/30 transition-transform duration-500 hover:-translate-y-1.5"
                    style={{ boxShadow: "0 20px 60px rgba(0,0,0,.35)" }}
                  >
                    <img
                      src={t.hero}
                      alt={c.label}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.9))",
                      }}
                    />
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        boxShadow: "inset 0 0 0 2px var(--color-primary)",
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-center">
                      <div
                        className="text-2xl font-bold text-primary"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {c.label}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {c.blurb}
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* FLAGSHIPS */}
      <section className="py-24 border-t border-border/40">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <SectionHeader
              eyebrow="Featured · Platinum"
              title="The flagship editions"
              sub="Five destination invitations, fully loaded. Music, 3D parallax, chat concierge, wishes wall."
            />
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {platinum.map((t, i) => (
              <Reveal key={t.slug} delay={(i % 6) * 90}>
                <Link
                  to={`/wedding/templates/${t.slug}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-3xl border border-primary/30 transition-transform duration-500 hover:-translate-y-1.5"
                  style={{ boxShadow: "0 24px 60px rgba(0,0,0,.4)" }}
                >
                  <img
                    src={t.hero}
                    alt={t.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 35%, rgba(0,0,0,0.92))",
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div
                      className="text-[10px] uppercase tracking-[0.4em] text-primary"
                      style={{ fontFamily: "var(--font-label)" }}
                    >
                      {t.countryLabel} · Platinum
                    </div>
                    <div
                      className="mt-2 text-2xl font-bold text-[oklch(0.96_0.02_80)]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {t.name}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {t.tagline}
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border/40 text-center">
        <div className="mx-auto max-w-3xl px-5">
          <Reveal>
            <h2
              className="wt-text-gradient font-bold"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 6vw, 60px)",
              }}
            >
              Ready to send yours?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Pick a template, personalise the names, dates and venue — publish
              a beautiful, cinematic invitation in minutes.
            </p>
            <Link
              to="/wedding/templates"
              className="mt-10 inline-block rounded-full px-10 py-4 text-sm uppercase tracking-[0.25em] text-primary-foreground transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(212,175,55,0.35)]"
              style={{
                fontFamily: "var(--font-label)",
                background: "var(--gradient-gold)",
                boxShadow: "var(--shadow-glow)",
              }}
            >
              Explore all templates
            </Link>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}

function SectionHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub: string;
}) {
  return (
    <div className="text-center">
      <p
        className="text-xs uppercase tracking-[0.4em] text-primary"
        style={{ fontFamily: "var(--font-label)" }}
      >
        {eyebrow}
      </p>
      <h2
        className="mt-3 wt-text-gradient font-bold"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(30px, 5.4vw, 52px)",
        }}
      >
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{sub}</p>
    </div>
  );
}

function TierCard({
  tier,
  label,
  blurb,
}: {
  tier: Tier;
  label: string;
  blurb: string;
}) {
  const count = TEMPLATES.filter((t) => t.tier === tier).length;
  const featureLists: Record<Tier, string[]> = {
    silver: [
      "Hero with names & date",
      "Live countdown",
      "Venue with map",
      "Photo gallery",
      "Simple RSVP",
    ],
    gold: [
      "All of Silver, plus:",
      "Background music",
      "Ceremonies grid",
      "Family section",
      "Animated section reveals",
    ],
    platinum: [
      "All of Gold, plus:",
      "Mandala entry loader",
      "3D parallax monument hero",
      "Live chat concierge",
      "Guest wishes wall",
      "Cinematic 3D photo tilt",
    ],
  };
  const swatch: Record<Tier, string> = {
    silver: "linear-gradient(135deg, #d6d6d6, #a4a4a4)",
    gold: "linear-gradient(135deg, #f6d97e, #b8871f)",
    // Darker leading stop than the old #f5f5ff — that near-white start rendered
    // the "P" in Platinum almost invisible against the pale card background.
    platinum: "linear-gradient(135deg, #7a7391, #cfc9dc 50%, #4a4458)",
  };
  const cardRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
  };
  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative overflow-hidden rounded-3xl border border-primary/25 bg-card/60 p-8 backdrop-blur transition-transform duration-300 ease-out"
      style={{
        boxShadow: "0 24px 60px rgba(0,0,0,.35)",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      <div
        className="absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-70 blur-2xl"
        style={{ background: swatch[tier] }}
      />
      <div
        className="relative text-[10px] uppercase tracking-[0.4em] text-primary"
        style={{ fontFamily: "var(--font-label)" }}
      >
        Tier
      </div>
      <div
        className="relative mt-2 pb-1 text-4xl font-bold"
        style={{
          fontFamily: "var(--font-display)",
          background: swatch[tier],
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          lineHeight: 1.2,
        }}
      >
        {label}
      </div>
      <p className="relative mt-3 text-sm text-muted-foreground">{blurb}</p>
      <ul className="relative mt-6 space-y-2 text-sm">
        {featureLists[tier].map((f) => (
          <li key={f} className="flex items-start gap-2 text-foreground/85">
            <span className="mt-1 text-primary">✦</span> {f}
          </li>
        ))}
      </ul>
      <Link
        to={`/wedding/templates?tier=${tier}`}
        className="relative mt-8 inline-block rounded-full border border-primary/50 px-6 py-2.5 text-xs uppercase tracking-[0.25em] text-primary transition hover:bg-primary/10"
        style={{ fontFamily: "var(--font-label)" }}
      >
        View {count} {label} Templates
      </Link>
    </div>
  );
}
