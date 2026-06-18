# Section Design System — "Editorial / Architectural" Sections

> **What this file is.** A reusable design brief that captures *why* the standout
> sections in this project look the way they do — and *how* to invent new ones from
> scratch for **any** client, in any industry, that share the same level of polish
> and personality.
>
> **What this file is NOT.** A library of layouts to copy. The six reference
> sections (Overture, PortfolioStack, Projects, Process, Services, FAQ) are *examples
> of the system*, not the system itself. Reusing their exact layout produces a clone.
> Reusing their **principles** produces something new that still feels like it belongs
> to the same confident, modern family.

---

## 0. How to use this file (read this first)

When you're asked to build a section (services, testimonials, pricing, team, stats,
contact, whatever) and told to "follow the design system":

1. **Read the brief, then the catalog.** Sections 1–4 are the philosophy. Section 5
   is the menu of signature moves. Section 6 is the build method. Sections 7–9 are
   the concrete building blocks (tokens, CSS, GSAP patterns).
2. **Do not pick a reference section and reskin it.** Instead, run the *Method*
   (Section 6): understand the content, choose **one** signature move that suits *this*
   content, then assemble the section from the building blocks.
3. **Match the host site.** Inherit the site's existing palette, fonts, accent colour,
   spacing and surface rhythm. The *system* is portable; the *tokens* are per-client.
   See Section 10 for re-theming.
4. **Earn every animation.** One bold idea per section, executed precisely, beats five
   mediocre ones. If you can't make a move smooth and reduced-motion-safe, don't ship it.

---

## 1. The core idea — what actually makes these sections feel "designed"

These sections read like a **printed architecture monograph or fashion editorial that
happens to scroll**, not like a SaaS landing page. That feeling comes from a small set
of decisions applied with discipline:

- **One hero move per section.** Each section commits to a single memorable interaction
  or layout idea and does it fully. Everything else around it is calm and restrained.
  Restraint is what makes the one move land.
- **Editorial layout, not centered cards.** Asymmetric 12-column grids, deliberate
  offsets, oversized headlines, generous negative space. Content is *placed*, not
  stacked in the middle.
- **Annotation as decoration.** The pages are "marked up" like a technical drawing or
  contact sheet: section numbers (`§ 01`), mono metadata (`37.98° N · 23.73° E`,
  `Est. 1998`), padded indices (`01 / 04`), tiny uppercase eyebrows. This metadata
  carries most of the personality and costs almost nothing.
- **Accent discipline.** ~90% of every section is monochrome (one dark surface, one
  light surface, greys). A single accent colour appears only as *punctuation* — one
  word in a headline, a stat, a 1px rule, a 6px dot. Because it's rare, it reads as
  intentional and expensive.
- **Layered depth, never flat.** Ghost typography behind content, noise, vignettes,
  radial glows, glass, hairlines, corner brackets. Multiple quiet layers create
  richness without clutter.
- **Type does the heavy lifting.** A tight, oversized sans display face for impact; an
  italic serif for the emotional/human lines; a mono for metadata. The contrast between
  these three voices is a big part of the look.

If a section you build has those six properties, it will feel like it belongs — even
if its layout is nothing like the references.

---

## 2. The non-negotiable section anatomy

Almost every section follows the same skeleton. Keep this; vary what fills it.

```
┌─ EYEBROW / SECTION MARKER ──────────────────────────────────────┐
│  mono · uppercase · tiny · wide-tracked · often numbered         │
├─ HEADLINE BLOCK ────────────────────────────────────────────────┤
│  Oversized clamp() display type. Multi-treatment in ONE line:    │
│  [bright/gradient main] + [muted continuation] + [ACCENT word].  │
│  Sits in a 12-col grid, usually spanning all 12.                 │
├─ LEAD PARAGRAPH ────────────────────────────────────────────────┤
│  Short, light-weight, max ~58ch, OFFSET into the grid            │
│  (e.g. md:col-span-6 md:col-start-7) — never full width,         │
│  never centered under the headline.                              │
├─ THE BODY / THE HERO MOVE ──────────────────────────────────────┤
│  The section's one signature interaction or layout. (Section 5)  │
├─ CLOSING LINE (optional) ───────────────────────────────────────┤
│  A centered serif/display pull-quote or a one-line summary,      │
│  again using the [bright] + [muted] two-tone treatment.          │
└──────────────────────────────────────────────────────────────────┘
```

**Header rules that recur everywhere:**

