"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "Do you handle planning permission and building control?",
    a: "Yes. We manage the full approvals process — drawings, planning applications, building-control sign-off and the relevant certifications. You get one point of contact rather than chasing architects, engineers and inspectors separately.",
  },
  {
    q: "Will you give me a fixed price?",
    a: "Once the scope and drawings are settled, we issue a fixed, line-by-line quotation. Variations only happen if you change the brief or the ground throws up something genuinely unforeseen — and either way you approve the cost before we proceed.",
  },
  {
    q: "How long does a typical build take?",
    a: "A single home extension might run 8–12 weeks; a new house 6–10 months; a phased commercial project a year or more. After the site survey we give you a programme with dated milestones, and we report against it every week.",
  },
  {
    q: "Do you use your own crews or subcontractors?",
    a: "Our core trades — groundworks, concrete, carpentry and site management — are in-house. Specialist trades (M&E, glazing, lifts) are long-standing partners we've worked with for years. Everyone works to one programme under our site manager.",
  },
  {
    q: "What areas do you cover?",
    a: "We're based in Athens and take on projects across Attica and the islands. For larger commercial and civil contracts we mobilise nationally. If you're unsure whether your site is in range, just ask.",
  },
  {
    q: "Is there a warranty after handover?",
    a: "Every project is handed over with certification, as-built drawings and a documented structural warranty. We also run a defects-and-aftercare period — if something needs us back, you call one number and we come.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative w-full overflow-hidden bg-neutral-950 px-6 py-28 text-white md:px-10 md:py-40">
      <div className="relative z-10 mx-auto grid max-w-[1200px] grid-cols-1 gap-16 lg:grid-cols-12">
        {/* Left heading */}
        <div className="lg:col-span-4">
          <h2 className="font-sans text-[clamp(2.2rem,4.4vw,3.8rem)] font-medium leading-[1] tracking-[-0.04em]">
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Before you</span>
            <br />
            <span className="text-white/40">ask, we&apos;ve </span>
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">answered.</span>
          </h2>

          <p className="mt-6 max-w-[40ch] text-[0.95rem] font-light leading-[1.65] text-white/55">
            Still not sure? Call the office on{" "}
            <a href="tel:+302100000000" className="text-white/85 underline-offset-4 hover:underline">
              +30 21 0000 0000
            </a>{" "}
            or email{" "}
            <a href="mailto:office@efstathiou.build" className="text-white/85 underline-offset-4 hover:underline">
              office@efstathiou.build
            </a>
            .
          </p>
        </div>

        {/* Right accordion */}
        <div className="lg:col-span-8">
          <ul className="flex flex-col">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={f.q} className="border-t border-white/10 last:border-b">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-start justify-between gap-6 py-6 text-left md:py-7"
                    aria-expanded={isOpen}
                  >
                    <span className="font-sans text-[clamp(1.1rem,1.4vw,1.35rem)] font-medium leading-[1.3] tracking-[-0.02em] bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                      {f.q}
                    </span>
                    <span
                      className={`mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 backdrop-blur-sm transition-transform duration-500 ${
                        isOpen ? "rotate-45" : "group-hover:scale-105"
                      }`}
                      aria-hidden
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-[64ch] pb-7 pr-12 text-[0.98rem] font-light leading-[1.7] text-white/65">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
