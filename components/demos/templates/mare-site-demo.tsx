"use client";

/* Live preview of the FULL Maré template assembled as one website (Website
   Templates). It stacks the template's signature sections into a single
   continuous scroll — fixed header → scroll-video hero → pinned services
   carousel → horizontal featured residences — so the preview reads as the real
   multi-page site rather than isolated sections. Each section keeps its own
   scroll wiring (it measures its own position), so they compose cleanly. */

import { useEffect, useState } from "react";
import MareHeroDemo from "./mare-hero-demo";
import MareServicesDemo from "./mare-services-demo";
import MareResidencesDemo from "./mare-residences-demo";

const ACCENT = "#138a7d";

const NAV = ["Residences", "Services", "About"];

function MareHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
        scrolled || openMenu
          ? "bg-ink/70 py-4 backdrop-blur-md"
          : "bg-transparent py-7"
      }`}
    >
      {/* top hairline */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-paper/25 to-transparent" />

      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 sm:px-10">
        {/* Wordmark */}
        <a href="#" className="group flex flex-col leading-none">
          <span className="text-2xl font-semibold tracking-[-0.01em] text-paper">
            MARÉ
          </span>
          <span
            className="mt-1 text-[0.55rem] font-medium uppercase tracking-[0.5em]"
            style={{ color: ACCENT }}
          >
            Florida Estates
          </span>
        </a>

        {/* Center nav */}
        <nav className="hidden items-center gap-10 md:flex">
          {NAV.map((label, i) => (
            <a
              key={label}
              href="#"
              className={`group relative text-[0.7rem] font-medium uppercase tracking-[0.32em] transition-colors ${
                i === 0 ? "text-paper" : "text-paper-dim hover:text-paper"
              }`}
            >
              {label}
              <span
                className="absolute -bottom-1.5 left-0 h-px transition-all duration-500"
                style={{
                  backgroundColor: ACCENT,
                  width: i === 0 ? "100%" : 0,
                }}
              />
            </a>
          ))}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="group hidden items-center gap-3 text-[0.7rem] font-medium uppercase tracking-[0.32em] text-paper sm:flex"
          >
            <span
              className="h-1.5 w-1.5 rounded-full transition-transform duration-500 group-hover:scale-150"
              style={{ backgroundColor: ACCENT }}
            />
            Inquire
          </a>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={openMenu}
            onClick={() => setOpenMenu((v) => !v)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <span
              className={`h-px w-5 bg-paper transition-all duration-300 ${
                openMenu ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-5 bg-paper transition-all duration-300 ${
                openMenu ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-px w-5 bg-paper transition-all duration-300 ${
                openMenu ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden transition-all duration-500 md:hidden ${
          openMenu ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-auto flex max-w-[1400px] flex-col gap-1 px-6 pb-6 pt-8 sm:px-10">
          {[...NAV, "Contact"].map((label, i) => (
            <a
              key={label}
              href="#"
              onClick={() => setOpenMenu(false)}
              className={`flex items-center justify-between border-b border-paper/10 py-4 text-[0.8rem] font-medium uppercase tracking-[0.28em] transition-colors ${
                i === 0 ? "text-paper" : "text-paper-dim"
              }`}
            >
              {label}
              <span
                className="h-1 w-1 rounded-full"
                style={{
                  backgroundColor: i === 0 ? ACCENT : "transparent",
                }}
              />
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default function MareSiteDemo() {
  return (
    <main className="bg-ink text-paper">
      <MareHeader />
      <MareHeroDemo />
      <MareServicesDemo />
      <MareResidencesDemo />
    </main>
  );
}