- Headline: `font-display`, `font-medium`, `leading-[1]` (or tighter, `0.92`–`0.98`),
  `tracking-[-0.045em]`, size `text-[clamp(2.4rem,5.6vw,5rem)]`.
- The headline is **two-tone or three-tone**: the main phrase is bright (white on dark,
  ink on light, or a subtle vertical text-gradient), a continuation is muted (`white/40`,
  `ink/35`), and **one** key phrase gets the accent gradient + shimmer.
- Lead paragraph: `font-light`, `leading-[1.65]`, `text-[clamp(1rem,1.1vw,1.1rem)]`,
  colour at ~55–65% opacity of the text colour, `max-w-[58ch]`, offset right.
- Eyebrow / metadata: `font-mono`, `uppercase`, `text-[0.6rem]`–`0.62rem`,
  `tracking-[0.28em]`–`0.32em`, low-opacity, frequently prefixed with a number.

---

## 3. The visual language (the "kit of parts")

These recurring motifs are what makes sections feel like siblings. Reach for them.

| Motif | What it is | Where it shows up |
|---|---|---|
| **Ghost typography** | A giant word or number behind content at very low opacity (`rgba(accent,0.05)`) or as an outline (`-webkit-text-stroke: 1px rgba(255,255,255,0.06)`), `font-size: 22vw`–`26vw`. | Index numbers behind cards, brand/word behind slides, watermark behind headers. |
| **Padded indices** | `01`, `02`… always two-digit (`String(i+1).padStart(2,"0")`), often `01 / 04`. | Card corners, HUD counters, step numbers, list rows. |
| **Mono metadata** | Tiny uppercase mono labels: coordinates, dates, `§ 01`, `NO · 03`, sector tags, `Scroll ↓`. | Corners, captions, spec strips, HUDs. |
| **Hairline rules** | 1px lines that fade to transparent at the ends, or a left-anchored accent→transparent fade. | Under labels, between header and body, as dividers, animated `scaleX 0→1`. |
| **Corner brackets / frames** | Thin L-shaped marks ( `border-l border-t` ) sitting just outside an image — like crop marks or a viewfinder. | Hero images, portfolio cards. |
| **Spec strips** | A row of `key / value` cells with a mono micro-label over a `tabular-nums` figure. | Specs (Area / Rooms / Year), stats grids. |
| **Stat blocks** | Oversized number + tiny uppercase caption, accent-gradient on the number. | Stats strips, in-image overlays. |
| **Accent dot / pill** | A 6px accent dot (sometimes `animate-ping`), or a `rounded-full border` pill with a mono label. | "Live" status, tags, chips on images. |
| **Texture overlays** | Subtle noise (`feTurbulence`, 5% opacity, `mix-blend-overlay`), directional vignette scrims, radial accent glow. | Over every hero image; inside dark panels. |
| **Glass panels** | `backdrop-blur` + faint white fill + inset top highlight + deep soft shadow + accent ring. | Floating image frames on dark sections. |

You don't use *all* of these in one section — you pick the 3–4 that suit the content.

---

## 4. Type, colour & motion vocabulary

### Type
- **Display sans** (impact): the headline voice. Tight tracking, medium weight, huge.
- **Serif** (emotion / humanity): italic for pull-quotes and softer headings
  ("From the first pour / to the final handover."). Use sparingly — it's the warm voice.
- **Mono** (data / labels): everything annotational. Always uppercase + wide tracking.
- Use `tabular-nums` on any figure that animates or sits in a column (prices, stats).

### Colour
- **Two surfaces, alternating.** A near-black "ink" surface and a warm off-white "paper"
  surface. Sections alternate between them to give the page rhythm — never five dark
  sections in a row. (Here: `#0c0c0d` ink / `#f3f1ec` paper.)
- **One accent, used as punctuation.** A 3-stop gradient (warm→deep→bright) applied via
  `background-clip: text` to a single word, a stat, hairlines, dots. Plus an optional
  slow `shimmer` (8s background-position loop) on the most important accent word.
- **Opacity ladder for hierarchy.** Instead of many grey values, use the text colour at
  `95 / 70 / 55 / 40 / 35%`. Muted continuations of headlines live at ~`40%`.

### Motion (the easing & timing house style)
- **Easings:** `expo.out` (headline rises), `power3.out` / `power2.out` (body fades),
  custom `cubic-bezier(0.22, 1, 0.36, 1)` (height/aperture/clip reveals),
  `cubic-bezier(0.2, 0.7, 0.2, 1)` (slow image scale on hover, ~1800ms).
