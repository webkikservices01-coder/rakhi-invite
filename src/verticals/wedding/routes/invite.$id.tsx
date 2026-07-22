import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getTemplate,
  mergeTemplateWithOverrides,
  type InviteOverrides,
} from "@/verticals/wedding/data/templates";
import { TemplateInvite } from "@/verticals/wedding/components/wedding/TemplateInvite";
import { API_BASE } from "@/verticals/wedding/lib/api-base";

function InviteNotFound({ reason }: { reason: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-background p-6 text-center">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{reason}</h1>
        <p className="mt-3 text-muted-foreground">
          This personalized invitation doesn't exist or has expired.
        </p>
        <Link
          to="/wedding/templates"
          className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm uppercase tracking-widest text-primary-foreground"
        >
          Browse templates
        </Link>
      </div>
    </div>
  );
}

type StoredInvite = {
  slug: string;
  overrides: InviteOverrides;
  customMusicUrl?: string;
  createdAt?: string;
};

function loadStoredInvite(id: string): StoredInvite | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(`wedding-invite-${id}`);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as StoredInvite;
  } catch (e) {
    console.error("Failed to parse invite:", e);
    return null;
  }
}

export default function DeployedInvitePage() {
  const { id = "" } = useParams<{ id: string }>();
  // Lazy-initialized so a client-side navigation (e.g. the chatbot's
  // Deploy button) renders the real invite on the very first paint —
  // no artificial loading flash in between.
  const [invite, setInvite] = useState<StoredInvite | null>(() =>
    loadStoredInvite(id),
  );
  const [checkedServer, setCheckedServer] = useState(false);

  useEffect(() => {
    const local = loadStoredInvite(id);
    setInvite(local);
    setCheckedServer(false);

    // The creator's browser has it in localStorage instantly; anyone else
    // opening the shared link needs the server copy saved at deploy time.
    if (!local) {
      fetch(`${API_BASE}/api/invites/${id}`)
        .then((res) => (res.ok ? (res.json() as Promise<StoredInvite>) : null))
        .then((remote) => setInvite(remote))
        .catch(() => setInvite(null))
        .finally(() => setCheckedServer(true));
    } else {
      setCheckedServer(true);
    }
  }, [id]);

  if (!invite) {
    if (!checkedServer) return null;
    return <InviteNotFound reason="Invitation not found" />;
  }

  const template = getTemplate(invite.slug);
  if (!template) {
    return <InviteNotFound reason="Template not found" />;
  }

  // Merge template with overrides for display
  const customized = mergeTemplateWithOverrides(
    { ...template, music: invite.customMusicUrl || template.music },
    invite.overrides,
  );

  return (
    <div>
      <TemplateInvite template={customized} />

      {/* Share / Copy Link Button */}
      <div className="fixed top-24 left-1/2 z-[50] -translate-x-1/2">
        <button
          onClick={() => {
            const url = window.location.href;
            navigator.clipboard
              .writeText(url)
              .then(() => alert("Invitation link copied to clipboard!"))
              .catch(() =>
                alert(
                  `Couldn't copy automatically — here's your link:\n${url}`,
                ),
              );
          }}
          className="rounded-full bg-black/60 px-6 py-3 text-sm uppercase tracking-[0.25em] text-white backdrop-blur-md transition hover:bg-black/80"
          style={{ fontFamily: "var(--font-label)" }}
        >
          📋 Copy & Share Link
        </button>
      </div>
    </div>
  );
}
