/**
 * Research page for /research — scholar profile, representative works, archive links.
 * Static copy; category and series links are resolved on the page from live content.
 */

export type ResearchArea = {
  label: string;
  /** When set, link to `/categories/[slug]` if that category exists in the archive. */
  category?: string;
};

export type ResearchPaper = {
  id: string;
  title: string;
  venue: string;
  year: number;
};

export type ResearchJourneyPeriod = {
  era: string;
  theme: string;
};

export type ResearchMap = {
  overview: {
    title: string;
    eyebrow: string;
    lead: string;
    body: readonly string[];
  };
  sectionHeadings: {
    areas: string;
    featuredPapers: string;
    series: string;
    journey: string;
  };
  areas: readonly ResearchArea[];
  featuredPapers: readonly ResearchPaper[];
  featuredSeriesSlugs: readonly string[];
  journey: readonly ResearchJourneyPeriod[];
};

export const researchMap = {
  overview: {
    title: "연구",
    eyebrow: "연구",
    lead:
      "35년 동안 형법, 형사정책, 법철학, 그리고 최근에는 AI와 형사법을 연구해 왔습니다. 대표 논문과 연구 흐름을 정리한 기록입니다.",
    body: [
      "형사법은 결국 인간과 사회에 대한 질문입니다.",
      "35년 동안 형법, 형사정책, 법철학, 그리고 최근에는 AI와 형사법을 연구해 왔습니다.",
      "이 페이지는 제가 오랫동안 탐구해 온 주요 질문과 연구 흐름을 정리한 기록입니다.",
    ],
  },
  sectionHeadings: {
    areas: "연구 분야",
    featuredPapers: "주요 논문",
    series: "대표 연재",
    journey: "연구의 흐름",
  },
  areas: [
    { label: "형법" },
    { label: "형사정책" },
    { label: "법철학", category: "법철학" },
    { label: "AI와 형사법", category: "AI와 형사법" },
  ],
  featuredPapers: [
    {
      id: "state-punishment-legitimacy",
      title: "국가형벌권의 정당화",
      venue: "형사법학",
      year: 2015,
    },
    {
      id: "criminal-procedure-center-axis",
      title: "형사소송법의 중심 축",
      venue: "동아법학 제23권 제3호",
      year: 2011,
    },
    {
      id: "exclusionary-rule-private-effect",
      title: "위법수집증거배제법칙의 私人効",
      venue: "한국비교형사법학회",
      year: 2004,
    },
    {
      id: "attempt-theory-prospect",
      title: "미수범이론의 발전과 전망",
      venue: "한국형사법학회",
      year: 2002,
    },
    {
      id: "investigation-human-rights",
      title: "수사권행사의 기본원칙과 인권보장",
      venue: "비교형사법연구 제3권",
      year: 2001,
    },
    {
      id: "video-recording-evidence",
      title: "증거방법으로서 영상녹화물 활용 방안 연구",
      venue: "한국학술진흥재단 기초연구지원",
      year: 2008,
    },
    {
      id: "economic-crime-policy",
      title: "경제범죄에 대한 새로운 정책적 대응방안",
      venue: "전남대학교 법학연구소 법학논총",
      year: 2006,
    },
    {
      id: "victimology-methodology",
      title: "피해자학 연구방법론",
      venue: "피해자학연구 제7호",
      year: 1999,
    },
  ],
  featuredSeriesSlugs: ["형벌과-사회", "ai와-형사법", "로스쿨-시대"],
  journey: [
    { era: "1990s", theme: "형사정책과 범죄 예방" },
    { era: "2000s", theme: "피해자 보호와 형사절차" },
    { era: "2010s", theme: "형사소송법과 국가형벌권" },
    { era: "2020s", theme: "AI와 형사법" },
  ],
} as const satisfies ResearchMap;

export const researchPagePath = "/research" as const;

export function formatResearchPaperLine(paper: ResearchPaper) {
  return `${paper.venue}, ${paper.year}`;
}
