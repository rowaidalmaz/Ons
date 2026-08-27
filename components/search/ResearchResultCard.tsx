export function ResearchResultCard({
  sourceLanguage,
  titleAr,
  originalTitle,
  paraphraseAr,
  journal,
  externalUrl,
}: {
  sourceLanguage: string;
  titleAr: string;
  originalTitle: string;
  paraphraseAr: string;
  journal: string | null;
  externalUrl: string;
}) {
  return (
    <div className="mb-3 rounded-2xl border border-line bg-white p-4">
      <span className="mb-2 me-1.5 inline-block rounded-lg bg-dustyblue px-2 py-0.5 text-[10px] font-bold text-white">
        {sourceLanguage} → AR
      </span>
      <h3 className="mb-1.5 text-[14.5px] leading-6 text-ink">{titleAr}</h3>
      <p className="mb-2 text-[11px] italic text-[#A99680]">{originalTitle}</p>
      <p className="mb-2.5 text-[12.5px] leading-7 text-[#6B5847]">{paraphraseAr}</p>
      <div className="flex items-center justify-between text-[11px] text-[#A99680]">
        <span>{journal}</span>
        <a href={externalUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-gold no-underline">
          اقرأ الأصل ←
        </a>
      </div>
    </div>
  );
}
