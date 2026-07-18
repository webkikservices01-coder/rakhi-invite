import { useLocation } from "react-router-dom";
import { WhatsAppFab } from "./WhatsAppFab";

// The template viewer (/t/:tier/:id) already has its own fixed bottom-right
// controls (music player, AI chat), so we keep the WhatsApp FAB off that route.
export function GlobalChrome() {
  const location = useLocation();
  const isViewerRoute = location.pathname.startsWith("/t/");
  if (isViewerRoute) return null;
  return <WhatsAppFab />;
}
