import { notFound } from "next/navigation";
import { demoRegistry } from "@/lib/demo-registry";
import { getSection } from "@/lib/library";

export function generateStaticParams() {
  return Object.keys(demoRegistry).map((id) => ({ id }));
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
      ? `${entry.section.title} — Live Preview`
      : "Live Preview — The Web Motion Library",
  };
}

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = demoRegistry[id];
  if (!entry) notFound();

  const { Component, frame, background, hint } = entry;

  if (frame === "centered") {
    return (
      <div
        className="flex min-h-svh items-center justify-center px-6 py-16"
        style={{ background }}
      >
        <div className="w-full max-w-5xl">
          <Component />
        </div>
      </div>
    );
  }

  if (frame === "runway") {
    return (
      <div style={{ background }}>
        <div className="flex h-[55svh] flex-col items-center justify-end pb-12">
          <p className="font-mono text-[11px] tracking-[0.3em] text-white/40 uppercase">
            {hint ?? "Scroll"}
          </p>
          <div className="mt-5 h-12 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent" />
        </div>
        <Component />
        <div className="flex h-[50svh] items-center justify-center">
          <p className="font-mono text-[11px] tracking-[0.3em] text-white/30 uppercase">
            End of section preview
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background }}>
      <Component />
    </div>
  );
}