- **Masked headline rise:** wrap a line in `overflow-hidden`, animate the inner span
  `yPercent: 110 → 0` with `opacity 0 → 1`, `stagger`. This is the signature entrance.
- **Scrubbed scroll** (`scrub: 0.6`) for cinematic, scroll-linked sequences; **triggered
  one-shot** (`start: "top 70%"`) for content that should simply arrive.
- **Parallax:** large background words drift on the opposite axis to content
  (`xPercent 28 → -32`), images scale `1.12 → 1` as they pass through.
- Durations: entrances `0.9s–1.2s`; hover micro-transitions `300–700ms`; cinematic
  scrubs are governed by scroll distance, not duration.

---

## 5. The signature-move catalog

Every memorable section is built around **one** of these. Pick the move that fits the
*content*, not the one that looks coolest. Each already has a working reference in
`src/components/sections/` — read it for the GSAP specifics, then build something new.

1. **Cinematic pinned reveal (aperture / clip-path).** Pin the section, scrub a timeline
   that opens an image from a slit (`clip-path: inset(...)`) to full while big words drift
   apart and metadata fades in. *Best for:* hero overtures, chapter openers, brand moments.
   *Ref:* `CollectionOverture.tsx`.

2. **Pinned vertical stacking deck.** Pin the section; each panel slides up
   (`yPercent: 100 → 0`) to cover the previous one as you scroll. *Best for:* a curated
   short list where each item deserves the full frame (featured work, plans, tiers).
   *Ref:* `PortfolioStack.tsx`.

3. **Pinned horizontal scroll with HUD.** Pin, translate a track of full-viewport slides
   sideways, overlay a "HUD": live index `01 / 04`, animated cumulative counter, progress
   bar, ghost brand text per slide. *Best for:* portfolios, case studies, timelines, menus.
   *Ref:* `ProjectsSection.tsx`.

4. **Sticky media + scrolling steps (clip-path wipe).** A sticky image column on one side;
   text panels scroll past on the other; the image cross-wipes between states synced to
   scroll. *Best for:* processes, how-it-works, before/after, methodology. *Ref:*
   `ProcessSection.tsx`.

5. **Expanding accordion rows (full-bleed).** Collapsed rows show a label + thumbnails;
   the active row animates its height open into a full image panel with headline + stat.
   *Best for:* services, categories, offerings, departments. *Ref:* `ServicesSection.tsx`.

6. **Quiet content accordion + offset header.** A two-column grid: sticky editorial header
   left, a clean `grid-rows-[0fr→1fr]` accordion list right. The restrained counterpoint
   to the loud sections. *Best for:* FAQ, specs, policies, details. *Ref:* `FaqSection.tsx`.

**Inventing a new move is encouraged** — as long as it (a) is a single clear idea, (b) uses
the easing/timing vocabulary in §4, (c) degrades to a simple stacked layout on mobile, and
(d) respects `prefers-reduced-motion`. Other directions in-keeping with the family: a
pinned counter/number-ticker, a draggable filmstrip, a magnetic hover grid, a scroll-driven
SVG line drawing, a marquee of oversized words, a split-flap/typewriter stat reveal.

---

## 6. The method — how to build a NEW section from scratch

Follow this every time. It's what prevents both "generic card grid" and "obvious clone."

**Step 1 — Interrogate the content.**
What is this section's *job*? How many items? Is each item heavy (deserves a full frame)
or light (lives in a list)? Is the mood loud (hero, portfolio) or quiet (FAQ, specs)?
Loud content earns a pinned/scrubbed move; quiet content earns a calm offset layout.

**Step 2 — Choose exactly one signature move** (from §5 or a new one) that matches the
content's shape and mood. Write down why. If two moves tempt you, the section is probably
two sections.

**Step 3 — Lay the anatomy** (§2): eyebrow → two/three-tone headline → offset lead →
the move → optional closing line. Use the 12-col grid; offset, don't center.

**Step 4 — Dress with 3–4 kit-of-parts motifs** (§3) that suit the content — e.g. ghost
index numbers + spec strips + hairlines for a portfolio; mono coordinates + corner
brackets + vignette for a hero. Don't use all of them.

**Step 5 — Apply accent discipline.** Decide the *one* place the accent word lives in the
headline, and the 2–3 spots it punctuates the body (a stat, a rule, a dot). Everything else
is monochrome.

