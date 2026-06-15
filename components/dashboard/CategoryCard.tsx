import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/catalog";
import { ArrowRightIcon } from "./icons";

type CategoryCardProps = {
  category: Category;
};

export default function CategoryCard({ category }: CategoryCardProps) {
  const isLive = category.status === "live";

  const inner = (
    <>
      {/* preview imagery */}
      <div className="relative aspect-[16/10] overflow-hidden border-b border-veil-soft">
        <div className="absolute inset-0 grid grid-cols-2 gap-px bg-veil-soft">
          {category.thumbs.slice(0, 2).map((src, i) => (
            <div key={src} className="relative overflow-hidden bg-abyss-2">
              <Image
                src={src}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, 22vw"
                className={`object-cover object-top transition-transform duration-500 group-hover:scale-[1.04] ${
                  isLive ? "" : "scale-105 blur-[3px] saturate-[0.85]"
                } ${i === 1 ? "hidden sm:block" : ""}`}
              />
            </div>
          ))}
        </div>

        {/* wash so text/badges read on top of imagery */}
        <div
          className={`absolute inset-0 ${
            isLive
              ? "bg-gradient-to-t from-abyss/70 via-abyss/10 to-transparent"
              : "bg-gradient-to-t from-abyss via-abyss/60 to-abyss/30"
          }`}
        />

        {/* status pill */}
        <div className="absolute top-3 left-3">
          {isLive ? (
            <span className="rounded-full bg-orchid px-2.5 py-1 font-mono text-[9px] tracking-[0.16em] text-abyss uppercase">
              {category.count} live
            </span>
          ) : (
            <span className="rounded-full border border-orchid/40 bg-abyss/70 px-2.5 py-1 font-mono text-[9px] tracking-[0.16em] text-orchid uppercase backdrop-blur-sm">
              Coming soon
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[19px] leading-snug font-semibold tracking-tight text-frost transition-colors duration-200 group-hover:text-orchid">
          {category.name}
        </h3>
        <p className="mt-2 flex-1 text-[13px] leading-[1.7] text-frost-dim">
          {category.blurb}
        </p>

        <div className="mt-4 flex items-center gap-2 font-mono text-[10.5px] tracking-[0.14em] text-frost-faint uppercase">
          {isLive ? (
            <>
              <span className="text-orchid">Browse</span>
              <ArrowRightIcon className="h-3 w-3 text-orchid transition-transform duration-200 group-hover:translate-x-0.5" />
            </>
          ) : (
            <span>Preview what&apos;s coming</span>
          )}
        </div>
      </div>
    </>
  );

  return (
    <Link
      href={category.href}
      className="panel panel-hover group flex h-full flex-col overflow-hidden"
    >
      {inner}
    </Link>
  );
}
