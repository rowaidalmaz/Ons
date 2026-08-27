import { createHmac } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

const MAX_BODY_LENGTH = 1000;

function hashDeviceId(deviceId: string): string {
  return createHmac("sha256", process.env.POST_AUTHOR_PEPPER!).update(deviceId).digest("hex");
}

export async function POST(req: NextRequest) {
  const { body, deviceId } = await req.json();

  if (typeof body !== "string" || !body.trim() || body.length > MAX_BODY_LENGTH) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  if (typeof deviceId !== "string" || !deviceId) {
    return NextResponse.json({ error: "invalid device id" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const authorHash = hashDeviceId(deviceId);

  const { data: keywords } = await supabase.from("crisis_keywords").select("keyword");
  const normalizedBody = body.toLowerCase();
  const isCrisis = (keywords ?? []).some((k) => normalizedBody.includes(k.keyword.toLowerCase()));

  const { error: insertError } = await supabase.from("posts").insert({
    body,
    author_hash: authorHash,
    status: isCrisis ? "flagged_crisis" : "pending",
  });

  if (insertError) {
    const status = insertError.message.includes("rate limit") ? 429 : 500;
    return NextResponse.json({ error: insertError.message }, { status });
  }

  if (isCrisis) {
    const { data: resources } = await supabase
      .from("crisis_resources")
      .select("title, description, phone, url")
      .eq("locale", "ar");
    return NextResponse.json({ flagged: true, resources: resources ?? [] });
  }

  return NextResponse.json({ flagged: false });
}
