import type { ImageKey } from "./images";

export type Tier = "silver" | "gold" | "platinum";
export type Decoration =
  | "glitter"
  | "hearts"
  | "balloons"
  | "flowers"
  | "petals"
  | "diyas"
  | "sparkles"
  | "stars"
  | "confetti";

export type Palette = {
  bg: string;         // background gradient CSS
  surface: string;    // card bg
  text: string;       // main text color
  accent: string;     // accent color for buttons/highlights
  accent2: string;    // secondary accent
};

export type LayoutVariant =
  | "centered-classic"
  | "split-portrait"
  | "magazine"
  | "postcard"
  | "polaroid"
  | "royal-frame"
  | "scroll-story"
  | "grid-gallery"
  | "immersive";

export type Template = {
  id: string;
  tier: Tier;
  name: string;
  tagline: string;
  palette: Palette;
  layout: LayoutVariant;
  decoration: Decoration;
  heroImage: ImageKey;
  secondaryImages?: ImageKey[];
  fontVibe: "display" | "hand" | "deva";
  defaultSongId?: string;
  noteSeed: number;
};

// ==== PALETTES ====
const P = {
  saffron: { bg: "linear-gradient(135deg, oklch(0.96 0.05 80), oklch(0.88 0.12 55))", surface: "oklch(0.99 0.02 85)", text: "oklch(0.22 0.06 30)", accent: "oklch(0.55 0.19 40)", accent2: "oklch(0.7 0.16 75)" },
  maroon: { bg: "linear-gradient(135deg, oklch(0.35 0.15 22), oklch(0.5 0.19 35))", surface: "oklch(0.98 0.03 80)", text: "oklch(0.98 0.02 85)", accent: "oklch(0.82 0.17 80)", accent2: "oklch(0.9 0.12 75)" },
  emerald: { bg: "linear-gradient(135deg, oklch(0.35 0.11 155), oklch(0.55 0.14 140))", surface: "oklch(0.97 0.03 75)", text: "oklch(0.98 0.02 85)", accent: "oklch(0.85 0.16 80)", accent2: "oklch(0.7 0.12 45)" },
  royal: { bg: "linear-gradient(135deg, oklch(0.28 0.14 290), oklch(0.45 0.2 320))", surface: "oklch(0.98 0.02 80)", text: "oklch(0.98 0.02 85)", accent: "oklch(0.82 0.17 80)", accent2: "oklch(0.8 0.15 340)" },
  rose: { bg: "linear-gradient(135deg, oklch(0.75 0.14 15), oklch(0.6 0.18 5))", surface: "oklch(0.98 0.03 20)", text: "oklch(0.98 0.02 85)", accent: "oklch(0.9 0.12 80)", accent2: "oklch(0.85 0.1 30)" },
  ivory: { bg: "linear-gradient(135deg, oklch(0.98 0.02 85), oklch(0.92 0.05 60))", surface: "oklch(0.99 0.01 85)", text: "oklch(0.22 0.06 30)", accent: "oklch(0.45 0.18 30)", accent2: "oklch(0.7 0.15 75)" },
  peacock: { bg: "linear-gradient(135deg, oklch(0.35 0.13 220), oklch(0.5 0.16 200))", surface: "oklch(0.97 0.03 80)", text: "oklch(0.98 0.02 85)", accent: "oklch(0.85 0.16 80)", accent2: "oklch(0.75 0.14 180)" },
  midnight: { bg: "linear-gradient(135deg, oklch(0.18 0.06 280), oklch(0.28 0.12 300))", surface: "oklch(0.22 0.05 280)", text: "oklch(0.96 0.03 80)", accent: "oklch(0.82 0.18 80)", accent2: "oklch(0.75 0.18 340)" },
  sunset: { bg: "linear-gradient(135deg, oklch(0.7 0.19 45), oklch(0.55 0.2 25))", surface: "oklch(0.98 0.02 80)", text: "oklch(0.98 0.02 85)", accent: "oklch(0.95 0.1 90)", accent2: "oklch(0.85 0.15 60)" },
  jade: { bg: "linear-gradient(135deg, oklch(0.42 0.1 165), oklch(0.6 0.13 145))", surface: "oklch(0.98 0.02 80)", text: "oklch(0.98 0.02 85)", accent: "oklch(0.9 0.13 80)", accent2: "oklch(0.75 0.14 40)" },
  cream: { bg: "linear-gradient(135deg, oklch(0.97 0.03 80), oklch(0.9 0.06 70))", surface: "oklch(0.99 0.01 85)", text: "oklch(0.22 0.06 30)", accent: "oklch(0.4 0.16 25)", accent2: "oklch(0.7 0.15 75)" },
  copper: { bg: "linear-gradient(135deg, oklch(0.5 0.13 45), oklch(0.65 0.17 55))", surface: "oklch(0.98 0.02 80)", text: "oklch(0.98 0.02 85)", accent: "oklch(0.92 0.12 85)", accent2: "oklch(0.8 0.15 40)" },
  lavender: { bg: "linear-gradient(135deg, oklch(0.72 0.12 300), oklch(0.6 0.15 320))", surface: "oklch(0.98 0.02 80)", text: "oklch(0.98 0.02 85)", accent: "oklch(0.92 0.11 85)", accent2: "oklch(0.85 0.12 340)" },
  teal: { bg: "linear-gradient(135deg, oklch(0.4 0.11 195), oklch(0.55 0.13 175))", surface: "oklch(0.98 0.02 80)", text: "oklch(0.98 0.02 85)", accent: "oklch(0.92 0.12 85)", accent2: "oklch(0.8 0.13 170)" },
  ruby: { bg: "linear-gradient(135deg, oklch(0.3 0.17 15), oklch(0.5 0.22 20))", surface: "oklch(0.98 0.03 20)", text: "oklch(0.98 0.02 85)", accent: "oklch(0.9 0.14 85)", accent2: "oklch(0.85 0.1 20)" },
} satisfies Record<string, Palette>;

