import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  toolkitItems,
  getToolkitItem,
  getToolkitNeighbours,
} from "@/lib/toolkit";
import { readPrompt } from "@/lib/prompts";
import PromptBlock from "@/components/PromptBlock";
import CopyButton from "@/components/CopyButton";

export function generateStaticParams() {
  return toolkitItems.map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getToolkitItem(id);
  return {
    title: item
      ? `${item.title} — The Web Motion Library`
      : "The Web Motion Library",
  };
}

function readPublicFile(publicPath: string): string {
  const filePath = path.join(process.cwd(), "public", publicPath.replace(/^\//, ""));
  return fs.readFileSync(filePath, "utf-8").trim();
}

function MetaRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 border-t border-veil-soft py-6 sm:grid-cols-[170px_1fr] sm:gap-8">
      <h3 className="font-mono text-[10px] tracking-[0.24em] text-orchid uppercase sm:pt-1">
        {label}
      </h3>
      <div className="text-[14px] leading-[1.8] text-frost-dim">{children}</div>
    </div>
  );
}

export default async function ToolkitItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getToolkitItem(id);
  if (!item) notFound();

  const { prev, next } = getToolkitNeighbours(id);

  const promptText =
    item.kind === "prompt" && item.promptFile
      ? readPrompt(item.promptFile)
      : null;
  const fileText =
    item.kind === "file" && item.downloadPath
      ? readPublicFile(item.downloadPath)
      : null;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      {/* ———— header ———— */}
      <header
        className="rise"
        style={{ "--rise-delay": "40ms" } as React.CSSProperties}
      >
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-frost-faint uppercase">
            <li>
              <Link
                href="/toolkit"
                className="transition-colors hover:text-orchid"
              >
                Toolkit
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>{item.kind === "file" ? "Design file" : "Prompt"}</li>
            <li aria-hidden="true">/</li>
            <li className="text-orchid">{item.number}</li>
          </ol>
        </nav>

        <h1 className="mt-3 max-w-3xl font-display text-[2.1rem] leading-[1.08] font-bold tracking-tight text-frost sm:text-[2.6rem]">
          {item.title}
        </h1>

        <p className="mt-3 max-w-2xl text-[14.5px] leading-[1.8] text-frost-dim">
          {item.blurb}
        </p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-veil-soft px-3 py-1 font-mono text-[9.5px] tracking-[0.14em] text-frost-dim uppercase"
            >
              {tag}
            </li>
          ))}
        </ul>
      </header>

      {/* ———— the artifact: prompt OR downloadable file ———— */}
      {promptText && (
        <PromptBlock text={promptText} title={item.title} label="The prompt" />
      )}

      {fileText && item.downloadPath && (
        <div className="panel overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-veil-soft px-6 py-4">
            <span className="font-mono text-[10px] tracking-[0.22em] text-frost-dim uppercase">
              The file · {item.downloadName}
            </span>
            <span className="font-mono text-[10px] tracking-[0.14em] text-frost-faint">
              {fileText.split("\n").length.toLocaleString("en-US")} lines ·{" "}
              {fileText.length.toLocaleString("en-US")} chars
            </span>
          </div>

          <pre className="prompt-scroll max-h-72 overflow-auto px-6 py-5 font-mono text-[12px] leading-[1.75] whitespace-pre text-frost-dim">
            {fileText}
          </pre>

          <div className="flex flex-wrap items-center gap-3 border-t border-veil-soft px-6 py-4">
            <CopyButton
              text={fileText}
              label="Copy file"
              copiedLabel="Copied — paste it into your repo"
            />
            <a
              href={item.downloadPath}
              download={item.downloadName}
              className="inline-flex cursor-pointer items-center gap-2.5 rounded-lg border border-veil px-4 py-2.5 font-mono text-[10.5px] tracking-[0.16em] text-frost-dim uppercase transition-colors duration-200 hover:border-orchid/40 hover:text-frost"
            >
              <svg viewBox="0 0 14 14" fill="none" className="h-3.5 w-3.5">
                <path
                  d="M7 1.5v7M3.5 6L7 9.5 10.5 6M2 12h10"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Download .md
            </a>
          </div>
        </div>
      )}

      {/* ———— how to use ———— */}
      <section aria-label="How to use it" className="panel p-6 sm:p-7">
        <h2 className="font-mono text-[10px] tracking-[0.24em] text-orchid uppercase">
          How to use it
        </h2>
        <ol className="mt-5 flex flex-col">
          {item.use.map((step, i) => (
            <li
              key={step}
              className="flex gap-4 border-t border-veil-soft py-4 first:border-t-0 first:pt-0"
            >
              <span className="font-mono text-[12px] font-semibold text-orchid">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-[13.5px] leading-[1.75] text-frost-dim">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ———— about ———— */}
      <section aria-label="About this tool" className="mt-2">
        <MetaRow label="What it is">{item.whatItIs}</MetaRow>
        <MetaRow label="Perfect for">{item.perfectFor}</MetaRow>
        {item.goodToKnow && (
          <MetaRow label="Good to know">{item.goodToKnow}</MetaRow>
        )}
        <div className="hairline" />
      </section>

      {/* ———— pager ———— */}
      <nav aria-label="Toolkit" className="grid gap-4 sm:grid-cols-2">
        {prev ? (
          <Link href={`/toolkit/${prev.id}`} className="panel panel-hover p-5">
            <p className="font-mono text-[9.5px] tracking-[0.22em] text-frost-faint uppercase">
              ← {prev.number} · Toolkit
            </p>
            <p className="mt-1.5 font-display text-[16px] font-semibold text-frost">
              {prev.title}
            </p>
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}
        {next && (
          <Link
            href={`/toolkit/${next.id}`}
            className="panel panel-hover p-5 text-right sm:col-start-2"
          >
            <p className="font-mono text-[9.5px] tracking-[0.22em] text-frost-faint uppercase">
              {next.number} · Toolkit →
            </p>
            <p className="mt-1.5 font-display text-[16px] font-semibold text-frost">
              {next.title}
            </p>
          </Link>
        )}
      </nav>
    </div>
  );
}
