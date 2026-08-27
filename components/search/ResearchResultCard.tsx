import { BookmarkButton } from "@/components/bookmarks/BookmarkButton";

export function ResearchResultCard({
  id,
  sourceLanguage,
  titleAr,
  originalTitle,
  paraphraseAr,
  journal,
  externalUrl,
}: {
  id: string;
  sourceLanguage: string;
  titleAr: string;
  originalTitle: string;
  paraphraseAr: string;
  journal: string | null;
  externalUrl: string;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 transition-colors hover:border-ink/25">
      <div className="mb-2.5 flex items-start justify-between gap-2">
        <span className="rounded-lg bg-dustyblue px-2 py-0.5 text-[10px] font-bold text-white">
          {sourceLanguage} → AR
        </span>
        <BookmarkButton
          tone="plain"
          item={{
            kind: "research",
            itemId: id,
            title: titleAr,
            subtitle: journal,
            href: externalUrl,
            badge: "بحث",
          }}
        />
      </div>
      <h3 className="mb-1.5 text-[16px] font-bold leading-7 text-ink">{titleAr}</h3>
      <p className="mb-2.5 text-[12px] italic text-ink-soft">{originalTitle}</p>
      <p className="mb-4 text-[13.5px] leading-7 text-ink-soft">{paraphraseAr}</p>
      <div className="mt-auto flex items-center justify-between gap-3 text-[12px] text-ink-soft">
        <span className="truncate">{journal}</span>
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-none font-bold text-gold no-underline hover:underline"
        >
          اقرأ الأصل ←
        </a>
      </div>
    </div>
  );
}
