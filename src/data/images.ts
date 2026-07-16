import tying from "@/assets/hero-tying.jpg";
import thali from "@/assets/hero-thali.jpg";
import gift from "@/assets/hero-gift.jpg";
import family from "@/assets/hero-family.jpg";
import decor from "@/assets/hero-decor.jpg";
import rakhi from "@/assets/hero-rakhi.jpg";
import kids from "@/assets/hero-kids.jpg";
import rangoli from "@/assets/hero-rangoli.jpg";
import taj from "@/assets/mon-taj.jpg";
import qutub from "@/assets/mon-qutub.jpg";
import humayun from "@/assets/mon-humayun.jpg";
import eiffel from "@/assets/mon-eiffel.jpg";
import burj from "@/assets/mon-burj.jpg";
import beach from "@/assets/mon-beach.jpg";

export const IMAGES = {
  tying, thali, gift, family, decor, rakhi, kids, rangoli,
  taj, qutub, humayun, eiffel, burj, beach,
} as const;

export type ImageKey = keyof typeof IMAGES;
