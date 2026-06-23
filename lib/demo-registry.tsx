import type { ComponentType } from "react";
import ApertureRevealDemo from "@/components/demos/aperture-reveal-demo";
import ScrollTextRevealDemo from "@/components/demos/scroll-text-reveal-demo";
import ScatterManifestoDemo from "@/components/demos/scatter-manifesto-demo";
import ScatterHeroDemo from "@/components/demos/scatter-hero-demo";
import PageTransitionDemo from "@/components/demos/page-transition-demo";
import StaggerTestimonialsDemo from "@/components/demos/stagger-testimonials-demo";
import FanOutCardDemo from "@/components/demos/fan-out-card-demo";
import ParallaxStackingProjectsDemo from "@/components/demos/parallax-stacking-projects-demo";
import ApertureRevealHeroDemo from "@/components/demos/aperture-reveal-hero-demo";
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
  "scroll-text-reveal": {
    Component: ScrollTextRevealDemo,
    frame: "runway",
    background: "#0a0a0a",
    hint: "Scroll — words brighten as you go",
  },
  "scatter-manifesto": {
    Component: ScatterManifestoDemo,
    frame: "runway",
    background: "#0a0a0a",
    hint: "Scroll — the words scatter into place",
  },
  "scatter-hero": {
    Component: ScatterHeroDemo,
    frame: "plain",
    background: "#f6f3ec",
  },
  "page-transition-slide-up": {
    Component: PageTransitionDemo,
    frame: "centered",
    background: "#0a0a0a",
  },
  "stagger-testimonials": {
    Component: StaggerTestimonialsDemo,
    frame: "plain",
    background: "#2a241f",
  },
  "fan-out-card": {
    Component: FanOutCardDemo,
    frame: "centered",
    background: "#1f1a15",
  },
  "parallax-stacking-projects": {
    Component: ParallaxStackingProjectsDemo,
    frame: "runway",
    background: "#f4f3ee",
    hint: "Scroll — each project peels away to reveal the next",
  },
  "aperture-reveal-hero": {
    Component: ApertureRevealHeroDemo,
    frame: "plain",
    background: "#0f0f12",
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
