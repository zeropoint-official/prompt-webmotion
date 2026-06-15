import type { Metadata } from "next";
import Link from "next/link";
import {
  CUSTOMIZATION_TEMPLATE,
  recipes,
  checkpoints,
} from "@/lib/sections";
import CopyButton from "@/components/CopyButton";
import Checklist from "@/components/Checklist";

export const metadata: Metadata = {
  title: "Guide — The Web Motion Library",
};

const steps = [
  {
    n: "01",
    title: "Prepare your content first",
    body: "Before pasting anything, have your real content ready: the images you'll use, your actual text, your real numbers. Each section tells you exactly what to prepare. The #1 mistake is integrating a section with placeholder content and never replacing it — your site ends up showing stock photos of someone else's buildings.",
  },
  {
    n: "02",
    title: "Write your customization message",
    body: "Don't paste the prompt alone. First write 2–4 sentences telling Claude Code about your project, then paste the prompt below it. That top part is what turns a generic section into your section. The more specific you are, the less cleanup afterward.",
  },
  {
    n: "03",
    title: "Review and refine",
    body: "Open localhost:3000, scroll to the new section, and check it on desktop and mobile (shrink your browser window). Anything off? Describe it to Claude Code in plain English, same as always.",
  },
];

const rules = [
  {
    label: "Rule one",
    strong: "One scroll-pinned spectacle between every two calm sections.",
    body: "Hero, Aperture Reveal, Stacking Cards, and Horizontal Showcase are all “spectacle” sections — never place two back-to-back. Let the page breathe.",
  },
  {
    label: "Rule two",
    strong: "Consistency beats variety.",
    body: "Before integrating anything, tell Claude Code your site's colors and fonts in every customization message. Ten beautiful sections in ten different styles looks worse than five sections in one style.",
  },
];

function PartHeading({
  kicker,
  title,
  intro,
}: {
  kicker: string;
  title: string;
  intro: string;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] tracking-[0.28em] text-orchid uppercase">
        {kicker}
      </p>
      <h2 className="mt-3 font-display text-[1.7rem] leading-tight font-bold tracking-tight text-frost sm:text-[2rem]">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-[14.5px] leading-[1.8] text-frost-dim">
        {intro}
      </p>
    </div>
  );
}

export default function GuidePage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-14">
      {/* ———— part 1 · how to use ———— */}
      <section
        className="rise flex flex-col gap-8"
        style={{ "--rise-delay": "40ms" } as React.CSSProperties}
        aria-labelledby="guide-how"
      >
        <header>
          <p className="font-mono text-[10px] tracking-[0.28em] text-orchid uppercase">
            Read this once, use it ten times
          </p>
          <h1
            id="guide-how"
            className="mt-3 font-display text-[2.2rem] leading-tight font-bold tracking-tight text-frost sm:text-[2.6rem]"
          >
            How to use any prompt in this library
          </h1>
          <p className="mt-3 max-w-2xl text-[14.5px] leading-[1.8] text-frost-dim">
            Every section in the library works the same way: three steps, in
            order, every time. Master this flow once and the whole library is
            yours.
          </p>
        </header>

        <ol className="flex flex-col">
          {steps.map((step) => (
            <li
              key={step.n}
              className="flex flex-col gap-2 border-t border-veil-soft py-6 sm:flex-row sm:gap-8"
            >
              <span className="font-mono text-[13px] font-semibold text-orchid sm:w-12 sm:shrink-0 sm:pt-1">
                {step.n}
              </span>
              <div>
                <h3 className="font-display text-[17px] font-semibold text-frost">
                  {step.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-[1.8] text-frost-dim">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="panel overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-veil-soft px-6 py-4">
            <span className="font-mono text-[10px] tracking-[0.22em] text-frost-dim uppercase">
              Your customization message — the template
            </span>
            <CopyButton
              text={CUSTOMIZATION_TEMPLATE}
              label="Copy template"
              copiedLabel="Copied — now fill in the brackets"
            />
          </div>
          <pre className="prompt-scroll overflow-x-auto px-6 py-6 font-mono text-[12.5px] leading-[1.9] whitespace-pre text-frost-dim">
            {CUSTOMIZATION_TEMPLATE}
          </pre>
        </div>

        <aside className="border-l-2 border-orchid pl-5 py-1">
          <p className="text-[14px] leading-[1.75] text-frost-dim">
            <strong className="font-semibold text-frost">
              One rule: one section at a time.
            </strong>{" "}
            Don&apos;t paste three prompts in one message. Integrate one, check
            it, then move to the next. It keeps errors isolated and easy to
            fix.
          </p>
        </aside>
      </section>

      {/* ———— part 2 · page recipes ———— */}
      <section
        id="recipes"
        className="flex scroll-mt-24 flex-col gap-8"
        aria-labelledby="guide-recipes"
      >
        <div className="hairline" />
        <PartHeading
          kicker="Putting a page together"
          title="Two proven recipes"
          intro="A full page is just a sequence of these sections, in an order that lets the page breathe."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {recipes.map((recipe) => (
            <div key={recipe.name} className="panel h-full p-6 sm:p-7">
              <h3 className="font-display text-[18px] leading-snug font-semibold text-frost">
                {recipe.name}
              </h3>
              {recipe.note && (
                <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-frost-faint uppercase">
                  {recipe.note}
                </p>
              )}
              <ol className="mt-6 flex flex-col">
                {recipe.flow.map((step, i) => (
                  <li key={step} className="flex items-baseline gap-4">
                    <span className="font-mono text-[11px] font-semibold text-orchid">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 border-b border-veil-soft py-2.5 text-[13.5px] text-frost-dim">
                      {step}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {rules.map((rule) => (
            <div key={rule.label} className="border-l-2 border-orchid pl-5 py-1">
              <p className="mb-2 font-mono text-[10px] tracking-[0.24em] text-orchid uppercase">
                {rule.label}
              </p>
              <p className="text-[13.5px] leading-[1.8] text-frost-dim">
                <strong className="font-semibold text-frost">
                  {rule.strong}
                </strong>{" "}
                {rule.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ———— part 3 · checkpoint ———— */}
      <section
        id="checkpoint"
        className="flex scroll-mt-24 flex-col gap-8"
        aria-labelledby="guide-checkpoint"
      >
        <div className="hairline" />
        <PartHeading
          kicker="Before you move on"
          title="Checkpoint"
          intro="Tick these off — your progress is saved in this browser."
        />

        <div className="panel px-6 py-4 sm:px-8 sm:py-6">
          <Checklist items={checkpoints} />
        </div>

        <blockquote className="border-l-2 border-orchid pl-5 py-1">
          <p className="font-display text-lg leading-relaxed font-medium text-frost-dim italic">
            Your site is no longer a hero with nothing under it. It&apos;s a
            full, scrolling, animated experience.{" "}
            <span className="text-orchid not-italic">
              Next up: getting it off your computer and onto the real internet.
            </span>
          </p>
        </blockquote>

        <Link
          href="/library"
          className="panel panel-hover flex items-center justify-between p-6"
        >
          <div>
            <p className="font-mono text-[9.5px] tracking-[0.22em] text-frost-faint uppercase">
              Ready? Start browsing
            </p>
            <p className="mt-1.5 font-display text-[18px] font-semibold text-frost">
              Open the library
            </p>
          </div>
          <span aria-hidden="true" className="text-orchid">
            →
          </span>
        </Link>
      </section>
    </div>
  );
}
