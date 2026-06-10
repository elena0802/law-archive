import type { CurationType } from "@/lib/content/db-types";
import { formatCurationDate } from "@/lib/curation/types";
import type { NewsletterEmailVariant } from "@/lib/newsletter-email/footer";
import { buildDigestFooterHtml, buildDigestFooterText } from "@/lib/newsletter-email/footer";
import {
  DIGEST_BRAND_FONT_FAMILY,
  DIGEST_COLORS,
  DIGEST_FONT_FAMILY,
  DIGEST_SPACING,
} from "@/lib/newsletter-email/digest-spacing";
import {
  buildDigestCtaSection,
  buildDigestHeroImage,
  buildDigestListThumbnail,
  buildDigestProseWrap,
  buildDigestSectionDivider,
  buildDigestTypeBadge,
  digestExternalLinkAttrs,
  escapeNewsletterHtml,
  messageToHtmlParagraphs,
} from "@/lib/newsletter-email/html-utils";
import type { NewsletterEmailContent } from "@/lib/newsletter-email/template";
import { CURATION_TYPE_LABELS } from "@/lib/curation/youtube";
import { siteConfig } from "@/lib/site";

const DIGEST_TAGLINE = "형사법, 사회, 기술에 대한 생각들";
const DEFAULT_DIGEST_INTRO =
  "이번 호에서는 형사법 아카이브의 글 하나를 소개합니다.";
const SHARE_SECTION_TITLE = "형사법 아카이브 주변에 소개하기";
const SHARE_SECTION_BODY =
  "형사법, 사회, 기술에 대한 생각을 함께 읽고 싶은 분들께 아카이브를 소개해 주세요.";

export type ArchiveDigestMainEssay = {
  title: string;
  description: string;
  url: string;
  commentsUrl: string;
  bodyHtml: string;
  bodyText: string;
  imageUrl?: string | null;
  imageAlt?: string;
};

export type ArchiveDigestCurationItem = {
  title: string;
  type: CurationType;
  source: string;
  professorNote: string;
  recommendedAt: string;
  url: string;
  imageUrl?: string | null;
  imageAlt?: string;
};

export type ArchiveDigestEmailInput = {
  subject: string;
  introMessage: string;
  featuredEssay: ArchiveDigestMainEssay | null;
  curationItems: readonly ArchiveDigestCurationItem[];
  siteOrigin: string;
  unsubscribeUrl?: string | null;
  variant: NewsletterEmailVariant;
};

function buildShareUrl(siteOrigin: string) {
  return `${siteOrigin.replace(/\/$/, "")}/#home-newsletter-heading`;
}

function buildHeaderHtml() {
  return [
    `<header style="margin:0 0 ${DIGEST_SPACING.sectionY};padding-bottom:${DIGEST_SPACING.sectionY};border-bottom:1px solid ${DIGEST_COLORS.line};">`,
    `<p style="margin:0 0 0.625rem;font-family:${DIGEST_FONT_FAMILY};font-size:0.6875rem;letter-spacing:0.18em;text-transform:uppercase;color:${DIGEST_COLORS.accent};">Archive Digest</p>`,
    `<h1 style="margin:0 0 0.875rem;font-family:${DIGEST_BRAND_FONT_FAMILY};font-size:2.05rem;font-weight:400;line-height:1.22;color:${DIGEST_COLORS.ink};">${escapeNewsletterHtml(siteConfig.name)}</h1>`,
    `<p style="margin:0;font-family:${DIGEST_FONT_FAMILY};font-size:0.9375rem;line-height:1.75;color:${DIGEST_COLORS.inkMuted};">${escapeNewsletterHtml(DIGEST_TAGLINE)}</p>`,
    `</header>`,
  ].join("");
}

function buildIntroHtml(introMessage: string) {
  const trimmed = introMessage.trim();
  const intro = trimmed || DEFAULT_DIGEST_INTRO;
  return `<div style="margin:0 0 ${DIGEST_SPACING.sectionY};">${buildDigestProseWrap(messageToHtmlParagraphs(intro))}</div>`;
}

