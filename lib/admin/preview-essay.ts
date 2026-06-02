import { mapEssayRowToEssayWithSeries } from "@/lib/content/map-essay-row";
import { getEssayRepository } from "@/lib/content/get-repository";
import type { Essay } from "@/lib/essays";
import { isSupabaseServiceRoleConfigured } from "@/lib/supabase/config";
import { requireSupabaseServiceRoleClient } from "@/lib/supabase/server";

/**
 * Essay for editor preview — prefers Supabase (CMS source of truth), falls back to active repository.
 */
export async function getAdminPreviewEssayBySlug(
  slug: string,
): Promise<Essay | null> {
  if (slug.includes("/") || slug.includes("..")) {
    return null;
  }

  if (isSupabaseServiceRoleConfigured()) {
    const supabase = requireSupabaseServiceRoleClient();

    const [{ data: row, error }, { data: seriesRows, error: seriesError }] =
      await Promise.all([
        supabase.from("essays").select("*").eq("slug", slug).maybeSingle(),
        supabase.from("series").select("*"),
      ]);

    if (error) {
      throw new Error(`Failed to load preview essay: ${error.message}`);
    }

    if (seriesError) {
      throw new Error(`Failed to load series: ${seriesError.message}`);
    }

    if (!row) {
      return null;
    }

    const seriesBySlug = new Map(
      (seriesRows ?? []).map((item) => [item.slug, item]),
    );

    return mapEssayRowToEssayWithSeries(row, seriesBySlug);
  }

  return getEssayRepository().getEssayBySlug(slug, { includeDrafts: true });
}

export async function getAdminEssayEditIdBySlug(slug: string) {
  if (!isSupabaseServiceRoleConfigured()) {
    return null;
  }

  const supabase = requireSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("essays")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to resolve essay id: ${error.message}`);
  }

  return data?.id ?? null;
}
