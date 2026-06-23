import Image from "next/image";
import Link from "next/link";
import { allSections, sectionCount } from "@/lib/library";
import { toolkitItems, toolkitCount } from "@/lib/toolkit";
import { templates, templateCount } from "@/lib/templates";
import { soonCategories } from "@/lib/catalog";
import ListRow from "@/components/dashboard/ListRow";
import { ArrowRightIcon } from "@/components/dashboard/icons";

/** Homepage spotlight: one lead component + a small gallery. Full set is /library. */
const [lead, ...rest] = allSections.slice(0, 7);

function SectionHead({
  title,
  meta,
  href,
  cta,
}: {
  title: string;
  meta: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4">
      <div className="flex items-baseline gap-3">
        <h2 className="font-display text-lg font-semibold tracking-tight text-frost">
          {title}
        </h2>
        <span className="font-mono text-[10px] tracking-[0.2em] text-frost-faint uppercase">
          {meta}
        </span>
      </div>
      <Link
        href={href}
        className="group inline-flex shrink-0 items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] text-orchid uppercase"
      >
        {cta}
        <ArrowRightIcon className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

export default function Home() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-16">
      {/* ———— hero ———— */}
      <header
        className="rise"
        style={{ "--rise-delay": "40ms" } as React.CSSProperties}
      >
        <p className="font-mono text-[10px] tracking-[0.28em] text-orchid uppercase">
          Web Motion Academy
        </p>
        <h1 className="mt-4 font-display text-[2.8rem] leading-[1.04] font-bold tracking-tight text-frost sm:text-[3.6rem]">
          The Web Motion <span className="text-orchid">Library</span>
        </h1>
        <p className="mt-5 max-w-2xl text-[15.5px] leading-[1.8] text-frost-dim">
          One home for everything you build with Claude Code — drop-in animated
          components and a growing toolkit of the setup prompts and design files
          behind every site. Pick one, paste its prompt, describe your brand.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/library"
            className="group inline-flex items-center gap-2.5 rounded-lg bg-orchid px-6 py-3 text-[13.5px] font-medium text-abyss transition-opacity duration-200 hover:opacity-90"
          >
            Browse {sectionCount} components
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/guide"
            className="inline-flex items-center rounded-lg border border-veil px-6 py-3 text-[13.5px] text-frost-dim transition-colors duration-200 hover:border-orchid/40 hover:text-frost"
          >
            How to use it
          </Link>
        </div>
      </header>

      {/* ———— components — visual spotlight ———— */}
      <section aria-labelledby="home-components">
        <SectionHead
          title="Components"
          meta={`${sectionCount} animated sections`}
          href="/library"
          cta="Browse all"
        />

        {/* lead — large split card */}
        <Link
          href={`/section/${lead.section.id}`}
          className="panel panel-hover group grid overflow-hidden sm:grid-cols-[1.15fr_1fr]"
        >
          <div className="relative aspect-[16/10] overflow-hidden border-b border-veil-soft sm:aspect-auto sm:min-h-[280px] sm:border-r sm:border-b-0">
            <Image
              src={`/thumbs/${lead.section.id}.webp`}
              alt={`Preview of the ${lead.section.title} section`}
              fill
              sizes="(max-width: 640px) 100vw, 55vw"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
              priority
            />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <p className="font-mono text-[9.5px] tracking-[0.22em] text-orchid uppercase">
              Featured · {lead.section.number} · {lead.group.name}
            </p>
            <h3 className="mt-2 font-display text-[1.7rem] leading-[1.1] font-bold tracking-tight text-frost transition-colors duration-200 group-hover:text-orchid sm:text-[2rem]">
              {lead.section.title}
            </h3>
            <p className="mt-3 line-clamp-3 text-[13.5px] leading-[1.7] text-frost-dim">
              {lead.section.whatItIs}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {lead.section.tags.slice(0, 3).map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-veil-soft px-2.5 py-1 font-mono text-[9px] tracking-[0.12em] text-frost-dim uppercase"
                >
                  {tag}
                </li>
              ))}
            </ul>
            <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] text-orchid uppercase">
              View component
              <ArrowRightIcon className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>

        {/* gallery — overlay-title image cards */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map(({ section, group }) => (
            <Link
              key={section.id}
              href={`/section/${section.id}`}
              className="panel panel-hover group relative aspect-[4/3] overflow-hidden"
            >
              <Image
                src={`/thumbs/${section.id}.webp`}
                alt={`Preview of the ${section.title} section`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-mono text-[9px] tracking-[0.2em] text-frost/60 uppercase">
                  {section.number} · {group.name}
                </p>
                <h4 className="mt-1 font-display text-[15px] leading-snug font-semibold tracking-tight text-frost">
                  {section.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ———— website templates — visual spotlight ———— */}
      <section aria-labelledby="home-templates">
        <SectionHead
          title="Website Templates"
          meta={`${templateCount} full ${templateCount === 1 ? "site" : "sites"}`}
          href="/templates"
          cta="Browse all"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {templates.map((t) => (
            <Link
              key={t.id}
              href={`/templates/${t.id}`}
              className="panel panel-hover group relative aspect-[16/10] overflow-hidden"
            >
              <Image
                src={t.thumb}
                alt={`Preview of the ${t.title} template`}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-mono text-[9px] tracking-[0.2em] text-frost/60 uppercase">
                  {t.number} · Full multi-page site
                </p>
                <h4 className="mt-1 font-display text-[17px] leading-snug font-semibold tracking-tight text-frost">
                  {t.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ———— text-only sections, kept narrow ———— */}
      <div className="flex max-w-3xl flex-col gap-16">
        {/* toolkit */}
        <section aria-labelledby="home-toolkit">
          <SectionHead
            title="Toolkit"
            meta={`${toolkitCount} tools`}
            href="/toolkit"
            cta="Open toolkit"
          />
          <div className="flex flex-col">
            {toolkitItems.map((item) => (
              <ListRow
                key={item.id}
                href={`/toolkit/${item.id}`}
                eyebrow={`${item.number} · ${
                  item.kind === "file" ? "Design file" : "Prompt"
                }`}
                title={item.title}
                blurb={item.blurb}
              />
            ))}
          </div>
        </section>

        {/* coming soon */}
        <section aria-labelledby="home-soon">
          <h2
            id="home-soon"
            className="mb-4 font-display text-lg font-semibold tracking-tight text-frost"
          >
            Coming soon
          </h2>
          <div className="flex flex-col">
            {soonCategories.map((category) => (
              <ListRow
                key={category.id}
                href={category.href}
                eyebrow="Category"
                title={category.name}
                blurb={category.blurb}
                trailing={
                  <span className="rounded-full bg-orchid/12 px-2 py-0.5 font-mono text-[8px] tracking-[0.18em] text-orchid uppercase">
                    Soon
                  </span>
                }
              />
            ))}
          </div>
        </section>

        {/* the one rule */}
        <aside className="border-l-2 border-orchid py-1 pl-5">
          <p className="text-[14px] leading-[1.75] text-frost-dim">
            <strong className="font-semibold text-frost">
              One rule: one piece at a time.
            </strong>{" "}
            Don&apos;t paste three prompts in one message. Integrate one, check
            it, then move to the next — it keeps errors isolated and easy to fix.
          </p>
        </aside>
      </div>
    </div>
  );
}
