"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SearchEntry } from "@/lib/library";
import SearchBox from "./SearchBox";
import { CloseIcon } from "./icons";

export type SidebarGroup = {
  id: string;
  name: string;
  sections: { id: string; title: string }[];
};

type SidebarProps = {
  groups: SidebarGroup[];
  searchItems: SearchEntry[];
  open: boolean;
  onClose: () => void;
};

type NavLinkProps = {
  href: string;
  active: boolean;
  onNavigate: () => void;
  children: React.ReactNode;
  nested?: boolean;
  badge?: React.ReactNode;
};

function NavLink({
  href,
  active,
  onNavigate,
  children,
  nested,
  badge,
}: NavLinkProps) {
  return (
    <li>
      <Link
        href={href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={`flex items-center justify-between gap-2 border-l-2 py-1.5 transition-colors duration-200 ${
          nested ? "pl-4 text-[12.5px]" : "pl-3 text-[13px]"
        } ${
          active
            ? "border-orchid font-medium text-orchid"
            : "border-transparent text-frost-dim hover:border-veil hover:text-frost"
        }`}
      >
        <span className="truncate">{children}</span>
        {badge}
      </Link>
    </li>
  );
}

function SoonBadge() {
  return (
    <span className="shrink-0 rounded-full bg-orchid/12 px-1.5 py-0.5 font-mono text-[8px] tracking-[0.18em] text-orchid uppercase">
      Soon
    </span>
  );
}

export default function Sidebar({
  groups,
  searchItems,
  open,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  const componentsActive =
    pathname === "/library" || pathname.startsWith("/section");

  return (
    <>
      {/* mobile scrim */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-abyss/80 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col border-r border-veil-soft bg-abyss transition-transform duration-300 ease-out lg:w-[232px] lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* brand */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4">
          <Link href="/" onClick={onClose} className="min-w-0">
            <p className="truncate font-display text-[15px] font-semibold tracking-tight text-frost">
              Web Motion Library
            </p>
            <p className="truncate font-mono text-[9px] tracking-[0.22em] text-frost-faint uppercase">
              Web Motion Academy
            </p>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-frost-faint transition-colors hover:text-frost lg:hidden"
            aria-label="Close menu"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 pb-4">
          <SearchBox items={searchItems} />
        </div>

        <nav
          className="prompt-scroll flex-1 overflow-y-auto px-5 pb-6"
          aria-label="Main"
        >
          <ul className="flex flex-col">
            <NavLink href="/" active={pathname === "/"} onNavigate={onClose}>
              Home
            </NavLink>
          </ul>

          {/* ——— Components (live) ——— */}
          <div className="mt-5">
            <ul className="flex flex-col">
              <NavLink
                href="/library"
                active={componentsActive}
                onNavigate={onClose}
              >
                Components
              </NavLink>
            </ul>
            <div className="mt-1.5 ml-3 border-l border-veil-soft pl-1">
              {groups.map((group) => (
                <div key={group.id} className="mt-2.5 first:mt-1">
                  <p className="pl-3 pb-1 font-mono text-[8.5px] tracking-[0.24em] text-frost-faint uppercase">
                    {group.name}
                  </p>
                  <ul className="flex flex-col">
                    {group.sections.map((section) => (
                      <NavLink
                        key={section.id}
                        href={`/section/${section.id}`}
                        active={pathname === `/section/${section.id}`}
                        onNavigate={onClose}
                        nested
                      >
                        {section.title}
                      </NavLink>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* ——— upcoming categories + guide ——— */}
          <ul className="mt-5 flex flex-col">
            <NavLink
              href="/hero-animations"
              active={pathname.startsWith("/hero-animations")}
              onNavigate={onClose}
              badge={<SoonBadge />}
            >
              Hero Animations
            </NavLink>
            <NavLink
              href="/templates"
              active={pathname.startsWith("/templates")}
              onNavigate={onClose}
              badge={<SoonBadge />}
            >
              Website Templates
            </NavLink>
          </ul>

          <ul className="mt-5 flex flex-col">
            <NavLink
              href="/guide"
              active={pathname.startsWith("/guide")}
              onNavigate={onClose}
            >
              Guide
            </NavLink>
          </ul>
        </nav>

        <p className="border-t border-veil-soft px-5 py-4 font-mono text-[9px] tracking-[0.2em] text-frost-faint uppercase">
          Web Motion Academy · Lesson 3
        </p>
      </aside>
    </>
  );
}
