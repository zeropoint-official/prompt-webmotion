"use client";

/* Live preview of the Maré template's scroll-scrubbed canvas hero (Website
   Templates). Faithful port of the template's ScrollVideoHero: it preloads all
   145 frames, then paints the frame matching scroll progress on every animation
   tick. The only changes from the shipped component are environment ones — the
   frames are served from /frames/mare-hero (exported here from the source
   video) and the Lenis frame callback is swapped for a native rAF loop, since
   the preview iframe scrolls natively. */

import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 145;
const framePath = (i: number) =>
  `/frames/mare-hero/frame-${String(i).padStart(4, "0")}.jpg`;

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/** Maps a value in [a,b] to [0,1], clamped. */
const range = (v: number, a: number, b: number) => clamp((v - a) / (b - a));

export default function MareHeroDemo() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrame = useRef(-1);
  const updateRef = useRef<() => void>(() => {});

  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);

  // Preload every frame.
  useEffect(() => {
    let count = 0;
    const imgs: HTMLImageElement[] = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(i);
      const onDone = () => {
        count += 1;
        setLoaded(count);
        if (count === FRAME_COUNT) setReady(true);
      };
      img.onload = onDone;
      img.onerror = onDone;
      imgs[i - 1] = img;
    }
    imagesRef.current = imgs;
  }, []);

  // Canvas drawing wiring.
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawCover = (img: HTMLImageElement) => {
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (!img.complete || img.naturalWidth === 0) return;
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = cw / ch;
      let dw: number, dh: number, dx: number, dy: number;
      if (cr > ir) {
        dw = cw;
        dh = cw / ir;
        dx = 0;
        dy = (ch - dh) / 2;
      } else {
        dh = ch;
        dw = ch * ir;
        dy = 0;
        dx = (cw - dw) / 2;
      }
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    const update = () => {
      const rect = section.getBoundingClientRect();
      const distance = section.offsetHeight - window.innerHeight;
      const progress = clamp(-rect.top / distance);

      // Scrubbed frame — forward as you scroll down, reverse as you scroll up.
      const frame = Math.min(
        FRAME_COUNT - 1,
        Math.round(progress * (FRAME_COUNT - 1)),
      );
      if (frame !== currentFrame.current) {
        currentFrame.current = frame;
        const img = imagesRef.current[frame];
        if (img) drawCover(img);
      }

      // Drive overlay copy directly off the scroll position.
      const intro = introRef.current;
      const outro = outroRef.current;
      const cue = cueRef.current;
      if (intro) {
        const o = 1 - range(progress, 0.04, 0.2);
        intro.style.opacity = String(o);
        intro.style.transform = `translateY(${(1 - o) * -32}px)`;
      }
      if (outro) {
        const o = range(progress, 0.72, 0.92);
        outro.style.opacity = String(o);
        outro.style.transform = `translateY(${(1 - o) * 32}px)`;
      }
      if (cue) {
        cue.style.opacity = String(1 - range(progress, 0, 0.08));
      }
    };

    updateRef.current = update;

    const onResize = () => {
      sizeCanvas();
      currentFrame.current = -1; // force redraw
      update();
    };

    sizeCanvas();
    currentFrame.current = -1; // force first paint even at progress 0
    update();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [ready]);

  // Native rAF ticker drives the scrub (the template uses the Lenis frame
  // callback; the preview iframe scrolls natively).
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      updateRef.current();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Paint the first frame behind the loader as soon as it is available.
  useEffect(() => {
    if (loaded < 1) return;
    updateRef.current();
  }, [loaded]);

  const pct = Math.round((loaded / FRAME_COUNT) * 100);

  return (
    <section ref={sectionRef} className="relative h-[420vh] bg-ink">
      {/* Pinned stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden grain">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* Cinematic scrims — stronger top/bottom + center vignette for contrast */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/15 to-ink/80" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 50%, rgba(6,7,8,0) 42%, rgba(6,7,8,0.55) 100%)",
          }}
        />

        {/* Intro title — start of scroll */}
        <div
          ref={introRef}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center will-change-transform"
        >
          <span className="eyebrow text-accent">The Florida Collection</span>
          <h1 className="text-legible mt-7 font-editorial text-[clamp(2.8rem,8.5vw,8rem)] font-light leading-[0.92] tracking-[-0.025em] text-paper">
            Coastal living,
            <br />
            <em className="italic">perfected.</em>
          </h1>
          <p className="text-legible mt-8 max-w-md text-[0.95rem] font-light leading-relaxed tracking-wide text-paper/90">
            A privately curated portfolio of Florida&rsquo;s rarest waterfront
            residences.
          </p>
        </div>

        {/* Outro title — end of scroll */}
        <div
          ref={outroRef}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center opacity-0 will-change-transform"
        >
          <span className="eyebrow text-accent">Private Representation</span>
          <h2 className="text-legible mt-7 font-editorial text-[clamp(2.8rem,8.5vw,8rem)] font-light leading-[0.92] tracking-[-0.025em] text-paper">
            Your coast
            <br />
            <em className="italic">awaits.</em>
          </h2>
          <span className="group mt-10 flex items-center gap-4 text-[0.7rem] font-medium uppercase tracking-[0.36em] text-paper">
            <span className="h-px w-10 bg-accent transition-all duration-500 group-hover:w-16" />
            Arrange a Private Viewing
            <span className="h-px w-10 bg-accent transition-all duration-500 group-hover:w-16" />
          </span>
        </div>

        {/* Scroll cue */}
        <div
          ref={cueRef}
          className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-3"
        >
          <span className="text-[0.6rem] font-medium uppercase tracking-[0.4em] text-paper-dim">
            Scroll
          </span>
          <span className="relative h-12 w-px overflow-hidden bg-paper/20">
            <span className="absolute left-0 top-0 h-1/2 w-full animate-[mare-cue_2.2s_ease-in-out_infinite] bg-accent" />
          </span>
        </div>

        {/* Loading veil */}
        <div
          className={`absolute inset-0 z-40 flex items-center justify-center bg-ink transition-opacity duration-1000 ${
            ready ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <div className="flex flex-col items-center">
            <span className="text-5xl font-semibold tracking-[-0.02em] text-paper">
              MARÉ
            </span>
            <span className="mt-6 text-[0.6rem] font-medium uppercase tracking-[0.45em] text-paper-dim">
              Preparing the Estate · {pct}%
            </span>
            <span className="mt-4 block h-px w-40 overflow-hidden bg-paper/15">
              <span
                className="block h-full bg-accent transition-[width] duration-300"
                style={{ width: `${pct}%` }}
              />
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes mare-cue {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </section>
  );
}
