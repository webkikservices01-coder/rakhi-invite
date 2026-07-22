import type { ReactNode } from "react";
import { SiteShell } from "@/verticals/wedding/components/site/SiteShell";
import { Reveal } from "@/verticals/wedding/components/site/Reveal";

export function InfoPageLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <SiteShell>
      <section className="py-20 text-center border-b border-border/40">
        <div className="mx-auto max-w-3xl px-5">
          <Reveal>
            <h1
              className="wt-text-gradient font-bold"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 5.5vw, 56px)",
              }}
            >
              {title}
            </h1>
          </Reveal>
          {subtitle ? (
            <Reveal delay={90}>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                {subtitle}
              </p>
            </Reveal>
          ) : null}
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-3xl px-5">
          <Reveal delay={120}>
            <div className="prose-info">{children}</div>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}
