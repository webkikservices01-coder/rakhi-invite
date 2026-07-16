import { useRef } from "react";
import { Upload, X, Plus } from "lucide-react";

export function PhotoUpload({
  photos,
  onChange,
  max = Infinity,
  size = "md",
  readOnly = false,
}: {
  photos: string[];
  onChange: (photos: string[]) => void;
  max?: number;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);

  const add = (files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files).slice(0, max - photos.length);
    Promise.all(list.map(f => new Promise<string>((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result as string);
      r.onerror = () => rej(r.error);
      r.readAsDataURL(f);
    }))).then(urls => onChange([...photos, ...urls]));
  };

  const remove = (i: number) => onChange(photos.filter((_, idx) => idx !== i));

  const sz = size === "sm" ? "h-16 w-16" : size === "lg" ? "h-40 w-40" : "h-24 w-24";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {photos.map((p, i) => (
        <div key={i} className={`relative ${sz} overflow-hidden rounded-2xl ring-2 ring-white/30 shadow-lg`}>
          <img src={p} alt={`photo ${i + 1}`} className="h-full w-full object-cover" />
          {!readOnly && (
            <button
              onClick={() => remove(i)}
              className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100"
            >
              <X size={12} />
            </button>
          )}
        </div>
      ))}
      {!readOnly && photos.length < max && (
        <button
          onClick={() => ref.current?.click()}
          className={`${sz} flex flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-current/40 bg-white/5 text-current/70 transition-all hover:bg-white/15 hover:scale-105`}
        >
          {photos.length === 0 ? <Upload size={20} /> : <Plus size={20} />}
          <span className="text-[10px] uppercase tracking-widest">Photo</span>
        </button>
      )}
      <input ref={ref} type="file" accept="image/*" multiple={max > 1} className="hidden" onChange={e => add(e.target.files)} />
    </div>
  );
}
