"use client";

import { useState } from "react";
import CopyButton from "./CopyButton";

type PromptBlockProps = {
  text: string;
  title: string;
};

export default function PromptBlock({ text, title }: PromptBlockProps) {
  const [open, setOpen] = useState(false);
  const lines = text.split("\n").length;
  const chars = text.length;

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-veil-soft px-6 py-4">
        <span className="font-mono text-[10px] tracking-[0.22em] text-frost-dim uppercase">
          Step 2 — the prompt · {title}
        </span>
        <span className="font-mono text-[10px] tracking-[0.14em] text-frost-faint">
          {lines.toLocaleString("en-US")} lines ·{" "}
          {chars.toLocaleString("en-US")} chars
        </span>
      </div>

      <div className="relative">
        <pre
          className={`prompt-scroll overflow-x-auto px-6 py-5 font-mono text-[12px] leading-[1.7] whitespace-pre text-frost-dim ${
            open ? "max-h-[34rem] overflow-y-auto" : "max-h-44 overflow-y-hidden"
          }`}
        >
          {open ? text : text.split("\n").slice(0, 9).join("\n")}
        </pre>
        {!open && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(13,7,24,0.92) 88%)",
            }}
          />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-veil-soft px-6 py-4">
        <CopyButton text={text} />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="cursor-pointer font-mono text-[10.5px] tracking-[0.18em] text-frost-dim uppercase underline decoration-orchid/40 underline-offset-4 transition-colors hover:text-orchid"
        >
          {open ? "Collapse" : `Preview all ${lines.toLocaleString("en-US")} lines`}
        </button>
      </div>
    </div>
  );
}
