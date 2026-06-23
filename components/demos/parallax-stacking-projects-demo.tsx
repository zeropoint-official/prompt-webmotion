import ParallaxStackingProjects, {
  type StackProject,
} from "@/components/ParallaxStackingProjects";

const PROJECTS: StackProject[] = [
  {
    id: "aurora",
    year: "2024",
    title: "Aurora Studio",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
    tags: ["Web Design", "Branding"],
  },
  {
    id: "monolith",
    year: "2024",
    title: "Monolith",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2000&auto=format&fit=crop",
    tags: ["Web Development"],
  },
  {
    id: "atelier",
    year: "2024",
    title: "Atelier Nord",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop",
    tags: ["E-commerce", "Web Design"],
  },
  {
    id: "horizon",
    year: "2024",
    title: "Horizon House",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop",
    tags: ["Web Design"],
  },
];

export default function ParallaxStackingProjectsDemo() {
  return (
    <section style={{ background: "#f4f3ee" }}>
      <div
        style={{
          padding:
            "clamp(4rem, 10vw, 10rem) clamp(1.5rem, 8vw, 8rem) clamp(2rem, 4vw, 4rem)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-monument), sans-serif",
            fontWeight: 800,
            fontSize: "clamp(3rem, 10vw, 10rem)",
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
            color: "#161616",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Selected
          <br />
          <span style={{ color: "rgba(22,22,22,0.18)" }}>Work</span>
        </h2>
      </div>
      <ParallaxStackingProjects projects={PROJECTS} theme="light" />
    </section>
  );
}
