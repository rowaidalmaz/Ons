"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBookmarks } from "./BookmarksProvider";

export function SavedLink() {
  const { count } = useBookmarks();
  const pathname = usePathname();
  const active = pathname === "/saved" || pathname.startsWith("/saved/");

  return (
    <Link
      href="/saved"
      aria-label={`المحفوظات${count ? ` (${count})` : ""}`}
      aria-current={active ? "page" : undefined}
      className={`relative flex-none rounded-lg p-2 transition-colors ${
        active ? "bg-tint text-ink" : "text-ink-soft hover:bg-tint hover:text-ink"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-[19px] w-[19px]"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1Z" />
      </svg>
      {count > 0 && (
        <span className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">
          {count > 99 ? "99" : count}
        </span>
      )}
    </Link>
  );
}
