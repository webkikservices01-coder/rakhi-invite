import type { CustomPalette, TemplateState } from "@/features/template/useTemplateState";

export type ShareableState = Pick<
  TemplateState,
  "brotherName" | "sisterName" | "from" | "message" | "wish" | "fontOverride" | "aiLang"
> & { paletteOverride?: CustomPalette };

function toBase64Utf8(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Utf8(b64: string): string {
  const padded = b64.replace(/-/g, "+").replace(/_/g, "/").padEnd(b64.length + ((4 - (b64.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

// Invite links are fully self-contained (no backend/database) — the recipient's
// browser reconstructs the card entirely from this encoded query param, so the
// link works for anyone, on any device, forever.
export function encodeInviteState(state: ShareableState): string {
  return toBase64Utf8(JSON.stringify(state));
}

export function decodeInviteState(encoded: string): Partial<TemplateState> | null {
  try {
    return JSON.parse(fromBase64Utf8(encoded)) as Partial<TemplateState>;
  } catch {
    return null;
  }
}
