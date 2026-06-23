# Builder Prompt — "Maré · Florida Luxury Estates" (full site clone)

> Copy everything below the line into an AI builder (Claude Code, etc.) running in an **empty directory**. It rebuilds the entire multi-page site — every section, every page, the scroll-video hero, the smooth scrolling, and the exact copy — pixel-for-pixel.
>
> **The only thing you (the prompt author) must edit before publishing** is the single `ASSETS_BASE_URL` line in the *Asset hosting* block. Upload the original `public/hero-video.mp4` plus the `Service-Images/` and `new-images/` folders to any public host/CDN, then paste the base URL there. The receiving agent regenerates the 145 hero frames locally from the video with ffmpeg, so you only host **1 video + 17 images**, not 162 files.

---

You are given the task of building a complete, production-ready website from scratch in the current (empty) directory. Build it **exactly** as specified — do not redesign, restyle, simplify, or "improve" anything. Reproduce all file paths, class names, copy (including accented characters and HTML entities), and animation logic verbatim.

## Tech stack (pin these exactly)

- **Next.js 16.2.9** — App Router, TypeScript
- **React 19.2.4** / react-dom 19.2.4
- **Tailwind CSS v4** (CSS-first config via `@import "tailwindcss"` — **no `tailwind.config.js`**; theme tokens live in `app/globals.css` under `@theme inline`)
- **framer-motion** ^12.40.0 (section reveals, counters, crossfades)
- **lenis** ^1.3.23 (site-wide smooth scroll; drives the scroll-scrubbed hero and pinned sections via its frame callback)
- **lucide-react** ^1.21.0 (one icon: `Plus`)

This is **not** a shadcn project — there is no `components/ui`, no `lib/utils`, no `cn()`. All components live in `app/components/`. Do not introduce shadcn.

## Asset hosting

The 18 source assets are already hosted on a public Cloudflare R2 bucket. Use this base URL as-is:

```
ASSETS_BASE_URL = "https://pub-a48aee57c7854772ad65c69703d7a98e.r2.dev"
```

The following files are live under that base URL (sub-paths preserved):

```
{ASSETS_BASE_URL}/hero-video.mp4

{ASSETS_BASE_URL}/Service-Images/luxury-home-buying.png
{ASSETS_BASE_URL}/Service-Images/waterfront-properties.png
{ASSETS_BASE_URL}/Service-Images/selling-your-home.png
{ASSETS_BASE_URL}/Service-Images/investment-properties.png
{ASSETS_BASE_URL}/Service-Images/relocation-to-florida.png
{ASSETS_BASE_URL}/Service-Images/market-valuation.png
{ASSETS_BASE_URL}/Service-Images/new-developments.png

{ASSETS_BASE_URL}/new-images/waterfront-villa.png
{ASSETS_BASE_URL}/new-images/modern-villa.png
{ASSETS_BASE_URL}/new-images/estate-sunset.png
{ASSETS_BASE_URL}/new-images/grand-estate.png
{ASSETS_BASE_URL}/new-images/estate-courtyard.png
{ASSETS_BASE_URL}/new-images/estate-reflecting-pool.png
{ASSETS_BASE_URL}/new-images/aboutus.png
{ASSETS_BASE_URL}/new-images/gated-avenue.png
{ASSETS_BASE_URL}/new-images/community-aerial.png
{ASSETS_BASE_URL}/new-images/neighborhood-aerial.png
```

> These are public, static marketing assets — no auth or keys are needed to download them.

---

# BUILD STEPS

## Step 0 — Scaffold the project files

Create each file below with the **exact** contents.

### `package.json`

```json
{
  "name": "my-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "framer-motion": "^12.40.0",
    "lenis": "^1.3.23",
    "lucide-react": "^1.21.0",
    "next": "16.2.9",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.9",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

### `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

### `postcss.config.mjs`

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

### `eslint.config.mjs`

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
```

### `.gitignore`

```
/node_modules
/.next/
/out/
/build
.DS_Store
*.pem
.env*
/.vercel
*.tsbuildinfo
next-env.d.ts
```

---

## Step 1 — Global styles & root layout

### `app/globals.css`

```css
@import "tailwindcss";

:root {
  /* San Francisco on Apple devices, graceful neutral fallbacks elsewhere */
  --font-display: -apple-system, BlinkMacSystemFont, "SF Pro Display",
    "SF Pro Text", "Helvetica Neue", "Segoe UI", Roboto, Arial, sans-serif;

  /* Cool, deep near-black for maximum text contrast */
  --ink: #060708;
  --ink-soft: #14171a;
  /* Crisp, bright text */
  --paper: #fbfbf9;
  --paper-dim: #aeb4ba;
  /* Monochrome white accent */
  --accent: #ffffff;
  --accent-soft: #ffffff;
}

@theme inline {
  --color-ink: var(--ink);
  --color-ink-soft: var(--ink-soft);
  --color-paper: var(--paper);
  --color-paper-dim: var(--paper-dim);
  --color-accent: var(--accent);
  --color-accent-soft: var(--accent-soft);
  --font-display: var(--font-display);
  --font-sans: var(--font-display);
}

html {
  background: var(--ink);
  color: var(--paper);
  -webkit-font-smoothing: antialiased;
}

body {
  font-family: var(--font-display), "Helvetica Neue", Arial, sans-serif;
  font-weight: 300;
}

::selection {
  background: var(--accent);
  color: var(--ink);
}

.font-display {
  font-family: var(--font-display), "Helvetica Neue", Arial, sans-serif;
}

/* Editorial serif for hero headlines (Fraunces) */
.font-editorial {
  font-family: var(--font-serif), "Times New Roman", Georgia, serif;
  font-optical-sizing: auto;
}

/* Thin, letter-spaced eyebrow label */
.eyebrow {
  font-family: var(--font-display), sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.42em;
  font-weight: 500;
  font-size: 0.68rem;
}

/* Subtle shadow so bright text stays legible over any frame */
.text-legible {
  text-shadow: 0 2px 40px rgba(0, 0, 0, 0.55), 0 1px 8px rgba(0, 0, 0, 0.45);
}

/* Hide scrollbars on horizontal snap rails (mobile carousels) */
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}

/* Faint film grain for cinematic texture */
.grain::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.05;
  z-index: 30;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

### `app/layout.tsx`

```tsx
import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";

// Body/UI uses the native system stack (San Francisco on Apple devices) — see
// --font-display in globals.css. Display headlines use Fraunces, a modern
// high-contrast serif, exposed as --font-serif.
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maré · Florida Luxury Estates",
  description:
    "Curated waterfront and architectural estates across Florida's most coveted coastlines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${fraunces.variable}`}
    >
      <body className="min-h-full">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
```

---

## Step 2 — Pages

### `app/page.tsx` (Home)

```tsx
import Header from "./components/Header";
import ScrollVideoHero from "./components/ScrollVideoHero";
import ServicesScroll from "./components/ServicesScroll";
import FeaturedResidences from "./components/FeaturedResidences";
import ServicesSection from "./components/ServicesSection";
import AboutSection from "./components/AboutSection";
import Testimonials from "./components/Testimonials";
import HomeContact from "./components/HomeContact";
import SiteFooter from "./components/SiteFooter";

export default function Home() {
  return (
    <main className="bg-ink text-paper">
      <Header />

      <ScrollVideoHero />

      <ServicesScroll />

      <FeaturedResidences />

      <ServicesSection />

      <AboutSection />

      <Testimonials />

      <HomeContact />

      <SiteFooter />
    </main>
  );
}
```

### `app/about/page.tsx`

```tsx
import type { Metadata } from "next";
import Header from "../components/Header";
import PageHero from "../components/PageHero";
import TeamSection from "../components/TeamSection";
import AboutSection from "../components/AboutSection";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "About · Maré Florida Estates",
  description:
    "A family-run luxury real estate firm with twenty-five years on Florida's coast — four senior advisors, a private off-market network, and one point of contact.",
};

export default function AboutPage() {
  return (
    <main className="bg-ink text-paper">
      <Header />

      <PageHero
        eyebrow="About · Who we are"
        lines={[
          { text: "A family firm,", tone: "bright" },
          { text: "a single coastline,", tone: "muted" },
          { text: "learned by heart.", tone: "accent" },
        ]}
        lead="Maré began with one waterfront listing and a conviction that luxury real estate should feel less like a transaction and more like the handover of a life. The same family still runs the firm today."
        image="/new-images/estate-sunset.png"
        metaLeft="Est. 1998 · 26.13° N"
        metaRight="Family-run"
      />

      <TeamSection />

      <AboutSection />

      <SiteFooter />
    </main>
  );
}
```

### `app/services/page.tsx`

```tsx
import type { Metadata } from "next";
import Header from "../components/Header";
import PageHero from "../components/PageHero";
import ProcessSection from "../components/ProcessSection";
import ServicesSection from "../components/ServicesSection";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "Services · Maré Florida Estates",
  description:
    "Private acquisition, waterfront specialism, discreet selling, relocation and pre-construction access — one team carrying every step on the Florida coast.",
};

export default function ServicesPage() {
  return (
    <main className="bg-ink text-paper">
      <Header />

      <PageHero
        eyebrow="Services · What we do"
        lines={[
          { text: "One firm,", tone: "bright" },
          { text: "the full range", tone: "muted" },
          { text: "of the coast.", tone: "accent" },
        ]}
        lead="Whether it's a single waterfront home or a phased pre-construction tower, the same advisors, relationships and standards carry it through — from the first conversation to long after the keys change hands."
        image="/new-images/estate-reflecting-pool.png"
        metaLeft="Miami · Palm Beach · Naples"
        metaRight="Est. 1998"
      />

      <ProcessSection />

      <ServicesSection />

      <SiteFooter />
    </main>
  );
}
```

### `app/contact/page.tsx`

```tsx
import type { Metadata } from "next";
import Header from "../components/Header";
import PageHero from "../components/PageHero";
import ContactForm from "../components/ContactForm";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "Contact · Maré Florida Estates",
  description:
    "Begin a private conversation with Maré. Every enquiry reaches a senior advisor directly — Miami, Palm Beach and Naples, by appointment.",
};

export default function ContactPage() {
  return (
    <main className="bg-ink text-paper">
      <Header />

      <PageHero
        eyebrow="Contact · By appointment"
        lines={[
          { text: "Begin a", tone: "bright" },
          { text: "private", tone: "muted" },
          { text: "conversation.", tone: "accent" },
        ]}
        lead="No pressure, no call centre. Tell us what you have in mind and a senior advisor will reply within one business day — in complete confidence."
        image="/new-images/grand-estate.png"
        metaLeft="Miami · Palm Beach · Naples"
        metaRight="Replies within 1 day"
      />

      <ContactForm />

      <SiteFooter />
    </main>
  );
}
```

---

## Step 3 — Components

Create all of the following under `app/components/`.

### `app/components/SmoothScroll.tsx`

```tsx
"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.085, // lower = silkier, more inertial
        wheelMultiplier: 1,
        smoothWheel: true,
        touchMultiplier: 1.4,
      }}
    >
      {children}
    </ReactLenis>
  );
}
```

### `app/components/Header.tsx`

```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ACCENT = "#138a7d";

