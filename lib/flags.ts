import { createClient } from "@/lib/supabase/server";

export async function isCommunityFeedPublic(): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("feature_flags")
    .select("enabled")
    .eq("key", "community_feed_public")
    .single();

  return data?.enabled ?? false;
}
