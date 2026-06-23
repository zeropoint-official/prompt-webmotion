import { ApertureRevealHero } from "@/components/ApertureRevealHero";

export default function ApertureRevealHeroDemo() {
  return (
    <ApertureRevealHero
      title="Crystal Symphony Cruise Ship"
      images={[
        {
          src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2400&auto=format&fit=crop",
          alt: "",
        },
        {
          src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2400&auto=format&fit=crop",
          alt: "",
        },
        {
          src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2400&auto=format&fit=crop",
          alt: "",
        },
      ]}
    />
  );
}
