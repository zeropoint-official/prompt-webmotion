export type Section = {
  id: string;
  number: string;
  title: string;
  /** filename in content/prompts (without extension) */
  promptFile: string;
  /** short technical badges shown on the card */
  tags: string[];
  whatItIs: string;
  perfectFor: string;
  prepare: string[];
  goodToKnow?: string;
  /** optional per-section Step 1 message; falls back to CUSTOMIZATION_TEMPLATE */
  customize?: string;
};

export type Group = {
  id: string;
  name: string;
  /** one short line shown on the home glance row and library filter tabs */
  blurb: string;
  sections: Section[];
};

export const CUSTOMIZATION_TEMPLATE = `Integrate the following section into my site, placing it [where on the page].
Replace ALL placeholder text and images with content for my project:
[1-2 sentences about your business/site].
My images are in [folder/paths]. Match the section's colors and fonts
to my site's existing design.

[PASTE THE FULL SECTION PROMPT HERE]`;

export const groups: Group[] = [
  {
    id: "project-showcases",
    name: "Project Showcases",
    blurb: "Show off your work — pick one or two, not all four.",
    sections: [
      {
        id: "aperture-reveal",
        number: "1.1",
        title: "Aperture Reveal",
        promptFile: "aperture-reveal",
        tags: ["GSAP + ScrollTrigger", "Scroll-pinned", "Static on mobile"],
        whatItIs:
          "A full-screen moment where one signature image opens up from a thin slit to fill the screen — like a camera aperture opening — while giant ghost words drift behind it. The section pins in place while the visitor's scroll drives the reveal.",
        perfectFor:
          "Showing off ONE hero image that deserves the spotlight. Real estate, architecture, restaurants, hotels, fashion, product launches. Place it right after your hero section as the “second wow.”",
        prepare: [
          "One stunning landscape-format image (this section lives or dies on image quality — use your best shot or generate one with AI)",
          "A short “eyebrow” label (e.g. “The Collection”)",
          "One big ghost word (e.g. “RESIDENCES”) and a small echo word (e.g. “· cyprus ·”)",
          "A two-line caption",
        ],
        goodToKnow:
          "On mobile this section is intentionally static (no animation) — that's by design, scroll-pinning on phones causes jank. Also: it uses GSAP and works beautifully with the Lenis smooth scroll from the hero lesson — the prompt already includes the wiring instructions.",
      },
      {
        id: "stacking-cards",
        number: "1.2",
        title: "Stacking Cards",
        promptFile: "stacking-cards",
        tags: ["GSAP + ScrollTrigger", "Scroll-pinned", "3–6 items"],
        whatItIs:
          "A scroll-pinned showcase where full-screen project cards slide up and stack on top of each other, one per scroll. Each card has a big image, a title, three metrics (like area / rooms / year), a price, and a link.",
        perfectFor:
          "Portfolios with 3–6 items: properties, projects, products, case studies, menu highlights. This is your “here's what we've made” section.",
        prepare: [
          "3–6 items, each with: a cover image, name, one-line subtitle, location/tag, three metrics, and a price or key figure",
          "A page or route each card should link to (or tell Claude Code to make them non-clickable for now)",
        ],
        goodToKnow:
          "Stick to 3–6 cards — the prompt itself says it best: “2 feels accidental, 7 is a slog.” Every field on the card gets displayed, so fill them all with real data. Like Aperture Reveal, it's static-stacked on mobile on purpose.",
      },
      {
        id: "horizontal-showcase",
        number: "1.3",
        title: "Horizontal Projects Showcase",
        promptFile: "horizontal-showcase",
        tags: ["Horizontal scroll", "Stats strip", "Vertical list on mobile"],
        whatItIs:
          "The page turns sideways: a full-screen horizontal gallery where each project takes the whole viewport, with a live counter (“02 / 04”), clickable dots, and a progress bar. Above it sits a stats strip with your headline numbers.",
        perfectFor:
          "Construction companies, agencies, studios — anyone with 3–5 flagship projects and impressive numbers to show next to them (years in business, projects completed, total value delivered).",
        prepare: [
          "3–5 projects: name, type, city, image, a value/figure, a one-line detail, and a 1–2 sentence description",
          "Four headline stats for the strip (e.g. “200+ projects”, “27 yrs”, “98% on time”)",
        ],
        goodToKnow:
          "The demo content is filled with Unsplash stock photos — make sure your customization message tells Claude Code to swap in YOUR images, or AI-generate project shots that match your brand. On mobile, the horizontal scroll gracefully becomes a vertical list.",
      },
      {
        id: "before-after-slider",
        number: "1.4",
        title: "Before / After Comparison Slider",
        promptFile: "before-after-slider",
        tags: ["Interactive drag", "Touch-ready", "shadcn"],
        whatItIs:
          "Two images stacked on top of each other with a draggable handle in the middle — visitors drag left and right to reveal the “before” and “after.” Simple, interactive, and weirdly addictive.",
        perfectFor:
          "Renovations, cleaning services, design work, restorations, fitness — any business whose entire pitch is a transformation. It's the interactive sibling of the Before/After hero animation from the hero lessons.",
        prepare: [
          "Two images of the exact same scene — same angle, same framing. This is non-negotiable: if the framing doesn't match, the slider effect falls apart.",
          "💡 Pro move: you already know how to make perfectly matched before/after pairs — it's the same start frame / end frame technique from the hero lesson. Generate the “after” using the “before” as a reference image.",
        ],
        goodToKnow:
          "The demo uses placeholder screenshot images from the web — replace both with your own pair. Works with both mouse drag and touch out of the box.",
      },
      {
        id: "fan-out-card",
        number: "1.5",
        title: "Fan-Out Card",
        promptFile: "fan-out-card",
        tags: ["GSAP", "Hover (tap on mobile)", "Photo deal-out"],
        whatItIs:
          "A tall photo card with a hidden stack of smaller 'prints' tucked behind it. On hover the prints deal out into a fan — one up, two to each side — with a springy back-ease overshoot and a staggered start, while the front image scales up a touch. Move away and they snap back behind the card.",
        perfectFor:
          "A showcase or gallery grid where each card represents a project, a package, or a place that has more than one photo to show. Great for studios, photographers, venues, real estate — anywhere a single thumbnail undersells what's behind it.",
        prepare: [
          "One main 'front' image for the card (portrait, 2:3 works best)",
          "Up to five smaller 'print' images that deal out from behind it",
          "Optionally a title, a short tagline, and a link for the card",
        ],
        goodToKnow:
          "On touch devices (no hover) the first tap fans the prints instead of following the link, so phone users still see the effect. The fan offsets are calibrated for a ~300px-wide card; if you change the card width and the prints fan too far or not enough, pass your own `fan` offsets via the prop. Note the card has no clipping, so the prints fan OUTSIDE its bounds — leave breathing room around it in your layout.",
      },
      {
        id: "parallax-stacking-projects",
        number: "1.6",
        title: "Parallax Stacking Projects",
        promptFile: "parallax-stacking-projects",
        tags: ["GSAP + ScrollTrigger", "Scroll-peel stack", "3–5 projects"],
        whatItIs:
          "A scroll-driven project stack inside one framed window: each full-screen project image peels downward as you scroll to reveal the next, while its title, year and tags stay pinned. The last project holds as the final frame. On desktop the image rests dimmed and brightens on hover.",
        perfectFor:
          "A portfolio or “selected work” section with 3–5 flagship projects — studios, agencies, web designers, architecture. A more cinematic alternative to a project grid.",
        prepare: [
          "3–5 projects, each with: a wide cover image, a title, a year, optional tags, and a link",
          "A section heading (e.g. “Selected Work”)",
        ],
        goodToKnow:
          "Built on GSAP + ScrollTrigger and feels best with Lenis smooth scroll (optional). The whole effect relies on `contain: paint` clipping each card, plus three `.proj-*` global CSS classes for the desktop resting opacity and hover — both are included in the prompt. Mobile automatically switches to a half-height, centered-image layout. Reduced motion is handled by skipping Lenis at the page level; the scroll-scrub itself still runs.",
        customize: `Integrate the Parallax Stacking Projects section into my site, placing it [where on the page — e.g. right after my hero].

Use these projects (each one peels away on scroll to reveal the next — 3–5 works best, and the last one is the resting frame):
1. [Title] · [Year] · tags: [Web Design, Branding] · opens [https://…] · cover image: [/projects/one.jpg]
2. [Title] · [Year] · tags: [Web Development] · opens [https://…] · cover image: [/projects/two.jpg]
3. [Title] · [Year] · tags: [E-commerce] · opens [https://…] · cover image: [/projects/three.jpg]

Use wide / landscape cover images (portrait crops hard). Section heading: [e.g. "Selected Work"].
Theme: [light / dark]. Match the fonts to my site (set --font-monument / --font-geist-mono, or keep the fallbacks).
Install gsap if it isn't already, and add the required .proj-* classes to my global stylesheet.

[PASTE THE FULL SECTION PROMPT HERE]`,
      },
    ],
  },
  {
    id: "services-process",
    name: "Services & Process",
    blurb: "Explain what you do and how you do it.",
    sections: [
      {
        id: "services-accordion",
        number: "2.1",
        title: "Services Accordion",
        promptFile: "services-accordion",
        tags: ["Framer Motion", "Light background", "3–5 services"],
        whatItIs:
          "Your services listed as elegant rows. Click one and it expands into a full-width panel with a hero image, a giant headline, and a key stat — while the others collapse. One service is always “in focus.”",
        perfectFor:
          "Any business with 3–5 distinct services: construction, agencies, consultancies, studios. This is your “What We Do” section, just far better looking than a grid of three icons.",
        prepare: [
          "3–5 services, each with: a name, a short kicker label, a two-part headline, a 1–2 sentence description, one stat with a label, and a strong background image",
          "A section headline (e.g. “What we build.”)",
        ],
        goodToKnow:
          "This one uses a light/white background by default while most other sections in this library are dark — decide which world your site lives in and tell Claude Code to match the section to it. Swap the Unsplash placeholders for your own photos.",
      },
      {
        id: "process-steps",
        number: "2.2",
        title: "Process Steps",
        promptFile: "process-steps",
        tags: ["Sticky image stack", "No extra packages", "3–5 steps"],
        whatItIs:
          "A “how we work” walkthrough where the step descriptions scroll on one side while the matching image sticks and swaps on the other. As the visitor scrolls through step 01 → 04, the visuals follow along automatically.",
        perfectFor:
          "Explaining your process or methodology: how a project runs from first call to handover, how onboarding works, how an order is fulfilled. Trust is built here — people buy from businesses whose process they can picture.",
        prepare: [
          "3–5 steps, each with: a number, a stage label, a punchy title, a 2–3 sentence body, three bullet points, and an image",
        ],
        goodToKnow:
          "Write the step titles like statements, not labels — “It starts on paper, not on site.” beats “Step 1: Planning.” The demo copy in the prompt is a masterclass in this tone; match its energy with your own content.",
      },
    ],
  },
  {
    id: "testimonials-numbers",
    name: "Testimonials & Numbers",
    blurb: "Numbers and voices that make visitors believe you.",
    sections: [
      {
        id: "animated-testimonials",
        number: "3.1",
        title: "Animated Testimonials",
        promptFile: "animated-testimonials",
        tags: ["Auto-cycling", "shadcn", "Logo row optional"],
        whatItIs:
          "A rotating testimonial showcase — quote cards with star ratings, client photos, names, and roles that auto-cycle with smooth slide animations, plus an optional “trusted by” logo row underneath.",
        perfectFor:
          "Any site, honestly. If you have even 3 happy clients, this section earns its place. Put it after your showcase sections, before the FAQ.",
        prepare: [
          "3–5 testimonials: the quote, client name, role, company, and a photo",
          "Optionally: a list of company names for the “trusted by” row",
        ],
        goodToKnow:
          "The demo uses fake people with fake faces from a placeholder service. Never ship those. Use real client photos (with permission), or tell Claude Code to use initials-only avatars instead — that looks professional and avoids the fake-face problem entirely. Real quotes only; invented testimonials will eventually burn you.",
      },
      {
        id: "animate-number",
        number: "3.2",
        title: "Animated Stat Numbers",
        promptFile: "animate-number",
        tags: ["Component, not section", "Zero dependencies", "Respects reduced motion"],
        whatItIs:
          "Not a full section — a small, reusable component that makes numbers feel alive. When a number changes, only the digits that change slide and blur into place, exactly like iOS animations. “1,199” ticking to “1,200” animates just the last digits.",
        perfectFor:
          "Upgrading numbers anywhere on your site: stats strips, counters, prices, dashboards. Pair it with the Horizontal Projects Showcase stats strip or sprinkle it into any section with figures.",
        prepare: [
          "Nothing — just know which numbers on your page deserve the treatment",
        ],
        goodToKnow:
          "This is a component, not a section, so your customization message should say where to use it, e.g.: “Use this AnimateNumber component for the four stats in my projects section, animating them when they scroll into view.” It has zero dependencies and even respects users who turn off motion in their system settings.",
      },
      {
        id: "stagger-testimonials",
        number: "3.3",
        title: "Stagger Testimonials",
        promptFile: "stagger-testimonials",
        tags: ["Zero dependencies", "CSS transforms", "Click-to-center"],
        whatItIs:
          "A row of testimonial cards fanned out in a staggered arc. The centred card pops forward — lifted, ivory, with a hard offset shadow — while the others tilt away to the sides. Click a side card (or use the arrows) and a new one eased-slides into the centre as the whole fan re-shuffles. Each card has a clipped corner, a 45° accent line and a monogram initial for a 'ticket' look.",
        perfectFor:
          "A testimonials, reviews or quotes section on a marketing or studio site. It looks best mid-page on a warm-dark band, where the ivory centre card really pops. Works with any number of quotes — odd counts centre most cleanly.",
        prepare: [
          "Three or more short testimonials, each with the quote and the person's name (the first letter becomes the monogram)",
          "Keep quotes punchy — the cards are square, so very long quotes need a bigger card or smaller text to avoid overflow",
        ],
        goodToKnow:
          "Zero dependencies — pure React state + a 500ms CSS transition does all the motion. On phones (<640px) the fan can't breathe, so only the centre card shows and the arrows rotate through it; the full fan returns on tablet and up. The reorder animates because items are re-keyed on every move — that's load-bearing, not a quirk.",
      },
    ],
  },
  {
    id: "faq-contact",
    name: "FAQ & Contact",
    blurb: "Answer last doubts and capture the lead.",
    sections: [
      {
        id: "faq-accordion",
        number: "4.1",
        title: "FAQ Accordion",
        promptFile: "faq-accordion",
        tags: ["Animated accordion", "Every site needs one"],
        whatItIs:
          "A clean, animated frequently-asked-questions list — click a question, the answer smoothly expands, the others close.",
        perfectFor:
          "Every site. FAQs quietly handle objections (“How long does it take?”, “What does it cost?”, “Do you work in my area?”) so the visitor doesn't leave to go find answers elsewhere. Place it just before the contact section.",
        prepare: [
          "4–8 real questions with honest answers. Steal them from your actual client conversations — the questions people ask you on calls are the questions to answer here.",
        ],
      },
      {
        id: "contact-footer",
        number: "4.2",
        title: "Contact Section + Footer",
        promptFile: "contact-footer",
        tags: ["Glassmorphism form", "Footer included", "Form is a demo"],
        whatItIs:
          "The closer: a split layout with your pitch and contact details on the left, a frosted-glass enquiry form on the right (name, phone, email, project type, message), a satisfying animated success state after sending — and a complete site footer built in.",
        perfectFor: "The last section of literally any site in this course.",
        prepare: [
          "Your real phone, email, and location",
          "The project-type options for the dropdown (e.g. “Residential / Commercial / Renovation”)",
          "Footer details: company name, one-line description, nav links",
        ],
        goodToKnow:
          "This one matters: out of the box, the form is a demo. It plays the success animation but doesn't actually send anything anywhere — there's a placeholder where the real sending logic goes. Getting your form submissions to your inbox is its own small topic, and we cover it in a later lesson. For now, integrate the section, fill in your real contact details, and know that the phone/email links work immediately even if the form doesn't yet.",
      },
    ],
  },
  {
    id: "text-headlines",
    name: "Text & Headlines",
    blurb: "Make the words themselves the animation.",
    sections: [
      {
        id: "scroll-text-reveal",
        number: "5.1",
        title: "Scroll Text Reveal",
        promptFile: "scroll-text-reveal",
        tags: ["Framer Motion", "Scroll-scrubbed", "Text-only"],
        whatItIs:
          "A statement paragraph that starts dim and brightens one word at a time as the visitor scrolls through it — the reading pace and the scroll become the same motion. No images, no pinning, just type that earns attention.",
        perfectFor:
          "A mission statement, manifesto, or single big idea you want to land slowly. Drop it between two heavier sections as a calm, confident breather — agencies, studios, editorial and brand sites especially.",
        prepare: [
          "One punchy paragraph — roughly 20–40 words. Shorter and sharper reads better than long and explanatory.",
          "An optional short eyebrow label (e.g. “Our Philosophy”)",
        ],
        goodToKnow:
          "Pure Framer Motion (already in the stack) — no GSAP, no pinning, so it plays nicely with smooth scroll and works the same on mobile as on desktop. The generous py-[40vh] spacing is intentional: it gives the words room to reveal across a comfortable scroll distance. Tighten it only if the paragraph is very short.",
      },
      {
        id: "scatter-manifesto",
        number: "5.2",
        title: "Scatter Manifesto",
        promptFile: "scatter-manifesto",
        tags: ["GSAP + ScrollTrigger", "Framer Motion", "Scroll-scrubbed", "Text-only"],
        whatItIs:
          "A full-screen manifesto moment built from two layered motions. A cream panel tilts back and straightens as it locks into place over the section below, while inside it your statement is shattered into words that fly in from deep 3D space — each from a random depth, angle and offset — and resolve, in a shuffled order, to their resting positions as you scroll.",
        perfectFor:
          "One bold belief, mission line or manifesto you want to land with weight — studios, agencies, brand and editorial sites. It's a heavier, more cinematic cousin of Scroll Text Reveal; use it as a full-screen statement beat rather than a quiet in-line breather.",
        prepare: [
          "One punchy statement — roughly 20–40 words. The shorter and sharper, the better the words settle.",
        ],
        goodToKnow:
          "Two motions, two libraries: Framer Motion drives the panel tilt/scale, GSAP + ScrollTrigger drives the per-word scatter (via the `split-type` package — install it, it isn't in the base stack). The section is intentionally tall (300vh) so the scatter has room to scrub across; shortening it makes the words resolve almost at once. The panel tilt respects prefers-reduced-motion (it stays flat), and it reads best sitting over a darker section so the cream panel and its top shadow pop.",
        customize: `Integrate the Scatter Manifesto section into my site, placing it [where on the page — e.g. between my showcase and services as a full-screen statement beat].

Use this statement (keep it to ~20–40 words — short and sharp settles best):
"[Your one bold belief / mission line / manifesto here.]"

Theme: [light cream panel with dark text — the default — or give me a dark panel]. Match the font to my site (it reads the --font-inter variable, or set your own).
Install split-type if it isn't already, alongside gsap and framer-motion.

[PASTE THE FULL SECTION PROMPT HERE]`,
      },
    ],
  },
  {
    id: "hero-sections",
    name: "Hero Sections",
    blurb: "Opening moments that make the first scroll unforgettable.",
    sections: [
      {
        id: "scatter-hero",
        number: "6.1",
        title: "Scatter Hero",
        promptFile: "scatter-hero",
        tags: ["GSAP + ScrollTrigger", "Sticky scroll hero", "Letter-by-letter reveal"],
        whatItIs:
          "A full-screen opening where six photos sit in a collage. As you scroll, the side photos fly off-screen and the top images scroll away, while the bottom-center photo zooms up to fill the screen and your brand name rises in letter-by-letter over it. That photo then sticks in place and darkens as your next section scrolls up to take over.",
        perfectFor:
          "The very top of a brand-led site with a handful of striking photos — studios, architecture, fashion, hospitality, agencies. It's the first thing visitors see, so it sets the whole tone.",
        prepare: [
          "Six images: four portrait shots for the corners, one wide banner image for the top-centre, and one strong landscape photo for the bottom-center centrepiece (the one that zooms to full screen)",
          "A headline, your brand name (for the letter-by-letter reveal), and a CTA label + link",
          "The next section of your page — it scrolls up over the photo and triggers the darken",
        ],
        goodToKnow:
          "Two things matter most. First, you MUST pass your next section as children of <ScatterHero> — the darken-on-handoff only fires when there's content overlapping the sticky photo; without it the second half of the effect is skipped (by design). Second, the bottom-center `hero` tile is the centrepiece that zooms to full screen — give it your strongest landscape shot. It also respects prefers-reduced-motion: visitors with that setting see the finished end-state (full-screen photo + title) with no scrubbing. Both desktop and mobile animate; the corner tiles simply shrink on smaller screens.",
      },
      {
        id: "aperture-reveal-hero",
        number: "6.2",
        title: "Aperture Reveal Hero",
        promptFile: "aperture-reveal-hero",
        tags: ["GSAP + CustomEase", "Hosts Lenis", "Scroll-locked entrance", "Letter stagger"],
        whatItIs:
          "A cinematic on-load entrance. A small centred photo opens from a thin letterbox slit, settles from a slow push-in (Ken Burns), then auto-expands to full-bleed while an ink scrim fades in and the headline rises in letter-by-letter. The page is scroll-locked from the first paint and only released when the entrance finishes (~2.4s). With more than one image, they crossfade behind the headline.",
        perfectFor:
          "Luxury, portfolio, case-study or editorial sites. Use it at the very top of the page (or as the opening of a project-detail page) when you want an uninterrupted, deliberate intro before the visitor can scroll.",
        prepare: [
          "One to three landscape hero images — the same set feeds the entrance Ken-Burns and the crossfade carousel",
          "One headline string (the H1)",
        ],
        goodToKnow:
          "This hero HOSTS your page's Lenis smooth-scroll and locks scrolling until the entrance completes — so it must be the page's scroll owner; don't also set up Lenis elsewhere. It needs the `lenis` package (plus gsap + gsap/CustomEase) and a one-line inline script in your root layout's <head> that adds a `js` class to <html>, which prevents a reload flash. It comes with its own CSS Module. Reduced-motion visitors get a static, full-bleed hero with everything already visible — never a locked page.",
      },
    ],
  },
];

