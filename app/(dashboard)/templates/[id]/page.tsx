import Link from "next/link";
import { notFound } from "next/navigation";
import {
  templates,
  getTemplate,
  getTemplateNeighbours,
} from "@/lib/templates";
import { readPrompt } from "@/lib/prompts";
import LivePreview from "@/components/LivePreview";
import PromptBlock from "@/components/PromptBlock";

export function generateStaticParams() {
  return templates.map((t) => ({ id: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getTemplate(id);
  return {
    title: item
      ? `${item.title} — The Web Motion Library`
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

export default async function TemplateItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getTemplate(id);
  if (!item) notFound();

  const { prev, next } = getTemplateNeighbours(id);
  const promptText = readPrompt(item.promptFile);

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
                href="/templates"
                className="transition-colors hover:text-orchid"
              >
                Website Templates
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>Full site</li>
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

      {/* ———— hero-video disclaimer ———— */}
      <aside
        role="note"
        className="rounded-xl border border-orchid/30 bg-orchid/[0.06] p-5 sm:p-6"
      >
        <div className="flex items-start gap-3.5">
          <svg
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden
            className="mt-0.5 h-5 w-5 shrink-0 text-orchid"
          >
            <path
              d="M10 7v4m0 3h.01M10 2.5 1.8 16.5h16.4L10 2.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div>
            <h2 className="font-mono text-[10px] tracking-[0.24em] text-orchid uppercase">
              Before you customize the hero
            </h2>
            <p className="mt-2.5 text-[13.5px] leading-[1.8] text-frost-dim">
              {item.heroNote}
            </p>
            <p className="mt-3 text-[13px] leading-[1.7] text-frost-faint">
              Need the hero-video workflow?{" "}
              <Link
                href="/toolkit/hero-video-masterprompt"
                className="text-orchid underline decoration-orchid/40 underline-offset-4 hover:decoration-orchid"
              >
                Toolkit T2 — Hero Video Master Prompt
              </Link>{" "}
              and{" "}
              <Link
                href="/toolkit/scroll-video"
                className="text-orchid underline decoration-orchid/40 underline-offset-4 hover:decoration-orchid"
              >
                T3 — Scroll-Driven Background Video
              </Link>
              .
            </p>
          </div>
        </div>
      </aside>

      {/* ———— live preview — the whole site, one frame ———— */}
      <section aria-label="Live preview" className="flex flex-col gap-5">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-lg font-semibold tracking-tight text-frost">
            Live preview — the whole site
          </h2>
          <span className="font-mono text-[10px] tracking-[0.2em] text-frost-faint uppercase">
            Real build · demo content
          </span>
        </div>
        <p className="-mt-2 max-w-2xl text-[13.5px] leading-[1.7] text-frost-dim">
          The actual template running as one continuous website — scroll from
          the top straight through every section. Toggle desktop / mobile to see
          the responsive fallbacks, or open it full screen.
        </p>

        <LivePreview
          id="mare-site"
          title={`${item.title} — full site`}
          tall
          desktopWidth={1280}
          note="Scroll the whole site inside the frame — header, hero, services and residences, running for real"
        />

        {/* what you'll scroll through */}
        <ol className="grid gap-3 sm:grid-cols-3">
          {item.previews.map((p) => (
            <li
              key={p.id}
              className="rounded-xl border border-veil-soft p-4"
            >
              <span className="font-mono text-[10px] tracking-[0.18em] text-orchid uppercase">
                {p.label}
              </span>
              <p className="mt-2 text-[12.5px] leading-[1.65] text-frost-dim">
                {p.caption}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ———— the prompt ———— */}
      <PromptBlock
        text={promptText}
        title={item.title}
        label="The template prompt"
      />

      {/* ———— what's included ———— */}
      <section aria-label="What's included" className="panel p-6 sm:p-7">
        <h2 className="font-mono text-[10px] tracking-[0.24em] text-orchid uppercase">
          What&apos;s included
        </h2>
        <ul className="mt-5 flex flex-col">
          {item.includes.map((line) => {
            const [head, ...tail] = line.split(" — ");
            const rest = tail.join(" — ");
            return (
              <li
                key={line}
                className="flex gap-4 border-t border-veil-soft py-4 first:border-t-0 first:pt-0"
              >
                <span
                  aria-hidden
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orchid"
                />
                <p className="text-[13.5px] leading-[1.75] text-frost-dim">
                  <strong className="font-semibold text-frost">{head}</strong>
                  {rest && <> — {rest}</>}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

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
      <section aria-label="About this template" className="mt-2">
        <MetaRow label="What it is">{item.whatItIs}</MetaRow>
        <MetaRow label="Perfect for">{item.perfectFor}</MetaRow>
        {item.goodToKnow && (
          <MetaRow label="Good to know">{item.goodToKnow}</MetaRow>
        )}
        <div className="hairline" />
      </section>

      {/* ———— pager ———— */}
      {(prev || next) && (
        <nav aria-label="Website Templates" className="grid gap-4 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/templates/${prev.id}`}
              className="panel panel-hover p-5"
            >
              <p className="font-mono text-[9.5px] tracking-[0.22em] text-frost-faint uppercase">
                ← {prev.number} · Template
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
              href={`/templates/${next.id}`}
              className="panel panel-hover p-5 text-right sm:col-start-2"
            >
              <p className="font-mono text-[9.5px] tracking-[0.22em] text-frost-faint uppercase">
                {next.number} · Template →
              </p>
              <p className="mt-1.5 font-display text-[16px] font-semibold text-frost">
                {next.title}
              </p>
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
