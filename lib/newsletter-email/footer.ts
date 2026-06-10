import { getNewsletterFromEmail } from "@/lib/newsletter-email/config";
import { escapeNewsletterHtml } from "@/lib/newsletter-email/html-utils";
import { getSiteOrigin, siteConfig } from "@/lib/site";

const TEST_FOOTER_LINE = "이 메일은 형사법 아카이브 뉴스레터 테스트 발송입니다.";
const NON_SUBSCRIBER_FOOTER_LINE =
  "테스트 수신자는 활성 구독자가 아니므로 수신 거부 링크가 포함되지 않았습니다.";

export type NewsletterEmailVariant = "test" | "broadcast";

export function buildNewsletterSiteUrl(siteOrigin = getSiteOrigin()) {
  return siteOrigin.replace(/\/$/, "");
}

export function buildTestFooterText(unsubscribeUrl: string | null | undefined) {
  const lines = ["", siteConfig.name, "", TEST_FOOTER_LINE];

  if (unsubscribeUrl?.trim()) {
    lines.push("", "수신 거부하기:", unsubscribeUrl.trim());
  } else {
    lines.push(NON_SUBSCRIBER_FOOTER_LINE);
  }

  return lines;
}

export function buildBroadcastFooterText(unsubscribeUrl: string) {
  return ["", siteConfig.name, "", "수신 거부하기:", unsubscribeUrl.trim()];
}

export function buildDigestFooterText({
  siteOrigin,
  unsubscribeUrl,
  variant,
}: {
  siteOrigin: string;
  unsubscribeUrl: string | null | undefined;
  variant: NewsletterEmailVariant;
}) {
  const siteUrl = buildNewsletterSiteUrl(siteOrigin);
  const fromEmail = getNewsletterFromEmail();
  const lines = [
    "",
    "—",
    siteConfig.name,
    siteUrl,
    "",
    `발신: ${siteConfig.name} <${fromEmail}>`,
  ];

  if (variant === "test") {
    lines.push("", TEST_FOOTER_LINE);
  }

  if (unsubscribeUrl?.trim()) {
    lines.push("", "구독 해지:", unsubscribeUrl.trim());
  } else if (variant === "test") {
    lines.push(NON_SUBSCRIBER_FOOTER_LINE);
  }

  return lines;
}

export function buildTestFooterHtml(unsubscribeUrl: string | null | undefined) {
  const footerIntro = `<p style="margin:2rem 0 0.75rem;font-family:Georgia,'Times New Roman',serif;font-size:1rem;line-height:1.5;color:#1d1a15;">${escapeNewsletterHtml(siteConfig.name)}</p>`;

  if (unsubscribeUrl?.trim()) {
    const safeUrl = escapeNewsletterHtml(unsubscribeUrl.trim());
    return [
      footerIntro,
      `<div style="margin-top:1.25rem;padding-top:1rem;border-top:1px solid #d9cbb7;">`,
      `<p style="margin:0 0 0.75rem;font-size:0.875rem;line-height:1.6;color:#655d52;">${escapeNewsletterHtml(TEST_FOOTER_LINE)}</p>`,
      `<p style="margin:0;font-size:0.9375rem;line-height:1.6;"><a href="${safeUrl}" style="font-weight:600;color:#68462d;text-decoration:underline;">수신 거부하기</a></p>`,
      `</div>`,
    ].join("");
  }

  return [
    footerIntro,
    `<div style="margin-top:1.25rem;padding-top:1rem;border-top:1px solid #d9cbb7;">`,
    `<p style="margin:0 0 0.5rem;font-size:0.875rem;line-height:1.6;color:#655d52;">${escapeNewsletterHtml(TEST_FOOTER_LINE)}</p>`,
    `<p style="margin:0;font-size:0.875rem;line-height:1.6;color:#655d52;">${escapeNewsletterHtml(NON_SUBSCRIBER_FOOTER_LINE)}</p>`,
    `</div>`,
  ].join("");
}

