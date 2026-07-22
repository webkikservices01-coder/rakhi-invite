import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

/* Thin gold bar pinned to the very top of the viewport that sweeps in on
   every route change — the "product" polish of Vercel/Linear-style
   navigation. Without TanStack Router's pending state to hook into, this
   just replays the same sweep-in/fill/fade animation whenever the pathname
   changes (client-side nav here is synchronous, so there's no real loading
   state to track). */
export function RouteProgress() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    let raf = 0;
    let fillTimer = 0;
    let hideTimer = 0;

    setVisible(true);
    setWidth(15);
    raf = window.requestAnimationFrame(() => setWidth(72));
    fillTimer = window.setTimeout(() => setWidth(100), 220);
    hideTimer = window.setTimeout(() => {
      setVisible(false);
      setWidth(0);
    }, 480);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(fillTimer);
      window.clearTimeout(hideTimer);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 top-0 z-[200] h-[3px] pointer-events-none"
      aria-hidden="true"
    >
      <div
        style={{
          width: `${width}%`,
          height: "100%",
          background: "var(--gradient-gold)",
          boxShadow:
            "0 0 14px color-mix(in oklab, var(--color-primary) 65%, transparent)",
          transition:
            "width 320ms cubic-bezier(0.16,1,0.3,1), opacity 260ms ease",
        }}
      />
    </div>
  );
}
