"use client";

import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * ScatterHero — Effect Capsule
 *
 * A photo collage scatters off-screen (sides fly out, top scrolls up) while a
 * small bottom-center photo zooms up to fill the screen, and a brand title
 * rises in letter-by-letter over it; then the photo sticks and darkens as the
 * next section scrolls over it.
 *
 * Deps: gsap (gsap + gsap/ScrollTrigger). Tailwind for layout. Lenis optional.
 *
 * Tokens (CSS variables, with fallbacks):
 *   --hero-bg            (#f6f3ec) section background behind the collage
 *   --hero-fg            (#36302a) headline color on the light background
 *   --hero-on-dark       (#f6f3ec) brand-title + CTA text (sits on the dark photo)
 *   --hero-cta-bg        (#36302a) / --hero-cta-bg-hover (#574c3f) CTA button
 *   --hero-display-font  (inherit) display font for headline + brand title
 */

type Tiles = {
  topLeft: string;
  topCenter: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
  /** The bottom-center photo that zooms up to fill the screen */
  hero: string;
};

type ScatterHeroProps = {
  headline?: string;
  /** Words that rise in letter-by-letter over the filling photo */
  brandReveal?: string;
  cta?: { label: string; href: string };
  tiles?: Tiles;
  alt?: Partial<Record<keyof Tiles, string>>;
  /** The section(s) that scroll up and overlap the sticky photo (drives the darken) */
  children?: React.ReactNode;
};

const PH = (seed: string, w: number, h: number) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
const DEFAULT_TILES: Tiles = {
  topLeft: PH("hero-tl", 600, 1000),
  topCenter: PH("hero-top", 1200, 450),
  topRight: PH("hero-tr", 600, 1000),
  bottomLeft: PH("hero-bl", 600, 1000),
  bottomRight: PH("hero-br", 600, 1000),
  hero: PH("hero-center", 1600, 900),
};

export default function ScatterHero({
  headline = "Your headline goes here",
  brandReveal = "Your Brand Name",
  cta = { label: "Enquire", href: "#" },
  tiles = DEFAULT_TILES,
  alt = {},
  children,
}: ScatterHeroProps) {
  const root = useRef<HTMLElement>(null);
  const heroScale = useRef<HTMLDivElement>(null);
  const heroOverlay = useRef<HTMLDivElement>(null);
  const overlap = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const vw = () => window.innerWidth;
      const vh = () => window.innerHeight;

      const mm = gsap.matchMedia();

      // Reduced motion → snap to the END state: full-screen photo + brand title,
      // collage scattered off, headline gone. (Matches where the scroll lands.)
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(heroScale.current, { scale: 1, y: 0, transformOrigin: "center center" });
        gsap.set(".hero-left", { x: () => -vw() * 0.6, y: () => -vh() * 1.15 });
        gsap.set(".hero-right", { x: () => vw() * 0.6, y: () => -vh() * 1.15 });
        gsap.set(".hero-up", { y: () => -vh() * 1.15 });
        gsap.set(".hero-letter", { opacity: 1, yPercent: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Rest pose: photo scaled small (0.4) and dropped so only its top edge peeks in.
        gsap.set(heroScale.current, { scale: 0.4, y: () => vh() * 0.5, transformOrigin: "center center" });

        const letters = gsap.utils.toArray<HTMLElement>(".hero-letter");
        gsap.set(letters, { opacity: 0, yPercent: 110 });

        // PHASE 1 — collage scatter + photo grows to fill; brand title rises in.
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=100%", scrub: true },
        });
        tl.to(".hero-left", { x: () => -vw() * 0.6, y: () => -vh() * 1.15, duration: 1.3 }, 0)
          .to(".hero-right", { x: () => vw() * 0.6, y: () => -vh() * 1.15, duration: 1.3 }, 0)
          .to(heroScale.current, { scale: 1, y: 0, duration: 1.3 }, 0)
          .to(".hero-up", { y: () => -vh() * 1.15, duration: 0.6 }, 0)
          .to(letters, { opacity: 1, yPercent: 0, duration: 0.25, stagger: { amount: 0.45 } }, 0.6);

        // PHASE 2 — darken the (sticking) photo as the next content overlaps it.
        if (overlap.current && overlap.current.childElementCount > 0) {
          gsap.fromTo(
            heroOverlay.current,
            { opacity: 0 },
            {
              opacity: 0.88,
              ease: "none",
              scrollTrigger: { trigger: overlap.current, start: "top bottom", end: "top center", scrub: true },
            }
          );
        }
      });
    }, root);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  const displayFont = { fontFamily: "var(--hero-display-font, inherit)" } as const;

  return (
    <section ref={root} className="relative bg-[var(--hero-bg,#f6f3ec)] text-[var(--hero-fg,#36302a)]">
      {/* STICKY STAGE — the photo sticks here while the next section scrolls over it */}
      <div className="sticky top-0 z-0 h-screen w-full overflow-hidden">
        {/* photo scales 0.4 → 1; the brand title lives INSIDE so it zooms with the image */}
        <div ref={heroScale} className="absolute inset-0 z-0">
          <img className="h-full w-full object-cover" src={tiles.hero} alt={alt.hero ?? ""} />
          {/* center scrim so the title stays crisp over a bright photo */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(70% 55% at 50% 50%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 75%)" }}
          />
          {/* brand title — letters rise in, scales with the photo */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center">
            <h2
              aria-label={brandReveal}
              className="max-w-[18ch] text-balance text-[clamp(2.5rem,8vw,6.5rem)] leading-[1.05] tracking-tight text-[var(--hero-on-dark,#f6f3ec)]"
              style={{ ...displayFont, textShadow: "0 2px 30px rgba(0,0,0,0.45)" }}
            >
              {brandReveal.split(/(\s+)/).map((token, ti) =>
                /\s+/.test(token) ? (
                  <span key={`s-${ti}`}> </span>
                ) : (
                  <span key={`w-${ti}`} aria-hidden="true" className="inline-block overflow-clip pb-[0.08em] align-bottom">
                    {Array.from(token).map((ch, ci) => (
                      <span key={ci} className="hero-letter inline-block will-change-[transform,opacity]">
                        {ch}
                      </span>
                    ))}
                  </span>
                )
              )}
            </h2>
          </div>
        </div>

        {/* black overlay — fades in during the handoff */}
        <div ref={heroOverlay} className="absolute inset-0 z-[1] bg-black opacity-0" />

        {/* collage tiles */}
        <div className="hero-left absolute left-[2vw] top-[7%] z-10 aspect-[3/5] w-[26vw] overflow-hidden md:left-[1.5vw] md:w-[15vw]">
          <img src={tiles.topLeft} alt={alt.topLeft ?? ""} className="h-full w-full object-cover" />
        </div>
        <div className="hero-up absolute left-1/2 top-0 z-10 aspect-[8/3] w-[40vw] -translate-x-1/2 overflow-hidden">
          <img src={tiles.topCenter} alt={alt.topCenter ?? ""} className="h-full w-full object-cover" />
        </div>
        <div className="hero-right absolute right-[2vw] top-[7%] z-10 aspect-[3/5] w-[26vw] overflow-hidden md:right-[1.5vw] md:w-[15vw]">
          <img src={tiles.topRight} alt={alt.topRight ?? ""} className="h-full w-full object-cover" />
        </div>
        <div className="hero-left absolute bottom-[6%] left-[2vw] z-10 aspect-[3/5] w-[26vw] overflow-hidden md:bottom-[4%] md:left-[1.5vw] md:w-[15vw]">
          <img src={tiles.bottomLeft} alt={alt.bottomLeft ?? ""} className="h-full w-full object-cover" />
        </div>
        <div className="hero-right absolute bottom-[6%] right-[2vw] z-10 aspect-[3/5] w-[26vw] overflow-hidden md:bottom-[4%] md:right-[1.5vw] md:w-[15vw]">
          <img src={tiles.bottomRight} alt={alt.bottomRight ?? ""} className="h-full w-full object-cover" />
        </div>

        {/* headline + CTA — scrolls up with the top image */}
        <div className="hero-up absolute inset-x-0 top-[34%] z-20 flex flex-col items-center px-6 text-center">
          <h1 className="max-w-[14ch] text-balance text-[clamp(2.4rem,6vw,5.5rem)] leading-[1.02] tracking-tight" style={displayFont}>
            {headline}
          </h1>
          <a
            href={cta.href}
            className="mt-8 inline-flex items-center rounded-sm px-8 py-3 text-sm uppercase tracking-wide transition-colors bg-[var(--hero-cta-bg,#36302a)] text-[var(--hero-on-dark,#f6f3ec)] hover:bg-[var(--hero-cta-bg-hover,#574c3f)]"
          >
            {cta.label}
          </a>
        </div>
      </div>

      {/* Phase-1 scroll runway — lets the scatter/scale scrub finish before overlap */}
      <div className="h-screen" aria-hidden />

      {/* Nested content scrolls UP and overlaps the sticky photo (drives the darken) */}
      <div ref={overlap} className="relative z-10">
        {children}
      </div>
    </section>
  );
}
