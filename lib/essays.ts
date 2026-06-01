import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { getSeriesIntroduction } from "@/lib/series";

const essaysDirectory = path.join(process.cwd(), "content", "essays");

export type EssayFrontmatter = {
  title: string;
  description: string;
  date: string;
  category: string;
  series: string;
  draft: boolean;
  featured: boolean;
};

export type Essay = EssayFrontmatter & {
  slug: string;
  content: string;
};

export type EssaySeries = {
  title: string;
  slug: string;
  description: string;
  introduction: string;
  count: number;
  essays: Essay[];
  firstDate: string;
  latestDate: string;
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

export function formatEssayDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function sortEssaysByDateAsc(essays: Essay[]) {
  return [...essays].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

/** Rough reading time for Korean long-form prose (~500 chars/min). */
export function estimateReadingMinutes(content: string) {
  const plain = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*\[\]`_-]/g, " ")
    .replace(/\s+/g, "");
  const minutes = Math.round(plain.length / 500);

  return Math.max(1, minutes);
}

export function getSeriesPartLabel(essays: Essay[], currentSlug: string) {
  if (essays.length <= 1) {
    return null;
  }

  const ordered = sortEssaysByDateAsc(essays);
  const index = ordered.findIndex((essay) => essay.slug === currentSlug);

  if (index < 0) {
    return null;
  }

  return `제${index + 1}편 / 총 ${ordered.length}편`;
}

export function formatSeriesDateRange(essays: Essay[]) {
  if (essays.length === 0) {
    return "";
  }

  const sorted = sortEssaysByDateAsc(essays);
  const earliest = formatEssayDate(sorted[0].date);
  const latest = formatEssayDate(sorted[sorted.length - 1].date);

  if (sorted.length === 1) {
    return earliest;
  }

  return `${earliest} – ${latest}`;
}

export function getSeriesSlug(series: string) {
  return series
    .trim()
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function getSeriesDescription(series: string, count: number) {
  return `${series}에 속한 ${count}편의 글을 한 흐름으로 모아둔 아카이브입니다.`;
}

function decodeSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export async function getEssayBySlug(slug: string): Promise<Essay | null> {
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
      ...frontmatter,
    };
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }

    throw error;
  }
}

export async function getAllEssays(
  options: { includeDrafts?: boolean } = {},
): Promise<Essay[]> {
  const filenames = await getEssayFilenames();
  const essays = await Promise.all(
    filenames.map((filename) => getEssayBySlug(getSlugFromFilename(filename))),
  );

  return essays
    .filter((essay): essay is Essay => essay !== null)
    .filter((essay) => options.includeDrafts || !essay.draft)
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
}

export async function getFeaturedEssays(limit?: number): Promise<Essay[]> {
  const featuredEssays = (await getAllEssays()).filter((essay) => essay.featured);

  return typeof limit === "number" ? featuredEssays.slice(0, limit) : featuredEssays;
}

export async function getAllSeries(): Promise<EssaySeries[]> {
  const essays = await getAllEssays();
  const seriesMap = new Map<string, Essay[]>();

  for (const essay of essays) {
    const essaysInSeries = seriesMap.get(essay.series) ?? [];
    essaysInSeries.push(essay);
    seriesMap.set(essay.series, essaysInSeries);
  }

  return Array.from(seriesMap.entries())
    .map(([title, essaysInSeries]) => {
      const sortedEssays = [...essaysInSeries].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      const sortedAsc = sortEssaysByDateAsc(essaysInSeries);
      const slug = getSeriesSlug(title);
      const description = getSeriesDescription(title, sortedEssays.length);

      return {
        title,
        slug,
        description,
        introduction: getSeriesIntroduction(slug, description),
        count: sortedEssays.length,
        essays: sortedEssays,
        firstDate: sortedAsc[0].date,
        latestDate: sortedEssays[0].date,
      };
    })
    .sort((a, b) => {
      const latestDateDelta =
        new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime();

      return latestDateDelta || a.title.localeCompare(b.title, "ko");
    });
}

export async function getSeriesBySlug(slug: string): Promise<EssaySeries | null> {
  const normalizedSlug = getSeriesSlug(decodeSlug(slug));
  const series = await getAllSeries();

  return series.find((item) => item.slug === normalizedSlug) ?? null;
}

export async function getEssaysBySeries(slug: string): Promise<Essay[]> {
  const series = await getSeriesBySlug(slug);

  return series?.essays ?? [];
}
