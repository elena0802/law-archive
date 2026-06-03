/**
 * One-time / repeatable MDX → Supabase import.
 *
 * Usage:
 *   npm run import:mdx
 *
 * Requires .env.local with Supabase service role keys.
 */
import ws from "ws";
import { readAllMdxEssays } from "../lib/content/parse-mdx-essay";

if (typeof globalThis.WebSocket === "undefined") {
  globalThis.WebSocket = ws as unknown as typeof WebSocket;
}
import { getSeriesSlug } from "../lib/content/series-slug";
import type { EssayInsert, EssayRow, EssayStatus } from "../lib/content/db-types";
import { requireSupabaseServiceRoleClient } from "../lib/supabase/server";

type ImportStats = {
  imported: number;
  updated: number;
  skipped: number;
};

type SeriesIndex = {
  byTitle: Map<string, string>;
  bySlug: Map<string, string>;
};

function essayDateToIso(date: string) {
  return date.slice(0, 10);
}

function resolvePublishedAtForImport(
  status: EssayStatus,
  essayDate: string,
  existing: EssayRow | null,
) {
  if (status !== "published") {
    return null;
  }

  if (existing?.published_at) {
    return existing.published_at;
  }

  return `${essayDateToIso(essayDate)}T00:00:00.000Z`;
}

function mdxToInsert(
  essay: Awaited<ReturnType<typeof readAllMdxEssays>>["essays"][number],
  seriesSlug: string,
  existing: EssayRow | null,
): EssayInsert & { published_at: string | null } {
  const status: EssayStatus = essay.draft ? "draft" : "published";

  return {
    title: essay.title,
    slug: essay.slug,
    description: essay.description,
    content: essay.content,
    essay_date: essayDateToIso(essay.date),
    category: essay.category,
    series_slug: seriesSlug,
    series_order: essay.seriesOrder ?? null,
    status,
    featured: essay.featured,
    published_at: resolvePublishedAtForImport(
      status,
      essay.date,
      existing,
    ),
  };
}

function rowsAreEqual(existing: EssayRow, next: EssayInsert & { published_at: string | null }) {
  return (
    existing.title === next.title &&
    existing.description === next.description &&
    existing.content === next.content &&
    existing.essay_date.slice(0, 10) === next.essay_date &&
    existing.category === next.category &&
    existing.series_slug === next.series_slug &&
    (existing.series_order ?? null) === (next.series_order ?? null) &&
    existing.status === next.status &&
    existing.featured === next.featured &&
    (existing.published_at ?? null) === (next.published_at ?? null)
  );
}

async function loadSeriesIndex(): Promise<SeriesIndex> {
  const supabase = requireSupabaseServiceRoleClient();
  const { data, error } = await supabase.from("series").select("slug, title");

  if (error) {
    throw new Error(`Failed to load series: ${error.message}`);
  }

  const byTitle = new Map<string, string>();
  const bySlug = new Map<string, string>();

  for (const row of data ?? []) {
    byTitle.set(row.title, row.slug);
    bySlug.set(row.slug, row.slug);
  }

  return { byTitle, bySlug };
}

function resolveSeriesSlug(seriesTitle: string, index: SeriesIndex) {
  const fromTitle = index.byTitle.get(seriesTitle);

  if (fromTitle) {
    return fromTitle;
  }

  const slug = getSeriesSlug(seriesTitle);

  return index.bySlug.get(slug) ?? null;
}

async function loadExistingEssaysBySlug(slugs: string[]) {
  const supabase = requireSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("essays")
    .select("*")
    .in("slug", slugs);

  if (error) {
    throw new Error(`Failed to load existing essays: ${error.message}`);
  }

  return new Map((data ?? []).map((row) => [row.slug, row]));
}

async function main() {
  console.log("MDX → Supabase import\n");

  const { essays, errors: parseErrors } = await readAllMdxEssays();

  if (parseErrors.length > 0) {
    console.log("Parse errors:");
    for (const item of parseErrors) {
      console.log(`  - ${item.filename}: ${item.message}`);
    }
    console.log("");
  }

  const seriesIndex = await loadSeriesIndex();
  const slugs = essays.map((essay) => essay.slug);
  const existingBySlug = await loadExistingEssaysBySlug(slugs);
  const supabase = requireSupabaseServiceRoleClient();

  const stats: ImportStats = {
    imported: 0,
    updated: 0,
    skipped: parseErrors.length,
  };

  const skippedReasons: string[] = parseErrors.map(
    (item) => `${item.filename}: ${item.message}`,
  );

  for (const essay of essays) {
    const seriesSlug = resolveSeriesSlug(essay.series, seriesIndex);

    if (!seriesSlug) {
      stats.skipped += 1;
      skippedReasons.push(
        `${essay.slug}: unknown series "${essay.series}" (no matching series row)`,
      );
      continue;
    }

    const existing = existingBySlug.get(essay.slug) ?? null;
    const row = mdxToInsert(essay, seriesSlug, existing);

    if (existing && rowsAreEqual(existing, row)) {
      stats.skipped += 1;
      skippedReasons.push(`${essay.slug}: unchanged`);
      continue;
    }

    const { error } = await supabase.from("essays").upsert(row, {
      onConflict: "slug",
    });

    if (error) {
      stats.skipped += 1;
      skippedReasons.push(`${essay.slug}: ${error.message}`);
      continue;
    }

    if (existing) {
      stats.updated += 1;
    } else {
      stats.imported += 1;
    }
  }

  console.log("Import complete\n");
  console.log(`  Imported: ${stats.imported}`);
  console.log(`  Updated:  ${stats.updated}`);
  console.log(`  Skipped:  ${stats.skipped}`);

  if (skippedReasons.length > 0) {
    console.log("\nSkipped details:");
    for (const reason of skippedReasons) {
      console.log(`  - ${reason}`);
    }
  }

  console.log(
    "\nNext: set CONTENT_SOURCE=supabase in .env.local and restart the app.",
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
