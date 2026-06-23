"use client";

/* Live preview of the Maré template's pinned services carousel (Website
   Templates). Faithful port of the template's ServicesScroll: a pinned stage
   holds a vertical carousel of property cards that rise from the bottom-center,
   pass over a giant background index, and exit toward the top, while the left
   list, right copy and bottom nav track the active service. The only changes
   from the shipped component are environment ones — images are served from the
   hosted asset bucket and the Lenis frame callback is swapped for a native rAF
   loop, since the preview iframe scrolls natively. */

import { useEffect, useRef, useState } from "react";

type Service = {
  num: string;
  title: string;
  tag: string;
  copy: string;
  cta: string;
  img: string;
};

const R2 = "https://pub-a48aee57c7854772ad65c69703d7a98e.r2.dev";
const IMG = (name: string) => `${R2}/Service-Images/${name}.png`;

const SERVICES: Service[] = [
  {
    num: "01",
    title: "Luxury Home Buying",
    tag: "Private Acquisition",
    copy: "We open doors to Florida's most coveted addresses — gated estates, architectural landmarks, and quiet enclaves matched to the life you intend to live.",
    cta: "Explore Luxury Buying",
    img: IMG("luxury-home-buying"),
  },
  {
    num: "02",
    title: "Waterfront Properties",
    tag: "On the Water",
    copy: "Deep-water docks, sunrise terraces, and horizons that never end. We specialize in the homes where the coast quietly becomes your backyard.",
    cta: "View Waterfront Homes",
    img: IMG("waterfront-properties"),
  },
  {
    num: "03",
    title: "Selling Your Home",
    tag: "Listing & Marketing",
    copy: "Editorial marketing, global reach, and pricing intelligence that positions your property to sell at its true worth — confidently and discreetly.",
    cta: "List With Us",
    img: IMG("selling-your-home"),
  },
  {
    num: "04",
    title: "Investment Properties",
    tag: "Yield & Growth",
    copy: "From short-term coastal rentals to long-hold appreciation plays, we structure Florida real estate that works as hard as you do.",
    cta: "Build Your Portfolio",
    img: IMG("investment-properties"),
  },
  {
    num: "05",
    title: "Relocation to Florida",
    tag: "Concierge Move",
    copy: "Trading winters for sunshine? We guide the entire move — neighborhoods, schools, lifestyle — so Florida feels like home from day one.",
    cta: "Plan Your Move",
    img: IMG("relocation-to-florida"),
  },
  {
    num: "06",
    title: "Market Valuation",
    tag: "Pricing Intelligence",
    copy: "A precise, data-driven read on what your property commands today — backed by hyper-local comparables and decades on the coast.",
    cta: "Request a Valuation",
    img: IMG("market-valuation"),
  },
  {
    num: "07",
    title: "New Developments",
    tag: "Pre-Construction",
    copy: "First access to pre-construction towers and boutique residences along the coast — secured before they ever reach the open market.",
    cta: "See What's Coming",
    img: IMG("new-developments"),
  },
];

