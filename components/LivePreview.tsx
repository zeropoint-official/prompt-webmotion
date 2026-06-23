"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

type LivePreviewProps = {
  id: string;
  title: string;
  /** taller desktop frame — for full-site previews you scroll end to end */
  tall?: boolean;
  /**
   * Render the desktop iframe at this fixed CSS width and visually scale it to
   * fit the panel. Lets width-gated sections (matchMedia ≥1024px) show their
   * real desktop layout even inside a narrow inline panel. Omit for the normal
   * fluid behaviour used by single-section previews.
   */
  desktopWidth?: number;
  /** override the footer hint line */
  note?: string;
};

export default function LivePreview({
  id,
  title,
  tall,
  desktopWidth,
  note,
}: LivePreviewProps) {
  const [mode, setMode] = useState<"desktop" | "mobile">("desktop");
  const [load, setLoad] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // Scaled-desktop sizing (only when desktopWidth is set).
  const shellRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const scaled = mode === "desktop" && !!desktopWidth;
  const designH = tall ? 860 : 680;

  // Only mount the iframe once the card is near the viewport.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Measure the panel and scale the fixed-width iframe down to fit it.
  useLayoutEffect(() => {
    if (!scaled || !desktopWidth) return;
    const el = shellRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      setScale(Math.min(1, w / desktopWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [scaled, desktopWidth, load]);

  const src = `/preview/${id}`;

  return (
    <div ref={ref} className="panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-veil-soft px-6 py-3.5">
        <span className="font-mono text-[10px] tracking-[0.22em] text-frost-dim uppercase">
          Live preview
        </span>
        <div className="flex items-center gap-4">
          <div className="flex overflow-hidden rounded-lg border border-veil">
            {(["desktop", "mobile"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
                className={`cursor-pointer px-3.5 py-1.5 font-mono text-[9.5px] tracking-[0.16em] uppercase transition-colors ${
                  mode === m
                    ? "bg-orchid font-medium text-abyss"
                    : "text-frost-faint hover:text-frost-dim"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setFrameKey((k) => k + 1)}
            className="cursor-pointer font-mono text-[9.5px] tracking-[0.16em] text-frost-faint uppercase transition-colors hover:text-orchid"
            title="Restart the preview"
          >
            ↻ Replay
          </button>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[9.5px] tracking-[0.16em] text-frost-faint uppercase underline decoration-orchid/40 underline-offset-4 transition-colors hover:text-orchid"
          >
            Full screen ↗
          </a>
        </div>
      </div>

      <div
        className="flex justify-center transition-colors"
        style={{ background: mode === "mobile" ? "rgba(4,2,8,0.5)" : undefined }}
      >
        {!load ? (
          <div
            className={`flex w-full items-center justify-center ${
              tall ? "h-[40rem] sm:h-[46rem]" : "h-[34rem] sm:h-[38rem]"
            }`}
          >
            <span className="font-mono text-[10px] tracking-[0.22em] text-frost-faint uppercase">
              Loading preview…
            </span>
          </div>
        ) : scaled ? (
          // True desktop width, scaled to fit the panel.
          <div
            ref={shellRef}
            className="w-full overflow-hidden"
            style={{ height: Math.round(designH * scale) }}
          >
            <iframe
              key={`${mode}-${frameKey}`}
              src={src}
              title={`Live preview — ${title}`}
              loading="lazy"
              style={{
                width: desktopWidth,
                height: designH,
                border: 0,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            />
          </div>
        ) : (
          <iframe
            key={`${mode}-${frameKey}`}
            src={src}
            title={`Live preview — ${title}`}
            loading="lazy"
            className={
              mode === "desktop"
                ? tall
                  ? "h-[40rem] w-full sm:h-[46rem]"
                  : "h-[34rem] w-full sm:h-[38rem]"
                : "my-8 h-[44rem] w-[24.4rem] max-w-full rounded-2xl border border-veil"
            }
          />
        )}
      </div>

      <p className="border-t border-veil-soft px-6 py-3 font-mono text-[9.5px] tracking-[0.14em] text-frost-faint uppercase">
        {note ??
          "Scroll & click inside the frame — it's the real section running with demo content"}
      </p>
    </div>
  );
}
