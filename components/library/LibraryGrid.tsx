"use client";

import { useState } from "react";
import type { Group } from "@/lib/sections";
import SectionTile from "@/components/dashboard/SectionTile";

type LibraryGridProps = {
  groups: Group[];
};

export default function LibraryGrid({ groups }: LibraryGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const visible = activeId
    ? groups.filter((group) => group.id === activeId)
    : groups;

  const total = groups.reduce((n, group) => n + group.sections.length, 0);

  const tabClass = (active: boolean) =>
    `cursor-pointer rounded-full px-4 py-2 text-[12.5px] transition-colors duration-200 ${
      active
        ? "bg-orchid font-medium text-abyss"
        : "border border-veil text-frost-dim hover:border-orchid/40 hover:text-frost"
    }`;

  return (
    <div className="flex flex-col gap-7">
      {/* filter tabs */}
      <div
        role="tablist"
        aria-label="Filter sections by group"
        className="flex flex-wrap items-center gap-2"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeId === null}
          onClick={() => setActiveId(null)}
          className={tabClass(activeId === null)}
        >
          All <span className="opacity-60">{total}</span>
        </button>
        {groups.map((group) => {
          const active = activeId === group.id;
          return (
            <button
              key={group.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveId(active ? null : group.id)}
              className={tabClass(active)}
            >
              {group.name}{" "}
              <span className="opacity-60">{group.sections.length}</span>
            </button>
          );
        })}
      </div>

      {/* active group blurb */}
      {activeId && (
        <p className="-mt-3 text-[13.5px] leading-relaxed text-frost-dim">
          {groups.find((group) => group.id === activeId)?.blurb}
        </p>
      )}

      {/* grid */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {visible.flatMap((group) =>
          group.sections.map((section) => (
            <SectionTile
              key={section.id}
              section={section}
              groupName={group.name}
            />
          ))
        )}
      </div>
    </div>
  );
}
