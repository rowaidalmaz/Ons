import Link from "next/link";
import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/service";
import { BookmarkRow } from "@/components/bookmarks/BookmarkRow";
import type { BookmarkRow as BookmarkRowType, SavedItem } from "@/lib/supabase/types";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function SharedCollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  if (!UUID_RE.test(collection)) notFound();

  const supabase = createServiceClient();
  const { data } = await supabase
    .from("bookmarks")
    .select("kind, item_id, title, subtitle, href, emoji, badge")
    .eq("collection_id", collection)
    .order("created_at", { ascending: false })
    .returns<Pick<BookmarkRowType, "kind" | "item_id" | "title" | "subtitle" | "href" | "emoji" | "badge">[]>();

  const items: SavedItem[] = (data ?? []).map((row) => ({
    kind: row.kind,
    itemId: row.item_id,
    title: row.title,
    subtitle: row.subtitle,
    href: row.href,
    emoji: row.emoji,
    badge: row.badge,
  }));

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-ink lg:text-[34px]">قائمة محفوظات</h1>
      <p className="mb-6 text-[14px] leading-7 text-ink-soft">
        قائمة شاركتها وحدة معك — قراءات ومشاهدات مختارة. تقدرين تبدئين قائمتك من{" "}
        <Link href="/saved" className="font-bold text-gold">
          المحفوظات
        </Link>
        .
      </p>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-6 text-center text-[13.5px] leading-7 text-ink-soft">
          هذي القائمة فاضية أو الرابط مو صحيح.
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {items.map((item) => (
            <BookmarkRow key={`${item.kind}:${item.itemId}`} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
