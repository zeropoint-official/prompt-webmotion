import ApertureReveal from "@/components/ApertureReveal";

export default function ApertureRevealDemo() {
  return (
    <ApertureReveal
      imageSrc="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2400&auto=format&fit=crop"
      imageAlt="A modern villa with a pool at dusk"
      eyebrow="The Collection"
      ghostWord="RESIDENCES"
      echoWord="· cyprus ·"
      captionStrong="Four residences."
      captionSoft="Considered in every measure."
      metaRight="34.707° N · 33.022° E"
      scrollHint="The portfolio, below ↓"
    />
  );
}
