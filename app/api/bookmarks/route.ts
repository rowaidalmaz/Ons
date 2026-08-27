import { createHash, createHmac } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import type { BookmarkKind } from "@/lib/supabase/types";

const KINDS: BookmarkKind[] = ["content", "research", "documentary"];
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function ownerHash(deviceId: string): string {
  return createHmac("sha256", process.env.POST_AUTHOR_PEPPER!).update(deviceId).digest("hex");
}

/**
 * Deterministic collection uuid for a device — stable across sessions, but
 * unguessable without the pepper, so it doubles as the share token.
 */
function collectionId(ownerHashHex: string): string {
  const h = createHash("sha256")
    .update(`${process.env.POST_AUTHOR_PEPPER!}:collection:${ownerHashHex}`)
    .digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
}

function clip(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

type Mutation = { deviceId: string; kind: BookmarkKind; itemId: string };

function parseMutation(body: unknown): Mutation | { error: string } {
  if (!body || typeof body !== "object") return { error: "invalid json" };
  const b = body as Record<string, unknown>;
  if (typeof b.deviceId !== "string" || !b.deviceId) return { error: "invalid device id" };
  if (!KINDS.includes(b.kind as BookmarkKind)) return { error: "invalid kind" };
  if (typeof b.itemId !== "string" || !UUID_RE.test(b.itemId)) return { error: "invalid item id" };
  return { deviceId: b.deviceId, kind: b.kind as BookmarkKind, itemId: b.itemId };
}

export async function POST(req: NextRequest) {
  const raw = await req.json().catch(() => null);
  const parsed = parseMutation(raw);
  if ("error" in parsed) return NextResponse.json(parsed, { status: 400 });

  const title = clip((raw as Record<string, unknown>).title, 300);
  if (!title) return NextResponse.json({ error: "invalid title" }, { status: 400 });
  const b = raw as Record<string, unknown>;

  const oh = ownerHash(parsed.deviceId);
  const cid = collectionId(oh);
  const supabase = createServiceClient();

  const { error } = await supabase.from("bookmarks").upsert(
    {
      collection_id: cid,
      owner_hash: oh,
      kind: parsed.kind,
      item_id: parsed.itemId,
      title,
      subtitle: clip(b.subtitle, 300),
      href: clip(b.href, 2000),
      emoji: clip(b.emoji, 16),
      badge: clip(b.badge, 40),
    },
    { onConflict: "owner_hash,kind,item_id" },
  );

  if (error) {
    const status = error.message.includes("rate limit") ? 429 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
  return NextResponse.json({ collectionId: cid });
}

export async function DELETE(req: NextRequest) {
  const raw = await req.json().catch(() => null);
  const parsed = parseMutation(raw);
  if ("error" in parsed) return NextResponse.json(parsed, { status: 400 });

  const oh = ownerHash(parsed.deviceId);
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .match({ owner_hash: oh, kind: parsed.kind, item_id: parsed.itemId });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, collectionId: collectionId(oh) });
}

export async function GET(req: NextRequest) {
  const collection = req.nextUrl.searchParams.get("collection");
  if (!collection || !UUID_RE.test(collection)) {
    return NextResponse.json({ error: "invalid collection" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .select("id, kind, item_id, title, subtitle, href, emoji, badge, created_at")
    .eq("collection_id", collection)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}
