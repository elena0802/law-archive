import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { parseOptionalSeriesOrder } from "@/lib/content/parse-series-order";
import type { EssayFrontmatter } from "@/lib/essays";

const essaysDirectory = path.join(process.cwd(), "content", "essays");

export type ParsedMdxEssay = EssayFrontmatter & {
  slug: string;
  content: string;
  seriesOrder: number | null;
};

type RawFrontmatter = Partial<Record<keyof EssayFrontmatter, unknown>>;

function assertString(value: unknown, field: keyof EssayFrontmatter, slug: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Invalid frontmatter field "${field}" in essay "${slug}".`);
  }

  return value;
}

function assertBoolean(
  value: unknown,
  field: keyof EssayFrontmatter,
  slug: string,
) {
  if (typeof value !== "boolean") {
    throw new Error(`Invalid frontmatter field "${field}" in essay "${slug}".`);
  }

  return value;
}

export function parseMdxFrontmatter(
  data: RawFrontmatter,
  slug: string,
): EssayFrontmatter {
  return {
    title: assertString(data.title, "title", slug),
    description: assertString(data.description, "description", slug),
    date: assertString(data.date, "date", slug),
    category: assertString(data.category, "category", slug),
    series: assertString(data.series, "series", slug),
    draft: assertBoolean(data.draft, "draft", slug),
    featured: assertBoolean(data.featured, "featured", slug),
  };
}

function getSlugFromFilename(filename: string) {
  return filename.replace(/\.mdx$/, "");
}

export async function listMdxEssayFilenames() {
  const filenames = await fs.readdir(essaysDirectory);

  return filenames.filter(
    (filename) => filename.endsWith(".mdx") && !filename.startsWith("_"),
  );
}

export async function readMdxEssayFile(filename: string): Promise<ParsedMdxEssay> {
  const slug = getSlugFromFilename(filename);

  if (slug.includes("/") || slug.includes("..")) {
    throw new Error(`Unsafe essay filename "${filename}".`);
  }

  const filePath = path.join(essaysDirectory, filename);
  const file = await fs.readFile(filePath, "utf8");
  const { content, data } = matter(file);
  const frontmatter = parseMdxFrontmatter(data, slug);

  return {
    slug,
    content,
    seriesOrder: parseOptionalSeriesOrder(data.series_order),
    ...frontmatter,
  };
}

export async function readAllMdxEssays() {
  const filenames = await listMdxEssayFilenames();
  const essays: ParsedMdxEssay[] = [];
  const errors: { filename: string; message: string }[] = [];

  for (const filename of filenames) {
    try {
      essays.push(await readMdxEssayFile(filename));
    } catch (error) {
      errors.push({
        filename,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return { essays, errors };
}
