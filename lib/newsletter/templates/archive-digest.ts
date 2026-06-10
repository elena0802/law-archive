import type { CurationType } from "@/lib/content/db-types";
import type { NewsletterEmailVariant } from "@/lib/newsletter-email/footer";
import { buildDigestFooterHtml, buildDigestFooterText } from "@/lib/newsletter-email/footer";
import {
  buildDigestCardImage,
  buildDigestClickableCard,
  escapeNewsletterHtml,
  messageToHtmlParagraphs,
} from "@/lib/newsletter-email/html-utils";
import type { NewsletterEmailContent } from "@/lib/newsletter-email/template";
import { CURATION_TYPE_LABELS } from "@/lib/curation/youtube";
import { siteConfig } from "@/lib/site";

const DIGEST_TAGLINE = "형사법, 사회, 기술에 대한 생각들";

export type ArchiveDigestEssayCard = {
  title: string;
  description: string;
  url: string;
  imageUrl?: string | null;
  imageAlt?: string;
};

export type ArchiveDigestCurationItem = {
  title: string;
  type: CurationType;
  source: string;
  professorNote: string;
  url: string;
  imageUrl?: string | null;
  imageAlt?: string;
};

export type ArchiveDigestAiNote = {
  title: string;
  description: string;
  url: string;
  imageUrl?: string | null;
  imageAlt?: string;
};

export type ArchiveDigestEmailInput = {
  subject: string;
  introMessage: string;
  featuredEssay: ArchiveDigestEssayCard | null;
  curationItems: readonly ArchiveDigestCurationItem[];
  aiResearchNote: ArchiveDigestAiNote | null;
  siteOrigin: string;
  unsubscribeUrl?: string | null;
  variant: NewsletterEmailVariant;
};

function sectionEyebrow(label: string) {
  return `<p style="margin:0 0 0.75rem;font-size:0.6875rem;letter-spacing:0.14em;text-transform:uppercase;color:#68462d;">${escapeNewsletterHtml(label)}</p>`;
}

function cardImageHtml(
  imageUrl: string | null | undefined,
  imageAlt: string | undefined,
  fallbackAlt: string,
) {
  if (!imageUrl?.trim()) {
    return undefined;
  }

  return buildDigestCardImage(imageUrl.trim(), imageAlt?.trim() || fallbackAlt);
}

function buildFeaturedEssayHtml(essay: ArchiveDigestEssayCard) {
  const description = essay.description.trim()
    ? `<p style="margin:0.75rem 0 0;font-size:0.9375rem;line-height:1.75;color:#655d52;">${escapeNewsletterHtml(essay.description)}</p>`
    : "";

  const bodyHtml = [
    `<h3 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:1.25rem;font-weight:400;line-height:1.4;color:#1d1a15;">${escapeNewsletterHtml(essay.title)}</h3>`,
    description,
  ].join("");

  return [
    sectionEyebrow("이번 글"),
    buildDigestClickableCard({
      url: essay.url,
      imageHtml: cardImageHtml(essay.imageUrl, essay.imageAlt, essay.title),
      bodyHtml,
      ctaLabel: "글 읽기 →",
    }),
  ].join("");
}

function buildFeaturedEssayText(essay: ArchiveDigestEssayCard) {
  const lines = ["", "이번 글", essay.title];
  if (essay.description.trim()) {
    lines.push(essay.description.trim());
  }
  lines.push(essay.url);
  return lines;
}

function buildCurationHtml(items: readonly ArchiveDigestCurationItem[]) {
  if (items.length === 0) {
    return "";
  }

  const cards = items
    .map((item) => {
      const typeLabel = CURATION_TYPE_LABELS[item.type];
      const source = item.source.trim()
        ? `<span style="color:#655d52;"> · ${escapeNewsletterHtml(item.source.trim())}</span>`
        : "";
      const note = item.professorNote.trim()
        ? `<p style="margin:0.75rem 0 0;font-size:0.9375rem;line-height:1.75;color:#655d52;">${escapeNewsletterHtml(item.professorNote.trim())}</p>`
        : "";

      const bodyHtml = [
        `<p style="margin:0;font-size:0.75rem;letter-spacing:0.08em;text-transform:uppercase;color:#68462d;">${escapeNewsletterHtml(typeLabel)}${source}</p>`,
        `<h3 style="margin:0.75rem 0 0;font-family:Georgia,'Times New Roman',serif;font-size:1.0625rem;font-weight:400;line-height:1.45;color:#1d1a15;">${escapeNewsletterHtml(item.title)}</h3>`,
        note,
      ].join("");

      return buildDigestClickableCard({
        url: item.url,
        imageHtml: cardImageHtml(item.imageUrl, item.imageAlt, item.title),
        bodyHtml,
        ctaLabel: "외부 링크 →",
      });
    })
    .join("");

  return [sectionEyebrow("요즘의 시선"), cards].join("");
}

