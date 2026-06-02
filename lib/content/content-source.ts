/**
 * Which backend supplies essay data to the public site.
 * @see design/PR11-CMS-ARCHITECTURE.md
 */

export type ContentSource = "mdx" | "supabase";

export function getContentSource(): ContentSource {
  const value = process.env.CONTENT_SOURCE?.trim().toLowerCase();

  if (value === "supabase") {
    return "supabase";
  }

  return "mdx";
}

export function isSupabaseContentSource() {
  return getContentSource() === "supabase";
}
