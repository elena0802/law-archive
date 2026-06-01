import type { Metadata } from "next";
import Link from "next/link";
import { ResearchPublications } from "@/components/research-publications";
import { ResearchThemes } from "@/components/research-themes";
import { ResearchYearGroups } from "@/components/research-year-groups";
import { Section } from "@/components/section";
import { researchPagePath, researchRecord } from "@/lib/research-record";
import { siteConfig } from "@/lib/site";

const { overview, sectionHeadings } = researchRecord;

export const metadata: Metadata = {
  title: overview.title,
  description: overview.lead,
  alternates: {
    canonical: researchPagePath,
  },
  openGraph: {
    title: `${overview.title} | ${siteConfig.name}`,
    description: overview.lead,
    url: researchPagePath,
  },
};

export default function ResearchPage() {
  return (
    <>
      <Section size="reading" className="py-page">
        <p className="mb-6 text-sm tracking-[0.18em] text-accent uppercase">
          {overview.eyebrow}
        </p>
        <h1 className="text-keep font-serif text-4xl leading-[1.1] text-ink sm:text-5xl">
          {overview.title}
        </h1>
        <p className="text-keep mt-7 text-lg leading-9 text-ink-muted">
          {overview.lead}
        </p>
        {overview.note ? (
          <p className="text-keep mt-5 text-base leading-[1.85] text-ink-muted">
            {overview.note}
          </p>
        ) : null}
        <p className="text-keep mt-6 text-sm text-ink-muted">
          <Link href="/about" className="text-accent hover:underline">
            서재 소개
          </Link>
          에서 학자의 약력과 대표 저서를 볼 수 있습니다.
        </p>
      </Section>

      <Section size="reading" className="border-t border-line py-page">
        <div className="space-y-10">
          <ResearchThemes
            heading={sectionHeadings.themes}
            themes={researchRecord.themes}
          />
          <ResearchPublications
            heading={sectionHeadings.featuredPapers}
            publications={researchRecord.featuredPapers}
            id="featured-papers"
            numbered
          />
          <ResearchYearGroups
            heading={sectionHeadings.yearGroups}
            groups={researchRecord.yearGroups}
          />
        </div>
      </Section>
    </>
  );
}
