"use client";

import { useState } from "react";
import type { SearchEntry } from "@/lib/library";
import Sidebar, { type SidebarGroup } from "./Sidebar";
import { MenuIcon } from "./icons";

type ShellProps = {
  groups: SidebarGroup[];
  searchItems: SearchEntry[];
  children: React.ReactNode;
};

export default function Shell({ groups, searchItems, children }: ShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-svh">
      <Sidebar
        groups={groups}
        searchItems={searchItems}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="flex min-h-svh flex-col lg:pl-[232px]">
        {/* mobile topbar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-veil-soft bg-abyss/95 px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-veil-soft text-frost-dim transition-colors hover:text-frost"
            aria-label="Open menu"
          >
            <MenuIcon className="h-[17px] w-[17px]" />
          </button>
          <p className="font-display text-[14px] font-semibold tracking-tight text-frost">
            Section Library
          </p>
        </header>

        <main className="flex-1 px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
          {children}
        </main>

        <footer className="border-t border-veil-soft px-5 py-5 sm:px-8 lg:px-12">
          <p className="font-mono text-[9.5px] tracking-[0.22em] text-frost-faint uppercase">
            Web Motion Academy · The Section Library · Lesson 3
          </p>
        </footer>
      </div>
    </div>
  );
}
