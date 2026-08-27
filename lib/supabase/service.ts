import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client — bypasses RLS. Only ever import this from server-only
 * code (route handlers, scripts): it needs to read crisis_keywords/resources
 * and write posts regardless of status, none of which the public anon key
 * can do. The `server-only` import throws a build error if a client
 * component ever tries to bundle this file.
 */
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
