import { useEffect, useMemo, useState } from "react";
import type { Decoration } from "@/data/templates";

const EMOJI: Record<Decoration, string[]> = {
  glitter: ["✨", "⭐", "💫", "🌟"],
  hearts: ["❤️", "💗", "💖", "💕"],
  balloons: ["🎈", "🎈", "🎈"],
  flowers: ["🌸", "🌺", "🌼", "🌻", "🏵️"],
  petals: ["🌸", "🌷", "🌹"],
  diyas: ["🪔", "🪔"],
  sparkles: ["✨", "💠", "🔸"],
  stars: ["⭐", "🌟", "✦"],
  confetti: ["🎉", "🎊", "✨", "🌟"],
};

const DIRECTION: Record<Decoration, "up" | "down"> = {
  glitter: "down",
  hearts: "down",
  balloons: "up",
  flowers: "down",
  petals: "down",
  diyas: "up",
  sparkles: "down",
  stars: "down",
  confetti: "down",
};

export function Decorations({ type, density = 25 }: { type: Decoration; density?: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const particles = useMemo(() => {
    const emojis = EMOJI[type];
    const dir = DIRECTION[type];
    return Array.from({ length: density }, (_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 8,
      size: 16 + Math.random() * 24,
      dir,
    }));
  }, [type, density]);

  if (!mounted) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {particles.map(p => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            animation: `${p.dir === "up" ? "float-up" : "fall-down"} ${p.duration}s linear ${p.delay}s infinite`,
            opacity: 0.85,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
