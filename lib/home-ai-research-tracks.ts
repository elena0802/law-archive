import { getEssayCoverImage } from "@/lib/essay-cover-image";
import type { Essay, EssaySeries } from "@/lib/essays";

export type AiResearchTrack = {
  description: readonly string[];
  href: string;
  imageKey: string;
  title: string;
  /** Latest essay cover from the linked series, when available. */
  essayCoverSrc?: string | null;
  essayCoverAlt?: string;
};

const AI_RESEARCH_TRACK_DEFINITIONS = [
  {
    title: "AI와 형사법",
    description: [
      "AI 시대의 형사법과 법률가의 역할에 대한 연구 노트.",
      "AI가 형사법 연구와 실무에 미치는 영향을 탐구합니다.",
    ],
    seriesTitle: "AI와 형사법",
    placeholderHref: "/series/ai-and-criminal-law",
    imageKey: "ai-and-criminal-law",
  },
  {
    title: "로스쿨 시대와 AI",
    description: [
      "AI가 로스쿨 시대의 법학 교육과 연구 방식을 어떻게 바꾸는가.",
      "AI 시대의 법학교육에 대한 생각을 기록합니다.",
    ],
    seriesTitle: "로스쿨 시대와 AI",
    seriesSlug: "로스쿨-시대와-ai",
    placeholderHref: "/series/로스쿨-시대와-ai",
    imageKey: "로스쿨-시대와-ai",
  },
] as const;

function resolveLatestEssayCover(essays: readonly Essay[]): {
  src: string | null;
  alt: string;
} | null {
  const latestEssay = essays[0];
  if (!latestEssay) {
    return null;
  }

  const cover = getEssayCoverImage(latestEssay);
  if (!cover.src) {
    return null;
  }

  return cover;
}

function findTrackSeries(
  allSeries: readonly EssaySeries[],
  definition: (typeof AI_RESEARCH_TRACK_DEFINITIONS)[number],
) {
  if ("seriesSlug" in definition) {
    const bySlug = allSeries.find((item) => item.slug === definition.seriesSlug);
    if (bySlug) {
      return bySlug;
    }
  }

  return allSeries.find((item) => item.title === definition.seriesTitle);
}

export function buildAiResearchTracks(
  allSeries: readonly EssaySeries[],
): AiResearchTrack[] {
  return AI_RESEARCH_TRACK_DEFINITIONS.map((definition) => {
    const series = findTrackSeries(allSeries, definition);
    const essayCover = series
      ? resolveLatestEssayCover(series.essays)
      : null;

    return {
      title: definition.title,
      description: definition.description,
      imageKey: definition.imageKey,
      href: series ? `/series/${series.slug}` : definition.placeholderHref,
      essayCoverSrc: essayCover?.src ?? null,
      essayCoverAlt: essayCover?.alt,
    };
  });
}
