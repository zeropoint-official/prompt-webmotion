"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ── Types ── */

export interface StackProject {
  id: string;
  year: string;
  title: string;
  href: string;
  image: string;
  description?: string;
  tags?: string[];
  tech?: string[];
  linkLabel?: string;
}

interface ParallaxStackingProjectsProps {
  projects: StackProject[];
  theme?: "dark" | "light";
}

/* giats.me projects treatment — a solid dark fill behind each card's image. On
   giats this dark layer is a site-wide WebGL fluid shader; here a solid fill keeps
   the frosted veil (and the rounded corners) reading dark, and the light card copy
   legible, on either theme. */
const GIATS_BG = "#0a0a0a";

/* ── Theme tokens — only the surrounding surface differs by theme; the cards are
   always dark-backed (GIATS_BG) with light copy. ── */

const THEMES = {
  dark: { pageBg: "#000", frame: "#000" },
  light: { pageBg: "#f4f3ee", frame: "#f4f3ee" },
} as const;

/* ── Component ── */

export default function ParallaxStackingProjects({
  projects,
  theme = "dark",
}: ParallaxStackingProjectsProps) {
  const t = THEMES[theme];
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth < 768);
      setWindowHeight(window.innerHeight);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Setup GSAP animations — matching giats.me exactly
  useEffect(() => {
    if (typeof window === "undefined" || !windowHeight) return;

    const root = rootRef.current;
    if (!root) return;

    const cardHeight = isMobile ? windowHeight * 0.5 : windowHeight;

    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Animate each canvas EXCEPT the last one (slice 0 to -1)
        canvasRefs.current.slice(0, -1).forEach((canvas, index) => {
          if (!canvas) return;

          gsap.set(canvas, { yPercent: 0 });

          gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: `top+=${cardHeight * index}`,
              end: `+=${cardHeight * (projects.length - 1)}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          }).to(canvas, {
            yPercent: 100,
            ease: "none",
          });
        });
      }, root);

      return () => ctx.revert();
    }, 200);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [windowHeight, isMobile, projects.length]);

  // Calculate projectsWrap height — giats.me formula
  const getProjectsWrapHeight = (index: number): string => {
    if (isMobile) {
      return index === projects.length - 1
        ? "100svh"
        : `${100 + 50 * index}svh`;
    }
    return index === projects.length - 1
      ? "200svh"
      : `${200 + 100 * index}svh`;
  };

  // Calculate projectsWrap top position
  const getProjectsWrapTop = (index: number): string => {
    if (isMobile) {
      if (index === projects.length - 1) return "-50svh";
      return index === 0 ? "0px" : "-50svh";
    }
    return index === 0 ? "0px" : "-100svh";
  };

  const padIndex = (i: number) => String(i + 1).padStart(2, "0");

  // Round only the outer corners of the whole stack: top corners on the first
  // background image, bottom corners on the last. Applied to both the image and
  // the glass veil so they round together.
  const cornerRadius = (i: number) => {
    const r = isMobile ? "0.75rem" : "1.5rem";
    return {
      borderTopLeftRadius: i === 0 ? r : undefined,
      borderTopRightRadius: i === 0 ? r : undefined,
      borderBottomLeftRadius: i === projects.length - 1 ? r : undefined,
      borderBottomRightRadius: i === projects.length - 1 ? r : undefined,
    };
  };

  return (
    <section
      ref={rootRef}
      style={{
        position: "relative",
        width: "100%",
        display: "block",
        backgroundColor: t.pageBg,
        paddingLeft: isMobile ? "1rem" : "clamp(1rem, 4vw, 5rem)",
        paddingRight: isMobile ? "1rem" : "clamp(1rem, 4vw, 5rem)",
        paddingTop: 0,
        paddingBottom: isMobile ? "2rem" : "clamp(48px, 8vh, 120px)",
        contain: "paint",
      }}
    >
      {/* Inner Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          display: "block",
          margin: "0 auto",
          borderRadius: isMobile ? "0.75rem" : "1.5rem",
          boxShadow: `0 0 0 ${isMobile ? "0.75rem" : "1.5rem"} ${t.frame}`,
        }}
      >
        {projects.map((project, index) => (
          <Link
            key={project.id}
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.title}`}
            className="proj-card"
            style={{
              display: "block",
              position: "relative",
              width: "100%",
              height: isMobile ? "50svh" : "100svh",
              padding: 0,
              cursor: "pointer",
              contain: "paint", // CRUCIAL — clips both canvas AND sticky content
              // Dark surface the image sits on at rest (giats has its fluid shader
              // here); the glass veil over the image provides the dimming, and this
              // dark backing is what keeps the frosted veil reading dark (not grey)
              // on both themes. Cards are square + gapless so the stack reads as one
              // continuous panel — only the first/last background image rounds its
              // outer corners.
              backgroundColor: GIATS_BG,
            }}
          >
            {/* ── Projects Wrap — the pinned copy, painted in front of the canvas ──
                This div is position: absolute and extends FAR beyond the card
                (via calculated height/top). The sticky child inside pins to the
                viewport while scrolling. Because the parent card has contain: paint,
                the sticky content is only VISIBLE within the card's bounds — creating
                the illusion that one front card swaps content as backgrounds change. */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                width: "100%",
                pointerEvents: "none",
                // no zIndex / willChange here — keeping this layer free of a
                // stacking context lets the title's mix-blend reach the canvas
                height: getProjectsWrapHeight(index),
                top: getProjectsWrapTop(index),
              }}
            >
              {/* Sticky Container — stays fixed while scrolling */}
              <div
                style={{
                  position: "sticky",
                  top: isMobile ? "25vh" : "0",
                  width: "100%",
                  height: isMobile ? "50svh" : "100svh",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {isMobile ? (
                  /* ── Mobile layout ── */
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {/* Watermark number */}
                    <div
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 16,
                        fontFamily: "var(--font-monument), sans-serif",
                        fontWeight: 800,
                        fontSize: 100,
                        lineHeight: 1,
                        color: "rgba(255,255,255,0.07)",
                        userSelect: "none",
                        pointerEvents: "none",
                      }}
                    >
                      {padIndex(index)}
                    </div>

                    {/* Front image */}
                    <div
                      style={{
                        position: "absolute",
                        width: "83%",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -55%)",
                        aspectRatio: "16/9",
                      }}
                    >
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        style={{
                          borderRadius: "0.5rem",
                          boxShadow: "0 4px 30px rgba(0,0,0,0.5)",
                        }}
                        sizes="83vw"
                      />
                    </div>

                    {/* Bottom label */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        paddingBottom: 24,
                        gap: 4,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-geist-mono), monospace",
                          fontSize: 10,
                          letterSpacing: "0.25em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.7)",
                        }}
                      >
                        {project.year}
                      </span>
                      <h3
                        style={{
                          fontFamily: "var(--font-monument), sans-serif",
                          fontWeight: 800,
                          fontSize: 18,
                          color: "#ffffff",
                          textAlign: "center",
                          margin: 0,
                          padding: "0 16px",
                        }}
                      >
                        {project.title}
                      </h3>
                    </div>
                  </div>
                ) : (
                  /* ── Desktop layout ── */
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      padding: "0 clamp(2rem, 8vw, 8rem)",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      alignItems: "center",
                      boxSizing: "border-box",
                    }}
                  >
                    {/* Left: title & meta */}
                    <div
                      className="proj-text-group"
                      style={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                      }}
                    >
                      {/* Watermark number */}
                      <div
                        style={{
                          position: "absolute",
                          top: "-3rem",
                          left: "-1rem",
                          fontFamily: "var(--font-monument), sans-serif",
                          fontWeight: 800,
                          fontSize: "clamp(150px, 18vw, 260px)",
                          lineHeight: 1,
                          /* white tones, legible on any background — theme colour
                             ignored here */
                          color: "rgba(255,255,255,0.07)",
                          userSelect: "none",
                          pointerEvents: "none",
                        }}
                      >
                        {padIndex(index)}
                      </div>

                      <span
                        style={{
                          fontFamily: "var(--font-geist-mono), monospace",
                          fontSize: 11,
                          letterSpacing: "0.3em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.7)",
                        }}
                      >
                        {project.year}
                      </span>

                      <h3
                        style={{
                          fontFamily: "var(--font-monument), sans-serif",
                          fontWeight: 800,
                          fontSize: "clamp(2rem, 5vw, 5rem)",
                          lineHeight: 0.9,
                          textTransform: "uppercase",
                          color: "#ffffff",
                          margin: 0,
                          mixBlendMode: "difference", // inverts against the photo behind it
                        }}
                      >
                        {project.title}
                      </h3>

                      {project.tags && project.tags.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            flexWrap: "wrap",
                            marginTop: 4,
                          }}
                        >
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              style={{
                                fontFamily:
                                  "var(--font-geist-mono), monospace",
                                fontSize: 10,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                padding: "4px 12px",
                                borderRadius: 999,
                                border: "1px solid rgba(255,255,255,0.3)",
                                color: "rgba(255,255,255,0.85)",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right: image preview */}
                    <div
                      style={{
                        position: "absolute",
                        right: "clamp(2rem, 8vw, 8rem)",
                        width: "48%",
                        aspectRatio: "1920/900",
                      }}
                    >
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        style={{
                          borderRadius: "0.75rem",
                          boxShadow: "0 8px 60px rgba(0,0,0,0.6)",
                        }}
                        sizes="50vw"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Canvas — background image that peels downward ── */}
            <div
              ref={(el) => {
                canvasRefs.current[index] = el;
              }}
              className="proj-canvas"
              style={{
                position: "absolute",
                inset: 0,
                zIndex: -1, // sit behind the pinned copy so the title can mix-blend against it
                willChange: "transform",
              }}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                style={cornerRadius(index)}
                sizes="100vw"
                priority={index < 2}
              />
              {/* Glassy dark veil — fades on hover (desktop); on touch there's no
                  hover so it simply stays, dimming the background image. */}
              <div
                className="proj-overlay"
                style={{ position: "absolute", inset: 0, ...cornerRadius(index) }}
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
