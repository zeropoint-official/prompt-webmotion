/**
 * The Website Templates category — complete, multi-page sites assembled and
 * ready to make your own. Unlike Components (single drop-in sections) or the
 * Toolkit (setup prompts), a template is one prompt that rebuilds an ENTIRE
 * site — every page, every section, the smooth scrolling and the scroll-video
 * hero — pixel-for-pixel, ready to rebrand.
 *
 * Each template's copy-paste prompt lives in content/prompts/<promptFile>.txt.
 */
export type TemplatePreview = {
  /** key into lib/demo-registry — the live preview rendered in an iframe */
  id: string;
  /** short label above the preview */
  label: string;
  /** one line describing what to do / look for in the preview */
  caption: string;
};

export type TemplateItem = {
  id: string;
  number: string;
  title: string;
  /** filename in content/prompts (without extension) */
  promptFile: string;
  /** short technical badges shown on the card + detail header */
  tags: string[];
  /** one line for the card */
  blurb: string;
  whatItIs: string;
  perfectFor: string;
  /** the pages / sections this template ships with */
  includes: string[];
  /** ordered "how to use this" steps */
  use: string[];
  /** the hero-video disclaimer — surfaced as a callout AND a how-to step */
  heroNote: string;
  goodToKnow?: string;
  /** preview image (public path) used on cards + detail header */
  thumb: string;
  /** live previews rendered on the detail page */
  previews: TemplatePreview[];
};

export const templates: TemplateItem[] = [
  {
    id: "mare-florida-estates",
    number: "W1",
    title: "Maré · Florida Luxury Estates",
    promptFile: "mare-florida-estates",
    tags: [
      "Next.js 16 · App Router",
      "Lenis smooth scroll",
      "Scroll-video hero",
      "4 pages",
    ],
    blurb:
      "A full multi-page luxury real-estate site — scroll-scrubbed hero, pinned services carousel, horizontal residences and more — rebuilt from one prompt, ready to rebrand.",
    whatItIs:
      "An entire production-ready website in a single prompt. Paste it into Claude Code in an empty folder and it rebuilds the complete Maré estate-agency site exactly as designed — Home, About, Services and Contact pages, the cinematic scroll-scrubbed canvas hero, a pinned vertical services carousel, a pinned horizontal residences scroll with a live price HUD, an accordion services section, testimonials, contact and footer — wired together with Lenis smooth scroll and framer-motion. Every file path, class name and line of copy is reproduced verbatim, so what you get is the finished site, not a rough starting point.",
    perfectFor:
      "Starting a high-end, motion-rich site from a finished design instead of a blank page. Real estate, architecture, hospitality, luxury brands — any project that wants an editorial, cinematic feel. Rebrand it for a client in an afternoon: swap the copy, the estate photography and the accent colour, regenerate the hero footage, and ship.",
    includes: [
      "Home — scroll-video hero, services carousel, featured residences, services accordion, about, testimonials, contact, footer",
      "About — page hero, team section, about",
      "Services — page hero, process, services accordion",
      "Contact — page hero, contact form",
      "Site-wide — fixed header with mobile drawer, Lenis smooth scroll, film-grain + scrim treatment",
    ],
    use: [
      "Open an EMPTY folder in Claude Code (the prompt scaffolds the whole project from scratch — don't run it over an existing app).",
      "Copy the entire prompt and paste it in as one message. It pins the exact stack (Next.js 16, React 19, Tailwind v4, framer-motion, Lenis) and creates every file with verbatim contents.",
      "Let it run end to end, then open localhost:3000 and scroll the home page — confirm the hero scrubs, the services carousel pins, and the residences scroll sideways.",
      "Rebrand it: replace the copy, point the image paths at your own estate photography, and swap the coastal-teal accent for yours.",
      "Regenerate the hero video for your brand (see the note below) — this is the one part you can't rebrand by editing text alone.",
    ],
    heroNote:
      "The opening hero is a scroll-scrubbed video — 145 still frames painted onto a <canvas>, not a normal section. You can freely edit the headline and eyebrow text laid over it, but to change the FOOTAGE itself you must regenerate the video and re-export its frames: (1) use Toolkit T2 “Hero Video Master Prompt” to write the start-frame, end-frame and motion prompts, generate the stills and feed them to a video model; (2) use Toolkit T3 “Scroll-Driven Background Video” to export the new clip to an image sequence with ffmpeg; (3) update the frame COUNT and path in the hero component to match. Plan for this step — swapping the hero is a regenerate-and-re-export job, not a text edit.",
    goodToKnow:
      "The prompt hosts its 18 source assets (1 hero video + 17 images) on a public Cloudflare R2 bucket and regenerates the 145 hero frames locally with ffmpeg, so you only ever host the video plus images, not 162 files. The single line you may want to change before publishing is ASSETS_BASE_URL, if you re-host the assets yourself. The heavy scroll moves (hero, services carousel, residences) are desktop-only by design; phones get clean stacked / snap-rail fallbacks. ffmpeg must be installed locally for the hero frame export.",
    thumb: "/thumbs/mare-hero-cover.webp",
    previews: [
      {
        id: "mare-hero",
        label: "01 · Scroll-video hero",
        caption:
          "Scroll inside the frame — your scroll scrubs the 145-frame canvas video, and the intro/outro copy cross-fades.",
      },
      {
        id: "mare-services",
        label: "02 · Services carousel",
        caption:
          "A pinned stage: property cards rise through the centre over a giant index while the list, copy and progress track the active service.",
      },
      {
        id: "mare-residences",
        label: "03 · Featured residences",
        caption:
          "The page turns sideways — full-viewport listings slide past a HUD with a live index and a cumulative price counter.",
      },
    ],
  },
];

export const templateCount = templates.length;

export function getTemplate(id: string): TemplateItem | undefined {
  return templates.find((t) => t.id === id);
}

export function getTemplateNeighbours(id: string): {
  prev: TemplateItem | null;
  next: TemplateItem | null;
} {
  const index = templates.findIndex((t) => t.id === id);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? templates[index - 1] : null,
    next: index < templates.length - 1 ? templates[index + 1] : null,
  };
}