export function buildBroadcastFooterHtml(unsubscribeUrl: string) {
  const safeUrl = escapeNewsletterHtml(unsubscribeUrl.trim());
  const footerIntro = `<p style="margin:2rem 0 0.75rem;font-family:Georgia,'Times New Roman',serif;font-size:1rem;line-height:1.5;color:#1d1a15;">${escapeNewsletterHtml(siteConfig.name)}</p>`;

  return [
    footerIntro,
    `<div style="margin-top:1.25rem;padding-top:1rem;border-top:1px solid #d9cbb7;">`,
    `<p style="margin:0;font-size:0.9375rem;line-height:1.6;"><a href="${safeUrl}" style="font-weight:600;color:#68462d;text-decoration:underline;">수신 거부하기</a></p>`,
    `</div>`,
  ].join("");
}

export function buildDigestFooterHtml({
  siteOrigin,
  unsubscribeUrl,
  variant,
}: {
  siteOrigin: string;
  unsubscribeUrl: string | null | undefined;
  variant: NewsletterEmailVariant;
}) {
  const siteUrl = buildNewsletterSiteUrl(siteOrigin);
  const safeSiteUrl = escapeNewsletterHtml(siteUrl);
  const fromEmail = escapeNewsletterHtml(getNewsletterFromEmail());
  const curationUrl = escapeNewsletterHtml(`${siteUrl}/curation`);

  const visitLink = `<a href="${safeSiteUrl}" style="color:#68462d;text-decoration:underline;">${escapeNewsletterHtml(siteConfig.name)} 방문</a>`;
  const curationLink = `<a href="${curationUrl}" style="color:#68462d;text-decoration:underline;">요즘의 시선</a>`;

  let unsubscribeBlock = "";

  if (unsubscribeUrl?.trim()) {
    const safeUrl = escapeNewsletterHtml(unsubscribeUrl.trim());
    unsubscribeBlock = `<p style="margin:0.75rem 0 0;font-size:0.875rem;line-height:1.6;"><a href="${safeUrl}" style="color:#68462d;text-decoration:underline;">구독 해지</a></p>`;
  } else if (variant === "test") {
    unsubscribeBlock = `<p style="margin:0.75rem 0 0;font-size:0.875rem;line-height:1.6;color:#655d52;">${escapeNewsletterHtml(NON_SUBSCRIBER_FOOTER_LINE)}</p>`;
  }

  const testNote =
    variant === "test"
      ? `<p style="margin:0 0 0.75rem;font-size:0.8125rem;line-height:1.6;color:#655d52;">${escapeNewsletterHtml(TEST_FOOTER_LINE)}</p>`
      : "";

  return [
    `<div style="margin-top:2.5rem;padding-top:1.5rem;border-top:1px solid #d9cbb7;">`,
    testNote,
    `<p style="margin:0 0 0.5rem;font-family:Georgia,'Times New Roman',serif;font-size:1rem;line-height:1.5;color:#1d1a15;">${escapeNewsletterHtml(siteConfig.name)}</p>`,
    `<p style="margin:0 0 0.75rem;font-size:0.875rem;line-height:1.6;color:#655d52;">${visitLink} · ${curationLink}</p>`,
    unsubscribeBlock,
    `<p style="margin:1rem 0 0;font-size:0.8125rem;line-height:1.6;color:#655d52;">발신: ${escapeNewsletterHtml(siteConfig.name)} &lt;${fromEmail}&gt;</p>`,
    `</div>`,
  ].join("");
}

export function buildNewsletterFooterHtml(
  variant: NewsletterEmailVariant,
  unsubscribeUrl: string | null | undefined,
) {
  return variant === "broadcast"
    ? buildBroadcastFooterHtml(unsubscribeUrl ?? "")
    : buildTestFooterHtml(unsubscribeUrl);
}

export function buildNewsletterFooterText(
  variant: NewsletterEmailVariant,
  unsubscribeUrl: string | null | undefined,
) {
  return variant === "broadcast"
    ? buildBroadcastFooterText(unsubscribeUrl ?? "")
    : buildTestFooterText(unsubscribeUrl);
}
