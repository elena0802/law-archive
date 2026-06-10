"use server";

import { exportNewsletterSubscribersCsv } from "@/lib/admin/newsletter";
import { sendNewsletterBroadcast } from "@/lib/newsletter-email/send-broadcast";
import { sendNewsletterTestEmail } from "@/lib/newsletter-email/send-test";
import { parseNewsletterTemplate } from "@/lib/newsletter-email/templates";
import {
  newsletterSendActionIdleState,
  type NewsletterSendActionState,
} from "@/lib/newsletter-send-action-state";

export async function downloadNewsletterSubscribersCsv() {
  return exportNewsletterSubscribersCsv();
}

export async function sendNewsletterAction(
  _prevState: NewsletterSendActionState,
  formData: FormData,
): Promise<NewsletterSendActionState> {
  const intent = String(formData.get("intent") ?? "");
  const subject = String(formData.get("subject") ?? "");
  const message = String(formData.get("message") ?? "");
  const relatedUrl = String(formData.get("related_url") ?? "");
  const template = parseNewsletterTemplate(formData.get("template"));

  if (intent === "test") {
    const recipientEmail = String(formData.get("recipient_email") ?? "");

    const result = await sendNewsletterTestEmail({
      recipientEmail,
      subject,
      message,
      relatedUrl,
      template,
    });

    if (!result.ok) {
      return {
        status: "error",
        intent: "test",
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
      ...newsletterSendActionIdleState,
      status: "success",
      intent: "test",
      message: successMessage,
    };
  }

  if (intent === "broadcast") {
    const broadcastConfirmed =
      String(formData.get("broadcast_confirmed") ?? "") === "yes";

    const result = await sendNewsletterBroadcast({
      subject,
      message,
      relatedUrl,
      template,
      broadcastConfirmed,
    });

    if (!result.ok) {
      return {
        status: "error",
        intent: "broadcast",
        message: result.error,
        fieldErrors: result.fieldErrors,
      };
    }

    let successMessage = "뉴스레터 발송이 완료되었습니다.";
    successMessage += `\n성공: ${result.successCount}명`;
    successMessage += `\n실패: ${result.failureCount}명`;

    return {
      ...newsletterSendActionIdleState,
      status: "success",
      intent: "broadcast",
      message: successMessage,
      broadcastResult: {
        successCount: result.successCount,
        failureCount: result.failureCount,
      },
    };
  }

  return {
    status: "error",
    message: "발송 유형을 확인해 주세요.",
  };
}
