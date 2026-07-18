import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Send, Sparkles, X, Bot } from "lucide-react";
import { toast } from "sonner";
import { rakhiChat } from "@/lib/ai-chat.functions";
import type { TemplateState } from "./useTemplateState";
import type { Template } from "@/data/templates";

type Message = { role: "user" | "assistant"; text: string };
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

// Web Speech API types (browser-only, not in default TS libs)
type SR = {
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: unknown) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
};
type SRCtor = new () => SR;
declare global {
  interface Window {
    SpeechRecognition?: SRCtor;
    webkitSpeechRecognition?: SRCtor;
  }
}

export function AIChat({
  template,
  state,
  onAction,
  hasMusic,
  hasPhotos,
}: {
  template: Template;
  state: TemplateState;
  onAction: (action: Action) => void;
  hasMusic: boolean;
  hasPhotos: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text:
        state.aiLang === "hi"
          ? `Namaste! Main Marvels hoon ✨ Aap kuch bhi bolo — "background pink karo", "ek pyaari message likho brother ke liye", ya voice se bhi bol sakte ho.`
          : `Hi! I'm Marvels ✨ Try: "make background pink", "write a heartfelt message for my brother", or tap the mic to speak.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const recRef = useRef<SR | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 99999, behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    setBusy(true);
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    try {
      const res = await rakhiChat({
        message: text,
        lang: state.aiLang,
        history: messages.map((m) => ({ role: m.role, text: m.text })),
        currentFields: {
          brotherName: state.brotherName,
          sisterName: state.sisterName,
          message: state.message,
          wish: state.wish,
          fontOverride: state.fontOverride,
          paletteOverride: state.paletteOverride,
        },
        context: {
          templateName: template.name,
          tier: template.tier,
          hasMusic,
          hasPhotos,
          brotherName: state.brotherName,
          sisterName: state.sisterName,
          from: state.from,
        },
      });
      setMessages((m) => [...m, { role: "assistant", text: res.reply }]);
      // apply actions
      try {
        const actions = JSON.parse(res.actionsJson) as Action[];
        actions.forEach(onAction);
      } catch {
        /* ignore */
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setMessages((m) => [...m, { role: "assistant", text: `Error: ${msg}` }]);
    } finally {
      setBusy(false);
    }
  };

  const startVoice = () => {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) {
      toast.error("Voice support is not available in this browser.");
      return;
    }
    const r = new Ctor();
    r.continuous = false;
    r.interimResults = false;
    r.lang = state.aiLang === "hi" ? "hi-IN" : "en-IN";
    r.onresult = (e: unknown) => {
      const ev = e as { results: ArrayLike<ArrayLike<{ transcript: string }>> };
      const t = ev.results[0]?.[0]?.transcript ?? "";
      setInput(t);
      void send(t);
    };
    r.onerror = () => {
      setListening(false);
      toast.error("Voice recognition mein problem hui.");
    };
    r.onend = () => setListening(false);
    r.start();
    recRef.current = r;
    setListening(true);
  };
  const stopVoice = () => {
    recRef.current?.stop();
    setListening(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-br from-fuchsia-500 via-rose-500 to-amber-400 px-5 py-3 text-white shadow-2xl animate-glow-pulse hover:scale-105 transition"
      >
        <Bot size={20} />
        <span className="hidden sm:inline text-sm font-medium">Marvels AI</span>
        <Sparkles size={14} className="animate-pulse" />
      </button>

      {open && (
        <div className="fixed inset-x-2 bottom-24 z-50 flex flex-col sm:inset-auto sm:bottom-24 sm:left-6 sm:w-96 sm:h-[500px] max-h-[80vh] rounded-3xl border border-white/20 bg-gradient-to-b from-slate-900/95 to-purple-950/95 backdrop-blur-2xl shadow-2xl overflow-hidden text-white">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-gradient-to-br from-amber-400 to-rose-500 p-1.5">
                <Bot size={14} />
              </div>
              <div>
                <div className="text-sm font-medium">Marvels</div>
                <div className="text-[10px] text-white/50">
                  AI • {state.aiLang === "hi" ? "हिन्दी" : "English"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  onAction({
                    type: "setLang",
                    value: state.aiLang === "hi" ? "en" : "hi",
                  })
                }
                className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] uppercase tracking-widest hover:bg-white/20"
              >
                {state.aiLang === "hi" ? "EN" : "HI"}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-1 hover:opacity-70"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${m.role === "user" ? "bg-white/15 text-white" : "bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-white/10"}`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {busy && (
              <div className="text-xs text-white/50 animate-pulse">
                Marvels soch raha hai…
              </div>
            )}
          </div>

          <div className="border-t border-white/10 p-3">
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void send(input);
                }}
                placeholder={
                  state.aiLang === "hi"
                    ? "Kuch bhi kaho…"
                    : "Ask or command anything…"
                }
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/40"
              />
              <button
                onClick={listening ? stopVoice : startVoice}
                className={`rounded-full p-1.5 ${listening ? "bg-red-500 animate-pulse" : "hover:bg-white/10"}`}
                title="Voice"
              >
                {listening ? <MicOff size={14} /> : <Mic size={14} />}
              </button>
              <button
                onClick={() => void send(input)}
                disabled={busy || !input.trim()}
                className="rounded-full bg-gradient-to-br from-amber-400 to-rose-500 p-1.5 text-black disabled:opacity-30"
              >
                <Send size={14} />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(state.aiLang === "hi"
                ? [
                    "Background gulabi karo",
                    "Ek pyaari message likho",
                    "Aur bright colors",
                  ]
                : [
                    "Make background rose gold",
                    "Write me a poem",
                    "Suggest a wish",
                  ]
              ).map((s) => (
                <button
                  key={s}
                  onClick={() => void send(s)}
                  className="rounded-full bg-white/8 px-2.5 py-1 text-[10px] hover:bg-white/15"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export type { Action as AIAction };
