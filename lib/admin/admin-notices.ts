import type { EssayStatus } from "@/lib/content/db-types";

/** ASCII-only codes for redirect query params — never Korean text in URLs. */
export type EssaySaveNotice = "saved" | "published" | "updated" | "trashed" | "restored";

export function resolveEssaySaveNotice(
  previousStatus: EssayStatus,
  nextStatus: EssayStatus,
): EssaySaveNotice {
  if (nextStatus === "published" && previousStatus !== "published") {
    return "published";
  }

  if (nextStatus === "deleted" && previousStatus !== "deleted") {
    return "trashed";
  }

  if (previousStatus === "published" && nextStatus === "published") {
    return "updated";
  }

  return "saved";
}

export function essaySaveNoticeMessage(notice: EssaySaveNotice): string {
  switch (notice) {
    case "published":
      return "글이 공개되었습니다.";
    case "updated":
      return "변경사항이 저장되었습니다.";
    case "trashed":
      return "휴지통으로 이동되었습니다.";
    case "restored":
      return "글이 복원되었습니다.";
    case "saved":
    default:
      return "저장되었습니다.";
  }
}

export function getAdminEssayNoticeMessage(
  notice: string | undefined,
): string | undefined {
  if (
    notice === "saved" ||
    notice === "published" ||
    notice === "updated" ||
    notice === "trashed" ||
    notice === "restored"
  ) {
    return essaySaveNoticeMessage(notice);
  }

  return undefined;
}

export function getAdminSeriesNoticeMessage(
  notice: string | undefined,
): string | undefined {
  if (notice === "saved") {
    return "연재가 저장되었습니다.";
  }

  return undefined;
}

export function getAdminCurationNoticeMessage(
  notice: string | undefined,
): string | undefined {
  if (notice === "saved") {
    return "큐레이션 항목이 저장되었습니다.";
  }

  if (notice === "deleted") {
    return "큐레이션 항목이 삭제되었습니다.";
  }

  if (notice === "delete_failed") {
    return "큐레이션 항목을 삭제하지 못했습니다. 잠시 후 다시 시도해 주세요.";
  }

  return undefined;
}
