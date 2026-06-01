import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { getSeriesIntroduction } from "@/lib/series";

const essaysDirectory = path.join(process.cwd(), "content", "essays");

/** Registered series titles — ensures volumes appear before any essay is published. */
export const archiveSeriesTitles = [
  "형벌과 사회",
  "AI와 형사법",
  "로스쿨 시대",
  "형사법 교수로 산다는 것",
  "법과 인간",
  "형사소송의 질문들",
  "판례를 읽는 방법",
  "법학자의 서재",
] as const;

export type EssayCatalogEntry = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  series: string;
  draft: boolean;
  featured: boolean;
};

/**
 * Archive essay registry (metadata). MDX frontmatter in content/essays should match.
 * New entries: add here first, then add a matching .mdx stub.
 */
export const essayCatalog: readonly EssayCatalogEntry[] = [
  {
    slug: "why-people-want-punishment",
    title: "왜 사람은 처벌을 원하는가",
    description:
      "처벌 요구의 정서와 공동체적 의미를 형사법의 언어로 천천히 묻기 위한 시론.",
    date: "2026-05-20",
    category: "형벌론",
    series: "형벌과 사회",
    draft: false,
    featured: true,
  },
  {
    slug: "punishment-and-revenge",
    title: "형벌은 복수와 어떻게 다른가",
    description: "복수의 충동과 형벌의 제도적 한계를 구별하기 위한 예비 노트.",
    date: "2026-05-18",
    category: "형벌론",
    series: "형벌과 사회",
    draft: false,
    featured: false,
  },
  {
    slug: "meaning-of-state-punishment",
    title: "국가가 처벌할 수 있다는 것은 무엇인가",
    description: "국가형벌권의 정당성과 한계를 조용히 되묻는 형사법적 성찰.",
    date: "2026-05-06",
    category: "국가형벌권",
    series: "형벌과 사회",
    draft: false,
    featured: false,
  },
  {
    slug: "life-as-criminal-law-professor-01",
    title: "형사법 교수로 산다는 것 (1)",
    description:
      "논문을 잘 쓰는 사람으로 보였지만, 학자로서 가장 힘들었던 것은 새로운 질문을 계속 만들어내는 일이었다.",
    date: "2026-05-30",
    category: "학자로서의 기록",
    series: "형사법 교수로 산다는 것",
    draft: false,
    featured: true,
  },
  {
    slug: "ai-era-lawyer-role",
    title: "AI 시대의 변호사의 역할",
    description:
      "AI가 법률 업무를 바꾸는 시대에도, 변호사에게 남는 본질적 역할은 무엇인지 묻는 글.",
    date: "2026-05-24",
    category: "AI와 형사법",
    series: "AI와 형사법",
    draft: false,
    featured: true,
  },
  {
    slug: "digital-crime-and-future-criminal-law",
    title: "디지털 범죄와 형사법의 미래",
    description:
      "기술이 바꾼 범죄의 형식 앞에서 형사법이 잃지 말아야 할 기준을 생각한다.",
    date: "2026-05-09",
    category: "디지털 형사법",
    series: "AI와 형사법",
    draft: false,
    featured: true,
  },
  {
    slug: "studying-law-in-law-school-era",
    title: "로스쿨 시대의 법학 공부",
    description:
      "시험 준비를 넘어 법적 사고의 습관을 어떻게 기를 것인지에 관한 짧은 성찰.",
    date: "2026-05-12",
    category: "법학교육",
    series: "로스쿨 시대",
    draft: false,
    featured: false,
  },
  {
    slug: "how-good-legal-professionals-think",
    title: "좋은 법조인은 어떻게 생각하는가",
    description: "결론보다 먼저 질문의 태도를 배우는 법률가의 사고 방식에 대하여.",
    date: "2026-05-03",
    category: "법조윤리",
    series: "로스쿨 시대",
    draft: false,
    featured: false,
  },
  {
    slug: "law-and-human-change",
    title: "법은 인간을 어디까지 바꿀 수 있는가",
    description: "법의 명령과 인간의 변화 사이에 놓인 거리와 한계를 생각해 보는 글.",
    date: "2026-05-15",
    category: "법철학",
    series: "법과 인간",
    draft: false,
    featured: true,
  },
  {
    slug: "criminal-procedure-center-axis",
    title: "형사소송법의 중심 축",
    description:
      "형사소송법이 지켜야 할 이념과 가치를 어디에 두어야 하는지 묻는 시론.",
    date: "2026-04-28",
    category: "형사소송법",
    series: "형사소송의 질문들",
    draft: true,
    featured: false,
  },
  {
    slug: "investigation-rights-and-human-dignity",
    title: "수사권 행사와 인권",
    description:
      "수사권의 정당한 행사와 피의자·피해자의 권리가 만나는 지점을 살핀다.",
    date: "2026-04-22",
    category: "형사소송법",
    series: "형사소송의 질문들",
    draft: true,
    featured: false,
  },
  {
    slug: "what-adversarial-trial-means",
    title: "공판중심주의란 무엇인가",
    description:
      "공판 절차가 형사재판의 중심에 서야 하는 이유와 그 한계를 정리한다.",
    date: "2026-04-15",
    category: "형사소송법",
    series: "형사소송의 질문들",
    draft: true,
    featured: false,
  },
  {
    slug: "evidence-disclosure-and-defense",
    title: "증거개시와 방어권",
    description:
      "증거개시 제도가 방어권 보장에 어떤 의미를 갖는지 형사소송법적으로 검토한다.",
    date: "2026-04-08",
    category: "형사소송법",
    series: "형사소송의 질문들",
    draft: true,
    featured: false,
  },
  {
    slug: "why-we-read-precedents",
    title: "판례는 왜 읽는가",
    description:
      "판례를 단순한 정답표가 아니라 사유의 기록으로 읽기 위한 출발점.",
    date: "2026-03-28",
    category: "판례 읽기",
    series: "판례를 읽는 방법",
    draft: true,
    featured: false,
  },
  {
    slug: "holding-vs-opinion",
    title: "판결요지와 이유",
    description: "판결문에서 무엇을 먼저 읽고, 무엇을 질문해야 하는지.",
    date: "2026-03-20",
    category: "판례 읽기",
    series: "판례를 읽는 방법",
    draft: true,
    featured: false,
  },
  {
    slug: "reading-illegal-evidence-cases",
    title: "위법수집증거 판례 읽기",
    description:
      "위법수집증거배제법칙 관련 판례를 구조와 쟁점 중심으로 따라간다.",
    date: "2026-03-12",
    category: "판례 읽기",
    series: "판례를 읽는 방법",
    draft: true,
    featured: false,
  },
  {
    slug: "structure-of-sentencing-precedents",
    title: "양형 판례의 구조",
    description: "양형 판례에서 비례와 개별화가 어떻게 논의되는지 살핀다.",
    date: "2026-03-05",
    category: "판례 읽기",
    series: "판례를 읽는 방법",
    draft: true,
    featured: false,
  },
  {
    slug: "textbooks-on-the-shelf",
    title: "서재에 쌓인 교과서",
    description: "형사법 교과서가 학자의 질문을 어떻게 형성해 왔는지.",
    date: "2026-02-18",
    category: "학자의 서재",
    series: "법학자의 서재",
    draft: true,
    featured: false,
  },
  {
    slug: "lecture-notes-and-manuscripts",
    title: "강의 노트와 원고",
    description: "강의실의 메모가 글이 되기까지의 거리.",
    date: "2026-02-08",
    category: "학자의 서재",
    series: "법학자의 서재",
    draft: true,
    featured: false,
  },
  {
    slug: "questions-between-books",
    title: "책 사이의 질문",
    description: "여러 책을 오가며 남는, 아직 답하지 못한 질문들.",
    date: "2026-01-25",
    category: "학자의 서재",
    series: "법학자의 서재",
    draft: true,
    featured: false,
  },
  {
    slug: "opening-a-digital-study",
    title: "디지털 서재를 여는 이유",
    description: "이 아카이브가 개인 서재의 연장선 위에 놓인 이유.",
    date: "2026-01-12",
    category: "학자의 서재",
    series: "법학자의 서재",
    draft: true,
    featured: false,
  },
] as const;

