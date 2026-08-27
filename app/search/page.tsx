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
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-ink lg:text-[34px]">ابحث</h1>
      <p className="mb-6 max-w-xl text-[14px] leading-7 text-ink-soft">
        سؤال يدور في راسك من المجرّد التبويب، وخلي العالم يجاوبك بالعربي.
      </p>
      <div className="mb-8 max-w-xl">
        <SearchBox
          action="/search"
          placeholder="مثال: نوم الأطفال، القلق عند المراهقين..."
          defaultValue={q}
        />
        <div className="mt-3 rounded-xl bg-gold-pale px-3 py-2.5 text-[12px] leading-7 text-[#9a3412]">
          هذه نتائج توضيحية لعرض فكرة المنتج — في النسخة الفعلية سيتم الجلب من قواعد أبحاث حقيقية وترجمتها ولحظيًا.
        </div>
      </div>
      <div className="grid gap-x-6 gap-y-6 lg:grid-cols-2">
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
