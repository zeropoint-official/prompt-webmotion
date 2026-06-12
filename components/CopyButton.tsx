"use client";

import { useEffect, useRef, useState } from "react";

type CopyButtonProps = {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
};

export default function CopyButton({
  text,
  label = "Copy prompt",
  copiedLabel = "Copied — paste it into Claude Code",
  className = "",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API unavailable (e.g. non-secure context) — fall back
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2500);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className={`inline-flex cursor-pointer items-center gap-2.5 rounded-lg px-4 py-2.5 font-mono text-[10.5px] tracking-[0.16em] uppercase transition-colors duration-200 ${
        copied
          ? "bg-frost text-abyss"
          : "bg-orchid text-abyss hover:opacity-90"
      } ${className}`}
    >
      <span aria-hidden="true" className="relative block h-3.5 w-3.5">
        {copied ? (
          <svg viewBox="0 0 14 14" fill="none" className="h-3.5 w-3.5">
            <path
              d="M2 7.5L5.5 11L12 3.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 14 14" fill="none" className="h-3.5 w-3.5">
            <rect
              x="4.5"
              y="4.5"
              width="8"
              height="8"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <path
              d="M9.5 4.5V1.5H1.5V9.5H4.5"
              stroke="currentColor"
              strokeWidth="1.4"
            />
          </svg>
        )}
      </span>
      {copied ? copiedLabel : label}
    </button>
  );
}
