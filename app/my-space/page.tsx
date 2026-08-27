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
      <h2 className="mt-0.5 mb-1 text-xl font-extrabold text-ink">مساحتي</h2>
      <p className="mb-4 text-[12.5px] leading-7 text-ink-soft">
        ما فيه حكم هنا ولا &quot;أنا أفضل منك&quot;. بس أنتِ، وناس تفهم بالضبط.
      </p>

      <MoodExperience moods={moods ?? []} booksByMood={booksByMood} />

      <div className="mb-4 border-y border-line py-4 text-center text-base font-bold leading-8 text-ink">
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
        <div className="rounded-2xl border border-line bg-white p-4 text-center text-[12.5px] leading-7 text-ink-soft">
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
    <div className="mb-3 rounded-2xl border border-line bg-white p-3.5">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full bg-dustyblue text-[13px] font-bold text-white">
          أ
        </div>
        <div>
          <div className="text-[12.5px] font-bold text-ink">أم مجهولة</div>
          <div className="text-[10.5px] text-[#B6A48F]">{time}</div>
        </div>
      </div>
      <p className="mb-2 text-[12.5px] leading-7 text-[#5A473C]">{post.body}</p>
    </div>
  );
}
