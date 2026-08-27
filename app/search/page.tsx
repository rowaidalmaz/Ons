import { createClient } from "@/lib/supabase/server";
import { SearchBox } from "@/components/search/SearchBox";
import { ResearchResultCard } from "@/components/search/ResearchResultCard";
import type { ResearchCacheRow } from "@/lib/supabase/types";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();
  const { data: results } = await supabase
    .from("research_cache")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<ResearchCacheRow[]>();

  return (
    <div>
      <h2 className="mt-0.5 mb-1 text-xl font-extrabold text-ink">ابحث</h2>
      <p className="mb-4 text-[12.5px] leading-7 text-ink-soft">
        سؤال يدور في راسك من المجرّد التبويب، وخلي العالم يجاوبك بالعربي.
      </p>
      <div className="max-w-xl">
        <SearchBox
          action="/search"
          placeholder="مثال: نوم الأطفال، القلق عند المراهقين..."
          defaultValue={q}
        />
        <div className="mb-3.5 rounded-lg bg-gold-pale px-2.5 py-2 text-[11px] leading-7 text-[#A6875A]">
          هذه نتائج توضيحية لعرض فكرة المنتج — في النسخة الفعلية سيتم الجلب من قواعد أبحاث حقيقية وترجمتها ولحظيًا.
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {results?.map((r) => (
          <ResearchResultCard
            key={r.id}
            sourceLanguage={r.source_language}
            titleAr={r.title_ar}
            originalTitle={r.original_title}
            paraphraseAr={r.paraphrase_ar}
            journal={r.journal}
            externalUrl={r.external_url}
          />
        ))}
      </div>
    </div>
  );
}
