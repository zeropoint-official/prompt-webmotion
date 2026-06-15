import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories } from "@/lib/catalog";
import ComingSoon from "@/components/dashboard/ComingSoon";

export const metadata: Metadata = {
  title: "Hero Animations (soon) — Web Motion Library",
};

export default function HeroAnimationsPage() {
  const category = categories.find((c) => c.id === "hero-animations");
  if (!category) notFound();
  return <ComingSoon category={category} />;
}