const N = SERVICES.length;
const ACCENT = "#138a7d"; // coastal teal — the section's single Florida accent

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export default function MareServicesDemo() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRef = useRef<HTMLSpanElement>(null);
  const updateRef = useRef<() => void>(() => {});
  const activeRef = useRef(0);

  const [active, setActive] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  // Only mount the heavy pinned stage on wide screens; phones get a simple
  // stacked flow (so we never reserve a 600vh empty pin on mobile).
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
    if (!section) return;

    const update = () => {
      const distance = section.offsetHeight - window.innerHeight;
      if (distance <= 0) return;
      const rect = section.getBoundingClientRect();
      const progress = clamp(-rect.top / distance);
      const pos = progress * (N - 1);
      const vh = window.innerHeight;

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const offset = i - pos; // 0 = centered, + = below, - = above
        const dist = Math.abs(offset);
        const ty = offset * vh * 0.64;
        const scale = Math.max(0.78, 1 - dist * 0.13);
        const opacity = clamp(1.12 - dist * 0.92);
        const blur = Math.min(dist * 2.4, 7);
        el.style.transform = `translate(-50%, -50%) translateY(${ty}px) scale(${scale})`;
        el.style.opacity = String(opacity);
        el.style.filter = blur > 0.25 ? `blur(${blur}px)` : "none";
        el.style.zIndex = String(100 - Math.round(dist * 10));
      });

      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;

      const idx = clamp(Math.round(pos), 0, N - 1);
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

  // Native rAF ticker drives the carousel (template uses the Lenis callback).
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      updateRef.current();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ----------------------------- MOBILE ----------------------------- */
  if (!isDesktop) {
    return (
      <section className="bg-[#f3f1ea] px-5 py-20 text-[#0d0d0c]">
        <header className="mb-12">
          <span
            className="text-[0.62rem] font-semibold uppercase tracking-[0.4em]"
            style={{ color: ACCENT }}
          >
            Our Services
          </span>
          <h2 className="mt-4 text-[2.6rem] font-semibold leading-[0.95] tracking-[-0.03em]">
            How we move you
            <br />
            across Florida.
          </h2>
        </header>

        <div className="flex flex-col gap-16">
          {SERVICES.map((s) => (
            <article key={s.num}>
              <div className="relative overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.img}
                  alt={s.title}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.25em]">
                  {s.num} · {s.tag}
                </span>
              </div>
              <h3 className="mt-5 text-[1.7rem] font-semibold tracking-[-0.02em]">
                {s.title}
              </h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-black/60">
                {s.copy}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 bg-[#0d0d0c] px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#f3f1ea]">
                {s.cta}
                <span style={{ color: ACCENT }}>↗</span>
              </span>
            </article>
          ))}
        </div>
      </section>
    );
  }

  /* ---------------------------- DESKTOP ---------------------------- */
  return (
    <section
      ref={sectionRef}
      className="relative h-[640vh] bg-[#f3f1ea] text-[#0d0d0c]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* hairline frame, top */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-px bg-black/10" />

        {/* eyebrow — top left */}
        <div className="absolute left-10 top-28 z-30 xl:left-16">
          <span
            className="text-[0.6rem] font-semibold uppercase tracking-[0.45em]"
            style={{ color: ACCENT }}
          >
            Our Services
          </span>
        </div>

        {/* note — top right */}
        <div className="absolute right-10 top-28 z-30 text-right xl:right-16">
          <p className="text-[0.58rem] font-medium uppercase leading-relaxed tracking-[0.35em] text-black/45">
            What we do
            <br />
            is what we love
            <span className="ml-1 inline-block" style={{ color: ACCENT }}>
              ↘
            </span>
          </p>
        </div>

        {/* GIANT background index — stays large, sits behind the cards */}
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            {SERVICES.map((s, i) => (
              <span
                key={s.num}
                className="absolute font-semibold leading-none tracking-[-0.04em] transition-opacity duration-500"
                style={{
                  fontSize: "clamp(14rem, 34vw, 32rem)",
                  color: "#0d0d0c",
                  opacity: i === active ? 0.06 : 0,
                }}
              >
                {s.num}
              </span>
            ))}
          </div>
        </div>

        {/* center label that rides on top of the giant number */}
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
          <span className="text-[clamp(2rem,4.4vw,4rem)] font-semibold tracking-[-0.03em] text-black/[0.07]">
            Florida
          </span>
        </div>

        {/* ---- vertical carousel of cards ---- */}
        <div className="absolute inset-0">
          {SERVICES.map((s, i) => (
            <div
              key={s.num}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="absolute left-1/2 top-1/2 will-change-transform"
              style={{ opacity: 0 }}
            >
              <figure className="relative w-[clamp(300px,30vw,460px)] overflow-hidden rounded-[14px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.img}
                  alt={s.title}
                  className="aspect-[4/5] w-full object-cover"
                  draggable={false}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-white">
                    {s.tag}
                  </span>
                  <span
                    className="rounded-full px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.25em]"
                    style={{ backgroundColor: ACCENT, color: "#f3f1ea" }}
                  >
                    {s.num}
                  </span>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>

        {/* ---- left: service list with arrow indicator ---- */}
        <nav className="absolute left-10 top-1/2 z-30 -translate-y-1/2 xl:left-16">
          <ul className="flex flex-col gap-[0.55rem]">
            {SERVICES.map((s, i) => {
              const on = i === active;
              return (
                <li key={s.num}>
                  <button
                    type="button"
                    className="group flex items-center gap-3 text-left"
                    onClick={() => scrollToService(sectionRef.current, i)}
                  >
                    <span
                      className="block h-px transition-all duration-500"
                      style={{
                        width: on ? 26 : 0,
                        backgroundColor: ACCENT,
                        opacity: on ? 1 : 0,
                      }}
                    />
                    <span
                      className="text-[clamp(0.95rem,1.05vw,1.2rem)] font-medium tracking-[-0.01em] transition-colors duration-300"
                      style={{
                        color: on ? "#0d0d0c" : "rgba(13,13,12,0.32)",
                        fontWeight: on ? 600 : 400,
                      }}
                    >
                      {s.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ---- right: changing copy + CTA ---- */}
        <div className="absolute right-10 top-1/2 z-30 w-[clamp(260px,24vw,360px)] -translate-y-1/2 xl:right-16">
          <div className="relative min-h-[210px]">
            {SERVICES.map((s, i) => (
              <div
                key={s.num}
                className="absolute inset-0 transition-all duration-500"
                style={{
                  opacity: i === active ? 1 : 0,
                  transform: i === active ? "translateY(0)" : "translateY(12px)",
                }}
                aria-hidden={i !== active}
              >
                <span
                  className="text-[0.58rem] font-semibold uppercase tracking-[0.35em]"
                  style={{ color: ACCENT }}
                >
                  {s.tag}
                </span>
                <p className="mt-4 text-[0.95rem] font-light leading-relaxed text-black/65">
                  {s.copy}
                </p>
                <span className="group mt-7 inline-flex items-center gap-3 bg-[#0d0d0c] px-6 py-4 text-[0.64rem] font-semibold uppercase tracking-[0.28em] text-[#f3f1ea]">
                  {s.cta}
                  <span style={{ color: ACCENT }}>↗</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ---- bottom left: skip + progress nav ---- */}
        <div className="absolute bottom-10 left-10 z-30 flex items-center gap-6 xl:left-16">
          <div className="flex items-center gap-1.5">
            {SERVICES.map((s, i) => (
              <span
                key={s.num}
                className="block h-[2px] transition-all duration-500"
                style={{
                  width: i === active ? 26 : 12,
                  backgroundColor: i === active ? ACCENT : "rgba(13,13,12,0.2)",
                }}
              />
            ))}
          </div>
        </div>

        {/* overall progress line, very bottom */}
        <div className="absolute inset-x-0 bottom-0 z-30 h-px bg-black/10">
          <span
            ref={barRef}
            className="block h-full origin-left"
            style={{ backgroundColor: ACCENT, transform: "scaleX(0)" }}
          />
        </div>

        {/* ---- bottom right: handwritten label + thumbnail preview ---- */}
        <div className="absolute bottom-9 right-10 z-30 flex items-center gap-4 xl:right-16">
          <div className="relative h-[1.4rem] w-[150px] overflow-hidden text-right">
            {SERVICES.map((s, i) => (
              <span
                key={s.num}
                className="font-editorial absolute inset-0 text-[1.05rem] italic transition-opacity duration-500"
                style={{ opacity: i === active ? 0.7 : 0 }}
              >
                {s.title}
              </span>
            ))}
          </div>
          <div className="relative h-12 w-20 overflow-hidden rounded-md ring-1 ring-black/10">
            {SERVICES.map((s, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={s.num}
                src={s.img}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
                style={{ opacity: i === active ? 1 : 0 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Jump the page so a given service sits centered in the pinned timeline. */
function scrollToService(section: HTMLElement | null, i: number) {
  if (!section) return;
  const distance = section.offsetHeight - window.innerHeight;
  const target = section.offsetTop + (i / (N - 1)) * distance;
  window.scrollTo({ top: target, behavior: "smooth" });
}
