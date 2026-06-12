"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Project = {
  name: string;
  type: string;
  city: string;
  img: string;
  value: number;
  detail: string;
  desc: string;
  year: string;
};

const projects: Project[] = [
  {
    name: "THE RIDGE",
    type: "Residential",
    city: "Athens",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    value: 1_800_000,
    detail: "14 townhouses · 16 months",
    desc: "A hillside terrace of fourteen energy-efficient townhouses, delivered as a single phased development from groundworks to landscaped handover.",
    year: "24",
  },
  {
    name: "HARBOUR ONE",
    type: "Commercial",
    city: "Piraeus",
    img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80",
    value: 4_200_000,
    detail: "6,000 m² · live operation",
    desc: "A six-storey mixed-use office and retail block built around an operational waterfront — phased so the ground-floor units never closed.",
    year: "25",
  },
  {
    name: "OLIVE MILL",
    type: "Restoration",
    city: "Crete",
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    value: 2_600_000,
    detail: "Stone shell · adaptive reuse",
    desc: "A 19th-century stone mill restored and converted into a boutique hotel — original structure retained, services and interiors built new.",
    year: "25",
  },
  {
    name: "NORTH DEPOT",
    type: "Civil & Industrial",
    city: "Thessaloniki",
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80",
    value: 3_400_000,
    detail: "Foundations · drainage · yard",
    desc: "A logistics depot on reclaimed ground — deep foundations, a full surface-water drainage network and 9,000 m² of reinforced yard.",
    year: "26",
  },
];

const fmt = (n: number) => `€${Math.round(n).toLocaleString("en-IE")}`;
const TOTAL_VALUE = projects.reduce((s, p) => s + p.value, 0);

const marqueeItems = [
  "RESIDENTIAL", "COMMERCIAL", "CIVIL", "RESTORATION", "GROUNDWORKS", "FIT-OUT",
  "RESIDENTIAL", "COMMERCIAL", "CIVIL", "RESTORATION", "GROUNDWORKS", "FIT-OUT",
];

