export type ResearchCategory =
  | "criminal-law-theory"
  | "criminal-procedure"
  | "evidence-law"
  | "criminal-policy"
  | "international-criminal-law"
  | "legal-education"
  | "other";

export type ResearchItem = {
  number: number;
  title: string;

  year?: number;
  month?: number;

  journal?: string;
  publisher?: string;
  volume?: string;
  pages?: string;

  field?: string;

  category: ResearchCategory;

  authors?: string;

  isImportant?: boolean;
  isRepresentative?: boolean;

  hasFullText?: boolean;
  pdfUrl?: string;
  pdfFileName?: string;
};

/** Korean labels and thematic keywords for each archive category. */
export const researchCategoryMeta: Record<
  ResearchCategory,
  { label: string; keywords: readonly string[] }
> = {
  "criminal-law-theory": {
    label: "형법 이론",
    keywords: [
      "공범론",
      "미수범",
      "책임론",
      "위법성조각",
      "금지착오",
      "형법총칙",
    ],
  },
  "criminal-procedure": {
    label: "형사소송법",
    keywords: [
      "형사소송법",
      "상소",
      "수사절차",
      "공판중심주의",
      "방어권",
    ],
  },
  "evidence-law": {
    label: "증거법",
    keywords: [
      "증거법",
      "위법수집증거배제법칙",
      "영상녹화물",
      "전자문서",
      "법과학 증거",
    ],
  },
  "criminal-policy": {
    label: "형사정책",
    keywords: [
      "경제범죄",
      "양형",
      "보호관찰",
      "소년사법",
      "범죄피해자",
    ],
  },
  "international-criminal-law": {
    label: "국제형법",
    keywords: ["국제형법", "범죄인인도", "국제수형자이송"],
  },
  "legal-education": {
    label: "법학교육",
    keywords: ["법학교육", "법학전문대학원", "법조인 양성"],
  },
  other: {
    label: "기타",
    keywords: ["기타"],
  },
};
