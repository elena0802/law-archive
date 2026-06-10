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

export function formatCurationDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}
