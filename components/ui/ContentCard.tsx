import type { ContentFormat } from "@/lib/supabase/types";
import { BookmarkButton } from "@/components/bookmarks/BookmarkButton";

const THUMB_GRADIENT: Record<ContentFormat, string> = {
  article: "linear-gradient(135deg, var(--sage), #0a7d54)",
  video: "linear-gradient(135deg, var(--gold), #c2410c)",
  audio: "linear-gradient(135deg, var(--dustyblue), #2f4fc4)",
};

const FORMAT_LABEL: Record<ContentFormat, string> = {
  article: "مقال",
  video: "فيديو",
  audio: "بودكاست",
};

export function ContentCard({
  id,
  title,
  description,
  icon,
  format,
  durationLabel,
  authorName,
  channelName,
}: {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  format: ContentFormat;
  durationLabel: string;
  authorName: string;
  channelName: string;
}) {
  const initial = authorName.replace("د. ", "").charAt(0);
  const byline = [authorName, channelName && `في ${channelName}`].filter(Boolean).join(" · ");

  return (
    <article className="group flex h-full flex-col rounded-2xl p-2 transition-colors hover:bg-tint">
      <div
        className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-xl text-[34px]"
        style={{ background: THUMB_GRADIENT[format] }}
      >
        <span className="absolute end-3 top-3 rounded-md bg-black/30 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
          {durationLabel}
        </span>
        <BookmarkButton
          className="absolute start-3 top-3"
          item={{
            kind: "content",
            itemId: id,
            title,
            subtitle: byline || null,
            emoji: icon,
            badge: FORMAT_LABEL[format],
          }}
        />
        {icon}
      </div>
      <div className="flex flex-1 flex-col px-1.5 pb-1.5 pt-3">
        <span className="mb-1.5 text-[11px] font-bold text-gold">{FORMAT_LABEL[format]}</span>
        <h3 className="mb-1.5 line-clamp-2 text-[17px] font-bold leading-7 text-ink">{title}</h3>
        <p className="mb-3 line-clamp-2 text-[13.5px] leading-6 text-ink-soft">{description}</p>
        <div className="mt-auto flex items-center gap-2 pt-1">
          <div className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-paper-deep text-[12px] font-bold text-ink">
            {initial}
          </div>
          <div className="text-[12px] leading-5 text-ink-soft">
            <b className="font-bold text-ink">{authorName}</b> · في {channelName}
          </div>
        </div>
      </div>
    </article>
  );
}
