import {
  DIGEST_COLORS,
  DIGEST_FONT_FAMILY,
  DIGEST_SPACING,
} from "@/lib/newsletter-email/digest-spacing";

export function escapeNewsletterHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const DIGEST_CARD_IMAGE_WIDTH = 560;
const DIGEST_CARD_IMAGE_HEIGHT = 315;

export function digestExternalLinkAttrs() {
  return `target="_blank" rel="noopener noreferrer"`;
}

const DIGEST_LIST_THUMB_WIDTH = 96;
const DIGEST_LIST_THUMB_HEIGHT = 72;

export function buildDigestHeroImage(imageUrl: string, alt: string) {
  const safeUrl = escapeNewsletterHtml(imageUrl);
  const safeAlt = escapeNewsletterHtml(alt);

  return [
    `<img`,
    ` src="${safeUrl}"`,
    ` alt="${safeAlt}"`,
    ` width="${DIGEST_CARD_IMAGE_WIDTH}"`,
    ` height="${DIGEST_CARD_IMAGE_HEIGHT}"`,
    ` style="display:block;width:100%;max-width:560px;height:auto;border:0;margin:0 0 1.5rem;border-radius:2px;"`,
    ` />`,
  ].join("");
}

export function buildDigestListThumbnail(imageUrl: string, alt: string) {
  const safeUrl = escapeNewsletterHtml(imageUrl);
  const safeAlt = escapeNewsletterHtml(alt);

  return [
    `<img`,
    ` src="${safeUrl}"`,
    ` alt="${safeAlt}"`,
    ` width="${DIGEST_LIST_THUMB_WIDTH}"`,
    ` height="${DIGEST_LIST_THUMB_HEIGHT}"`,
    ` style="display:block;width:${DIGEST_LIST_THUMB_WIDTH}px;max-width:100%;height:auto;border:0;border-radius:2px;"`,
    ` />`,
  ].join("");
}

export function buildDigestButton(url: string, label: string, centered = false) {
  const safeUrl = escapeNewsletterHtml(url);

  const button = [
    `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0;border-collapse:separate;">`,
    `<tr>`,
    `<td style="background-color:${DIGEST_COLORS.accent};border-radius:6px;padding:14px 28px;">`,
    `<a href="${safeUrl}" ${digestExternalLinkAttrs()} style="display:inline-block;font-family:${DIGEST_FONT_FAMILY};font-size:0.9375rem;font-weight:600;line-height:1.4;color:${DIGEST_COLORS.buttonText};text-decoration:none;">`,
    escapeNewsletterHtml(label),
    `</a>`,
    `</td>`,
    `</tr>`,
    `</table>`,
  ].join("");

  if (!centered) {
    return button;
  }

  return [
    `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:${DIGEST_SPACING.titleBelow} 0 0;border-collapse:collapse;">`,
    `<tr><td align="center" style="padding:0;">`,
    button,
    `</td></tr>`,
    `</table>`,
  ].join("");
}

export function buildDigestSectionDivider() {
  return `<div style="margin:${DIGEST_SPACING.dividerMargin};border-top:1px solid ${DIGEST_COLORS.line};font-size:0;line-height:0;">&nbsp;</div>`;
}

export function buildDigestProseWrap(innerHtml: string) {
  return `<div style="max-width:${DIGEST_SPACING.proseMaxWidth};margin:0 auto;">${innerHtml}</div>`;
}

export function buildDigestCtaSection({
  title,
  body,
  buttonUrl,
  buttonLabel,
  withTopDivider = true,
}: {
  title: string;
  body?: string;
  buttonUrl: string;
  buttonLabel: string;
  withTopDivider?: boolean;
}) {
  const bodyHtml = body?.trim()
    ? `<p style="margin:0 0 ${DIGEST_SPACING.titleBelow};font-family:${DIGEST_FONT_FAMILY};font-size:0.9375rem;line-height:1.75;color:${DIGEST_COLORS.inkMuted};">${escapeNewsletterHtml(body)}</p>`
    : "";

  const sectionMargin = withTopDivider
    ? `${DIGEST_SPACING.sectionY} 0`
    : `${DIGEST_SPACING.sectionY} 0 0`;

  return [
    withTopDivider ? buildDigestSectionDivider() : "",
    `<section style="margin:${sectionMargin};text-align:center;">`,
    `<h2 style="margin:0 0 ${bodyHtml ? DIGEST_SPACING.titleBelow : DIGEST_SPACING.titleBelow};font-family:${DIGEST_FONT_FAMILY};font-size:1.25rem;font-weight:600;line-height:1.35;color:${DIGEST_COLORS.ink};">${escapeNewsletterHtml(title)}</h2>`,
    bodyHtml,
    buildDigestButton(buttonUrl, buttonLabel, true),
    `</section>`,
  ].join("");
}

export function buildDigestTypeBadge(label: string) {
  return `<span style="display:inline-block;border:1px solid ${DIGEST_COLORS.line};background-color:${DIGEST_COLORS.page};padding:3px 8px;font-family:${DIGEST_FONT_FAMILY};font-size:0.6875rem;letter-spacing:0.1em;text-transform:uppercase;color:${DIGEST_COLORS.accent};">${escapeNewsletterHtml(label)}</span>`;
}

export function buildDigestCardImage(imageUrl: string, alt: string) {
  const safeUrl = escapeNewsletterHtml(imageUrl);
  const safeAlt = escapeNewsletterHtml(alt);

  return [
    `<img`,
    ` src="${safeUrl}"`,
    ` alt="${safeAlt}"`,
    ` width="${DIGEST_CARD_IMAGE_WIDTH}"`,
    ` height="${DIGEST_CARD_IMAGE_HEIGHT}"`,
    ` style="display:block;width:100%;max-width:100%;height:auto;border:0;margin:0;line-height:0;"`,
    ` />`,
  ].join("");
}

export function buildDigestClickableCard({
  url,
  imageHtml,
  bodyHtml,
  ctaLabel,
}: {
  url: string;
  imageHtml?: string;
  bodyHtml: string;
  ctaLabel: string;
}) {
  const safeUrl = escapeNewsletterHtml(url);
  const imageRow = imageHtml
    ? `<tr><td style="padding:0;line-height:0;font-size:0;background-color:#e8dfd0;">${imageHtml}</td></tr>`
    : "";

  return [
    `<a href="${safeUrl}" ${digestExternalLinkAttrs()} style="display:block;text-decoration:none;color:inherit;">`,
    `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 1rem;border-collapse:separate;border:1px solid #d9cbb7;background-color:#efe7d8;">`,
    imageRow,
    `<tr><td style="padding:1.25rem 1.25rem 1.125rem;">`,
    bodyHtml,
    `<p style="margin:1rem 0 0;font-size:0.9375rem;line-height:1.6;color:#68462d;font-weight:600;">${escapeNewsletterHtml(ctaLabel)}</p>`,
    `</td></tr>`,
    `</table>`,
    `</a>`,
  ].join("");
}

export function messageToHtmlParagraphs(message: string) {
  const paragraphs = message
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return "";
  }

  return paragraphs
    .map((paragraph) => {
      const lines = paragraph.split("\n").map((line) => escapeNewsletterHtml(line));
      return `<p style="margin:0 0 1.125rem;font-family:${DIGEST_FONT_FAMILY};line-height:1.8;color:${DIGEST_COLORS.inkMuted};">${lines.join("<br />")}</p>`;
    })
    .join("");
}
