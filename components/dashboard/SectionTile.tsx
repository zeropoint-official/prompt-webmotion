import Image from "next/image";
import Link from "next/link";
import type { Section } from "@/lib/sections";

type SectionTileProps = {
  section: Section;
  /** show the parent group name above the title */
  groupName?: string;
};

export default function SectionTile({ section, groupName }: SectionTileProps) {
  return (
    <Link
      href={`/section/${section.id}`}
      className="panel panel-hover group flex h-full flex-col overflow-hidden"
    >
      {/* screenshot preview */}
      <div className="relative aspect-[16/9] overflow-hidden border-b border-veil-soft">
        <Image
          src={`/thumbs/${section.id}.jpg`}
          alt={`Preview of the ${section.title} section`}
          width={1600}
          height={964}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="h-full w-full object-cover object-top"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-[9.5px] tracking-[0.2em] text-frost-faint uppercase">
          {section.number}
          {groupName ? ` · ${groupName}` : ""}
        </p>
        <h3 className="mt-1.5 font-display text-[18px] leading-snug font-semibold tracking-tight text-frost transition-colors duration-200 group-hover:text-orchid">
          {section.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-[1.7] text-frost-dim">
          {section.whatItIs}
        </p>
      </div>
    </Link>
  );
}
