import { archiveSeriesTitles } from "@/lib/content/archive-series";
import {
  getCategorySlug,
  resolveCategorySlugParam,
} from "@/lib/content/category-slug";
import { getEssayRepository } from "@/lib/content/get-repository";
import {
  sortEssaysByDateAsc,
} from "@/lib/content/series-aggregation";
import { sortEssaysForSeries } from "@/lib/content/series-order";

export { archiveSeriesTitles };

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
 * Legacy MDX registry (metadata). Supabase is authoritative when CONTENT_SOURCE=supabase.
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
  /** Present when loaded from Supabase CMS. */
  status?: import("@/lib/content/db-types").EssayStatus;
  /** ISO timestamp when loaded from Supabase CMS. */
  updatedAt?: string;
  /** Explicit installment order when set in CMS (`series_order`). */
  seriesOrder?: number | null;
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

export { sortEssaysByDateAsc, sortEssaysForSeries };

export function formatEssayDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
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

  const ordered = sortEssaysForSeries(essays);
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

export { getSeriesSlug } from "@/lib/content/series-slug";
export { getCategorySlug, resolveCategorySlugParam };

export async function getEssayBySlug(
  slug: string,
  options: { includeDrafts?: boolean } = {},
): Promise<Essay | null> {
  return getEssayRepository().getEssayBySlug(slug, options);
}

export async function getAllEssays(
  options: { includeDrafts?: boolean } = {},
): Promise<Essay[]> {
  return getEssayRepository().getAllEssays(options);
}

export async function getFeaturedEssays(limit?: number): Promise<Essay[]> {
  const featuredEssays = (await getAllEssays()).filter((essay) => essay.featured);

  return typeof limit === "number" ? featuredEssays.slice(0, limit) : featuredEssays;
}

export async function getAllSeries(
  options: { includeDrafts?: boolean } = {},
): Promise<EssaySeries[]> {
  return getEssayRepository().getAllSeries(options);
}

export async function getSeriesBySlug(
  slug: string,
  options: { includeDrafts?: boolean } = {},
): Promise<EssaySeries | null> {
  return getEssayRepository().getSeriesBySlug(slug, options);
}

export async function getEssaysBySeries(
  slug: string,
  options: { includeDrafts?: boolean } = {},
): Promise<Essay[]> {
  const series = await getSeriesBySlug(slug, options);

  return series?.essays ?? [];
}

export type EssayCategory = {
  slug: string;
  title: string;
  count: number;
  latestEssays: Essay[];
};

export async function getAllCategories(): Promise<EssayCategory[]> {
  const essays = await getAllEssays();
  const byCategory = new Map<string, Essay[]>();

  for (const essay of essays) {
    const list = byCategory.get(essay.category) ?? [];
    list.push(essay);
    byCategory.set(essay.category, list);
  }

  return [...byCategory.entries()]
    .map(([title, items]) => {
      const ordered = [...items].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );

      return {
      slug: getCategorySlug(title),
      title,
      count: items.length,
      latestEssays: ordered.slice(0, 2),
    };
    })
    .sort((a, b) => b.count - a.count || a.title.localeCompare(b.title, "ko"));
}

export async function getCategoryBySlug(slug: string) {
  const normalizedSlug = resolveCategorySlugParam(slug);
  const categories = await getAllCategories();
  const category = categories.find((item) => item.slug === normalizedSlug) ?? null;

  if (!category) {
    return null;
  }

  const essays = await getAllEssays();
  const items = essays
    .filter((essay) => essay.category === category.title)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latest = items[0]?.date ?? "";
  const first = items[items.length - 1]?.date ?? "";

  return { ...category, essays: items, firstDate: first, latestDate: latest };
}

export async function searchEssays(query: string): Promise<Essay[]> {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) {
    return [];
  }

  const essays = await getAllEssays();
  return essays
    .filter((essay) => {
      const haystack = [
        essay.title,
        essay.category,
        essay.description,
        essay.content,
        essay.series,
      ]
        .join("\n")
        .toLocaleLowerCase();

      return haystack.includes(normalizedQuery);
    })
    .sort(
      (a, b) =>
        searchEssayRelevanceScore(b, normalizedQuery) -
        searchEssayRelevanceScore(a, normalizedQuery),
    );
}

function searchEssayRelevanceScore(essay: Essay, query: string): number {
  const title = essay.title.toLocaleLowerCase();
  const category = essay.category.toLocaleLowerCase();
  const description = essay.description.toLocaleLowerCase();
  const series = essay.series.toLocaleLowerCase();
  const content = essay.content.toLocaleLowerCase();

  if (title.includes(query)) {
    return 4;
  }
  if (category.includes(query)) {
    return 3;
  }
  if (description.includes(query)) {
    return 2;
  }
  if (series.includes(query)) {
    return 1;
  }
  if (content.includes(query)) {
    return 0;
  }

  return -1;
}

function tokenizeForOverlap(input: string) {
  return input
    .toLocaleLowerCase()
    .split(/[^0-9a-zA-Z가-힣]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);
}

function keywordOverlapScore(current: Essay, candidate: Essay) {
  const currentTokens = new Set(
    tokenizeForOverlap(`${current.title} ${current.description}`),
  );
  if (currentTokens.size === 0) {
    return 0;
  }

  const candidateTokens = new Set(
    tokenizeForOverlap(`${candidate.title} ${candidate.description}`),
  );
  for (const token of currentTokens) {
    if (candidateTokens.has(token)) {
      return 1;
    }
  }

  return 0;
}

export async function getRelatedEssays(currentEssay: Essay, limit = 3) {
  const essays = await getAllEssays();
  const candidates = essays.filter((essay) => essay.slug !== currentEssay.slug);

  const ranked = candidates
    .map((essay) => {
      let score = 0;
      if (essay.category === currentEssay.category) {
        score += 3;
      }
      if (essay.series === currentEssay.series) {
        score += 2;
      }
      score += keywordOverlapScore(currentEssay, essay);

      return { essay, score };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(b.essay.date).getTime() - new Date(a.essay.date).getTime(),
    );

  const withSignal = ranked.filter((item) => item.score > 0).slice(0, limit);
  if (withSignal.length >= limit) {
    return withSignal.map((item) => item.essay);
  }

  const fallback = ranked
    .filter((item) => item.score === 0)
    .slice(0, limit - withSignal.length)
    .map((item) => item.essay);

  return [...withSignal.map((item) => item.essay), ...fallback].slice(0, limit);
}
