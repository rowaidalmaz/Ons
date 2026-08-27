import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { PostRow } from "@/lib/supabase/types";

export default async function ModerationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: pending, error } = await supabase
    .from("pending_moderation")
    .select("*")
    .order("created_at", { ascending: true })
    .returns<PostRow[]>();

  // A non-moderator authenticated user gets denied by RLS here (empty/error),
  // not a distinct error page — this surface shouldn't reveal who is or
  // isn't a moderator beyond "you can't see anything here."
  if (error) redirect("/admin/login");

  return (
    <div>
      <h2 className="mb-4 text-xl font-extrabold text-ink">قائمة المراجعة</h2>
      {pending?.length === 0 && (
        <p className="text-[13px] text-ink-soft">لا يوجد منشورات بانتظار المراجعة.</p>
      )}
      {pending?.map((p) => (
        <div key={p.id} className="mb-3 rounded-2xl border border-line bg-white p-3.5">
          <p className="mb-3 text-[12.5px] leading-7 text-charcoal">{p.body}</p>
          <div className="flex gap-2">
            <form action={`/api/moderation/${p.id}/approve`} method="post">
              <button className="rounded-full bg-sage px-4 py-1.5 text-[12px] font-bold text-white">
                قبول
              </button>
            </form>
            <form action={`/api/moderation/${p.id}/reject`} method="post">
              <button className="rounded-full bg-dustyblue px-4 py-1.5 text-[12px] font-bold text-white">
                رفض
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
