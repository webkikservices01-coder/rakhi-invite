import { useState, type FormEvent, type ReactNode } from "react";
import { Phone, Mail, MapPin, MessageCircle, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import { InfoPageLayout } from "@/components/site/InfoPageLayout";
import { COMPANY } from "@/data/company";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone.trim() ? `Phone: ${phone}` : null,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    const mailto = `mailto:${COMPANY.email}?subject=${encodeURIComponent(
      subject.trim() || `Enquiry from ${name}`,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    toast.success("Opening your email app to send this message…");
  };

  return (
    <InfoPageLayout title="Contact Us" subtitle="We'd love to hear from you — reach out anytime.">
      <div className="not-prose grid gap-8 lg:grid-cols-5">
        <form onSubmit={handleSubmit} className="lg:col-span-3 rounded-3xl border border-current/10 bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8">
          <h2 className="font-display text-2xl font-bold">Send us a message</h2>
          <p className="mt-1 text-sm opacity-70">We usually respond within 1–2 business days.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" required>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-400"
              />
            </Field>
            <Field label="Email Address" required>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-400"
              />
            </Field>
            <Field label="Phone Number">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-400"
              />
            </Field>
            <Field label="Subject">
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What's this about?"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-400"
              />
            </Field>
            <Field label="Message" required className="sm:col-span-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                rows={5}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-400"
              />
            </Field>
          </div>

          <button
            type="submit"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-maroon-gold px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:scale-105"
          >
            <Send size={15} /> Send Message
          </button>
        </form>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-current/10 bg-white/70 p-6 shadow-soft backdrop-blur">
            <h2 className="font-display text-xl font-bold">Contact Details</h2>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone size={17} className="mt-0.5 shrink-0 opacity-70" />
                <div>
                  <div className="font-medium">Support Number</div>
                  <a href={`tel:${COMPANY.phoneHref}`} className="opacity-80 hover:underline">{COMPANY.phone}</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle size={17} className="mt-0.5 shrink-0 opacity-70" />
                <div>
                  <div className="font-medium">WhatsApp</div>
                  <a href={`https://wa.me/${COMPANY.whatsappHref}`} target="_blank" rel="noreferrer" className="opacity-80 hover:underline">
                    {COMPANY.whatsapp}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={17} className="mt-0.5 shrink-0 opacity-70" />
                <div>
                  <div className="font-medium">Email</div>
                  <a href={`mailto:${COMPANY.email}`} className="opacity-80 hover:underline">{COMPANY.email}</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={17} className="mt-0.5 shrink-0 opacity-70" />
                <div>
                  <div className="font-medium">Office Address</div>
                  <div className="opacity-80">
                    {COMPANY.addressLines.map((line) => (
                      <span key={line} className="block">{line}</span>
                    ))}
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={17} className="mt-0.5 shrink-0 opacity-70" />
                <div>
                  <div className="font-medium">Business Hours</div>
                  <div className="opacity-80">{COMPANY.hours}</div>
                </div>
              </li>
            </ul>
          </div>

          <div className="overflow-hidden rounded-3xl border border-current/10 shadow-soft">
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
    <label className={`block text-xs font-semibold uppercase tracking-wide opacity-70 ${className ?? ""}`}>
      {label}
      {required ? <span className="text-rose-500"> *</span> : null}
      <div className="mt-1.5 normal-case tracking-normal">{children}</div>
    </label>
  );
}
