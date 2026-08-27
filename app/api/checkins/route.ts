import { createHmac } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

// How many recent days the trail renders. The client asks for the same window.
const TRAIL_DAYS = 14;
const SLUG_RE = /^[a-z][a-z0-9_-]{0,31}$/;

function ownerHash(deviceId: string): string {
  return createHmac("sha256", process.env.POST_AUTHOR_PEPPER!).update(deviceId).digest("hex");
}

async function trailFor(oh: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("mood_checkins")
    .select("checked_on, mood_slug")
    .eq("owner_hash", oh)
    .order("checked_on", { ascending: false })
    .limit(TRAIL_DAYS);
  if (error) throw error;
  return data ?? [];
}

export async function GET(req: NextRequest) {
  const deviceId = req.nextUrl.searchParams.get("deviceId");
  if (!deviceId) {
    return NextResponse.json({ error: "invalid device id" }, { status: 400 });
  }
  try {
    return NextResponse.json({ checkins: await trailFor(ownerHash(deviceId)) });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const raw = await req.json().catch(() => null);
  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const { deviceId, moodSlug } = raw as Record<string, unknown>;
  if (typeof deviceId !== "string" || !deviceId) {
    return NextResponse.json({ error: "invalid device id" }, { status: 400 });
  }
  if (typeof moodSlug !== "string" || !SLUG_RE.test(moodSlug)) {
    return NextResponse.json({ error: "invalid mood" }, { status: 400 });
  }

  const oh = ownerHash(deviceId);
  const supabase = createServiceClient();

  // `checked_on` comes from the column default (Riyadh's current day), so the
  // conflict target is (owner_hash, checked_on): the first pick of the day
  // inserts, later picks update the mood in place.
  const { error } = await supabase.from("mood_checkins").upsert(
    { owner_hash: oh, mood_slug: moodSlug, updated_at: new Date().toISOString() },
    { onConflict: "owner_hash,checked_on" },
  );

  if (error) {
    const status = error.message.includes("rate limit") ? 429 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }

  try {
    return NextResponse.json({ checkins: await trailFor(oh) });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
