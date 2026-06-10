import type { CurationType } from "@/lib/content/db-types";

export type CurationItem = {
  id: string;
  type: CurationType;
  title: string;
  description: string;
  professorNote: string;
  url: string;
  source: string;
  thumbnailUrl: string | null;
  publishedAt: string | null;
  recommendedAt: string;
  isFeatured: boolean;
  sortOrder: number;
};

export const curationPagePath = "/curation";

export const curationSectionDescription =
  "최근 관심 있게 읽고 보고 있는 콘텐츠와, 그 이유를 짧게 기록했습니다.";

export function formatCurationDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}
