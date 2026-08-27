import type { BookmarkKind, SavedItem } from "@/lib/supabase/types";

const KIND_LABEL: Record<BookmarkKind, string> = {
  content: "تعلم",
  research: "بحث",
  documentary: "وثائقي",
};

/**
 * One saved item, presentational only. `/saved` passes `onRemove`; the shared
 * read-only view (`/saved/[collection]`) does not.
 */
export function BookmarkRow({
  item,
  onRemove,
}: {
  item: SavedItem;
  onRemove?: () => void;
}) {
  const badge = item.badge ?? KIND_LABEL[item.kind];
  const inner = (
    <>
      <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-paper-deep text-xl">
        {item.emoji ?? "🔖"}
      </div>
      <div className="min-w-0 flex-1">
        <span className="mb-1 inline-block rounded-md bg-tint px-1.5 py-0.5 text-[10px] font-bold text-ink-soft">
          {badge}
        </span>
        <h3 className="line-clamp-2 text-[15px] font-bold leading-6 text-ink">{item.title}</h3>
        {item.subtitle && (
          <p className="mt-0.5 line-clamp-1 text-[12px] text-ink-soft">{item.subtitle}</p>
        )}
      </div>
    </>
  );

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3">
      {item.href ? (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-0 flex-1 items-center gap-3"
        >
          {inner}
        </a>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-3">{inner}</div>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="إزالة من المحفوظات"
          className="flex-none rounded-lg p-2 text-ink-soft transition-colors hover:bg-tint hover:text-ink"
        >
          <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
          </svg>
        </button>
      )}
    </div>
  );
}
