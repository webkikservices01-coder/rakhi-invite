import { useLocation } from "react-router-dom";
import { WhatsAppFab } from "./WhatsAppFab";
import { VerticalSwitcher } from "./VerticalSwitcher";

// The template viewer (/rakhi/t/:tier/:id, /wedding/templates/:slug,
// /wedding/invite/:id) already has its own fixed bottom-right controls
// (music player, AI chat, share button) and is meant to read as a clean,
// full-bleed invite card — so all floating site chrome stays off those routes.
function isImmersiveViewer(pathname: string) {
  return pathname.startsWith("/rakhi/t/") || /^\/wedding\/(templates\/[^/]+$|invite\/)/.test(pathname);
}

export function GlobalChrome() {
  const location = useLocation();
  const viewer = isImmersiveViewer(location.pathname);
  const isWeddingRoute = location.pathname.startsWith("/wedding");

  return (
    <>
      {/* Rakhi-branded (uses Rakhi's COMPANY contact info), so kept off /wedding/* too — that vertical surfaces its own contact info instead. */}
      {!viewer && !isWeddingRoute && <WhatsAppFab />}
      {!viewer && <VerticalSwitcher />}
    </>
  );
}