// Build templates
function t(id: string, tier: Tier, name: string, tagline: string, palette: Palette, layout: LayoutVariant, decoration: Decoration, heroImage: ImageKey, opts: Partial<Template> = {}): Template {
  return { id, tier, name, tagline, palette, layout, decoration, heroImage, fontVibe: "display", noteSeed: Math.floor(Math.random() * 100), ...opts };
}

// ============ SILVER (10) - 1 page, simple, editable name + message ============
export const SILVER: Template[] = [
  t("s1", "silver", "Reshmi Dhaaga", "Simple & sacred", P.cream, "centered-classic", "petals", "rakhi"),
  t("s2", "silver", "Kesari Kirti", "Marigold minimal", P.saffron, "postcard", "flowers", "marigoldClose"),
  t("s3", "silver", "Ivory Bandhan", "Elegant & serene", P.ivory, "centered-classic", "sparkles", "rakhiWhite"),
  t("s4", "silver", "Meethi Yaadein", "Sweet memories", P.rose, "postcard", "hearts", "kids"),
  t("s5", "silver", "Sona Roop", "Golden and warm", P.copper, "centered-classic", "sparkles", "thali"),
  t("s6", "silver", "Diya Prem", "Glow of love", P.sunset, "postcard", "diyas", "diyaGlow1"),
  t("s7", "silver", "Shubh Rakhi", "Blessing card", P.jade, "centered-classic", "petals", "rangoli"),
  t("s8", "silver", "Rang Rasiya", "Colourful greeting", P.saffron, "postcard", "flowers", "rangoliMaking"),
  t("s9", "silver", "Chandan Chhaap", "Gentle and pure", P.ivory, "centered-classic", "sparkles", "rakhiTie1"),
  t("s10", "silver", "Bhai Behen", "Classic postcard", P.cream, "postcard", "petals", "tying"),
];

