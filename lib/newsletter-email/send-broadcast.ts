import {
  listDeliverableActiveSubscribers,
  saveNewsletterSendLog,
} from "@/lib/admin/newsletter";
import { requireEditorSupabase } from "@/lib/admin/require-editor";
import { buildNewsletterUnsubscribeUrl } from "@/lib/newsletter";
import { isResendConfigured } from "@/lib/newsletter-email/config";
import { sendOneNewsletterEmail } from "@/lib/newsletter-email/send-one";
import { buildNewsletterEmailContent } from "@/lib/newsletter-email/template";
import {
  validateNewsletterSendFields,
  type NewsletterSendFieldErrors,
} from "@/lib/newsletter-email/validate";

export type SendNewsletterBroadcastResult =
  | {
      ok: true;
      recipientCount: number;
      successCount: number;
      failureCount: number;
    }
  | {
      ok: false;
      error: string;
      fieldErrors?: NewsletterSendFieldErrors;
    };

export async function sendNewsletterBroadcast(input: {
  subject: string;
  message: string;
  relatedUrl?: string;
  broadcastConfirmed: boolean;
}): Promise<SendNewsletterBroadcastResult> {
  const { user } = await requireEditorSupabase();

  if (!isResendConfigured()) {
    return {
      ok: false,
      error:
        "이메일 발송 설정이 완료되지 않았습니다. RESEND_API_KEY를 확인해 주세요.",
    };
  }

  if (!input.broadcastConfirmed) {
    return {
      ok: false,
      error: "활성 구독자 발송을 확인해 주세요.",
    };
  }

  const validated = validateNewsletterSendFields({
    subject: input.subject,
    message: input.message,
    relatedUrl: input.relatedUrl,
  });

  if (!validated.ok) {
    return {
      ok: false,
      error: validated.error,
      fieldErrors: validated.fieldErrors,
    };
  }

  const recipients = await listDeliverableActiveSubscribers();

  if (recipients.length === 0) {
    return {
      ok: false,
      error: "발송할 활성 구독자가 없습니다.",
    };
  }

  let successCount = 0;
  let failureCount = 0;

  for (const recipient of recipients) {
    const unsubscribeUrl = buildNewsletterUnsubscribeUrl(
      recipient.unsubscribe_token,
    );

    const content = buildNewsletterEmailContent({
      subject: validated.subject,
      message: validated.message,
      relatedUrl: validated.relatedUrl,
      unsubscribeUrl,
      variant: "broadcast",
    });

    const result = await sendOneNewsletterEmail({
      to: recipient.email,
      content,
    });

    if (result.ok) {
      successCount += 1;
    } else {
      failureCount += 1;
    }
  }

  const createdBy = user.email?.trim() || user.id;

  await saveNewsletterSendLog({
    subject: validated.subject,
    body: validated.message,
    relatedUrl: validated.relatedUrl,
    recipientCount: recipients.length,
    successCount,
    failureCount,
    createdBy,
  });

  return {
    ok: true,
    recipientCount: recipients.length,
    successCount,
    failureCount,
  };
}
