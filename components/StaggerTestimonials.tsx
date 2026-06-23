"use client";

import React, { useState, useEffect } from "react";

/**
 * StaggerTestimonials — Effect Capsule
 *
 * Fanned, staggered testimonial cards: the centred card pops forward (lifted,
 * with a hard offset shadow) while the others fan out to the sides with slight
 * rotation/offset. Click a side card or the arrows to bring it to centre — the
 * list rotates with an eased transition. On mobile the fan collapses to a single
 * readable centred card.
 *
 * Deps: none (plain React). Tailwind for layout. Icons are inline SVG.
 *
 * Tokens (CSS variables, with fallbacks):
 *   --st-center-bg    (#f6f3ec) focused card background
 *   --st-center-fg    (#36302a) focused card text
 *   --st-side-bg      (#574c3f) side card background
 *   --st-side-fg      (#f6f3ec) side card text
 *   --st-accent       (#b9a590) center-card drop-shadow + side hover border
 *   --st-control-fg   (#f6f3ec) arrow button text/icon
 *   --st-display-font (inherit) font for the monogram initial
 */

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");
const SQRT_5000 = Math.sqrt(5000);

export type Testimonial = { tempId: number | string; testimonial: string; by: string };

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { tempId: 0, testimonial: "Absolutely loved it — stylish setup, amazing quality, and super friendly staff.", by: "Alex" },
  { tempId: 1, testimonial: "One of the best decisions we made. Everything was seamless from start to finish.", by: "Maria" },
  { tempId: 2, testimonial: "Beautifully organised with so many options. Easily the best I've seen.", by: "Sam" },
];

interface TestimonialCardProps {
  position: number;
  testimonial: Testimonial;
  handleMove: (steps: number) => void;
  cardSize: number;
  isMobile: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ position, testimonial, handleMove, cardSize, isMobile }) => {
  const isCenter = position === 0;
  const initial = testimonial.by.charAt(0);
  // On mobile the fan can't breathe — show only the centred card, hide the rest.
  const hidden = isMobile && !isCenter;

  const transform = isMobile
    ? "translate(-50%, -50%)"
    : `translate(-50%, -50%) translateX(${(cardSize / 1.5) * position}px) translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px) rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)`;

  return (
    <div
      onClick={() => !hidden && handleMove(position)}
      className={cx(
        "absolute left-1/2 top-1/2 cursor-pointer border p-7 transition-all duration-500 ease-in-out sm:p-8",
        isCenter
          ? "z-10 border-[var(--st-center-bg,#f6f3ec)] bg-[var(--st-center-bg,#f6f3ec)] text-[var(--st-center-fg,#36302a)]"
          : "z-0 border-white/15 bg-[var(--st-side-bg,#574c3f)] text-[var(--st-side-fg,#f6f3ec)] hover:border-[var(--st-accent,#b9a590)]"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? "none" : "auto",
        clipPath: "polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)",
        transform,
        boxShadow: isCenter ? "0px 8px 0px 4px var(--st-accent, rgba(185,165,144,0.45))" : "0px 0px 0px 0px transparent",
      }}
    >
      <span
        aria-hidden
        className="absolute block origin-top-right rotate-45"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2,
          background: isCenter ? "rgba(54, 48, 42, 0.18)" : "rgba(246, 243, 236, 0.18)",
        }}
      />
      <div
        className={cx(
          "mb-5 flex h-12 w-12 items-center justify-center border text-lg",
          isCenter ? "border-black/30 text-[var(--st-center-fg,#36302a)]" : "border-white/30 text-[var(--st-side-fg,#f6f3ec)]"
        )}
        style={{ fontFamily: "var(--st-display-font, inherit)" }}
      >
        {initial}
      </div>
      <h3 className="text-base font-medium leading-snug sm:text-lg">&ldquo;{testimonial.testimonial}&rdquo;</h3>
      <p className="absolute bottom-8 left-8 right-8 mt-2 text-sm italic opacity-70">— {testimonial.by}</p>
    </div>
  );
};

export default function StaggerTestimonials({ items = DEFAULT_TESTIMONIALS }: { items?: Testimonial[] }) {
  const [cardSize, setCardSize] = useState(365);
  const [isMobile, setIsMobile] = useState(false);
  const [list, setList] = useState<Testimonial[]>(items);

  const handleMove = (steps: number) => {
    const newList = [...list];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const desktop = window.matchMedia("(min-width: 640px)").matches;
      setIsMobile(!desktop);
      setCardSize(desktop ? 365 : Math.min(Math.round(window.innerWidth * 0.84), 340));
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="relative w-full overflow-hidden" style={{ height: isMobile ? 470 : 560 }}>
      {list.map((t, index) => {
        const position = index - Math.floor(list.length / 2);
        return (
          <TestimonialCard
            key={t.tempId}
            testimonial={t}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
            isMobile={isMobile}
          />
        );
      })}

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        <button
          onClick={() => handleMove(-1)}
          aria-label="Previous testimonial"
          className="flex h-14 w-14 items-center justify-center border border-white/20 bg-transparent text-[var(--st-control-fg,#f6f3ec)] transition-colors hover:bg-[var(--st-center-bg,#f6f3ec)] hover:text-[var(--st-center-fg,#36302a)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--st-accent,#b9a590)]"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={() => handleMove(1)}
          aria-label="Next testimonial"
          className="flex h-14 w-14 items-center justify-center border border-white/20 bg-transparent text-[var(--st-control-fg,#f6f3ec)] transition-colors hover:bg-[var(--st-center-bg,#f6f3ec)] hover:text-[var(--st-center-fg,#36302a)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--st-accent,#b9a590)]"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
