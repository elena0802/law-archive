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
    ` style="display:block;width:100%;max-width:100%;height:auto;border:0;margin:0 0 1.5rem;border-radius:2px;"`,
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

export function buildDigestButton(url: string, label: string) {
  const safeUrl = escapeNewsletterHtml(url);

  return [
    `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:1rem 0 0;border-collapse:separate;">`,
    `<tr>`,
    `<td style="background-color:#68462d;border-radius:4px;padding:12px 22px;">`,
    `<a href="${safeUrl}" ${digestExternalLinkAttrs()} style="display:inline-block;font-size:0.9375rem;font-weight:600;line-height:1.4;color:#f8f4ea;text-decoration:none;">`,
    escapeNewsletterHtml(label),
    `</a>`,
    `</td>`,
    `</tr>`,
    `</table>`,
  ].join("");
}

export function buildDigestSectionDivider() {
  return `<div style="margin:2.5rem 0;border-top:1px solid #d9cbb7;"></div>`;
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
      return `<p style="margin:0 0 1rem;line-height:1.75;color:#655d52;">${lines.join("<br />")}</p>`;
    })
    .join("");
}
