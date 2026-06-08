import { Resend } from "resend";
import { requireEditorSupabase } from "@/lib/admin/require-editor";
import { isValidNewsletterEmail } from "@/lib/newsletter";
import {
  getNewsletterFromAddress,
  isResendConfigured,
} from "@/lib/newsletter-email/config";
import { buildNewsletterTestEmailContent } from "@/lib/newsletter-email/template";

const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 10000;

export type SendNewsletterTestEmailInput = {
  recipientEmail: string;
  subject: string;
  message: string;
  unsubscribeUrl?: string | null;
};

export type SendNewsletterTestEmailResult =
  | { ok: true; messageId: string }
  | {
      ok: false;
      error: string;
      fieldErrors?: {
        recipientEmail?: string;
        subject?: string;
        message?: string;
      };
    };

function formatResendError(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    const message = String((error as { message?: unknown }).message ?? "").trim();
    if (message) {
      return message;
    }
  }

  return "이메일을 발송하지 못했습니다. 잠시 후 다시 시도해 주세요.";
}

export async function sendNewsletterTestEmail(
  input: SendNewsletterTestEmailInput,
): Promise<SendNewsletterTestEmailResult> {
  await requireEditorSupabase();

  if (!isResendConfigured()) {
    return {
      ok: false,
      error:
        "이메일 발송 설정이 완료되지 않았습니다. RESEND_API_KEY를 확인해 주세요.",
    };
  }

  const recipientEmail = input.recipientEmail.trim().toLowerCase();
  const subject = input.subject.trim();
  const message = input.message.trim();

  if (!recipientEmail) {
    return {
      ok: false,
      error: "수신 이메일을 입력해 주세요.",
      fieldErrors: { recipientEmail: "수신 이메일을 입력해 주세요." },
    };
  }

  if (!isValidNewsletterEmail(recipientEmail)) {
    return {
      ok: false,
      error: "올바른 수신 이메일 주소를 입력해 주세요.",
      fieldErrors: {
        recipientEmail: "올바른 수신 이메일 주소를 입력해 주세요.",
      },
    };
  }

  if (!subject) {
    return {
      ok: false,
      error: "제목을 입력해 주세요.",
      fieldErrors: { subject: "제목을 입력해 주세요." },
    };
  }

  if (subject.length > MAX_SUBJECT_LENGTH) {
    return {
      ok: false,
      error: `제목은 ${MAX_SUBJECT_LENGTH}자 이내로 입력해 주세요.`,
      fieldErrors: {
        subject: `제목은 ${MAX_SUBJECT_LENGTH}자 이내로 입력해 주세요.`,
      },
    };
  }

  if (!message) {
    return {
      ok: false,
      error: "본문을 입력해 주세요.",
      fieldErrors: { message: "본문을 입력해 주세요." },
    };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return {
      ok: false,
      error: `본문은 ${MAX_MESSAGE_LENGTH}자 이내로 입력해 주세요.`,
      fieldErrors: {
        message: `본문은 ${MAX_MESSAGE_LENGTH}자 이내로 입력해 주세요.`,
      },
    };
  }

  const content = buildNewsletterTestEmailContent({
    subject,
    message,
    unsubscribeUrl: input.unsubscribeUrl,
  });

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: getNewsletterFromAddress(),
    to: [recipientEmail],
    subject: content.subject,
    text: content.text,
    html: content.html,
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
