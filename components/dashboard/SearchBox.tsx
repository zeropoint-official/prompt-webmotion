"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchEntry } from "@/lib/library";
import { SearchIcon } from "./icons";

export default function SearchBox({ items }: { items: SearchEntry[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const terms = q.split(/\s+/);
    return items
      .map((item) => {
        const haystacks = [
          item.title.toLowerCase(),
          item.groupName.toLowerCase(),
          item.tags.join(" ").toLowerCase(),
          item.blurb.toLowerCase(),
        ];
        let score = 0;
        for (const term of terms) {
          const hit = haystacks.findIndex((h) => h.includes(term));
          if (hit === -1) return null;
          // title hits rank above tag/blurb hits
          score += hit === 0 ? 3 : hit === 1 ? 2 : 1;
          if (haystacks[0].startsWith(term)) score += 2;
        }
        return { item, score };
      })
      .filter((r): r is { item: SearchEntry; score: number } => r !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 7)
      .map((r) => r.item);
  }, [items, query]);

  // ⌘K / ctrl+K focuses the box from anywhere
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // close on outside click
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => setHighlighted(0), [query]);

  function go(id: string) {
    setOpen(false);
    setQuery("");
    router.push(`/section/${id}`);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[highlighted]) {
      e.preventDefault();
      go(results[highlighted].id);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  const showPanel = open && query.trim().length > 0;

  return (
    <div ref={wrapRef} className="relative w-full max-w-md">
      <div
        className={`flex items-center gap-2.5 rounded-lg border bg-abyss-2 px-3 transition-colors duration-200 ${
          showPanel ? "border-orchid/40" : "border-veil-soft"
        }`}
      >
        <SearchIcon className="h-3.5 w-3.5 shrink-0 text-frost-faint" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          placeholder="Search sections…"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={showPanel}
          aria-label="Search the section library"
          className="h-9 w-full bg-transparent text-[13px] text-frost outline-none placeholder:text-frost-faint [&::-webkit-search-cancel-button]:hidden"
        />
        <kbd className="hidden shrink-0 rounded border border-veil-soft px-1.5 py-0.5 font-mono text-[9.5px] text-frost-faint sm:block">
          ⌘K
        </kbd>
      </div>

      {showPanel && (
        <div className="absolute top-11 right-0 left-0 z-50 overflow-hidden rounded-lg border border-veil bg-abyss-2 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.7)]">
          {results.length === 0 ? (
            <p className="px-4 py-5 text-[13px] text-frost-faint">
              Nothing matches “{query.trim()}” — try a tag like “scroll” or
              “accordion”.
            </p>
          ) : (
            <ul role="listbox" aria-label="Search results">
              {results.map((item, i) => (
                <li key={item.id} role="option" aria-selected={i === highlighted}>
                  <button
                    type="button"
                    onClick={() => go(item.id)}
                    onMouseEnter={() => setHighlighted(i)}
                    className={`flex w-full cursor-pointer items-center gap-3.5 px-4 py-3 text-left transition-colors ${
                      i === highlighted ? "bg-veil-soft" : ""
                    }`}
                  >
                    <span className="font-mono text-[11px] text-orchid">
                      {item.number}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] text-frost">
                        {item.title}
                      </span>
                      <span className="block truncate text-[11.5px] text-frost-faint">
                        {item.groupName} · {item.tags.join(" · ")}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
