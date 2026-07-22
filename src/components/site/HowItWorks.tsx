import { MousePointerClick, Palette, CreditCard, Share2 } from "lucide-react";

const STEPS = [
  {
    icon: MousePointerClick,
    title: "Pick your invitation type",
    desc: "Choose Rakhi or Wedding, then browse Silver, Gold, or Platinum templates.",
  },
  {
    icon: Palette,
    title: "Personalize it",
    desc: "Add names, photos, your message, and music — changes save automatically as you go.",
  },
  {
    icon: CreditCard,
    title: "Preview, then unlock",
    desc: "Silver is free to try. Gold and Platinum unlock instantly after a secure one-time payment.",
  },
  {
    icon: Share2,
    title: "Share your link",
    desc: "Get a unique link for your finished invite — send it on WhatsApp, SMS, or anywhere else.",
  },
] as const;

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <div className="mb-12 text-center">
        <div className="text-xs uppercase tracking-[0.4em] opacity-70">Simple by design</div>
        <h2 className="mt-2 font-display text-4xl sm:text-5xl font-bold">How It Works</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <div
            key={step.title}
            className="relative rounded-3xl border border-current/10 bg-white/70 p-6 backdrop-blur transition hover:-translate-y-1 hover:shadow-soft"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-maroon-gold text-white shadow-soft">
                <step.icon size={19} />
              </div>
              <div className="font-display text-2xl font-bold opacity-30">{i + 1}</div>
            </div>
            <div className="font-display text-lg font-semibold">{step.title}</div>
            <p className="mt-1.5 text-sm opacity-70">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
