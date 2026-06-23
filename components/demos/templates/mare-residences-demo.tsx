"use client";

/* Live preview of the Maré template's Featured Residences chapter (Website
   Templates). Faithful port of the template's FeaturedResidences: a pinned
   horizontal scroll with a HUD — the page pins, a track of full-viewport
   listing slides translates sideways, and a heads-up overlay tracks the live
   index, an animated cumulative price counter, a progress bar and a ghost
   listing numeral per slide. The only changes from the shipped component are
   environment ones — images are served from the hosted asset bucket and the
   Lenis frame callback is swapped for a native rAF loop, since the preview
   iframe scrolls natively. */

import { useEffect, useRef, useState } from "react";

const ACCENT = "#138a7d";
const R2 = "https://pub-a48aee57c7854772ad65c69703d7a98e.r2.dev";
const IMG = (name: string) => `${R2}/new-images/${name}.png`;

type Listing = {
  n: string;
  name: string;
  place: string;
  coords: string;
  price: number; // millions, for the HUD ticker
  priceLabel: string;
  beds: string;
  baths: string;
  area: string;
  status: string;
  img: string;
};

const LISTINGS: Listing[] = [
  {
    n: "01",
    name: "Bayfront Pavilion",
    place: "Miami Beach",
    coords: "25.79° N · 80.13° W",
    price: 24.5,
    priceLabel: "$24.5M",
    beds: "6",
    baths: "8",
    area: "11,400",
    status: "For Sale",
    img: IMG("waterfront-villa"),
  },
  {
    n: "02",
    name: "The Glass House",
    place: "Palm Beach",
    coords: "26.71° N · 80.04° W",
    price: 18.9,
    priceLabel: "$18.9M",
    beds: "5",
    baths: "6",
    area: "9,250",
    status: "For Sale",
    img: IMG("modern-villa"),
  },
  {
    n: "03",
    name: "Dune Residence",
    place: "Naples",
    coords: "26.14° N · 81.79° W",
    price: 32,
    priceLabel: "$32.0M",
    beds: "7",
    baths: "9",
    area: "14,100",
    status: "Off Market",
    img: IMG("estate-sunset"),
  },
  {
    n: "04",
    name: "Grove Manor",
    place: "Coconut Grove",
    coords: "25.72° N · 80.24° W",
    price: 14.2,
    priceLabel: "$14.2M",
    beds: "4",
    baths: "5",
    area: "6,800",
    status: "For Sale",
    img: IMG("grand-estate"),
  },
];

