import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Send, Mic, ImagePlus, Video, Music } from "lucide-react";
import type { Template, InviteOverrides } from "@/verticals/wedding/data/templates";
import { API_BASE } from "@/verticals/wedding/lib/api-base";
import { isTierUnlocked, unlockTier } from "@/verticals/wedding/lib/payment";
import { PaywallModal } from "@/verticals/wedding/components/wedding/PaywallModal";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  attachment?: { type: "image" | "video"; url: string; label: string };
}

type StreamEvent =
  | { type: "text"; text: string }
  | { type: "done"; fieldUpdates?: InviteOverrides; ready?: boolean }
  | { type: "error"; message: string };

/** Minimal Web Speech API surface — no official TS DOM types exist for it. */
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult:
    | ((event: {
        results: { [i: number]: { [i: number]: { transcript: string } } };
      }) => void)
    | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;
function getSpeechRecognitionCtor(): SpeechRecognitionConstructor | undefined {
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

interface CustomizeChatProps {
  template: Template;
  onFieldsUpdate: (fields: InviteOverrides) => void;
  onReady: (ready: boolean) => void;
  onMusicUpload: (url: string) => void;
}

const STARTER_PROMPTS = [
  "Here are our real names and wedding date",
  "Let's set up all our ceremony details",
  "I want to upload our photos",
  "Everything's good, let's deploy",
];

/** Minimal inline markdown: **bold** + line breaks, nothing else. */
function renderRichText(text: string) {
  return text.split("\n").map((line, li) => (
    <span key={li} className="block">
      {line
        .split(/(\*\*[^*]+\*\*)/g)
        .map((chunk, ci) =>
          chunk.startsWith("**") && chunk.endsWith("**") ? (
            <strong key={ci}>{chunk.slice(2, -2)}</strong>
          ) : (
            <span key={ci}>{chunk}</span>
          ),
        )}
    </span>
  ));
}

export function CustomizeChat({
  template,
  onFieldsUpdate,
  onReady,
  onMusicUpload,
}: CustomizeChatProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [awaitingFirstToken, setAwaitingFirstToken] = useState(false);
  const [input, setInput] = useState("");
  const [ready, setReady] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [musicUrl, setMusicUrl] = useState("");
  const [collectedFields, setCollectedFields] = useState<InviteOverrides>({});
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sanitizeFieldsForAgent = (fields: InviteOverrides): InviteOverrides => {
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
    return sanitized;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, awaitingFirstToken]);

  useEffect(() => {
    setSpeechSupported(Boolean(getSpeechRecognitionCtor()));
  }, []);

  // Initialize with first message on chat open
  useEffect(() => {
    if (open && messages.length === 0) {
      sendMessage(
        "Hi! I want to customize every detail for the invitation: couple names, date, event venue, short story, tagline, photo/video, and background music.",
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || loading) return;

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(newMessages);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);
    setAwaitingFirstToken(true);

    try {
      const response = await fetch(`${API_BASE}/api/customize-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template: {
            name: template.name,
            tier: template.tier,
            couple: template.couple,
            date: template.date,
            venue: template.venue,
            story: template.story,
            tagline: template.tagline,
            script: template.script,
            hashtag: template.hashtag,
            monumentNames: template.monumentNames,
            ceremonies: template.ceremonies,
          },
          messages: newMessages,
          currentFields: sanitizeFieldsForAgent(collectedFields),
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";
      let started = false;
      let sawError = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) >= 0) {
          const line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (!line.trim()) continue;

          const event = JSON.parse(line) as StreamEvent;

          if (event.type === "text") {
            if (!started) {
              started = true;
              setAwaitingFirstToken(false);
              setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "" },
              ]);
            }
            assistantText += event.text;
            const finalText = assistantText;
            setMessages((prev) => {
              const next = [...prev];
              next[next.length - 1] = { role: "assistant", content: finalText };
              return next;
            });
          } else if (event.type === "done") {
            if (
              event.fieldUpdates &&
              Object.keys(event.fieldUpdates).length > 0
            ) {
              setCollectedFields((prev) => ({
                ...prev,
                ...event.fieldUpdates,
              }));
              onFieldsUpdate(event.fieldUpdates);
            }
            if (event.ready) {
              setReady(true);
              onReady(true);
            }
          } else if (event.type === "error") {
            sawError = true;
            if (!started) {
              setAwaitingFirstToken(false);
              setMessages((prev) => [
                ...prev,
                { role: "assistant", content: event.message },
              ]);
            }
          }
        }
      }

      if (!started && !sawError) {
        setAwaitingFirstToken(false);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Got it, noted!" },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setAwaitingFirstToken(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I lost connection there. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
      setAwaitingFirstToken(false);
    }
  };

  const handleMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await fileToDataUrl(file);
      setMusicUrl(url);
      setCollectedFields((prev) => ({ ...prev, music: url }));
      onFieldsUpdate({ music: url });
      onMusicUpload(url);
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: "Uploaded music for the invitation.",
        },
      ]);
    }
  };

  const startVoiceRecognition = () => {
    const SpeechRecognitionCtor = getSpeechRecognitionCtor();
    if (!SpeechRecognitionCtor) {
      alert("Voice commands are not supported in this browser.");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim() || "";
      if (transcript) {
        setInput(transcript);
        sendMessage(transcript);
      }
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  const handleMediaUpload = async (
    file: File,
    type: "image" | "video",
    label: string,
  ) => {
    const url = await fileToDataUrl(file);
    setCollectedFields((prev) => ({ ...prev, [type]: url }));
    onFieldsUpdate({ [type]: url } as InviteOverrides);
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: `${label} added to the invitation.`,
        attachment: { type, url, label },
      },
    ]);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleMediaUpload(file, "image", "Photo");
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleMediaUpload(file, "video", "Video");
    }
  };

  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const deploy = async () => {
    if (deploying) return;
    if (template.tier !== "silver" && !isTierUnlocked(template.tier)) {
      setShowPaywall(true);
      return;
    }
    setDeploying(true);
    const inviteId = `${template.slug}-${Date.now()}`;
    const invite = {
      slug: template.slug,
      overrides: collectedFields,
      customMusicUrl: musicUrl,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(`wedding-invite-${inviteId}`, JSON.stringify(invite));
    try {
      await fetch(`${API_BASE}/api/invites/${inviteId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invite),
      });
    } catch (error) {
      console.error("Failed to publish invite to server:", error);
    }
    navigate(`/wedding/invite/${inviteId}`);
  };

  const showStarterChips =
    !loading &&
    !ready &&
    messages.length === 2 &&
    messages[1]?.role === "assistant";

  return (
    <>
      {/* Chat Fab Button — premium wedding-assistant avatar */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open customize chat"
        className="group wt-fab-pop fixed bottom-6 right-6 z-[70] flex h-14 items-center gap-2.5 rounded-full pl-3.5 pr-5 text-sm font-semibold uppercase tracking-[0.15em] text-[#2a2210] shadow-2xl transition-transform hover:scale-105"
        style={{
          background: "linear-gradient(135deg, #f6e7bf, #d4af37 55%, #8a6e23)",
          border: "1px solid rgba(255,255,255,0.55)",
          boxShadow:
            "0 16px 40px rgba(0,0,0,.45), 0 0 0 1px rgba(212,175,55,0.25)",
        }}
        title="Click to customize your invitation"
      >
        <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#241c0c]/90">
          <span className="absolute inset-0 rounded-full border border-[#f6e7bf]/50 animate-ping" />
          <Sparkles
            size={17}
            className="relative text-[#f6e7bf]"
            strokeWidth={2}
          />
        </span>
        <span className="hidden sm:inline">Wedding Assistant</span>
      </button>

      {/* Chat Panel */}
      {open && (
        <div
          className="wt-panel-in fixed bottom-24 right-6 z-[71] flex w-[min(400px,92vw)] max-h-[76vh] flex-col overflow-hidden rounded-3xl border-2"
          style={{
            background: "var(--wt-bg-1)",
            borderColor: "var(--wt-gold)",
            boxShadow: "0 34px 90px rgba(0,0,0,.65)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{
              background: "linear-gradient(135deg, #ffb57f, #ff8fae)",
            }}
          >
            <div
              className="grid h-10 w-10 place-items-center rounded-full text-lg"
              style={{
                background: "var(--wt-gold-lite)",
                color: "var(--wt-bg-1)",
              }}
            >
              ✦
            </div>
            <div className="text-white flex-1">
              <div
                className="text-sm font-bold"
                style={{ fontFamily: "var(--wt-display)" }}
              >
                Customize Your Invite
              </div>
              <div
                className="flex items-center gap-1.5 text-[11px] tracking-[0.15em]"
                style={{ color: "var(--wt-gold-lite)" }}
              >
                {ready ? (
                  "Ready to deploy!"
                ) : awaitingFirstToken ? (
                  <>
                    Thinking
                    <span className="flex gap-0.5">
                      <span
                        className="wt-dot"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="wt-dot"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="wt-dot"
                        style={{ animationDelay: "300ms" }}
                      />
                    </span>
                  </>
                ) : (
                  "Tell me your details"
                )}
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white text-xl transition hover:opacity-70"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => {
              const isStreamingHere =
                loading &&
                i === messages.length - 1 &&
                msg.role === "assistant";
              return (
                <div
                  key={i}
                  className={`wt-msg-in flex ${
                    msg.role === "assistant" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[15px] leading-snug"
                    style={
                      msg.role === "assistant"
                        ? {
                            background: "rgba(255,255,255,0.85)",
                            border: "1px solid #ffb75d",
                            color: "#2f1b13",
                            borderBottomLeftRadius: "6px",
                            boxShadow: "0 8px 20px rgba(255,107,129,0.15)",
                          }
                        : {
                            background:
                              "linear-gradient(135deg, #ff6b81, #ff9a5e)",
                            color: "#fff",
                            borderBottomRightRadius: "6px",
                            boxShadow: "0 8px 20px rgba(255,107,129,0.2)",
                          }
                    }
                  >
                    {renderRichText(msg.content)}
                    {isStreamingHere && <span className="wt-cursor" />}
                    {msg.attachment?.type === "image" && (
                      <img
                        src={msg.attachment.url}
                        alt={msg.attachment.label}
                        className="mt-3 w-full rounded-2xl border border-white/30 object-cover"
                        style={{ maxHeight: "220px" }}
                      />
                    )}
                    {msg.attachment?.type === "video" && (
                      <video
                        controls
                        src={msg.attachment.url}
                        className="mt-3 w-full rounded-2xl border border-white/30"
                        style={{ maxHeight: "220px" }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
            {awaitingFirstToken && (
              <div className="wt-msg-in flex justify-start">
                <div
                  className="flex items-center gap-1.5 rounded-2xl px-4 py-3"
                  style={{
                    background: "rgba(255,255,255,0.85)",
                    border: "1px solid #ffb75d",
                    color: "#2f1b13",
                    borderBottomLeftRadius: "6px",
                  }}
                >
                  <span className="wt-dot" style={{ animationDelay: "0ms" }} />
                  <span
                    className="wt-dot"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="wt-dot"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            )}
            {showStarterChips && (
              <div className="wt-msg-in flex flex-wrap gap-2 pt-1">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="rounded-full px-3 py-1.5 text-xs transition hover:opacity-80"
                    style={{
                      background: "rgba(255,255,255,0.7)",
                      border: "1px solid #ffb75d",
                      color: "#6b4b2f",
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Music Upload & Deploy Section */}
          {ready && (
            <div
              className="border-t space-y-3 p-3"
              style={{ borderColor: "#ffb75d" }}
            >
              <div>
                <label
                  className="block text-xs font-semibold mb-2"
                  style={{ color: "#6b4b2f" }}
                >
                  Add your music (optional)
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleMusicUpload}
                  className="block w-full text-xs"
                  style={{
                    color: "#6b4b2f",
                  }}
                />
                {musicUrl && (
                  <div
                    className="mt-2 space-y-2 text-sm"
                    style={{ color: "#ff6b81" }}
                  >
                    <div>✓ Music selected</div>
                    <audio
                      controls
                      src={musicUrl}
                      className="w-full rounded-xl border border-white/20"
                    />
                  </div>
                )}
              </div>

              <button
                onClick={deploy}
                disabled={deploying}
                className="flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-80"
                style={{
                  background: "linear-gradient(135deg, #ff6b81, #ff9a5e)",
                  color: "#fff",
                }}
              >
                {deploying ? (
                  <>
                    <span className="flex gap-1">
                      <span
                        className="wt-dot"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="wt-dot"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="wt-dot"
                        style={{ animationDelay: "300ms" }}
                      />
                    </span>
                    Deploying your invitation...
                  </>
                ) : (
                  "🎉 Deploy Your Invitation"
                )}
              </button>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t p-3" style={{ borderColor: "#ffb75d" }}>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={startVoiceRecognition}
                disabled={!speechSupported}
                title={
                  speechSupported
                    ? listening
                      ? "Stop listening"
                      : "Use voice command"
                    : "Voice input not supported in this browser"
                }
                className="grid h-11 w-11 place-items-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-40"
                style={{
                  background: listening ? "#ffe7e9" : "rgba(255,255,255,0.88)",
                  borderColor: "#ff6b81",
                  color: listening ? "#d12345" : "#4b2e2e",
                }}
              >
                <Mic size={17} className={listening ? "animate-pulse" : ""} />
              </button>
              <label
                title="Add photo"
                className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-[#ff6b81]/40 bg-white/90 transition hover:bg-white"
              >
                <ImagePlus size={17} color="#4b2e2e" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <label
                title="Add video"
                className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-[#ff6b81]/40 bg-white/90 transition hover:bg-white"
              >
                <Video size={17} color="#4b2e2e" />
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>
              <label
                title="Add music"
                className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-[#ff6b81]/40 bg-white/90 transition hover:bg-white"
              >
                <Music size={17} color="#4b2e2e" />
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleMusicUpload}
                  className="hidden"
                />
              </label>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex items-end gap-2"
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onInput={handleTextareaInput}
                onKeyDown={handleKeyDown}
                placeholder="Type your message... (Enter to send, Shift+Enter for a new line)"
                disabled={loading}
                rows={1}
                className="max-h-[120px] flex-1 resize-none rounded-2xl px-4 py-2.5 text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.8)",
                  border: "1px solid #ffb75d",
                  color: "#4b2e2e",
                }}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full transition disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #ff6b81, #ffb75d)",
                  color: "#1b1320",
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      {showPaywall && template.tier !== "silver" && (
        <PaywallModal
          tier={template.tier}
          templateId={template.slug}
          onUnlocked={() => {
            unlockTier(template.tier as "gold" | "platinum");
            setShowPaywall(false);
            void deploy();
          }}
          onClose={() => setShowPaywall(false)}
        />
      )}
    </>
  );
}