// ============ GOLD (18) - 2-3 pages, music, photos, decorations, monuments ============
export const GOLD: Template[] = [
  t("g1", "gold", "Maharaani", "Royal maroon & gold", P.maroon, "royal-frame", "glitter", "redFortFront", { secondaryImages: ["taj", "thali"], defaultSongId: "t2" }),
  t("g2", "gold", "Pyaar ki Doriyan", "Hearts & handwritten", P.rose, "split-portrait", "hearts", "giftFloral", { secondaryImages: ["kids", "family"], defaultSongId: "t4" }),
  t("g3", "gold", "Rang Utsav", "Colour festival", P.sunset, "magazine", "confetti", "confettiConcert", { secondaryImages: ["decor", "rangoli"], defaultSongId: "t1" }),
  t("g4", "gold", "Emerald Ehsaas", "Green & gold luxury", P.emerald, "royal-frame", "flowers", "marigoldWhite", { secondaryImages: ["humayun", "rakhi"], defaultSongId: "t3" }),
  t("g5", "gold", "Sunehri Yaadein", "Golden memories", P.saffron, "polaroid", "sparkles", "rakhiHandsTie2", { secondaryImages: ["kids", "family"], defaultSongId: "t2" }),
  t("g6", "gold", "Neel Aakash", "Peacock blue majesty", P.peacock, "magazine", "balloons", "balloonsSky", { secondaryImages: ["taj", "burj"], defaultSongId: "t5" }),
  t("g7", "gold", "Diya Utsav", "Festive lights", P.midnight, "royal-frame", "diyas", "diyaRows", { secondaryImages: ["thali", "rangoli"], defaultSongId: "t6", fontVibe: "deva" }),
  t("g8", "gold", "Ruby Rishta", "Ruby & rose", P.ruby, "split-portrait", "petals", "rangoliPetals", { secondaryImages: ["family", "gift"], defaultSongId: "t4" }),
  t("g9", "gold", "Taj ki Chhaon", "Taj Mahal memory", P.ivory, "magazine", "sparkles", "taj", { secondaryImages: ["tying", "rakhi"], defaultSongId: "t2" }),
  t("g10", "gold", "Qutub Kahaani", "Delhi monuments", P.copper, "polaroid", "stars", "qutub", { secondaryImages: ["humayun", "family"], defaultSongId: "t7" }),
  t("g11", "gold", "Paris Preet", "Long-distance love", P.rose, "postcard", "hearts", "eiffel", { secondaryImages: ["gift", "family"], defaultSongId: "t4" }),
  t("g12", "gold", "Dubai Duas", "Skyline blessings", P.midnight, "magazine", "sparkles", "burj", { secondaryImages: ["gift", "kids"], defaultSongId: "t8" }),
  t("g13", "gold", "Samundar Kinare", "Beachside bond", P.teal, "split-portrait", "balloons", "beach", { secondaryImages: ["family", "gift"], defaultSongId: "t4" }),
  t("g14", "gold", "Jade Jodi", "Emerald siblings", P.jade, "royal-frame", "flowers", "marigoldBamboo", { secondaryImages: ["kids", "thali"], defaultSongId: "t3" }),
  t("g15", "gold", "Gulabi Ghar", "Pink home vibes", P.rose, "polaroid", "petals", "decor", { secondaryImages: ["rangoli", "family"], defaultSongId: "t4" }),
  t("g16", "gold", "Rangoli Rasm", "Floor-art frame", P.saffron, "magazine", "flowers", "rangoliHands", { secondaryImages: ["thali", "tying"], defaultSongId: "t5" }),
  t("g17", "gold", "Bacchpan ka Bandhan", "Childhood memories", P.cream, "polaroid", "confetti", "kidsFlour", { secondaryImages: ["family", "gift"], defaultSongId: "t1", fontVibe: "hand" }),
  t("g18", "gold", "Sona Chandi", "Gold & silver deluxe", P.ivory, "royal-frame", "glitter", "giftGold", { secondaryImages: ["rakhi", "family"], defaultSongId: "t2" }),
];

