import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { CitationBlock } from "@/components/citation-block";
import {
  EssayBreadcrumb,
  EssayDetailNav,
  EssayMetaRow,
} from "@/components/essay-meta";
import { Section } from "@/components/section";
import { SeriesSiblings } from "@/components/series-siblings";
import {
  estimateReadingMinutes,
  getAllEssays,
  getEssayBySlug,
  getSeriesBySlug,
  getSeriesPartLabel,
  getSeriesSlug,
  sortEssaysByDateAsc,
} from "@/lib/essays";
import { formatEssayCitation, getSiteOrigin } from "@/lib/site";

type EssayPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const essays = await getAllEssays();

  return essays.map((essay) => ({
    slug: essay.slug,
  }));
}

export async function generateMetadata({
  params,
}: EssayPageProps): Promise<Metadata> {
  const { slug } = await params;
  const essay = await getEssayBySlug(slug);

  if (!essay || essay.draft) {
    return {};
  }

  return {
    title: essay.title,
    description: essay.description,
    alternates: {
      canonical: `/essays/${essay.slug}`,
    },
    openGraph: {
      title: essay.title,
      description: essay.description,
      url: `/essays/${essay.slug}`,
      type: "article",
      publishedTime: essay.date,
      section: essay.category,
    },
  };
}

export default async function EssayPage({ params }: EssayPageProps) {
  const { slug } = await params;
  const essay = await getEssayBySlug(slug);

  if (!essay || essay.draft) {
    notFound();
  }

  const seriesSlug = getSeriesSlug(essay.series);
  const series = await getSeriesBySlug(seriesSlug);
  const essaysInSeries = series ? sortEssaysByDateAsc(series.essays) : [];
  const readingMinutes = estimateReadingMinutes(essay.content);
  const partLabel = getSeriesPartLabel(essaysInSeries, essay.slug);
  const citation = formatEssayCitation({
    title: essay.title,
    slug: essay.slug,
    date: essay.date,
    siteOrigin: getSiteOrigin(),
  });

  return (
    <Section size="reading" className="py-page">
      <EssayDetailNav />
      <EssayBreadcrumb seriesTitle={essay.series} />

      <article className="mt-8">
        <header className="border-b border-line pb-10">
          <EssayMetaRow
            category={essay.category}
            date={essay.date}
            partLabel={partLabel}
            readingMinutes={readingMinutes}
            seriesTitle={essay.series}
          />
          <h1 className="text-keep mt-5 font-serif text-4xl leading-[1.18] text-ink sm:text-5xl">
            {essay.title}
          </h1>
          <p className="text-keep mt-6 text-lg leading-9 text-ink-muted">
            {essay.description}
          </p>
        </header>

        <div className="archive-prose mt-12">
          <MDXRemote source={essay.content} />
        </div>

        <footer className="mt-14 space-y-10 border-t border-line pt-10">
          <CitationBlock citation={citation} />
          {essaysInSeries.length > 0 ? (
            <SeriesSiblings
              currentSlug={essay.slug}
              essays={essaysInSeries}
            />
          ) : null}
        </footer>
      </article>
    </Section>
  );
}
