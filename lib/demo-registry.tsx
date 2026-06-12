import type { ComponentType } from "react";
import ApertureRevealDemo from "@/components/demos/aperture-reveal-demo";
import StackingCardsDemo from "@/components/demos/stacking-cards-demo";
import FeatureDemo from "@/components/demos/before-after-demo";
import AnimateNumberDemo from "@/components/demos/animate-number-demo";
import AnimatedTestimonialsBasic from "@/components/demos/animated-testimonials-demo";
import ServicesSection from "@/components/sections/services-section";
import ProcessSection from "@/components/sections/process-section";
import ProjectsSection from "@/components/sections/projects-section";
import FaqSection from "@/components/sections/faq-section";
import ContactSection from "@/components/sections/contact-section";

export type DemoEntry = {
  Component: ComponentType;
  /**
   * runway   — scroll-pinned demo placed mid-page: gets a "scroll" band above/below
   * plain    — full section that renders as-is
   * centered — small component centered in the viewport
   */
  frame: "runway" | "plain" | "centered";
  /** page background behind the demo */
  background: string;
  /** hint shown in the runway band */
  hint?: string;
};

export const demoRegistry: Record<string, DemoEntry> = {
  "aperture-reveal": {
    Component: ApertureRevealDemo,
    frame: "runway",
    background: "#0e0c09",
    hint: "Scroll — your scroll drives the aperture",
  },
  "stacking-cards": {
    Component: StackingCardsDemo,
    frame: "runway",
    background: "#0f0b06",
    hint: "Scroll — one card per scroll",
  },
  "horizontal-showcase": {
    Component: ProjectsSection,
    frame: "plain",
    background: "#0a0a0a",
  },
  "before-after-slider": {
    Component: FeatureDemo,
    frame: "centered",
    background: "#ffffff",
  },
  "services-accordion": {
    Component: ServicesSection,
    frame: "plain",
    background: "#ffffff",
  },
  "process-steps": {
    Component: ProcessSection,
    frame: "plain",
    background: "#0a0a0a",
  },
  "animated-testimonials": {
    Component: AnimatedTestimonialsBasic,
    frame: "plain",
    background: "#ffffff",
  },
  "animate-number": {
    Component: AnimateNumberDemo,
    frame: "centered",
    background: "#0a0a0a",
  },
  "faq-accordion": {
    Component: FaqSection,
    frame: "plain",
    background: "#0a0a0a",
  },
  "contact-footer": {
    Component: ContactSection,
    frame: "plain",
    background: "#0a0a0a",
  },
};
