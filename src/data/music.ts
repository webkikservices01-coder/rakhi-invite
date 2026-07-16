// Music tracks — royalty-free instrumentals that play out of the box.
// Users can also upload their own MP3 per slot for personal songs.

export type Track = {
  id: string;
  title: string;
  artist: string;
  src?: string;
  vibe: "classic" | "devotional" | "romantic" | "instrumental" | "modern";
};

// SoundHelix — royalty-free, CORS-open, guaranteed playback.
const SH = (n: number) => `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${n}.mp3`;

export const DEFAULT_PLAYLIST: Track[] = [
  { id: "t1", title: "Rakhi Utsav Instrumental",   artist: "Festive Vibes",     vibe: "classic",      src: SH(1) },
  { id: "t2", title: "Sona Chandi Melody",         artist: "Royal Ensemble",    vibe: "classic",      src: SH(2) },
  { id: "t3", title: "Mandir ki Ghanti",           artist: "Devotional Suite",  vibe: "devotional",   src: SH(3) },
  { id: "t4", title: "Bhai Behen Prem Dhun",       artist: "Soft Strings",      vibe: "romantic",     src: SH(4) },
  { id: "t5", title: "Dhol Tasha Utsav",           artist: "Percussion Fusion", vibe: "modern",       src: SH(5) },
  { id: "t6", title: "Aarti Bhajan Instrumental",  artist: "Temple Bells",      vibe: "devotional",   src: SH(6) },
  { id: "t7", title: "Sitar Raga Serenity",        artist: "Sitar Solo",        vibe: "instrumental", src: SH(7) },
  { id: "t8", title: "Bansuri Flute Breeze",       artist: "Flute & Tabla",     vibe: "instrumental", src: SH(8) },
];
