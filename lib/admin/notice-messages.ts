export type AdminNoticeKey = "saved" | "published";

const noticeMessages: Record<AdminNoticeKey, string> = {
  saved: "저장되었습니다.",
  published: "공개되었습니다.",
};

export function getAdminNoticeMessage(notice: string | undefined) {
  if (notice === "saved" || notice === "published") {
    return noticeMessages[notice];
  }

  return undefined;
}
