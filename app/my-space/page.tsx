import { createClient } from "@/lib/supabase/server";
import { isCommunityFeedPublic } from "@/lib/flags";
import { promptForToday } from "@/lib/my-space/prompts";
import { MoodExperience } from "@/components/my-space/MoodExperience";
import { SavedStrip } from "@/components/my-space/SavedStrip";
import { PostComposer } from "@/components/my-space/PostComposer";
import type { BookRow, MoodRow, PostRow } from "@/lib/supabase/types";

// The feed is a calm window, not a scroll: only the most recent few show.
const FEED_LIMIT = 3;
// A wider recent pool the composer draws one "other mother's note" from.
const NOTE_POOL = 12;

const AR_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
function toArabicDigits(n: number): string {
  return String(n).replace(/\d/g, (d) => AR_DIGITS[Number(d)]);
}

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
      .limit(NOTE_POOL)
      .returns<PostRow[]>();
    posts = data ?? [];
  }

  const dailyPrompt = promptForToday();
  const visiblePosts = posts.slice(0, FEED_LIMIT);
  // Draw the reciprocity note from posts she hasn't just seen, when there are any.
  const notePool = (posts.length > FEED_LIMIT ? posts.slice(FEED_LIMIT) : posts).map((p) => p.body);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-ink lg:text-[34px]">مساحتي</h1>
      <p className="mb-6 text-[14px] leading-7 text-ink-soft">
        هنا مساحتك. سجّلي مزاجك، خذي جوّ يهدّي وكتب تفهمك، وارجعي لها وقت ما تبين.
      </p>

      <MoodExperience moods={moods ?? []} booksByMood={booksByMood} />

      <SavedStrip />

      <div className="my-6 border-y border-line py-6 text-center text-lg font-bold leading-8 text-ink">
        &quot;تعبكِ ما يقيس حبّك. مو مطالَبة تعطين أكثر من طاقتك 🤍&quot;
      </div>

      {feedPublic ? (
        <section>
          <div className="mb-4 rounded-2xl border border-line bg-paper-deep p-4">
            <p className="mb-1 text-[10.5px] font-bold tracking-wide text-ink-soft">سؤال اليوم</p>
            <p className="text-[14px] font-bold leading-7 text-ink">{dailyPrompt}</p>
          </div>

          {visiblePosts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}

          {visiblePosts.length > 0 && (
            <p className="mb-4 text-center text-[11px] leading-6 text-ink-soft">
              نعرض آخر {toArabicDigits(FEED_LIMIT)} رسائل فقط — بدون تمرير بلا نهاية 🤍
            </p>
          )}

          <PostComposer notePool={notePool} />
        </section>
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