function buildMainEssayHtml(essay: ArchiveDigestMainEssay) {
  const heroImage = essay.imageUrl?.trim()
    ? buildDigestHeroImage(essay.imageUrl.trim(), essay.imageAlt?.trim() || essay.title)
    : "";

  const description = essay.description.trim()
    ? `<p style="margin:0 0 1.25rem;font-family:${DIGEST_FONT_FAMILY};font-size:1.0625rem;line-height:1.85;color:${DIGEST_COLORS.inkMuted};">${escapeNewsletterHtml(essay.description)}</p>`
    : "";

  const bodyHtml = essay.bodyHtml.trim()
    ? `<div style="margin:0;">${essay.bodyHtml}</div>`
    : description
      ? ""
      : `<p style="margin:0;font-family:${DIGEST_FONT_FAMILY};font-size:1rem;line-height:1.85;color:${DIGEST_COLORS.inkMuted};">아카이브에서 전체 글을 읽어 보세요.</p>`;

  const readOnArchiveLink = [
    `<p style="margin:1.5rem 0 0;font-family:${DIGEST_FONT_FAMILY};font-size:0.9375rem;line-height:1.65;">`,
    `<a href="${escapeNewsletterHtml(essay.url)}" ${digestExternalLinkAttrs()} style="font-family:${DIGEST_FONT_FAMILY};color:${DIGEST_COLORS.accent};font-weight:600;text-decoration:underline;">`,
    `아카이브에서 글 보기 →`,
    `</a>`,
    `</p>`,
  ].join("");

  const proseContent = [description, bodyHtml, readOnArchiveLink].join("");

  return [
    `<article style="margin:0 0 ${DIGEST_SPACING.sectionY};">`,
    heroImage,
    `<h2 style="margin:0 0 1.25rem;font-family:${DIGEST_FONT_FAMILY};font-size:1.625rem;font-weight:600;line-height:1.32;color:${DIGEST_COLORS.ink};">${escapeNewsletterHtml(essay.title)}</h2>`,
    buildDigestProseWrap(proseContent),
    `</article>`,
  ].join("");
}

function buildFeedbackSectionHtml(essay: ArchiveDigestMainEssay) {
  return buildDigestCtaSection({
    title: "이번 글은 어떠셨나요?",
    buttonUrl: essay.commentsUrl,
    buttonLabel: "댓글 보러가기",
    withTopDivider: true,
  });
}

function buildShareSectionHtml(siteOrigin: string) {
  return buildDigestCtaSection({
    title: SHARE_SECTION_TITLE,
    body: SHARE_SECTION_BODY,
    buttonUrl: buildShareUrl(siteOrigin),
    buttonLabel: "아카이브 공유하기",
    withTopDivider: false,
  });
}

function truncateNote(note: string, maxLength = 140) {
  const trimmed = note.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return `${trimmed.slice(0, maxLength).trimEnd()}…`;
}

function buildCurationListHtml(items: readonly ArchiveDigestCurationItem[]) {
  if (items.length === 0) {
    return "";
  }

  const rows = items
    .map((item, index) => {
      const typeLabel = CURATION_TYPE_LABELS[item.type];
      const sourceDateParts = [
        item.source.trim() || null,
        formatCurationDate(item.recommendedAt),
      ].filter(Boolean);
      const sourceDate = sourceDateParts.join(" · ");
      const note = item.professorNote.trim()
        ? `<p style="margin:0.625rem 0 0;font-family:${DIGEST_FONT_FAMILY};font-size:0.875rem;line-height:1.7;color:${DIGEST_COLORS.inkMuted};max-height:3.4em;overflow:hidden;">${escapeNewsletterHtml(truncateNote(item.professorNote))}</p>`
        : "";
      const thumb = item.imageUrl?.trim()
        ? `<td width="96" valign="top" style="padding-left:14px;width:96px;">${buildDigestListThumbnail(item.imageUrl.trim(), item.imageAlt?.trim() || item.title)}</td>`
        : "";

      const itemSpacing =
        index === 0
          ? `padding:0 0 ${DIGEST_SPACING.listItemGap};`
          : `padding:${DIGEST_SPACING.listItemGap} 0;border-top:1px solid ${DIGEST_COLORS.line};`;

      return [
        `<a href="${escapeNewsletterHtml(item.url)}" ${digestExternalLinkAttrs()} style="display:block;text-decoration:none;color:inherit;">`,
        `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0;border-collapse:collapse;${itemSpacing}">`,
        `<tr>`,
        `<td valign="top" style="padding:0;">`,
        `<p style="margin:0;">${buildDigestTypeBadge(typeLabel)}</p>`,
        `<p style="margin:0.5rem 0 0;font-family:${DIGEST_FONT_FAMILY};font-size:0.8125rem;line-height:1.6;color:${DIGEST_COLORS.accent};">${escapeNewsletterHtml(sourceDate)}</p>`,
        `<p style="margin:0.625rem 0 0;font-family:${DIGEST_FONT_FAMILY};font-size:1.0625rem;font-weight:600;line-height:1.45;color:${DIGEST_COLORS.ink};">${escapeNewsletterHtml(item.title)}</p>`,
        note,
        `</td>`,
        thumb,
        `</tr>`,
        `</table>`,
        `</a>`,
      ].join("");
    })
    .join("");

  return [
    buildDigestSectionDivider(),
    `<section style="margin:${DIGEST_SPACING.sectionY} 0 0;">`,
    `<p style="margin:0 0 ${DIGEST_SPACING.titleBelow};font-family:${DIGEST_FONT_FAMILY};font-size:0.6875rem;letter-spacing:0.14em;text-transform:uppercase;color:${DIGEST_COLORS.accent};">요즘의 시선</p>`,
    rows,
    `</section>`,
  ].join("");
}

