/**
 * Seeds a fresh Supabase database with content matching reference/manara.html
 * exactly. Run after migrations: `npm run db:seed` (see package.json).
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import {
  LEARN,
  LEARN_TAG_SLUG,
  RESULTS,
  DOC_RESULTS,
  MOODS,
  POSTS,
} from "./prototype-data";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

// The prototype's type→icon pairing (📱 for type c, 🎥 for type b) mixes
// article/video/audio loosely; duration labels ending in "فيديو"/"بودكاست"
// are the actual signal for format, so derive it from `meta` instead.
function formatFromMeta(meta: string): "article" | "audio" | "video" {
  if (meta.includes("فيديو")) return "video";
  if (meta.includes("بودكاست")) return "audio";
  return "article";
}

async function seedLearn() {
  const contributorCache = new Map<string, string>();
  const channelCache = new Map<string, string>();

  async function getContributorId(name: string) {
    if (contributorCache.has(name)) return contributorCache.get(name)!;
    const { data: existing } = await supabase
      .from("contributors")
      .select("id")
      .eq("name", name)
      .maybeSingle();
    if (existing) {
      contributorCache.set(name, existing.id);
      return existing.id;
    }
    const { data, error } = await supabase
      .from("contributors")
      .insert({ name })
      .select("id")
      .single();
    if (error) throw error;
    contributorCache.set(name, data.id);
    return data.id;
  }

  async function getChannelId(name: string) {
    if (channelCache.has(name)) return channelCache.get(name)!;
    const { data: existing } = await supabase
      .from("channels")
      .select("id")
      .eq("name", name)
      .maybeSingle();
    if (existing) {
      channelCache.set(name, existing.id);
      return existing.id;
    }
    const { data, error } = await supabase
      .from("channels")
      .insert({ name })
      .select("id")
      .single();
    if (error) throw error;
    channelCache.set(name, data.id);
    return data.id;
  }

  const { data: tags, error: tagsError } = await supabase.from("tags").select("id, slug");
  if (tagsError) throw tagsError;
  const tagIdBySlug = new Map(tags.map((t) => [t.slug, t.id] as const));

  for (const item of LEARN) {
    const contributor_id = await getContributorId(item.author);
    const channel_id = await getChannelId(item.channel);

    const { data: content, error } = await supabase
      .from("content")
      .insert({
        title: item.title,
        description: item.desc,
        format: formatFromMeta(item.meta),
        duration_label: item.meta,
        icon: item.icon,
        contributor_id,
        channel_id,
      })
      .select("id")
      .single();
    if (error) throw error;

    const slug = LEARN_TAG_SLUG[item.tag];
    const tagId = tagIdBySlug.get(slug);
    if (tagId) {
      const { error: tagLinkError } = await supabase
        .from("content_tags")
        .insert({ content_id: content.id, tag_id: tagId });
      if (tagLinkError) throw tagLinkError;
    }
  }
  console.log(`Seeded ${LEARN.length} تعلّمي content rows.`);
}

async function seedResearch() {
  const rows = RESULTS.map((r) => ({
    query_normalized: r.title.toLowerCase(),
    query_display: r.title,
    source: "seed" as const,
    source_language: r.lang,
    original_title: r.orig,
    title_ar: r.title,
    paraphrase_ar: r.summary,
    external_url: "https://example.org/seed-source",
    journal: r.src,
  }));
  const { error } = await supabase.from("research_cache").insert(rows);
  if (error) throw error;
  console.log(`Seeded ${rows.length} ابحث research_cache rows.`);
}

async function seedDocumentaries() {
  const rows = DOC_RESULTS.map((d) => ({
    title: d.title,
    original_title: d.orig,
    description: d.summary,
    platform: d.platform,
    channel_or_studio: d.channel,
    source_language: d.lang,
    language_badge: `${d.lang} → AR`,
    duration_label: d.dur,
    source_type: "seed" as const,
  }));
  const { error } = await supabase.from("documentaries").insert(rows);
  if (error) throw error;
  console.log(`Seeded ${rows.length} وثائقيات rows.`);
}

async function seedBooks() {
  for (const [slug, mood] of Object.entries(MOODS)) {
    const rows = mood.books.map((b) => ({
      mood_slug: slug,
      language: b.lang.toLowerCase() as "ar" | "en",
      title: b.title,
      author: b.author,
      blurb: b.blurb,
    }));
    const { error } = await supabase.from("books").insert(rows);
    if (error) throw error;
  }
  console.log(`Seeded books for ${Object.keys(MOODS).length} moods.`);
}

async function seedPosts() {
  // Seed posts use an obviously-synthetic author_hash — real posts get
  // theirs from the HMAC computed in app/api/posts/route.ts.
  const rows = POSTS.map((p, i) => ({
    body: p.text,
    status: p.status,
    author_hash: `seed-${i}`,
    approved_at: p.status === "approved" ? new Date().toISOString() : null,
  }));
  const { error } = await supabase.from("posts").insert(rows);
  if (error) throw error;
  console.log(`Seeded ${rows.length} مساحتي posts (1 approved, 1 pending).`);
}

async function main() {
  await seedLearn();
  await seedResearch();
  await seedDocumentaries();
  await seedBooks();
  await seedPosts();
  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
