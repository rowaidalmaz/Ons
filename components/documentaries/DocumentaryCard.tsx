import type { DocPlatform } from "@/lib/supabase/types";
import { BookmarkButton } from "@/components/bookmarks/BookmarkButton";

const PLATFORM_LABEL: Record<DocPlatform, string> = {
  youtube: "YouTube",
  netflix: "Netflix",
  bbc: "BBC",
  independent: "مستقل",
};

const PLATFORM_BG: Record<DocPlatform, string> = {
  youtube: "#FF4D4D",
  netflix: "#B23B3B",
  bbc: "#4C5B7A",
  independent: "var(--sage)",
};

export function DocumentaryCard({
  id,
  title,
  originalTitle,
  channelOrStudio,
  durationLabel,
  description,
  platform,
  languageBadge,
  externalUrl,
}: {
  id: string;
  title: string;
  originalTitle: string;
  channelOrStudio: string;
  durationLabel: string;
  description: string;
  platform: DocPlatform;
  languageBadge: string;
  externalUrl: string | null;
}) {
  return (
    <div className="flex gap-3.5 rounded-2xl p-2 transition-colors hover:bg-tint">
      <div
        className="flex h-20 w-28 flex-none items-center justify-center rounded-xl text-2xl"
        style={{ background: "linear-gradient(150deg, var(--sage), #0a7d54)" }}
      >
        🎞️
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <div className="mb-1.5 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            <span
              className="inline-block rounded-lg px-2 py-0.5 text-[10px] font-bold text-white"
              style={{ background: PLATFORM_BG[platform] }}
            >
              {PLATFORM_LABEL[platform]}
            </span>
            <span className="inline-block rounded-lg bg-ink-soft px-2 py-0.5 text-[10px] font-bold text-white">
              {languageBadge}
            </span>
          </div>
          <BookmarkButton
            tone="plain"
            item={{
              kind: "documentary",
              itemId: id,
              title,
              subtitle: `${channelOrStudio} · ${durationLabel}`,
              href: externalUrl,
              emoji: "🎬",
              badge: "وثائقي",
            }}
          />
        </div>
        <h4 className="mb-1 line-clamp-2 text-[15px] font-bold leading-6 text-ink">{title}</h4>
        <p className="mb-1 text-[11.5px] italic text-ink-soft">
          {originalTitle} — {channelOrStudio} · {durationLabel}
        </p>
        <p className="line-clamp-2 text-[12px] leading-6 text-ink-soft">{description}</p>
      </div>
    </div>
  );
}
