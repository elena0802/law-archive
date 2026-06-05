type SupabaseLikeError = {
  message?: string;
};

function looksLikeHtml(text: string): boolean {
  const trimmed = text.trimStart().toLowerCase();
  return trimmed.startsWith("<!doctype") || trimmed.startsWith("<html");
}

export function formatSupabaseLoadError(
  resource: string,
  error: SupabaseLikeError,
): Error {
  const message = error.message?.trim() ?? "Unknown error";

  if (looksLikeHtml(message)) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "(unset)";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "(unset)";

    return new Error(
      `Failed to load ${resource}: received HTML instead of JSON from Supabase. ` +
        `NEXT_PUBLIC_SUPABASE_URL is "${supabaseUrl}" — it must be your Supabase project URL ` +
        `(https://<project>.supabase.co), not the public site URL (${siteUrl}).`,
    );
  }

  return new Error(`Failed to load ${resource}: ${message}`);
}
