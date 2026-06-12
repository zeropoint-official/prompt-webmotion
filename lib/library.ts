import { groups, type Group, type Section } from "./sections";

export type SectionWithGroup = {
  section: Section;
  group: Group;
};

export const allSections: SectionWithGroup[] = groups.flatMap((group) =>
  group.sections.map((section) => ({ section, group }))
);

export const sectionCount = allSections.length;

export function getGroup(id: string): Group | undefined {
  return groups.find((g) => g.id === id);
}

export function getSection(id: string): SectionWithGroup | undefined {
  return allSections.find((s) => s.section.id === id);
}

/** prev / next across the whole library, in reading order */
export function getSectionNeighbours(id: string): {
  prev: SectionWithGroup | null;
  next: SectionWithGroup | null;
} {
  const index = allSections.findIndex((s) => s.section.id === id);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? allSections[index - 1] : null,
    next: index < allSections.length - 1 ? allSections[index + 1] : null,
  };
}

/** flat, serialisable index handed to the client-side search box */
export type SearchEntry = {
  id: string;
  number: string;
  title: string;
  groupId: string;
  groupName: string;
  tags: string[];
  blurb: string;
};

export const searchIndex: SearchEntry[] = allSections.map(
  ({ section, group }) => ({
    id: section.id,
    number: section.number,
    title: section.title,
    groupId: group.id,
    groupName: group.name,
    tags: section.tags,
    blurb: section.whatItIs,
  })
);
