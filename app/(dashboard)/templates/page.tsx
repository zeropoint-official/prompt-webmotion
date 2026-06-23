import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { templates, templateCount } from "@/lib/templates";
import { ArrowRightIcon } from "@/components/dashboard/icons";

export const metadata: Metadata = {
  title: "Website Templates — The Web Motion Library",
};

export default function TemplatesPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <header
        className="rise"
        style={{ "--rise-delay": "40ms" } as React.CSSProperties}
      >
        <p className="font-mono text-[10px] tracking-[0.28em] text-orchid uppercase">
          {templateCount} {templateCount === 1 ? "template" : "templates"} ·
          full multi-page sites
        </p>
        <h1 className="mt-3 font-display text-[2.2rem] leading-tight font-bold tracking-tight text-frost sm:text-[2.6rem]">
          Website Templates
        </h1>
        <p className="mt-3 max-w-2xl text-[14.5px] leading-[1.8] text-frost-dim">
          Complete, multi-page sites — hero, services, showcase, contact and
          more — wired together as one coherent template. Paste a single prompt
          into Claude Code and rebuild the whole site, then rebrand it as your
          own. Start from a finished site instead of a blank page.
        </p>
      </header>

      <div
        className="rise flex flex-col gap-6"
        style={{ "--rise-delay": "120ms" } as React.CSSProperties}
      >
        {templates.map((t) => (
          <Link
            key={t.id}
            href={`/templates/${t.id}`}
            className="panel panel-hover group grid overflow-hidden sm:grid-cols-[1.1fr_1fr]"
          >
            <div className="relative aspect-[16/10] overflow-hidden border-b border-veil-soft sm:aspect-auto sm:min-h-[300px] sm:border-r sm:border-b-0">
              <Image
                src={t.thumb}
                alt={`Preview of the ${t.title} template`}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-abyss/60 via-transparent to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-abyss/70 px-2.5 py-1 font-mono text-[9px] tracking-[0.18em] text-frost uppercase backdrop-blur-sm">
                {t.number} · Full site
              </span>
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-8">
              <p className="font-mono text-[9.5px] tracking-[0.22em] text-orchid uppercase">
                Website Template
              </p>
              <h2 className="mt-2 font-display text-[1.7rem] leading-[1.1] font-bold tracking-tight text-frost transition-colors duration-200 group-hover:text-orchid sm:text-[2rem]">
                {t.title}
              </h2>
              <p className="mt-3 line-clamp-3 text-[13.5px] leading-[1.7] text-frost-dim">
                {t.blurb}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {t.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-veil-soft px-2.5 py-1 font-mono text-[9px] tracking-[0.12em] text-frost-dim uppercase"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
              <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] text-orchid uppercase">
                View template
                <ArrowRightIcon className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <aside className="border-l-2 border-orchid py-1 pl-5">
        <p className="text-[14px] leading-[1.75] text-frost-dim">
          <strong className="font-semibold text-frost">
            A template rebuilds an entire site.
          </strong>{" "}
          Run it in an empty folder, let it finish, then rebrand — copy, images
          and accent. The only piece that needs regenerating rather than editing
          is the scroll-video hero; each template tells you how.
        </p>
      </aside>
    </div>
  );
}
