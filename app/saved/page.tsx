"use client";

import Link from "next/link";
import { useBookmarks } from "@/components/bookmarks/BookmarksProvider";
import { BookmarkRow } from "@/components/bookmarks/BookmarkRow";
import { ShareBar } from "@/components/bookmarks/ShareBar";

export default function SavedPage() {
  const { ready, items, collectionId, toggle, count } = useBookmarks();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-ink lg:text-[34px]">المحفوظات</h1>
      <p className="mb-6 text-[14px] leading-7 text-ink-soft">
        كل قراءة أو مشاهدة حفظتيها من أي تبويب — في مكان واحد، وتقدرين تشاركين القائمة مع غيرك.
      </p>

      {ready && count > 0 && collectionId && (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <ShareBar collectionId={collectionId} />
          <span className="text-[12px] text-ink-soft">{count} عنصر محفوظ</span>
        </div>
      )}

      {!ready ? (
        <p className="text-[13.5px] text-ink-soft">…</p>
      ) : count === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-6 text-center text-[13.5px] leading-7 text-ink-soft">
          ما حفظتي شي بعد. اضغطي على أيقونة 🔖 على أي محتوى في{" "}
          <Link href="/" className="font-bold text-gold">
            تعلم
          </Link>
          ،{" "}
          <Link href="/search" className="font-bold text-gold">
            ابحث
          </Link>{" "}
          أو{" "}
          <Link href="/documentaries" className="font-bold text-gold">
            وثائقيات
          </Link>
          .
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {items.map((item) => (
            <BookmarkRow
              key={`${item.kind}:${item.itemId}`}
              item={item}
              onRemove={() => toggle(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
