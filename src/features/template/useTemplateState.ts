import { useEffect, useMemo, useState } from "react";
import type { Template } from "@/data/templates";
import { rand, SISTER_TO_BROTHER, BROTHER_TO_SISTER, RAKHI_WISHES } from "@/data/notes";

export type CustomPalette = {
  bg?: string;
  surface?: string;
  text?: string;
  accent?: string;
  accent2?: string;
};

export type TemplateState = {
  brotherName: string;
  sisterName: string;
  from: "sister" | "brother";
  message: string;
  wish: string;
  photos: string[]; // data URLs
  musicSlot: number;
  musicUrls: Record<number, string>; // slot -> data URL
  paletteOverride: CustomPalette;
  fontOverride?: "display" | "hand" | "deva";
  aiLang: "en" | "hi";
};

const KEY = (tier: string, id: string) => `rakhi:${tier}:${id}`;

function initial(t: Template): TemplateState {
  const isBrother = t.noteSeed % 2 === 0;
  return {
    brotherName: "Bhaiya",
    sisterName: "Behna",
    from: isBrother ? "brother" : "sister",
    message: isBrother ? rand(BROTHER_TO_SISTER, t.noteSeed) : rand(SISTER_TO_BROTHER, t.noteSeed),
    wish: rand(RAKHI_WISHES, t.noteSeed),
    photos: [],
    musicSlot: 0,
    musicUrls: {},
    paletteOverride: {},
    aiLang: "en",
  };
}

export function useTemplateState(t: Template, initialState?: Partial<TemplateState>) {
  const key = KEY(t.tier, t.id);
  const locked = Boolean(initialState);
  const [state, setState] = useState<TemplateState>(() => ({ ...initial(t), ...initialState }));

  // hydrate from localStorage on mount (skip entirely for a locked/deployed invite)
  useEffect(() => {
    if (locked) return;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<TemplateState>;
        setState(prev => ({ ...prev, ...parsed }));
      }
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // persist (a locked/deployed invite is immutable — nothing to save)
  useEffect(() => {
    if (locked) return;
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch { /* ignore */ }
  }, [key, state, locked]);

  const palette = useMemo(() => ({ ...t.palette, ...state.paletteOverride }), [t.palette, state.paletteOverride]);

  return { state, setState, palette };
}
