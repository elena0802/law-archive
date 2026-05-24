import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

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
