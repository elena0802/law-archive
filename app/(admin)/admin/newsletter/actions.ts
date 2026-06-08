"use server";

import { exportNewsletterSubscribersCsv } from "@/lib/admin/newsletter";
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

  const result = await sendNewsletterTestEmail({
    recipientEmail,
    subject,
    message,
  });

  if (!result.ok) {
    return {
      status: "error",
      message: result.error,
      fieldErrors: result.fieldErrors,
    };
  }

  let successMessage = "테스트 메일이 발송되었습니다.";

  if (result.includedUnsubscribeLink) {
    successMessage +=
      " 활성 구독자에게 수신 거부 링크가 포함되었습니다.";
  } else if (result.isActiveSubscriber) {
    successMessage +=
      " 활성 구독자이지만 수신 거부 링크를 만들 수 없습니다. 구독자 토큰 설정을 확인해 주세요.";
  } else {
    successMessage +=
      " 수신자가 활성 구독자가 아니어서 수신 거부 링크는 포함되지 않았습니다.";
  }

  return {
    ...newsletterTestSendActionIdleState,
    status: "success",
    message: successMessage,
  };
}
