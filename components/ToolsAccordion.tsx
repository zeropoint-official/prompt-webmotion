"use client";

import { useState } from "react";
import type { Tool } from "@/lib/sections";
import CopyButton from "@/components/CopyButton";

export default function ToolsAccordion({ tools }: { tools: Tool[] }) {
  const [open, setOpen] = useState<string | null>(tools[0]?.name ?? null);

  return (
    <div className="flex flex-col">
      {tools.map((tool) => {
        const isOpen = open === tool.name;
        return (
          <div
            key={tool.name}
            className="border-t border-veil-soft last:border-b"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : tool.name)}
              aria-expanded={isOpen}
              className="group flex w-full cursor-pointer items-center gap-5 py-5 text-left"
            >
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[9.5px] tracking-[0.22em] text-frost-faint uppercase">
                  {tool.tagline}
                </p>
                <p
                  className={`mt-1.5 font-display text-[18px] font-semibold tracking-tight transition-colors duration-200 ${
                    isOpen ? "text-orchid" : "text-frost group-hover:text-orchid"
                  }`}
                >
                  {tool.name}
                </p>
              </div>
              <span
                aria-hidden="true"
                className={`relative flex h-6 w-6 shrink-0 items-center justify-center text-orchid transition-transform duration-300 ${
                  isOpen ? "rotate-45" : "group-hover:rotate-90"
                }`}
              >
                <span className="absolute h-[1.5px] w-3.5 rounded-full bg-current" />
                <span className="absolute h-3.5 w-[1.5px] rounded-full bg-current" />
              </span>
            </button>

            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-4 pb-7">
                  <p className="max-w-2xl text-[14px] leading-[1.8] text-frost-dim">
                    {tool.body}
                  </p>

                  {tool.note && (
                    <p className="text-[12.5px] leading-[1.7] font-medium text-frost">
                      {tool.note}
                    </p>
                  )}

                  {tool.commands && (
                    <div className="flex flex-col gap-2.5">
                      {tool.commands.map((cmd) => (
                        <div key={cmd.label}>
                          <p className="mb-1.5 font-mono text-[9.5px] tracking-[0.18em] text-frost-faint uppercase">
                            {cmd.label}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-veil-soft bg-abyss/40 px-3.5 py-2.5">
                            <code className="flex-1 overflow-x-auto font-mono text-[12px] whitespace-nowrap text-frost-dim">
                              {cmd.command}
                            </code>
                            <CopyButton
                              text={cmd.command}
                              label="Copy"
                              copiedLabel="Copied"
                              className="shrink-0"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <a
                    href={tool.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit items-center gap-2 font-mono text-[12px] text-orchid hover:underline"
                  >
                    {tool.linkLabel}
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
