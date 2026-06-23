import ScatterHero from "@/components/ScatterHero";

const PH = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export default function ScatterHeroDemo() {
  return (
    <ScatterHero
      headline="Spaces that hold their breath."
      brandReveal="ATELIER NORD"
      cta={{ label: "Enquire", href: "#" }}
      tiles={{
        topLeft: PH("scatter-tl", 600, 1000),
        topCenter: PH("scatter-top", 1200, 450),
        topRight: PH("scatter-tr", 600, 1000),
        bottomLeft: PH("scatter-bl", 600, 1000),
        bottomRight: PH("scatter-br", 600, 1000),
        // The bottom-center photo that zooms up to full screen.
        hero: PH("scatter-hero", 1600, 900),
      }}
    >
      {/* The next section — scrolling this up over the sticky video drives the darken. */}
      <section className="flex min-h-screen items-center justify-center bg-[#f6f3ec] px-6 text-center text-[#36302a]">
        <p className="max-w-2xl text-2xl font-medium leading-snug md:text-3xl">
          …and the next section scrolls up over the footage, dimming it as it
          takes the stage.
        </p>
      </section>
    </ScatterHero>
  );
}