function buildCurationText(items: readonly ArchiveDigestCurationItem[]) {
  if (items.length === 0) {
    return [];
  }

  const lines = ["", "요즘의 시선"];

  for (const item of items) {
    const typeLabel = CURATION_TYPE_LABELS[item.type];
    lines.push("", `[${typeLabel}] ${item.title}`);

    if (item.source.trim()) {
      lines.push(`출처: ${item.source.trim()}`);
    }

    if (item.professorNote.trim()) {
      lines.push(item.professorNote.trim());
    }

    lines.push(item.url);
  }

  return lines;
}

function buildAiNoteHtml(note: ArchiveDigestAiNote) {
  const description = note.description.trim()
    ? `<p style="margin:0.75rem 0 0;font-size:0.9375rem;line-height:1.75;color:#655d52;">${escapeNewsletterHtml(note.description)}</p>`
    : "";

  const bodyHtml = [
    `<h3 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:1.25rem;font-weight:400;line-height:1.4;color:#1d1a15;">${escapeNewsletterHtml(note.title)}</h3>`,
    description,
  ].join("");

  return [
    sectionEyebrow("AI 연구 노트"),
    buildDigestClickableCard({
      url: note.url,
      imageHtml: cardImageHtml(note.imageUrl, note.imageAlt, note.title),
      bodyHtml,
      ctaLabel: "연구 노트 보기 →",
    }),
  ].join("");
}

function buildAiNoteText(note: ArchiveDigestAiNote) {
  const lines = ["", "AI 연구 노트", note.title];
  if (note.description.trim()) {
    lines.push(note.description.trim());
  }
  lines.push(note.url);
  return lines;
}

export function buildArchiveDigestEmailContent(
  input: ArchiveDigestEmailInput,
): NewsletterEmailContent {
  const trimmedSubject = input.subject.trim();
  const trimmedIntro = input.introMessage.trim();

  const introHtml = trimmedIntro
    ? `<div style="margin:0 0 2rem;">${messageToHtmlParagraphs(trimmedIntro)}</div>`
    : "";

  const headerHtml = [
    `<div style="margin:0 0 2rem;padding-bottom:1.5rem;border-bottom:1px solid #d9cbb7;">`,
    `<p style="margin:0 0 0.5rem;font-size:0.6875rem;letter-spacing:0.18em;text-transform:uppercase;color:#68462d;">Archive Digest</p>`,
    `<h1 style="margin:0 0 0.75rem;font-family:Georgia,'Times New Roman',serif;font-size:1.75rem;font-weight:400;line-height:1.25;color:#1d1a15;">${escapeNewsletterHtml(siteConfig.name)}</h1>`,
    `<p style="margin:0;font-size:0.9375rem;line-height:1.7;color:#655d52;">${escapeNewsletterHtml(DIGEST_TAGLINE)}</p>`,
    `</div>`,
  ].join("");

  const featuredHtml = input.featuredEssay
    ? buildFeaturedEssayHtml(input.featuredEssay)
    : "";
  const curationHtml = buildCurationHtml(input.curationItems);
  const aiHtml = input.aiResearchNote ? buildAiNoteHtml(input.aiResearchNote) : "";

  const footerHtml = buildDigestFooterHtml({
    siteOrigin: input.siteOrigin,
    unsubscribeUrl: input.unsubscribeUrl,
    variant: input.variant,
  });

  const html = [
    `<div style="margin:0;padding:24px 16px;background-color:#f8f4ea;">`,
    `<div style="max-width:36rem;margin:0 auto;font-family:'Helvetica Neue',Arial,sans-serif;font-size:1rem;color:#1d1a15;">`,
    headerHtml,
    introHtml,
    featuredHtml,
    curationHtml,
    aiHtml,
    footerHtml,
    `</div>`,
    `</div>`,
  ].join("");

  const textParts = [
    siteConfig.name,
    DIGEST_TAGLINE,
    "",
    trimmedIntro,
    ...(input.featuredEssay ? buildFeaturedEssayText(input.featuredEssay) : []),
    ...buildCurationText(input.curationItems),
    ...(input.aiResearchNote ? buildAiNoteText(input.aiResearchNote) : []),
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
