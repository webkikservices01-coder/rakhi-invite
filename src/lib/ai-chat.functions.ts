import { RAKHI_WISHES, SISTER_TO_BROTHER, BROTHER_TO_SISTER } from "@/data/notes";

type Action =
  | {
      type: "setColor";
      target: "bg" | "accent" | "text" | "surface" | "accent2";
      value: string;
    }
  | { type: "setMessage"; value: string }
  | { type: "setWish"; value: string }
  | { type: "setNames"; brother?: string; sister?: string }
  | { type: "setFont"; value: "display" | "hand" | "deva" }
  | { type: "setLang"; value: "en" | "hi" }
  | { type: "nextMusic" }
  | { type: "prevMusic" };

const COLOR_MAP: Record<string, string> = {
  pink: "oklch(0.92 0.08 350)",
  purple: "oklch(0.6 0.18 320)",
  blue: "oklch(0.68 0.16 230)",
  green: "oklch(0.72 0.14 150)",
  red: "oklch(0.7 0.2 18)",
  gold: "linear-gradient(135deg, oklch(0.82 0.18 75), oklch(0.7 0.19 45))",
  cream: "oklch(0.97 0.03 85)",
  maroon: "oklch(0.38 0.16 22)",
  rose: "oklch(0.86 0.1 345)",
};

// Hindi color words the suggestion chips / voice input commonly produce
const HINDI_COLOR_WORDS: Record<string, keyof typeof COLOR_MAP> = {
  gulabi: "pink",
  gulaabi: "pink",
  neela: "blue",
  neeli: "blue",
  hara: "green",
  hari: "green",
  laal: "red",
  lal: "red",
  sunehra: "gold",
  sunehri: "gold",
  safed: "cream",
  marun: "maroon",
  maroon: "maroon",
  baingani: "purple",
};

function detectColor(lower: string): string | null {
  const en = lower.match(/(pink|purple|blue|green|red|gold|cream|maroon|rose)/);
  if (en) return COLOR_MAP[en[1]];
  for (const word of Object.keys(HINDI_COLOR_WORDS)) {
    if (lower.includes(word)) return COLOR_MAP[HINDI_COLOR_WORDS[word]];
  }
  return null;
}

const pick = <T>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];

function generatePoem(lang: "en" | "hi", from: "sister" | "brother", brother: string, sister: string) {
  if (lang === "hi") {
    return from === "sister"
      ? `${brother} mere liye chaand-taare se pyaara,\nHar rakhi pe milta hai ek naya sahaara.\nDoor rahke bhi dil ke paas tu rehta hai,\n${sister} ki dua mein tu hamesha basta hai.`
      : `${sister} meri jaan, meri sabse pyari,\nTeri hansi se roshan hai zindagi hamari.\nRakhi ke is dhaage mein pyaar bharkar,\n${brother} khada hai tere saath, har pal sambhal kar.`;
  }
  return from === "sister"
    ? `${brother}, my forever guardian and friend,\nThrough every high and low, you're by my side till the end.\nThis Rakhi, I tie more than just a thread —\nA lifetime of love and blessings instead.`
    : `${sister}, my little star so bright,\nYou fill my world with warmth and light.\nThis Rakhi I promise, come what may,\nI'll protect and love you, every single day.`;
}

type ChatInput = {
  message: string;
  lang?: "en" | "hi";
  history?: Array<{ role: "user" | "assistant"; text: string }>;
  currentFields?: Record<string, unknown>;
  context?: Record<string, unknown>;
};
type ChatResult = { reply: string; actionsJson: string };

const API_BASE = import.meta.env.VITE_API_URL || "";

// Real AI (Claude, via api/chat.js — the key stays server-side there) when the
// backend is reachable; falls back to the offline rule-based responder below
// otherwise (e.g. a Hostinger-only static deploy with no /api, a network
// error, or the backend having no ANTHROPIC_API_KEY configured). This keeps
// the chat widget working either way instead of just showing an error.
export async function rakhiChat(input: ChatInput): Promise<ChatResult> {
  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(`AI backend ${res.status}`);
    const data = await res.json();
    if (typeof data.reply !== "string" || typeof data.actionsJson !== "string") {
      throw new Error("Malformed AI response");
    }
    return data as ChatResult;
  } catch {
    return ruleBasedChat(input);
  }
}

