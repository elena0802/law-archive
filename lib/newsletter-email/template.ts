import {
  buildNewsletterFooterHtml,
  buildNewsletterFooterText,
  type NewsletterEmailVariant,
} from "@/lib/newsletter-email/footer";
import {
  escapeNewsletterHtml,
  messageToHtmlParagraphs,
} from "@/lib/newsletter-email/html-utils";

export type { NewsletterEmailVariant } from "@/lib/newsletter-email/footer";

export type NewsletterEmailContent = {
  subject: string;
  text: string;
  html: string;
};

function buildRelatedUrlText(relatedUrl: string | null | undefined) {
  const trimmed = relatedUrl?.trim();
  if (!trimmed) {
    return [];
  }

  return ["", "관련 글:", trimmed];
}

function buildRelatedUrlHtml(relatedUrl: string | null | undefined) {
  const trimmed = relatedUrl?.trim();
  if (!trimmed) {
    return "";
  }

  const safeUrl = escapeNewsletterHtml(trimmed);
  return `<p style="margin:1.5rem 0 0;line-height:1.7;"><a href="${safeUrl}" style="color:#68462d;text-decoration:underline;">관련 글 보기</a></p>`;
}

export function buildNewsletterEmailContent({
  subject,
  message,
  unsubscribeUrl,
  relatedUrl,
  variant,
}: {
  subject: string;
  message: string;
  unsubscribeUrl?: string | null;
  relatedUrl?: string | null;
  variant: NewsletterEmailVariant;
}): NewsletterEmailContent {
  const trimmedMessage = message.trim();
  const trimmedSubject = subject.trim();

  const textParts = [
    trimmedMessage,
    ...buildRelatedUrlText(relatedUrl),
    ...buildNewsletterFooterText(variant, unsubscribeUrl),
  ];

  const messageHtml = messageToHtmlParagraphs(trimmedMessage);
  const relatedHtml = buildRelatedUrlHtml(relatedUrl);
  const footerHtml = buildNewsletterFooterHtml(variant, unsubscribeUrl);

  return {
    subject: trimmedSubject,
    text: textParts.join("\n"),
    html: `<div style="max-width:36rem;font-family:'Helvetica Neue',Arial,sans-serif;font-size:1rem;color:#1d1a15;">${messageHtml}${relatedHtml}${footerHtml}</div>`,
  };
}

export function buildNewsletterTestEmailContent({
  subject,
  message,
  unsubscribeUrl,
  relatedUrl,
}: {
  subject: string;
  message: string;
  unsubscribeUrl?: string | null;
  relatedUrl?: string | null;
}): NewsletterEmailContent {
  return buildNewsletterEmailContent({
    subject,
    message,
    unsubscribeUrl,
    relatedUrl,
    variant: "test",
  });
}
