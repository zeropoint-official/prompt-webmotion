import { sectionCount } from "./library";
import { toolkitCount } from "./toolkit";

export type CategoryStatus = "live" | "soon";

export type Category = {
  id: "components" | "toolkit" | "hero-animations" | "templates";
  /** display name */
  name: string;
  /** one-line summary used on cards and in the sidebar */
  blurb: string;
  status: CategoryStatus;
  /** route for live categories / landing page for soon ones */
  href: string;
  /** live only — number of items available */
  count?: number;
  /** soon only — 1–2 sentence "what's coming" teaser */
  teaser?: string;
  /** soon only — short bullets describing what will ship */
  points?: string[];
  /** preview imagery (public paths) used for graphics on cards + pages */
  thumbs: string[];
};

/**
 * Top-level catalogue. Sits above the section `groups` in lib/sections.ts —
 * the Components category *is* that section library; the other two are the
 * upcoming expansions of the Web Motion Library.
 */
export const categories: Category[] = [
  {
    id: "components",
    name: "Components",
    blurb: "Drop-in animated sections — paste one prompt, get a polished block.",
    status: "live",
    href: "/library",
    count: sectionCount,
    thumbs: [
      "/thumbs/aperture-reveal.webp",
      "/thumbs/stacking-cards.webp",
      "/thumbs/horizontal-showcase.webp",
      "/thumbs/services-accordion.webp",
    ],
  },
  {
    id: "toolkit",
    name: "Toolkit",
    blurb:
      "The setup prompts and design files behind every site — scaffold, scroll-video, design system.",
    status: "live",
    href: "/toolkit",
    count: toolkitCount,
    thumbs: ["/thumbs/process-steps.webp", "/thumbs/horizontal-showcase.webp"],
  },
  {
    id: "hero-animations",
    name: "Hero Animations",
    blurb: "Full-screen opening moments that make the first scroll unforgettable.",
    status: "soon",
    href: "/hero-animations",
    teaser:
      "A growing set of cinematic hero sections — scroll-driven reveals, motion type, and signature opening animations — each as a single prompt you paste into Claude Code.",
    points: [
      "Scroll-driven and looping hero treatments",
      "Built for Lenis smooth scroll, like the components",
      "Brand-ready: swap your headline, image and colors in one message",
    ],
    thumbs: [
      "/ead4c28cd939424c8f29f838c14ccf44.jpg",
      "/601c40a413d94eebbe75c3461bd1b803.jpg",
    ],
  },
  {
    id: "templates",
    name: "Website Templates",
    blurb: "Complete, multi-section sites assembled and ready to make your own.",
    status: "soon",
    href: "/templates",
    teaser:
      "Entire websites — hero, showcase, services, testimonials, contact — wired together as one coherent template. Start from a finished site instead of a blank page.",
    points: [
      "Full multi-page layouts, not single sections",
      "Composed from the components you already know",
      "One prompt set to brand the whole site at once",
    ],
    thumbs: [
      "/ead4c28cd939424c8f29f838c14ccf44.jpg",
      "/7ccc276c4ac77835f99bda277e937c9f.jpg",
    ],
  },
];

export const liveCategories = categories.filter((c) => c.status === "live");
export const soonCategories = categories.filter((c) => c.status === "soon");
