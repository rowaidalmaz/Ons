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
      <h2 className="mt-0.5 mb-1 text-xl font-extrabold text-ink">وثائقيات</h2>
      <p className="mb-4 text-[12.5px] leading-7 text-ink-soft">
        من يوتيوب لنتفليكس لغيرها — نجمعلها لك في مكان واحد، ونترجملها.
      </p>
      <SearchBox
        action="/documentaries"
        placeholder="مثال: نوم الرضيع، أساليب تربية حول العالم..."
        defaultValue={q}
      />
      <div className="mb-3.5 rounded-lg bg-gold-pale px-2.5 py-2 text-[11px] leading-7 text-[#A6875A]">
        نتائج توضيحية من مصادر ومنصات حقيقية — في النسخة الفعلية تُجلب من يوتيوب ونتفليكس وغيرها محظيًا حسب بحثك، ومن لا تسمح بها شروط أي منصة يُشار إليها فقط برابط خارجي.
      </div>
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
  );
}
