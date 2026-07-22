import Anthropic from "@anthropic-ai/sdk";
import { applyCors } from "./_lib/cors.js";

const anthropic = new Anthropic();

const UPDATE_FIELDS_TOOL = {
  name: "update_fields",
  description:
    "Record wedding invitation details the user just gave or confirmed. Call this any time the user provides or confirms information, even partial. Only include fields the user actually addressed this turn.",
  input_schema: {
    type: "object",
    properties: {
      coupleOne: { type: "string", description: "First partner's name" },
      coupleTwo: { type: "string", description: "Second partner's name" },
      amp: {
        type: "string",
        description:
          "Connector word/symbol between the two names, e.g. '&' or 'weds'",
      },
      date: {
        type: "string",
        description: "Human-readable event date, e.g. '14 December 2026'",
      },
      eventDate: {
        type: "string",
        description:
          "ISO 8601 datetime for the countdown timer, e.g. '2026-12-14T18:30:00'",
      },
      venueName: { type: "string", description: "Venue name" },
      venueAddress: { type: "string", description: "Venue address" },
      story: {
        type: "string",
        description: "Short love-story paragraph shown on the invite",
      },
      tagline: {
        type: "string",
        description: "Short tagline shown near the hero",
      },
      script: {
        type: "string",
        description:
          "Short greeting line shown above the couple's names in the hero (e.g. 'शुभ विवाह', 'Notre Mariage', 'بركة').",
      },
      hashtag: {
        type: "string",
        description:
          "The couple's wedding hashtag, e.g. '#RohanWedsPriya'. Always include the leading #.",
      },
      ceremonies: {
        type: "array",
        description:
          "The FULL list of wedding events/ceremonies (e.g. Mehendi, Sangeet, Haldi, Wedding, Reception). Always send the complete list — including events that didn't change this turn — never a partial diff.",
        items: {
          type: "object",
          properties: {
            icon: {
              type: "string",
              description: "A single emoji representing the event",
            },
            hi: {
              type: "string",
              description: "Short native-language label for the event",
            },
            name: {
              type: "string",
              description: "Event name, e.g. 'Sangeet Ceremony'",
            },
            date: {
              type: "string",
              description: "Event date as display text, e.g. '23 Nov 2026'",
            },
            time: {
              type: "string",
              description: "Event time as display text, e.g. '7:00 PM'",
            },
            venue: { type: "string", description: "Event venue name" },
          },
          required: ["icon", "hi", "name", "date", "time", "venue"],
          additionalProperties: false,
        },
      },
      monumentNames: {
        type: "array",
        description:
          "Labels shown under each destination photo in the Destinations section. Always send the complete list, matching the number of destination photos already on the template.",
        items: { type: "string" },
      },
      music: {
        type: "string",
        description:
          "An actual uploaded audio file URL only — never fill this from a spoken/typed music-style preference.",
      },
      image: {
        type: "string",
        description:
          "Photo file URL for the invitation — this replaces the main cover/hero background photo across the whole invite.",
      },
      video: {
        type: "string",
        description: "Video file URL for the invitation",
      },
    },
    additionalProperties: false,
  },
};

const MARK_READY_TOOL = {
  name: "mark_ready_to_deploy",
  description:
    "Call this once both names, the date, and the venue have been confirmed by the user and there is nothing important left to ask.",
  input_schema: { type: "object", properties: {}, additionalProperties: false },
};