const NAV = [
  { label: "Residences", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
        scrolled || open
          ? "bg-ink/70 py-4 backdrop-blur-md"
          : "bg-transparent py-7"
      }`}
    >
      {/* top hairline */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-paper/25 to-transparent" />

      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 sm:px-10">
        {/* Wordmark */}
        <Link href="/" className="group flex flex-col leading-none">
          <span className="font-display text-2xl font-semibold tracking-[-0.01em] text-paper">
            MARÉ
          </span>
          <span
            className="mt-1 text-[0.55rem] font-medium uppercase tracking-[0.5em]"
            style={{ color: ACCENT }}
          >
            Florida Estates
          </span>
        </Link>

        {/* Center nav */}
        <nav className="hidden items-center gap-10 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative text-[0.7rem] font-medium uppercase tracking-[0.32em] transition-colors ${
                isActive(item.href)
                  ? "text-paper"
                  : "text-paper-dim hover:text-paper"
              }`}
            >
              {item.label}
              <span
                className="absolute -bottom-1.5 left-0 h-px transition-all duration-500"
                style={{
                  backgroundColor: ACCENT,
                  width: isActive(item.href) ? "100%" : 0,
                }}
              />
            </Link>
          ))}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-6">
          <Link
            href="/contact"
            className="group hidden items-center gap-3 text-[0.7rem] font-medium uppercase tracking-[0.32em] text-paper sm:flex"
          >
            <span
              className="h-1.5 w-1.5 rounded-full transition-transform duration-500 group-hover:scale-150"
              style={{ backgroundColor: ACCENT }}
            />
            Inquire
          </Link>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <span
              className={`h-px w-5 bg-paper transition-all duration-300 ${
                open ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-5 bg-paper transition-all duration-300 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-px w-5 bg-paper transition-all duration-300 ${
                open ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden transition-all duration-500 md:hidden ${
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-auto flex max-w-[1400px] flex-col gap-1 px-6 pb-6 pt-8 sm:px-10">
          {[...NAV, { label: "Contact", href: "/contact" }].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between border-b border-paper/10 py-4 text-[0.8rem] font-medium uppercase tracking-[0.28em] transition-colors ${
                isActive(item.href) ? "text-paper" : "text-paper-dim"
              }`}
            >
              {item.label}
              <span
                className="h-1 w-1 rounded-full"
                style={{
                  backgroundColor: isActive(item.href) ? ACCENT : "transparent",
                }}
              />
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
```

### `app/components/ScrollVideoHero.tsx`

> Scroll-scrubbed canvas hero. Preloads all 145 frames, then draws the frame matching scroll progress on every Lenis tick. Intro/outro copy and the scroll cue are driven by direct ref writes for a jank-free hot path.

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";

const FRAME_COUNT = 145;
const framePath = (i: number) =>
  `/frames/frame-${String(i).padStart(4, "0")}.jpg`;

const clamp = (v: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, v));

/** Maps a value in [a,b] to [0,1], clamped. */
const range = (v: number, a: number, b: number) =>
  clamp((v - a) / (b - a));

export default function ScrollVideoHero() {
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

      // Drive overlay copy directly off the smoothed scroll position.
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

  // Lenis drives the scrub: fires every interpolated scroll frame, pre-paint.
  useLenis(() => updateRef.current());

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
            A privately curated portfolio of Florida&rsquo;s rarest
            waterfront residences.
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
          <a
            href="#contact"
            className="group mt-10 flex items-center gap-4 text-[0.7rem] font-medium uppercase tracking-[0.36em] text-paper"
          >
            <span className="h-px w-10 bg-accent transition-all duration-500 group-hover:w-16" />
            Arrange a Private Viewing
            <span className="h-px w-10 bg-accent transition-all duration-500 group-hover:w-16" />
          </a>
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
            <span className="absolute left-0 top-0 h-1/2 w-full animate-[cue_2.2s_ease-in-out_infinite] bg-accent" />
          </span>
        </div>

        {/* Loading veil */}
        <div
          className={`absolute inset-0 z-40 flex items-center justify-center bg-ink transition-opacity duration-1000 ${
            ready ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <div className="flex flex-col items-center">
            <span className="font-display text-5xl font-semibold tracking-[-0.02em] text-paper">
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
        @keyframes cue {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </section>
  );
}
```

### `app/components/ServicesScroll.tsx`

> Pinned vertical card carousel (desktop, `h-[640vh]`) over a giant background index; phones get a plain stacked flow. Driven by Lenis frame callback + direct ref writes. Uses local images at `/Service-Images/<name>.png`.

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";

/* Light, editorial "services" section. A pinned stage holds a vertical
   carousel of property cards that rise from the bottom-center, pass over a
   giant background index, and exit toward the top — while the left list,
   right copy, and bottom nav track the active service. Mirrors the
   scroll-driven approach used in ScrollVideoHero (Lenis frame callback +
   direct ref writes for the hot path, React state only on index change). */

type Service = {
  num: string;
  title: string;
  tag: string;
  copy: string;
  cta: string;
  img: string;
};

const IMG = (name: string) => `/Service-Images/${name}.png`;

const SERVICES: Service[] = [
  {
    num: "01",
    title: "Luxury Home Buying",
    tag: "Private Acquisition",
    copy: "We open doors to Florida's most coveted addresses — gated estates, architectural landmarks, and quiet enclaves matched to the life you intend to live.",
    cta: "Explore Luxury Buying",
    img: IMG("luxury-home-buying"),
  },
  {
    num: "02",
    title: "Waterfront Properties",
    tag: "On the Water",
    copy: "Deep-water docks, sunrise terraces, and horizons that never end. We specialize in the homes where the coast quietly becomes your backyard.",
    cta: "View Waterfront Homes",
    img: IMG("waterfront-properties"),
  },
  {
    num: "03",
    title: "Selling Your Home",
    tag: "Listing & Marketing",
    copy: "Editorial marketing, global reach, and pricing intelligence that positions your property to sell at its true worth — confidently and discreetly.",
    cta: "List With Us",
    img: IMG("selling-your-home"),
  },
  {
    num: "04",
    title: "Investment Properties",
    tag: "Yield & Growth",
    copy: "From short-term coastal rentals to long-hold appreciation plays, we structure Florida real estate that works as hard as you do.",
    cta: "Build Your Portfolio",
    img: IMG("investment-properties"),
  },
  {
    num: "05",
    title: "Relocation to Florida",
    tag: "Concierge Move",
    copy: "Trading winters for sunshine? We guide the entire move — neighborhoods, schools, lifestyle — so Florida feels like home from day one.",
    cta: "Plan Your Move",
    img: IMG("relocation-to-florida"),
  },
  {
    num: "06",
    title: "Market Valuation",
    tag: "Pricing Intelligence",
    copy: "A precise, data-driven read on what your property commands today — backed by hyper-local comparables and decades on the coast.",
    cta: "Request a Valuation",
    img: IMG("market-valuation"),
  },
  {
    num: "07",
    title: "New Developments",
    tag: "Pre-Construction",
    copy: "First access to pre-construction towers and boutique residences along the coast — secured before they ever reach the open market.",
    cta: "See What's Coming",
    img: IMG("new-developments"),
  },
];

const N = SERVICES.length;
const ACCENT = "#138a7d"; // coastal teal — the section's single Florida accent

const clamp = (v: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, v));

export default function ServicesScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRef = useRef<HTMLSpanElement>(null);
  const updateRef = useRef<() => void>(() => {});
  const activeRef = useRef(0);

  const [active, setActive] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  // Only mount the heavy pinned stage on wide screens; phones get a simple
  // stacked flow (so we never reserve a 600vh empty pin on mobile).
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    const section = sectionRef.current;
    if (!section) return;

    const update = () => {
      const distance = section.offsetHeight - window.innerHeight;
      if (distance <= 0) return;
      const rect = section.getBoundingClientRect();
      const progress = clamp(-rect.top / distance);
      const pos = progress * (N - 1);
      const vh = window.innerHeight;

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const offset = i - pos; // 0 = centered, + = below, - = above
        const dist = Math.abs(offset);
        const ty = offset * vh * 0.64;
        const scale = Math.max(0.78, 1 - dist * 0.13);
        const opacity = clamp(1.12 - dist * 0.92);
        const blur = Math.min(dist * 2.4, 7);
        el.style.transform = `translate(-50%, -50%) translateY(${ty}px) scale(${scale})`;
        el.style.opacity = String(opacity);
        el.style.filter = blur > 0.25 ? `blur(${blur}px)` : "none";
        el.style.zIndex = String(100 - Math.round(dist * 10));
      });

      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;

      const idx = clamp(Math.round(pos), 0, N - 1);
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
    };

    updateRef.current = update;
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [isDesktop]);

  useLenis(() => updateRef.current());

  /* ----------------------------- MOBILE ----------------------------- */
  if (!isDesktop) {
    return (
      <section className="bg-[#f3f1ea] px-5 py-20 text-[#0d0d0c]">
        <header className="mb-12">
          <span
            className="text-[0.62rem] font-semibold uppercase tracking-[0.4em]"
            style={{ color: ACCENT }}
          >
            Our Services
          </span>
          <h2 className="mt-4 font-display text-[2.6rem] font-semibold leading-[0.95] tracking-[-0.03em]">
            How we move you
            <br />
            across Florida.
          </h2>
        </header>

        <div className="flex flex-col gap-16">
          {SERVICES.map((s) => (
            <article key={s.num}>
              <div className="relative overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.img}
                  alt={s.title}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.25em]">
                  {s.num} · {s.tag}
                </span>
              </div>
              <h3 className="mt-5 font-display text-[1.7rem] font-semibold tracking-[-0.02em]">
                {s.title}
              </h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-black/60">
                {s.copy}
              </p>
              <a
                href="#contact"
                className="mt-5 inline-flex items-center gap-2 bg-[#0d0d0c] px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#f3f1ea]"
              >
                {s.cta}
                <span style={{ color: ACCENT }}>↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>
    );
  }

  /* ---------------------------- DESKTOP ---------------------------- */
  return (
    <section
      ref={sectionRef}
      className="relative h-[640vh] bg-[#f3f1ea] text-[#0d0d0c]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* hairline frame, top */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-px bg-black/10" />

        {/* eyebrow — top left */}
        <div className="absolute left-10 top-28 z-30 xl:left-16">
          <span
            className="text-[0.6rem] font-semibold uppercase tracking-[0.45em]"
            style={{ color: ACCENT }}
          >
            Our Services
          </span>
        </div>

        {/* note — top right */}
        <div className="absolute right-10 top-28 z-30 text-right xl:right-16">
          <p className="text-[0.58rem] font-medium uppercase leading-relaxed tracking-[0.35em] text-black/45">
            What we do
            <br />
            is what we love
            <span className="ml-1 inline-block" style={{ color: ACCENT }}>
              ↘
            </span>
          </p>
        </div>

        {/* GIANT background index — stays large, sits behind the cards */}
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            {SERVICES.map((s, i) => (
              <span
                key={s.num}
                className="absolute font-display font-semibold leading-none tracking-[-0.04em] transition-opacity duration-500"
                style={{
                  fontSize: "clamp(14rem, 34vw, 32rem)",
                  color: "#0d0d0c",
                  opacity: i === active ? 0.06 : 0,
                }}
              >
                {s.num}
              </span>
            ))}
          </div>
        </div>

        {/* center label that rides on top of the giant number */}
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
          <span className="font-display text-[clamp(2rem,4.4vw,4rem)] font-semibold tracking-[-0.03em] text-black/[0.07]">
            Florida
          </span>
        </div>

        {/* ---- vertical carousel of cards ---- */}
        <div className="absolute inset-0">
          {SERVICES.map((s, i) => (
            <div
              key={s.num}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="absolute left-1/2 top-1/2 will-change-transform"
              style={{ opacity: 0 }}
            >
              <figure className="relative w-[clamp(300px,30vw,460px)] overflow-hidden rounded-[14px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.img}
                  alt={s.title}
                  className="aspect-[4/5] w-full object-cover"
                  draggable={false}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                  <span className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-white">
                    {s.tag}
                  </span>
                  <span
                    className="rounded-full px-3 py-1 font-display text-[0.62rem] font-semibold uppercase tracking-[0.25em] text-[#0d0d0c]"
                    style={{ backgroundColor: ACCENT, color: "#f3f1ea" }}
                  >
                    {s.num}
                  </span>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>

        {/* ---- left: service list with arrow indicator ---- */}
        <nav className="absolute left-10 top-1/2 z-30 -translate-y-1/2 xl:left-16">
          <ul className="flex flex-col gap-[0.55rem]">
            {SERVICES.map((s, i) => {
              const on = i === active;
              return (
                <li key={s.num}>
                  <button
                    type="button"
                    className="group flex items-center gap-3 text-left"
                    onClick={() => scrollToService(sectionRef.current, i)}
                  >
                    <span
                      className="block h-px transition-all duration-500"
                      style={{
                        width: on ? 26 : 0,
                        backgroundColor: ACCENT,
                        opacity: on ? 1 : 0,
                      }}
                    />
                    <span
                      className="font-display text-[clamp(0.95rem,1.05vw,1.2rem)] font-medium tracking-[-0.01em] transition-colors duration-300"
                      style={{
                        color: on ? "#0d0d0c" : "rgba(13,13,12,0.32)",
                        fontWeight: on ? 600 : 400,
                      }}
                    >
                      {s.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ---- right: changing copy + CTA ---- */}
        <div className="absolute right-10 top-1/2 z-30 w-[clamp(260px,24vw,360px)] -translate-y-1/2 xl:right-16">
          <div className="relative min-h-[210px]">
            {SERVICES.map((s, i) => (
              <div
                key={s.num}
                className="absolute inset-0 transition-all duration-500"
                style={{
                  opacity: i === active ? 1 : 0,
                  transform:
                    i === active ? "translateY(0)" : "translateY(12px)",
                }}
                aria-hidden={i !== active}
              >
                <span
                  className="text-[0.58rem] font-semibold uppercase tracking-[0.35em]"
                  style={{ color: ACCENT }}
                >
                  {s.tag}
                </span>
                <p className="mt-4 text-[0.95rem] font-light leading-relaxed text-black/65">
                  {s.copy}
                </p>
                <a
                  href="#contact"
                  className="group mt-7 inline-flex items-center gap-3 bg-[#0d0d0c] px-6 py-4 text-[0.64rem] font-semibold uppercase tracking-[0.28em] text-[#f3f1ea] transition-colors hover:bg-black"
                >
                  {s.cta}
                  <span
                    className="transition-transform duration-300 group-hover:translate-x-1"
                    style={{ color: ACCENT }}
                  >
                    ↗
                  </span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* ---- bottom left: skip + progress nav ---- */}
        <div className="absolute bottom-10 left-10 z-30 flex items-center gap-6 xl:left-16">
          <a
            href="#contact"
            className="text-[0.58rem] font-medium uppercase tracking-[0.32em] text-black/40 transition-colors hover:text-black"
          >
            Skip Services
          </a>
          <div className="flex items-center gap-1.5">
            {SERVICES.map((s, i) => (
              <span
                key={s.num}
                className="block h-[2px] transition-all duration-500"
                style={{
                  width: i === active ? 26 : 12,
                  backgroundColor:
                    i === active ? ACCENT : "rgba(13,13,12,0.2)",
                }}
              />
            ))}
          </div>
        </div>

        {/* overall progress line, very bottom */}
        <div className="absolute inset-x-0 bottom-0 z-30 h-px bg-black/10">
          <span
            ref={barRef}
            className="block h-full origin-left"
            style={{ backgroundColor: ACCENT, transform: "scaleX(0)" }}
          />
        </div>

        {/* ---- bottom right: handwritten label + thumbnail preview ---- */}
        <div className="absolute bottom-9 right-10 z-30 flex items-center gap-4 xl:right-16">
          <div className="relative h-[1.4rem] w-[150px] overflow-hidden text-right">
            {SERVICES.map((s, i) => (
              <span
                key={s.num}
                className="font-editorial absolute inset-0 text-[1.05rem] italic transition-opacity duration-500"
                style={{ opacity: i === active ? 0.7 : 0 }}
              >
                {s.title}
              </span>
            ))}
          </div>
          <div className="relative h-12 w-20 overflow-hidden rounded-md ring-1 ring-black/10">
            {SERVICES.map((s, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={s.num}
                src={s.img}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
                style={{ opacity: i === active ? 1 : 0 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Jump the page so a given service sits centered in the pinned timeline. */
function scrollToService(section: HTMLElement | null, i: number) {
  if (!section) return;
  const distance = section.offsetHeight - window.innerHeight;
  const target =
    section.offsetTop + (i / (N - 1)) * distance;
  window.scrollTo({ top: target, behavior: "smooth" });
}
```

