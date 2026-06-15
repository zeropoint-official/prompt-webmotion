import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { groups } from "@/lib/sections";
import { searchIndex } from "@/lib/library";
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

  return (
    <Shell groups={sidebarGroups} searchItems={searchIndex}>
      {children}
    </Shell>
  );
}
