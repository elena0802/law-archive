import { siteConfig } from "@/lib/site";

const TEST_FOOTER_LINE = "이 메일은 형사법 아카이브 뉴스레터 테스트 발송입니다.";

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

export function buildNewsletterTestEmailContent({
  subject,
  message,
  unsubscribeUrl,
}: {
  subject: string;
  message: string;
  unsubscribeUrl?: string | null;
}): NewsletterEmailContent {
  const trimmedMessage = message.trim();
  const textParts = [
    trimmedMessage,
    "",
    siteConfig.name,
    "",
    TEST_FOOTER_LINE,
  ];

  if (unsubscribeUrl?.trim()) {
    textParts.push("", `구독 해지: ${unsubscribeUrl.trim()}`);
  }

  const htmlParts = [
    messageToHtmlParagraphs(trimmedMessage),
    `<p style="margin:2rem 0 0.75rem;font-family:Georgia,'Times New Roman',serif;font-size:1rem;line-height:1.5;color:#1f1f1f;">${escapeHtml(siteConfig.name)}</p>`,
    `<p style="margin:0;font-size:0.875rem;line-height:1.6;color:#666;">${escapeHtml(TEST_FOOTER_LINE)}</p>`,
  ];

  if (unsubscribeUrl?.trim()) {
    const safeUrl = escapeHtml(unsubscribeUrl.trim());
    htmlParts.push(
      `<p style="margin:1rem 0 0;font-size:0.875rem;line-height:1.6;"><a href="${safeUrl}" style="color:#666;">구독 해지</a></p>`,
    );
  }

  return {
    subject: subject.trim(),
    text: textParts.join("\n"),
    html: `<div style="max-width:36rem;font-family:'Helvetica Neue',Arial,sans-serif;font-size:1rem;color:#1f1f1f;">${htmlParts.join("")}</div>`,
  };
}
