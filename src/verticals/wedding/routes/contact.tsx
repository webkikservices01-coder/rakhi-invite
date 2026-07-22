import { useState, type FormEvent, type ReactNode } from "react";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { InfoPageLayout } from "@/verticals/wedding/components/site/WeddingInfoPageLayout";
import { useDocumentHead } from "@/verticals/wedding/lib/use-document-head";
import { COMPANY } from "@/verticals/wedding/data/company";
import { API_BASE } from "@/verticals/wedding/lib/api-base";

export default function ContactPage() {
  useDocumentHead({
    title: `Contact Us · ${COMPANY.brand}`,
    description: `Get in touch with ${COMPANY.brand} — support, feedback and business enquiries.`,
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Couldn't send your message.");
      toast.success("Message sent — we'll get back to you soon!");
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Couldn't send your message.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <InfoPageLayout
      title="Contact Us"
      subtitle="We'd love to hear from you — reach out anytime."
    >
      <div className="not-prose grid gap-8 lg:grid-cols-5">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-3 rounded-3xl border border-primary/25 bg-card/60 p-6 backdrop-blur sm:p-8"
          style={{ boxShadow: "0 24px 60px rgba(0,0,0,.25)" }}
        >
          <h2
            className="text-2xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Send us a message
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            We usually respond within 1–2 business days.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" required>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full rounded-xl border border-primary/30 bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              />
            </Field>
            <Field label="Email Address" required>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-primary/30 bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              />
            </Field>
            <Field label="Phone Number">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full rounded-xl border border-primary/30 bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              />
            </Field>
            <Field label="Subject">
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What's this about?"
                className="w-full rounded-xl border border-primary/30 bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              />
            </Field>
            <Field label="Message" required className="sm:col-span-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                rows={5}
                className="w-full resize-none rounded-xl border border-primary/30 bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={sending}
            className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-primary-foreground transition-transform hover:scale-105 disabled:opacity-60"
            style={{
              background: "var(--gradient-gold)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            {sending ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Send size={15} />
            )}
            {sending ? "Sending…" : "Send Message"}
          </button>
        </form>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-primary/25 bg-card/60 p-6 backdrop-blur">
            <h2
              className="text-xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Contact Details
            </h2>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone size={17} className="mt-0.5 shrink-0 text-primary" />
                <div>
                  <div className="font-medium text-foreground">
                    Support Number
                  </div>
                  <a
                    href={`tel:${COMPANY.phoneHref}`}
                    className="text-muted-foreground hover:underline"
                  >
                    {COMPANY.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle
                  size={17}
                  className="mt-0.5 shrink-0 text-primary"
                />
                <div>
                  <div className="font-medium text-foreground">WhatsApp</div>
                  <a
                    href={`https://wa.me/${COMPANY.whatsappHref}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:underline"
                  >
                    {COMPANY.whatsapp}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={17} className="mt-0.5 shrink-0 text-primary" />
                <div>
                  <div className="font-medium text-foreground">Email</div>
                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="text-muted-foreground hover:underline"
                  >
                    {COMPANY.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={17} className="mt-0.5 shrink-0 text-primary" />
                <div>
                  <div className="font-medium text-foreground">
                    Office Address
                  </div>
                  <div className="text-muted-foreground">
                    {COMPANY.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={17} className="mt-0.5 shrink-0 text-primary" />
                <div>
                  <div className="font-medium text-foreground">
                    Business Hours
                  </div>
                  <div className="text-muted-foreground">{COMPANY.hours}</div>
                </div>
              </li>
            </ul>
          </div>

          <div className="overflow-hidden rounded-3xl border border-primary/25">
            <iframe
              title="Office location"
              src={COMPANY.mapEmbedSrc}
              className="h-64 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </InfoPageLayout>
  );
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label
      className={`block text-xs font-semibold uppercase tracking-wide text-muted-foreground ${className ?? ""}`}
    >
      {label}
      {required ? <span className="text-primary"> *</span> : null}
      <div className="mt-1.5 normal-case tracking-normal">{children}</div>
    </label>
  );
}
