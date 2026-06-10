import type { CurationType } from "@/lib/content/db-types";
import { formatCurationDate } from "@/lib/curation/types";
import type { NewsletterEmailVariant } from "@/lib/newsletter-email/footer";
import { buildDigestFooterHtml, buildDigestFooterText } from "@/lib/newsletter-email/footer";
import {
  buildDigestButton,
  buildDigestHeroImage,
  buildDigestListThumbnail,
  buildDigestSectionDivider,
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

function sectionTitle(title: string) {
  return `<h2 style="margin:0 0 1rem;font-family:Georgia,'Times New Roman',serif;font-size:1.25rem;font-weight:400;line-height:1.35;color:#1d1a15;">${escapeNewsletterHtml(title)}</h2>`;
}

function buildHeaderHtml() {
  return [
    `<div style="margin:0 0 2rem;padding-bottom:1.5rem;border-bottom:1px solid #d9cbb7;">`,
    `<p style="margin:0 0 0.5rem;font-size:0.6875rem;letter-spacing:0.18em;text-transform:uppercase;color:#68462d;">Archive Digest</p>`,
    `<h1 style="margin:0 0 0.75rem;font-family:Georgia,'Times New Roman',serif;font-size:1.75rem;font-weight:400;line-height:1.25;color:#1d1a15;">${escapeNewsletterHtml(siteConfig.name)}</h1>`,
    `<p style="margin:0;font-size:0.9375rem;line-height:1.7;color:#655d52;">${escapeNewsletterHtml(DIGEST_TAGLINE)}</p>`,
    `</div>`,
  ].join("");
}

function buildIntroHtml(introMessage: string) {
  const trimmed = introMessage.trim();
  const intro = trimmed || DEFAULT_DIGEST_INTRO;
  return `<div style="margin:0 0 2rem;">${messageToHtmlParagraphs(intro)}</div>`;
}

function buildMainEssayHtml(essay: ArchiveDigestMainEssay) {
  const heroImage = essay.imageUrl?.trim()
    ? buildDigestHeroImage(essay.imageUrl.trim(), essay.imageAlt?.trim() || essay.title)
    : "";

  const description = essay.description.trim()
    ? `<p style="margin:0 0 1.5rem;font-size:1.0625rem;line-height:1.8;color:#655d52;">${escapeNewsletterHtml(essay.description)}</p>`
    : "";

  const bodyHtml = essay.bodyHtml.trim()
    ? `<div style="margin:0 0 1.5rem;">${essay.bodyHtml}</div>`
    : description
      ? ""
      : `<p style="margin:0 0 1.5rem;font-size:1rem;line-height:1.8;color:#655d52;">아카이브에서 전체 글을 읽어 보세요.</p>`;

  const readOnArchiveLink = [
    `<p style="margin:1.5rem 0 0;font-size:0.9375rem;line-height:1.6;">`,
    `<a href="${escapeNewsletterHtml(essay.url)}" ${digestExternalLinkAttrs()} style="color:#68462d;font-weight:600;text-decoration:underline;">`,
    `아카이브에서 글 보기 →`,
    `</a>`,
    `</p>`,
  ].join("");

  return [
    `<article style="margin:0 0 0.5rem;">`,
    `<h2 style="margin:0 0 1.25rem;font-family:Georgia,'Times New Roman',serif;font-size:1.625rem;font-weight:400;line-height:1.3;color:#1d1a15;">${escapeNewsletterHtml(essay.title)}</h2>`,
    heroImage,
    description,
    bodyHtml,
    readOnArchiveLink,
    `</article>`,
  ].join("");
}

function buildFeedbackSectionHtml(essay: ArchiveDigestMainEssay) {
  return [
    buildDigestSectionDivider(),
    `<section style="margin:0;">`,
    sectionTitle("이번 글은 어떠셨나요?"),
    buildDigestButton(essay.commentsUrl, "댓글 보러가기"),
    `</section>`,
  ].join("");
}

function buildShareSectionHtml(siteOrigin: string) {
  return [
    buildDigestSectionDivider(),
    `<section style="margin:0;">`,
    sectionTitle(SHARE_SECTION_TITLE),
    `<p style="margin:0;font-size:0.9375rem;line-height:1.75;color:#655d52;">${escapeNewsletterHtml(SHARE_SECTION_BODY)}</p>`,
    buildDigestButton(buildShareUrl(siteOrigin), "아카이브 공유하기"),
    `</section>`,
  ].join("");
}

function buildCurationListHtml(items: readonly ArchiveDigestCurationItem[]) {
  if (items.length === 0) {
    return "";
  }

  const rows = items
    .map((item, index) => {
      const typeLabel = CURATION_TYPE_LABELS[item.type];
      const metaParts = [
        formatCurationDate(item.recommendedAt),
        typeLabel,
        item.source.trim() || null,
      ].filter(Boolean);
      const meta = metaParts.join(" · ");
      const note = item.professorNote.trim()
        ? `<p style="margin:0.5rem 0 0;font-size:0.875rem;line-height:1.7;color:#655d52;">${escapeNewsletterHtml(item.professorNote.trim())}</p>`
        : "";
      const thumb = item.imageUrl?.trim()
        ? `<td width="96" valign="top" style="padding-left:12px;width:96px;">${buildDigestListThumbnail(item.imageUrl.trim(), item.imageAlt?.trim() || item.title)}</td>`
        : "";

      const borderTop =
        index === 0 ? "" : "border-top:1px solid #d9cbb7;padding-top:1.25rem;";

      return [
        `<a href="${escapeNewsletterHtml(item.url)}" ${digestExternalLinkAttrs()} style="display:block;text-decoration:none;color:inherit;">`,
        `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 1.25rem;border-collapse:collapse;${borderTop}">`,
        `<tr>`,
        `<td valign="top" style="padding:0;">`,
        `<p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:1.0625rem;line-height:1.45;color:#1d1a15;">${escapeNewsletterHtml(item.title)}</p>`,
        `<p style="margin:0.5rem 0 0;font-size:0.8125rem;line-height:1.6;color:#68462d;">${escapeNewsletterHtml(meta)}</p>`,
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
    `<section style="margin:0;">`,
    `<p style="margin:0 0 1.25rem;font-size:0.6875rem;letter-spacing:0.14em;text-transform:uppercase;color:#68462d;">요즘의 시선</p>`,
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
      item.title,
      `${formatCurationDate(item.recommendedAt)} · ${typeLabel}${item.source.trim() ? ` · ${item.source.trim()}` : ""}`,
    );

    if (item.professorNote.trim()) {
      lines.push(item.professorNote.trim());
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
    `<div style="margin:0;padding:24px 16px;background-color:#f8f4ea;">`,
    `<div style="max-width:36rem;margin:0 auto;font-family:'Helvetica Neue',Arial,sans-serif;font-size:1rem;color:#1d1a15;">`,
    buildHeaderHtml(),
    buildIntroHtml(trimmedIntro),
    mainEssayHtml,
    feedbackHtml,
    shareHtml,
    curationHtml,
    footerHtml,
    `</div>`,
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
