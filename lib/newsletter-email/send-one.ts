import { Resend } from "resend";
import {
  getNewsletterFromAddress,
  isResendConfigured,
} from "@/lib/newsletter-email/config";
import type { NewsletterEmailContent } from "@/lib/newsletter-email/template";

export function formatResendError(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    const message = String((error as { message?: unknown }).message ?? "").trim();
    if (message) {
      return message;
    }
  }

  return "이메일을 발송하지 못했습니다. 잠시 후 다시 시도해 주세요.";
}

export type SendOneNewsletterEmailResult =
  | { ok: true; messageId: string }
  | { ok: false; error: string };

export async function sendOneNewsletterEmail(input: {
  to: string;
  content: NewsletterEmailContent;
}): Promise<SendOneNewsletterEmailResult> {
  if (!isResendConfigured()) {
    return {
      ok: false,
      error:
        "이메일 발송 설정이 완료되지 않았습니다. RESEND_API_KEY를 확인해 주세요.",
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: getNewsletterFromAddress(),
    to: [input.to],
    subject: input.content.subject,
    text: input.content.text,
    html: input.content.html,
  });

  if (error) {
    return {
      ok: false,
      error: formatResendError(error),
    };
  }

  if (!data?.id) {
    return {
      ok: false,
      error: "이메일을 발송하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  return { ok: true, messageId: data.id };
}
