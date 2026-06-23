import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { groups } from "@/lib/sections";
import { searchIndex } from "@/lib/library";
import { toolkitItems } from "@/lib/toolkit";
import { templates } from "@/lib/templates";
import { isMember } from "@/lib/members";
import Shell from "@/components/dashboard/Shell";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Clerk's proxy already guarantees the user is signed in here.
  // This gate answers the second question: are they a Skool member?
  const user = await currentUser();
  const primary = user?.primaryEmailAddress;
  const isVerified = primary?.verification?.status === "verified";

  if (!primary || !isVerified || !(await isMember(primary.emailAddress))) {
    redirect("/no-access");
  }

  const sidebarGroups = groups.map((group) => ({
    id: group.id,
    name: group.name,
    sections: group.sections.map((section) => ({
      id: section.id,
      title: section.title,
    })),
  }));

  const sidebarToolkit = toolkitItems.map((item) => ({
    id: item.id,
    title: item.title,
  }));

  const sidebarTemplates = templates.map((item) => ({
    id: item.id,
    title: item.title,
  }));

  return (
    <Shell
      groups={sidebarGroups}
      toolkitItems={sidebarToolkit}
      templateItems={sidebarTemplates}
      searchItems={searchIndex}
    >
      {children}
    </Shell>
  );
}
