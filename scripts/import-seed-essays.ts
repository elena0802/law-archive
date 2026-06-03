/**
 * Bulk import seed essays from content/seed-essays/*.md into Supabase.
 *
 * Usage:
 *   npm run import:seed-essays
 *
 * Requires .env.local with Supabase service role keys.
 */
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import ws from "ws";
import type { EssayInsert, EssayStatus } from "../lib/content/db-types";
import { requireSupabaseServiceRoleClient } from "../lib/supabase/server";

if (typeof globalThis.WebSocket === "undefined") {
  globalThis.WebSocket = ws as unknown as typeof WebSocket;
}

const seedDirectory = path.join(process.cwd(), "content", "seed-essays");

type SeedEssay = {
  filename: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  series_slug: string;
  essay_date: string;
  status: EssayStatus;
  featured: boolean;
  content: string;
};

type ImportStats = {
  found: number;
  imported: number;
  skippedExisting: number;
  failed: number;
};

function assertNonEmptyString(value: unknown, field: string, filename: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing or invalid "${field}" in ${filename}.`);
  }

  return value.trim();
}

function parseEssayDate(value: string, filename: string) {
  const normalized = value.trim().slice(0, 10);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    throw new Error(`Invalid essay_date "${value}" in ${filename}. Use YYYY-MM-DD.`);
  }

  return normalized;
}

function parseSeedStatus(
  rawStatus: unknown,
  filename: string,
): { status: EssayStatus; publishedOverrideWarning: boolean } {
  const status =
    rawStatus === undefined || rawStatus === null || rawStatus === ""
      ? "draft"
      : typeof rawStatus === "string"
        ? rawStatus.trim()
        : null;

  if (status === null) {
    throw new Error(`Invalid status in ${filename}.`);
  }

  if (status === "published") {
    return { status: "draft", publishedOverrideWarning: true };
  }

  if (status === "draft" || status === "archived") {
    return { status, publishedOverrideWarning: false };
  }

  throw new Error(
    `Invalid status "${status}" in ${filename}. Allowed: draft, archived.`,
  );
}

function parseFeatured(rawFeatured: unknown, filename: string) {
  if (rawFeatured === undefined || rawFeatured === null || rawFeatured === "") {
    return false;
  }

  if (typeof rawFeatured !== "boolean") {
    throw new Error(`Invalid featured value in ${filename}. Use true or false.`);
  }

  return rawFeatured;
}

function parseSeedFile(filename: string, source: string): SeedEssay {
  const { content, data } = matter(source);
  const body = content.trim();

  if (!body) {
    throw new Error(`Missing content body in ${filename}.`);
  }

  const slug = assertNonEmptyString(data.slug, "slug", filename);
  const { status, publishedOverrideWarning } = parseSeedStatus(
    data.status,
    filename,
  );

  if (publishedOverrideWarning) {
    console.warn(
      `Published status is not allowed for seed import. Imported as draft. (${filename})`,
    );
  }

  return {
    filename,
    title: assertNonEmptyString(data.title, "title", filename),
    slug,
    description: assertNonEmptyString(data.description, "description", filename),
    category: assertNonEmptyString(data.category, "category", filename),
    series_slug: assertNonEmptyString(data.series_slug, "series_slug", filename),
    essay_date: parseEssayDate(
      assertNonEmptyString(data.essay_date, "essay_date", filename),
      filename,
    ),
    status,
    featured: parseFeatured(data.featured, filename),
    content: body,
  };
}

async function listSeedFilenames() {
  try {
    const filenames = await fs.readdir(seedDirectory);
    return filenames.filter(
      (filename) => filename.endsWith(".md") && !filename.startsWith("_"),
    );
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      return [];
    }

    throw error;
  }
}

async function loadExistingSlugs(slugs: string[]) {
  if (slugs.length === 0) {
    return new Set<string>();
  }

  const supabase = requireSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("essays")
    .select("slug")
    .in("slug", slugs);

  if (error) {
    throw new Error(`Failed to load existing essays: ${error.message}`);
  }

  return new Set((data ?? []).map((row) => row.slug));
}

async function loadSeriesSlugs() {
  const supabase = requireSupabaseServiceRoleClient();
  const { data, error } = await supabase.from("series").select("slug");

  if (error) {
    throw new Error(`Failed to load series: ${error.message}`);
  }

  return new Set((data ?? []).map((row) => row.slug));
}

function toInsert(seed: SeedEssay): EssayInsert {
  return {
    title: seed.title,
    slug: seed.slug,
    description: seed.description,
    content: seed.content,
    essay_date: seed.essay_date,
    category: seed.category,
    series_slug: seed.series_slug,
    status: seed.status,
    featured: seed.featured,
    published_at: null,
  };
}

async function main() {
  console.log("Seed essays → Supabase import\n");

  const filenames = await listSeedFilenames();
  const stats: ImportStats = {
    found: filenames.length,
    imported: 0,
    skippedExisting: 0,
    failed: 0,
  };

  const parsed: SeedEssay[] = [];
  const parseFailures: string[] = [];

  for (const filename of filenames) {
    try {
      const source = await fs.readFile(path.join(seedDirectory, filename), "utf8");
      parsed.push(parseSeedFile(filename, source));
    } catch (error) {
      stats.failed += 1;
      parseFailures.push(
        error instanceof Error ? `${filename}: ${error.message}` : `${filename}: failed`,
      );
    }
  }

  if (parsed.length === 0) {
    console.log(`Found ${stats.found} seed essays.`);
    console.log(`Imported: ${stats.imported}`);
    console.log(`Skipped existing: ${stats.skippedExisting}`);
    console.log(`Failed: ${stats.failed}`);

    if (parseFailures.length > 0) {
      console.log("\nFailures:");
      for (const message of parseFailures) {
        console.log(`  - ${message}`);
      }
    }

    return;
  }

  const seriesSlugs = await loadSeriesSlugs();
  const existingSlugs = await loadExistingSlugs(parsed.map((essay) => essay.slug));
  const supabase = requireSupabaseServiceRoleClient();
  const importFailures: string[] = [];

  for (const seed of parsed) {
    if (existingSlugs.has(seed.slug)) {
      stats.skippedExisting += 1;
      console.log(`Skipped existing: ${seed.slug}`);
      continue;
    }

    if (!seriesSlugs.has(seed.series_slug)) {
      stats.failed += 1;
      importFailures.push(
        `${seed.filename}: unknown series_slug "${seed.series_slug}"`,
      );
      continue;
    }

    const { error } = await supabase.from("essays").insert(toInsert(seed));

    if (error) {
      stats.failed += 1;
      importFailures.push(`${seed.filename}: ${error.message}`);
      continue;
    }

    stats.imported += 1;
    existingSlugs.add(seed.slug);
  }

  console.log(`Found ${stats.found} seed essays.`);
  console.log(`Imported: ${stats.imported}`);
  console.log(`Skipped existing: ${stats.skippedExisting}`);
  console.log(`Failed: ${stats.failed}`);

  const allFailures = [...parseFailures, ...importFailures];

  if (allFailures.length > 0) {
    console.log("\nFailures:");
    for (const message of allFailures) {
      console.log(`  - ${message}`);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
