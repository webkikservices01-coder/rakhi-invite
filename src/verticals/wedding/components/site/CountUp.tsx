import { useEffect, useRef, useState } from "react";
import { useInView } from "@/verticals/wedding/components/site/Reveal";

/* Counts up from 0 to `value` once the element scrolls into view — used for
   the Home page stat strip (templates / countries / tiers). */
export function CountUp({
  value,
  durationMs = 1400,
  suffix = "",
}: {
  value: number;
  durationMs?: number;
  suffix?: string;
}) {
  const [ref, visible] = useInView<HTMLSpanElement>(0.4);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!visible || started.current) return;
    started.current = true;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, value, durationMs]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}
