import type { EssaySeries } from "@/lib/essays";

export type AiResearchTrack = {
  description: readonly string[];
  href: string;
  imageKey: string;
  title: string;
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
    title: "법학교육과 AI",
    description: [
      "AI가 법학 교육과 연구 방식을 어떻게 바꾸는가.",
      "AI 시대의 법학교육에 대한 생각을 기록합니다.",
    ],
    seriesTitle: "법학교육과 AI",
    placeholderHref: "/series/legal-education-and-ai",
    imageKey: "legal-education-and-ai",
  },
] as const;

export function buildAiResearchTracks(
  allSeries: readonly EssaySeries[],
): AiResearchTrack[] {
  return AI_RESEARCH_TRACK_DEFINITIONS.map((definition) => {
    const series = allSeries.find(
      (item) => item.title === definition.seriesTitle,
    );

    return {
      title: definition.title,
      description: definition.description,
      imageKey: definition.imageKey,
      href: series ? `/series/${series.slug}` : definition.placeholderHref,
    };
  });
}
