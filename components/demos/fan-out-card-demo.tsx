import FanOutCard from "@/components/FanOutCard";

const PH = (seed: string) => `https://picsum.photos/seed/${seed}/600/900`;

export default function FanOutCardDemo() {
  return (
    <div className="flex min-h-[34rem] items-center justify-center px-6 py-10">
      {/* The fan deals out well beyond the card, so scale the whole thing down
          to keep it inside the preview frame. The motion is unchanged. */}
      <div className="origin-center scale-[0.6] sm:scale-[0.7]">
        <FanOutCard
          image={PH("fan-front")}
          prints={[
            PH("fan-1"),
            PH("fan-2"),
            PH("fan-3"),
            PH("fan-4"),
            PH("fan-5"),
          ]}
          title="The Garden Booth"
          tagline="Weddings · Events"
        />
      </div>
    </div>
  );
}
