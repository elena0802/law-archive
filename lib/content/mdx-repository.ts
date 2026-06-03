import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { EssayRepository } from "@/lib/content/essay-repository";
import {
  buildEssaySeriesList,
  type SeriesVolumeSource,
} from "@/lib/content/series-aggregation";
import { archiveSeriesTitles } from "@/lib/content/archive-series";
import type { Essay, EssayFrontmatter } from "@/lib/essays";
import { parseOptionalSeriesOrder } from "@/lib/content/parse-series-order";
import { getSeriesSlug } from "@/lib/content/series-slug";

const essaysDirectory = path.join(process.cwd(), "content", "essays");

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

function parseFrontmatter(data: RawFrontmatter, slug: string): EssayFrontmatter {
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

async function getEssayFilenames() {
  const filenames = await fs.readdir(essaysDirectory);

  return filenames.filter(
    (filename) => filename.endsWith(".mdx") && !filename.startsWith("_"),
  );
}

function isNotFoundError(error: unknown) {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT"
  );
}

function decodeSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

function getMdxSeriesVolumes(): SeriesVolumeSource[] {
  return archiveSeriesTitles.map((title, index) => ({
    title,
    slug: getSeriesSlug(title),
    description: "",
    sortKey: index,
  }));
}

async function readEssayBySlug(slug: string): Promise<Essay | null> {
  if (slug.includes("/") || slug.includes("..")) {
    return null;
  }

  try {
    const filePath = path.join(essaysDirectory, `${slug}.mdx`);
    const file = await fs.readFile(filePath, "utf8");
    const { content, data } = matter(file);
    const frontmatter = parseFrontmatter(data, slug);

    return {
      slug,
      content,
      seriesOrder: parseOptionalSeriesOrder(data.series_order),
      ...frontmatter,
    };
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }

    throw error;
  }
}

export function createMdxEssayRepository(): EssayRepository {
  return {
    async getEssayBySlug(slug, options = {}) {
      const essay = await readEssayBySlug(slug);

      if (!essay) {
        return null;
      }

      if (!options.includeDrafts && essay.draft) {
        return null;
      }

      return essay;
    },

    async getAllEssays(options = {}) {
      const filenames = await getEssayFilenames();
      const essays = await Promise.all(
        filenames.map((filename) =>
          readEssayBySlug(getSlugFromFilename(filename)),
        ),
      );

      return essays
        .filter((essay): essay is Essay => essay !== null)
        .filter((essay) => options.includeDrafts || !essay.draft)
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
    },

    async getAllSeries(options = {}) {
      const essays = await this.getAllEssays(options);
      return buildEssaySeriesList(getMdxSeriesVolumes(), essays);
    },

    async getSeriesBySlug(slug, options = {}) {
      const normalizedSlug = getSeriesSlug(decodeSlug(slug));
      const series = await this.getAllSeries(options);

      return series.find((item) => item.slug === normalizedSlug) ?? null;
    },
  };
}
