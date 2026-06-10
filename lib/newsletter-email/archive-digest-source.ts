import "server-only";

import type { Essay, EssaySeries } from "@/lib/essays";
import { getAllEssays, getAllSeries } from "@/lib/essays";
import { getVisibleCurationItems } from "@/lib/curation/queries";
import { buildAiResearchTracks } from "@/lib/home-ai-research-tracks";
import type {
  ArchiveDigestAiNote,
  ArchiveDigestCurationItem,
  ArchiveDigestEssayCard,
} from "@/lib/newsletter/templates/archive-digest";

const CURATION_LIMIT = 3;

export type ArchiveDigestSourceData = {
  featuredEssay: ArchiveDigestEssayCard | null;
  curationItems: ArchiveDigestCurationItem[];
  aiResearchNote: ArchiveDigestAiNote | null;
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

function buildEssayCard(essay: Essay, siteOrigin: string): ArchiveDigestEssayCard {
  return {
    title: essay.title,
    description: essay.description,
    url: `${siteOrigin.replace(/\/$/, "")}/essays/${essay.slug}`,
  };
}

function resolveFeaturedEssay(
  essays: readonly Essay[],
  relatedUrl: string | null,
  siteOrigin: string,
): ArchiveDigestEssayCard | null {
  const trimmedUrl = relatedUrl?.trim();

  if (trimmedUrl) {
    const slug = extractEssaySlug(trimmedUrl);
    if (slug) {
      const essay = essays.find((item) => item.slug === slug);
      if (essay) {
        return buildEssayCard(essay, siteOrigin);
      }
    }

    return {
      title: "이번 글",
      description: "",
      url: trimmedUrl,
    };
  }

  const latestEssay = essays[0];
  return latestEssay ? buildEssayCard(latestEssay, siteOrigin) : null;
}

function resolveAiResearchNote(
  allSeries: readonly EssaySeries[],
  siteOrigin: string,
): ArchiveDigestAiNote | null {
  const tracks = buildAiResearchTracks(allSeries);
  const normalizedOrigin = siteOrigin.replace(/\/$/, "");

  for (const track of tracks) {
    const seriesSlug = track.href.replace(/^\/series\//, "");
    const series = allSeries.find((item) => item.slug === seriesSlug);

    if (!series || series.essays.length === 0) {
      continue;
    }

    const latestEssay = series.essays[0];

    return {
      title: latestEssay.title,
      description:
        latestEssay.description.trim() || track.description.join(" "),
      url: `${normalizedOrigin}/essays/${latestEssay.slug}`,
    };
  }

  return null;
}

export async function loadArchiveDigestSourceData(
  relatedUrl: string | null,
  siteOrigin: string,
): Promise<ArchiveDigestSourceData> {
  const [essays, curationItems, allSeries] = await Promise.all([
    getAllEssays(),
    getVisibleCurationItems(),
    getAllSeries(),
  ]);

  return {
    featuredEssay: resolveFeaturedEssay(essays, relatedUrl, siteOrigin),
    curationItems: curationItems.slice(0, CURATION_LIMIT).map((item) => ({
      title: item.title,
      type: item.type,
      source: item.source,
      professorNote: item.professorNote,
      url: item.url,
    })),
    aiResearchNote: resolveAiResearchNote(allSeries, siteOrigin),
  };
}
