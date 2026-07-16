import { createServerFn } from "@tanstack/react-start";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const anthropic = new Anthropic();

const HistoryMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  text: z.string(),
});

const CurrentFieldsSchema = z.object({
  brotherName: z.string().optional(),
  sisterName: z.string().optional(),
  message: z.string().optional(),
  wish: z.string().optional(),
  fontOverride: z.enum(["display", "hand", "deva"]).optional(),
  paletteOverride: z
    .object({
      bg: z.string().optional(),
      surface: z.string().optional(),
      text: z.string().optional(),
      accent: z.string().optional(),
      accent2: z.string().optional(),
    })
    .optional(),
});

const CommandSchema = z.object({
  message: z.string().min(1).max(500),
  lang: z.enum(["en", "hi"]).default("en"),
  history: z.array(HistoryMessageSchema).default([]),
  currentFields: CurrentFieldsSchema.optional(),
  context: z
    .object({
      templateName: z.string().optional(),
      tier: z.enum(["silver", "gold", "platinum"]).optional(),
      hasMusic: z.boolean().optional(),
      hasPhotos: z.boolean().optional(),
      brotherName: z.string().optional(),
      sisterName: z.string().optional(),
      from: z.enum(["sister", "brother"]).optional(),
    })
    .optional(),
});

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

const UPDATE_FIELDS_TOOL: Anthropic.Tool = {
  name: "update_fields",
  description:
    "Record template details the user just gave or confirmed. Call this any time the user provides or confirms information, even partial. Only include fields the user actually addressed this turn.",
  input_schema: {
    type: "object",
    properties: {
      brotherName: { type: "string", description: "Brother's name" },
      sisterName: { type: "string", description: "Sister's name" },
      message: {
        type: "string",
        description: "The main rakhi message/note shown on the card",
      },
      wish: {
        type: "string",
        description: "Short handwritten-style wish line",
      },
      fontOverride: {
        type: "string",
        enum: ["display", "hand", "deva"],
        description:
          "display = classic serif, hand = handwritten, deva = Devanagari",
      },
      bg: {
        type: "string",
        description:
          "Background CSS color/gradient (hex, oklch(...), or linear-gradient(...))",
      },
      surface: { type: "string", description: "Card/surface CSS color" },
      text: { type: "string", description: "Main text CSS color" },
      accent: {
        type: "string",
        description: "Accent CSS color for buttons/highlights",
      },
      accent2: { type: "string", description: "Secondary accent CSS color" },
    },
    additionalProperties: false,
  },
};

const CHANGE_MUSIC_TOOL: Anthropic.Tool = {
  name: "change_music",
  description:
    "Skip to the next or previous background music track. Only call this if the template's tier actually has music enabled.",
  input_schema: {
    type: "object",
    properties: {
      direction: { type: "string", enum: ["next", "prev"] },
    },
    required: ["direction"],
    additionalProperties: false,
  },
};

function toolInputToActions(
  name: string,
  input: Record<string, unknown>,
): Action[] {
  const actions: Action[] = [];
  if (name === "update_fields") {
    const brother = input.brotherName as string | undefined;
    const sister = input.sisterName as string | undefined;
    if (brother || sister) actions.push({ type: "setNames", brother, sister });
    if (typeof input.message === "string")
      actions.push({ type: "setMessage", value: input.message });
    if (typeof input.wish === "string")
      actions.push({ type: "setWish", value: input.wish });
    if (typeof input.fontOverride === "string") {
      actions.push({
        type: "setFont",
        value: input.fontOverride as "display" | "hand" | "deva",
      });
    }
    for (const target of [
      "bg",
      "surface",
      "text",
      "accent",
      "accent2",
    ] as const) {
      if (typeof input[target] === "string") {
        actions.push({
          type: "setColor",
          target,
          value: input[target] as string,
        });
      }
    }
  } else if (name === "change_music") {
    actions.push(
      input.direction === "prev"
        ? { type: "prevMusic" }
        : { type: "nextMusic" },
    );
  }
  return actions;
}

/**
 * AI chat for the rakhi template editor. Returns:
 *  - reply: natural language response (in chosen language)
 *  - actionsJson: structured commands the client applies via TemplateEngine's handleAction
 */
export const rakhiChat = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => CommandSchema.parse(input))
  .handler(async ({ data }) => {
    if (!process.env.ANTHROPIC_API_KEY) {
      return {
        reply:
          data.lang === "hi"
            ? "AI service abhi available nahi hai. Baad mein try karein."
            : "AI service isn't available right now. Please try again later.",
        actionsJson: "[]",
      };
    }

    const ctx = data.context ?? {};
    const fields = data.currentFields ?? {};

    const system = `You are "Marvels", a warm AI assistant embedded inside a Raksha Bandhan greeting template called "${ctx.templateName ?? "this template"}" (${ctx.tier ?? "unknown"} tier).

Respond in ${data.lang === "hi" ? "Hindi (Devanagari or Hinglish, whichever the user is using)" : "English"}.

Current values:
- Brother: ${fields.brotherName ?? ctx.brotherName ?? "Bhaiya"}
- Sister: ${fields.sisterName ?? ctx.sisterName ?? "Behna"}
- Card is from: ${ctx.from ?? "sister"}
- Message: ${fields.message ?? "(default placeholder)"}
- Wish: ${fields.wish ?? "(default placeholder)"}
- Font: ${fields.fontOverride ?? "display"}
- Colors: ${JSON.stringify(fields.paletteOverride ?? {})}

This tier ${ctx.hasMusic ? "HAS background music (you may skip tracks)" : "has NO music section — never call change_music or claim to change music"}. ${
      ctx.hasPhotos
        ? "Photo upload is available, but done through the page's own upload button, not through you — if asked, tell the user to use the photo upload button."
        : "Photo upload is NOT available on this tier — if asked, tell the user it's a Gold/Platinum feature."
    }

Your job:
1. Help the user personalize their card: brother/sister names, the message, the wish, the font, and the color scheme.
2. Whenever the user gives or confirms any detail, call the update_fields tool with just that data — don't wait to batch everything.
3. Only pass a color value in update_fields when the user clearly wants a color/theme change — pick a fitting CSS color, oklch() value, or gradient yourself.
4. Keep replies warm, festive, and short (1-3 sentences). Never mention tools, JSON, or actions to the user — just say what you did.`;

    const messages: Anthropic.MessageParam[] = [
      ...data.history.map(
        (m) => ({ role: m.role, content: m.text }) as Anthropic.MessageParam,
      ),
      { role: "user", content: data.message },
    ];

    try {
      const response = await anthropic.messages.create({
        model: "claude-opus-4-8",
        max_tokens: 512,
        system,
        messages,
        tools: [UPDATE_FIELDS_TOOL, CHANGE_MUSIC_TOOL],
      });

      let reply = "";
      const actions: Action[] = [];
      for (const block of response.content) {
        if (block.type === "text") {
          reply += block.text;
        } else if (block.type === "tool_use") {
          actions.push(
            ...toolInputToActions(
              block.name,
              block.input as Record<string, unknown>,
            ),
          );
        }
      }
      if (!reply.trim())
        reply = data.lang === "hi" ? "Ho gaya! ✨" : "Done! ✨";

      return { reply, actionsJson: JSON.stringify(actions) };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      return {
        reply:
          data.lang === "hi"
            ? `AI se baat nahi ho paayi: ${msg}`
            : `Couldn't reach the assistant: ${msg}`,
        actionsJson: "[]",
      };
    }
  });
