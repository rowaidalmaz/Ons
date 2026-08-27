import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/admin/login", req.url));

  // RLS ("moderators update posts") is what actually enforces this — a
  // non-moderator's update simply matches zero rows.
  await supabase
    .from("posts")
    .update({ status: "approved", approved_at: new Date().toISOString(), moderator_id: user.id })
    .eq("id", id);

  return NextResponse.redirect(new URL("/admin/moderation", req.url));
}