const N = LISTINGS.length;
const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export default function MareResidencesDemo() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const updateRef = useRef<() => void>(() => {});
  const activeRef = useRef(0);

  const [active, setActive] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const update = () => {
      const distance = section.offsetHeight - window.innerHeight;
      if (distance <= 0) return;
      const rect = section.getBoundingClientRect();
      const progress = clamp(-rect.top / distance);

      // Translate the track by viewport-width per slide (count-based, not
      // scrollWidth, so ghost numerals don't inflate the distance).
      const shift = progress * window.innerWidth * (N - 1);
      track.style.transform = `translate3d(${-shift}px,0,0)`;

      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;

      const pos = progress * (N - 1);
      const idx = clamp(Math.round(pos), 0, N - 1);

      // Cumulative price up to and including the active slide.
      if (counterRef.current) {
        const total = LISTINGS.slice(0, idx + 1).reduce(
          (s, l) => s + l.price,
          0,
        );
        counterRef.current.textContent = `$${total.toFixed(1)}M`;
      }

      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
    };

    updateRef.current = update;
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [isDesktop]);

  // Native rAF ticker drives the horizontal scrub (template uses Lenis).
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      updateRef.current();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ------------------------------ MOBILE ------------------------------ */
  if (!isDesktop) {
    return (
      <section className="relative overflow-hidden border-t border-paper/10 bg-ink py-24 text-paper">
        <div className="px-6">
          <span
            className="text-[0.6rem] font-medium uppercase tracking-[0.4em]"
            style={{ color: ACCENT }}
          >
            § 03 — Featured Residences
          </span>
          <h2 className="mt-6 text-[clamp(2.4rem,9vw,3.4rem)] font-medium leading-[1] tracking-[-0.04em]">
            A private
            <br />
            <span className="text-paper-dim">portfolio of</span>{" "}
            <span
              className="bg-clip-text font-editorial italic text-transparent"
              style={{
                backgroundImage: `linear-gradient(90deg, ${ACCENT}, #2cc3b1)`,
              }}
            >
              rare homes.
            </span>
          </h2>
        </div>

        <div className="scrollbar-none mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4">
          {LISTINGS.map((l) => (
            <article key={l.n} className="w-[80vw] shrink-0 snap-center">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={l.img}
                  alt={l.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[0.55rem] font-medium uppercase tracking-[0.25em] text-white backdrop-blur-md">
                  {l.n} · {l.status}
                </span>
                <div className="absolute inset-x-4 bottom-4">
                  <span
                    className="bg-clip-text text-2xl font-medium text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(90deg, ${ACCENT}, #5fe0cf)`,
                    }}
                  >
                    {l.priceLabel}
                  </span>
                  <h3 className="text-xl font-medium">{l.name}</h3>
                  <p className="text-[0.62rem] uppercase tracking-[0.28em] text-paper-dim">
                    {l.place} · {l.beds} BD · {l.baths} BA
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  /* ------------------------------ DESKTOP ------------------------------ */
  return (
    <section
      ref={sectionRef}
      className="relative h-[420vh] border-t border-paper/10 bg-ink text-paper"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* sliding track */}
        <div
          ref={trackRef}
          className="absolute inset-0 flex h-full will-change-transform"
        >
          {LISTINGS.map((l) => (
            <div key={l.n} className="relative h-full w-screen shrink-0">
              {/* ghost listing numeral */}
              <span
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-semibold leading-none tracking-[-0.05em]"
                style={{
                  fontSize: "32vw",
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(251,251,249,0.05)",
                }}
              >
                {l.n}
              </span>

              <div className="mx-auto flex h-full max-w-[1400px] items-center px-10 xl:px-16">
                <div className="grid w-full grid-cols-12 items-center gap-10">
                  {/* framed image */}
                  <figure className="relative col-span-7 col-start-1">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[14px] shadow-[0_50px_100px_-40px_rgba(0,0,0,0.7)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={l.img}
                        alt={l.name}
                        className="h-full w-full object-cover"
                        draggable={false}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
                      <div className="grain absolute inset-0" />
                      {/* status pill */}
                      <span className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[0.56rem] font-medium uppercase tracking-[0.3em] text-white/85 backdrop-blur-md">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: ACCENT }}
                        />
                        {l.status}
                      </span>
                    </div>
                    {/* corner brackets */}
                    <span className="pointer-events-none absolute -left-3 -top-3 h-7 w-7 border-l border-t border-paper/25" />
                    <span className="pointer-events-none absolute -bottom-3 -right-3 h-7 w-7 border-b border-r border-paper/25" />
                  </figure>

                  {/* editorial detail column */}
                  <div className="col-span-4 col-start-9">
                    <span className="text-[0.58rem] font-medium uppercase tracking-[0.35em] text-paper-dim">
                      {l.coords}
                    </span>
                    <h3 className="mt-5 text-[clamp(2rem,3.4vw,3.2rem)] font-medium leading-[0.98] tracking-[-0.035em]">
                      {l.name}
                    </h3>
                    <p className="mt-2 text-[0.7rem] uppercase tracking-[0.3em] text-paper-dim">
                      {l.place}
                    </p>

                    <span
                      className="mt-7 block bg-clip-text text-[clamp(1.8rem,2.6vw,2.6rem)] font-medium leading-none tabular-nums text-transparent"
                      style={{
                        backgroundImage: `linear-gradient(90deg, ${ACCENT}, #5fe0cf)`,
                      }}
                    >
                      {l.priceLabel}
                    </span>

                    {/* spec strip */}
                    <div className="mt-8 grid grid-cols-3 border-t border-paper/10">
                      {[
                        { k: "Beds", v: l.beds },
                        { k: "Baths", v: l.baths },
                        { k: "Sq Ft", v: l.area },
                      ].map((spec) => (
                        <div
                          key={spec.k}
                          className="border-r border-paper/10 py-5 last:border-r-0"
                        >
                          <span className="block text-[0.52rem] uppercase tracking-[0.3em] text-paper-dim">
                            {spec.k}
                          </span>
                          <span className="mt-2 block text-xl font-medium tabular-nums">
                            {spec.v}
                          </span>
                        </div>
                      ))}
                    </div>

                    <span className="group mt-8 inline-flex items-center gap-3 text-[0.62rem] font-medium uppercase tracking-[0.3em] text-paper">
                      Arrange a Private Viewing
                      <span style={{ color: ACCENT }}>↗</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ---------------- HUD overlay (fixed within the pin) ---------------- */}
        {/* eyebrow */}
        <div className="pointer-events-none absolute left-10 top-28 z-30 xl:left-16">
          <span
            className="text-[0.6rem] font-medium uppercase tracking-[0.45em]"
            style={{ color: ACCENT }}
          >
            § 03 — Featured Residences
          </span>
          <p className="mt-3 max-w-[22ch] text-[clamp(1.4rem,1.9vw,2rem)] font-medium leading-[1.05] tracking-[-0.02em] text-paper">
            A private portfolio of{" "}
            <span className="font-editorial italic text-paper-dim">
              rare homes.
            </span>
          </p>
        </div>

        {/* live index + cumulative counter — top right */}
        <div className="pointer-events-none absolute right-10 top-28 z-30 text-right xl:right-16">
          <span className="text-[0.62rem] uppercase tracking-[0.3em] text-paper-dim tabular-nums">
            <span className="text-paper">{LISTINGS[active].n}</span> /{" "}
            {String(N).padStart(2, "0")}
          </span>
          <div className="mt-3">
            <span className="block text-[0.5rem] uppercase tracking-[0.3em] text-paper-dim">
              Collection Value
            </span>
            <span
              ref={counterRef}
              className="mt-1 block bg-clip-text text-lg font-medium tabular-nums text-transparent"
              style={{
                backgroundImage: `linear-gradient(90deg, ${ACCENT}, #5fe0cf)`,
              }}
            >
              $24.5M
            </span>
          </div>
        </div>

        {/* bottom: place ticker + progress */}
        <div className="absolute inset-x-0 bottom-10 z-30 mx-auto flex max-w-[1400px] items-center justify-between px-10 xl:px-16">
          <div className="relative h-5 w-[260px] overflow-hidden">
            {LISTINGS.map((l, i) => (
              <span
                key={l.n}
                className="absolute inset-0 text-[0.6rem] font-medium uppercase tracking-[0.35em] text-paper-dim transition-opacity duration-500"
                style={{ opacity: i === active ? 1 : 0 }}
              >
                {l.place} · {l.coords}
              </span>
            ))}
          </div>
          <span className="text-[0.55rem] uppercase tracking-[0.32em] text-paper-dim">
            Scroll to explore →
          </span>
        </div>

        {/* progress line, very bottom */}
        <div className="absolute inset-x-0 bottom-0 z-30 h-px bg-paper/10">
          <span
            ref={barRef}
            className="block h-full origin-left"
            style={{ backgroundColor: ACCENT, transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}