### `app/components/FeaturedResidences.tsx`

> Pinned horizontal listing scroll with a HUD (live index, cumulative price ticker, progress bar, ghost numerals). Desktop `h-[420vh]`; mobile is a snap rail. Images at `/new-images/<name>.png`.

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLenis } from "lenis/react";

/* Featured Residences — the portfolio chapter. Signature move (design-system
   §5.3): a pinned HORIZONTAL SCROLL with a HUD. The page pins, a track of
   full-viewport listing slides translates sideways, and a heads-up overlay
   tracks the live index, an animated cumulative price counter, a progress bar,
   and a ghost listing number per slide. Dark ink surface so it alternates
   against the lighter ServicesScroll above. Coastal teal is the only accent.
   Heavy move is desktop-only; phones get a plain horizontal snap rail. Mirrors
   the Lenis-frame-callback + direct-ref-write hot path used elsewhere. */

const ACCENT = "#138a7d";
const IMG = (name: string) => `/new-images/${name}.png`;

type Listing = {
  n: string;
  name: string;
  place: string;
  coords: string;
  price: number; // millions, for the HUD ticker
  priceLabel: string;
  beds: string;
  baths: string;
  area: string;
  status: string;
  img: string;
};

const LISTINGS: Listing[] = [
  {
    n: "01",
    name: "Bayfront Pavilion",
    place: "Miami Beach",
    coords: "25.79° N · 80.13° W",
    price: 24.5,
    priceLabel: "$24.5M",
    beds: "6",
    baths: "8",
    area: "11,400",
    status: "For Sale",
    img: IMG("waterfront-villa"),
  },
  {
    n: "02",
    name: "The Glass House",
    place: "Palm Beach",
    coords: "26.71° N · 80.04° W",
    price: 18.9,
    priceLabel: "$18.9M",
    beds: "5",
    baths: "6",
    area: "9,250",
    status: "For Sale",
    img: IMG("modern-villa"),
  },
  {
    n: "03",
    name: "Dune Residence",
    place: "Naples",
    coords: "26.14° N · 81.79° W",
    price: 32,
    priceLabel: "$32.0M",
    beds: "7",
    baths: "9",
    area: "14,100",
    status: "Off Market",
    img: IMG("estate-sunset"),
  },
  {
    n: "04",
    name: "Grove Manor",
    place: "Coconut Grove",
    coords: "25.72° N · 80.24° W",
    price: 14.2,
    priceLabel: "$14.2M",
    beds: "4",
    baths: "5",
    area: "6,800",
    status: "For Sale",
    img: IMG("grand-estate"),
  },
];