function buildMainEssayText(essay: ArchiveDigestMainEssay) {
  const lines = ["", essay.title];

  if (essay.description.trim()) {
    lines.push(essay.description.trim());
  }

  if (essay.bodyText.trim()) {
    lines.push("", essay.bodyText.trim());
  }

  lines.push("", essay.url);
  return lines;
}

function buildCurationText(items: readonly ArchiveDigestCurationItem[]) {
  if (items.length === 0) {
    return [];
  }

  const lines = ["", "요즘의 시선"];

  for (const item of items) {
    const typeLabel = CURATION_TYPE_LABELS[item.type];
    lines.push(
      "",
      `[${typeLabel}]`,
      `${item.source.trim() ? `${item.source.trim()} · ` : ""}${formatCurationDate(item.recommendedAt)}`,
      item.title,
    );

    if (item.professorNote.trim()) {
      lines.push(truncateNote(item.professorNote));
    }

    lines.push(item.url);
  }

  return lines;
}

export function buildArchiveDigestEmailContent(
  input: ArchiveDigestEmailInput,
): NewsletterEmailContent {
  const trimmedSubject = input.subject.trim();
  const trimmedIntro = input.introMessage.trim();
  const introForText = trimmedIntro || DEFAULT_DIGEST_INTRO;

  const mainEssayHtml = input.featuredEssay
    ? buildMainEssayHtml(input.featuredEssay)
    : "";
  const feedbackHtml = input.featuredEssay
    ? buildFeedbackSectionHtml(input.featuredEssay)
    : "";
  const shareHtml = buildShareSectionHtml(input.siteOrigin);
  const curationHtml = buildCurationListHtml(input.curationItems);

  const footerHtml = buildDigestFooterHtml({
    siteOrigin: input.siteOrigin,
    unsubscribeUrl: input.unsubscribeUrl,
    variant: input.variant,
  });

  const html = [
    `<div style="margin:0;padding:24px 16px;background-color:${DIGEST_COLORS.page};">`,
    `<div style="max-width:${DIGEST_SPACING.outerMaxWidth};margin:0 auto;font-family:${DIGEST_FONT_FAMILY};font-size:1rem;color:${DIGEST_COLORS.ink};">`,
    buildHeaderHtml(),
    buildIntroHtml(trimmedIntro),
    mainEssayHtml,
    feedbackHtml,
    shareHtml,
    curationHtml,
    `</div>`,
    footerHtml,
    `</div>`,
  ].join("");

  const textParts = [
    siteConfig.name,
    DIGEST_TAGLINE,
    "",
    introForText,
    ...(input.featuredEssay ? buildMainEssayText(input.featuredEssay) : []),
    "",
    "이번 글은 어떠셨나요?",
    input.featuredEssay?.commentsUrl ?? "",
    "",
    SHARE_SECTION_TITLE,
    SHARE_SECTION_BODY,
    buildShareUrl(input.siteOrigin),
    ...buildCurationText(input.curationItems),
    ...buildDigestFooterText({
      siteOrigin: input.siteOrigin,
      unsubscribeUrl: input.unsubscribeUrl,
      variant: input.variant,
    }),
  ].filter((line) => line !== undefined);

  return {
    subject: trimmedSubject,
    text: textParts.join("\n"),
    html,
  };
}
