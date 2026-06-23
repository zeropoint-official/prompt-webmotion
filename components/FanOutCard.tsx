"use client";

import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";

/**
 * FanOutCard — Effect Capsule
 *
 * A card with a stack of "prints" hidden behind its main image. On hover the
 * prints deal out into a fan (one up, two left, two right) with a back-ease
 * overshoot and a staggered start, while the main image scales up slightly. On
 * leave they collapse back behind the card.
 *
 * Deps: gsap. Tailwind for layout. Plain <img>/<a> (swap for next/image + Link
 * if you want).
 *
 * Tokens (CSS variables, with fallbacks):
 *   --fan-print-border  (#ffffff)               white frame around each print
 *   --fan-print-bg      (#ffffff)               print backing
 *   --fan-print-ring    (rgba(54,48,42,0.1))    subtle edge ring on each print
 *   --fan-title         (#f6f3ec)               title colour
 *   --fan-tagline       (rgba(246,243,236,0.55))tagline colour
 *   --fan-display-font  (inherit)               font for the title
 */

type FanPos = { x: number; y: number; rot: number };

// Fan target offsets (px) + rotation, in order: top, left-in, left-out, right-in, right-out.
// A contained upward arc, calibrated for a ~300px-wide card — scale these if you
// change the card width or the prints fan too far / not enough.
const FAN: FanPos[] = [
  { x: 0, y: -290, rot: 0 },
  { x: -200, y: -120, rot: -10 },
  { x: -255, y: -10, rot: -20 },
  { x: 200, y: -120, rot: 10 },
  { x: 255, y: -10, rot: 20 },
];

type FanOutCardProps = {
  /** main (front) image */
  image: string;
  /** images that deal out from behind — up to 5 (cycles FAN positions) */
  prints: string[];
  title?: string;
  tagline?: string;
  href?: string;
  /** override the fan target offsets (px) */
  fan?: FanPos[];
};

export default function FanOutCard({
  image,
  prints,
  title,
  tagline,
  href = "#",
  fan = FAN,
}: FanOutCardProps) {
  const stage = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const fp = gsap.utils.toArray<HTMLElement>(".fan-print", stage.current!);
      // Stacked behind the front image, centred, hidden.
      gsap.set(fp, { xPercent: -50, yPercent: -50, x: 0, y: 0, rotate: 0, scale: 0.82, opacity: 0 });

      const timeline = gsap.timeline({ paused: true });
      timeline.to(".booth-img", { scale: 1.03, duration: 0.5, ease: "power3.out" }, 0);
      fp.forEach((p, i) => {
        const t = fan[i] ?? fan[0];
        timeline.to(
          p,
          { x: t.x, y: t.y, rotate: t.rot, scale: 1, opacity: 1, duration: 0.55, ease: "back.out(1.5)" },
          0.05 + i * 0.05
        );
      });
      tl.current = timeline;
    }, stage);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const play = () => tl.current?.play();
  const reverse = () => tl.current?.reverse();

  // Touch fallback: tap toggles the fan (hover doesn't fire on touch devices).
  const toggle = () => {
    const t = tl.current;
    if (!t) return;
    t.reversed() || t.progress() === 0 ? t.play() : t.reverse();
  };

  return (
    <a href={href} className="flex flex-col items-center">
      <div
        ref={stage}
        className="relative"
        style={{ width: "min(72vw, 300px)", aspectRatio: "2 / 3" }}
        onMouseEnter={play}
        onMouseLeave={reverse}
        onClick={(e) => {
          // let touch users fan without navigating on the first tap
          if (window.matchMedia("(hover: none)").matches) {
            e.preventDefault();
            toggle();
          }
        }}
      >
        {/* prints — behind the front image, centred */}
        {prints.map((src, i) => (
          <div key={i} className="fan-print absolute left-1/2 top-1/2 z-10 w-[42%]" style={{ aspectRatio: "4 / 5" }}>
            <div className="relative h-full w-full overflow-hidden border-[6px] border-[var(--fan-print-border,#fff)] bg-[var(--fan-print-bg,#fff)] shadow-2xl ring-1 ring-[var(--fan-print-ring,rgba(54,48,42,0.1))]">
              <img src={src} alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        ))}

        {/* front image — on top, prints emerge from behind it */}
        <div className="booth-img relative z-20 h-full w-full overflow-hidden">
          <img src={image} alt={title ?? ""} className="h-full w-full object-cover" />
        </div>
      </div>

      {title ? (
        <h3 className="mt-6 text-xl tracking-tight text-[var(--fan-title,#f6f3ec)]" style={{ fontFamily: "var(--fan-display-font, inherit)" }}>
          {title}
        </h3>
      ) : null}
      {tagline ? (
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--fan-tagline,rgba(246,243,236,0.55))]">{tagline}</p>
      ) : null}
    </a>
  );
}
