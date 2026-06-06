"use server";

import { revalidatePath } from "next/cache";
import { saveGuestbookReply } from "@/lib/admin/guestbook";
import {
  guestbookReplyActionIdleState,
  type GuestbookReplyActionState,
} from "@/lib/admin/guestbook-reply-action-state";

export async function saveGuestbookReplyAction(
  prevState: GuestbookReplyActionState,
  formData: FormData,
): Promise<GuestbookReplyActionState> {
  const entryId = String(formData.get("entry_id") ?? "").trim();
  const replyContent = String(formData.get("reply_content") ?? "");

  const result = await saveGuestbookReply(entryId, replyContent);

  if (!result.ok) {
    return {
      status: "error",
      message: result.error,
      fieldErrors: result.fieldErrors,
    };
  }

  revalidatePath("/guestbook");
  revalidatePath("/admin/guestbook");

  return {
    ...guestbookReplyActionIdleState,
    status: "success",
    message: "답글이 저장되었습니다.",
  };
}
