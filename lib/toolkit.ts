/**
 * The Toolkit category — the setup prompts and design files behind every build.
 * Unlike Components (drop-in animated sections), these are the foundational
 * "prompts I actually use to make these websites": scaffold a project, build a
 * scroll-driven background video, design original sections from a system file.
 *
 * Two kinds of item:
 *  - "prompt" → a copy-paste prompt stored in content/prompts/<promptFile>.txt
 *  - "file"   → a downloadable reference document living in /public
 */
export type ToolkitItem = {
  id: string;
  number: string;
  title: string;
  kind: "prompt" | "file";
  /** short technical badges shown on the card + detail header */
  tags: string[];
  /** one line for the card */
  blurb: string;
  whatItIs: string;
  perfectFor: string;
  /** ordered "how to use this" steps */
  use: string[];
  goodToKnow?: string;
  /** preview image (public path) */
  thumb: string;

  /** kind === "prompt" — filename in content/prompts (without extension) */
  promptFile?: string;

  /** kind === "file" — public path + suggested filename for download */
  downloadPath?: string;
  downloadName?: string;
};

export const toolkitItems: ToolkitItem[] = [
  {
    id: "nextjs-setup",
    number: "T1",
    title: "Start a Next.js Project",
    kind: "prompt",
    promptFile: "nextjs-setup",
    tags: ["create-next-app", "Latest version", "Run from an empty folder"],
    blurb:
      "Scaffold the latest Next.js, then move it out of my-app into your working folder — one prompt, clean root.",
    whatItIs:
      "The very first prompt of any build. It tells Claude Code to scaffold a fresh project on the latest version of Next.js (TypeScript, Tailwind, App Router — the stack this whole library assumes), and then do the annoying part automatically: because create-next-app scaffolds into its own my-app/ sub-folder, the prompt moves every file — hidden dotfiles included — up into the folder you're actually working in, and deletes the empty my-app/.",
    perfectFor:
      "The blank-folder moment at the start of every new website. Open an empty project folder, run this once, and you have a clean Next.js app running at localhost:3000 — ready for the components and hero animations from the rest of the library.",
    use: [
      "Open an empty project folder in Claude Code (a fresh git repo is fine — the prompt preserves your .git history).",
      "Paste the prompt as-is. No customization needed for a standard build.",
      "Let it run: it scaffolds into my-app/, moves everything up to the root, removes my-app/, installs, and starts the dev server.",
      "Confirm it reports the installed Next.js version and that localhost:3000 loads cleanly.",
    ],
    goodToKnow:
      "The prompt deliberately pulls Next.js with the `latest` tag instead of a pinned version, and it refuses to overwrite real files — if your folder isn't empty it stops and asks. If your repo uses pnpm or yarn, the prompt detects the lockfile and uses the right package manager.",
    thumb: "/thumbs/process-steps.jpg",
  },
  {
    id: "hero-video-masterprompt",
    number: "T2",
    title: "Hero Video Master Prompt",
    kind: "prompt",
    promptFile: "hero-video-masterprompt",
    tags: ["ChatGPT / any LLM", "Start + end frames", "Kling · Veo / Flow"],
    blurb:
      "A master prompt you paste into ChatGPT to get three ready-to-use prompts — start frame, end frame, and the motion between them — for a scroll-scrubbed hero video.",
    whatItIs:
      "The prompt that writes your prompts. Scroll-driven hero videos (the T3 effect) live or die on continuity: the start and end frames have to read as two moments of the same unbroken shot. Writing those by hand is fiddly, so this is a 'master prompt' you hand to a chatbot instead. You paste it into ChatGPT (or any capable LLM), fill in a few blanks describing the shot you want, and it returns exactly three copy-paste blocks — a START FRAME still prompt, an END FRAME still prompt, and an ANIMATION motion prompt — engineered to stay perfectly consistent across subject, camera, lighting and palette.",
    perfectFor:
      "Producing the source footage for a scroll-driven background video without being a prompt engineer yourself. Any hero moment built around a single continuous transformation — a product forming, a camera pushing in, a logo assembling, a landscape shifting from day to night.",
    use: [
      "Open this prompt, copy the whole thing, and paste it into a chatbot of your choice — ChatGPT works best, but any capable LLM is fine.",
      "Edit only the bits inside the {{ }} brackets to describe your shot (subject, start state, end state, camera move, setting, lighting, mood). Leave any blank you don't care about — it will decide for you. Optionally attach reference image(s) and it will match their design.",
      "Send it. The chatbot returns three labelled blocks: START FRAME, END FRAME, and ANIMATION — nothing else.",
      "Take the START and END frame prompts to an image-generation tool (ChatGPT's own image generator, Midjourney, Flux, etc.) and generate the two stills.",
      "Feed those two stills, plus the ANIMATION prompt, into a start-+-end-frame video model (Kling or Google Veo / Flow) to produce the clip.",
      "Bring the finished video back here and run the T3 'Scroll-Driven Background Video' prompt to wire it up as a scroll-scrubbed hero.",
    ],
    goodToKnow:
      "The whole point is continuity — it restates the shared visual details in both frame prompts so the two stills look like the same shot, and keeps the motion to ONE move with no cuts (which is what scroll-scrubbing needs). It deliberately keeps text, logos and watermarks out of the frames; add your branding on the website afterwards where it stays crisp. If you attach reference images, treat them as the source of truth and tell your image tool to generate each frame from that reference.",
    thumb: "/thumbs/aperture-reveal.jpg",
  },
  {
    id: "scroll-video",
    number: "T3",
    title: "Scroll-Driven Background Video",
    kind: "prompt",
    promptFile: "scroll-video",
    tags: ["ffmpeg frames", "Canvas + GSAP", "Lenis (desktop only)"],
    blurb:
      "Export a video to frames with ffmpeg, then scrub it on a canvas locked to scroll — Apple-style, desktop + mobile.",
    whatItIs:
      "The product-page effect: a background video that plays forwards and backwards exactly as you scroll, like the Apple iPhone / AirPods pages. It doesn't scrub a real <video> (that's janky) — the prompt has Claude Code export your video to a high-quality image sequence with ffmpeg, then paint the right frame onto a <canvas> for the current scroll position. Hand it one video or two (a landscape desktop cut and a portrait mobile cut) and it builds both, picking the right set by screen size. Lenis smooth scroll is wired in on desktop only to make the scrubbing buttery.",
    perfectFor:
      "A signature hero or mid-page 'wow' moment built around motion footage — a product turning, a drone shot, a process unfolding, a logo forming. Anywhere you'd otherwise drop a muted autoplay loop, but want it tied to the scroll instead.",
    use: [
      "Put your source video(s) where Claude Code can reach them and name them (e.g. desktop.mp4, optional mobile.mp4).",
      "Paste the prompt and tell it which file is desktop and which is mobile.",
      "It runs ffmpeg to export frames into public/frames/... at the highest quality, and reports the exact frame COUNT for each set.",
      "It drops in the ScrollVideo component and the desktop-only Lenis provider, hard-coding those frame counts.",
      "Open localhost:3000, scroll the section up and down, and confirm the video tracks your scroll on both desktop and mobile widths.",
    ],
    goodToKnow:
      "Every frame is downloaded by the browser, so the prompt keeps each set to roughly 120–300 frames (re-exporting at a lower fps if a clip is long). For absolute maximum quality you can ask it to export PNG instead of JPEG, at the cost of a much heavier frame folder. Needs ffmpeg installed locally (brew install ffmpeg on macOS). It respects reduced-motion by falling back to a single static frame.",
    thumb: "/thumbs/horizontal-showcase.jpg",
  },
  {
    id: "design-system",
    number: "T4",
    title: "Section Design System",
    kind: "file",
    downloadPath: "/SECTION-DESIGN-SYSTEM.md",
    downloadName: "SECTION-DESIGN-SYSTEM.md",
    tags: ["Markdown brief", "Drop into your repo", "Reusable across clients"],
    blurb:
      "A design-brief .md you add to your project, then reference so Claude builds original, editorial sections — not generic cards.",
    whatItIs:
      "Not a prompt — a reusable design brief, as a single Markdown file. It captures the principles behind the standout 'editorial / architectural' sections (one hero move per section, accent as punctuation, oversized type, annotation metadata, the GSAP house style) without being a library of layouts to copy. You install the file into your project once, then point Claude Code at it whenever you ask for a new section, and it designs something original that still feels like it belongs to the same confident family.",
    perfectFor:
      "Getting bespoke, on-brand sections instead of the same three-icon grid every time. Any build where you want a custom Services / About / Stats / Team section that matches the polish of the components in this library but isn't a clone of any of them.",
    use: [
      "Download or copy the file, then add it to your project (the repo root or a /docs folder is ideal).",
      "Tell Claude Code it's there once: 'Read SECTION-DESIGN-SYSTEM.md and follow it for the sections I ask for.'",
      "Then just ask for sections naturally, e.g. 'Create me a services section following SECTION-DESIGN-SYSTEM.md so it gets a unique layout — inherit my site's colours and fonts.'",
      "Claude reads the brief, runs its build method (pick one signature move, lay the anatomy, dress with a few motifs, keep the accent rare), and ships an original section with a mobile fallback.",
    ],
    goodToKnow:
      "The system is industry-agnostic — it tells Claude to inherit YOUR site's palette, fonts and accent rather than imposing the reference project's gold-and-ink theme. The last section of the file is a one-paragraph preamble you can paste straight into a request. Keep the file in the repo so every future section request stays consistent.",
    thumb: "/thumbs/services-accordion.jpg",
  },
];

export const toolkitCount = toolkitItems.length;

export function getToolkitItem(id: string): ToolkitItem | undefined {
  return toolkitItems.find((item) => item.id === id);
}

export function getToolkitNeighbours(id: string): {
  prev: ToolkitItem | null;
  next: ToolkitItem | null;
} {
  const index = toolkitItems.findIndex((item) => item.id === id);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? toolkitItems[index - 1] : null,
    next: index < toolkitItems.length - 1 ? toolkitItems[index + 1] : null,
  };
}