export function ProjectsSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollTo = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: i * window.innerWidth, behavior: "smooth" });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / window.innerWidth);
      setActiveIdx(idx);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="projects" className="relative w-full bg-neutral-950 text-white">
      {/* Intro */}
      <div className="px-6 pb-16 pt-28 md:px-10 md:pb-24 md:pt-40">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-16 grid grid-cols-1 gap-10 md:grid-cols-12">
            <h2 className="font-sans text-[clamp(2.4rem,5.6vw,5rem)] font-medium leading-[1] tracking-[-0.045em] md:col-span-12">
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Built, signed off,</span>
              <br />
              <span className="text-white/40">and standing </span>
              <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">today.</span>
            </h2>
            <div className="md:col-span-6 md:col-start-7">
              <p className="mt-2 max-w-[58ch] text-[clamp(1rem,1.1vw,1.1rem)] font-light leading-[1.65] text-white/65">
                A cross-section of recent work — residential, commercial, civil and restoration. Scroll across. Every project is real, every figure is the contract value we delivered against.
              </p>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4">
            {[
              { k: `${fmt(TOTAL_VALUE)}+`, v: "Delivered in this set" },
              { k: "200+", v: "Projects completed" },
              { k: "27 yrs", v: "On the tools" },
              { k: "98%", v: "Delivered on programme" },
            ].map((s) => (
              <div key={s.v} className="bg-neutral-950 p-6 md:p-8">
                <span className="block font-sans text-[clamp(1.8rem,2.6vw,2.4rem)] font-medium leading-none tracking-[-0.03em] bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  {s.k}
                </span>
                <span className="mt-2 block text-[0.7rem] uppercase tracking-[0.22em] text-white/55">
                  {s.v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Horizontal scroll — desktop */}
      <div className="relative hidden md:block">
        {/* HUD */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-30 flex items-center justify-between gap-6 px-10 py-6 text-[0.62rem] font-medium uppercase tracking-[0.28em] text-white/65">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <span className="relative flex h-[6px] w-[6px]">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-amber-400" />
              </span>
              Project
            </span>
            <span className="font-sans text-[0.95rem] tracking-[-0.01em] text-white">
              {String(activeIdx + 1).padStart(2, "0")}
              <span className="text-white/35"> / {String(projects.length).padStart(2, "0")}</span>
            </span>
          </div>
          <div className="flex gap-2">
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`pointer-events-auto h-1.5 rounded-full transition-all duration-300 ${
                  activeIdx === i ? "w-8 bg-amber-400" : "w-1.5 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-30 px-10 py-6">
          <div className="mb-3 flex items-center gap-3 text-[0.6rem] font-medium uppercase tracking-[0.28em] text-white/45">
            <span>Scroll · horizontal</span>
            <span className="h-px flex-1 bg-white/10" />
            <span>Recent work</span>
          </div>
          <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="absolute inset-0 origin-left bg-gradient-to-r from-amber-400 to-yellow-300 transition-transform duration-300"
              style={{ transform: `scaleX(${(activeIdx + 1) / projects.length})` }}
            />
          </div>
        </div>

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          className="flex h-screen snap-x snap-mandatory overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {projects.map((p, i) => (
            <article
              key={p.name}
              className="relative flex h-screen w-screen shrink-0 snap-start items-center overflow-hidden bg-black"
            >
              <div className="relative z-10 grid h-full w-full grid-cols-12 items-center gap-12 px-20 py-24">
                <div className="col-span-5 flex flex-col gap-7">
                  <span className="block text-[0.65rem] font-medium uppercase tracking-[0.32em] text-white/55">
                    Project {String(i + 1).padStart(2, "0")} · &apos;{p.year}
                  </span>
                  <h3 className="font-sans text-[clamp(3rem,5.6vw,5rem)] font-medium leading-[0.92] tracking-[-0.045em] bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                    {p.name}
                  </h3>
                  <div className="h-px w-full bg-white/10" />
                  <div className="flex items-baseline justify-between gap-6">
                    <div>
                      <span className="block text-[0.65rem] uppercase tracking-[0.28em] text-white/50">{p.type}</span>
                      <span className="mt-1 block text-[0.95rem] text-white/70">{p.city}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[0.6rem] uppercase tracking-[0.28em] text-white/50">Contract value</span>
                      <span className="mt-1 block font-sans text-[clamp(1.8rem,2.4vw,2.2rem)] font-medium leading-none tracking-[-0.025em] bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                        {fmt(p.value)}
                      </span>
                    </div>
                  </div>
                  <p className="text-[0.98rem] font-light leading-[1.65] text-white/65">{p.desc}</p>
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.24em] text-white/75">
                    <span className="h-1 w-1 rounded-full bg-amber-400" />
                    {p.detail}
                  </span>
                </div>

                <div className="col-span-7">
                  <div className="relative mx-auto aspect-[4/5] max-h-[78vh] w-full overflow-hidden rounded-[1.5rem] border border-white/10">
                    <Image src={p.img} alt={p.name} fill className="object-cover" sizes="55vw" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/55 via-transparent to-transparent" />
                    <div className="absolute right-5 top-5 flex flex-col items-end gap-1 text-[0.6rem] font-medium uppercase tracking-[0.28em] text-white/85">
                      <span className="rounded-full border border-white/15 bg-black/45 px-2.5 py-1 backdrop-blur-md">Completed</span>
                      <span className="mt-1 text-white/55">{p.city} · &apos;{p.year}</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Mobile vertical fallback */}
      <div className="block px-6 pb-8 md:hidden">
        <div className="flex flex-col gap-6">
          {projects.map((p, i) => (
            <article key={p.name} className="overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.03]">
              <div className="relative aspect-[4/3] w-full">
                <Image src={p.img} alt={p.name} fill className="object-cover" sizes="100vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[0.6rem] uppercase tracking-[0.28em] text-white/60">
                    {String(i + 1).padStart(2, "0")} · {p.type} · {p.city}
                  </span>
                  <h3 className="mt-1 font-sans text-[2rem] font-medium leading-none tracking-[-0.03em] text-white">
                    {p.name}
                  </h3>
                </div>
              </div>
              <div className="p-5">
                <div className="mb-3 flex items-baseline justify-between">
                  <span className="text-[0.6rem] uppercase tracking-[0.24em] text-white/45">Contract value</span>
                  <span className="font-sans text-[1.4rem] font-medium tracking-[-0.02em] bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                    {fmt(p.value)}
                  </span>
                </div>
                <p className="text-[0.9rem] font-light leading-[1.6] text-white/65">{p.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Marquee */}
      <div className="relative overflow-hidden px-6 py-20 md:px-10">
        <p className="mb-8 text-center text-[0.62rem] font-medium uppercase tracking-[0.32em] text-white/45">
          Sectors we build in
        </p>
        <div className="relative overflow-hidden">
          <div className="flex w-max animate-marquee gap-16 whitespace-nowrap">
            {marqueeItems.map((b, i) => (
              <span key={i} className="font-sans text-[clamp(1.6rem,2.6vw,2.4rem)] font-medium tracking-[-0.03em] text-white/25 transition-colors hover:text-white">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProjectsSection;
