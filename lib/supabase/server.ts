import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
  isSupabaseServiceRoleConfigured,
} from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database";

export type { Database } from "@/lib/supabase/database";

let serviceRoleClient: SupabaseClient<Database> | null = null;

/**
 * Server-only client with service role (bypasses RLS).
 * Use in Server Components, Server Actions, and import scripts — never in the browser.
 */
export function createSupabaseServiceRoleClient(): SupabaseClient<Database> | null {
  if (!isSupabaseServiceRoleConfigured()) {
    return null;
  }

  if (!serviceRoleClient) {
    serviceRoleClient = createClient<Database>(
      getSupabaseUrl(),
      getSupabaseServiceRoleKey(),
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }

  return serviceRoleClient;
}

export function requireSupabaseServiceRoleClient(): SupabaseClient<Database> {
  const client = createSupabaseServiceRoleClient();

  if (!client) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return client;
}
