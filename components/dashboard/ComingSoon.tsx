import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/catalog";
import { ArrowRightIcon } from "./icons";

type ComingSoonProps = {
  category: Category;
};

export default function ComingSoon({ category }: ComingSoonProps) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10">
      <header
        className="rise"
        style={{ "--rise-delay": "40ms" } as React.CSSProperties}
      >
        <div className="flex items-center gap-3">
          <p className="font-mono text-[10px] tracking-[0.28em] text-orchid uppercase">
            Web Motion Library
          </p>
          <span className="rounded-full border border-orchid/40 px-2.5 py-0.5 font-mono text-[9px] tracking-[0.18em] text-orchid uppercase">
            Coming soon
          </span>
        </div>
        <h1 className="mt-4 font-display text-[2.4rem] leading-[1.05] font-bold tracking-tight text-frost sm:text-[3.2rem]">
          {category.name}
        </h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-[1.8] text-frost-dim">
          {category.teaser}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        {/* what's coming */}
        <section className="rise" style={{ "--rise-delay": "120ms" } as React.CSSProperties}>
          <h2 className="font-display text-lg font-semibold tracking-tight text-frost">
            What&apos;s coming
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {category.points?.map((point) => (
              <li key={point} className="flex gap-3 text-[14px] leading-[1.7] text-frost-dim">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orchid" />
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/library"
              className="group inline-flex items-center gap-2.5 rounded-lg bg-orchid px-6 py-3 text-[13.5px] font-medium text-abyss transition-opacity duration-200 hover:opacity-90"
            >
              Browse Components meanwhile
              <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/guide"
              className="inline-flex items-center rounded-lg border border-veil px-6 py-3 text-[13.5px] text-frost-dim transition-colors duration-200 hover:border-orchid/40 hover:text-frost"
            >
              How the library works
            </Link>
          </div>
        </section>

        {/* blurred teaser imagery */}
        <div
          className="rise relative aspect-[4/5] overflow-hidden rounded-2xl border border-veil-soft"
          style={{ "--rise-delay": "180ms" } as React.CSSProperties}
        >
          <Image
            src={category.thumbs[0]}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover object-top blur-[2px] saturate-[0.9]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/55 to-abyss/25" />
          <div className="absolute inset-0 flex items-end p-6">
            <p className="font-mono text-[10px] tracking-[0.2em] text-frost-faint uppercase">
              Preview · final designs in progress
            </p>
          </div>
        </div>
      </div>

      <aside className="border-l-2 border-orchid py-1 pl-5">
        <p className="text-[14px] leading-[1.75] text-frost-dim">
          <strong className="font-semibold text-frost">
            Not ready yet — but close.
          </strong>{" "}
          {category.name} ships into this same library, in the same one-prompt
          workflow. Keep building with Components in the meantime.
        </p>
      </aside>
    </div>
  );
}
