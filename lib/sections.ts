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
