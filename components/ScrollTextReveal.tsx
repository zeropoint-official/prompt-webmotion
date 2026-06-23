"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

type ScrollTextRevealProps = {
  /** The paragraph that brightens word-by-word as it scrolls through view */
  text: string;
  /** Small uppercase label above the paragraph, e.g. "Our Philosophy" */
  eyebrow?: string;
  /** Dim opacity each word starts at (0–1) */
  dimOpacity?: number;
};

export default function ScrollTextReveal({
  text,
  eyebrow,
  dimOpacity = 0.15,
}: ScrollTextRevealProps) {
  const targetRef = useRef<HTMLParagraphElement>(null);

  // The reveal runs from when the paragraph's top hits 90% of the viewport
  // until it reaches 25% — a comfortable, readable scrub window.
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 0.9", "start 0.25"],
  });

  const words = text.split(" ");

  return (
    <section
      className="flex w-full justify-center px-6 py-[40vh]"
      style={{ background: "var(--color-bg, #0a0a0a)" }}
    >
      <div className="max-w-3xl">
        {eyebrow && (
          <p
            className="mb-8"
            style={{
              fontFamily: "monospace",
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.28em",
              color: "var(--color-accent, #d4b46a)",
            }}
          >
            {eyebrow}
          </p>
        )}

        <p
          ref={targetRef}
          className="flex flex-wrap text-2xl font-medium leading-snug md:text-4xl md:leading-snug"
          style={{
            fontFamily: "var(--font-display, inherit)",
            color: "var(--color-text, #f5f5f5)",
          }}
        >
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word
                key={i}
                progress={scrollYProgress}
                range={[start, end]}
                dimOpacity={dimOpacity}
              >
                {word}
              </Word>
            );
          })}
        </p>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
  dimOpacity,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  dimOpacity: number;
}) {
  const opacity = useTransform(progress, range, [dimOpacity, 1]);
  return (
    <span className="relative mr-[0.28em] mt-[0.18em]">
      {/* faint static ghost keeps the line readable before reveal */}
      <span style={{ opacity: dimOpacity }}>{children}</span>
      <motion.span className="absolute inset-0" style={{ opacity }}>
        {children}
      </motion.span>
    </span>
  );
}
