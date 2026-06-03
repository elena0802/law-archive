"use server";

import { subscribeToNewsletter } from "@/lib/newsletter";
import type { NewsletterActionState } from "@/lib/newsletter-action-state";

export async function subscribeNewsletter(
  _prevState: NewsletterActionState,
  formData: FormData,
): Promise<NewsletterActionState> {
  const email = String(formData.get("email") ?? "");
  const source = String(formData.get("source") ?? "homepage");

  const result = await subscribeToNewsletter(email, source);

  if (!result.ok) {
    const errorKind =
      result.code === "duplicate"
        ? "duplicate"
        : result.code === "invalid_email"
          ? "validation"
          : "general";

    return {
      status: "error",
      message: result.error,
      errorKind,
      fieldErrors: result.fieldErrors,
    };
  }

  return {
    status: "success",
    message: "구독 신청이 완료되었습니다.",
    submittedEmail: email.trim().toLowerCase(),
  };
}
