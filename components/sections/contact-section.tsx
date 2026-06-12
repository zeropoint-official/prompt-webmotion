"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const projectTypes = ["Residential", "Commercial", "Renovation", "Civil / Groundworks", "Not sure yet"];

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState(projectTypes[0]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1100);
  };

  const fieldClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white placeholder:text-white/30 transition focus:border-white/40 focus:bg-white/[0.06] focus:outline-none";

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden bg-neutral-950 px-6 pt-32 text-white md:px-10 md:pt-48"
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -left-40 top-10 h-[600px] w-[600px] rounded-full bg-amber-500/10 blur-[120px]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-16 lg:grid-cols-12">
        {/* Left: pitch */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="lg:col-span-6"
        >
          <h2 className="font-sans text-[clamp(2.6rem,5.6vw,4.8rem)] font-medium leading-[0.98] tracking-[-0.045em]">
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Tell us about</span>
            <br />
            <span className="text-white/40">the </span>
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">project.</span>
          </h2>

          <p className="mt-7 max-w-[52ch] text-[clamp(1rem,1.1vw,1.1rem)] font-light leading-[1.65] text-white/65">
            Send us the basics and we&apos;ll come back within one working day to book a site visit. No obligation, no hard sell — just a straight conversation about what you want to build and what it&apos;ll take.
          </p>

          <ul className="mt-10 space-y-3 text-[0.95rem] font-light text-white/65">
            {["Reply within one working day", "Free site visit & feasibility chat", "Fixed quotation before any work starts"].map((line) => (
              <li key={line} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600" />
                {line}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-1">
            <a href="tel:+302100000000" className="font-sans text-[clamp(1.6rem,2.4vw,2.2rem)] font-medium tracking-[-0.03em] bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              +30 21 0000 0000
            </a>
            <a href="mailto:office@efstathiou.build" className="text-[0.95rem] text-white/55 underline-offset-4 hover:underline">
              office@efstathiou.build
            </a>
          </div>
        </motion.div>

        {/* Right: form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.15, ease: "easeOut" }}
          className="lg:col-span-6"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-2xl backdrop-blur-sm md:p-10">
            {/* Decorative amber ring */}
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-amber-400/20"
              aria-hidden
            />

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-8 flex items-center justify-between">
                    <span className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-white/55">
                      Request a quote
                    </span>
                    <span className="text-[0.65rem] uppercase tracking-[0.2em] text-white/45">Step 1 of 1</span>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-[0.62rem] uppercase tracking-[0.24em] text-white/55">Name</span>
                      <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={fieldClass} />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-[0.62rem] uppercase tracking-[0.24em] text-white/55">Phone</span>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Optional" className={fieldClass} />
                    </label>
                  </div>

                  <label className="mt-5 block">
                    <span className="mb-2 block text-[0.62rem] uppercase tracking-[0.24em] text-white/55">Email</span>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className={fieldClass} />
                  </label>

                  <label className="mt-5 block">
                    <span className="mb-2 block text-[0.62rem] uppercase tracking-[0.24em] text-white/55">Project type</span>
                    <select value={type} onChange={(e) => setType(e.target.value)} className={`${fieldClass} appearance-none`}>
                      {projectTypes.map((t) => (
                        <option key={t} value={t} className="bg-neutral-950 text-white">{t}</option>
                      ))}
                    </select>
                  </label>

                  <label className="mt-5 block">
                    <span className="mb-2 block text-[0.62rem] uppercase tracking-[0.24em] text-white/55">Tell us more</span>
                    <textarea required value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Location, rough scope, timeframe…" className={`${fieldClass} resize-none`} />
                  </label>

                  <div className="my-8 h-px w-full bg-white/10" />

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-4 font-medium tracking-[-0.01em] text-neutral-950 transition hover:bg-neutral-100 disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-3">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-400 border-t-neutral-900" />
                        Sending
                      </span>
                    ) : (
                      <>Send enquiry <span className="text-lg">→</span></>
                    )}
                  </button>

                  <p className="mt-5 text-center text-[0.7rem] uppercase tracking-[0.14em] text-white/40">
                    Wire to your inbox or CRM in production
                  </p>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="py-10 text-center"
                >
                  <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full border border-white/15 bg-white/5">
                    <svg viewBox="0 0 24 24" className="h-6 w-6 text-white">
                      <path d="M5 12l4 4L19 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="font-sans text-[1.6rem] font-medium leading-[1.1] tracking-[-0.025em] bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                    Got it, {name || "thanks"}.
                  </h3>
                  <p className="mx-auto mt-3 max-w-[34ch] text-[0.95rem] font-light leading-[1.6] text-white/65">
                    We&apos;ll be in touch within one working day to arrange a site visit.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mx-auto mt-28 max-w-[1400px] border-t border-white/10 pb-12 pt-12 md:mt-40">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-[28ch]">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="font-sans text-[1.1rem] font-semibold tracking-[-0.02em] text-white">
                Efstathiou Constructions
              </span>
            </div>
            <p className="mt-4 text-[0.9rem] font-light leading-[1.6] text-white/50">
              Residential, commercial and civil construction across Attica and the islands. From foundation to finished, since 1998.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <div>
              <span className="block text-[0.62rem] uppercase tracking-[0.24em] text-white/40">Explore</span>
              <ul className="mt-4 space-y-2.5 text-[0.9rem] text-white/65">
                {["Process", "Services", "Projects", "FAQ"].map((item) => (
                  <li key={item}><a href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <span className="block text-[0.62rem] uppercase tracking-[0.24em] text-white/40">Contact</span>
              <ul className="mt-4 space-y-2.5 text-[0.9rem] text-white/65">
                <li><a href="tel:+302100000000" className="hover:text-white">+30 21 0000 0000</a></li>
                <li><a href="mailto:office@efstathiou.build" className="hover:text-white">office@efstathiou.build</a></li>
                <li className="text-white/50">Athens, Greece</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-[0.7rem] uppercase tracking-[0.22em] text-white/40 md:flex-row">
          <span>© {new Date().getFullYear()} Efstathiou Constructions</span>
          <span>Licensed &amp; insured · Reg. 0000000</span>
        </div>
      </footer>
    </section>
  );
}

export default ContactSection;
