import { useState } from "react";
import { Pencil } from "lucide-react";

export function EditableText({
  value,
  onChange,
  className = "",
  multiline = false,
  placeholder,
  readOnly = false,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  readOnly?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  if (readOnly) {
    return <span className={className}>{value || placeholder}</span>;
  }
  if (editing) {
    return multiline ? (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={() => setEditing(false)}
        autoFocus
        rows={4}
        placeholder={placeholder}
        className={`w-full resize-none rounded-lg border-2 border-dashed border-current bg-transparent p-2 outline-none ${className}`}
      />
    ) : (
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={() => setEditing(false)}
        onKeyDown={e => { if (e.key === "Enter") setEditing(false); }}
        autoFocus
        placeholder={placeholder}
        className={`rounded-lg border-2 border-dashed border-current bg-transparent px-2 py-1 outline-none ${className}`}
      />
    );
  }
  return (
    <span
      onClick={() => setEditing(true)}
      className={`group relative cursor-text ${className}`}
      title="Click to edit"
    >
      {value || <span className="opacity-50">{placeholder}</span>}
      <Pencil size={12} className="ml-1.5 inline opacity-0 transition-opacity group-hover:opacity-60" />
    </span>
  );
}
