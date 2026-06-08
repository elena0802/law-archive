import { siteConfig } from "@/lib/site";

const TEST_FOOTER_LINE = "이 메일은 형사법 아카이브 뉴스레터 테스트 발송입니다.";
const NON_SUBSCRIBER_FOOTER_LINE =
  "테스트 수신자는 활성 구독자가 아니므로 수신 거부 링크가 포함되지 않았습니다.";

export type NewsletterEmailVariant = "test" | "broadcast";

export type NewsletterEmailContent = {
  subject: string;
  text: string;
  html: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function messageToHtmlParagraphs(message: string) {
  const paragraphs = message
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return "";
  }

  return paragraphs
    .map((paragraph) => {
      const lines = paragraph.split("\n").map((line) => escapeHtml(line));
      return `<p style="margin:0 0 1rem;line-height:1.7;">${lines.join("<br />")}</p>`;
    })
    .join("");
}

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

  const safeUrl = escapeHtml(trimmed);
  return `<p style="margin:1.5rem 0 0;line-height:1.7;"><a href="${safeUrl}" style="color:#1f1f1f;text-decoration:underline;">관련 글 보기</a></p>`;
}

function buildTestFooterText(unsubscribeUrl: string | null | undefined) {
  const lines = ["", siteConfig.name, "", TEST_FOOTER_LINE];

  if (unsubscribeUrl?.trim()) {
    lines.push("", "수신 거부하기:", unsubscribeUrl.trim());
  } else {
    lines.push(NON_SUBSCRIBER_FOOTER_LINE);
  }

  return lines;
}

function buildBroadcastFooterText(unsubscribeUrl: string) {
  return ["", siteConfig.name, "", "수신 거부하기:", unsubscribeUrl.trim()];
}

function buildTestFooterHtml(unsubscribeUrl: string | null | undefined) {
  const footerIntro = `<p style="margin:2rem 0 0.75rem;font-family:Georgia,'Times New Roman',serif;font-size:1rem;line-height:1.5;color:#1f1f1f;">${escapeHtml(siteConfig.name)}</p>`;

  if (unsubscribeUrl?.trim()) {
    const safeUrl = escapeHtml(unsubscribeUrl.trim());
    return [
      footerIntro,
      `<div style="margin-top:1.25rem;padding-top:1rem;border-top:1px solid #d9d9d9;">`,
      `<p style="margin:0 0 0.75rem;font-size:0.875rem;line-height:1.6;color:#4a4a4a;">${escapeHtml(TEST_FOOTER_LINE)}</p>`,
      `<p style="margin:0;font-size:0.9375rem;line-height:1.6;"><a href="${safeUrl}" style="font-weight:600;color:#1f1f1f;text-decoration:underline;">수신 거부하기</a></p>`,
      `</div>`,
    ].join("");
  }

  return [
    footerIntro,
    `<div style="margin-top:1.25rem;padding-top:1rem;border-top:1px solid #d9d9d9;">`,
    `<p style="margin:0 0 0.5rem;font-size:0.875rem;line-height:1.6;color:#4a4a4a;">${escapeHtml(TEST_FOOTER_LINE)}</p>`,
    `<p style="margin:0;font-size:0.875rem;line-height:1.6;color:#4a4a4a;">${escapeHtml(NON_SUBSCRIBER_FOOTER_LINE)}</p>`,
    `</div>`,
  ].join("");
}

function buildBroadcastFooterHtml(unsubscribeUrl: string) {
  const safeUrl = escapeHtml(unsubscribeUrl.trim());
  const footerIntro = `<p style="margin:2rem 0 0.75rem;font-family:Georgia,'Times New Roman',serif;font-size:1rem;line-height:1.5;color:#1f1f1f;">${escapeHtml(siteConfig.name)}</p>`;

  return [
    footerIntro,
    `<div style="margin-top:1.25rem;padding-top:1rem;border-top:1px solid #d9d9d9;">`,
    `<p style="margin:0;font-size:0.9375rem;line-height:1.6;"><a href="${safeUrl}" style="font-weight:600;color:#1f1f1f;text-decoration:underline;">수신 거부하기</a></p>`,
    `</div>`,
  ].join("");
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

  const textParts =
    variant === "broadcast"
      ? [
          trimmedMessage,
          ...buildRelatedUrlText(relatedUrl),
          ...buildBroadcastFooterText(unsubscribeUrl ?? ""),
        ]
      : [
          trimmedMessage,
          ...buildRelatedUrlText(relatedUrl),
          ...buildTestFooterText(unsubscribeUrl),
        ];

  const messageHtml = messageToHtmlParagraphs(trimmedMessage);
  const relatedHtml = buildRelatedUrlHtml(relatedUrl);
  const footerHtml =
    variant === "broadcast"
      ? buildBroadcastFooterHtml(unsubscribeUrl ?? "")
      : buildTestFooterHtml(unsubscribeUrl);

  return {
    subject: trimmedSubject,
    text: textParts.join("\n"),
    html: `<div style="max-width:36rem;font-family:'Helvetica Neue',Arial,sans-serif;font-size:1rem;color:#1f1f1f;">${messageHtml}${relatedHtml}${footerHtml}</div>`,
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
