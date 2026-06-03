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
  const fromField = parseEssayStatus(formData.get("essay_status"));
  if (fromField) {
    return fromField;
  }

  return readCurrentStatus(formData);
}

/** Status from form: hidden essay_status (authoritative) plus optional publish intent. */
export function resolveStatusFromForm(formData: FormData): EssayStatus {
  if (readSaveIntent(formData) === "publish") {
    return "published";
  }

  return readSelectedStatus(formData);
}
