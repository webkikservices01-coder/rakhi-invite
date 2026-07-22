import { Link, NavLink } from "react-router-dom";
import { Menu, X, Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { COMPANY } from "@/verticals/wedding/data/company";
import { useState, type ReactNode } from "react";
import type { Country, Tier } from "@/verticals/wedding/data/templates";

type FooterSearch = { country?: Country; tier?: Tier };

const NAV_LINKS = [
  { to: "/wedding", label: "Home", exact: true },
  { to: "/wedding/templates", label: "Templates", exact: false },
  { to: "/wedding/pricing", label: "Pricing", exact: false },
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-border/60 bg-background/70">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-5 py-4">
        <Link to="/wedding" className="flex items-center gap-3">
          <div
            className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-primary-foreground"
            style={{
              background: "var(--gradient-gold)",
              fontFamily: "var(--font-display)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            D
          </div>
          <div>
            <div
              className="text-base font-bold tracking-widest"
              style={{ fontFamily: "var(--font-display)" }}
            >
              DREAM WEDDING
            </div>
            <div
              className="text-[10px] uppercase tracking-[0.35em] text-primary"
              style={{ fontFamily: "var(--font-label)" }}
            >
              Premium Invitation Templates
            </div>
          </div>
        </Link>
        <nav
          className="ml-auto hidden items-center gap-6 md:flex"
          style={{ fontFamily: "var(--font-label)" }}
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) =>
                isActive
                  ? "site-nav-link text-xs uppercase tracking-[0.25em] text-primary opacity-100"
                  : "site-nav-link text-xs uppercase tracking-[0.25em] opacity-70 transition hover:opacity-100"
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/wedding/templates"
            className="rounded-full px-5 py-2 text-xs uppercase tracking-[0.2em] text-primary-foreground transition-transform hover:scale-105"
            style={{
              background: "var(--gradient-gold)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            Search
          </Link>
        </nav>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="ml-auto grid h-10 w-10 place-items-center rounded-full border border-primary/30 text-primary md:hidden"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {menuOpen && (
        <nav
          className="border-t border-border/60 bg-background/95 px-5 py-4 md:hidden"
          style={{ fontFamily: "var(--font-label)" }}
        >
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "text-sm uppercase tracking-[0.25em] text-primary"
                    : "text-sm uppercase tracking-[0.25em] opacity-80 transition hover:opacity-100"
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/wedding/templates"
              onClick={() => setMenuOpen(false)}
              className="rounded-full px-5 py-2.5 text-center text-xs uppercase tracking-[0.2em] text-primary-foreground"
              style={{ background: "var(--gradient-gold)" }}
            >
              Search
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background/60 py-14">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div
              className="text-3xl font-black tracking-[0.18em] text-primary sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              DREAM WEDDING
            </div>
            <p className="mt-4 max-w-md text-lg font-semibold leading-7 text-foreground/90">
              Premium wedding invitation templates, crafted for every corner of
              the world.
            </p>
            <ul className="mt-6 space-y-3.5 text-[1rem] font-semibold text-foreground/80">
              <li>
                <span className="text-lg font-bold text-foreground">
                  {COMPANY.name}
                </span>
                <br />
                <span className="text-sm font-medium text-muted-foreground">
                  GSTIN: {COMPANY.gst}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={19} className="mt-0.5 shrink-0 text-primary" />
                <span className="text-sm font-medium leading-6 text-muted-foreground">
                  {COMPANY.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={19} className="shrink-0 text-primary" />
                <a
                  href={`tel:${COMPANY.phoneHref}`}
                  className="text-sm font-medium transition hover:text-foreground"
                >
                  {COMPANY.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle size={19} className="shrink-0 text-primary" />
                <a
                  href={`https://wa.me/${COMPANY.whatsappHref}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium transition hover:text-foreground"
                >
                  WhatsApp: {COMPANY.whatsapp}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={19} className="shrink-0 text-primary" />
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="text-sm font-medium transition hover:text-foreground"
                >
                  {COMPANY.email}
                </a>
              </li>
            </ul>
          </div>
          <FooterCol
            title="Explore"
            links={[
              { to: "/wedding", label: "Home" },
              { to: "/wedding/templates", label: "Templates" },
              { to: "/wedding/pricing", label: "Pricing" },
            ]}
          />
          <FooterCol
            title="Countries"
            links={[
              {
                to: "/wedding/templates",
                search: { country: "india" },
                label: "India",
              },
              { to: "/wedding/templates", search: { country: "uae" }, label: "UAE" },
              {
                to: "/wedding/templates",
                search: { country: "france" },
                label: "France",
              },
              { to: "/wedding/templates", search: { country: "usa" }, label: "USA" },
              {
                to: "/wedding/templates",
                search: { country: "italy" },
                label: "Italy",
              },
            ]}
          />
          <FooterCol
            title="Tiers"
            links={[
              { to: "/wedding/templates", search: { tier: "silver" }, label: "Silver" },
              { to: "/wedding/templates", search: { tier: "gold" }, label: "Gold" },
              {
                to: "/wedding/templates",
                search: { tier: "platinum" },
                label: "Platinum",
              },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { to: "/wedding/about", label: "About Us" },
              { to: "/wedding/contact", label: "Contact Us" },
              { to: "/wedding/faqs", label: "FAQs" },
              { to: "/wedding/privacy-policy", label: "Privacy Policy" },
              { to: "/wedding/terms", label: "Terms & Conditions" },
              { to: "/wedding/refund-policy", label: "Refund Policy" },
              { to: "/wedding/cancellation-policy", label: "Cancellation Policy" },
            ]}
          />
        </div>
        <div className="mt-10 border-t border-border/50 pt-6 text-center text-sm font-semibold uppercase tracking-[0.24em] text-foreground/80">
          © {new Date().getFullYear()} · {COMPANY.name} · Dream Wedding ·
          Crafted with love
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string; search?: FooterSearch }[];
}) {
  return (
    <div>
      <div
        className="text-sm font-semibold uppercase tracking-[0.3em] text-foreground"
        style={{ fontFamily: "var(--font-label)" }}
      >
        {title}
      </div>
      <ul className="mt-4 space-y-2.5 text-[0.98rem] font-medium text-muted-foreground">
        {links.map((link) => {
          const query = link.search
            ? `?${new URLSearchParams(link.search as Record<string, string>).toString()}`
            : "";
          return (
            <li key={link.label}>
              <Link
                to={`${link.to}${query}`}
                className="transition hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
