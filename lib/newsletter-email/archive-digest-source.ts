import "server-only";

import type { Essay } from "@/lib/essays";
import { getAllEssays, getEssayBySlug } from "@/lib/essays";
import { getVisibleCurationItems } from "@/lib/curation/queries";
import { getEssayCoverImage } from "@/lib/essay-cover-image";
import {
  essayBodyToEmailHtml,
  essayBodyToPlainText,
} from "@/lib/newsletter-email/essay-body-html";
import { toDigestAbsoluteImageUrl } from "@/lib/newsletter-email/digest-images";
import type {
  ArchiveDigestCurationItem,
  ArchiveDigestMainEssay,
} from "@/lib/newsletter/templates/archive-digest";

const CURATION_LIMIT = 3;

export type ArchiveDigestSourceData = {
  featuredEssay: ArchiveDigestMainEssay | null;
  curationItems: ArchiveDigestCurationItem[];
};

function extractEssaySlug(url: string) {
  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/^\/essays\/([^/]+)\/?$/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

function buildMainEssay(essay: Essay, siteOrigin: string): ArchiveDigestMainEssay {
  const normalizedOrigin = siteOrigin.replace(/\/$/, "");
  const url = `${normalizedOrigin}/essays/${essay.slug}`;
  const cover = getEssayCoverImage(essay);

  return {
    title: essay.title,
    description: essay.description,
    url,
    commentsUrl: `${url}#essay-comments-heading`,
    bodyHtml: essayBodyToEmailHtml(essay.content, siteOrigin),
    bodyText: essayBodyToPlainText(essay.content),
    imageUrl: cover.src
      ? toDigestAbsoluteImageUrl(cover.src, siteOrigin)
      : null,
    imageAlt: cover.alt,
  };
}

async function resolveFeaturedEssay(
  essays: readonly Essay[],
  relatedUrl: string | null,
  siteOrigin: string,
): Promise<ArchiveDigestMainEssay | null> {
  const trimmedUrl = relatedUrl?.trim();

  if (trimmedUrl) {
    const slug = extractEssaySlug(trimmedUrl);
    if (slug) {
      const essay = await getEssayBySlug(slug);
      if (essay && !essay.draft) {
        return buildMainEssay(essay, siteOrigin);
      }
    }

    return {
      title: "이번 글",
      description: "",
      url: trimmedUrl,
      commentsUrl: trimmedUrl,
      bodyHtml: "",
      bodyText: "",
      imageUrl: null,
      imageAlt: "이번 글",
    };
  }

  const latestEssay = essays[0];
  if (!latestEssay) {
    return null;
  }

  const essay = (await getEssayBySlug(latestEssay.slug)) ?? latestEssay;
  return buildMainEssay(essay, siteOrigin);
}

export async function loadArchiveDigestSourceData(
  relatedUrl: string | null,
  siteOrigin: string,
): Promise<ArchiveDigestSourceData> {
  const [essays, curationItems] = await Promise.all([
    getAllEssays(),
    getVisibleCurationItems(),
  ]);

  return {
    featuredEssay: await resolveFeaturedEssay(essays, relatedUrl, siteOrigin),
    curationItems: curationItems.slice(0, CURATION_LIMIT).map((item) => ({
      title: item.title,
      type: item.type,
      source: item.source,
      professorNote: item.professorNote,
      recommendedAt: item.recommendedAt,
      url: item.url,
      imageUrl: toDigestAbsoluteImageUrl(item.thumbnailUrl, siteOrigin),
      imageAlt: item.title,
    })),
  };
}
