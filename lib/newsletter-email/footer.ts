import { getNewsletterFromEmail } from "@/lib/newsletter-email/config";
import {
  DIGEST_COLORS,
  DIGEST_FONT_FAMILY,
  DIGEST_SPACING,
} from "@/lib/newsletter-email/digest-spacing";
import {
  digestExternalLinkAttrs,
  escapeNewsletterHtml,
} from "@/lib/newsletter-email/html-utils";
import { getSiteOrigin, siteConfig } from "@/lib/site";

const DIGEST_FOOTER_TAGLINE = "형사법, 사회, 기술에 대한 생각을 기록합니다.";

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
  const year = new Date().getFullYear();
  const lines = [
    "",
    "—",
    `© ${year} ${siteConfig.name}`,
    DIGEST_FOOTER_TAGLINE,
    "",
    `${siteConfig.name} 방문: ${siteUrl}`,
    `요즘의 시선: ${siteUrl}/curation`,
  ];

  if (variant === "test") {
    lines.push("", TEST_FOOTER_LINE);
  }

  if (unsubscribeUrl?.trim()) {
    lines.push("", "구독 해지:", unsubscribeUrl.trim());
  } else if (variant === "test") {
    lines.push(NON_SUBSCRIBER_FOOTER_LINE);
  }

  lines.push("", `발신: ${siteConfig.name} <${fromEmail}>`);

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

function digestFooterLink(url: string, label: string) {
  const safeUrl = escapeNewsletterHtml(url);
  return `<a href="${safeUrl}" ${digestExternalLinkAttrs()} style="font-family:${DIGEST_FONT_FAMILY};color:${DIGEST_COLORS.accent};text-decoration:underline;">${escapeNewsletterHtml(label)}</a>`;
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
  const fromEmail = escapeNewsletterHtml(getNewsletterFromEmail());
  const year = new Date().getFullYear();

  let unsubscribeBlock = "";

  if (unsubscribeUrl?.trim()) {
    unsubscribeBlock = `<p style="margin:0 0 0.75rem;font-family:${DIGEST_FONT_FAMILY};font-size:0.875rem;line-height:1.65;">${digestFooterLink(unsubscribeUrl.trim(), "구독 해지")}</p>`;
  } else if (variant === "test") {
    unsubscribeBlock = `<p style="margin:0 0 0.75rem;font-family:${DIGEST_FONT_FAMILY};font-size:0.875rem;line-height:1.65;color:${DIGEST_COLORS.inkMuted};">${escapeNewsletterHtml(NON_SUBSCRIBER_FOOTER_LINE)}</p>`;
  }

  const testNote =
    variant === "test"
      ? `<p style="margin:0 0 1rem;font-family:${DIGEST_FONT_FAMILY};font-size:0.8125rem;line-height:1.65;color:${DIGEST_COLORS.inkMuted};">${escapeNewsletterHtml(TEST_FOOTER_LINE)}</p>`
      : "";

  return [
    `<div style="margin-top:${DIGEST_SPACING.sectionYLarge};padding:${DIGEST_SPACING.footerPadding};background-color:${DIGEST_COLORS.footer};border-top:1px solid ${DIGEST_COLORS.line};font-family:${DIGEST_FONT_FAMILY};">`,
    `<div style="max-width:${DIGEST_SPACING.outerMaxWidth};margin:0 auto;">`,
    testNote,
    `<p style="margin:0 0 0.5rem;font-family:${DIGEST_FONT_FAMILY};font-size:0.875rem;line-height:1.65;color:${DIGEST_COLORS.inkMuted};">© ${year} ${escapeNewsletterHtml(siteConfig.name)}</p>`,
    `<p style="margin:0 0 1.25rem;font-family:${DIGEST_FONT_FAMILY};font-size:0.875rem;line-height:1.65;color:${DIGEST_COLORS.inkMuted};">${escapeNewsletterHtml(DIGEST_FOOTER_TAGLINE)}</p>`,
    `<p style="margin:0 0 0.5rem;font-family:${DIGEST_FONT_FAMILY};font-size:0.875rem;line-height:1.65;">${digestFooterLink(siteUrl, `${siteConfig.name} 방문`)}</p>`,
    `<p style="margin:0 0 0.75rem;font-family:${DIGEST_FONT_FAMILY};font-size:0.875rem;line-height:1.65;">${digestFooterLink(`${siteUrl}/curation`, "요즘의 시선")}</p>`,
    unsubscribeBlock,
    `<p style="margin:0;font-family:${DIGEST_FONT_FAMILY};font-size:0.8125rem;line-height:1.65;color:${DIGEST_COLORS.inkMuted};">발신: ${escapeNewsletterHtml(siteConfig.name)} &lt;${fromEmail}&gt;</p>`,
    `</div>`,
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
