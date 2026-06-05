import { scholarProfile } from "@/lib/profile";

export function formatCommentDate(isoDate: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(isoDate));
}

export function getCommentAuthorDisplayName(authorName: string | null) {
  const trimmed = authorName?.trim();
  return trimmed ? trimmed : "익명";
}

export function isArchiveAuthorComment(authorName: string | null) {
  const trimmed = authorName?.trim();
  return trimmed === scholarProfile.name;
}
