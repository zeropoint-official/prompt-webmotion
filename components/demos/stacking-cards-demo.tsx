import StackingCards, { type StackingItem } from "@/components/StackingCards";

const PROJECTS: StackingItem[] = [
  {
    slug: "villa-aurora",
    label: "Villa",
    name: "Aurora Villa",
    subtitle: "A four-bedroom villa considered in every detail",
    tag: "Alethriko, Cyprus",
    metricA: { label: "Area", value: "259 m²" },
    metricB: { label: "Rooms", value: "4 · 4" },
    metricC: { label: "Year", value: "2026" },
    price: "€ 550,000",
    cover:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop",
  },
  {
    slug: "villa-soleil",
    label: "Villa",
    name: "Soleil Villa",
    subtitle: "Light-filled interiors framing the open sky",
    tag: "Limassol, Cyprus",
    metricA: { label: "Area", value: "310 m²" },
    metricB: { label: "Rooms", value: "5 · 5" },
    metricC: { label: "Year", value: "2026" },
    price: "€ 680,000",
    cover:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2000&auto=format&fit=crop",
  },
  {
    slug: "villa-petra",
    label: "Villa",
    name: "Petra Villa",
    subtitle: "Stone and glass in quiet equilibrium",
    tag: "Paphos, Cyprus",
    metricA: { label: "Area", value: "285 m²" },
    metricB: { label: "Rooms", value: "4 · 3" },
    metricC: { label: "Year", value: "2027" },
    price: "€ 495,000",
    cover:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop",
  },
];

export default function StackingCardsDemo() {
  return (
    <section style={{ background: "#0f0b06" }}>
      <StackingCards items={PROJECTS} basePath="#" ctaLabel="Dossier →" />
    </section>
  );
}
