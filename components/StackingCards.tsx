"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type StackingItem = {
  slug: string;
  /** Short type label shown as a pill, e.g. "Villa" / "Project" / "Service" */
  label: string;
  name: string;
  subtitle: string;
  /** Tag shown next to the hairline, e.g. location / cuisine / department */
  tag: string;
  metricA: { label: string; value: string };
  metricB: { label: string; value: string };
  metricC: { label: string; value: string };
  price: string;
  cover: string;
};

type StackingCardsProps = {
  items: StackingItem[];
  /** Base href for card links, e.g. "/projects" → links to /projects/[slug] */
  basePath: string;
  /** CTA label at the bottom-right of each card, default "View →" */
  ctaLabel?: string;
};

function Card({
  item,
  i,
  reverse,
  basePath,
  ctaLabel,
}: {
  item: StackingItem;
  i: number;
  reverse: boolean;
  basePath: string;
  ctaLabel: string;
}) {
  return (
    <div className="w-full max-w-[1700px] mx-auto px-5 md:px-12">
      <Link href={`${basePath}/${item.slug}`} className="group block relative">
        {/* Ghost index number — back plane */}
        <span
          className={`pointer-events-none select-none absolute font-light leading-none tracking-[-0.06em] transition-colors duration-700 ${
            reverse ? "right-0 -top-10 md:-top-16" : "left-0 -top-10 md:-top-16"
          }`}
          style={{
            fontFamily: "var(--font-display, serif)",
            fontSize: "clamp(18vw, 22vw, 22vw)",
            color: "var(--color-accent, #d4b46a)",
            opacity: 0.05,
          }}
        >
          {String(i + 1).padStart(2, "0")}
        </span>

        <div
          className={`relative grid grid-cols-12 gap-4 md:gap-14 items-end ${
            reverse ? "md:[direction:rtl]" : ""
          }`}
        >
          {/* Image column */}
          <div
            className={`col-span-12 md:col-span-8 relative ${
              reverse ? "md:[direction:ltr]" : ""
            }`}
          >
            <div className="relative p-1.5 md:p-3 border border-white/[0.06]">
              {/* Corner accent marks */}
              <span
                className="absolute top-0 right-0 w-6 h-6 border-r border-t"
                style={{ borderColor: "var(--color-accent, #d4b46a)", opacity: 0.4 }}
              />
              <span
                className="absolute bottom-0 left-0 w-6 h-6 border-l border-b"
                style={{ borderColor: "var(--color-accent, #d4b46a)", opacity: 0.4 }}
              />

              <div className="relative aspect-[16/10] md:aspect-[5/3] overflow-hidden"
                style={{ background: "var(--color-bg-soft, #1a1510)" }}>
                <Image
                  src={item.cover}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover transition-transform duration-[1800ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.04]"
                  priority={i < 2}
                />
                {/* Bottom-up scrim */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.05) 40%, transparent 60%)",
                  }}
                />
                {/* Hover accent glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background:
                      "radial-gradient(600px 400px at 50% 50%, rgba(212,180,106,0.10), transparent 60%)",
                  }}
                />
                {/* Type pill */}
                <div className="absolute top-5 left-5">
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "0.62rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.32em",
                      color: "var(--color-text, #e8e0d0)",
                      background: "rgba(0,0,0,0.25)",
                      backdropFilter: "blur(6px)",
                      padding: "0.375rem 0.75rem",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Meta column */}
          <div
            className={`col-span-12 md:col-span-4 space-y-4 md:space-y-7 ${
              reverse ? "md:[direction:ltr]" : ""
            }`}
          >
            {/* Tag line with hairline */}
            <div className="flex items-center gap-3">
              <span
                className="h-px flex-1"
                style={{
                  background:
                    "linear-gradient(to right, var(--color-accent, #d4b46a), transparent)",
                }}
              />
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.6rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.35em",
                  color: "var(--color-accent, #d4b46a)",
                }}
              >
                {item.tag}
              </span>
            </div>

            {/* Name + subtitle */}
            <div>
              <h3
                className="font-light leading-[0.95] tracking-[-0.045em] transition-colors duration-700"
                style={{
                  fontFamily: "var(--font-display, serif)",
                  fontSize: "clamp(2rem, 4.6vw, 4.6vw)",
                  color: "var(--color-text, #e8e0d0)",
                }}
              >
                {item.name}
              </h3>
              <p
                className="mt-2.5 md:mt-5 leading-[1.5] font-light line-clamp-2 md:line-clamp-none"
                style={{
                  fontFamily: "var(--font-body, sans-serif)",
                  fontSize: "clamp(0.9rem, 1.05vw, 1.05rem)",
                  color: "var(--color-text, #e8e0d0)",
                  opacity: 0.55,
                  maxWidth: "28rem",
                }}
              >
                {item.subtitle}
              </p>
            </div>

            {/* Three metrics */}
            <div
              className="grid grid-cols-3 gap-2 py-3 md:py-5"
              style={{ borderTop: "1px solid var(--color-line, rgba(255,255,255,0.1))", borderBottom: "1px solid var(--color-line, rgba(255,255,255,0.1))" }}
            >
              {[item.metricA, item.metricB, item.metricC].map((m) => (
                <div key={m.label}>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "0.55rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.22em",
                      color: "var(--color-text, #e8e0d0)",
                      opacity: 0.4,
                    }}
                  >
                    {m.label}
                  </div>
                  <div
                    className="mt-1 font-light tracking-[-0.01em]"
                    style={{
                      fontFamily: "var(--font-display, serif)",
                      fontSize: "clamp(0.9rem, 1.1vw, 1.1rem)",
                      color: "var(--color-text, #e8e0d0)",
                    }}
                  >
                    {m.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Price + CTA */}
            <div className="flex items-end justify-between pt-1 md:pt-2">
              <div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.55rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.22em",
                    color: "var(--color-text, #e8e0d0)",
                    opacity: 0.4,
                    marginBottom: "0.25rem",
                  }}
                >
                  Guide price
                </div>
                <div
                  className="font-light tracking-[-0.02em]"
                  style={{
                    fontFamily: "var(--font-display, serif)",
                    fontSize: "clamp(1.25rem, 1.75vw, 1.75rem)",
                    color: "var(--color-accent, #d4b46a)",
                  }}
                >
                  {item.price}
                </div>
              </div>
              <span
                className="transition-[color,letter-spacing] duration-500 group-hover:tracking-[0.26em]"
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.64rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.22em",
                  color: "var(--color-text, #e8e0d0)",
                  opacity: 0.6,
                }}
              >
                {ctaLabel}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function StackingCards({
  items,
  basePath,
  ctaLabel = "View →",
}: StackingCardsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    const mm = gsap.matchMedia();

    // Desktop only — pinning + scrub on touch is the #1 source of scroll jank.
    mm.add("(min-width: 768px)", () => {
      const ctx = gsap.context(() => {
        const panels = gsap.utils.toArray<HTMLElement>(".stacking-panel", container);
        if (panels.length < 2) return;

        panels.forEach((panel, i) => {
          if (i === 0) return;

          // Start each panel a full viewport below
          gsap.set(panel, { yPercent: 100 });

          // Each panel slides up over exactly one viewport of scroll
          ScrollTrigger.create({
            trigger: section,
            start: () => `top+=${i * window.innerHeight} top`,
            end: () => `top+=${(i + 1) * window.innerHeight} top`,
            scrub: true,
            animation: gsap.to(panel, { yPercent: 0, ease: "none" }),
          });
        });

        // Pin the section for N viewports total
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => `+=${panels.length * window.innerHeight}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true, // recalculates on resize — critical for Safari
        });
      }, section);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative">
      <div
        ref={containerRef}
        className="relative md:h-[100dvh] w-full md:overflow-hidden"
      >
        {items.map((item, i) => {
          const reverse = i % 2 === 1;
          return (
            <div
              key={item.slug}
              className="stacking-panel relative md:absolute md:inset-0 md:h-[100dvh] w-full md:overflow-hidden flex flex-col justify-center py-16 md:py-0"
              style={{
                background: "var(--color-bg, #0f0b06)",
                zIndex: i + 1, // later panels stack above earlier ones
              }}
            >
              <Card
                item={item}
                i={i}
                reverse={reverse}
                basePath={basePath}
                ctaLabel={ctaLabel}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
