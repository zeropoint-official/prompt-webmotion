import { groups } from "@/lib/sections";
import { searchIndex } from "@/lib/library";
import Shell from "@/components/dashboard/Shell";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const sidebarGroups = groups.map((group) => ({
    id: group.id,
    name: group.name,
    sections: group.sections.map((section) => ({
      id: section.id,
      title: section.title,
    })),
  }));

  return (
    <Shell groups={sidebarGroups} searchItems={searchIndex}>
      {children}
    </Shell>
  );
}
