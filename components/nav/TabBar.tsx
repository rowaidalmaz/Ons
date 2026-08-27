"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "تعلم" },
  { href: "/search", label: "ابحث" },
  { href: "/documentaries", label: "وثائقيات" },
  { href: "/my-space", label: "مساحتي" },
];

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="no-scrollbar -mx-1 flex flex-1 items-center gap-1 overflow-x-auto">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`flex-none whitespace-nowrap rounded-lg px-3 py-2 text-[15px] transition-colors max-lg:text-sm ${
              active
                ? "bg-tint font-bold text-ink"
                : "font-medium text-ink-soft hover:bg-tint hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
