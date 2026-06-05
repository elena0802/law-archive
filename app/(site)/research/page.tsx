import type { Metadata } from "next";
import { Section } from "@/components/section";
import { ExpandablePublicationList } from "@/src/components/research/expandable-publication-list";
import { FeaturedPublications } from "@/src/components/research/featured-publications";
import { ResearchAreas } from "@/src/components/research/research-areas";
import { ResearchRepresentativeBooks } from "@/src/components/research/research-representative-books";
import { ResearchSummary } from "@/src/components/research/research-summary";
import { ResearchTimeline } from "@/src/components/research/research-timeline";
import { researchItems } from "@/src/data/research";
import {
  getResearchAreaCounts,
  getResearchSummaryStats,
  sortByPublicationNumber,
} from "@/src/lib/research";
import { researchPagePath } from "@/lib/research-record";
import { siteConfig } from "@/lib/site";

const pageTitle = "연구업적";
const pageLead =
  "형사법, 형사소송법, 증거법과 형사정책을 중심으로 이어온 연구의 기록입니다.";

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
  const stats = getResearchSummaryStats(items);
  const areas = getResearchAreaCounts(items);
  const featured = sortByPublicationNumber(items).filter(
    (item) => item.isRepresentative,
  );
  const timeline = sortByPublicationNumber(
    items.filter((item) => item.isRepresentative),
  );
  const completeByNumber = sortByPublicationNumber(items);
  const completePreview = completeByNumber.slice(0, 10);

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
      </Section>

      <Section size="reading" className="border-t border-line py-page">
        <div className="space-y-12">
          <ResearchSummary stats={stats} />
          <ResearchAreas areas={areas} />
          <ResearchRepresentativeBooks />
          <FeaturedPublications items={featured} />
          <ResearchTimeline items={timeline} />
          <ExpandablePublicationList
            items={completeByNumber}
            previewItems={completePreview}
          />
        </div>
      </Section>
    </>
  );
}
