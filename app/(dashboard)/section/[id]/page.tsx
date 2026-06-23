import Link from "next/link";
import { notFound } from "next/navigation";
import { CUSTOMIZATION_TEMPLATE } from "@/lib/sections";
import { allSections, getSection, getSectionNeighbours } from "@/lib/library";
import { readPrompt } from "@/lib/prompts";
import LivePreview from "@/components/LivePreview";
import PromptBlock from "@/components/PromptBlock";
import CopyButton from "@/components/CopyButton";

export function generateStaticParams() {
  return allSections.map(({ section }) => ({ id: section.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = getSection(id);
  return {
    title: entry
      ? `${entry.section.title} — The Web Motion Library`
      : "The Web Motion Library",
  };
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

export default async function SectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = getSection(id);
  if (!entry) notFound();

  const { section, group } = entry;
  const { prev, next } = getSectionNeighbours(id);
  const prompt = readPrompt(section.promptFile);
  const customization = section.customize ?? CUSTOMIZATION_TEMPLATE;

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
                href="/library"
                className="transition-colors hover:text-orchid"
              >
                Library
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>{group.name}</li>
            <li aria-hidden="true">/</li>
            <li className="text-orchid">{section.number}</li>
          </ol>
        </nav>

        <h1 className="mt-3 max-w-3xl font-display text-[2.1rem] leading-[1.08] font-bold tracking-tight text-frost sm:text-[2.6rem]">
          {section.title}
        </h1>

        <ul className="mt-4 flex flex-wrap gap-2">
          {section.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-veil-soft px-3 py-1 font-mono text-[9.5px] tracking-[0.14em] text-frost-dim uppercase"
            >
              {tag}
            </li>
          ))}
        </ul>
      </header>

      {/* ———— live preview, front and center ———— */}
      <LivePreview id={section.id} title={section.title} />

      {/* ———— step 1: customization message ———— */}
      <div className="panel overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-veil-soft px-6 py-4">
          <span className="font-mono text-[10px] tracking-[0.22em] text-frost-dim uppercase">
            Step 1 — your customization message
          </span>
          <CopyButton
            text={customization}
            label="Copy template"
            copiedLabel="Copied — fill in the brackets"
          />
        </div>
        <pre className="prompt-scroll overflow-x-auto px-6 py-5 font-mono text-[12px] leading-[1.85] whitespace-pre text-frost-dim">
          {customization}
        </pre>
      </div>

      {/* ———— step 2: the prompt ———— */}
      <PromptBlock text={prompt} title={section.title} />

      {/* ———— about this section ———— */}
      <section aria-label="About this section" className="mt-2">
        <MetaRow label="What it is">{section.whatItIs}</MetaRow>
        <MetaRow label="Perfect for">{section.perfectFor}</MetaRow>
        <MetaRow label="What to prepare">
          <ul className="flex flex-col gap-3">
            {section.prepare.map((item) => (
              <li key={item} className="flex gap-3.5">
                <span
                  aria-hidden="true"
                  className="mt-[0.6em] block h-1.5 w-1.5 shrink-0 rounded-full bg-orchid"
                />
                {item}
              </li>
            ))}
          </ul>
        </MetaRow>
        {section.goodToKnow && (
          <MetaRow label="Good to know">{section.goodToKnow}</MetaRow>
        )}
        <div className="hairline" />
      </section>

      {/* ———— pager ———— */}
      <nav aria-label="Sections" className="grid gap-4 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/section/${prev.section.id}`}
            className="panel panel-hover p-5"
          >
            <p className="font-mono text-[9.5px] tracking-[0.22em] text-frost-faint uppercase">
              ← {prev.section.number} · {prev.group.name}
            </p>
            <p className="mt-1.5 font-display text-[16px] font-semibold text-frost">
              {prev.section.title}
            </p>
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}
        {next && (
          <Link
            href={`/section/${next.section.id}`}
            className="panel panel-hover p-5 text-right sm:col-start-2"
          >
            <p className="font-mono text-[9.5px] tracking-[0.22em] text-frost-faint uppercase">
              {next.section.number} · {next.group.name} →
            </p>
            <p className="mt-1.5 font-display text-[16px] font-semibold text-frost">
              {next.section.title}
            </p>
          </Link>
        )}
      </nav>
    </div>
  );
}
