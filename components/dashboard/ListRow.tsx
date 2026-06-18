import Link from "next/link";

type ListRowProps = {
  href: string;
  /** tiny mono label above the title, e.g. "1.2 · Project Showcases" */
  eyebrow?: string;
  title: string;
  blurb?: string;
  /** right-hand slot — a count, a "Soon" badge, etc. */
  trailing?: React.ReactNode;
};

/** A flat, text-only navigation row used in the homepage + Toolkit lists. */
export default function ListRow({
  href,
  eyebrow,
  title,
  blurb,
  trailing,
}: ListRowProps) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-5 border-t border-veil-soft py-4 transition-colors last:border-b"
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="font-mono text-[9.5px] tracking-[0.2em] text-frost-faint uppercase">
            {eyebrow}
          </p>
        )}
        <p className="mt-1 font-display text-[15.5px] font-semibold tracking-tight text-frost transition-colors duration-200 group-hover:text-orchid">
          {title}
        </p>
        {blurb && (
          <p className="mt-1 line-clamp-1 text-[12.5px] leading-relaxed text-frost-dim">
            {blurb}
          </p>
        )}
      </div>
      <span
        aria-hidden="true"
        className="shrink-0 font-mono text-[13px] text-frost-faint transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-orchid"
      >
        {trailing ?? "→"}
      </span>
    </Link>
  );
}