const N = LISTINGS.length;
const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export default function FeaturedResidences() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const updateRef = useRef<() => void>(() => {});
  const activeRef = useRef(0);

  const [active, setActive] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const update = () => {
      const distance = section.offsetHeight - window.innerHeight;
      if (distance <= 0) return;
      const rect = section.getBoundingClientRect();
      const progress = clamp(-rect.top / distance);

      // Translate the track by viewport-width per slide (count-based, not
      // scrollWidth, so ghost numerals don't inflate the distance).
      const shift = progress * window.innerWidth * (N - 1);
      track.style.transform = `translate3d(${-shift}px,0,0)`;

      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;

      const pos = progress * (N - 1);
      const idx = clamp(Math.round(pos), 0, N - 1);

      // Cumulative price up to and including the active slide.
      if (counterRef.current) {
        const total = LISTINGS.slice(0, idx + 1).reduce(
          (s, l) => s + l.price,
          0,
        );
        counterRef.current.textContent = `$${total.toFixed(1)}M`;
      }

      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
    };

    updateRef.current = update;
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [isDesktop]);

  useLenis(() => updateRef.current());

  /* ------------------------------ MOBILE ------------------------------ */
  if (!isDesktop) {
    return (
      <section
        id="portfolio"
        className="relative overflow-hidden border-t border-paper/10 bg-ink py-24 text-paper"
      >
        <div className="px-6">
          <span
            className="text-[0.6rem] font-medium uppercase tracking-[0.4em]"
            style={{ color: ACCENT }}
          >
            § 03 — Featured Residences
          </span>
          <h2 className="mt-6 font-display text-[clamp(2.4rem,9vw,3.4rem)] font-medium leading-[1] tracking-[-0.04em]">
            A private
            <br />
            <span className="text-paper-dim">portfolio of</span>{" "}
            <span
              className="bg-clip-text font-editorial italic text-transparent"
              style={{ backgroundImage: `linear-gradient(90deg, ${ACCENT}, #2cc3b1)` }}
            >
              rare homes.
            </span>
          </h2>
        </div>

        <div className="scrollbar-none mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4">
          {LISTINGS.map((l) => (
            <article key={l.n} className="w-[80vw] shrink-0 snap-center">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.img} alt={l.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[0.55rem] font-medium uppercase tracking-[0.25em] text-white backdrop-blur-md">
                  {l.n} · {l.status}
                </span>
                <div className="absolute inset-x-4 bottom-4">
                  <span
                    className="bg-clip-text font-display text-2xl font-medium text-transparent"
                    style={{ backgroundImage: `linear-gradient(90deg, ${ACCENT}, #5fe0cf)` }}
                  >
                    {l.priceLabel}
                  </span>
                  <h3 className="font-display text-xl font-medium">{l.name}</h3>
                  <p className="text-[0.62rem] uppercase tracking-[0.28em] text-paper-dim">
                    {l.place} · {l.beds} BD · {l.baths} BA
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 px-6">
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 text-[0.65rem] font-medium uppercase tracking-[0.3em] text-paper"
          >
            <span className="h-px w-8" style={{ backgroundColor: ACCENT }} />
            Request the Full Collection
          </Link>
        </div>
      </section>
    );
  }

  /* ------------------------------ DESKTOP ------------------------------ */
  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="relative h-[420vh] border-t border-paper/10 bg-ink text-paper"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* sliding track */}
        <div
          ref={trackRef}
          className="absolute inset-0 flex h-full will-change-transform"
        >
          {LISTINGS.map((l) => (
            <div key={l.n} className="relative h-full w-screen shrink-0">
              {/* ghost listing numeral */}
              <span
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display font-semibold leading-none tracking-[-0.05em]"
                style={{
                  fontSize: "32vw",
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(251,251,249,0.05)",
                }}
              >
                {l.n}
              </span>

              <div className="mx-auto flex h-full max-w-[1400px] items-center px-10 xl:px-16">
                <div className="grid w-full grid-cols-12 items-center gap-10">
                  {/* framed image */}
                  <figure className="relative col-span-7 col-start-1">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[14px] shadow-[0_50px_100px_-40px_rgba(0,0,0,0.7)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={l.img}
                        alt={l.name}
                        className="h-full w-full object-cover"
                        draggable={false}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
                      <div className="grain absolute inset-0" />
                      {/* status pill */}
                      <span className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[0.56rem] font-medium uppercase tracking-[0.3em] text-white/85 backdrop-blur-md">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: ACCENT }}
                        />
                        {l.status}
                      </span>
                    </div>
                    {/* corner brackets */}
                    <span className="pointer-events-none absolute -left-3 -top-3 h-7 w-7 border-l border-t border-paper/25" />
                    <span className="pointer-events-none absolute -bottom-3 -right-3 h-7 w-7 border-b border-r border-paper/25" />
                  </figure>

                  {/* editorial detail column */}
                  <div className="col-span-4 col-start-9">
                    <span className="text-[0.58rem] font-medium uppercase tracking-[0.35em] text-paper-dim">
                      {l.coords}
                    </span>
                    <h3 className="mt-5 font-display text-[clamp(2rem,3.4vw,3.2rem)] font-medium leading-[0.98] tracking-[-0.035em]">
                      {l.name}
                    </h3>
                    <p className="mt-2 text-[0.7rem] uppercase tracking-[0.3em] text-paper-dim">
                      {l.place}
                    </p>

                    <span
                      className="mt-7 block bg-clip-text font-display text-[clamp(1.8rem,2.6vw,2.6rem)] font-medium leading-none tabular-nums text-transparent"
                      style={{
                        backgroundImage: `linear-gradient(90deg, ${ACCENT}, #5fe0cf)`,
                      }}
                    >
                      {l.priceLabel}
                    </span>

                    {/* spec strip */}
                    <div className="mt-8 grid grid-cols-3 border-t border-paper/10">
                      {[
                        { k: "Beds", v: l.beds },
                        { k: "Baths", v: l.baths },
                        { k: "Sq Ft", v: l.area },
                      ].map((spec) => (
                        <div
                          key={spec.k}
                          className="border-r border-paper/10 py-5 last:border-r-0"
                        >
                          <span className="block text-[0.52rem] uppercase tracking-[0.3em] text-paper-dim">
                            {spec.k}
                          </span>
                          <span className="mt-2 block font-display text-xl font-medium tabular-nums">
                            {spec.v}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href="/contact"
                      className="group mt-8 inline-flex items-center gap-3 text-[0.62rem] font-medium uppercase tracking-[0.3em] text-paper"
                    >
                      Arrange a Private Viewing
                      <span
                        className="transition-transform duration-300 group-hover:translate-x-1"
                        style={{ color: ACCENT }}
                      >
                        ↗
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ---------------- HUD overlay (fixed within the pin) ---------------- */}
        {/* eyebrow */}
        <div className="pointer-events-none absolute left-10 top-28 z-30 xl:left-16">
          <span
            className="text-[0.6rem] font-medium uppercase tracking-[0.45em]"
            style={{ color: ACCENT }}
          >
            § 03 — Featured Residences
          </span>
          <p className="mt-3 max-w-[22ch] font-display text-[clamp(1.4rem,1.9vw,2rem)] font-medium leading-[1.05] tracking-[-0.02em] text-paper">
            A private portfolio of{" "}
            <span className="font-editorial italic text-paper-dim">rare homes.</span>
          </p>
        </div>

        {/* live index + cumulative counter — top right */}
        <div className="pointer-events-none absolute right-10 top-28 z-30 text-right xl:right-16">
          <span className="font-display text-[0.62rem] uppercase tracking-[0.3em] text-paper-dim tabular-nums">
            <span className="text-paper">{LISTINGS[active].n}</span> /{" "}
            {String(N).padStart(2, "0")}
          </span>
          <div className="mt-3">
            <span className="block text-[0.5rem] uppercase tracking-[0.3em] text-paper-dim">
              Collection Value
            </span>
            <span
              ref={counterRef}
              className="mt-1 block bg-clip-text font-display text-lg font-medium tabular-nums text-transparent"
              style={{ backgroundImage: `linear-gradient(90deg, ${ACCENT}, #5fe0cf)` }}
            >
              $24.5M
            </span>
          </div>
        </div>

        {/* bottom: place ticker + progress */}
        <div className="absolute inset-x-0 bottom-10 z-30 mx-auto flex max-w-[1400px] items-center justify-between px-10 xl:px-16">
          <div className="relative h-5 w-[260px] overflow-hidden">
            {LISTINGS.map((l, i) => (
              <span
                key={l.n}
                className="absolute inset-0 text-[0.6rem] font-medium uppercase tracking-[0.35em] text-paper-dim transition-opacity duration-500"
                style={{ opacity: i === active ? 1 : 0 }}
              >
                {l.place} · {l.coords}
              </span>
            ))}
          </div>
          <span className="text-[0.55rem] uppercase tracking-[0.32em] text-paper-dim">
            Scroll to explore →
          </span>
        </div>

        {/* progress line, very bottom */}
        <div className="absolute inset-x-0 bottom-0 z-30 h-px bg-paper/10">
          <span
            ref={barRef}
            className="block h-full origin-left"
            style={{ backgroundColor: ACCENT, transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}
```

### `app/components/ServicesSection.tsx`

> White-surface accordion: four service rows that expand to a 480px image panel (framer-motion height + crossfade). Uses `lucide-react`'s `Plus` and `next/image` with images at `/Service-Images/<name>.png`.

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

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

const ACCENT = "#138a7d"; // coastal teal — matches the Services section above

const IMG = (name: string) => `/Service-Images/${name}.png`;

// Local project photography (public/Service-Images) replaces the original
// Unsplash placeholders.
const pool = [
  IMG("waterfront-properties"),
  IMG("luxury-home-buying"),
  IMG("new-developments"),
  IMG("relocation-to-florida"),
];

const services: Service[] = [
  {
    n: "01",
    label: "Waterfront Living",
    kicker: "Coast / On the water",
    headlineTop: "LIFE ON",
    headlineBottom: "THE WATER",
    shortBody:
      "Deep-water docks, sunrise terraces and endless horizons — the rare homes where the Florida coast quietly becomes your backyard.",
    stat: "180+",
    statLabel: "Waterfront homes placed",
    hero: IMG("waterfront-properties"),
    thumbs: pool,
  },
  {
    n: "02",
    label: "Private Estates",
    kicker: "Estate / Off market",
    headlineTop: "PRIVATE",
    headlineBottom: "ARCHITECTURAL ESTATES",
    shortBody:
      "Gated compounds, architectural landmarks and quiet enclaves — many never listed publicly, matched to the life you intend to live.",
    stat: "$2.4B",
    statLabel: "In estate sales",
    hero: IMG("luxury-home-buying"),
    thumbs: pool,
  },
  {
    n: "03",
    label: "New Developments",
    kicker: "Build / Pre-construction",
    headlineTop: "FIRST",
    headlineBottom: "ACCESS",
    shortBody:
      "Pre-construction towers and boutique residences along the coast — secured for our clients before they ever reach the open market.",
    stat: "40+",
    statLabel: "Developments represented",
    hero: IMG("new-developments"),
    thumbs: pool,
  },
  {
    n: "04",
    label: "Concierge & Relocation",
    kicker: "Service / White glove",
    headlineTop: "WHITE-GLOVE",
    headlineBottom: "FROM DAY ONE",
    shortBody:
      "Neighborhoods, schools, closings and the move itself — one team guiding the entire transition so Florida feels like home immediately.",
    stat: "25 yrs",
    statLabel: "On the coast",
    hero: IMG("relocation-to-florida"),
    thumbs: pool,
  },
];

export function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      id="approach"
      className="relative w-full overflow-hidden bg-white py-28 text-neutral-900 md:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-20 grid grid-cols-1 gap-10 md:grid-cols-12">
          <h2 className="font-sans text-[clamp(2.4rem,5.4vw,4.8rem)] font-medium leading-[1] tracking-[-0.045em] md:col-span-12">
            What we do best.
            <br />
            <span className="text-neutral-400">Four ways we </span>
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(90deg, ${ACCENT}, #2cc3b1)`,
              }}
            >
              move you along the coast
            </span>
            <span className="text-neutral-400">.</span>
          </h2>
          <div className="md:col-span-6 md:col-start-7">
            <p className="mt-2 max-w-[58ch] text-[clamp(1rem,1.1vw,1.1rem)] font-light leading-[1.65] text-neutral-500">
              One firm, the full range. Whether it&apos;s a single waterfront
              home or a phased pre-construction tower, the same team,
              relationships and standards carry it through. Tap a service to
              see it open.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-200">
        {services.map((s, i) => {
          const isActive = activeIndex === i;
          return (
            <div
              key={s.n}
              className="group relative overflow-hidden border-b border-neutral-200"
            >
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
                        <Image
                          src={s.hero}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-black/70" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                        <div
                          className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-between px-6 py-6 md:px-10 md:py-10"
                          style={{ height: 480 }}
                        >
                          <div className="flex items-start justify-between gap-6">
                            <div className="flex items-center gap-3">
                              <span
                                className="bg-clip-text font-sans text-[1.4rem] font-medium leading-none text-transparent"
                                style={{
                                  backgroundImage: `linear-gradient(135deg, ${ACCENT}, #5fe0cf)`,
                                }}
                              >
                                {s.n}
                              </span>
                              <span className="text-[0.62rem] font-medium uppercase tracking-[0.28em] text-white/70">
                                {s.kicker}
                              </span>
                            </div>
                            <span className="text-[0.62rem] uppercase tracking-[0.28em] text-white/55">
                              In focus
                            </span>
                          </div>
                          <div className="flex items-end justify-between gap-10">
                            <h3 className="max-w-[16ch] font-sans text-[clamp(2.4rem,6.5vw,6rem)] font-medium leading-[0.92] tracking-[-0.04em] text-white">
                              {s.headlineTop}
                              <br />
                              <span className="text-white/70">
                                {s.headlineBottom}
                              </span>
                            </h3>
                            <div className="hidden shrink-0 flex-col items-end gap-1 text-right md:flex">
                              <span
                                className="bg-clip-text font-sans text-[clamp(2rem,3.4vw,3rem)] font-medium leading-none text-transparent"
                                style={{
                                  backgroundImage: `linear-gradient(90deg, ${ACCENT}, #5fe0cf)`,
                                }}
                              >
                                {s.stat}
                              </span>
                              <span className="text-[0.62rem] uppercase tracking-[0.28em] text-white/55">
                                {s.statLabel}
                              </span>
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
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors group-hover:border-neutral-400">
                                <Plus className="h-2.5 w-2.5" strokeWidth={1} />
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
                                  <div
                                    key={j}
                                    className="relative h-12 w-12 overflow-hidden rounded-md border border-neutral-200 md:h-14 md:w-14"
                                  >
                                    <Image
                                      src={src}
                                      alt=""
                                      fill
                                      sizes="56px"
                                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                    />
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
```

### `app/components/Rise.tsx`

> Shared "masked headline rise" reveal, used by several sections. Binds `useInView` to a full-height wrapper and has a mount-timer fallback so text can't stay clipped under Lenis smooth-scroll.

```tsx
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/* Shared "masked headline rise" — the house entrance (design-system §4/§9).
   The IntersectionObserver binds to the always-full-height outer wrapper (not
   the translated inner span), which fires reliably under Lenis smooth-scroll.
   A mount-timer fallback guarantees text can never stay clipped if the observer
   misses; collapses to a plain fade under reduced motion. */
export default function Rise({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();

  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setArmed(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const show = inView || armed || reduced;

  return (
    <span ref={ref} className="block overflow-hidden">
      <motion.span
        className={`block ${className ?? ""}`}
        initial={false}
        animate={
          reduced
            ? { opacity: show ? 1 : 0 }
            : { y: show ? "0%" : "110%", opacity: show ? 1 : 0 }
        }
        transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
```

### `app/components/AboutSection.tsx`

> Dark "who we are" chapter. Signature move: a scroll-triggered stat ticker (four figures count up from zero on enter). Contains its own local `Rise` and `StatCell`. Uses `next/image` with `/new-images/aboutus.png`.

```tsx
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  motion,
  animate,
  useInView,
  useReducedMotion,
} from "framer-motion";

/* About section — the firm's "who we are" chapter. Dark ink surface, chosen to
   alternate against the white Services section above it. Its one signature move
   (per the design system) is a scroll-triggered STAT TICKER: four figures count
   up from zero the moment the strip enters the viewport. Everything else is
   restrained — masked headline rise, an offset lead, a serif pull-quote, and a
   single coastal-teal accent used only as punctuation. */

const ACCENT = "#138a7d"; // coastal teal — the site's single Florida accent
const tealText = { backgroundImage: `linear-gradient(90deg, ${ACCENT}, #2cc3b1)` };

type Stat = {
  n: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  note: string;
};

const STATS: Stat[] = [
  { n: "01", value: 25, label: "Years on the coast", note: "Since 1998" },
  {
    n: "02",
    value: 2.4,
    decimals: 1,
    prefix: "$",
    suffix: "B",
    label: "In closed transactions",
    note: "Lifetime volume",
  },
  { n: "03", value: 600, suffix: "+", label: "Homes placed", note: "Three markets" },
  { n: "04", value: 4, label: "Senior advisors", note: "One point of contact" },
];

/* Masked headline rise — the house entrance. The IntersectionObserver is bound
   to the always-full-height outer wrapper (not the translated inner span) via
   the useInView hook, which fires reliably under Lenis smooth-scroll. A mount
   fallback guarantees the text can never stay clipped if the observer misses.
   Collapses to a plain fade under reduced-motion. */
function Rise({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduced = useReducedMotion();

  // Safety net: reveal shortly after mount even if the observer never fires.
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setArmed(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const show = inView || armed || reduced;

  return (
    <span ref={ref} className="block overflow-hidden">
      <motion.span
        className={`block ${className ?? ""}`}
        initial={false}
        animate={
          reduced
            ? { opacity: show ? 1 : 0 }
            : { y: show ? "0%" : "110%", opacity: show ? 1 : 0 }
        }
        transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* A single counting stat cell. Ticks up once, only when scrolled into view. */
function StatCell({ stat }: { stat: Stat }) {
  const cellRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(cellRef, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();

  const { value, decimals = 0, prefix = "", suffix = "" } = stat;
  const format = (v: number) =>
    `${prefix}${v.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;

  useEffect(() => {
    const el = numRef.current;
    if (!el || !inView) return;
    if (reduced) {
      el.textContent = format(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        el.textContent = format(v);
      },
    });
    return () => controls.stop();
    // format is derived purely from stat fields below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced, value, decimals, prefix, suffix]);

  return (
    <div
      ref={cellRef}
      className="border-b border-paper/10 px-1 py-9 md:border-b-0 md:border-l md:px-8 md:py-10 md:first:border-l-0"
    >
      <span className="text-[0.55rem] font-medium uppercase tracking-[0.32em] text-paper-dim">
        {stat.n}
      </span>
      <span
        ref={numRef}
        className="mt-4 block bg-clip-text font-display text-[clamp(2.4rem,4.2vw,3.6rem)] font-medium leading-none tabular-nums text-transparent"
        style={tealText}
      >
        {prefix}
        {(0).toFixed(decimals)}
        {suffix}
      </span>
      <span className="mt-3 block text-[0.82rem] font-light leading-snug text-paper/75">
        {stat.label}
      </span>
      <span className="mt-1 block text-[0.55rem] uppercase tracking-[0.28em] text-paper-dim">
        {stat.note}
      </span>
    </div>
  );
}

export default function AboutSection() {
  const reduced = useReducedMotion();

  return (
    <section
      id="about"
      className="relative w-full overflow-hidden border-t border-paper/10 bg-ink py-28 text-paper md:py-40"
    >
      {/* header */}
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        {/* ghost watermark behind the headline */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-14 right-0 select-none font-display font-semibold leading-none tracking-[-0.04em] md:right-10"
          style={{
            fontSize: "clamp(7rem,20vw,18rem)",
            color: "transparent",
            WebkitTextStroke: "1px rgba(251,251,249,0.05)",
          }}
        >
          1998
        </span>

        {/* eyebrow + mono metadata */}
        <div className="relative flex items-center justify-between">
          <span className="text-[0.6rem] font-medium uppercase tracking-[0.4em] text-paper-dim">
            § 05 — Who we are
          </span>
          <span className="hidden text-[0.58rem] font-medium uppercase tracking-[0.35em] text-paper-dim sm:block">
            Est. 1998 · 26.13° N
          </span>
        </div>
        <div className="mt-6 h-px w-full bg-paper/10" />

        {/* two/three-tone headline */}
        <h2 className="relative mt-10 font-display text-[clamp(2.4rem,5.6vw,5rem)] font-medium leading-[1] tracking-[-0.045em]">
          <Rise>We&apos;ve spent twenty-five years</Rise>
          <Rise delay={0.08} className="text-paper-dim">
            learning one coastline
          </Rise>
          <Rise delay={0.16}>
            <span
              className="bg-clip-text font-editorial italic text-transparent"
              style={tealText}
            >
              by heart.
            </span>
          </Rise>
        </h2>

        {/* offset lead */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-12">
          <p className="max-w-[58ch] text-[clamp(1rem,1.1vw,1.1rem)] font-light leading-[1.65] text-paper/60 md:col-span-6 md:col-start-7">
            Maré began with a single waterfront listing and a conviction that
            luxury real estate should feel less like a transaction and more like
            the handover of a life. The same family still runs the firm, the
            same standards carry every closing, and the same phone number
            reaches the people who actually do the work.
          </p>
        </div>
      </div>

      {/* body: framed image + editorial narrative */}
      <div className="relative mx-auto mt-20 grid max-w-[1400px] grid-cols-1 gap-12 px-6 md:mt-28 md:grid-cols-12 md:items-center md:gap-10 md:px-10">
        <motion.figure
          className="relative md:col-span-6 lg:col-span-5"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/new-images/aboutus.png"
              alt="The Maré team at the firm's Florida office"
              fill
              sizes="(min-width:768px) 42vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-transparent" />
            <div className="grain absolute inset-0" />
            {/* glass status pill */}
            <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: ACCENT }}
              />
              <span className="text-[0.56rem] font-medium uppercase tracking-[0.3em] text-white/85">
                On the coast since 1998
              </span>
            </div>
          </div>
          {/* corner brackets — crop marks */}
          <span className="pointer-events-none absolute -left-2 -top-2 h-6 w-6 border-l border-t border-paper/30" />
          <span className="pointer-events-none absolute -bottom-2 -right-2 h-6 w-6 border-b border-r border-paper/30" />
        </motion.figure>

        <motion.div
          className="md:col-span-5 md:col-start-8"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <p className="text-[clamp(1rem,1.05vw,1.08rem)] font-light leading-[1.7] text-paper/70">
            We are deliberately small. Four senior advisors, a private network of
            off-market sellers, and a concierge team that stays long after the
            keys change hands. No call centre, no hand-offs — the advisor who
            first walks the dock is the one who signs the closing.
          </p>

          <div className="my-8 h-px w-full bg-paper/10" />

          <p className="font-editorial text-[clamp(1.4rem,2vw,1.9rem)] italic leading-[1.3] text-paper">
            &ldquo;We only take on a home we&rsquo;d be proud to{" "}
            <span className="bg-clip-text text-transparent" style={tealText}>
              live in ourselves
            </span>
            .&rdquo;
          </p>

          <div className="mt-8 flex items-center gap-4">
            <span
              className="h-px w-10"
              style={{ backgroundColor: ACCENT }}
            />
            <span className="text-[0.6rem] font-medium uppercase leading-relaxed tracking-[0.32em] text-paper-dim">
              Elena Maré
              <br />
              Founding Partner
            </span>
          </div>
        </motion.div>
      </div>

      {/* the move: scroll-triggered stat ticker */}
      <div className="relative mx-auto mt-20 max-w-[1400px] px-6 md:mt-28 md:px-10">
        <div className="h-px w-full bg-paper/10" />
        <div className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map((s) => (
            <StatCell key={s.n} stat={s} />
          ))}
        </div>
        <div className="h-px w-full bg-paper/10" />
      </div>

      {/* closing pull-line */}
      <p className="mx-auto mt-24 max-w-[40ch] px-6 text-center font-display text-[clamp(1.4rem,2.4vw,2.2rem)] font-medium leading-[1.25] tracking-[-0.02em] text-paper md:mt-32">
        Discreet by default.{" "}
        <span className="text-paper-dim">Relentless when it counts.</span>
      </p>
    </section>
  );
}
```

### `app/components/Testimonials.tsx`

> Warm-paper "proof" chapter. A selectable client list (left) crossfades an oversized serif quote (right) with framer-motion. Contains its own local `Rise`.

```tsx
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";

/* Testimonials — the "proof" chapter, deliberately quiet (design-system §5.6:
   restrained counterpoint to the loud sections). One signature move: a single
   oversized serif client quote that CROSSFADES, driven by a selectable client
   index on the left. Warm paper surface so it alternates against the dark
   About above and the dark footer below. Coastal teal as punctuation only. */

const ACCENT = "#138a7d";

type Quote = {
  n: string;
  quote: string;
  highlight: string;
  name: string;
  role: string;
  place: string;
};

const QUOTES: Quote[] = [
  {
    n: "01",
    quote:
      "They found us a house that had never been listed, negotiated it quietly, and handled the move down to the last box. We simply",
    highlight: "arrived to a home.",
    name: "J. & M. Hartley",
    role: "Relocated from Boston",
    place: "Palm Beach",
  },
  {
    n: "02",
    quote:
      "Three offers in nine days, all above asking. The marketing felt less like a listing and more like",
    highlight: "an editorial spread.",
    name: "Priya Raman",
    role: "Seller, Bayfront Estate",
    place: "Miami Beach",
  },
  {
    n: "03",
    quote:
      "I have bought property on three continents. The discretion and judgement here were, without exaggeration,",
    highlight: "the finest I've known.",
    name: "A. Kovač",
    role: "Private collector",
    place: "Naples",
  },
  {
    n: "04",
    quote:
      "One advisor, start to finish — no hand-offs, no call centre. When it mattered most they were",
    highlight: "simply always there.",
    name: "The Okafor Family",
    role: "First waterfront home",
    place: "Coconut Grove",
  },
];

/* Masked headline rise — the house entrance, with a mount-safety fallback so
   text can never stay clipped if the observer misses under Lenis. */
function Rise({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduced = useReducedMotion();
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setArmed(true), 1200);
    return () => clearTimeout(t);
  }, []);
  const show = inView || armed || reduced;
  return (
    <span ref={ref} className="block overflow-hidden">
      <motion.span
        className={`block ${className ?? ""}`}
        initial={false}
        animate={
          reduced
            ? { opacity: show ? 1 : 0 }
            : { y: show ? "0%" : "110%", opacity: show ? 1 : 0 }
        }
        transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const q = QUOTES[active];

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-[#f3f1ea] py-28 text-[#0d0d0c] md:py-40"
    >
      {/* ghost quotation mark watermark */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-24 right-4 select-none font-editorial leading-none text-black/[0.04] md:right-20"
        style={{ fontSize: "clamp(16rem,30vw,30rem)" }}
      >
        &rdquo;
      </span>

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        {/* header */}
        <div className="flex items-center justify-between">
          <span
            className="text-[0.6rem] font-medium uppercase tracking-[0.4em]"
            style={{ color: ACCENT }}
          >
            § 06 — In their words
          </span>
          <span className="hidden text-[0.58rem] font-medium uppercase tracking-[0.35em] text-black/40 sm:block">
            600+ homes placed
          </span>
        </div>
        <div className="mt-6 h-px w-full bg-black/10" />

        <h2 className="mt-10 max-w-[18ch] font-display text-[clamp(2.2rem,5vw,4.4rem)] font-medium leading-[1] tracking-[-0.045em]">
          <Rise>The work speaks.</Rise>
          <Rise delay={0.08} className="text-black/35">
            But our clients
          </Rise>
          <Rise delay={0.16}>
            <span
              className="bg-clip-text font-editorial italic text-transparent"
              style={{ backgroundImage: `linear-gradient(90deg, ${ACCENT}, #2cc3b1)` }}
            >
              speak louder.
            </span>
          </Rise>
        </h2>

        {/* body: selectable list + crossfading quote */}
        <div className="mt-16 grid grid-cols-1 gap-12 md:mt-24 md:grid-cols-12 md:gap-10">
          {/* left: client selector */}
          <nav className="md:col-span-4">
            <ul className="flex flex-col">
              {QUOTES.map((item, i) => {
                const on = i === active;
                return (
                  <li key={item.n}>
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      className="group flex w-full items-center gap-4 border-b border-black/10 py-5 text-left"
                    >
                      <span
                        className="text-[0.6rem] font-medium uppercase tracking-[0.3em] tabular-nums transition-colors"
                        style={{ color: on ? ACCENT : "rgba(13,13,12,0.35)" }}
                      >
                        {item.n}
                      </span>
                      <span className="flex-1">
                        <span
                          className="block font-display text-[1.05rem] font-medium tracking-[-0.01em] transition-colors"
                          style={{ color: on ? "#0d0d0c" : "rgba(13,13,12,0.4)" }}
                        >
                          {item.name}
                        </span>
                        <span className="text-[0.6rem] uppercase tracking-[0.26em] text-black/40">
                          {item.place}
                        </span>
                      </span>
                      <span
                        className="h-px transition-all duration-500"
                        style={{
                          width: on ? 24 : 0,
                          backgroundColor: ACCENT,
                        }}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* right: the quote */}
          <div className="md:col-span-7 md:col-start-6">
            <div className="relative min-h-[280px]">
              <AnimatePresence mode="wait">
                <motion.figure
                  key={q.n}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <blockquote className="font-display text-[clamp(1.5rem,2.8vw,2.6rem)] font-light leading-[1.28] tracking-[-0.02em] text-[#0d0d0c]">
                    &ldquo;{q.quote}{" "}
                    <span
                      className="bg-clip-text font-editorial italic text-transparent"
                      style={{ backgroundImage: `linear-gradient(90deg, ${ACCENT}, #2cc3b1)` }}
                    >
                      {q.highlight}
                    </span>
                    &rdquo;
                  </blockquote>

                  <figcaption className="mt-10 flex items-center gap-4">
                    <span className="h-px w-10" style={{ backgroundColor: ACCENT }} />
                    <span className="text-[0.62rem] font-medium uppercase leading-relaxed tracking-[0.3em] text-black/55">
                      {q.name}
                      <br />
                      {q.role}
                    </span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### `app/components/HomeContact.tsx`

> Homepage closing invitation — the `#contact` anchor target. Full-bleed coastal frame (`/new-images/estate-courtyard.png`) behind a floating glass inquiry panel; the form resolves to an in-place confirmation. Imports the shared `Rise`.

```tsx
"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Rise from "./Rise";

/* Homepage contact — the closing invitation, and the target of every "#contact"
   link on the page. Signature move: a full-bleed coastal frame behind a floating
   GLASS inquiry panel (design-system kit-of-parts: glass panel + vignette +
   corner brackets + mono metadata). Dark/image surface, distinct from the solid
   footer beneath it. A compact, self-contained form resolves to an in-place
   confirmation. Coastal teal is the only accent. */

const ACCENT = "#138a7d";

const field =
  "w-full border-b border-white/15 bg-transparent py-3.5 text-[0.95rem] font-light text-paper placeholder:text-paper/35 transition-colors focus:border-[#2cc3b1] focus:outline-none";
const labelCls =
  "block text-[0.55rem] font-medium uppercase tracking-[0.32em] text-paper/55";

export default function HomeContact() {
  const [sent, setSent] = useState(false);
  const reduced = useReducedMotion();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-paper/10 bg-ink py-28 text-paper md:py-40"
    >
      {/* full-bleed coastal frame + scrims */}
      <div className="absolute inset-0">
        <Image
          src="/new-images/estate-courtyard.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/55" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 25% 40%, rgba(6,7,8,0) 35%, rgba(6,7,8,0.8) 100%)",
          }}
        />
        <div className="grain absolute inset-0" />
      </div>

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-16 px-6 md:grid-cols-12 md:items-center md:px-10">
        {/* left: invitation */}
        <div className="md:col-span-6">
          <div className="flex items-center justify-between md:justify-start md:gap-8">
            <span
              className="text-[0.6rem] font-medium uppercase tracking-[0.42em]"
              style={{ color: ACCENT }}
            >
              § 07 — Begin a conversation
            </span>
            <span className="text-[0.56rem] font-medium uppercase tracking-[0.32em] text-paper-dim">
              Replies within 1 day
            </span>
          </div>

          <h2 className="mt-8 font-display text-[clamp(2.4rem,5.4vw,4.6rem)] font-medium leading-[1] tracking-[-0.045em] text-legible">
            <Rise>Let&apos;s find your</Rise>
            <Rise delay={0.08} className="text-paper/40">
              stretch of the
            </Rise>
            <Rise delay={0.16}>
              <span
                className="bg-clip-text font-editorial italic text-transparent"
                style={{ backgroundImage: `linear-gradient(90deg, ${ACCENT}, #2cc3b1)` }}
              >
                Florida coast.
              </span>
            </Rise>
          </h2>

          <p className="mt-9 max-w-[46ch] text-[clamp(1rem,1.1vw,1.1rem)] font-light leading-[1.7] text-paper/65">
            Tell us what you have in mind — a waterfront home, a quiet sale, a
            move south — and a senior advisor replies personally, in confidence.
            No call centre, no hand-offs.
          </p>

          {/* direct lines */}
          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:gap-14">
            <div>
              <span className={labelCls}>By appointment</span>
              <a
                href="mailto:private@mare-estates.com"
                className="mt-2 block font-display text-lg font-medium transition-colors hover:text-[#2cc3b1]"
              >
                private@mare-estates.com
              </a>
            </div>
            <div>
              <span className={labelCls}>Direct line</span>
              <a
                href="tel:+13055550100"
                className="mt-2 block font-display text-lg font-medium transition-colors hover:text-[#2cc3b1]"
              >
                +1 305 555 0100
              </a>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3 text-[0.56rem] font-medium uppercase tracking-[0.32em] text-paper-dim">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
            Miami · Palm Beach · Naples
          </div>
        </div>

        {/* right: floating glass inquiry panel */}
        <div className="md:col-span-5 md:col-start-8">
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-[18px] border border-white/12 bg-white/[0.06] p-7 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.7)] backdrop-blur-xl md:p-9"
          >
            {/* corner brackets */}
            <span className="pointer-events-none absolute -left-2 -top-2 h-6 w-6 border-l border-t border-paper/30" />
            <span className="pointer-events-none absolute -bottom-2 -right-2 h-6 w-6 border-b border-r border-paper/30" />

            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex min-h-[320px] flex-col items-start justify-center"
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full text-ink"
                    style={{ backgroundColor: ACCENT }}
                  >
                    ✓
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-medium leading-[1.1] tracking-[-0.02em]">
                    Your note is on its way.
                  </h3>
                  <p className="mt-3 max-w-[34ch] text-[0.92rem] font-light leading-[1.65] text-paper/60">
                    A senior advisor will be in touch within one business day —
                    entirely in confidence.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="group mt-7 inline-flex items-center gap-3 text-[0.6rem] font-medium uppercase tracking-[0.3em]"
                  >
                    <span className="h-px w-8" style={{ backgroundColor: ACCENT }} />
                    Send another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={onSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-7"
                >
                  <span className="text-[0.55rem] font-medium uppercase tracking-[0.32em] text-paper-dim">
                    Private enquiry
                  </span>
                  <div>
                    <label htmlFor="hc-name" className={labelCls}>
                      Full name
                    </label>
                    <input id="hc-name" name="name" required placeholder="Jane Hartley" className={field} />
                  </div>
                  <div>
                    <label htmlFor="hc-email" className={labelCls}>
                      Email
                    </label>
                    <input
                      id="hc-email"
                      name="email"
                      type="email"
                      required
                      placeholder="jane@email.com"
                      className={field}
                    />
                  </div>
                  <div>
                    <label htmlFor="hc-message" className={labelCls}>
                      What are you looking for?
                    </label>
                    <textarea
                      id="hc-message"
                      name="message"
                      rows={3}
                      required
                      placeholder="The coast you have in mind, the timeline, what matters most…"
                      className={`${field} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="group mt-1 inline-flex items-center justify-center gap-3 bg-paper px-7 py-4 text-[0.64rem] font-medium uppercase tracking-[0.3em] text-ink transition-colors hover:bg-white"
                  >
                    Send Enquiry
                    <span
                      className="transition-transform duration-300 group-hover:translate-x-1"
                      style={{ color: ACCENT }}
                    >
                      ↗
                    </span>
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

### `app/components/PageHero.tsx`

> Reusable subpage hero. Mono eyebrow → oversized two/three-tone display headline (per-line `tone`: bright/muted/accent) → offset lead → mono metadata strip, over a full-bleed image with cinematic scrims. Imports the shared `Rise`.

```tsx
"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import Rise from "./Rise";

/* Reusable subpage hero header. Dark ink surface (always the first section
   under the fixed header, so it carries the transparent nav). Standard anatomy:
   mono eyebrow → oversized two/three-tone display headline → offset lead →
   mono metadata strip, over a full-bleed coastal frame with cinematic scrims.
   The headline lines + accent word are passed in per page. */

const ACCENT = "#138a7d";

export type HeroLine = { text: string; tone?: "bright" | "muted" | "accent" };

export default function PageHero({
  eyebrow,
  lines,
  lead,
  image,
  metaLeft,
  metaRight,
}: {
  eyebrow: string;
  lines: HeroLine[];
  lead: string;
  image: string;
  metaLeft: string;
  metaRight: string;
}) {
  const reduced = useReducedMotion();

  return (
    <section className="relative flex min-h-[88vh] items-end overflow-hidden bg-ink pb-16 pt-44 text-paper md:min-h-[92vh] md:pb-20">
      {/* background frame */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* cinematic scrims for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/40" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 30% 60%, rgba(6,7,8,0) 38%, rgba(6,7,8,0.7) 100%)",
          }}
        />
        <div className="grain absolute inset-0" />
      </div>

      <div className="relative mx-auto w-full max-w-[1400px] px-6 md:px-10">
        {/* eyebrow */}
        <motion.span
          className="block text-[0.6rem] font-medium uppercase tracking-[0.42em]"
          style={{ color: ACCENT }}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {eyebrow}
        </motion.span>

        {/* headline */}
        <h1 className="mt-8 font-display text-[clamp(2.6rem,7vw,6rem)] font-medium leading-[0.98] tracking-[-0.045em] text-legible">
          {lines.map((line, i) => (
            <Rise key={i} delay={0.05 * i}>
              {line.tone === "accent" ? (
                <span
                  className="bg-clip-text font-editorial italic text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(90deg, ${ACCENT}, #2cc3b1)`,
                  }}
                >
                  {line.text}
                </span>
              ) : (
                <span className={line.tone === "muted" ? "text-paper/40" : undefined}>
                  {line.text}
                </span>
              )}
            </Rise>
          ))}
        </h1>

        {/* offset lead */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-12">
          <motion.p
            className="max-w-[56ch] text-[clamp(1rem,1.1vw,1.12rem)] font-light leading-[1.65] text-paper/70 md:col-span-6 md:col-start-7"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            {lead}
          </motion.p>
        </div>

        {/* metadata strip */}
        <div className="mt-14 flex items-center justify-between border-t border-paper/15 pt-6 text-[0.58rem] font-medium uppercase tracking-[0.32em] text-paper-dim">
          <span>{metaLeft}</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
            {metaRight}
          </span>
        </div>
      </div>
    </section>
  );
}
```

### `app/components/ProcessSection.tsx`

> Services-page "how we work". Sticky media column whose image cross-wipes between four states while step panels track scroll progress (Lenis frame callback). Desktop `md:h-[360vh]`; mobile stacks. Images at `/new-images/<name>.png`. Imports the shared `Rise`.

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import Rise from "./Rise";

/* Process — "how we work", on the Services page. Signature move
   (design-system §5.4): a STICKY MEDIA column whose image cross-wipes between
   states while the step panels scroll past on the other side. Warm paper
   surface to alternate against the dark hero above. The active step is derived
   from scroll progress (Lenis frame callback), driving both the sticky image
   crossfade and the step highlight. Mobile collapses to a plain stacked flow. */

const ACCENT = "#138a7d";
const IMG = (name: string) => `/new-images/${name}.png`;

type Step = {
  n: string;
  title: string;
  tag: string;
  body: string;
  img: string;
};

const STEPS: Step[] = [
  {
    n: "01",
    title: "Discovery",
    tag: "We listen first",
    body: "Before a single showing, we map the life you intend to live on the coast — the water, the light, the privacy, the school run. The brief drives everything that follows.",
    img: IMG("gated-avenue"),
  },
  {
    n: "02",
    title: "Curation",
    tag: "A private shortlist",
    body: "We return with a tight, honest shortlist — much of it off-market, drawn from twenty-five years of relationships with owners who only sell quietly.",
    img: IMG("community-aerial"),
  },
  {
    n: "03",
    title: "Negotiation",
    tag: "Quiet, decisive",
    body: "Pricing intelligence, discretion and nerve. We negotiate firmly and calmly on your behalf, and structure the deal so the advantage stays on your side of the table.",
    img: IMG("modern-villa"),
  },
  {
    n: "04",
    title: "Handover",
    tag: "Long after the keys",
    body: "Closing, the move itself, and the concierge details that make a house a home. The advisor who first walked the dock with you is the one who hands over the keys.",
    img: IMG("waterfront-villa"),
  },
];

const N = STEPS.length;
const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const updateRef = useRef<() => void>(() => {});
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const update = () => {
      if (window.matchMedia("(max-width: 767px)").matches) return;
      const distance = section.offsetHeight - window.innerHeight;
      if (distance <= 0) return;
      const rect = section.getBoundingClientRect();
      const progress = clamp(-rect.top / distance);
      const idx = clamp(Math.floor(progress * N), 0, N - 1);
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
    };
    updateRef.current = update;
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useLenis(() => updateRef.current());

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative bg-[#f3f1ea] text-[#0d0d0c] md:h-[360vh]"
    >
      {/* header (scrolls in, then the sticky stage takes over) */}
      <div className="mx-auto max-w-[1400px] px-6 pt-28 md:px-10 md:pt-40">
        <div className="flex items-center justify-between">
          <span
            className="text-[0.6rem] font-medium uppercase tracking-[0.42em]"
            style={{ color: ACCENT }}
          >
            § 02 — How we work
          </span>
          <span className="hidden text-[0.58rem] font-medium uppercase tracking-[0.35em] text-black/40 sm:block">
            Four steps · One team
          </span>
        </div>
        <div className="mt-6 h-px w-full bg-black/10" />
        <h2 className="mt-10 max-w-[20ch] font-display text-[clamp(2.2rem,5vw,4.4rem)] font-medium leading-[1] tracking-[-0.045em]">
          <Rise>A calm, deliberate</Rise>
          <Rise delay={0.08}>
            path from{" "}
            <span
              className="bg-clip-text font-editorial italic text-transparent"
              style={{ backgroundImage: `linear-gradient(90deg, ${ACCENT}, #2cc3b1)` }}
            >
              first call to keys.
            </span>
          </Rise>
        </h2>
      </div>

      {/* ---------------- DESKTOP: sticky media + scrolling steps ---------------- */}
      <div className="sticky top-0 hidden h-screen items-center md:flex">
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-12 items-center gap-10 px-10">
          {/* sticky media column */}
          <div className="col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] shadow-[0_50px_100px_-40px_rgba(0,0,0,0.5)]">
              {STEPS.map((s, i) => (
                <div
                  key={s.n}
                  className="absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    opacity: i === active ? 1 : 0,
                    clipPath:
                      i === active ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
                  }}
                >
                  <Image
                    src={s.img}
                    alt={s.title}
                    fill
                    sizes="50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="grain absolute inset-0" />
                </div>
              ))}
              {/* step counter HUD */}
              <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-full border border-white/20 bg-black/30 px-4 py-2 backdrop-blur-md">
                <span
                  className="bg-clip-text font-display text-sm font-medium tabular-nums text-transparent"
                  style={{ backgroundImage: `linear-gradient(90deg, ${ACCENT}, #5fe0cf)` }}
                >
                  {STEPS[active].n}
                </span>
                <span className="text-[0.55rem] uppercase tracking-[0.3em] text-white/80">
                  {STEPS[active].tag}
                </span>
              </div>
            </div>
          </div>

          {/* step text — crossfades to match the active media */}
          <div className="col-span-5 col-start-8">
            <div className="relative min-h-[260px]">
              {STEPS.map((s, i) => (
                <div
                  key={s.n}
                  className="absolute inset-0 transition-all duration-500"
                  style={{
                    opacity: i === active ? 1 : 0,
                    transform: i === active ? "translateY(0)" : "translateY(16px)",
                  }}
                  aria-hidden={i !== active}
                >
                  <span
                    className="text-[0.58rem] font-medium uppercase tracking-[0.35em]"
                    style={{ color: ACCENT }}
                  >
                    Step {s.n}
                  </span>
                  <h3 className="mt-5 font-display text-[clamp(2rem,3.4vw,3.2rem)] font-medium leading-[1] tracking-[-0.035em]">
                    {s.title}
                  </h3>
                  <p className="mt-6 max-w-[44ch] text-[clamp(1rem,1.1vw,1.1rem)] font-light leading-[1.7] text-black/60">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>

            {/* progress dots */}
            <div className="mt-10 flex items-center gap-2">
              {STEPS.map((s, i) => (
                <span
                  key={s.n}
                  className="block h-[2px] transition-all duration-500"
                  style={{
                    width: i === active ? 32 : 14,
                    backgroundColor: i === active ? ACCENT : "rgba(13,13,12,0.2)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* spacer that creates the scroll distance for the sticky stage */}
      <div className="hidden md:block md:h-[40vh]" />

      {/* ---------------- MOBILE: stacked steps ---------------- */}
      <div className="mt-14 flex flex-col gap-16 px-6 pb-24 md:hidden">
        {STEPS.map((s) => (
          <motion.article
            key={s.n}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.img} alt={s.title} className="h-full w-full object-cover" />
              <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-[0.55rem] font-medium uppercase tracking-[0.25em] text-white backdrop-blur-md">
                {s.n} · {s.tag}
              </span>
            </div>
            <h3 className="mt-5 font-display text-2xl font-medium tracking-[-0.02em]">
              {s.title}
            </h3>
            <p className="mt-3 text-[0.95rem] font-light leading-relaxed text-black/60">
              {s.body}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
```

### `app/components/TeamSection.tsx`

> About-page advisor grid. Each card frames the advisor's stretch of coastline (rather than a stock face) with a monogram + mono metadata; cards rise in a soft stagger on enter. Images at `/new-images/<name>.png`. Imports the shared `Rise`.

```tsx
"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import Rise from "./Rise";

/* The advisors. A quiet, editorial team grid (light paper surface). Rather than
   stock faces, each card frames the advisor's stretch of coastline — the market
   they own — with a monogram, name and mono metadata. One signature touch: the
   cards rise in a soft stagger on enter. Coastal teal as punctuation only. */

const ACCENT = "#138a7d";
const IMG = (name: string) => `/new-images/${name}.png`;

type Advisor = {
  n: string;
  initials: string;
  name: string;
  role: string;
  market: string;
  since: string;
  img: string;
};

const TEAM: Advisor[] = [
  {
    n: "01",
    initials: "EM",
    name: "Elena Maré",
    role: "Founding Partner",
    market: "Palm Beach",
    since: "Since 1998",
    img: IMG("neighborhood-aerial"),
  },
  {
    n: "02",
    initials: "DC",
    name: "Daniel Cruz",
    role: "Principal, Waterfront",
    market: "Miami Beach",
    since: "Since 2004",
    img: IMG("waterfront-villa"),
  },
  {
    n: "03",
    initials: "SO",
    name: "Sofia Okonkwo",
    role: "Director, New Developments",
    market: "Coconut Grove",
    since: "Since 2011",
    img: IMG("community-aerial"),
  },
  {
    n: "04",
    initials: "JR",
    name: "James Renner",
    role: "Head of Concierge",
    market: "Naples",
    since: "Since 2009",
    img: IMG("gated-avenue"),
  },
];

export default function TeamSection() {
  const reduced = useReducedMotion();

  return (
    <section
      id="team"
      className="relative overflow-hidden bg-[#f3f1ea] py-28 text-[#0d0d0c] md:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* header */}
        <div className="flex items-center justify-between">
          <span
            className="text-[0.6rem] font-medium uppercase tracking-[0.42em]"
            style={{ color: ACCENT }}
          >
            § 02 — The advisors
          </span>
          <span className="hidden text-[0.58rem] font-medium uppercase tracking-[0.35em] text-black/40 sm:block">
            Four partners · One point of contact
          </span>
        </div>
        <div className="mt-6 h-px w-full bg-black/10" />

        <h2 className="mt-10 max-w-[16ch] font-display text-[clamp(2.2rem,5vw,4.4rem)] font-medium leading-[1] tracking-[-0.045em]">
          <Rise>Deliberately small.</Rise>
          <Rise delay={0.08} className="text-black/35">
            Each name a
          </Rise>
          <Rise delay={0.16}>
            <span
              className="bg-clip-text font-editorial italic text-transparent"
              style={{ backgroundImage: `linear-gradient(90deg, ${ACCENT}, #2cc3b1)` }}
            >
              coastline by heart.
            </span>
          </Rise>
        </h2>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-12">
          <p className="max-w-[56ch] text-[clamp(1rem,1.1vw,1.1rem)] font-light leading-[1.65] text-black/55 md:col-span-6 md:col-start-7">
            No call centre, no hand-offs. Four senior advisors, each owning a
            stretch of the Florida coast they know street by street — and the one
            who first walks the dock with you is the one who signs the closing.
          </p>
        </div>

        {/* roster */}
        <div className="mt-20 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((a, i) => (
            <motion.article
              key={a.n}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.08,
              }}
              className="group"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[12px]">
                <Image
                  src={a.img}
                  alt={`${a.market} — ${a.name}'s market`}
                  fill
                  sizes="(min-width:1024px) 22vw, (min-width:640px) 45vw, 90vw"
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="grain absolute inset-0" />

                {/* monogram + index */}
                <div className="absolute inset-x-4 top-4 flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 font-display text-[0.7rem] font-medium tracking-[0.05em] text-white backdrop-blur-md">
                    {a.initials}
                  </span>
                  <span className="text-[0.55rem] font-medium uppercase tracking-[0.3em] text-white/70 tabular-nums">
                    {a.n}
                  </span>
                </div>

                {/* market label */}
                <span className="absolute bottom-4 left-4 flex items-center gap-2 text-[0.56rem] font-medium uppercase tracking-[0.3em] text-white/85">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
                  {a.market}
                </span>
              </div>

              <h3 className="mt-5 font-display text-[1.4rem] font-medium tracking-[-0.02em]">
                {a.name}
              </h3>
              <p className="mt-1 text-[0.62rem] font-medium uppercase tracking-[0.28em] text-black/45">
                {a.role}
              </p>
              <p className="mt-3 text-[0.58rem] uppercase tracking-[0.3em] text-black/35">
                {a.since}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### `app/components/ContactForm.tsx`

> Contact-page enquiry form. Light paper surface, sticky details column (left) + restrained form with interest chips (right). No backend — submission resolves to an in-place confirmation. Imports the shared `Rise`.

```tsx
"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Rise from "./Rise";

/* Contact — the conversation. Light paper surface to alternate against the dark
   hero above and the dark footer below. Offset editorial layout: a sticky
   details/header column (left) and a clean, restrained enquiry form (right).
   No backend here — submission resolves to a calm in-place confirmation. The
   single coastal-teal accent punctuates the focused field and the submit. */

const ACCENT = "#138a7d";

const INTERESTS = [
  "Buying a residence",
  "Selling a property",
  "Waterfront specialism",
  "New developments",
  "Relocation & concierge",
  "Something else",
];

const OFFICES = [
  { city: "Miami", line: "9 Bayfront Walk, Suite 1200", coords: "25.76° N · 80.19° W" },
  { city: "Palm Beach", line: "240 Worth Avenue", coords: "26.70° N · 80.04° W" },
  { city: "Naples", line: "700 Fifth Avenue South", coords: "26.14° N · 81.79° W" },
];

const field =
  "w-full border-b border-black/15 bg-transparent py-4 text-[0.95rem] font-light text-[#0d0d0c] placeholder:text-black/35 transition-colors focus:border-[#138a7d] focus:outline-none";
const labelCls =
  "block text-[0.56rem] font-medium uppercase tracking-[0.32em] text-black/45";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [interest, setInterest] = useState(INTERESTS[0]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section
      id="enquiry"
      className="relative overflow-hidden bg-[#f3f1ea] py-28 text-[#0d0d0c] md:py-40"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-16 px-6 md:grid-cols-12 md:gap-10 md:px-10">
        {/* left: header + details (sticky on desktop) */}
        <div className="md:col-span-5">
          <div className="md:sticky md:top-32">
            <span
              className="text-[0.6rem] font-medium uppercase tracking-[0.42em]"
              style={{ color: ACCENT }}
            >
              § 01 — Enquiries
            </span>
            <h2 className="mt-8 font-display text-[clamp(2.2rem,4.4vw,3.6rem)] font-medium leading-[1] tracking-[-0.045em]">
              <Rise>Tell us about</Rise>
              <Rise delay={0.08}>
                the life you{" "}
                <span
                  className="bg-clip-text font-editorial italic text-transparent"
                  style={{ backgroundImage: `linear-gradient(90deg, ${ACCENT}, #2cc3b1)` }}
                >
                  intend to live.
                </span>
              </Rise>
            </h2>

            <p className="mt-8 max-w-[42ch] text-[0.98rem] font-light leading-[1.7] text-black/55">
              Every enquiry reaches a senior advisor directly — never a call
              centre. We reply within one business day, in confidence.
            </p>

            {/* direct lines */}
            <div className="mt-10 space-y-1">
              <span className={labelCls}>By appointment</span>
              <a
                href="mailto:private@mare-estates.com"
                className="block font-display text-xl font-medium transition-colors hover:text-[#138a7d]"
              >
                private@mare-estates.com
              </a>
              <a
                href="tel:+13055550100"
                className="block font-display text-xl font-medium transition-colors hover:text-[#138a7d]"
              >
                +1 305 555 0100
              </a>
            </div>

            {/* offices */}
            <div className="mt-10 border-t border-black/10">
              {OFFICES.map((o) => (
                <div
                  key={o.city}
                  className="flex items-baseline justify-between border-b border-black/10 py-4"
                >
                  <div>
                    <span className="font-display text-[1.05rem] font-medium">
                      {o.city}
                    </span>
                    <p className="text-[0.78rem] font-light text-black/50">{o.line}</p>
                  </div>
                  <span className="text-[0.54rem] uppercase tracking-[0.28em] text-black/35 tabular-nums">
                    {o.coords}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* right: the form */}
        <div className="md:col-span-6 md:col-start-7">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex min-h-[420px] flex-col items-start justify-center"
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: ACCENT }}
                >
                  ✓
                </span>
                <h3 className="mt-8 font-display text-[clamp(1.8rem,3vw,2.6rem)] font-medium leading-[1.05] tracking-[-0.03em]">
                  Thank you — your note is on its way.
                </h3>
                <p className="mt-4 max-w-[40ch] text-[0.98rem] font-light leading-[1.7] text-black/55">
                  A senior advisor will be in touch within one business day. In
                  the meantime, your enquiry stays entirely confidential.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="group mt-8 inline-flex items-center gap-3 text-[0.62rem] font-medium uppercase tracking-[0.3em]"
                >
                  <span className="h-px w-8" style={{ backgroundColor: ACCENT }} />
                  Send another
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-10"
              >
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={labelCls}>
                      Full name
                    </label>
                    <input id="name" name="name" required placeholder="Jane Hartley" className={field} />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelCls}>
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="jane@email.com"
                      className={field}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className={labelCls}>
                      Phone <span className="lowercase tracking-normal text-black/30">(optional)</span>
                    </label>
                    <input id="phone" name="phone" type="tel" placeholder="+1 305 555 0100" className={field} />
                  </div>
                  <div>
                    <label htmlFor="budget" className={labelCls}>
                      Budget <span className="lowercase tracking-normal text-black/30">(optional)</span>
                    </label>
                    <input id="budget" name="budget" placeholder="$5M – $15M" className={field} />
                  </div>
                </div>

                {/* interest chips */}
                <div>
                  <span className={labelCls}>I&apos;m interested in</span>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {INTERESTS.map((opt) => {
                      const on = interest === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setInterest(opt)}
                          className="rounded-full border px-4 py-2 text-[0.66rem] font-medium uppercase tracking-[0.16em] transition-colors"
                          style={{
                            borderColor: on ? ACCENT : "rgba(13,13,12,0.18)",
                            backgroundColor: on ? ACCENT : "transparent",
                            color: on ? "#f3f1ea" : "rgba(13,13,12,0.6)",
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  <input type="hidden" name="interest" value={interest} />
                </div>

                <div>
                  <label htmlFor="message" className={labelCls}>
                    Tell us more
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    placeholder="The coast you have in mind, the timeline, what matters most…"
                    className={`${field} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  className="group inline-flex items-center justify-center gap-3 self-start bg-[#0d0d0c] px-8 py-4 text-[0.66rem] font-medium uppercase tracking-[0.3em] text-[#f3f1ea] transition-colors hover:bg-black"
                >
                  Send Enquiry
                  <span
                    className="transition-transform duration-300 group-hover:translate-x-1"
                    style={{ color: ACCENT }}
                  >
                    ↗
                  </span>
                </button>

                <p className="text-[0.62rem] font-light leading-relaxed text-black/40">
                  By submitting you agree to be contacted about your enquiry.
                  Your details are held in confidence and never shared.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
```

### `app/components/SiteFooter.tsx`

> Shared footer on every page. Dark ink, ghost "MARÉ" watermark, closing CTA, contact block, and nav.

```tsx
import Link from "next/link";

/* Shared closing + footer. Lives at the foot of every page so the contact
   invitation and wordmark stay consistent site-wide. Dark ink surface — it
   should always alternate against a lighter section above it. The single
   coastal-teal accent appears only as punctuation (a dot, a hairline). */

const ACCENT = "#138a7d";

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-paper/10 bg-ink px-6 py-32 sm:py-40">
      {/* ghost wordmark watermark */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none font-display font-semibold leading-none tracking-[-0.05em]"
        style={{
          fontSize: "clamp(8rem,26vw,22rem)",
          color: "transparent",
          WebkitTextStroke: "1px rgba(251,251,249,0.04)",
        }}
      >
        MARÉ
      </span>

      <div className="relative mx-auto grid max-w-[1400px] gap-16 md:grid-cols-[1.1fr_0.9fr] md:items-end">
        <div>
          <span
            className="text-[0.6rem] font-medium uppercase tracking-[0.4em]"
            style={{ color: ACCENT }}
          >
            Maré · Florida
          </span>
          <p className="mt-8 max-w-2xl font-display text-[clamp(1.9rem,4vw,3.6rem)] font-light leading-[1.12] tracking-[-0.01em] text-paper">
            Discretion, taste, and an intimate knowledge of the coast&rsquo;s
            most extraordinary homes.
          </p>
          <Link
            href="/contact"
            className="group mt-10 inline-flex items-center gap-4 text-[0.7rem] font-medium uppercase tracking-[0.32em] text-paper"
          >
            <span
              className="h-px w-10 transition-all duration-500 group-hover:w-16"
              style={{ backgroundColor: ACCENT }}
            />
            Begin a Conversation
          </Link>
        </div>

        <div className="flex flex-col gap-8 md:items-end md:text-right">
          <div>
            <p className="text-[0.6rem] font-medium uppercase tracking-[0.4em] text-paper-dim">
              By Appointment
            </p>
            <a
              href="mailto:private@mare-estates.com"
              className="mt-3 block font-display text-2xl font-medium text-paper transition-colors hover:text-[#2cc3b1]"
            >
              private@mare-estates.com
            </a>
            <a
              href="tel:+13055550100"
              className="mt-1 block font-display text-2xl font-medium text-paper transition-colors hover:text-[#2cc3b1]"
            >
              +1 305 555 0100
            </a>
          </div>
          <div className="text-[0.65rem] font-medium uppercase tracking-[0.32em] text-paper-dim">
            Miami · Palm Beach · Naples
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-24 flex max-w-[1400px] flex-col gap-6 border-t border-paper/10 pt-8 text-[0.6rem] font-medium uppercase tracking-[0.32em] text-paper-dim sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Maré Estates</span>
        <nav className="flex flex-wrap items-center gap-6">
          <Link href="/" className="transition-colors hover:text-paper">
            Residences
          </Link>
          <Link href="/services" className="transition-colors hover:text-paper">
            Services
          </Link>
          <Link href="/about" className="transition-colors hover:text-paper">
            About
          </Link>
          <Link href="/contact" className="transition-colors hover:text-paper">
            Contact
          </Link>
        </nav>
        <span>Luxury Real Estate</span>
      </div>
    </footer>
  );
}
```

---

## Step 4 — Media assets (the part that needs ffmpeg)

The site reads these public paths at runtime:

- `public/frames/frame-0001.jpg` … `public/frames/frame-0145.jpg` — **145 frames**, generated from the hero video
- `public/Service-Images/*.png` — 7 images
- `public/new-images/*.png` — 10 images

### 4a — Download the source assets

Using the `ASSETS_BASE_URL` you set at the top, download the **video** and the **17 photos** into `public/`. Example (bash; `curl`):

```bash
mkdir -p public/frames public/Service-Images public/new-images

BASE="https://pub-a48aee57c7854772ad65c69703d7a98e.r2.dev"

# Hero source video
curl -fL "$BASE/hero-video.mp4" -o public/hero-video.mp4

# Service-Images (7)
for f in luxury-home-buying waterfront-properties selling-your-home \
         investment-properties relocation-to-florida market-valuation new-developments; do
  curl -fL "$BASE/Service-Images/$f.png" -o "public/Service-Images/$f.png"
done

# new-images (10)
for f in waterfront-villa modern-villa estate-sunset grand-estate estate-courtyard \
         estate-reflecting-pool aboutus gated-avenue community-aerial neighborhood-aerial; do
  curl -fL "$BASE/new-images/$f.png" -o "public/new-images/$f.png"
done
```

### 4b — Extract the 145 hero frames with ffmpeg (highest quality)

The hero video is **1916×1080, 24fps, ~6.04s**, which yields **exactly 145 frames** at native framerate. Extract every frame as a high-quality JPEG named `frame-0001.jpg` … `frame-0145.jpg`:

```bash
# Requires ffmpeg. -qmin 1 -q:v 1 = maximum JPEG quality (lowest compression).
ffmpeg -i public/hero-video.mp4 -qmin 1 -q:v 1 -qscale:v 1 \
  -start_number 1 "public/frames/frame-%04d.jpg"
```

Then verify the count — it must be **145** (the component hard-codes `FRAME_COUNT = 145` and pads filenames to 4 digits):

```bash
ls public/frames | wc -l   # expect 145
```

If the count comes out 144 or 146 (encoder rounding), either is fine to leave — the component clamps to the available frames — but for a perfect match force exactly 145 evenly-spaced frames instead:

```bash
rm -f public/frames/*.jpg
ffmpeg -i public/hero-video.mp4 -vf "fps=145/6.041667" -qmin 1 -q:v 1 \
  -frames:v 145 -start_number 1 "public/frames/frame-%04d.jpg"
```

> `public/hero-video.mp4` is **not** referenced at runtime (only the extracted frames are). You may delete it after extraction to slim the repo, or keep it as the regeneration source.

> A `favicon.ico` is optional — Next.js serves a default. Add `app/favicon.ico` if you want the original.

---

## Step 5 — Install & run

```bash
npm install        # or: pnpm install / yarn
npm run dev        # http://localhost:3000
```

Then verify a production build is clean:

```bash
npm run build
```

## Acceptance checklist (the build is a faithful clone when all are true)

- [ ] `/` renders, in order: scroll-video hero → pinned ServicesScroll → horizontal FeaturedResidences → white ServicesSection accordion → dark AboutSection with counting stats → Testimonials → HomeContact (glass form) → SiteFooter.
- [ ] `/services`, `/about`, `/contact` each render `Header → PageHero → (their sections) → SiteFooter`, with the correct per-page eyebrow/headline/lead/metadata and hero image.
- [ ] The hero shows a "Preparing the Estate · NN%" loader that fades once all 145 frames preload, then **scrubs** forward/back as you scroll; intro copy fades out and outro copy fades in across the 420vh pin.
- [ ] Smooth (Lenis) inertial scrolling is active site-wide.
- [ ] On desktop, ServicesScroll pins and cards rise through a giant background numeral; FeaturedResidences pins and slides horizontally with a live index + cumulative `$…M` ticker; ProcessSection (services page) has a sticky cross-wiping image. All collapse to plain stacked/snap layouts under 1024px (Process under 768px).
- [ ] ServicesSection rows expand to a 480px image panel on click; AboutSection's four stats count up from zero on scroll-in; Testimonials quote crossfades on client select; both contact forms swap to a confirmation on submit.
- [ ] Headlines use the Fraunces serif (`.font-editorial`); body uses the system sans. Accent teal is `#138a7d`. Dark surface tokens: ink `#060708`, paper `#fbfbf9`; warm paper sections use `#f3f1ea` / ink `#0d0d0c`.
- [ ] `npm run build` completes with no type or lint errors.

> **Do not** swap the stack (no GSAP, no styled-components, no shadcn), rename tokens, or alter copy/section order. This prompt is a faithful-clone spec.
