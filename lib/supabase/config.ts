/**
 * Supabase environment helpers.
 * Build and dev work without credentials when CONTENT_SOURCE=mdx (default).
 */

export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
}

function normalizeOrigin(url: string) {
  return url.trim().replace(/\/$/, "");
}

/**
 * Guards against using the public site URL as the Supabase API base URL.
 * A common misconfiguration after domain migration.
 */
export function assertSupabaseUrlForDataAccess(url: string) {
  if (!url) {
    return;
  }

  const normalizedSupabaseUrl = normalizeOrigin(url);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (siteUrl && normalizedSupabaseUrl === normalizeOrigin(siteUrl)) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must not equal NEXT_PUBLIC_SITE_URL. " +
        "Use your Supabase project URL (https://<project>.supabase.co) for data access, " +
        `not the public site URL (${siteUrl}).`,
    );
  }

  const isSupabaseHost =
    normalizedSupabaseUrl.includes(".supabase.co") ||
    normalizedSupabaseUrl.includes("localhost") ||
    normalizedSupabaseUrl.includes("127.0.0.1");

  if (!isSupabaseHost) {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_URL "${url}" does not look like a Supabase project URL. ` +
        "Expected https://<project>.supabase.co",
    );
  }
}

export function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
}

export function getSupabaseServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

export function isSupabaseServiceRoleConfigured() {
  return Boolean(getSupabaseUrl() && getSupabaseServiceRoleKey());
}

export function getAllowedEditorEmail() {
  return process.env.ALLOWED_EDITOR_EMAIL?.trim().toLowerCase() ?? "";
}
