import { useState } from "react";
import type { Template, InviteOverrides } from "@/verticals/wedding/data/templates";
import { mergeTemplateWithOverrides } from "@/verticals/wedding/data/templates";
import { CustomizeChat } from "./CustomizeChat";
import { QuickEditPanel } from "./QuickEditPanel";
import { AnimatedInviteCard } from "./AnimatedInviteCard";
import { ShivParwatiInvite } from "./templates/ShivParwatiInvite";
import { LuxurySilverGold } from "./templates/LuxurySilverGold";
import { VogueSilverGold } from "./templates/VogueSilverGold";
import {
  Countdown,
  EntryLoader,
  Fireworks,
  MusicToggle,
  Petals,
  Reveal,
  ScrollProgress,
  TiltFrame,
  tierHasCeremonies,
  tierHasChat,
  tierHasLoader,
  tierHasMusic,
  tierHasParticles,
  tierHasWishes,
} from "./widgets";

/* =========================================================
   TemplateInvite — the reusable "real invite" renderer.
   Every template ID drops into this and reads its palette
   from data-palette. Tier controls which sections mount.
   ========================================================= */

export function TemplateInvite({
  template: initialTemplate,
}: {
  template: Template;
}) {
  const [entered, setEntered] = useState(!tierHasLoader(initialTemplate.tier));
  const [overrides, setOverrides] = useState<InviteOverrides>({});
  const [isReady, setIsReady] = useState(false);
  const [customMusicUrl, setCustomMusicUrl] = useState<string>("");

  // Merge template with overrides for live preview
  const template = mergeTemplateWithOverrides(
    { ...initialTemplate, music: customMusicUrl || initialTemplate.music },
    overrides,
  );

  const handleFieldsUpdate = (newFields: InviteOverrides) => {
    setOverrides((prev) => ({ ...prev, ...newFields }));
  };

  const handleMusicUpload = (url: string) => {
    setCustomMusicUrl(url);
    handleFieldsUpdate({ music: url });
  };

  if (template.slug === "india-shiv-parwati-divine") {
    return (
      <>
        <ScrollProgress />
        <ShivParwatiInvite template={template} />
        {tierHasChat(template.tier) && (
          <CustomizeChat
            template={initialTemplate}
            onFieldsUpdate={handleFieldsUpdate}
            onReady={setIsReady}
            onMusicUpload={handleMusicUpload}
          />
        )}
      </>
    );
  }

  if (template.slug === "luxury-silver-gold") {
    return (
      <>
        <ScrollProgress />
        <LuxurySilverGold template={template} />
        {tierHasChat(template.tier) && (
          <CustomizeChat
            template={initialTemplate}
            onFieldsUpdate={handleFieldsUpdate}
            onReady={setIsReady}
            onMusicUpload={handleMusicUpload}
          />
        )}
      </>
    );
  }

  if (template.slug === "vogue-silver-gold") {
    return (
      <>
        <ScrollProgress />
        <VogueSilverGold template={template} />
        {tierHasChat(template.tier) && (
          <CustomizeChat
            template={initialTemplate}
            onFieldsUpdate={handleFieldsUpdate}
            onReady={setIsReady}
            onMusicUpload={handleMusicUpload}
          />
        )}
      </>
    );
  }

  const scriptFontStack =
    template.scriptFont === "devanagari"
      ? "'Yatra One', 'Tiro Devanagari Hindi', serif"
      : template.scriptFont === "arabic"
        ? "'Amiri', 'Cormorant Garamond', serif"
        : "'Cormorant Garamond', serif";

  return (
    <div
      data-palette={template.palette}
      className="relative min-h-screen overflow-x-hidden"
      style={{
        fontFamily: "var(--wt-body)",
        color: "var(--wt-ink)",
        background: `
          radial-gradient(1100px 620px at 50% -8%, color-mix(in oklab, var(--wt-gold) 18%, transparent), transparent 60%),
          radial-gradient(700px 500px at 88% 22%, color-mix(in oklab, var(--wt-accent) 16%, transparent), transparent 60%),
          linear-gradient(165deg, var(--wt-bg-1) 0%, var(--wt-bg-2) 34%, var(--wt-bg-3) 70%, var(--wt-bg-4) 100%)
        `,
        backgroundAttachment: "fixed",
      }}
    >
      <ScrollProgress />
      {tierHasLoader(template.tier) && !entered && (
        <EntryLoader template={template} onEnter={() => setEntered(true)} />
      )}
      {tierHasParticles(template.tier) && (
        <Petals
          color="var(--wt-accent)"
          count={template.tier === "platinum" ? 28 : 18}
        />
      )}
      {template.slug === "uae-burj-skyline" && <Fireworks />}

      {/* Sticky nav */}
      <nav
        className="fixed inset-x-0 top-0 z-[60] backdrop-blur-lg"
        style={{
          background: "rgba(0,0,0,0.35)",
          borderBottom:
            "1px solid color-mix(in oklab, var(--wt-gold) 30%, transparent)",
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3">
          <div className="flex items-center gap-3">
            <div
              className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold"
              style={{
                background:
                  "linear-gradient(135deg, var(--wt-gold-lite), var(--wt-gold))",
                color: "var(--wt-bg-1)",
                fontFamily: "var(--wt-display)",
              }}
            >
              {template.couple.one[0]}
              {template.couple.two[0]}
            </div>
            <div>
              <div
                className="text-sm font-bold tracking-widest"
                style={{ fontFamily: "var(--wt-display)" }}
              >
                {template.couple.one} &amp; {template.couple.two}
              </div>
              <div
                className="text-[10px] uppercase tracking-[0.3em]"
                style={{
                  fontFamily: "var(--wt-label)",
                  color: "var(--wt-gold-lite)",
                }}
              >
                {template.tier} · {template.countryLabel}
              </div>
            </div>
          </div>
          <div
            className="ml-auto hidden gap-6 md:flex"
            style={{ fontFamily: "var(--wt-label)" }}
          >
            {["Home", "Story", "Events", "Venue"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="site-nav-link text-[13px] uppercase tracking-[0.2em] opacity-80 transition hover:opacity-100"
                style={{ color: "var(--wt-ink)" }}
              >
                {l}
              </a>
            ))}
          </div>
          {(tierHasMusic(template.tier) || template.music) && (
            <MusicToggle musicUrl={template.music} />
          )}
        </div>
      </nav>

      {/* HERO */}
      <section
        id="home"
        className="relative grid min-h-screen place-items-center overflow-hidden text-center"
        style={{ perspective: "1400px" }}
      >
        <div className="absolute inset-0 z-0">
          <div
            className="wt-kb absolute inset-0"
            style={{
              backgroundImage: `url(${template.image || template.hero})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.15) 40%, var(--wt-bg-1) 95%)",
            }}
          />
        </div>

        <div className="relative z-10 px-6 pt-32 pb-24">
          <Reveal immediate delay={60}>
            <p
              className="wt-shimmer-gold text-lg tracking-[0.2em]"
              style={{ fontFamily: scriptFontStack }}
            >
              {template.script}
            </p>
            <p
              className="mt-1 text-xs uppercase tracking-[0.4em]"
              style={{
                fontFamily: "var(--wt-label)",
                color: "var(--wt-ink-soft)",
              }}
            >
              {template.countryLabel} · {template.tier} Edition
            </p>
          </Reveal>

          {/* Arch photo frame — platinum only */}
          {template.tier === "platinum" &&
            template.slug !== "india-royal-reel" && (
              <Reveal
                immediate
                delay={180}
                className="mx-auto mt-6 w-[min(300px,72vw)]"
              >
                <div
                  className="relative aspect-[3/4] overflow-hidden transition-transform duration-500 hover:scale-[1.03]"
                  style={{
                    borderRadius: "180px 180px 22px 22px",
                    border: "6px solid var(--wt-gold-lite)",
                    boxShadow:
                      "0 0 0 9px color-mix(in oklab, var(--wt-accent) 30%, transparent), 0 34px 90px rgba(0,0,0,.6)",
                  }}
                >
                  <TiltFrame
                    src={template.image || template.hero}
                    className="h-full w-full"
                  />
                </div>
              </Reveal>
            )}

          {/* Animated play-video invitation card — Royal Reel Invite only */}
          {template.slug === "india-royal-reel" && (
            <Reveal immediate delay={180}>
              <AnimatedInviteCard
                coupleOne={template.couple.one}
                coupleTwo={template.couple.two}
                dateLabel={template.date.toUpperCase()}
                venueLabel={`${template.venue.name}, ${template.venue.address}`}
                videoUrl={template.video}
              />
            </Reveal>
          )}

          {/* Couple names — Royal Reel Invite already presents these inside its
              own cover card above, so skip the duplicate heading here. */}
          {template.slug !== "india-royal-reel" && (
            <Reveal immediate delay={280}>
              <h1
                className="mt-8 wt-text-gradient font-bold"
                style={{
                  fontFamily: "var(--wt-heading)",
                  fontSize: "clamp(48px, 11vw, 108px)",
                  lineHeight: 1.02,
                  letterSpacing: "0.02em",
                  filter: "drop-shadow(0 6px 22px rgba(0,0,0,.55))",
                }}
              >
                {template.couple.one}
                <span
                  className="my-1 block text-2xl md:text-3xl"
                  style={{
                    fontFamily: "var(--wt-display)",
                    color: "var(--wt-accent)",
                    letterSpacing: "0.15em",
                    filter:
                      "drop-shadow(0 2px 10px color-mix(in oklab, var(--wt-accent) 40%, transparent))",
                  }}
                >
                  {template.couple.amp}
                </span>
                {template.couple.two}
              </h1>
            </Reveal>
          )}

          <Reveal immediate delay={420}>
            <p
              className="mt-5 text-xs uppercase tracking-[0.4em]"
              style={{
                fontFamily: "var(--wt-label)",
                color: "var(--wt-ink-soft)",
              }}
            >
              {template.tagline}
            </p>
          </Reveal>

          {/* Date badge — also already shown inside the Royal Reel cover card. */}
          {template.slug !== "india-royal-reel" && (
            <Reveal immediate delay={520}>
              <span
                className="mt-6 inline-block rounded-full px-7 py-3 text-sm font-bold tracking-[0.2em] transition-transform duration-300 hover:-translate-y-0.5 hover:scale-105"
                style={{
                  fontFamily: "var(--wt-display)",
                  background:
                    "linear-gradient(135deg, var(--wt-gold-lite), var(--wt-gold))",
                  color: "var(--wt-bg-1)",
                  boxShadow: "0 12px 30px rgba(0,0,0,.45)",
                }}
              >
                {template.date}
              </span>
            </Reveal>
          )}

          <Reveal immediate delay={620}>
            <Countdown eventDate={template.eventDate} />
          </Reveal>

          {/* The uploaded photo already became the hero background above.
              The Royal Reel's own default video already plays inside its
              cover card above — only show this block for a genuinely new
              video upload. */}
          {template.video && template.slug !== "india-royal-reel" && (
            <div className="mx-auto mt-8 max-w-md">
              <div
                className="overflow-hidden rounded-[2rem] border-2 transition-transform duration-500 hover:scale-[1.02]"
                style={{
                  borderColor: "var(--wt-accent)",
                  background: "rgba(0,0,0,0.05)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
                }}
              >
                <video
                  controls
                  src={template.video}
                  className="h-full w-full bg-black"
                  style={{ minHeight: "220px" }}
                />
              </div>
            </div>
          )}

          <Reveal immediate delay={720} className="mt-8">
            <a
              href="#rsvp"
              className="inline-block rounded-full px-8 py-3.5 text-sm uppercase tracking-[0.2em] text-white transition-transform hover:-translate-y-1 hover:scale-105"
              style={{
                fontFamily: "var(--wt-label)",
                background:
                  "linear-gradient(135deg, var(--wt-accent), var(--wt-accent-deep))",
                boxShadow: "0 14px 34px rgba(0,0,0,.4)",
              }}
            >
              RSVP with Blessings
            </a>
          </Reveal>
        </div>

        <div
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-2xl"
          style={{
            color: "var(--wt-gold-lite)",
            animation: "wt-down 1.6s ease-in-out infinite",
          }}
        >
          ▾
        </div>
      </section>

      {/* STORY */}
      <SectionShell id="story" hi="हमारी कहानी" title="Our Story">
        <Reveal className="mx-auto max-w-3xl text-center text-lg leading-relaxed">
          <p style={{ color: "var(--wt-ink-soft)" }}>{template.story}</p>
        </Reveal>

        {template.tier === "platinum" && (
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
            {[
              {
                y: "2022",
                h: "First Meeting",
                t: "A chance encounter that changed everything.",
              },
              {
                y: "2024",
                h: "The Proposal",
                t: "Under a sky full of stars, one knee, one yes.",
              },
              {
                y: "2026",
                h: "Forever Begins",
                t: "Together with our families, we invite you.",
              },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 110}>
                <div
                  className="rounded-3xl p-6 text-center backdrop-blur transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
                  style={{
                    background:
                      "color-mix(in oklab, var(--wt-bg-3) 60%, transparent)",
                    border:
                      "1px solid color-mix(in oklab, var(--wt-gold) 30%, transparent)",
                  }}
                >
                  <div
                    className="text-3xl font-bold"
                    style={{
                      fontFamily: "var(--wt-display)",
                      color: "var(--wt-gold-lite)",
                    }}
                  >
                    {s.y}
                  </div>
                  <div
                    className="mt-2 text-xl"
                    style={{
                      fontFamily: "var(--wt-heading)",
                      color: "var(--wt-ink)",
                    }}
                  >
                    {s.h}
                  </div>
                  <p
                    className="mt-3 text-sm"
                    style={{ color: "var(--wt-ink-soft)" }}
                  >
                    {s.t}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </SectionShell>

      {/* CEREMONIES / EVENTS */}
      {tierHasCeremonies(template.tier) && (
        <SectionShell id="events" hi="कार्यक्रम" title="Wedding Events">
          <div className="grid gap-6 md:grid-cols-2">
            {template.ceremonies.map((c, i) => (
              <Reveal key={c.name} delay={i * 90}>
                <div
                  className="group relative min-h-[280px] overflow-hidden rounded-3xl border p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_70px_rgba(0,0,0,0.5)]"
                  style={{
                    borderColor:
                      "color-mix(in oklab, var(--wt-gold) 30%, transparent)",
                    background:
                      "linear-gradient(160deg, color-mix(in oklab, var(--wt-bg-2) 90%, transparent), color-mix(in oklab, var(--wt-bg-3) 70%, transparent))",
                  }}
                >
                  <div className="absolute right-4 top-4 text-3xl opacity-80">
                    {c.icon}
                  </div>
                  <div className="mt-16 space-y-1">
                    <div
                      className="text-lg"
                      style={{
                        fontFamily: scriptFontStack,
                        color: "var(--wt-gold-lite)",
                      }}
                    >
                      {c.hi}
                    </div>
                    <div
                      className="text-2xl font-bold"
                      style={{ fontFamily: "var(--wt-display)", color: "#fff" }}
                    >
                      {c.name}
                    </div>
                    <div
                      className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm"
                      style={{
                        fontFamily: "var(--wt-label)",
                        color: "var(--wt-ink-soft)",
                      }}
                    >
                      <span>
                        <b
                          style={{
                            color: "var(--wt-gold-lite)",
                            fontWeight: 500,
                          }}
                        >
                          Date
                        </b>{" "}
                        · {c.date}
                      </span>
                      <span>
                        <b
                          style={{
                            color: "var(--wt-gold-lite)",
                            fontWeight: 500,
                          }}
                        >
                          Time
                        </b>{" "}
                        · {c.time}
                      </span>
                    </div>
                    <div
                      className="mt-1 italic"
                      style={{ color: "var(--wt-ink-soft)" }}
                    >
                      {c.venue}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </SectionShell>
      )}

      {/* DESTINATIONS / MONUMENTS */}
      <SectionShell id="destinations" hi="स्थान" title="Our Destinations">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {template.monuments.map((m, i) => (
            <Reveal key={i} delay={i * 100}>
              <div
                className="group relative aspect-[4/3] overflow-hidden rounded-3xl border-2 shadow-[0_24px_60px_rgba(0,0,0,0.4)] transition-transform duration-500 hover:scale-[1.03] hover:shadow-[0_30px_74px_rgba(0,0,0,0.5)]"
                style={{ borderColor: "var(--wt-gold)" }}
              >
                <div
                  className="wt-kb absolute inset-0"
                  style={{
                    backgroundImage: `url(${m})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 40%, rgba(0,0,0,.85))",
                  }}
                />
                <div
                  className="absolute inset-x-0 bottom-0 p-4 text-center"
                  style={{ fontFamily: "var(--wt-display)", color: "#fff" }}
                >
                  <div className="text-lg font-bold tracking-widest">
                    {template.monumentNames[i] ?? "Destination"}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      {/* VENUE */}
      <SectionShell id="venue" hi="मुख्य आयोजन स्थल" title="The Venue">
        <Reveal
          className="mx-auto max-w-2xl rounded-3xl border-2 p-10 text-center shadow-[0_34px_90px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:-translate-y-1.5"
          style={{
            background:
              "linear-gradient(160deg, var(--wt-bg-2), var(--wt-bg-3))",
            borderColor: "var(--wt-gold)",
          }}
        >
          <div className="text-4xl">📍</div>
          <h3
            className="mt-3 text-2xl font-bold"
            style={{
              fontFamily: "var(--wt-display)",
              color: "var(--wt-gold-lite)",
            }}
          >
            {template.venue.name}
          </h3>
          <p className="mt-2 text-lg" style={{ color: "var(--wt-ink-soft)" }}>
            {template.venue.address}
          </p>
          <a
            href={`https://www.google.com/maps/search/${encodeURIComponent(
              template.venue.name + " " + template.venue.address,
            )}`}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block rounded-full px-7 py-3 text-sm uppercase tracking-[0.25em]"
            style={{
              fontFamily: "var(--wt-label)",
              background:
                "linear-gradient(135deg, var(--wt-gold-lite), var(--wt-gold))",
              color: "var(--wt-bg-1)",
              boxShadow: "0 14px 30px rgba(0,0,0,.4)",
            }}
          >
            Open on Map
          </a>
        </Reveal>
      </SectionShell>

      {/* WISHES WALL — platinum only */}
      {tierHasWishes(template.tier) && (
        <SectionShell id="wishes" hi="शुभकामनाएं" title="Guest Wishes">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                n: "Priya S.",
                w: "Blessings for a lifetime of laughter and love.",
              },
              {
                n: "The Sharmas",
                w: "So happy to celebrate with you both — see you there!",
              },
              {
                n: "R. Menon",
                w: "Two beautiful souls, one incredible journey. Congrats!",
              },
            ].map((w, i) => (
              <Reveal key={i} delay={i * 110}>
                <div
                  className="rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
                  style={{
                    background:
                      "color-mix(in oklab, var(--wt-bg-3) 60%, transparent)",
                    border:
                      "1px solid color-mix(in oklab, var(--wt-gold) 25%, transparent)",
                  }}
                >
                  <p
                    className="text-lg italic"
                    style={{ color: "var(--wt-ink)" }}
                  >
                    "{w.w}"
                  </p>
                  <p
                    className="mt-4 text-sm uppercase tracking-[0.2em]"
                    style={{
                      fontFamily: "var(--wt-label)",
                      color: "var(--wt-gold-lite)",
                    }}
                  >
                    — {w.n}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </SectionShell>
      )}

      {/* RSVP */}
      <SectionShell id="rsvp" hi="आपकी उपस्थिति" title="Kindly RSVP">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Thank you! Your RSVP has been noted. (Demo)");
          }}
          className="mx-auto grid max-w-xl gap-4"
        >
          {[
            { l: "Your Name", t: "text", p: "Full name" },
            { l: "Email", t: "email", p: "you@example.com" },
            { l: "Guests", t: "number", p: "1" },
          ].map((f) => (
            <label key={f.l} className="block">
              <span
                className="mb-1 block text-xs uppercase tracking-[0.25em]"
                style={{
                  fontFamily: "var(--wt-label)",
                  color: "var(--wt-gold-lite)",
                }}
              >
                {f.l}
              </span>
              <input
                required
                type={f.t}
                placeholder={f.p}
                className="w-full rounded-xl px-4 py-3 outline-none"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid var(--wt-gold)",
                  color: "var(--wt-ink)",
                  fontFamily: "var(--wt-body)",
                }}
              />
            </label>
          ))}
          <button
            type="submit"
            className="mt-2 rounded-full py-3.5 text-sm uppercase tracking-[0.25em] text-white"
            style={{
              fontFamily: "var(--wt-label)",
              background:
                "linear-gradient(135deg, var(--wt-accent), var(--wt-accent-deep))",
              boxShadow: "0 14px 34px rgba(0,0,0,.4)",
            }}
          >
            Send Blessings
          </button>
        </form>
      </SectionShell>

      <footer className="pb-24 pt-10 text-center">
        <div
          className="text-3xl font-bold"
          style={{
            fontFamily: "var(--wt-heading)",
            color: "var(--wt-gold-lite)",
          }}
        >
          {template.couple.one} {template.couple.amp} {template.couple.two}
        </div>
        {template.hashtag && (
          <p
            className="mt-2 text-xl"
            style={{
              fontFamily: "var(--wt-script)",
              color: "var(--wt-accent)",
            }}
          >
            {template.hashtag}
          </p>
        )}
        <div
          className="mt-3 text-[11px] uppercase tracking-[0.35em]"
          style={{ fontFamily: "var(--wt-label)", color: "var(--wt-ink-soft)" }}
        >
          Template · {template.name} · {template.tier} Edition
        </div>
      </footer>

      {tierHasChat(template.tier) ? (
        <CustomizeChat
          template={initialTemplate}
          onFieldsUpdate={handleFieldsUpdate}
          onReady={setIsReady}
          onMusicUpload={handleMusicUpload}
        />
      ) : (
        <QuickEditPanel
          template={initialTemplate}
          onFieldsUpdate={handleFieldsUpdate}
        />
      )}
    </div>
  );
}

function SectionShell({
  id,
  hi,
  title,
  children,
}: {
  id: string;
  hi: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mb-12 text-center">
          <p
            className="text-2xl"
            style={{
              fontFamily: "var(--wt-script)",
              color: "var(--wt-accent)",
            }}
          >
            {hi}
          </p>
          <h2
            className="mt-1 wt-text-gradient font-bold"
            style={{
              fontFamily: "var(--wt-display)",
              fontSize: "clamp(30px, 5.4vw, 52px)",
              letterSpacing: "0.02em",
            }}
          >
            {title}
          </h2>
          <div
            className="mx-auto mt-4 h-px w-32"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--wt-gold), transparent)",
            }}
          />
        </Reveal>
        {children}
      </div>
    </section>
  );
}
