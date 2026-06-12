"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "wma-section-library-checkpoint";

export default function Checklist({ items }: { items: string[] }) {
  const [checked, setChecked] = useState<boolean[]>(() =>
    items.map(() => false)
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: boolean[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === items.length) {
          setChecked(parsed);
        }
      }
    } catch {
      // ignore corrupted storage
    }
    setLoaded(true);
  }, [items.length]);

  function toggle(i: number) {
    setChecked((prev) => {
      const next = prev.map((v, j) => (j === i ? !v : v));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage full / unavailable — checkbox still works for the session
      }
      return next;
    });
  }

  const done = checked.filter(Boolean).length;

  return (
    <div>
      <ul className="flex flex-col">
        {items.map((item, i) => (
          <li key={item} className="border-b border-veil-soft last:border-b-0">
            <label className="group flex cursor-pointer items-start gap-5 py-5 select-none">
              <input
                type="checkbox"
                checked={checked[i]}
                onChange={() => toggle(i)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-300 ${
                  checked[i]
                    ? "border-transparent bg-orchid"
                    : "border-veil bg-transparent group-hover:border-orchid/50"
                }`}
              >
                {checked[i] && (
                  <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
                    <path
                      d="M2 6.5L4.8 9.2L10 3"
                      stroke="#08040f"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </span>
              <span
                className={`text-[14.5px] leading-relaxed transition-colors duration-300 ${
                  checked[i]
                    ? "text-frost-faint line-through decoration-orchid/50"
                    : "text-frost-dim group-hover:text-frost"
                }`}
              >
                {item}
              </span>
            </label>
          </li>
        ))}
      </ul>
      <p
        className={`mt-5 font-mono text-[10.5px] tracking-[0.2em] uppercase ${
          done === items.length ? "text-orchid" : "text-frost-faint"
        }`}
        aria-live="polite"
      >
        {loaded && done === items.length
          ? "✦ All clear — your site is no longer a hero with nothing under it."
          : `${done} / ${items.length} complete`}
      </p>
    </div>
  );
}
