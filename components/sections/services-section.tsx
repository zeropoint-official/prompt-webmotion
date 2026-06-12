"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Service = {
  n: string;
  label: string;
  kicker: string;
  headlineTop: string;
  headlineBottom: string;
  shortBody: string;
  stat: string;
  statLabel: string;
  hero: string;
  thumbs: string[];
};

const pool = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
];

const services: Service[] = [
  {
    n: "01",
    label: "Residential",
    kicker: "Build / Homes",
    headlineTop: "NEW HOMES",
    headlineBottom: "BUILT AROUND YOU",
    shortBody: "One-off houses, extensions and developments — structurally sound, energy-efficient, finished to a standard you'd show off.",
    stat: "140+",
    statLabel: "Homes delivered",
    hero: pool[0],
    thumbs: pool,
  },
  {
    n: "02",
    label: "Commercial",
    kicker: "Build / Business",
    headlineTop: "COMMERCIAL",
    headlineBottom: "SPACES THAT WORK",
    shortBody: "Offices, retail, warehouses and fit-outs on fixed programmes — built around your operation, not against it.",
    stat: "60+",
    statLabel: "Commercial projects",
    hero: pool[3],
    thumbs: pool,
  },
  {
    n: "03",
    label: "Renovation & Restoration",
    kicker: "Build / Rework",
    headlineTop: "RENOVATION",
    headlineBottom: "OLD MADE NEW",
    shortBody: "Refurbishments, conversions and careful restoration — keeping what's worth keeping, rebuilding the rest properly.",
    stat: "25 yrs",
    statLabel: "Restoration experience",
    hero: pool[1],
    thumbs: pool,
  },
  {
    n: "04",
    label: "Civil & Groundworks",
    kicker: "Build / Ground up",
    headlineTop: "CIVIL WORKS",
    headlineBottom: "FROM THE GROUND UP",
    shortBody: "Foundations, drainage, roads and infrastructure — the heavy, hidden engineering everything else depends on.",
    stat: "80 km",
    statLabel: "Drainage & roads laid",
    hero: pool[2],
    thumbs: pool,
  },
];

export function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="services" className="relative w-full overflow-hidden bg-white py-28 text-neutral-900 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-20 grid grid-cols-1 gap-10 md:grid-cols-12">
          <h2 className="font-sans text-[clamp(2.4rem,5.4vw,4.8rem)] font-medium leading-[1] tracking-[-0.045em] md:col-span-12">
            What we build.
            <br />
            <span className="text-neutral-400">Four ways we </span>
            <span className="bg-gradient-to-r from-amber-500 to-yellow-400 bg-clip-text text-transparent">put up a building</span>
            <span className="text-neutral-400">.</span>
          </h2>
          <div className="md:col-span-6 md:col-start-7">
            <p className="mt-2 max-w-[58ch] text-[clamp(1rem,1.1vw,1.1rem)] font-light leading-[1.65] text-neutral-500">
              One contractor, the full range. Whether it's a single home or a phased commercial site, the same crews, plant and standards carry it through. Tap a service to see it open.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-200">
        {services.map((s, i) => {
          const isActive = activeIndex === i;
          return (
            <div key={s.n} className="group relative overflow-hidden border-b border-neutral-200">
              <button
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-expanded={isActive}
                className="block w-full cursor-pointer text-left focus:outline-none"
              >
                <motion.div
                  animate={{ height: isActive ? 480 : 100 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full overflow-hidden"
                >
                  {/* OPEN PANEL */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                      >
                        <Image src={s.hero} alt="" fill className="object-cover" sizes="100vw" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-black/70" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                        <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-between px-6 py-6 md:px-10 md:py-10" style={{ height: 480 }}>
                          <div className="flex items-start justify-between gap-6">
                            <div className="flex items-center gap-3">
                              <span className="bg-gradient-to-br from-amber-400 to-yellow-300 bg-clip-text font-sans text-[1.4rem] font-medium leading-none text-transparent">
                                {s.n}
                              </span>
                              <span className="text-[0.62rem] font-medium uppercase tracking-[0.28em] text-white/70">
                                {s.kicker}
                              </span>
                            </div>
                            <span className="text-[0.62rem] uppercase tracking-[0.28em] text-white/55">In focus</span>
                          </div>
                          <div className="flex items-end justify-between gap-10">
                            <h3 className="max-w-[16ch] font-sans text-[clamp(2.4rem,6.5vw,6rem)] font-medium leading-[0.92] tracking-[-0.04em] text-white">
                              {s.headlineTop}
                              <br />
                              <span className="text-white/70">{s.headlineBottom}</span>
                            </h3>
                            <div className="hidden shrink-0 flex-col items-end gap-1 text-right md:flex">
                              <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text font-sans text-[clamp(2rem,3.4vw,3rem)] font-medium leading-none text-transparent">
                                {s.stat}
                              </span>
                              <span className="text-[0.62rem] uppercase tracking-[0.28em] text-white/55">{s.statLabel}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* CLOSED PANEL */}
                  <AnimatePresence>
                    {!isActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center"
                      >
                        <div className="relative mx-auto w-full max-w-[1400px] px-6 md:px-10">
                          <div className="flex items-center justify-between gap-4 md:grid md:grid-cols-12 md:gap-6">
                            <div className="flex items-center gap-4 md:col-span-1 md:justify-start">
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 transition-colors group-hover:border-neutral-400">
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                  <path d="M5 0v10M0 5h10" stroke="currentColor" strokeWidth="1" />
                                </svg>
                              </span>
                            </div>
                            <div className="md:col-span-4">
                              <h3 className="font-sans text-[clamp(1.4rem,2vw,2rem)] font-medium leading-[1.05] tracking-[-0.03em]">
                                {s.label}
                              </h3>
                              <span className="mt-1 block text-[0.6rem] uppercase tracking-[0.32em] text-neutral-400">
                                {s.n} — {s.kicker}
                              </span>
                            </div>
                            <div className="hidden md:col-span-4 md:block">
                              <p className="max-w-[44ch] text-[0.92rem] font-light leading-[1.6] text-neutral-500">
                                {s.shortBody}
                              </p>
                            </div>
                            <div className="hidden md:col-span-3 md:block">
                              <div className="flex items-center justify-end gap-1.5">
                                {s.thumbs.slice(0, 4).map((src, j) => (
                                  <div key={j} className="relative h-12 w-12 overflow-hidden rounded-md border border-neutral-200 md:h-14 md:w-14">
                                    <Image src={src} alt="" fill sizes="56px" className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </button>
            </div>
          );
        })}
      </div>

      <p className="mx-auto mt-24 max-w-[46ch] px-6 text-center font-sans text-[clamp(1.2rem,1.8vw,1.7rem)] leading-[1.3] tracking-[-0.02em] text-neutral-900 md:mt-32 md:px-10">
        One number, one team, one point of responsibility.{" "}
        <span className="text-neutral-400">Start to finish.</span>
      </p>
    </section>
  );
}

export default ServicesSection;
