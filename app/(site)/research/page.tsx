import type { Metadata } from "next";
import { Section } from "@/components/section";
import { ExpandablePublicationList } from "@/src/components/research/expandable-publication-list";
import { FeaturedPublications } from "@/src/components/research/featured-publications";
import { ResearchAboutLink } from "@/src/components/research/research-about-link";
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
import { buildDefaultOpenGraphImages } from "@/lib/seo";
import { scholarTitle, siteConfig } from "@/lib/site";

const pageHeading = "연구업적";
const metadataTitle = `${pageHeading} | ${scholarTitle}`;
const pageLead =
  "형사법, 형사소송법, 증거법과 형사정책을 중심으로 이어온 연구의 기록입니다.";

export const metadata: Metadata = {
  title: { absolute: metadataTitle },
  description: pageLead,
  alternates: {
    canonical: researchPagePath,
  },
  openGraph: {
    title: metadataTitle,
    description: pageLead,
    url: researchPagePath,
    locale: "ko_KR",
    siteName: siteConfig.name,
    images: buildDefaultOpenGraphImages(),
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
          {pageHeading}
        </h1>
        <p className="text-keep mt-7 text-lg leading-9 text-ink-muted">
          {pageLead}
        </p>
      </Section>

      <Section size="reading" className="border-t border-line py-page">
        <div className="space-y-12">
          <ResearchSummary stats={stats} />
          <ResearchAboutLink />
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
