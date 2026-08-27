"use client";

import { useBookmarks } from "./BookmarksProvider";
import type { SavedItem } from "@/lib/supabase/types";

/**
 * Save / unsave toggle for one reading or watching item. Drop it into any
 * card — it reads and writes the shared bookmarks store.
 */
export function BookmarkButton({
  item,
  className = "",
  tone = "overlay",
}: {
  item: SavedItem;
  className?: string;
  tone?: "overlay" | "plain";
}) {
  const { isSaved, toggle } = useBookmarks();
  const saved = isSaved(item.kind, item.itemId);

  const base =
    tone === "overlay"
      ? "bg-black/30 text-white backdrop-blur-sm hover:bg-black/45"
      : "bg-tint text-ink-soft hover:text-ink";

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? "إزالة من المحفوظات" : "احفظ"}
      title={saved ? "محفوظ" : "احفظ"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(item);
      }}
      className={`flex h-8 w-8 flex-none items-center justify-center rounded-lg transition-colors ${
        saved ? "bg-gold text-white hover:bg-gold" : base
      } ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1Z" />
      </svg>
    </button>
  );
}