function ruleBasedChat(input: ChatInput): ChatResult {
  const lang = input.lang ?? "en";
  const text = input.message?.trim() ?? "";
  const actions: Action[] = [];

  if (!text) {
    return {
      reply: lang === "hi" ? "Aap kuch bhi bolo, main help karungi." : "Tell me what to change and I’ll help.",
      actionsJson: "[]",
    };
  }

  const lower = text.toLowerCase();
  const from = (input.context?.from as "brother" | "sister") ?? "sister";
  const brotherName = (input.context?.brotherName as string) || "Bhaiya";
  const sisterName = (input.context?.sisterName as string) || "Behna";

  // --- colors ---
  const wantsColorChange = /background|color|colour|theme|\bbg\b|rang/i.test(lower) || /make/i.test(lower);
  if (wantsColorChange) {
    const explicitColor = detectColor(lower);
    if (explicitColor) {
      actions.push({ type: "setColor", target: "bg", value: explicitColor });
    } else if (/bright|vibrant|zyada|tez|and more|another/i.test(lower)) {
      const keys = Object.keys(COLOR_MAP);
      actions.push({ type: "setColor", target: "bg", value: COLOR_MAP[pick(keys)] });
    }
  }

  // --- names ---
  const brotherMatch = text.match(/brother(?:\s+name)?(?:\s+is|:)?\s+([A-Za-zÀ-ÿ\s'-]+)/i);
  const sisterMatch = text.match(/sister(?:\s+name)?(?:\s+is|:)?\s+([A-Za-zÀ-ÿ\s'-]+)/i);
  if (brotherMatch || sisterMatch) {
    actions.push({
      type: "setNames",
      brother: brotherMatch?.[1]?.trim(),
      sister: sisterMatch?.[1]?.trim(),
    });
  }

  // --- wish ---
  const wantsWish = /\bwish\b|shubhkamna|dua\b/i.test(lower);
  if (wantsWish) {
    const explicitWish = text.match(/wish(?:\s+is|:)?\s+([^.?!]{4,})/i);
    actions.push({ type: "setWish", value: explicitWish ? explicitWish[1].trim() : pick(RAKHI_WISHES) });
  }

  // --- poem ---
  const wantsPoem = /\bpoem\b|kavita/i.test(lower);
  if (wantsPoem) {
    actions.push({ type: "setMessage", value: generatePoem(lang, from, brotherName, sisterName) });
  }

  // --- message (non-poem) ---
  if (!wantsPoem) {
    const explicitMessage = text.match(/message\s*(?:is|:)\s+([^.?!]{4,})/i);
    const wantsGenericMessage = /write.*message|message.*likho|likho.*message|\bmessage\b/i.test(lower);
    if (explicitMessage) {
      actions.push({ type: "setMessage", value: explicitMessage[1].trim() });
    } else if (wantsGenericMessage) {
      actions.push({ type: "setMessage", value: from === "sister" ? pick(SISTER_TO_BROTHER) : pick(BROTHER_TO_SISTER) });
    } else {
      const bareWrite = text.match(/^write\s+(.{4,})/i);
      if (bareWrite) {
        actions.push({ type: "setMessage", value: bareWrite[1].trim() });
      }
    }
  }

  // --- font ---
  if (/handwritten|hand/i.test(lower)) {
    actions.push({ type: "setFont", value: "hand" });
  } else if (/deva|hindi|devanagari/i.test(lower)) {
    actions.push({ type: "setFont", value: "deva" });
  }

  // --- language ---
  if (/english/i.test(lower)) {
    actions.push({ type: "setLang", value: "en" });
  } else if (/hindi|हिन्दी|हिंदी/i.test(lower)) {
    actions.push({ type: "setLang", value: "hi" });
  }

  let reply = lang === "hi"
    ? "Main ne aapki request follow kar li."
    : "I’ve applied the update to your card.";

  if (actions.length === 0) {
    reply = lang === "hi"
      ? "Main aapke message ko samjh nahi saka. Aap ek simple command try kariye jaise 'background pink karo' ya 'message likho'."
      : "I didn’t catch that clearly. Try a simple prompt like 'make the background pink' or 'write a message'.";
  } else if (lang === "hi") {
    reply = "Main ne aapki request ke hisaab se card ko update kar diya.";
  } else {
    reply = "I’ve updated your card based on your request.";
  }

  return {
    reply,
    actionsJson: JSON.stringify(actions),
  };
}
