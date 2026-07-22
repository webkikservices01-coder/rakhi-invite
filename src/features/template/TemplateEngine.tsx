import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft, Palette, Type, Rocket, Lock } from "lucide-react";
import { toast } from "sonner";
import type { Template } from "@/data/templates";
import { IMAGES } from "@/data/images";
import { useTemplateState, type TemplateState } from "./useTemplateState";
import { Decorations } from "./Decorations";
import { MusicPlayer } from "./MusicPlayer";
import { AIChat, type AIAction } from "./AIChat";
import { EditableText } from "./EditableText";
import { PhotoUpload } from "./PhotoUpload";
import { encodeInviteState } from "@/lib/invite-link";
import { isTierUnlocked } from "@/lib/payment";
import { PaywallModal } from "@/features/payment/PaywallModal";

export function TemplateEngine({
  template,
  locked = false,
  initialState,
}: {
  template: Template;
  locked?: boolean;
  initialState?: Partial<TemplateState>;
}) {
  const { state, setState, palette } = useTemplateState(template, initialState);
  const isGold = template.tier === "gold";
  const isPlatinum = template.tier === "platinum";
  const hasMusic = isGold || isPlatinum;
  const hasAI = !locked;
  const maxPhotos = isPlatinum ? Infinity : isGold ? 2 : 0;
  const [publishing, setPublishing] = useState(false);
  const [unlocked, setUnlocked] = useState(() => isTierUnlocked(template.tier));
  const [showPaywall, setShowPaywall] = useState(false);
  const needsUnlock = (isGold || isPlatinum) && !unlocked;

  const publish = async () => {
    if (publishing) return;
    // Re-check localStorage live (not the `unlocked` state var) so this works
    // correctly when called right after PaywallModal's onUnlocked, before a
    // re-render would otherwise refresh the closure over `unlocked`.
    if ((isGold || isPlatinum) && !isTierUnlocked(template.tier)) {
      setShowPaywall(true);
      return;
    }
    setPublishing(true);
    try {
      const encoded = encodeInviteState({
        brotherName: state.brotherName,
        sisterName: state.sisterName,
        from: state.from,
        message: state.message,
        wish: state.wish,
        fontOverride: state.fontOverride,
        aiLang: state.aiLang,
        paletteOverride: state.paletteOverride,
      });
      const url = `${window.location.origin}/rakhi/t/${template.tier}/${template.id}?d=${encoded}`;
      await navigator.clipboard.writeText(url).catch(() => {});
      toast.success(`Invite ready! Share this link: ${url}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Deploy failed: ${msg}`);
    } finally {
      setPublishing(false);
    }
  };

  const handleAction = useCallback((action: AIAction) => {
    setState(prev => {
      const next = { ...prev };
      switch (action.type) {
        case "setColor":
          next.paletteOverride = { ...prev.paletteOverride, [action.target]: action.value };
          break;
        case "setMessage": next.message = action.value; break;
        case "setWish": next.wish = action.value; break;
        case "setNames":
          if (action.brother) next.brotherName = action.brother;
          if (action.sister) next.sisterName = action.sister;
          break;
        case "setFont": next.fontOverride = action.value; break;
        case "setLang": next.aiLang = action.value; break;
      }
      return next;
    });
  }, [setState]);

  const fontClass = state.fontOverride === "hand" ? "font-hand" : state.fontOverride === "deva" ? "font-deva" : "font-display";

  const style: React.CSSProperties = {
    background: palette.bg,
    color: palette.text,
  };

  return (
    <div style={style} className="min-h-screen relative overflow-x-hidden">
      <Decorations type={template.decoration} density={isPlatinum ? 40 : isGold ? 30 : 18} />

      {/* Back nav */}
      <div className="relative z-30 flex items-center justify-between px-6 py-4 sm:px-10">
        <Link to={`/${template.tier}`} className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-3 py-1.5 text-xs backdrop-blur hover:bg-black/30" style={{ color: palette.text }}>
          <ArrowLeft size={14} /> Back
        </Link>
        <div className="flex items-center gap-2">
          <TierBadge tier={template.tier} />
          {!locked && (
            <>
              <PaletteMenu onPick={(bg) => handleAction({ type: "setColor", target: "bg", value: bg })} />
              <FontMenu onPick={(f) => handleAction({ type: "setFont", value: f })} />
              <button
                onClick={() => void publish()}
                disabled={publishing}
                title={needsUnlock ? `Unlock ${template.tier} to deploy your invite` : "Deploy your invite — get a shareable link"}
                className="flex items-center gap-1.5 rounded-full bg-black/20 px-3 py-1.5 text-xs backdrop-blur hover:bg-black/30 disabled:opacity-50"
                style={{ color: palette.text }}
              >
                {needsUnlock ? <Lock size={14} /> : <Rocket size={14} />}
                {publishing ? "Deploying…" : needsUnlock ? "Unlock & Deploy" : "Deploy"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Layout */}
      <div className="relative z-20">
        {renderLayout(template, state, palette, fontClass, maxPhotos, setState, locked)}
      </div>

      {hasMusic && (
        <MusicPlayer
          slot={state.musicSlot}
          urls={state.musicUrls}
          onChange={(urls) => setState(s => ({ ...s, musicUrls: urls }))}
          onSlot={(slot) => setState(s => ({ ...s, musicSlot: slot }))}
          defaultSongId={template.defaultSongId}
          readOnly={locked}
        />
      )}

      {hasAI && <AIChat template={template} state={state} onAction={handleAction} hasMusic={hasMusic} hasPhotos={maxPhotos > 0} />}

      {showPaywall && (isGold || isPlatinum) && (
        <PaywallModal
          tier={template.tier as "gold" | "platinum"}
          templateId={template.id}
          onClose={() => setShowPaywall(false)}
          onUnlocked={() => {
            setUnlocked(true);
            setShowPaywall(false);
            void publish();
          }}
        />
      )}

      <footer className="relative z-20 border-t border-white/10 py-8 text-center text-xs opacity-70">
        <div className="font-hand text-lg">— Rakhi Vibes —</div>
        <div className="mt-1">Made with ❤️ for every brother and sister ❤️</div>
      </footer>
    </div>
  );
}

// ============ LAYOUT VARIANTS ============
function renderLayout(t: Template, state: ReturnType<typeof useTemplateState>["state"] | any, palette: any, fontClass: string, maxPhotos: number, setState: any, readOnly: boolean) {
  const hero = IMAGES[t.heroImage];
  const setNames = (patch: Partial<{ brotherName: string; sisterName: string; message: string; wish: string; photos: string[] }>) =>
    setState((s: any) => ({ ...s, ...patch }));

  const Names = () => (
    <div className="flex flex-wrap items-center justify-center gap-3 text-2xl sm:text-3xl">
      <EditableText value={state.sisterName} onChange={v => setNames({ sisterName: v })} className={`${fontClass} font-semibold`} readOnly={readOnly} />
      <span className="text-current/60">×</span>
      <EditableText value={state.brotherName} onChange={v => setNames({ brotherName: v })} className={`${fontClass} font-semibold`} readOnly={readOnly} />
    </div>
  );

  switch (t.layout) {
    case "postcard":
    case "centered-classic":
      return (
        <section className="mx-auto max-w-3xl px-6 py-10 sm:py-20 text-center">
          <div className="mx-auto mb-6 h-64 w-full max-w-2xl overflow-hidden rounded-3xl shadow-2xl sm:h-96">
            <img src={hero} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="text-xs uppercase tracking-[0.4em] opacity-70">Happy Raksha Bandhan</div>
          <h1 className={`${fontClass} mt-2 text-5xl sm:text-7xl font-bold`}>{t.name}</h1>
          <p className="mt-2 opacity-80 italic">{t.tagline}</p>
          <div className="mt-6"><Names /></div>
          <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-current/20 bg-white/8 p-6 backdrop-blur">
            <EditableText value={state.message} onChange={v => setNames({ message: v })} multiline className="block text-lg leading-relaxed italic" readOnly={readOnly} />
          </div>
          <div className="mt-6 font-hand text-xl opacity-90">
            <EditableText value={state.wish} onChange={v => setNames({ wish: v })} readOnly={readOnly} />
          </div>
          {maxPhotos > 0 && (
            <div className="mt-10 flex flex-col items-center gap-3">
              <div className="text-xs uppercase tracking-widest opacity-70">Add Your Photos</div>
              <PhotoUpload photos={state.photos} onChange={photos => setNames({ photos })} max={maxPhotos} size="md" readOnly={readOnly} />
            </div>
          )}
        </section>
      );

    case "split-portrait":
      return (
        <section className="grid min-h-[80vh] items-stretch gap-0 lg:grid-cols-2">
          <div className="relative h-72 lg:h-auto">
            <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
          <div className="flex flex-col justify-center px-8 py-10 sm:px-16 sm:py-16">
            <div className="text-xs uppercase tracking-[0.4em] opacity-70">Raksha Bandhan • {t.tier}</div>
            <h1 className={`${fontClass} mt-2 text-5xl sm:text-6xl font-bold`}>{t.name}</h1>
            <p className="mt-1 opacity-80 italic">{t.tagline}</p>
            <div className="mt-6"><Names /></div>
            <EditableText value={state.message} onChange={v => setNames({ message: v })} multiline className="mt-6 block text-lg leading-relaxed" readOnly={readOnly} />
            <div className="mt-6 font-hand text-xl">
              <EditableText value={state.wish} onChange={v => setNames({ wish: v })} readOnly={readOnly} />
            </div>
            {maxPhotos > 0 && <div className="mt-8"><PhotoUpload photos={state.photos} onChange={photos => setNames({ photos })} max={maxPhotos} readOnly={readOnly} /></div>}
          </div>
        </section>
      );

    case "magazine":
      return (
        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <img src={hero} alt="" className="h-96 w-full rounded-3xl object-cover shadow-2xl" />
            </div>
            <div className="rounded-3xl border border-current/20 bg-white/8 p-6 backdrop-blur">
              <div className="text-[10px] uppercase tracking-[0.4em] opacity-70">Issue N°01</div>
              <h1 className={`${fontClass} mt-1 text-4xl font-bold leading-tight`}>{t.name}</h1>
              <p className="mt-2 text-sm italic opacity-80">{t.tagline}</p>
              <div className="my-4 h-px bg-current/20" />
              <Names />
              <EditableText value={state.message} onChange={v => setNames({ message: v })} multiline className="mt-4 block text-sm leading-relaxed" readOnly={readOnly} />
            </div>
          </div>
          {t.secondaryImages && (
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
              {t.secondaryImages.slice(0, 3).map((k, i) => (
                <img key={i} src={IMAGES[k]} alt="" className="h-56 w-full rounded-2xl object-cover shadow-lg" />
              ))}
            </div>
          )}
          {maxPhotos > 0 && (
            <div className="mt-10 flex flex-col items-center gap-3">
              <div className="text-xs uppercase tracking-widest opacity-70">Aapki Photos</div>
              <PhotoUpload photos={state.photos} onChange={photos => setNames({ photos })} max={maxPhotos} size="lg" readOnly={readOnly} />
            </div>
          )}
          <div className="mt-10 text-center font-hand text-2xl">
            <EditableText value={state.wish} onChange={v => setNames({ wish: v })} readOnly={readOnly} />
          </div>
        </section>
      );

    case "royal-frame":
      return (
        <section className="mx-auto max-w-4xl px-6 py-14 text-center">
          <div className="ornate-border relative mx-auto rounded-[2rem] p-8 sm:p-14" style={{ background: palette.surface, color: "oklch(0.2 0.06 30)" }}>
            <div className="text-xs uppercase tracking-[0.4em] opacity-70">॥ Shubh Raksha Bandhan ॥</div>
            <h1 className={`${fontClass} mt-3 text-5xl sm:text-7xl font-bold text-gold-shine`}>{t.name}</h1>
            <p className="mt-2 italic opacity-80">{t.tagline}</p>
            <div className="my-6 h-px w-32 mx-auto bg-current/30" />
            <img src={hero} alt="" className="mx-auto mb-6 h-72 w-full max-w-xl rounded-2xl object-cover shadow-xl" />
            <Names />
            <EditableText value={state.message} onChange={v => setNames({ message: v })} multiline className="mt-6 block text-lg leading-relaxed italic" readOnly={readOnly} />
            <div className="mt-8 font-hand text-2xl">
              <EditableText value={state.wish} onChange={v => setNames({ wish: v })} readOnly={readOnly} />
            </div>
            {maxPhotos > 0 && <div className="mt-8 flex justify-center"><PhotoUpload photos={state.photos} onChange={photos => setNames({ photos })} max={maxPhotos} readOnly={readOnly} /></div>}
          </div>
        </section>
      );

    case "polaroid":
      return (
        <section className="mx-auto max-w-5xl px-6 py-12">
          <div className="mb-8 text-center">
            <div className="text-xs uppercase tracking-[0.4em] opacity-70">Memories</div>
            <h1 className={`${fontClass} mt-2 text-5xl sm:text-6xl font-bold`}>{t.name}</h1>
            <p className="mt-1 italic opacity-80">{t.tagline}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[hero, ...(t.secondaryImages?.map(k => IMAGES[k]) ?? [])].slice(0, 3).map((src, i) => (
              <div key={i} className="rotate-[-2deg] rounded-lg bg-white p-3 pb-10 shadow-2xl hover:rotate-0 transition-transform" style={{ transform: `rotate(${(i - 1) * 3}deg)` }}>
                <img src={src} alt="" className="h-56 w-full object-cover" />
                <div className="mt-2 text-center font-hand text-sm text-slate-800">memories '25</div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Names />
            <EditableText value={state.message} onChange={v => setNames({ message: v })} multiline className="mx-auto mt-6 block max-w-2xl text-lg italic" readOnly={readOnly} />
            <div className="mt-6 font-hand text-2xl">
              <EditableText value={state.wish} onChange={v => setNames({ wish: v })} readOnly={readOnly} />
            </div>
            {maxPhotos > 0 && <div className="mt-8 flex justify-center"><PhotoUpload photos={state.photos} onChange={photos => setNames({ photos })} max={maxPhotos} size="lg" readOnly={readOnly} /></div>}
          </div>
        </section>
      );

    case "scroll-story":
      return (
        <section className="mx-auto max-w-4xl px-6 py-14 space-y-16">
          <div className="text-center">
            <div className="text-xs uppercase tracking-[0.4em] opacity-70">A Story of Bhai-Behen</div>
            <h1 className={`${fontClass} mt-3 text-6xl sm:text-8xl font-bold`}>{t.name}</h1>
            <p className="mt-2 italic opacity-80">{t.tagline}</p>
          </div>
          <img src={hero} alt="" className="mx-auto h-96 w-full max-w-3xl rounded-3xl object-cover shadow-2xl animate-fade-up" />
          <div className="animate-fade-up">
            <div className="text-xs uppercase tracking-widest opacity-70">Chapter I — Names</div>
            <div className="mt-2"><Names /></div>
          </div>
          <div className="animate-fade-up">
            <div className="text-xs uppercase tracking-widest opacity-70">Chapter II — The Message</div>
            <EditableText value={state.message} onChange={v => setNames({ message: v })} multiline className="mt-3 block text-xl leading-relaxed italic" readOnly={readOnly} />
          </div>
          {t.secondaryImages && (
            <div className="grid grid-cols-2 gap-4 animate-fade-up">
              {t.secondaryImages.slice(0, 2).map((k, i) => (
                <img key={i} src={IMAGES[k]} alt="" className="h-64 w-full rounded-2xl object-cover shadow-xl" />
              ))}
            </div>
          )}
          <div className="animate-fade-up">
            <div className="text-xs uppercase tracking-widest opacity-70">Chapter III — The Wish</div>
            <div className="mt-3 font-hand text-3xl">
              <EditableText value={state.wish} onChange={v => setNames({ wish: v })} readOnly={readOnly} />
            </div>
          </div>
          {maxPhotos > 0 && (
            <div className="animate-fade-up">
              <div className="text-xs uppercase tracking-widest opacity-70">Chapter IV — Your Album</div>
              <div className="mt-4"><PhotoUpload photos={state.photos} onChange={photos => setNames({ photos })} max={maxPhotos} size="lg" readOnly={readOnly} /></div>
            </div>
          )}
        </section>
      );

    case "grid-gallery": {
      const all = [t.heroImage, ...(t.secondaryImages ?? [])].map(k => IMAGES[k]);
      return (
        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-10 text-center">
            <div className="text-xs uppercase tracking-[0.4em] opacity-70">Gallery Edition</div>
            <h1 className={`${fontClass} mt-2 text-6xl font-bold`}>{t.name}</h1>
            <p className="mt-1 italic opacity-80">{t.tagline}</p>
            <div className="mt-6"><Names /></div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {all.map((src, i) => (
              <img key={i} src={src} alt="" className={`w-full rounded-2xl object-cover shadow-lg ${i % 3 === 0 ? "h-64" : "h-40"}`} />
            ))}
          </div>
          <div className="mt-10 rounded-2xl bg-white/8 p-6 backdrop-blur">
            <EditableText value={state.message} onChange={v => setNames({ message: v })} multiline className="block text-lg italic leading-relaxed" readOnly={readOnly} />
          </div>
          <div className="mt-6 text-center font-hand text-2xl">
            <EditableText value={state.wish} onChange={v => setNames({ wish: v })} readOnly={readOnly} />
          </div>
          {maxPhotos > 0 && (
            <div className="mt-10 flex flex-col items-center gap-3">
              <div className="text-xs uppercase tracking-widest opacity-70">Your Photos (unlimited)</div>
              <PhotoUpload photos={state.photos} onChange={photos => setNames({ photos })} max={maxPhotos} size="lg" readOnly={readOnly} />
            </div>
          )}
        </section>
      );
    }

    case "immersive":
      return (
        <section>
          {/* Page 1 - Hero */}
          <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
            <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
            <div className="relative z-10 max-w-3xl text-center px-6 text-white">
              <div className="text-xs uppercase tracking-[0.5em] opacity-80">Raksha Bandhan · Platinum Edition</div>
              <h1 className={`${fontClass} mt-4 text-6xl sm:text-8xl font-bold drop-shadow-2xl`}>{t.name}</h1>
              <p className="mt-3 italic opacity-90">{t.tagline}</p>
              <div className="mt-8"><Names /></div>
              <div className="mt-10 text-xs uppercase tracking-widest opacity-80 animate-pulse">↓ Scroll to explore ↓</div>
            </div>
          </div>
          {/* Page 2 - Message */}
          <div className="mx-auto max-w-3xl px-6 py-24 text-center">
            <div className="text-xs uppercase tracking-[0.4em] opacity-70">The Message</div>
            <EditableText value={state.message} onChange={v => setNames({ message: v })} multiline className="mt-6 block text-2xl leading-relaxed italic" readOnly={readOnly} />
          </div>
          {/* Page 3 - Gallery */}
          {t.secondaryImages && (
            <div className="mx-auto max-w-6xl px-6 py-16">
              <div className="text-center mb-8">
                <div className="text-xs uppercase tracking-[0.4em] opacity-70">Yaadein</div>
                <h2 className={`${fontClass} mt-2 text-4xl`}>Our Story in Frames</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {t.secondaryImages.map((k, i) => (
                  <img key={i} src={IMAGES[k]} alt="" className="h-72 w-full rounded-3xl object-cover shadow-2xl hover:scale-105 transition-transform" />
                ))}
              </div>
            </div>
          )}
          {/* Page 4 - Your photos */}
          {maxPhotos > 0 && (
            <div className="mx-auto max-w-4xl px-6 py-16 text-center">
              <div className="text-xs uppercase tracking-[0.4em] opacity-70">Your Album</div>
              <h2 className={`${fontClass} mt-2 text-4xl`}>Family Frames</h2>
              <p className="mt-2 opacity-70 text-sm">Upload as many as you like — unlimited photos</p>
              <div className="mt-6 flex justify-center"><PhotoUpload photos={state.photos} onChange={photos => setNames({ photos })} max={maxPhotos} size="lg" readOnly={readOnly} /></div>
            </div>
          )}
          {/* Page 5 - Wish */}
          <div className="mx-auto max-w-3xl px-6 py-24 text-center">
            <div className="text-xs uppercase tracking-[0.4em] opacity-70">Aashirwaad</div>
            <div className="mt-6 font-hand text-4xl leading-snug">
              <EditableText value={state.wish} onChange={v => setNames({ wish: v })} readOnly={readOnly} />
            </div>
            <div className="mt-8 flex items-center justify-center gap-2 opacity-70">
              <Sparkles size={16} /> <span className="text-xs uppercase tracking-widest">— Rakhi Vibes —</span> <Sparkles size={16} />
            </div>
          </div>
        </section>
      );

    default:
      return null;
  }
}

function TierBadge({ tier }: { tier: "silver" | "gold" | "platinum" }) {
  const map = {
    silver: { bg: "bg-slate-300/30 text-slate-100 border-slate-300/50", label: "SILVER" },
    gold: { bg: "bg-gradient-to-r from-amber-400/80 to-yellow-500/80 text-black border-amber-300", label: "GOLD" },
    platinum: { bg: "bg-gradient-to-r from-fuchsia-400/80 via-rose-400/80 to-amber-300/80 text-black border-white/50", label: "PLATINUM" },
  };
  const s = map[tier];
  return <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-widest backdrop-blur ${s.bg}`}>{s.label}</span>;
}

function PaletteMenu({ onPick }: { onPick: (bg: string) => void }) {
  const swatches = [
    { name: "Maroon Gold", v: "linear-gradient(135deg, oklch(0.35 0.15 22), oklch(0.5 0.19 35))" },
    { name: "Rose", v: "linear-gradient(135deg, oklch(0.75 0.14 15), oklch(0.6 0.18 5))" },
    { name: "Emerald", v: "linear-gradient(135deg, oklch(0.35 0.11 155), oklch(0.55 0.14 140))" },
    { name: "Royal", v: "linear-gradient(135deg, oklch(0.28 0.14 290), oklch(0.45 0.2 320))" },
    { name: "Ivory", v: "linear-gradient(135deg, oklch(0.98 0.02 85), oklch(0.92 0.05 60))" },
    { name: "Peacock", v: "linear-gradient(135deg, oklch(0.35 0.13 220), oklch(0.5 0.16 200))" },
    { name: "Midnight", v: "linear-gradient(135deg, oklch(0.18 0.06 280), oklch(0.28 0.12 300))" },
    { name: "Sunset", v: "linear-gradient(135deg, oklch(0.7 0.19 45), oklch(0.55 0.2 25))" },
  ];
  return (
    <details className="relative">
      <summary className="list-none cursor-pointer rounded-full bg-black/20 p-2 backdrop-blur hover:bg-black/30" title="Change palette"><Palette size={14} /></summary>
      <div className="absolute right-0 mt-2 grid w-56 grid-cols-4 gap-1.5 rounded-2xl border border-white/20 bg-black/80 p-2 backdrop-blur-xl shadow-2xl">
        {swatches.map(s => (
          <button key={s.name} title={s.name} onClick={() => onPick(s.v)} className="h-10 w-full rounded-lg ring-1 ring-white/20 hover:ring-white/60" style={{ background: s.v }} />
        ))}
      </div>
    </details>
  );
}

function FontMenu({ onPick }: { onPick: (f: "display" | "hand" | "deva") => void }) {
  return (
    <details className="relative">
      <summary className="list-none cursor-pointer rounded-full bg-black/20 p-2 backdrop-blur hover:bg-black/30" title="Change font"><Type size={14} /></summary>
      <div className="absolute right-0 mt-2 flex w-40 flex-col rounded-2xl border border-white/20 bg-black/80 p-1 backdrop-blur-xl shadow-2xl text-white">
        <button onClick={() => onPick("display")} className="rounded px-3 py-2 text-left text-sm font-display hover:bg-white/10">Classic Serif</button>
        <button onClick={() => onPick("hand")} className="rounded px-3 py-2 text-left text-sm font-hand hover:bg-white/10">Handwritten</button>
        <button onClick={() => onPick("deva")} className="rounded px-3 py-2 text-left text-sm font-deva hover:bg-white/10">देवनागरी</button>
      </div>
    </details>
  );
}
