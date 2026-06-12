import Link from "next/link";
import { groups } from "@/lib/sections";
import { sectionCount } from "@/lib/library";
import { ArrowRightIcon } from "@/components/dashboard/icons";

export default function Home() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-14">
      {/* ———— hero ———— */}
      <header
        className="rise"
        style={{ "--rise-delay": "40ms" } as React.CSSProperties}
      >
        <p className="font-mono text-[10px] tracking-[0.28em] text-orchid uppercase">
          Web Motion Academy · Lesson 3
        </p>
        <h1 className="mt-4 font-display text-[2.6rem] leading-[1.05] font-bold tracking-tight text-frost sm:text-[3.4rem]">
          The Section <span className="text-orchid">Library</span>
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-[1.8] text-frost-dim">
          Ten production-ready, animated sections. Pick one, paste its prompt
          into Claude Code, tell it about your brand, and it appears on your
          site: polished, animated, responsive.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/library"
            className="group inline-flex items-center gap-2.5 rounded-lg bg-orchid px-6 py-3 text-[13.5px] font-medium text-abyss transition-opacity duration-200 hover:opacity-90"
          >
            Browse the library
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/guide"
            className="inline-flex items-center rounded-lg border border-veil px-6 py-3 text-[13.5px] text-frost-dim transition-colors duration-200 hover:border-orchid/40 hover:text-frost"
          >
            How to use it
          </Link>
        </div>
      </header>

      {/* ———— what's inside ———— */}
      <section aria-labelledby="groups-heading">
        <div className="mb-2 flex items-baseline justify-between gap-4">
          <h2
            id="groups-heading"
            className="font-display text-lg font-semibold tracking-tight text-frost"
          >
            What&apos;s inside
          </h2>
          <p className="font-mono text-[10px] tracking-[0.2em] text-frost-faint uppercase">
            {sectionCount} sections
          </p>
        </div>

        <ul>
          {groups.map((group) => (
            <li key={group.id} className="border-t border-veil-soft last:border-b">
              <Link
                href="/library"
                className="group flex items-center justify-between gap-6 py-5 transition-colors duration-200"
              >
                <div className="min-w-0">
                  <p className="font-display text-[17px] font-semibold tracking-tight text-frost transition-colors duration-200 group-hover:text-orchid">
                    {group.name}
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-frost-dim">
                    {group.blurb}
                  </p>
                </div>
                <p className="shrink-0 font-mono text-[11px] text-frost-faint">
                  {group.sections.length}{" "}
                  <span className="tracking-[0.16em] uppercase">
                    section{group.sections.length > 1 ? "s" : ""}
                  </span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ———— the one rule ———— */}
      <aside className="border-l-2 border-orchid py-1 pl-5">
        <p className="text-[14px] leading-[1.75] text-frost-dim">
          <strong className="font-semibold text-frost">
            One rule: one section at a time.
          </strong>{" "}
          Don&apos;t paste three prompts in one message. Integrate one, check
          it, then move to the next — it keeps errors isolated and easy to fix.
        </p>
      </aside>
    </div>
  );
}