function compareSeriesByArchiveOrder(a: string, b: string) {
  const indexA = archiveSeriesTitles.indexOf(
    a as (typeof archiveSeriesTitles)[number],
  );
  const indexB = archiveSeriesTitles.indexOf(
    b as (typeof archiveSeriesTitles)[number],
  );

  if (indexA >= 0 && indexB >= 0) {
    return indexA - indexB;
  }

  if (indexA >= 0) {
    return -1;
  }

  if (indexB >= 0) {
    return 1;
  }

  return a.localeCompare(b, "ko");
}

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

export async function getAllSeries(
  options: { includeDrafts?: boolean } = {},
): Promise<EssaySeries[]> {
  const essays = await getAllEssays(options);
  const seriesMap = new Map<string, Essay[]>();

  for (const title of archiveSeriesTitles) {
    seriesMap.set(title, []);
  }

  for (const essay of essays) {
    if (!seriesMap.has(essay.series)) {
      seriesMap.set(essay.series, []);
    }

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
      const firstDate = sortedAsc[0]?.date ?? "";
      const latestDate = sortedEssays[0]?.date ?? "";

      return {
        title,
        slug,
        description,
        introduction: getSeriesIntroduction(slug, description),
        count: sortedEssays.length,
        essays: sortedEssays,
        firstDate,
        latestDate,
      };
    })
    .filter((item) => item.count > 0)
    .sort((a, b) => {
      const order = compareSeriesByArchiveOrder(a.title, b.title);

      if (order !== 0) {
        return order;
      }

      const latestDateDelta =
        new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime();

      return latestDateDelta || a.title.localeCompare(b.title, "ko");
    });
}

export async function getSeriesBySlug(
  slug: string,
  options: { includeDrafts?: boolean } = {},
): Promise<EssaySeries | null> {
  const normalizedSlug = getSeriesSlug(decodeSlug(slug));
  const series = await getAllSeries(options);

  return series.find((item) => item.slug === normalizedSlug) ?? null;
}

export async function getEssaysBySeries(
  slug: string,
  options: { includeDrafts?: boolean } = {},
): Promise<Essay[]> {
  const series = await getSeriesBySlug(slug, options);

  return series?.essays ?? [];
}
