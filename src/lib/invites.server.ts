import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

const INVITES_DIR = join(process.cwd(), "data", "invites");

const TemplateStateSchema = z.object({
  brotherName: z.string(),
  sisterName: z.string(),
  from: z.enum(["sister", "brother"]),
  message: z.string(),
  wish: z.string(),
  photos: z.array(z.string()),
  musicSlot: z.number(),
  musicUrls: z.record(z.string(), z.string()),
  paletteOverride: z.object({
    bg: z.string().optional(),
    surface: z.string().optional(),
    text: z.string().optional(),
    accent: z.string().optional(),
    accent2: z.string().optional(),
  }),
  fontOverride: z.enum(["display", "hand", "deva"]).optional(),
  aiLang: z.enum(["en", "hi"]),
});

const CreateInviteSchema = z.object({
  tier: z.enum(["silver", "gold", "platinum"]),
  templateId: z.string(),
  state: TemplateStateSchema,
});

function inviteFile(id: string) {
  return join(INVITES_DIR, `${id}.json`);
}

export const createInvite = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => CreateInviteSchema.parse(input))
  .handler(async ({ data }) => {
    await mkdir(INVITES_DIR, { recursive: true });
    const id = randomUUID();
    const record = {
      id,
      tier: data.tier,
      templateId: data.templateId,
      state: data.state,
      createdAt: new Date().toISOString(),
    };
    await writeFile(inviteFile(id), JSON.stringify(record), "utf8");
    return { id };
  });

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const getInvite = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().regex(UUID_RE) }).parse(input),
  )
  .handler(async ({ data }) => {
    const file = inviteFile(data.id);
    if (!existsSync(file)) return null;
    try {
      const raw = await readFile(file, "utf8");
      return JSON.parse(raw) as {
        id: string;
        tier: "silver" | "gold" | "platinum";
        templateId: string;
        state: z.infer<typeof TemplateStateSchema>;
        createdAt: string;
      };
    } catch {
      return null;
    }
  });
