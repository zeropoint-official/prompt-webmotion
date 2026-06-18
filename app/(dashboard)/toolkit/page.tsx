import type { Metadata } from "next";
import { toolkitItems, toolkitCount } from "@/lib/toolkit";
import ListRow from "@/components/dashboard/ListRow";

export const metadata: Metadata = {
  title: "Toolkit — The Web Motion Library",
};

export default function ToolkitPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <header
        className="rise"
        style={{ "--rise-delay": "40ms" } as React.CSSProperties}
      >
        <p className="font-mono text-[10px] tracking-[0.28em] text-orchid uppercase">
          {toolkitCount} tools · setup + design
        </p>
        <h1 className="mt-3 font-display text-[2.2rem] leading-tight font-bold tracking-tight text-frost sm:text-[2.6rem]">
          Toolkit
        </h1>
        <p className="mt-3 max-w-2xl text-[14.5px] leading-[1.8] text-frost-dim">
          The prompts and design files I actually use to start and power these
          builds — scaffold a fresh Next.js project, wire up a scroll-driven
          background video, and design original sections from a shared system.
          This set will keep growing.
        </p>
      </header>

      <div
        className="rise flex flex-col"
        style={{ "--rise-delay": "120ms" } as React.CSSProperties}
      >
        {toolkitItems.map((item) => (
          <ListRow
            key={item.id}
            href={`/toolkit/${item.id}`}
            eyebrow={`${item.number} · ${
              item.kind === "file" ? "Design file" : "Prompt"
            }`}
            title={item.title}
            blurb={item.blurb}
          />
        ))}
      </div>

      <aside className="border-l-2 border-orchid py-1 pl-5">
        <p className="text-[14px] leading-[1.75] text-frost-dim">
          <strong className="font-semibold text-frost">
            Use these in order.
          </strong>{" "}
          Start a project, build your hero moment, then reach for the design
          system whenever you need a custom section — one prompt at a time.
        </p>
      </aside>
    </div>
  );
}
