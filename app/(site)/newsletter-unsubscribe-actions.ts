"use server";

import { unsubscribeFromNewsletter } from "@/lib/newsletter";
import type { NewsletterUnsubscribeActionState } from "@/lib/newsletter-unsubscribe-action-state";

export async function unsubscribeNewsletter(
  _prevState: NewsletterUnsubscribeActionState,
  formData: FormData,
): Promise<NewsletterUnsubscribeActionState> {
  const email = String(formData.get("email") ?? "");
  const result = await unsubscribeFromNewsletter(email);

  if (result.ok) {
    return {
      status: "success",
      feedbackKind: "unsubscribed",
      message: "구독 해지가 완료되었습니다.",
    };
  }

  if (result.code === "already_unsubscribed") {
    return {
      status: "info",
      feedbackKind: "already_unsubscribed",
      message: result.error,
    };
  }

  if (result.code === "not_found") {
    return {
      status: "info",
      feedbackKind: "not_found",
      message: result.error,
    };
  }

  if (result.code === "invalid_email") {
    return {
      status: "error",
      feedbackKind: "validation",
      message: result.error,
    };
  }

  return {
    status: "error",
    feedbackKind: "general",
    message: result.error,
  };
}
