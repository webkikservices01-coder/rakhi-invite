import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, X, Check, ImagePlus } from "lucide-react";
import type { Template, InviteOverrides } from "@/verticals/wedding/data/templates";
import { API_BASE } from "@/verticals/wedding/lib/api-base";
import { isTierUnlocked, unlockTier } from "@/verticals/wedding/lib/payment";
import { PaywallModal } from "@/verticals/wedding/components/wedding/PaywallModal";

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/* =========================================================
   QuickEditPanel — a lightweight, non-AI editor available on
   every Silver and Gold invite (the AI Wedding Assistant chat
   stays a Platinum-exclusive feature). Plain form fields that
   update the live preview instantly via onFieldsUpdate.
   ========================================================= */

interface QuickEditPanelProps {
  template: Template;
  onFieldsUpdate: (fields: InviteOverrides) => void;
}

/* datetime-local inputs need "YYYY-MM-DDTHH:mm" with no timezone suffix */
function toDatetimeLocalValue(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function QuickEditPanel({
  template,
  onFieldsUpdate,
}: QuickEditPanelProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [form, setForm] = useState({
    coupleOne: template.couple.one,
    coupleTwo: template.couple.two,
    date: template.date,
    eventDateLocal: toDatetimeLocalValue(template.eventDate),
    venueName: template.venue.name,
    venueAddress: template.venue.address,
    tagline: template.tagline,
    story: template.story,
    image: template.image ?? "",
  });
  const [imageError, setImageError] = useState("");

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError("");
    try {
      const dataUrl = await fileToDataUrl(file);
      setForm((prev) => ({ ...prev, image: dataUrl }));
    } catch (error) {
      console.error("Photo read failed:", error);
      setImageError("Could not read that photo. Try a smaller image file.");
    }
  };

  const buildOverrides = (): InviteOverrides => {
    const parsed = form.eventDateLocal ? new Date(form.eventDateLocal) : null;
    return {
      coupleOne: form.coupleOne,
      coupleTwo: form.coupleTwo,
      date: form.date,
      eventDate:
        parsed && !Number.isNaN(parsed.getTime())
          ? parsed.toISOString()
          : undefined,
      venueName: form.venueName,
      venueAddress: form.venueAddress,
      tagline: form.tagline,
      story: form.story,
      image: form.image || undefined,
    };
  };

  const apply = () => {
    onFieldsUpdate(buildOverrides());
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const publish = async () => {
    if (publishing) return;
    if (template.tier !== "silver" && !isTierUnlocked(template.tier)) {
      setShowPaywall(true);
      return;
    }
    setPublishing(true);
    apply();
    const inviteId = `${template.slug}-${Date.now()}`;
    const invite = {
      slug: template.slug,
      overrides: buildOverrides(),
      createdAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(
        `wedding-invite-${inviteId}`,
        JSON.stringify(invite),
      );
    } catch (error) {
      console.error("LocalStorage publish failed:", error);
      alert("Unable to save the invitation to your browser storage.");
      setPublishing(false);
      return;
    }
    try {
      await fetch(`${API_BASE}/api/invites/${inviteId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invite),
      });
    } catch (error) {
      console.error("Failed to publish invite to server:", error);
    }
    navigate(`/wedding/invite/${inviteId}`);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Edit invitation details"
        className="wt-fab-pop fixed bottom-6 right-6 z-[70] flex h-14 items-center gap-2 rounded-full px-5 text-sm font-semibold uppercase tracking-[0.15em] shadow-2xl transition-transform hover:scale-105"
        style={{
          background:
            "linear-gradient(135deg, var(--wt-gold-lite), var(--wt-gold))",
          color: "var(--wt-bg-1)",
          border: "2px solid rgba(255,255,255,0.7)",
        }}
        title="Edit couple names, date, venue and story"
      >
        <Pencil size={16} />
        <span className="hidden sm:inline">Edit Details</span>
      </button>

      {open && (
        <div
          className="wt-panel-in fixed bottom-24 right-6 z-[71] flex w-[min(380px,92vw)] max-h-[74vh] flex-col overflow-hidden rounded-3xl border-2"
          style={{
            background: "var(--wt-bg-1)",
            borderColor: "var(--wt-gold)",
            boxShadow: "0 34px 90px rgba(0,0,0,.65)",
          }}
        >
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{
              background:
                "linear-gradient(135deg, var(--wt-accent), var(--wt-accent-deep))",
            }}
          >
            <div
              className="grid h-10 w-10 place-items-center rounded-full text-lg"
              style={{
                background: "var(--wt-gold-lite)",
                color: "var(--wt-bg-1)",
              }}
            >
              <Pencil size={16} />
            </div>
            <div className="text-white">
              <div
                className="text-sm font-bold"
                style={{ fontFamily: "var(--wt-display)" }}
              >
                Edit Invitation Details
              </div>
              <div
                className="text-[11px] tracking-[0.15em]"
                style={{ color: "var(--wt-gold-lite)" }}
              >
                Changes preview instantly
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto text-white transition hover:opacity-70"
              aria-label="Close editor"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            <FieldRow label="Cover Photo">
              <label
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed py-4 text-xs uppercase tracking-[0.15em] transition hover:opacity-80"
                style={{
                  borderColor: "var(--wt-gold)",
                  color: "var(--wt-gold-lite)",
                }}
              >
                <ImagePlus size={16} />
                {form.image ? "Replace Photo" : "Upload Photo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
              {imageError && (
                <p className="mt-1 text-xs text-red-400">{imageError}</p>
              )}
              {form.image && (
                <img
                  src={form.image}
                  alt="New cover preview"
                  className="mt-2 h-24 w-full rounded-xl object-cover"
                  style={{ border: "1px solid var(--wt-gold)" }}
                />
              )}
            </FieldRow>
            <FieldRow label="Partner One">
              <input
                value={form.coupleOne}
                onChange={set("coupleOne")}
                style={fieldStyle}
              />
            </FieldRow>
            <FieldRow label="Partner Two">
              <input
                value={form.coupleTwo}
                onChange={set("coupleTwo")}
                style={fieldStyle}
              />
            </FieldRow>
            <FieldRow label="Wedding Date (display text)">
              <input
                value={form.date}
                onChange={set("date")}
                style={fieldStyle}
              />
            </FieldRow>
            <FieldRow label="Event Date & Time (drives countdown)">
              <input
                type="datetime-local"
                value={form.eventDateLocal}
                onChange={set("eventDateLocal")}
                style={fieldStyle}
              />
            </FieldRow>
            <FieldRow label="Venue Name">
              <input
                value={form.venueName}
                onChange={set("venueName")}
                style={fieldStyle}
              />
            </FieldRow>
            <FieldRow label="Venue Address">
              <input
                value={form.venueAddress}
                onChange={set("venueAddress")}
                style={fieldStyle}
              />
            </FieldRow>
            <FieldRow label="Tagline">
              <input
                value={form.tagline}
                onChange={set("tagline")}
                style={fieldStyle}
              />
            </FieldRow>
            <FieldRow label="Our Story">
              <textarea
                value={form.story}
                onChange={set("story")}
                rows={4}
                style={fieldStyle}
              />
            </FieldRow>
          </div>

          <div
            className="border-t space-y-2 p-3"
            style={{ borderColor: "var(--wt-gold)" }}
          >
            <button
              onClick={apply}
              className="flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold uppercase tracking-[0.15em] transition hover:opacity-90"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid var(--wt-gold)",
                color: "var(--wt-ink)",
              }}
            >
              {saved ? <Check size={16} /> : <Pencil size={16} />}
              {saved ? "Preview Updated" : "Update Preview"}
            </button>
            <button
              onClick={publish}
              disabled={publishing}
              className="flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-80"
              style={{
                background:
                  "linear-gradient(135deg, var(--wt-accent), var(--wt-accent-deep))",
              }}
            >
              {publishing ? (
                <>
                  <span className="flex gap-1">
                    <span
                      className="wt-dot"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="wt-dot"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="wt-dot"
                      style={{ animationDelay: "300ms" }}
                    />
                  </span>
                  Publishing...
                </>
              ) : (
                "Publish Invitation"
              )}
            </button>
          </div>
        </div>
      )}

      {showPaywall && template.tier !== "silver" && (
        <PaywallModal
          tier={template.tier}
          templateId={template.slug}
          onUnlocked={() => {
            unlockTier(template.tier as "gold" | "platinum");
            setShowPaywall(false);
            void publish();
          }}
          onClose={() => setShowPaywall(false)}
        />
      )}
    </>
  );
}

const fieldStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: "0.75rem",
  padding: "0.6rem 0.9rem",
  outline: "none",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid var(--wt-gold)",
  color: "var(--wt-ink)",
  fontFamily: "var(--wt-body)",
  fontSize: "0.95rem",
};

function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span
        className="mb-1 block text-[11px] uppercase tracking-[0.2em]"
        style={{ fontFamily: "var(--wt-label)", color: "var(--wt-gold-lite)" }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}
