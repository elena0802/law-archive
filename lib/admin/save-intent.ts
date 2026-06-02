import type { EssayStatus } from "@/lib/content/db-types";
import { parseEssayStatus } from "@/lib/content/essay-status";

export type SaveIntent = "draft" | "publish" | "save";

export function readSaveIntent(formData: FormData): SaveIntent {
  const value = formData.get("intent");

  if (value === "publish" || value === "save") {
    return value;
  }

  return "draft";
}

export function readCurrentStatus(formData: FormData): EssayStatus {
  return parseEssayStatus(formData.get("current_status")) ?? "draft";
}

export function readSelectedStatus(formData: FormData): EssayStatus {
  return parseEssayStatus(formData.get("essay_status")) ?? readCurrentStatus(formData);
}

export function resolveStatusFromIntent(
  intent: SaveIntent,
  formData: FormData,
): EssayStatus {
  if (intent === "publish") {
    return "published";
  }

  if (intent === "draft") {
    return "draft";
  }

  return readSelectedStatus(formData);
}

export function noticeKeyForIntent(intent: SaveIntent): "saved" | "published" {
  return intent === "publish" ? "published" : "saved";
}