**Step 6 — Choose the surface.** Dark or light, chosen to alternate with the sections
above and below it for page rhythm.

**Step 7 — Animate with the house vocabulary** (§4 + §9): masked headline rise on entrance,
the chosen move on scroll, restrained hover micro-interactions (≤700ms).

**Step 8 — Build the mobile fallback.** Every pinned/scrubbed desktop move collapses to a
simple, non-pinned vertical stack under `768px` (see §9). This is mandatory, not optional.

**Step 9 — Pass the checklist** (§11).

---

## 7. Design tokens (re-theme these per client)

These are *this* project's values. Keep the **structure**, swap the **values** to match
the new client's brand. (Tailwind v4 `@theme` + CSS custom properties.)

```css
/* Surfaces — one dark, one light. Alternate them down the page. */
--color-ink:      #0c0c0d;   /* near-black surface          */
--color-paper:    #f3f1ec;   /* warm off-white surface       */
--color-concrete: #d9d5cc;   /* tertiary / muted fill        */

/* The single accent. A 3-stop warm gradient here; swap to the client's brand hue. */
--color-amber: #c47d22;
--amber-grad: linear-gradient(100deg, #e7a94e 0%, #c47d22 45%, #f2c014 100%);

/* Glass (for floating panels on dark surfaces) */
--glass-bg:            rgba(255,255,255,0.04);
--glass-bg-strong:     rgba(255,255,255,0.07);
--glass-border:        rgba(255,255,255,0.10);
--glass-border-strong: rgba(255,255,255,0.16);
```

**Fonts** (loaded in `layout.tsx` via `next/font`, exposed as CSS vars):
- `--font-sans` / `--font-display` → a tight grotesque/geometric sans (here **Manrope**).
- `--font-serif` → an editorial serif, used italic (here **Instrument Serif**).
- Mono: the stack's default `font-mono` is fine; it only ever appears tiny and uppercase.

**Re-theming rule of thumb:** pick *one* accent hue and build a 3-stop gradient (lighter →
brand → brighter); keep one dark + one light surface; keep the sans/serif/mono trio. The
system survives almost any palette as long as the accent stays rare.

---

## 8. Reusable CSS utilities (the shared layer)

These live in `globals.css` and are used across all sections. Reuse them; add new ones in
the same spirit rather than inlining one-off styles.

- `.text-gradient` / `.text-gradient-dark` — subtle vertical fade on headlines (bright →
  ~55% at the bottom). Light version for dark surfaces, dark version for light surfaces.
- `.text-gradient-amber` + `.shimmer` — the accent word treatment (clipped gradient +
  optional 8s shimmer loop).
- `.glass-panel` / `.glass-panel-strong` — blurred floating panels with inset highlight,
  deep shadow.
- `.amber-ring` — a 1px gradient border via mask-composite (the "expensive" frame).
- `.amber-blur` — a large soft radial glow puck for atmospheric accent light.
- `.noise-overlay` — fractal-noise texture at 5% via `::after`, `mix-blend-overlay`.
- `.hairline` / `.hairline-dark` / `.hairline-accent` — fading 1px dividers.
- `.frame` + `.frame-corner` — the four corner brackets around an image.
- `.reveal` / `.reveal.in` — CSS-only scroll-in (paired with the `Reveal` component).
- `.scrollbar-none` — hide scrollbars on horizontal tracks.
- A global `prefers-reduced-motion` block that neutralises animation/transition durations.

---

## 9. GSAP patterns (the technical house style)

Single shared entry point so the plugin registers once:

```ts
// src/utils/gsap.ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger, useGSAP);
export { gsap, ScrollTrigger, useGSAP };
```

Conventions that recur in every animated section:

- **Scope every animation** with `useGSAP(() => {...}, { scope: sectionRef })` so
  selectors stay local and cleanup is automatic.
- **Desktop-only heavy moves** via `gsap.matchMedia()` → `mm.add("(min-width: 768px)", …)`,
  returning `() => mm.revert()`. Pinning/scrubbing only runs on desktop.
- **Pin + scrub** for cinematic sequences:
  `scrollTrigger: { trigger, start: "top top", end: "+=220%", pin: true, scrub: 0.6,
  anticipatePin: 1, invalidateOnRefresh: true }`. Drive a single `gsap.timeline` rather
  than many triggers on one pinned element.
- **One-shot entrances** for arriving content:
  `scrollTrigger: { trigger: sectionRef.current, start: "top 70%" }` with `expo.out` /
  `power3.out`.
