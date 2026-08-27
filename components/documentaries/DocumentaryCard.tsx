import type { DocPlatform } from "@/lib/supabase/types";

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
  title,
  originalTitle,
  channelOrStudio,
  durationLabel,
  description,
  platform,
  languageBadge,
}: {
  title: string;
  originalTitle: string;
  channelOrStudio: string;
  durationLabel: string;
  description: string;
  platform: DocPlatform;
  languageBadge: string;
}) {
  return (
    <div className="mb-2.5 flex gap-3 rounded-2xl border border-line bg-white p-2.5">
      <div
        className="flex h-16 w-24 flex-none items-center justify-center rounded-[10px] text-xl"
        style={{ background: "linear-gradient(150deg, var(--sage), #5E6B44)" }}
      >
        🎞️
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap gap-1">
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
        <h4 className="mb-1 text-[13px] leading-6 text-ink">{title}</h4>
        <p className="mb-1 text-[11px] italic text-ink-soft">
          {originalTitle} — {channelOrStudio} · {durationLabel}
        </p>
        <p className="text-[11px] leading-6 text-[#9C8874]">{description}</p>
      </div>
    </div>
  );
}
