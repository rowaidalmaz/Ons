import { createClient } from "@/lib/supabase/server";
import { ChipRow } from "@/components/ui/ChipRow";
import { SectionTabs } from "@/components/ui/SectionTabs";
import { ContentCard } from "@/components/ui/ContentCard";
import type { ContentFormat, Section, Tag, TagCategory } from "@/lib/supabase/types";

type ContentRow = {
  id: string;
  title: string;
  description: string;
  format: ContentFormat;
  duration_label: string;
  icon: string | null;
  contributors: { name: string } | null;
  channels: { name: string } | null;
};

const SECTION_CATEGORY: Record<Section, TagCategory> = {
  about: "about_her",
  parenting: "age_stage",
};

const SECTION_SUBTITLE: Record<Section, string> = {
  about: "مو بس عن طفلك — هذا القسم عنكِ أنتِ: هويتك، علاقتك، شغلك، وجسمك 💛",
  parenting: "محتوى عن طفلك حسب مرحلته العمرية، من الولادة إلى المراهقة.",
};

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string; tag?: string }>;
}) {
  const params = await searchParams;
  const section: Section = params.section === "parenting" ? "parenting" : "about";
  const category = SECTION_CATEGORY[section];

  const supabase = await createClient();

  const { data: allTags } = await supabase
    .from("tags")
    .select("id, slug, label_ar, category, sort_order")
    .order("sort_order");

  const sectionTags = ((allTags as Tag[]) ?? []).filter((t) => t.category === category);

  // Only honour ?tag= when it belongs to the active section — a stale tag left
  // in the URL from the other section would otherwise show an empty list under
  // a highlighted "الكل" chip.
  const tag = sectionTags.some((t) => t.slug === params.tag) ? params.tag : undefined;

  let query = supabase
    .from("content")
    .select(
      "id, title, description, format, duration_label, icon, contributors:contributor_id(name), channels:channel_id(name), content_tags!inner(tags!inner(slug,category))",
    )
    .eq("content_tags.tags.category", category);

  if (tag) {
    query = query.eq("content_tags.tags.slug", tag);
  }

  const { data: content, error } = await query
    .order("published_at", { ascending: false })
    .returns<ContentRow[]>();

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-ink lg:text-[34px]">تعلم</h1>
      <p className="mb-6 max-w-xl text-[14px] leading-7 text-ink-soft">
        {SECTION_SUBTITLE[section]}
      </p>

      <SectionTabs active={section} />
      <ChipRow tags={sectionTags} activeTag={tag} section={section} accent={section === "about"} />

      {error && <p className="text-[14px] text-ink-soft">تعذّر تحميل المحتوى الآن.</p>}
      {content?.length === 0 && (
        <p className="text-[14px] text-ink-soft">ما فيه محتوى بالتصنيف بعد — قريبًا.</p>
      )}
      <div className="grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {content?.map((item) => (
          <ContentCard
            key={item.id}
            title={item.title}
            description={item.description}
            icon={item.icon}
            format={item.format}
            durationLabel={item.duration_label}
            authorName={item.contributors?.name ?? ""}
            channelName={item.channels?.name ?? ""}
          />
        ))}
      </div>
    </div>
  );
}
