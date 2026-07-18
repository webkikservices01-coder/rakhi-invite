import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SiteFooter } from "./SiteFooter";

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
    <div className="min-h-screen bg-gradient-to-b from-[oklch(0.98_0.02_85)] to-[oklch(0.92_0.05_60)]">
      <div className="bg-maroon-gold px-6 py-14 text-white sm:py-20">
        <div className="mx-auto max-w-4xl">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest opacity-90 hover:opacity-100">
            <ArrowLeft size={14} /> Home
          </Link>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-6xl">{title}</h1>
          {subtitle ? <p className="mt-2 max-w-2xl text-base opacity-90 sm:text-lg">{subtitle}</p> : null}
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
        <div className="prose-info">{children}</div>
      </div>

      <SiteFooter />
    </div>
  );
}