function sanitizeForPrompt(fields) {
  const sanitized = { ...fields };
  if (sanitized.music && typeof sanitized.music === "string") {
    sanitized.music = "[uploaded music]";
  }
  if (sanitized.image && typeof sanitized.image === "string") {
    sanitized.image = "[uploaded image]";
  }
  if (sanitized.video && typeof sanitized.video === "string") {
    sanitized.video = "[uploaded video]";
  }
  for (const key of Object.keys(sanitized)) {
    const value = sanitized[key];
    if (typeof value === "string" && value.length > 500) {
      sanitized[key] = `${value.slice(0, 180)}... [truncated]`;
    }
  }
  return sanitized;
}

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const payload = req.body || {};
  // The client sends the template's text fields directly (it already has the
  // full Template object) rather than a slug to look up — this handler has
  // no dependency on src/data/templates.ts (which also pulls in ~4000 lines
  // of image imports that don't belong in a serverless bundle).
  const template = payload.template;
  if (!template || !template.name || !template.couple || !template.venue) {
    return res.status(400).json({ error: "Missing template details" });
  }

  const messages = Array.isArray(payload.messages) ? payload.messages : [];
  const currentFields = payload.currentFields ?? {};

  const hasCeremonies =
    template.tier === "gold" || template.tier === "platinum";

  const system = `You are a friendly wedding-invitation customization concierge for the "${template.name}" template.

Current template defaults (placeholders, not the real couple):
- Names: ${template.couple.one} ${template.couple.amp} ${template.couple.two}
- Date: ${template.date}
- Venue: ${template.venue.name}, ${template.venue.address}
- Story: ${template.story}
- Tagline: ${template.tagline}
- Greeting line shown in the hero: ${template.script}
- Wedding hashtag: ${template.hashtag ?? "(none set yet)"}
- Destination photo labels: ${JSON.stringify(template.monumentNames)}
${hasCeremonies ? `- Wedding events/ceremonies: ${JSON.stringify(template.ceremonies)}` : "- This tier has no ceremonies/events section — do not ask about individual events."}

- Fields already confirmed by the user so far (JSON): ${JSON.stringify(sanitizeForPrompt(currentFields))}

Your job — every part of this template is editable, not just the basics:
1. If nothing is confirmed yet, briefly show the current placeholder details above and ask the user for their real couple names, wedding date, venue, story, and tagline.
2. Whenever the user gives or confirms any detail, call the update_fields tool with just that data — never wait to batch everything into one call.
3. Keep asking, one or two questions at a time, for any important fields still missing: couple names, date, venue, story, tagline, music preference, greeting line/hashtag, destination labels${hasCeremonies ? ", and each wedding event (name, date, time, venue — e.g. Mehendi, Sangeet, Haldi, the wedding day, Reception)" : ""}.
4. For the "ceremonies" field: always send the COMPLETE list of every event (not just the one being changed) — merge the user's change into the full current list shown above before calling the tool.
5. For "monumentNames": always send the complete list matching the number of destination photos shown above.
6. Never put a spoken music preference (like "soft flute music") into the "music" field — that field is only for an actual uploaded audio URL. If the user only describes a music style in words, acknowledge it in your reply but do not call update_fields with it.
7. Always include a short, warm natural-language reply alongside any tool call — never call a tool silently with no message.
8. Once names, date, venue, and story are confirmed, call mark_ready_to_deploy and tell the user they can deploy their invite now (they can still keep chatting to tweak ceremonies, hashtag, destinations, etc. afterward).
Keep replies concise (2-4 sentences).`;

  const stream = anthropic.messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    system,
    messages:
      messages.length > 0
        ? messages
        : [
            {
              role: "user",
              content:
                "Hi! I'd like to customize this template with my own details.",
            },
          ],
    tools: [UPDATE_FIELDS_TOOL, MARK_READY_TOOL],
  });

  res.writeHead(200, {
    "Content-Type": "application/x-ndjson; charset=utf-8",
    "Cache-Control": "no-cache",
  });

  const send = (obj) => {
    res.write(`${JSON.stringify(obj)}\n`);
  };

  stream.on("text", (text) => send({ type: "text", text }));

  try {
    const final = await stream.finalMessage();
    const fieldUpdates = {};
    let ready = false;
    for (const block of final.content) {
      if (block.type === "tool_use") {
        if (block.name === "update_fields") {
          Object.assign(fieldUpdates, block.input);
        } else if (block.name === "mark_ready_to_deploy") {
          ready = true;
        }
      }
    }
    send({ type: "done", fieldUpdates, ready });
  } catch (error) {
    console.error("Chat stream error:", error);
    send({
      type: "error",
      message: "The assistant hit a snag. Please try again.",
    });
  } finally {
    res.end();
  }
}
