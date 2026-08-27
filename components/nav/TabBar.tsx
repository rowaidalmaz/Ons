"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    href: "/",
    label: "تعلّمي",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" strokeWidth={1.7} stroke={active ? "var(--gold)" : "#B5A190"}>
        <path d="M4 19.5V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2Z" />
        <path d="M8 7h8M8 11h6" />
      </svg>
    ),
  },
  {
    href: "/search",
    label: "ابحث",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" strokeWidth={1.7} stroke={active ? "var(--gold)" : "#B5A190"}>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m20 20-3.8-3.8" />
      </svg>
    ),
  },
  {
    href: "/documentaries",
    label: "وثائقيات",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" strokeWidth={1.7} stroke={active ? "var(--gold)" : "#B5A190"}>
        <rect x="3" y="5" width="14" height="14" rx="2" />
        <path d="m21 8-4 3 4 3z" />
      </svg>
    ),
  },
  {
    href: "/my-space",
    label: "مساحتي",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" strokeWidth={1.7} stroke={active ? "var(--gold)" : "#B5A190"}>
        <path d="M20.8 8.6c0 5-8.8 10.6-8.8 10.6S3.2 13.6 3.2 8.6a4.8 4.8 0 0 1 8.8-2.6 4.8 4.8 0 0 1 8.8 2.6Z" />
      </svg>
    ),
  },
];

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-10 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex flex-none items-center gap-2 whitespace-nowrap px-4 py-3.5 text-[13.5px] font-bold ${
                active ? "text-ink" : "text-[#B5A190]"
              }`}
            >
              {tab.icon(active)}
              {tab.label}
              {active && (
                <span className="absolute inset-x-4 -bottom-px h-[3px] rounded-full bg-gold" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
