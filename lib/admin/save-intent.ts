import type { EssayStatus } from "@/lib/content/db-types";
import { parseEssayStatus } from "@/lib/content/essay-status";

export type SaveIntent = "draft" | "publish" | "archive" | "trash";

export function readSaveIntent(formData: FormData): SaveIntent {
  const value = formData.get("intent");

  if (
    value === "publish" ||
    value === "archive" ||
    value === "trash"
  ) {
    return value;
  }

  return "draft";
}

export function readCurrentStatus(formData: FormData): EssayStatus {
  return parseEssayStatus(formData.get("current_status")) ?? "draft";
}

/** Status resolved from submit intent. */
export function resolveStatusFromForm(formData: FormData): EssayStatus {
  const intent = readSaveIntent(formData);

  switch (intent) {
    case "publish":
      return "published";
    case "archive":
      return "archived";
    case "trash":
      return "deleted";
    case "draft":
    default: {
      const currentStatus = readCurrentStatus(formData);
      if (currentStatus === "published") {
        return "published";
      }
      return "draft";
    }
  }
}
