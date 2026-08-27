import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/admin/login", req.url));

  await supabase
    .from("posts")
    .update({ status: "rejected", moderator_id: user.id })
    .eq("id", id);

  return NextResponse.redirect(new URL("/admin/moderation", req.url));
}