export type Tool = {
  name: string;
  tagline: string;
  body: string;
  note?: string;
  href: string;
  linkLabel: string;
  commands?: { label: string; command: string }[];
};

export const tools: Tool[] = [
  {
    name: "Cursor",
    tagline: "Code editor",
    body: "Our main editor. It's a code editor built on VS Code, and we reach for it because it's simple to get going with — everything else runs inside it.",
    href: "https://cursor.com",
    linkLabel: "cursor.com",
  },
  {
    name: "Claude Code",
    tagline: "AI that writes the code",
    body: "This is what actually writes the code. We run it in a terminal, usually right inside Cursor, and hand it the prompts from this library. Open the setup page for the full walkthrough, or paste the command for your system below to install it.",
    note: "Paid subscription required.",
    href: "https://docs.claude.com/en/docs/claude-code/setup",
    linkLabel: "Read the install guide",
    commands: [
      {
        label: "macOS / Linux",
        command: "curl -fsSL https://claude.ai/install.sh | bash",
      },
      {
        label: "Windows (PowerShell)",
        command: "irm https://claude.ai/install.ps1 | iex",
      },
    ],
  },
  {
    name: "ChatGPT",
    tagline: "General-purpose AI",
    body: "Our main everyday AI tool, used for all sorts of things — a lot of the time to generate images for sites.",
    note: "The Plus plan is highly recommended.",
    href: "https://chatgpt.com",
    linkLabel: "chatgpt.com",
  },
  {
    name: "Kling",
    tagline: "AI video generation",
    body: "What we always use for video generation. A subscription is mandatory to use it — sign up through our link to get a percentage off your purchase.",
    note: "Subscription required · use the link for a discount.",
    href: "https://pro.klingai.com/h5-app/invitation?code=7BF6QG88PHMV",
    linkLabel: "Sign up with discount",
  },
];

export const recipes = [
  {
    name: "Real estate / construction site",
    flow: [
      "Hero (scroll animation)",
      "Aperture Reveal",
      "Services Accordion",
      "Stacking Cards or Horizontal Showcase",
      "Process Steps",
      "Testimonials",
      "FAQ",
      "Contact + Footer",
    ],
  },
  {
    name: "Service business with transformations",
    note: "cleaning, renovation, design",
    flow: [
      "Hero (scroll animation)",
      "Before/After Slider",
      "Services Accordion",
      "Process Steps",
      "Testimonials",
      "FAQ",
      "Contact + Footer",
    ],
  },
];

export const checkpoints = [
  "Picked your sections (one page recipe above, or your own mix)",
  "Prepared real content for each — images, text, numbers — before pasting",
  "Integrated them one at a time, checking localhost:3000 after each",
  "Checked every section on mobile width",
  "All placeholder images and fake testimonials replaced",
];
