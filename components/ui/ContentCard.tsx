import type { ContentFormat } from "@/lib/supabase/types";

const THUMB_GRADIENT: Record<ContentFormat, string> = {
  article: "linear-gradient(135deg, var(--sage), #5E6B44)",
  video: "linear-gradient(135deg, var(--gold), #8B4A36)",
  audio: "linear-gradient(135deg, var(--dustyblue), #7A3F38)",
};

export function ContentCard({
  title,
  description,
  icon,
  format,
  durationLabel,
  authorName,
  channelName,
}: {
  title: string;
  description: string;
  icon: string | null;
  format: ContentFormat;
  durationLabel: string;
  authorName: string;
  channelName: string;
}) {
  const initial = authorName.replace("د. ", "").charAt(0);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white">
      <div
        className="relative flex h-[110px] items-center justify-center text-[30px] after:absolute after:inset-0 after:[background:linear-gradient(180deg,transparent_40%,rgba(0,0,0,0.18))]"
        style={{ background: THUMB_GRADIENT[format] }}
      >
        <span className="absolute start-2.5 top-2.5 rounded-full bg-black/28 px-2.5 py-0.5 text-[10.5px] font-bold text-white">
          {durationLabel}
        </span>
        {icon}
      </div>
      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-3">
        <h3 className="mb-2 text-[15px] leading-6 text-ink">{title}</h3>
        <p className="mb-2.5 text-[12.5px] leading-6 text-[#6B5847]">{description}</p>
        <div className="mt-auto flex items-center gap-2 border-t border-line pt-2.5">
          <div className="flex h-6.5 w-6.5 flex-none items-center justify-center rounded-full bg-paper-deep text-[11px] font-bold text-ink">
            {initial}
          </div>
          <div className="text-[11px] leading-5 text-[#9C8874]">
            <b className="font-bold text-ink-soft">{authorName}</b> · في {channelName}
          </div>
        </div>
      </div>
    </article>
  );
}
