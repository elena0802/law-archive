import type { Metadata } from "next";
import { HomeHero } from "@/components/home-hero";
import { HomeAiNotes } from "@/components/home/home-ai-notes";
import { HomeFeaturedSeries } from "@/components/home/home-featured-series";
import { HomeRecentWriting } from "@/components/home/home-recent-writing";
import { HomeRepresentativeResearch } from "@/components/home/home-representative-research";
import { HomeResearchArchiveSummary } from "@/components/home/home-research-archive-summary";
import { Section } from "@/components/section";
import { getAllEssays, getAllSeries } from "@/lib/essays";
import { siteConfig } from "@/lib/site";
import { researchItems } from "@/src/data/research";
import {
  getResearchSummaryStats,
  sortByPublicationNumber,
} from "@/src/lib/research";

export const metadata: Metadata = {
  title: "서재",
  description:
    "35년간 형사법을 연구한 학자가 AI와 함께 생각을 기록하는 디지털 연구 노트입니다.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: "/",
    locale: "ko_KR",
    siteName: siteConfig.name,
  },
};

const RECENT_ESSAY_COUNT = 5;
const REPRESENTATIVE_RESEARCH_COUNT = 3;

const HOME_FEATURED_SERIES_TITLES = [
  "형사법 교수로 산다는 것",
  "사법시험 출제위원을 하며 느낀 것",
] as const;

export default async function Home() {
  const [allSeries, essays] = await Promise.all([getAllSeries(), getAllEssays()]);

  const recentEssays = essays.slice(0, RECENT_ESSAY_COUNT);
  const representativeResearch = sortByPublicationNumber(researchItems)
    .filter((item) => item.isRepresentative)
    .slice(0, REPRESENTATIVE_RESEARCH_COUNT);
  const featuredSeries = HOME_FEATURED_SERIES_TITLES.map((title) =>
    allSeries.find((series) => series.title === title),
  ).filter((series): series is NonNullable<typeof series> => Boolean(series));
  const researchStats = getResearchSummaryStats(researchItems);

  return (
    <>
      <HomeHero />

      <Section size="wide" className="border-t border-line py-page">
        <HomeRecentWriting essays={recentEssays} />
      </Section>

      <Section size="reading" className="border-t border-line py-page">
        <HomeAiNotes />
      </Section>

      <Section size="reading" className="border-t border-line py-page">
        <HomeRepresentativeResearch items={representativeResearch} />
      </Section>

      <Section size="reading" className="border-t border-line py-page">
        <HomeFeaturedSeries series={featuredSeries} />
      </Section>

      <Section size="reading" className="border-t border-line py-page">
        <HomeResearchArchiveSummary stats={researchStats} />
      </Section>
    </>
  );
}
