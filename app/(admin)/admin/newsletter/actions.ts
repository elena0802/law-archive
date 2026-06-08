"use server";

import {
  exportNewsletterSubscribersCsv,
  getActiveSubscriberUnsubscribeUrl,
} from "@/lib/admin/newsletter";
import { sendNewsletterTestEmail } from "@/lib/newsletter-email/send-test";
import {
  newsletterTestSendActionIdleState,
  type NewsletterTestSendActionState,
} from "@/lib/newsletter-test-send-action-state";

export async function downloadNewsletterSubscribersCsv() {
  return exportNewsletterSubscribersCsv();
}

export async function sendNewsletterTestEmailAction(
  _prevState: NewsletterTestSendActionState,
  formData: FormData,
): Promise<NewsletterTestSendActionState> {
  const recipientEmail = String(formData.get("recipient_email") ?? "");
  const subject = String(formData.get("subject") ?? "");
  const message = String(formData.get("message") ?? "");

  const unsubscribeUrl = await getActiveSubscriberUnsubscribeUrl(recipientEmail);

  const result = await sendNewsletterTestEmail({
    recipientEmail,
    subject,
    message,
    unsubscribeUrl,
  });

  if (!result.ok) {
    return {
      status: "error",
      message: result.error,
      fieldErrors: result.fieldErrors,
    };
  }

  return {
    ...newsletterTestSendActionIdleState,
    status: "success",
    message: "테스트 메일이 발송되었습니다.",
  };
}
