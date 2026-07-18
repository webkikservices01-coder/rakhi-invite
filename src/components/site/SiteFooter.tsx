import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle, Sparkles, ArrowUp } from "lucide-react";
import { COMPANY } from "@/data/company";
import { useReveal } from "@/hooks/use-reveal";

const QUICK_LINKS = [
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
  { to: "/faqs", label: "FAQs" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms & Conditions" },
  { to: "/refund-policy", label: "Refund Policy" },
  { to: "/cancellation-policy", label: "Cancellation Policy" },
];

export function SiteFooter() {
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <footer
      ref={ref}
      className={`relative overflow-hidden bg-[oklch(0.3_0.1_25)] text-white transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div
        className="h-[3px] w-full animate-shimmer"
        style={{
          backgroundImage:
            "linear-gradient(90deg, oklch(0.36 0.16 22), oklch(0.78 0.17 75), oklch(0.65 0.18 320), oklch(0.78 0.17 75), oklch(0.36 0.16 22))",
        }}
      />

      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[oklch(0.78_0.17_75)]/10 blur-3xl sm:h-72 sm:w-72" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-[oklch(0.65_0.18_320)]/10 blur-3xl sm:h-72 sm:w-72" />

      <div className="relative mx-auto max-w-6xl px-6 py-12 sm:py-14">
        <div className="grid gap-10 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-4">
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="animate-glow-pulse text-[oklch(0.78_0.17_75)]" />
              <div className="font-hand text-3xl">{COMPANY.brand}</div>
            </div>
            <p className="mt-3 max-w-xs text-sm opacity-80">
              Premium Rakhi invite cards for every brother & sister, by {COMPANY.name}.
            </p>
            <p className="mt-3 text-xs opacity-60">GSTIN: {COMPANY.gst}</p>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-widest opacity-70">Quick Links</div>
            <ul className="mt-3 space-y-2 text-sm">
              {QUICK_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="group inline-flex items-center gap-1 opacity-80 transition-all hover:opacity-100"
                  >
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      {l.label}
                    </span>
                    <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-widest opacity-70">Contact</div>
            <ul className="mt-3 space-y-2.5 text-sm opacity-90">
              <li className="group flex items-start justify-center gap-2 sm:justify-start">
                <Phone size={15} className="mt-0.5 shrink-0 opacity-70 transition-transform group-hover:scale-110" />
                <a href={`tel:${COMPANY.phoneHref}`} className="hover:underline">{COMPANY.phone}</a>
              </li>
              <li className="flex items-start justify-center gap-2 sm:justify-start">
                <MessageCircle size={15} className="mt-0.5 shrink-0 opacity-70" />
                <a
                  href={`https://wa.me/${COMPANY.whatsappHref}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  WhatsApp: {COMPANY.whatsapp}
                </a>
              </li>
              <li className="flex items-start justify-center gap-2 sm:justify-start">
                <Mail size={15} className="mt-0.5 shrink-0 opacity-70" />
                <a href={`mailto:${COMPANY.email}`} className="hover:underline break-all">{COMPANY.email}</a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <div className="text-xs font-semibold uppercase tracking-widest opacity-70">Company</div>
            <div className="mt-3 text-sm opacity-90">
              <div className="font-medium">{COMPANY.name}</div>
              <div className="mt-2 flex items-start justify-center gap-2 opacity-80 sm:justify-start">
                <MapPin size={15} className="mt-0.5 shrink-0" />
                <span>
                  {COMPANY.addressLines.map((line) => (
                    <span key={line} className="block">{line}</span>
                  ))}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-10 flex flex-col items-center gap-4 border-t border-white/15 pt-6 text-center text-xs opacity-70 sm:flex-row sm:justify-between sm:text-left">
          <span>
            © {new Date().getFullYear()} {COMPANY.name}. All rights reserved. · Made with ❤️ for every brother
            and sister.
          </span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-[11px] font-medium uppercase tracking-widest opacity-80 transition hover:-translate-y-0.5 hover:opacity-100"
          >
            <ArrowUp size={12} /> Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
