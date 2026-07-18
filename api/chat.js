import { applyCors } from "./_lib/cors.js";

const ANTHROPIC_MODEL = "claude-haiku-4-5-20251001";

// Same palette the rule-based frontend fallback uses (src/lib/ai-chat.functions.ts)
// so a color name means the same thing whichever chatbot path answered it.
const COLOR_MAP = {
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

function systemPrompt(context) {
  return `You are Marvels, a playful, concise AI assistant embedded in a Raksha Bandhan e-card editor called Rakhi Vibes.

CURRENT CARD CONTEXT:
- Template: ${context.templateName || "unknown"} (${context.tier || "unknown"} tier)
- Card is from: ${context.from === "brother" ? "brother to sister" : "sister to brother"}
- Brother's name: ${context.brotherName || "Bhaiya"}, Sister's name: ${context.sisterName || "Behna"}
- Music player available: ${context.hasMusic ? "yes" : "no"}, Photo upload available: ${context.hasPhotos ? "yes" : "no"}

Users may write in Hindi, English, or Hinglish (Roman-script Hindi) — reply in whichever they used, default to English if unclear. Keep replies SHORT: 1-2 sentences. This is a small chat bubble, not a long conversation.

You can change the card by emitting special commands at the very end of your reply, each on its own line, AFTER your normal reply text:
[[SET_COLOR:<pink|purple|blue|green|red|gold|cream|maroon|rose>]] — change the card background color (pick the closest match to what the user asked for, e.g. "gulabi"/"pink"/"rose gold" -> pink or rose)
[[SET_MESSAGE:<text>]] — set the card's main message. If asked to write a message/poem for the brother or sister, write something warm, personal, and specific using their names — 2-4 sentences or a short 4-line poem.
[[SET_WISH:<text>]] — set the short one-line wish/blessing.
[[SET_NAMES:{"brother":"name","sister":"name"}]] — update names, include only the field(s) the user actually mentioned.
[[SET_FONT:<display|hand|deva>]] — change font style ("deva" = Devanagari/Hindi script, "hand" = handwritten style).
[[SET_LANG:<en|hi>]] — switch your own future replies to English or Hindi.

Rules: only emit a command for something the user actually asked for — never emit commands speculatively. Never invent private facts about the family. If the user's message doesn't call for any card change, just reply conversationally with no commands.

IMPORTANT — when the user asks you to suggest/write/generate something ("suggest a wish", "write a message", "give me a poem", "more/brighter colors" with no specific color named), don't offer multiple options or ask a clarifying question first — just pick your single best choice and apply it immediately with the matching command. Mention briefly what you picked, in one short sentence. Only ask a clarifying question if the request is genuinely impossible to act on at all.`;
}

function extractCommand(text, name) {
  const re = new RegExp(`\\[\\[${name}:([\\s\\S]*?)\\]\\]`, "i");
  const m = text.match(re);
  return m ? m[1].trim() : null;
}

function parseCommands(text) {
  const actions = [];

  const color = extractCommand(text, "SET_COLOR");
  if (color && COLOR_MAP[color.toLowerCase()]) {
    actions.push({ type: "setColor", target: "bg", value: COLOR_MAP[color.toLowerCase()] });
  }

  const message = extractCommand(text, "SET_MESSAGE");
  if (message) actions.push({ type: "setMessage", value: message });

  const wish = extractCommand(text, "SET_WISH");
  if (wish) actions.push({ type: "setWish", value: wish });

  const namesRaw = extractCommand(text, "SET_NAMES");
  if (namesRaw) {
    try {
      const parsed = JSON.parse(namesRaw);
      actions.push({ type: "setNames", brother: parsed.brother, sister: parsed.sister });
    } catch {
      /* malformed — skip */
    }
  }

  const font = extractCommand(text, "SET_FONT");
  if (font && ["display", "hand", "deva"].includes(font)) {
    actions.push({ type: "setFont", value: font });
  }

  const lang = extractCommand(text, "SET_LANG");
  if (lang && ["en", "hi"].includes(lang)) {
    actions.push({ type: "setLang", value: lang });
  }

  const reply = text.replace(/\[\[[\s\S]*?\]\]/g, "").trim();
  return { reply, actions };
}

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    const { message, history = [], context = {} } = req.body || {};
    if (!message?.trim()) return res.status(200).json({ reply: "", actionsJson: "[]" });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.status(503).json({ message: "AI not configured" });

    const anthropicMessages = [
      ...history.slice(-8).map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.text,
      })),
      { role: "user", content: message },
    ];

    const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 400,
        system: systemPrompt(context),
        messages: anthropicMessages,
      }),
    });

    const data = await aiRes.json();
    if (!aiRes.ok) {
      return res.status(502).json({ message: data.error?.message || "AI request failed" });
    }

    const rawText = data.content?.[0]?.text || "";
    const { reply, actions } = parseCommands(rawText);
    res.status(200).json({ reply, actionsJson: JSON.stringify(actions) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
