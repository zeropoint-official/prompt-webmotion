# Effect Extraction Prompt

Run this **inside your other project** (the one that has the effect), in Claude Code or any
agent that can read that codebase. Replace the one line in `<< >>`. It produces an "Effect
Capsule" — paste that whole capsule back into the section-library chat and it gets added to
the library.

---

You are extracting ONE self-contained visual effect / section from THIS codebase so it can be
rebuilt as a standalone, reusable component in a different Next.js project. Accuracy matters more
than speed: I will rebuild from your output alone, so do not guess — read the real files.

## The effect I want
<< Describe the effect in one line. e.g. "the hero text that splits and slides apart on scroll",
   "the cards that stack and pin on the services page", "the image hover-distortion in the gallery" >>

## Step 1 — Find it (don't skip)
- Locate every file that contributes to this effect: the component(s), the animation logic, any
  hook, any CSS/Tailwind, any GSAP/Framer/Lenis/canvas/shader setup, and where it's mounted.
- READ them fully. Quote real line numbers in your head — do not reconstruct from memory.
- If it spans multiple files, follow the imports until you have the complete picture.

## Step 2 — Genericize it
- Strip ALL business-specific content: copy, brand names, real image paths, hardcoded colors that
  are clearly "our brand". Turn each into a typed prop with a sensible placeholder default.
- Replace hardcoded design values (colors, fonts) with CSS variables that have fallbacks, exactly
  like: `var(--color-accent, #d4b46a)`. List every variable you introduce.
- Keep the MOTION exactly as-is — easings, durations, scrub values, stagger, start/end triggers,
  thresholds. The animation is the whole point; do not "clean it up" or approximate it.
- Inline any tiny helper so the component is copy-paste standalone. If a real external dependency
  is required (gsap, framer-motion, lenis, three, etc.), keep it and list it.

## Step 3 — Output the Effect Capsule
Output ONLY the capsule below, filled in. Use real values from the code, not invented ones.

```
### CAPSULE: <short Title Case name of the effect>

ONE-LINER: <plain-English what a visitor sees, 1 sentence>

TECH TAGS: <3-4 short badges, e.g. "GSAP + ScrollTrigger", "Scroll-pinned", "Static on mobile", "Canvas">

WHAT IT IS: <2-3 sentences, plain language, no code>

PERFECT FOR: <who/what kind of site + where on the page it goes>

PREPARE (what the user must supply): 
- <e.g. one landscape image>
- <e.g. a headline + 2 supporting lines>
- <...>

DEPENDENCIES: <npm packages, exact names; or "none">

DESIGN TOKENS / CSS VARIABLES:
<list each var(--x, fallback) you used, with a 1-line description>

MOBILE BEHAVIOR: <what happens < 768px — animates? static? disabled? why>

CRITICAL RULES (things that break it if changed):
- <e.g. "outer relative wrapper required for GSAP pin-spacer">
- <e.g. "don't animate clip-path on mobile">
- <... only real ones you can see in the code>

PREVIEW FRAME: <one of: runway (scroll-pinned, mid-page) | plain (full section, renders as-is) | centered (small, center of viewport)>  +  suggested page background hex

COMPONENT (standalone, props-based, "use client" if it uses hooks/animation):
```tsx
<the full genericized component code>
```

DEMO USAGE (how to mount it with realistic sample props):
```tsx
<minimal example: import + the component with filled-in sample props>
```
```

## Rules
- Do NOT include anything project-specific or secret (no API keys, no internal URLs, no real customer data).
- If the effect can't be cleanly separated (too entangled with app state/data), say so explicitly and
  describe what it would take, rather than emitting broken code.
- One effect per capsule. If I named more than one, ask which to do first.
