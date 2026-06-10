import { isValidNewsletterEmail } from "@/lib/newsletter";

export const MAX_NEWSLETTER_SUBJECT_LENGTH = 200;
export const MAX_NEWSLETTER_MESSAGE_LENGTH = 10000;
export const MAX_NEWSLETTER_RELATED_URL_LENGTH = 2048;

import {
  NEWSLETTER_TEMPLATES,
  type NewsletterTemplate,
  parseNewsletterTemplate,
} from "@/lib/newsletter-email/templates";

export type NewsletterSendFieldErrors = {
  recipientEmail?: string;
  subject?: string;
  message?: string;
  relatedUrl?: string;
  template?: string;
};

export function normalizeOptionalRelatedUrl(value: string) {
  const trimmed = value.trim();
  return trimmed || null;
}

export function isValidNewsletterRelatedUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return true;
  }

  if (trimmed.length > MAX_NEWSLETTER_RELATED_URL_LENGTH) {
    return false;
  }

  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateNewsletterSendFields(input: {
  subject: string;
  message: string;
  relatedUrl?: string;
  recipientEmail?: string;
  template?: string;
  requireRecipient?: boolean;
}):
  | {
      ok: true;
      subject: string;
      message: string;
      relatedUrl: string | null;
      template: NewsletterTemplate;
    }
  | { ok: false; error: string; fieldErrors?: NewsletterSendFieldErrors } {
  const subject = input.subject.trim();
  const message = input.message.trim();
  const relatedUrl = normalizeOptionalRelatedUrl(input.relatedUrl ?? "");
  const recipientEmail = input.recipientEmail?.trim().toLowerCase() ?? "";
  const template = parseNewsletterTemplate(input.template);

  if (input.requireRecipient && !recipientEmail) {
    return {
      ok: false,
      error: "수신 이메일을 입력해 주세요.",
      fieldErrors: { recipientEmail: "수신 이메일을 입력해 주세요." },
    };
  }

  if (input.requireRecipient && !isValidNewsletterEmail(recipientEmail)) {
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

  if (subject.length > MAX_NEWSLETTER_SUBJECT_LENGTH) {
    return {
      ok: false,
      error: `제목은 ${MAX_NEWSLETTER_SUBJECT_LENGTH}자 이내로 입력해 주세요.`,
      fieldErrors: {
        subject: `제목은 ${MAX_NEWSLETTER_SUBJECT_LENGTH}자 이내로 입력해 주세요.`,
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

  if (message.length > MAX_NEWSLETTER_MESSAGE_LENGTH) {
    return {
      ok: false,
      error: `본문은 ${MAX_NEWSLETTER_MESSAGE_LENGTH}자 이내로 입력해 주세요.`,
      fieldErrors: {
        message: `본문은 ${MAX_NEWSLETTER_MESSAGE_LENGTH}자 이내로 입력해 주세요.`,
      },
    };
  }

  if (relatedUrl && !isValidNewsletterRelatedUrl(relatedUrl)) {
    return {
      ok: false,
      error: "관련 글 URL을 확인해 주세요.",
      fieldErrors: {
        relatedUrl: "http:// 또는 https://로 시작하는 주소를 입력해 주세요.",
      },
    };
  }

  if (
    input.template &&
    !NEWSLETTER_TEMPLATES.includes(input.template as NewsletterTemplate)
  ) {
    return {
      ok: false,
      error: "이메일 템플릿을 확인해 주세요.",
      fieldErrors: { template: "지원하지 않는 템플릿입니다." },
    };
  }

  return { ok: true, subject, message, relatedUrl, template };
}
