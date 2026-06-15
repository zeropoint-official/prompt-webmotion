import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories } from "@/lib/catalog";
import ComingSoon from "@/components/dashboard/ComingSoon";

export const metadata: Metadata = {
  title: "Website Templates (soon) — Web Motion Library",
};

export default function TemplatesPage() {
  const category = categories.find((c) => c.id === "templates");
  if (!category) notFound();
  return <ComingSoon category={category} />;
}
