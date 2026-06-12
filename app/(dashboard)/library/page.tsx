import type { Metadata } from "next";
import { groups } from "@/lib/sections";
import { sectionCount } from "@/lib/library";
import LibraryGrid from "@/components/library/LibraryGrid";

export const metadata: Metadata = {
  title: "Library — The Section Library",
};

export default function LibraryPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <header className="rise" style={{ "--rise-delay": "40ms" } as React.CSSProperties}>
        <p className="font-mono text-[10px] tracking-[0.28em] text-orchid uppercase">
          {sectionCount} sections · {groups.length} groups
        </p>
        <h1 className="mt-3 font-display text-[2.2rem] leading-tight font-bold tracking-tight text-frost sm:text-[2.6rem]">
          Library
        </h1>
        <p className="mt-3 max-w-2xl text-[14.5px] leading-[1.8] text-frost-dim">
          Every section in one place. Pick one, open it, copy its prompt into
          Claude Code — one at a time.
        </p>
      </header>

      <LibraryGrid groups={groups} />
    </div>
  );
}
