import type { Metadata } from "next";
import { HomeHero } from "@/components/home-hero";
import { HomeAiNotes } from "@/components/home/home-ai-notes";
import { HomeCurationPreview } from "@/components/home/home-curation-preview";
import { HomeFeaturedSeries } from "@/components/home/home-featured-series";
import { HomeNewsletter } from "@/components/home/home-newsletter";
import { HomeRecentWriting } from "@/components/home/home-recent-writing";
import { HomeResearchArchiveSummary } from "@/components/home/home-research-archive-summary";
import { Section } from "@/components/section";
import { getAllEssays, getAllSeries, getFeaturedSeries } from "@/lib/essays";
import { buildAiResearchTracks } from "@/lib/home-ai-research-tracks";
import {
  getFeaturedYoutubeCuration,
  getHomeCurationLinks,
} from "@/lib/curation/queries";
import { buildDefaultOpenGraphImages } from "@/lib/seo";
import { scholarTitle, siteConfig } from "@/lib/site";
import { researchItems } from "@/src/data/research";
import {
  getResearchSummaryStats,
  sortByPublicationNumber,
} from "@/src/lib/research";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const homeTitle = `${scholarTitle} | ${siteConfig.name}`;

export const metadata: Metadata = {
  title: { absolute: homeTitle },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: homeTitle,
    description: siteConfig.description,
    url: "/",
    locale: "ko_KR",
    siteName: siteConfig.name,
    images: buildDefaultOpenGraphImages(),
  },
};

const RECENT_ESSAY_COUNT = 3;
const REPRESENTATIVE_RESEARCH_PREVIEW_COUNT = 3;

const HOME_SECTION_CLASS =
  "border-t border-line !py-[clamp(4.75rem,10vw,9.5rem)]";

export default async function Home() {
  const [allSeries, essays, featuredSeries, featuredYoutube] = await Promise.all([
    getAllSeries(),
    getAllEssays(),
    getFeaturedSeries(),
    getFeaturedYoutubeCuration(),
  ]);
  const curationLinks = await getHomeCurationLinks(featuredYoutube?.id, 3);

  const recentEssays = essays.slice(0, RECENT_ESSAY_COUNT);
  const representativeResearchPreview = sortByPublicationNumber(researchItems)
    .filter((item) => item.isRepresentative)
    .slice(0, REPRESENTATIVE_RESEARCH_PREVIEW_COUNT);
  const researchStats = getResearchSummaryStats(researchItems);
  const aiResearchTracks = buildAiResearchTracks(allSeries);

  return (
    <>
      <HomeHero />

      <Section size="wide" className={HOME_SECTION_CLASS}>
        <HomeRecentWriting essays={recentEssays} />
      </Section>

      <Section size="wide" className={HOME_SECTION_CLASS}>
        <HomeCurationPreview
          featuredYoutube={featuredYoutube}
          links={curationLinks}
        />
      </Section>

      <Section
        size="wide"
        className={`${HOME_SECTION_CLASS} border-y border-line/70 bg-paper-muted/45`}
      >
        <HomeAiNotes tracks={aiResearchTracks} />
      </Section>

      <Section size="wide" className={HOME_SECTION_CLASS}>
        <HomeFeaturedSeries series={featuredSeries} />
      </Section>

      <Section size="reading" className={HOME_SECTION_CLASS}>
        <HomeResearchArchiveSummary
          previewItems={representativeResearchPreview}
          stats={researchStats}
        />
      </Section>

      <Section size="reading" className={HOME_SECTION_CLASS}>
        <HomeNewsletter />
      </Section>
    </>
  );
}
