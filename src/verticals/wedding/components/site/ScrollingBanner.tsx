import monumentTaj from "@/verticals/wedding/assets/monument-taj.jpg";
import monumentBurj from "@/verticals/wedding/assets/monument-burj.jpg";
import monumentEiffel from "@/verticals/wedding/assets/monument-eiffel.jpg";
import monumentVenice from "@/verticals/wedding/assets/monument-venice.jpg";
import monumentBeach from "@/verticals/wedding/assets/monument-beach.jpg";
import monumentJaipur from "@/verticals/wedding/assets/monument-jaipur.jpg";
import monumentRedFort from "@/verticals/wedding/assets/monument-redfort.jpg";
import monumentMosque from "@/verticals/wedding/assets/monument-mosque.jpg";
import monumentAmalfi from "@/verticals/wedding/assets/monument-amalfi.jpg";
import monumentProvence from "@/verticals/wedding/assets/monument-provence.jpg";
import monumentBeverly from "@/verticals/wedding/assets/monument-beverly.jpg";
import monumentTuscany from "@/verticals/wedding/assets/monument-tuscany.jpg";

const DEFAULT_IMAGES = [
  monumentTaj,
  monumentBurj,
  monumentEiffel,
  monumentVenice,
  monumentBeach,
  monumentJaipur,
  monumentRedFort,
  monumentMosque,
  monumentAmalfi,
  monumentProvence,
  monumentBeverly,
  monumentTuscany,
];

/* Continuously auto-scrolling strip of destination photos — a moving,
   animated banner for pages that don't have a full cinematic hero
   (Templates catalogue, Pricing). Loops seamlessly via a duplicated track. */
export function ScrollingBanner({
  images = DEFAULT_IMAGES,
  durationSeconds = 38,
}: {
  images?: string[];
  durationSeconds?: number;
}) {
  const track = [...images, ...images];

  return (
    <div className="relative overflow-hidden py-2">
      <div
        className="flex w-max gap-4 px-2"
        style={{
          animation: `site-marquee ${durationSeconds}s linear infinite`,
        }}
      >
        {track.map((src, i) => (
          <div
            key={i}
            className="h-24 w-36 shrink-0 overflow-hidden rounded-2xl border border-primary/30 shadow-[0_14px_34px_rgba(0,0,0,0.25)] transition-transform duration-500 hover:scale-105 md:h-32 md:w-48"
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Edge fade so the loop doesn't feel like it's cutting off */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-28"
        style={{
          background:
            "linear-gradient(90deg, var(--color-background), transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-28"
        style={{
          background:
            "linear-gradient(270deg, var(--color-background), transparent)",
        }}
      />
    </div>
  );
}
