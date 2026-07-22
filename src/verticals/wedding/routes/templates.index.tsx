import { Link, useSearchParams } from "react-router-dom";
import { SiteShell } from "@/verticals/wedding/components/site/SiteShell";
import { ScrollingBanner } from "@/verticals/wedding/components/site/ScrollingBanner";
import { Reveal } from "@/verticals/wedding/components/site/Reveal";
import { useDocumentHead } from "@/verticals/wedding/lib/use-document-head";
import {
  COUNTRIES,
  TEMPLATES,
  TIERS,
  type Country,
  type Tier,
} from "@/verticals/wedding/data/templates";
import { z } from "zod";

const searchSchema = z.object({
  tier: z.enum(["silver", "gold", "platinum"]).optional(),
  country: z.enum(["india", "uae", "france", "usa", "italy"]).optional(),
});

export default function TemplatesPage() {
  useDocumentHead({
    title: "All Templates · Dream Wedding",
    description:
      "Browse 65 premium wedding invitation templates — a large India-focused collection alongside UAE, France, USA and Italy — across Silver, Gold and Platinum tiers.",
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const parsed = searchSchema.safeParse({
    tier: searchParams.get("tier") ?? undefined,
    country: searchParams.get("country") ?? undefined,
  });
  const { tier, country } = parsed.success ? parsed.data : {};

  const setSearch = (
    updater: (s: { tier?: Tier; country?: Country }) => {
      tier?: Tier;
      country?: Country;
    },
  ) => {
    const next = updater({ tier, country });
    const params: Record<string, string> = {};
    if (next.tier) params.tier = next.tier;
    if (next.country) params.country = next.country;
    setSearchParams(params);
  };

  const filtered = TEMPLATES.filter(
    (t) => (!tier || t.tier === tier) && (!country || t.country === country),
  );

  return (
    <SiteShell>
      <section className="border-b border-border/40 py-16">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <Reveal>
            <p
              className="text-xs uppercase tracking-[0.4em] text-primary"
              style={{ fontFamily: "var(--font-label)" }}
            >
              The catalogue
            </p>
          </Reveal>
          <Reveal delay={90}>
            <h1
              className="mt-3 wt-text-gradient font-bold"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 6vw, 68px)",
              }}
            >
              All Templates
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {filtered.length} of {TEMPLATES.length} · filter by country and
              tier below.
            </p>
          </Reveal>
        </div>
        <div className="mt-12">
          <ScrollingBanner />
        </div>
      </section>

      <section className="sticky top-[73px] z-30 border-b border-border/40 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-5 py-4">
          <span
            className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
            style={{ fontFamily: "var(--font-label)" }}
          >
            Country
          </span>
          <FilterChip
            active={!country}
            onClick={() => setSearch((s) => ({ ...s, country: undefined }))}
          >
            All
          </FilterChip>
          {COUNTRIES.map((c) => (
            <FilterChip
              key={c.id}
              active={country === c.id}
              onClick={() => setSearch((s) => ({ ...s, country: c.id }))}
            >
              {c.label}
            </FilterChip>
          ))}
          <div className="mx-2 hidden h-5 w-px bg-border md:block" />
          <span
            className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
            style={{ fontFamily: "var(--font-label)" }}
          >
            Tier
          </span>
          <FilterChip
            active={!tier}
            onClick={() => setSearch((s) => ({ ...s, tier: undefined }))}
          >
            All
          </FilterChip>
          {TIERS.map((t) => (
            <FilterChip
              key={t.id}
              active={tier === t.id}
              onClick={() => setSearch((s) => ({ ...s, tier: t.id }))}
            >
              {t.label}
            </FilterChip>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t, i) => (
            <Reveal key={t.slug} delay={(i % 9) * 60}>
              <Link
                to={`/wedding/templates/${t.slug}`}
                className="group relative block overflow-hidden rounded-3xl border border-primary/25 bg-card/50 backdrop-blur transition duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_40px_100px_rgba(111,66,193,0.18)]"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={t.hero}
                    alt={t.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 35%, rgba(0,0,0,0.92))",
                    }}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      boxShadow: "inset 0 0 0 2px var(--color-primary)",
                    }}
                  />
                  <TierBadge tier={t.tier} />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div
                      className="text-[10px] uppercase tracking-[0.35em] text-primary"
                      style={{ fontFamily: "var(--font-label)" }}
                    >
                      {t.countryLabel}
                    </div>
                    <div
                      className="mt-1 text-2xl font-bold text-foreground"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {t.name}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {t.tagline}
                    </div>
                  </div>
                </div>
                <div
                  className="flex items-center justify-between border-t border-border/40 p-4 text-xs uppercase tracking-[0.25em] text-primary"
                  style={{ fontFamily: "var(--font-label)" }}
                >
                  <span>Live preview</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] transition-all duration-300 hover:-translate-y-0.5"
      style={{
        fontFamily: "var(--font-label)",
        background: active ? "var(--gradient-gold)" : "transparent",
        color: active ? "var(--primary-foreground)" : "var(--color-foreground)",
        border: `1px solid ${active ? "transparent" : "color-mix(in oklab, var(--color-primary) 40%, transparent)"}`,
        boxShadow: active ? "var(--shadow-glow)" : "none",
        transform: active ? "scale(1.04)" : "scale(1)",
      }}
    >
      {children}
    </button>
  );
}

function TierBadge({ tier }: { tier: Tier }) {
  const bg: Record<Tier, string> = {
    silver: "linear-gradient(135deg, #d6d6d6, #a4a4a4)",
    gold: "linear-gradient(135deg, #f6d97e, #b8871f)",
    platinum: "linear-gradient(135deg, #f5f5ff, #7a7391)",
  };
  return (
    <span
      className="absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-black/90"
      style={{ background: bg[tier], fontFamily: "var(--font-label)" }}
    >
      {tier}
    </span>
  );
}
