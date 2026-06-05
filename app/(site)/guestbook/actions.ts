"use server";

import { revalidatePath } from "next/cache";
import { createGuestbookEntry } from "@/lib/guestbook";
import type { GuestbookActionState } from "@/lib/guestbook-action-state";

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
    message: "안부가 등록되었습니다. 확인 후 게시됩니다.",
  };
}
