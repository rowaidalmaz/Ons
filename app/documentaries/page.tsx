import { createClient } from "@/lib/supabase/server";
import { SearchBox } from "@/components/search/SearchBox";
import { DocumentaryCard } from "@/components/documentaries/DocumentaryCard";
import type { DocumentaryRow } from "@/lib/supabase/types";

export default async function DocumentariesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();
  const { data: docs } = await supabase
    .from("documentaries")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<DocumentaryRow[]>();

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-ink lg:text-[34px]">وثائقيات</h1>
      <p className="mb-6 max-w-xl text-[14px] leading-7 text-ink-soft">
        من يوتيوب لنتفليكس لغيرها — نجمعلها لك في مكان واحد، ونترجملها.
      </p>
      <div className="mb-8 max-w-xl">
        <SearchBox
          action="/documentaries"
          placeholder="مثال: نوم الرضيع، أساليب تربية حول العالم..."
          defaultValue={q}
        />
        <div className="mt-3 rounded-xl bg-gold-pale px-3 py-2.5 text-[12px] leading-7 text-[#9a3412]">
          نتائج توضيحية من مصادر ومنصات حقيقية — في النسخة الفعلية تُجلب من يوتيوب ونتفليكس وغيرها محظيًا حسب بحثك، ومن لا تسمح بها شروط أي منصة يُشار إليها فقط برابط خارجي.
        </div>
      </div>
      <div className="grid gap-x-6 gap-y-4 lg:grid-cols-2">
        {docs?.map((d) => (
          <DocumentaryCard
            key={d.id}
            title={d.title}
            originalTitle={d.original_title}
            channelOrStudio={d.channel_or_studio}
            durationLabel={d.duration_label}
            description={d.description}
            platform={d.platform}
            languageBadge={d.language_badge}
          />
        ))}
      </div>
    </div>
  );
}
