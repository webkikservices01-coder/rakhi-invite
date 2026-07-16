import { useEffect, useRef, useState } from "react";
import { Music, Pause, Play, SkipBack, SkipForward, Upload, Volume2, VolumeX, X } from "lucide-react";
import { DEFAULT_PLAYLIST } from "@/data/music";
import { toast } from "sonner";

export function MusicPlayer({
  slot,
  urls,
  onChange,
  onSlot,
  defaultSongId,
  minimal,
  readOnly,
}: {
  slot: number;
  urls: Record<number, string>;
  onChange: (urls: Record<number, string>) => void;
  onSlot: (slot: number) => void;
  defaultSongId?: string;
  minimal?: boolean;
  readOnly?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // pick initial slot from defaultSongId
  useEffect(() => {
    if (defaultSongId && slot === 0) {
      const idx = DEFAULT_PLAYLIST.findIndex(t => t.id === defaultSongId);
      if (idx >= 0) onSlot(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const track = DEFAULT_PLAYLIST[slot];
  const src = urls[slot] ?? track?.src;

  useEffect(() => {
    if (!audioRef.current) return;
    if (playing && src) {
      audioRef.current.play().catch(() => {
        toast.error("Browser ne play block kar diya. Ek baar click karke try karo.");
        setPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [playing, src]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange({ ...urls, [slot]: reader.result as string });
      toast.success(`Music set: ${file.name}`);
      setPlaying(true);
    };
    reader.readAsDataURL(file);
  };

  const next = () => onSlot((slot + 1) % DEFAULT_PLAYLIST.length);
  const prev = () => onSlot((slot - 1 + DEFAULT_PLAYLIST.length) % DEFAULT_PLAYLIST.length);

  return (
    <div className={`fixed z-40 ${minimal ? "bottom-4 right-4" : "bottom-6 right-6"}`}>
      {open && !readOnly && (
        <div className="mb-3 w-80 rounded-2xl border border-white/20 bg-black/85 p-4 text-white backdrop-blur-xl shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xs uppercase tracking-widest text-white/60">Playlist</div>
            <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white"><X size={16} /></button>
          </div>
          <div className="max-h-64 space-y-1 overflow-y-auto">
            {DEFAULT_PLAYLIST.map((tr, i) => (
              <button
                key={tr.id}
                onClick={() => { onSlot(i); setPlaying(true); }}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition ${i === slot ? "bg-white/15" : "hover:bg-white/8"}`}
              >
                <Music size={14} className="shrink-0 opacity-70" />
                <div className="flex-1 min-w-0">
                  <div className="truncate">{tr.title}</div>
                  <div className="truncate text-[10px] text-white/50">{tr.artist} · {urls[i] ? "✓ your upload" : "▶ ready"}</div>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 py-2 text-xs uppercase tracking-widest hover:bg-white/10"
          >
            <Upload size={14} /> Apna gaana upload karo
          </button>
          <input ref={fileRef} type="file" accept="audio/*" className="hidden" onChange={handleFile} />
        </div>
      )}

      <div className={`flex items-center gap-2 rounded-full border border-white/15 bg-black/80 p-2 text-white backdrop-blur-xl shadow-2xl transition-all ${expanded ? "pr-4" : ""}`}>
        {!readOnly && <button onClick={() => setOpen(o => !o)} className="rounded-full bg-white/10 p-2 hover:bg-white/20" title="Playlist"><Music size={16} /></button>}
        {!readOnly && <button onClick={prev} className="p-1.5 hover:opacity-70"><SkipBack size={16} /></button>}
        <button
          onClick={() => { if (!src) { fileRef.current?.click(); return; } setPlaying(p => !p); }}
          className="rounded-full bg-gradient-to-br from-amber-400 to-red-500 p-2.5 text-black shadow-lg hover:scale-105 transition"
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        {!readOnly && <button onClick={next} className="p-1.5 hover:opacity-70"><SkipForward size={16} /></button>}
        <button onClick={() => setMuted(m => !m)} className="p-1.5 hover:opacity-70">{muted ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
        <button onClick={() => setExpanded(e => !e)} className="max-w-32 truncate text-[11px] text-white/70 hover:text-white">
          {track?.title.split(" ").slice(0, 3).join(" ")}…
        </button>
      </div>

      {src && <audio ref={audioRef} src={src} loop muted={muted} />}
    </div>
  );
}
