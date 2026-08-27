import { createClient } from "@/lib/supabase/server";
import { ChipRow } from "@/components/ui/ChipRow";
import { ContentCard } from "@/components/ui/ContentCard";
import type { ContentFormat, Tag } from "@/lib/supabase/types";

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

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const supabase = await createClient();

  const { data: tags } = await supabase
    .from("tags")
    .select("id, slug, label_ar, category, sort_order")
    .order("sort_order");

  const query = tag
    ? supabase
        .from("content")
        .select(
          "id, title, description, format, duration_label, icon, contributors:contributor_id(name), channels:channel_id(name), content_tags!inner(tags!inner(slug))",
        )
        .eq("content_tags.tags.slug", tag)
    : supabase
        .from("content")
        .select(
          "id, title, description, format, duration_label, icon, contributors:contributor_id(name), channels:channel_id(name)",
        );

  const { data: content, error } = await query
    .order("published_at", { ascending: false })
    .returns<ContentRow[]>();

  return (
    <div>
      <h2 className="mt-0.5 mb-1 text-xl font-extrabold text-ink">تعلّمي</h2>
      <p className="mb-4 text-[12.5px] leading-7 text-ink-soft">
        مو بس عن طفلك — فيه محتوى عن اللي مثلك 💛
      </p>
      <ChipRow tags={(tags as Tag[]) ?? []} activeTag={tag} />
      {error && (
        <p className="text-[12.5px] text-ink-soft">تعذّر تحميل المحتوى الآن.</p>
      )}
      {content?.length === 0 && (
        <p className="text-[12.5px] text-ink-soft">ما فيه محتوى بالتصنيف بعد — قريبًا.</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
