import { createBrowserClient } from "@supabase/ssr";
import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database";

/**
 * Browser Supabase client for admin auth (magic link session).
 * Returns null when env vars are missing (e.g. local MDX-only dev).
 */
export function createSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  return createBrowserClient<Database>(getSupabaseUrl(), getSupabaseAnonKey());
}
