import type { Metadata } from "next";
import Link from "next/link";
import { AboutSection } from "@/components/about-section";
import { SeriesVolumeLink } from "@/components/series-volume-link";
import { Section } from "@/components/section";
import { getAllCategories, getAllSeries } from "@/lib/essays";
import {
  formatResearchPaperLine,
  researchMap,
  researchPagePath,
} from "@/lib/research-record";
import { siteConfig } from "@/lib/site";

const { overview, sectionHeadings } = researchMap;

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

export default async function ResearchPage() {
  const [categories, series] = await Promise.all([
    getAllCategories(),
    getAllSeries(),
  ]);

  const categoryHrefByName = new Map(
    categories.map((category) => [
      category.title,
      `/categories/${category.slug}`,
    ]),
  );

  const featuredSeries = researchMap.featuredSeriesSlugs
    .map((slug) => series.find((item) => item.slug === slug))
    .filter((item): item is NonNullable<typeof item> => item !== undefined);

  return (
    <>
      <Section size="reading" className="py-page">
        <p className="mb-6 text-sm tracking-[0.18em] text-accent uppercase">
          {overview.eyebrow}
        </p>
        <h1 className="text-keep font-serif text-4xl leading-[1.1] text-ink sm:text-5xl">
          형사법은 결국 인간과 사회에 대한 질문입니다.
        </h1>
        <div className="text-keep mt-7 space-y-5 text-lg leading-9 text-ink-muted">
          {overview.body.slice(1).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Section>

      <Section size="reading" className="border-t border-line py-page">
        <div className="space-y-10">
          <AboutSection heading={sectionHeadings.areas} id="research-areas">
            <ul className="list-none space-y-0 p-0">
              {researchMap.areas.map((area) => {
                const href =
                  "category" in area && area.category
                    ? categoryHrefByName.get(area.category)
                    : undefined;

                return (
                  <li
                    key={area.label}
                    className="border-t border-line/70 py-4 first:border-t-0 first:pt-0 last:pb-0"
                  >
                    {href ? (
                      <Link
                        className="font-serif text-lg leading-snug text-ink underline-offset-4 hover:text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                        href={href}
                      >
                        {area.label}
                      </Link>
                    ) : (
                      <span className="font-serif text-lg leading-snug text-ink">
                        {area.label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </AboutSection>

          <AboutSection
            heading={sectionHeadings.featuredPapers}
            id="featured-papers"
          >
            <ol className="list-none space-y-0 p-0" aria-label={sectionHeadings.featuredPapers}>
              {researchMap.featuredPapers.map((paper, index) => (
                <li
                  key={paper.id}
                  className="flex gap-4 border-t border-line/70 py-5 first:border-t-0 first:pt-0 last:pb-0 sm:gap-6"
                >
                  <span
                    className="shrink-0 font-serif text-lg tabular-nums text-accent"
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-keep font-serif text-lg leading-snug text-ink">
                      {paper.title}
                    </p>
                    <p className="text-keep mt-2 text-base leading-[1.85] text-ink-muted">
                      {formatResearchPaperLine(paper)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </AboutSection>

          <AboutSection heading={sectionHeadings.series} id="research-series">
            {featuredSeries.length > 0 ? (
              <div>
                {featuredSeries.map((item) => (
                  <SeriesVolumeLink key={item.slug} series={item} />
                ))}
              </div>
            ) : (
              <p className="text-keep text-ink-muted">
                아직 공개된 연재가 없습니다.
              </p>
            )}
          </AboutSection>

          <AboutSection heading={sectionHeadings.journey} id="research-journey">
            <ol className="list-none space-y-0 p-0">
              {researchMap.journey.map((period) => (
                <li
                  key={period.era}
                  className="grid gap-2 border-t border-line/70 py-4 first:border-t-0 first:pt-0 last:pb-0 sm:grid-cols-[5rem_1fr] sm:gap-6"
                >
                  <span className="font-serif text-lg tabular-nums text-accent">
                    {period.era}
                  </span>
                  <span className="text-keep text-base leading-[1.85] text-ink-muted">
                    {period.theme}
                  </span>
                </li>
              ))}
            </ol>
          </AboutSection>
        </div>
      </Section>
    </>
  );
}
