/**
 * Research corpus for /research — extends scholar profile with papers and chronology.
 * Add entries to arrays below; no CMS in Phase 2.
 */

export type ResearchTheme = {
  id: string;
  title: string;
};

export type ResearchPublicationKind = "article" | "report" | "project" | "book";

export type ResearchPublication = {
  id: string;
  title: string;
  year: number;
  venue: string;
  kind: ResearchPublicationKind;
  /** Optional context (award, journal issue, project type). */
  note?: string;
  themeIds?: readonly string[];
};

export type ResearchYearGroup = {
  id: string;
  label: string;
  intro?: string;
  entries: readonly ResearchPublication[];
};

export type ResearchRecord = {
  overview: {
    title: string;
    eyebrow: string;
    lead: string;
    note?: string;
  };
  themes: readonly ResearchTheme[];
  featuredPapers: readonly ResearchPublication[];
  yearGroups: readonly ResearchYearGroup[];
  sectionHeadings: {
    themes: string;
    featuredPapers: string;
    yearGroups: string;
  };
};

export const researchRecord = {
  overview: {
    title: "연구업적",
    eyebrow: "연구 기록",
    lead:
      "형사법, 형사소송법, 형사증거법, 국가형벌권, 형사정책에 관한 연구를 연도와 주제별로 정리합니다.",
    note:
      "이 목록은 학술 이력의 전부를 담기보다, 대표적인 논저와 연구 활동의 궤적을 밝히기 위한 기록입니다. 항목은 차차 보완합니다.",
  },
  themes: [
    { id: "punishment-state-power", title: "형벌과 국가형벌권" },
    { id: "responsibility-fault", title: "형사책임과 과실" },
    { id: "evidence-fair-trial", title: "형사증거와 적법절차" },
    { id: "exclusionary-rule", title: "위법수집증거배제법칙" },
    { id: "victim-protection", title: "범죄피해자 보호" },
    { id: "digital-criminal-law", title: "디지털 시대의 형사법" },
  ],
  featuredPapers: [
    {
      id: "attempt-theory-prospect",
      title: "미수범이론의 발전과 전망",
      year: 2002,
      venue: "한국형사법학회",
      kind: "article",
      note: "한국형사법학회 학술상(제2회) 수상",
      themeIds: ["responsibility-fault", "punishment-state-power"],
    },
    {
      id: "exclusionary-rule-private-effect",
      title: "위법수집증거배제법칙의 私人効",
      year: 2004,
      venue: "한국비교형사법학회",
      kind: "article",
      note: "한국비교형사법학회 학술상(제1회) 수상",
      themeIds: ["exclusionary-rule", "evidence-fair-trial"],
    },
    {
      id: "state-punishment-legitimacy",
      title: "국가형벌권의 정당화",
      year: 2015,
      venue: "형사법학",
      kind: "article",
      themeIds: ["punishment-state-power"],
    },
    {
      id: "criminal-procedure-center-axis",
      title: "형사소송법의 중심 축",
      year: 2011,
      venue: "동아법학 제23권 제3호",
      kind: "article",
      note: "「형사소송법학의 중심 잡기」로 게재",
      themeIds: ["evidence-fair-trial"],
    },
    {
      id: "video-recording-evidence",
      title: "증거방법으로서 영상녹화물 활용 방안 연구",
      year: 2008,
      venue: "한국학술진흥재단 기초연구지원(단독연구)",
      kind: "project",
      themeIds: ["evidence-fair-trial", "digital-criminal-law"],
    },
  ],
  yearGroups: [
    {
      id: "2010-2019",
      label: "2010–2019",
      intro: "형사소송법 논의, 교재 집필, 형법개정 정책 연구",
      entries: [
        {
          id: "criminal-procedure-issues-book",
          title: "쟁점 형사소송법",
          year: 2020,
          venue: "준커뮤니케이션즈",
          kind: "book",
        },
        {
          id: "criminal-law-general-book",
          title: "형법총론",
          year: 2016,
          venue: "준커뮤니케이션즈",
          kind: "book",
        },
        {
          id: "criminal-evidence-book",
          title: "형사증거법",
          year: 2016,
          venue: "준커뮤니케이션즈",
          kind: "book",
        },
        {
          id: "criminal-code-reform-chair",
          title: "형법개정연구(형법총칙·죄수·형벌)",
          year: 2009,
          venue: "한국형사정책연구원",
          kind: "report",
          note: "연구위원장",
        },
      ],
    },
    {
      id: "2000-2009",
      label: "2000–2009",
      intro: "증거법·수사절차, 피해자·형사정책, 교재 개발",
      entries: [
        {
          id: "digital-content-obscenity",
          title:
            "디지털콘텐츠 음란물에 대한 음란성 판단의 주체와 법률의 착오",
          year: 2008,
          venue: "한국학술진흥재단 우수논문 사후지원",
          kind: "project",
        },
        {
          id: "economic-crime-policy",
          title: "경제범죄에 대한 새로운 정책적 대응방안",
          year: 2006,
          venue: "전남대학교 법학연구소 법학논총",
          kind: "article",
          themeIds: ["punishment-state-power"],
        },
        {
          id: "investigation-human-rights",
          title: "수사권행사의 기본원칙과 인권보장",
          year: 2001,
          venue: "비교형사법연구 제3권",
          kind: "article",
          themeIds: ["evidence-fair-trial"],
        },
      ],
    },
    {
      id: "1990-1999",
      label: "1990–1999",
      intro: "피해자학·보호관찰·형사정책",
      entries: [
        {
          id: "victimology-methodology",
          title: "피해자학 연구방법론",
          year: 1999,
          venue: "피해자학연구 제7호",
          kind: "article",
          themeIds: ["victim-protection"],
        },
        {
          id: "probation-law-review",
          title: "보호관찰 관련 법률의 문제점과 개선방안",
          year: 1999,
          venue: "형사정책연구 제10권 제4호",
          kind: "article",
          themeIds: ["punishment-state-power"],
        },
        {
          id: "placeholder-1990s",
          title: "[추가 예정] 형사법·형사소송법 관련 논문",
          year: 1990,
          venue: "—",
          kind: "article",
          note: "연구 목록을 보완할 때 이 항목을 교체합니다.",
        },
      ],
    },
  ],
  sectionHeadings: {
    themes: "대표 연구 주제",
    featuredPapers: "주요 논문",
    yearGroups: "연도별 연구 목록",
  },
} as const satisfies ResearchRecord;

export const researchPagePath = "/research" as const;

export function formatResearchPublicationLine(publication: ResearchPublication) {
  const kindLabel =
    publication.kind === "book"
      ? "저서"
      : publication.kind === "project"
        ? "연구과제"
        : publication.kind === "report"
          ? "연구보고"
          : "논문";

  return `${publication.venue}, ${publication.year} · ${kindLabel}`;
}