// ============ PLATINUM (32) - 3-5 pages, AI chat + voice + unlimited photos + music ============
export const PLATINUM: Template[] = [
  t("p1", "platinum", "Rajwada", "The royal edition", P.royal, "immersive", "glitter", "humayun", { secondaryImages: ["taj", "humayun", "family"], defaultSongId: "t2" }),
  t("p2", "platinum", "Sitara", "Star-lit siblings", P.midnight, "scroll-story", "stars", "starsMilky1", { secondaryImages: ["kids", "decor", "rakhi"], defaultSongId: "t7" }),
  t("p3", "platinum", "Mehendi", "Deep henna elegance", P.emerald, "immersive", "flowers", "mehndiHands1", { secondaryImages: ["rakhi", "family", "humayun"], defaultSongId: "t3" }),
  t("p4", "platinum", "Lotus Bloom", "Sacred lotus theme", P.lavender, "grid-gallery", "petals", "marigoldHands", { secondaryImages: ["thali", "rakhi", "decor"], defaultSongId: "t3" }),
  t("p5", "platinum", "Marigold Mahal", "Marigold palace", P.saffron, "immersive", "flowers", "diyaMarigold", { secondaryImages: ["tying", "thali", "rangoli"], defaultSongId: "t5" }),
  t("p6", "platinum", "Diamond Doriyan", "Diamond threads", P.ivory, "scroll-story", "sparkles", "rakhiTray1", { secondaryImages: ["thali", "family", "gift"], defaultSongId: "t2" }),
  t("p7", "platinum", "Neel Ratri", "Peacock night", P.peacock, "immersive", "stars", "starsGalaxy", { secondaryImages: ["family", "gift", "kids"], defaultSongId: "t8" }),
  t("p8", "platinum", "Gulnaar", "Rose garden luxe", P.rose, "grid-gallery", "hearts", "giftPurple", { secondaryImages: ["family", "kids", "decor"], defaultSongId: "t4" }),
  t("p9", "platinum", "Suhana Safar", "Journey together", P.copper, "scroll-story", "confetti", "confettiWater", { secondaryImages: ["eiffel", "burj", "family"], defaultSongId: "t4" }),
  t("p10", "platinum", "Shri Raksha", "Devotional supreme", P.saffron, "immersive", "diyas", "diyaFabric", { secondaryImages: ["decor", "rangoli", "tying"], defaultSongId: "t6", fontVibe: "deva" }),
  t("p11", "platinum", "Kohinoor", "Diamond crown", P.midnight, "royal-frame", "sparkles", "hawaMahalFacade", { secondaryImages: ["taj", "thali", "rakhi"], defaultSongId: "t2" }),
  t("p12", "platinum", "Aatma Rishta", "Soul connection", P.royal, "scroll-story", "hearts", "familyFlags", { secondaryImages: ["kids", "gift", "tying"], defaultSongId: "t4" }),
  t("p13", "platinum", "Rangbhoomi", "Colour theatre", P.sunset, "grid-gallery", "confetti", "confettiClose", { secondaryImages: ["thali", "family", "decor"], defaultSongId: "t1" }),
  t("p14", "platinum", "Chandni", "Moonlight love", P.lavender, "immersive", "stars", "starsConstellation", { secondaryImages: ["family", "gift", "kids"], defaultSongId: "t4" }),
  t("p15", "platinum", "Firdaus", "Paradise garden", P.jade, "grid-gallery", "flowers", "rangoliDiya", { secondaryImages: ["thali", "family", "rakhi"], defaultSongId: "t3" }),
  t("p16", "platinum", "Meher", "Kindness & grace", P.ivory, "polaroid", "petals", "mehndiDetail", { secondaryImages: ["family", "gift", "tying"], defaultSongId: "t1", fontVibe: "hand" }),
  t("p17", "platinum", "Aashirwaad", "Elders' blessings", P.maroon, "royal-frame", "diyas", "diyaCreative", { secondaryImages: ["thali", "tying", "decor"], defaultSongId: "t6" }),
  t("p18", "platinum", "Aab-e-Zar", "Golden water luxe", P.copper, "immersive", "sparkles", "sweetsLaddu", { secondaryImages: ["rakhi", "family", "burj"], defaultSongId: "t2" }),
  t("p19", "platinum", "Firangi Rishta", "Sibling abroad", P.teal, "scroll-story", "hearts", "familyGathering", { secondaryImages: ["eiffel", "beach", "family"], defaultSongId: "t4" }),
  t("p20", "platinum", "Nazm-e-Bhai", "Poetry for brother", P.midnight, "magazine", "sparkles", "giftColorful", { secondaryImages: ["family", "kids", "tying"], defaultSongId: "t4", fontVibe: "hand" }),
  t("p21", "platinum", "Nayika Rakhi", "Sister's saga", P.ruby, "immersive", "petals", "rakhiFriendship", { secondaryImages: ["family", "gift", "kids"], defaultSongId: "t2" }),
  t("p22", "platinum", "Champa Kali", "Delicate blossoms", P.rose, "grid-gallery", "flowers", "mehndiJewelry", { secondaryImages: ["thali", "family", "decor"], defaultSongId: "t3" }),
  t("p23", "platinum", "Sona Chandi Sitare", "Metallic glam", P.royal, "immersive", "glitter", "rakhiWrist1", { secondaryImages: ["family", "gift", "thali"], defaultSongId: "t2" }),
  t("p24", "platinum", "Panchhi", "Free like birds", P.teal, "scroll-story", "balloons", "balloonsPastel", { secondaryImages: ["family", "kids", "gift"], defaultSongId: "t8" }),
  t("p25", "platinum", "Rasmalai", "Sweet celebration", P.cream, "polaroid", "confetti", "sweetsTray", { secondaryImages: ["family", "thali", "gift"], defaultSongId: "t5" }),
  t("p26", "platinum", "Neelambar", "Blue sky epic", P.peacock, "immersive", "stars", "starsJaisalmer", { secondaryImages: ["humayun", "family", "tying"], defaultSongId: "t7" }),
  t("p27", "platinum", "Tara Zameen", "Star on earth", P.midnight, "scroll-story", "sparkles", "familySparklers", { secondaryImages: ["kids", "gift", "tying"], defaultSongId: "t4" }),
  t("p28", "platinum", "Aab-e-Rehmat", "Fountain of blessings", P.emerald, "royal-frame", "diyas", "diyaNight", { secondaryImages: ["thali", "rangoli", "family"], defaultSongId: "t6" }),
  t("p29", "platinum", "Lehra", "Colourful wave", P.sunset, "grid-gallery", "confetti", "balloonsBouquet", { secondaryImages: ["family", "gift", "kids"], defaultSongId: "t1" }),
  t("p30", "platinum", "Mahakavya", "Grand epic", P.maroon, "immersive", "glitter", "family", { secondaryImages: ["humayun", "family", "tying"], defaultSongId: "t2" }),
  t("p31", "platinum", "Chaandpaari", "Fairy moon", P.lavender, "scroll-story", "hearts", "gift", { secondaryImages: ["kids", "family", "decor"], defaultSongId: "t4" }),
  t("p32", "platinum", "Rakhi Signature", "The ultimate", P.royal, "immersive", "sparkles", "rakhiTieWoman", { secondaryImages: ["taj", "family", "thali", "rakhi"], defaultSongId: "t2" }),
];

export const ALL_TEMPLATES: Template[] = [...SILVER, ...GOLD, ...PLATINUM];

export function findTemplate(tier: Tier, id: string): Template | undefined {
  return ALL_TEMPLATES.find(t => t.tier === tier && t.id === id);
}

export function templatesForTier(tier: Tier): Template[] {
  return tier === "silver" ? SILVER : tier === "gold" ? GOLD : PLATINUM;
}
