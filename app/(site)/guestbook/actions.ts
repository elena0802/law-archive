"use server";

import { revalidatePath } from "next/cache";
import {
  createGuestbookEntry,
  deleteGuestbookEntryWithPassword,
} from "@/lib/guestbook";
import type {
  GuestbookActionState,
  GuestbookDeleteActionState,
} from "@/lib/guestbook-action-state";

export async function submitGuestbookEntry(
  _prevState: GuestbookActionState,
  formData: FormData,
): Promise<GuestbookActionState> {
  const name = String(formData.get("name") ?? "");
  const affiliation = String(formData.get("affiliation") ?? "");
  const content = String(formData.get("content") ?? "");
  const password = String(formData.get("password") ?? "");

  const result = await createGuestbookEntry({
    name,
    affiliation,
    content,
    password,
  });

  if (!result.ok) {
    return {
      status: "error",
      message: result.error,
      fieldErrors: result.fieldErrors,
    };
  }

  try {
    revalidatePath("/guestbook");
  } catch (error) {
    console.error("[submitGuestbookEntry] revalidatePath failed:", error);
  }

  return {
    status: "success",
    message:
      "안부가 등록되었습니다.\n\n남겨주신 글이 안부의 글에 게시되었습니다.\n소중한 말씀 감사합니다.",
  };
}

export async function deleteGuestbookEntry(
  _prevState: GuestbookDeleteActionState,
  formData: FormData,
): Promise<GuestbookDeleteActionState> {
  const entryId = String(formData.get("entry_id") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const result = await deleteGuestbookEntryWithPassword(entryId, password);

  if (!result.ok) {
    return {
      status: "error",
      message: result.error,
    };
  }

  try {
    revalidatePath("/guestbook");
  } catch (error) {
    console.error("[deleteGuestbookEntry] revalidatePath failed:", error);
  }

  return {
    status: "success",
    message: "안부가 삭제되었습니다.",
  };
}
