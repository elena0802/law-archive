import type { Metadata } from "next";
import { Section } from "@/components/section";
import { ChronologicalArchive } from "@/src/components/research/chronological-archive";
import { FeaturedPublications } from "@/src/components/research/featured-publications";
import { PublicationList } from "@/src/components/research/publication-list";
import { ResearchAreas } from "@/src/components/research/research-areas";
import { ResearchSummary } from "@/src/components/research/research-summary";
import { researchItems } from "@/src/data/research";
import {
  getResearchAreaCounts,
  getResearchSummaryStats,
  groupResearchByYear,
  sortByPublicationNumber,
} from "@/src/lib/research";
import { researchPagePath } from "@/lib/research-record";
import { siteConfig } from "@/lib/site";

const pageTitle = "연구업적";
const pageLead =
  "형사법, 형사소송법, 증거법과 형사정책을 중심으로 이어온 연구의 기록입니다.";
const pageDescription =
  "1991년부터 2019년까지 이어진 연구 성과를 정리하는 학문적 아카이브입니다.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageLead,
  alternates: {
    canonical: researchPagePath,
  },
  openGraph: {
    title: `${pageTitle} | ${siteConfig.name}`,
    description: pageLead,
    url: researchPagePath,
    locale: "ko_KR",
    siteName: siteConfig.name,
  },
};

export default function ResearchPage() {
  const items = researchItems;
  const sorted = sortByPublicationNumber(items);
  const stats = getResearchSummaryStats(items);
  const areas = getResearchAreaCounts(items);
  const featured = sorted.filter((item) => item.isRepresentative);
  const selected = sorted.filter((item) => item.isImportant);
  const yearGroups = groupResearchByYear(items);

  return (
    <>
      <Section size="reading" className="py-page">
        <p className="mb-6 text-sm tracking-[0.18em] text-accent uppercase">
          Research Publications
        </p>
        <h1 className="text-keep font-serif text-4xl leading-[1.1] text-ink sm:text-5xl">
          {pageTitle}
        </h1>
        <p className="text-keep mt-7 text-lg leading-9 text-ink-muted">
          {pageLead}
        </p>
        <p className="text-keep mt-5 text-base leading-[1.85] text-ink-muted">
          {pageDescription}
        </p>
      </Section>

      <Section size="reading" className="border-t border-line py-page">
        <div className="space-y-14">
          <ResearchSummary stats={stats} />
          <FeaturedPublications items={featured} />
          <ResearchAreas areas={areas} />
          <PublicationList
            items={selected}
            heading="주요 논문"
            headingId="selected-publications-heading"
            badgeMode="all"
          />
          <PublicationList
            items={sorted}
            heading="전체 연구업적"
            headingId="complete-publications-heading"
            description="현재 등록된 연구업적 목록입니다. 전체 논문 목록은 순차적으로 확장될 예정입니다."
            badgeMode="none"
          />
          <ChronologicalArchive yearGroups={yearGroups} />
        </div>
      </Section>
    </>
  );
}
