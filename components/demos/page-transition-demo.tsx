"use client";

import { useState } from "react";

/**
 * A self-contained visual of the Slide-Up Page Transition.
 *
 * The real effect uses the View Transitions API across real routes; that can't
 * run inside a single preview frame, so this reproduces the *look*: two stacked
 * "pages" in a mock viewport. Clicking the link slides the incoming page up and
 * scales it to full over the outgoing page — which stays frozen underneath —
 * using the exact duration and easing from the prompt.
 */

const DURATION = "1.1s";
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const SCALE_FROM = 0.9;

export default function PageTransitionDemo() {
  const [visited, setVisited] = useState(false);

  return (
    <div className="flex w-full flex-col items-center gap-5">
      {/* mock browser viewport */}
      <div className="relative aspect-[4/3] w-full max-w-md overflow-hidden rounded-xl border border-white/15 bg-black shadow-2xl">
        {/* PAGE A — the outgoing page, frozen underneath (z-1) */}
        <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-6 bg-[#f6f3ec] px-8 text-center text-[#36302a]">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-50">
            Home
          </span>
          <h3 className="text-2xl font-semibold leading-tight">
            Spaces that hold
            <br />
            their breath.
          </h3>
          <button
            type="button"
            onClick={() => setVisited(true)}
            className="rounded-sm bg-[#36302a] px-6 py-2.5 text-xs uppercase tracking-wide text-[#f6f3ec] transition-colors hover:bg-[#574c3f]"
          >
            Our Booths →
          </button>
        </div>

        {/* PAGE B — the incoming page, slides up + scales over A (z-2) */}
        <div
          className="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-6 bg-[#16130f] px-8 text-center text-[#f6f3ec]"
          style={{
            transformOrigin: "50% 0%",
            transform: visited
              ? "translateY(0) scale(1)"
              : `translateY(100%) scale(${SCALE_FROM})`,
            transition: `transform ${DURATION} ${EASE}`,
          }}
        >
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-50">
            Our Booths
          </span>
          <h3 className="text-2xl font-semibold leading-tight text-[#d4b46a]">
            The new page covers
            <br />
            the old one.
          </h3>
          <button
            type="button"
            onClick={() => setVisited(false)}
            className="rounded-sm border border-white/25 px-6 py-2.5 text-xs uppercase tracking-wide transition-colors hover:bg-white/10"
          >
            ← Back
          </button>
        </div>
      </div>

      <p className="font-mono text-[10px] tracking-[0.22em] text-white/40 uppercase">
        {visited ? "Click “Back” to reset" : "Click the button — watch it slide up"}
      </p>
    </div>
  );
}
