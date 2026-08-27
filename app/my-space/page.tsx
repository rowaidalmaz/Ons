import { createClient } from "@/lib/supabase/server";
import { isCommunityFeedPublic } from "@/lib/flags";
import { MoodExperience } from "@/components/my-space/MoodExperience";
import { PostComposer } from "@/components/my-space/PostComposer";
import type { BookRow, MoodRow, PostRow } from "@/lib/supabase/types";

export default async function MySpacePage() {
  const supabase = await createClient();
  const [{ data: moods }, { data: books }, feedPublic] = await Promise.all([
    supabase.from("moods").select("*").order("sort_order").returns<MoodRow[]>(),
    supabase.from("books").select("*").returns<BookRow[]>(),
    isCommunityFeedPublic(),
  ]);

  const booksByMood: Record<string, BookRow[]> = {};
  (books ?? []).forEach((b) => {
    (booksByMood[b.mood_slug] ??= []).push(b);
  });

  let posts: PostRow[] = [];
  if (feedPublic) {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .returns<PostRow[]>();
    posts = data ?? [];
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-ink lg:text-[34px]">مساحتي</h1>
      <p className="mb-6 text-[14px] leading-7 text-ink-soft">
        ما فيه حكم هنا ولا &quot;أنا أفضل منك&quot;. بس أنتِ، وناس تفهم بالضبط.
      </p>

      <MoodExperience moods={moods ?? []} booksByMood={booksByMood} />

      <div className="my-6 border-y border-line py-6 text-center text-lg font-bold leading-8 text-ink">
        &quot;تعبكِ ما يقيس من حبّكِ. من دونٍ إنكِ تعطين أكثر من طاقتك أصلًا 🤍&quot;
      </div>

      {feedPublic ? (
        <>
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
          <PostComposer />
        </>
      ) : (
        <div className="rounded-2xl border border-line bg-white p-5 text-center text-[13.5px] leading-7 text-ink-soft">
          مساحة المجتمع قريبًا — نجهز فريق يراجع المنشورات بعناية قبل ما نفتحها للكل 🤍
        </div>
      )}
    </div>
  );
}

function PostCard({ post }: { post: PostRow }) {
  const time = new Date(post.created_at).toLocaleDateString("ar-SA", {
    day: "numeric",
    month: "long",
  });
  return (
    <div className="mb-3 rounded-2xl border border-line bg-white p-4">
      <div className="mb-2.5 flex items-center gap-2.5">
        <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-dustyblue text-[13px] font-bold text-white">
          أ
        </div>
        <div>
          <div className="text-[13px] font-bold text-ink">أم مجهولة</div>
          <div className="text-[11px] text-ink-soft">{time}</div>
        </div>
      </div>
      <p className="text-[13.5px] leading-7 text-ink-soft">{post.body}</p>
    </div>
  );
}
