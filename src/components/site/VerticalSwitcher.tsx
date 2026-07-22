import { Link, useLocation } from "react-router-dom";
import { ArrowLeftRight } from "lucide-react";

export function VerticalSwitcher() {
  const location = useLocation();
  const onWedding = location.pathname.startsWith("/wedding");
  const onRakhi = location.pathname.startsWith("/rakhi");
  if (!onWedding && !onRakhi) return null;

  const to = onWedding ? "/rakhi" : "/wedding";
  const label = onWedding ? "Rakhi Invitations" : "Wedding Invitations";

  return (
    <Link
      to={to}
      className="fixed bottom-4 left-4 z-50 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-black/85"
      style={{ paddingBottom: "calc(0.625rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <ArrowLeftRight size={13} /> {label}
    </Link>
  );
}