- **Masked headline rise:** structure as `<span class="heading-line block overflow-hidden">
  <span class="inline-block">…</span></span>`, animate the inner span
  `{ yPercent: 110, opacity: 0 } → { yPercent: 0, opacity: 1, stagger }`.
- **Horizontal scroll:** translate the track by `window.innerWidth * (n-1)` (compute from
  slide count, *not* `scrollWidth`, so oversized ghost text doesn't inflate distance); use
  `containerAnimation` for per-slide sub-animations.
- **Animated numbers:** tween a proxy object and write `el.textContent` in `onUpdate`
  (with `tabular-nums` on the element so it doesn't jitter).
- Always `requestAnimationFrame(() => ScrollTrigger.refresh())` after setup;
  `willChange: "transform" | "clip-path"` on the elements that move.
- **Mobile fallback** lives in the JSX as a separate `md:hidden` block — a plain vertical
  stack, no pin, no scrub, optionally wrapped in the lightweight `Reveal` component.

The lightweight `Reveal` component (IntersectionObserver + the `.reveal` CSS class) is the
no-GSAP option for simple "fade up on enter," and it reveals immediately under
reduced-motion or if already on-screen at mount.

---

## 10. Adapting to a different client / industry

The system is industry-agnostic. To move it to a new client:

1. **Swap tokens (§7):** new accent hue + 3-stop gradient, new dark/light surfaces if the
   brand needs them, new sans/serif fonts. Keep the *roles* (impact sans, emotional serif,
   data mono).
2. **Re-skin the metadata, keep the habit.** A law firm gets `Est. 1994 · Bar No.…`; a
   studio gets `Lat/Long` or `Frame 014`; a SaaS gets `v2.4 · SOC 2`. The *act* of
   annotating is the constant.
3. **Re-cast the moves to the content,** don't transplant them. A restaurant's "menu" might
   use the horizontal-scroll move; an agency's "process" the sticky-wipe; a product's
   "features" the expanding accordion. Run the Method (§6) fresh each time.
4. **Keep the discipline:** one move per section, accent as punctuation, alternating
   surfaces, editorial offset layout, mobile fallback, reduced-motion. That discipline —
   not the construction theme — is what makes the originals look good.

If the new brand is genuinely playful/maximalist, you can raise the accent frequency and
loosen the layout — but do it deliberately, as a chosen deviation from this baseline, not
by accident.

---

## 11. Pre-ship checklist

- [ ] Exactly **one** signature move; everything else is calm.
- [ ] Eyebrow → two/three-tone headline → **offset** lead → move → optional closing line.
- [ ] Headline has one bright phrase, one muted phrase, **one** accent word.
- [ ] Accent appears only as punctuation (≈ one headline word + 2–3 small spots).
- [ ] Surface chosen to **alternate** with neighbouring sections.
- [ ] At least one piece of mono "annotation" metadata present.
- [ ] 3–4 kit-of-parts motifs used — not all of them, not zero.
- [ ] Numbers are padded two-digit; figures use `tabular-nums`.
- [ ] Entrances use masked rise / `expo.out` / `power3.out`; hovers ≤ 700ms.
- [ ] GSAP scoped to the section; heavy moves gated to `min-width: 768px`.
- [ ] A real **mobile fallback** exists (no pin/scrub) under 768px.
- [ ] `prefers-reduced-motion` respected (global block covers most; verify custom moves).
- [ ] Spacing is generous (`py-28 md:py-40`-ish); content lives in a `max-w` container.
- [ ] It would look at home next to the other sections **without** copying any of them.

---

## 12. One-paragraph prompt preamble (paste this when asking for a section)

> Build a `<SECTION>` for this site following `SECTION-DESIGN-SYSTEM.md`. Use the system,
> don't clone the reference sections. Inherit the site's existing palette, fonts and accent.
> Pick **one** signature scroll/interaction move that fits this content; keep everything else
> restrained. Use the standard anatomy (mono eyebrow → oversized two/three-tone display
> headline with a single accent word → offset lead paragraph → the move → optional closing
> line) on an asymmetric 12-column grid. Apply accent as punctuation only, alternate the
> surface against the neighbouring sections, add a few annotation/metadata details, animate
> with the house GSAP vocabulary (masked headline rise, scoped triggers, `expo.out`/
> `power3.out`), gate heavy moves to ≥768px with a plain stacked mobile fallback, and respect
> reduced motion. Run the pre-ship checklist before finishing.
