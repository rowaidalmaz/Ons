"use client";

import Link from "next/link";
import { useBookmarks } from "@/components/bookmarks/BookmarksProvider";
import type { BookmarkKind, SavedItem } from "@/lib/supabase/types";

const KIND_LABEL: Record<BookmarkKind, string> = {
  content: "تعلم",
  research: "بحث",
  documentary: "وثائقي",
};

const STRIP_MAX = 8;

/**
 * The mother's saved list ("المحفوظات"), surfaced on مساحتي as a compact
 * horizontal strip. Full list + sharing still live at /saved. Reads the same
 * client bookmarks store the rest of the app writes to.
 */
export function SavedStrip() {
  const { ready, items, count } = useBookmarks();
  if (!ready) return null;

  return (
    <section className="mb-6">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-[15px] font-bold text-ink">محفوظاتك</h2>
        {count > 0 && (
          <Link href="/saved" className="flex-none text-[12px] font-bold text-gold">
            كل المحفوظات ({count})
          </Link>
        )}
      </div>

      {count === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-4 text-center text-[12.5px] leading-7 text-ink-soft">
          احفظي أي قراءة أو صوت يريّحك بأيقونة 🔖، وبيكون هنا جاهز لك وقت ما تحتاجينه.
        </div>
      ) : (
        <div className="no-scrollbar -mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1">
          {items.slice(0, STRIP_MAX).map((item) => (
            <SavedCard key={`${item.kind}:${item.itemId}`} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

function SavedCard({ item }: { item: SavedItem }) {
  const badge = item.badge ?? KIND_LABEL[item.kind];
  const inner = (
    <>
      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-paper-deep text-xl">
        {item.emoji ?? "🔖"}
      </div>
      <span className="mb-1 inline-block rounded-md bg-tint px-1.5 py-0.5 text-[10px] font-bold text-ink-soft">
        {badge}
      </span>
      <h3 className="line-clamp-3 text-[12.5px] font-bold leading-5 text-ink">{item.title}</h3>
    </>
  );

  const className = "flex w-[148px] flex-none flex-col rounded-2xl border border-line bg-white p-3";
  return item.href ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  ) : (
    <div className={className}>{inner}</div>
  );
}
