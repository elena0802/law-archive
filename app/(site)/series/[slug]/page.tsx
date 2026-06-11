import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/section";
import { SeriesToc } from "@/components/series-toc";
import { SeriesVolumeStats } from "@/components/series-volume-stats";
import { getSeriesBySlug } from "@/lib/essays";
import { siteConfig } from "@/lib/site";

type SeriesPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 60;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: SeriesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const series = await getSeriesBySlug(slug);

  if (!series) {
    return {};
  }

  return {
    title: series.title,
    description: series.introduction,
    alternates: {
      canonical: `/series/${series.slug}`,
    },
    openGraph: {
      title: `${series.title} | ${siteConfig.name}`,
      description: series.introduction,
      url: `/series/${series.slug}`,
      locale: "ko_KR",
      siteName: siteConfig.name,
    },
  };
}

export default async function SeriesDetailPage({ params }: SeriesPageProps) {
  const { slug } = await params;
  const series = await getSeriesBySlug(slug);

  if (!series) {
    notFound();
  }

  return (
    <Section size="reading" className="py-page">
      <Link
        className="text-sm tracking-[0.1em] text-accent underline-offset-4 hover:underline"
        href="/series"
      >
        ← 연재 목록
      </Link>

      <header className="mt-10 border-b border-line pb-10">
        <p className="text-sm tracking-[0.18em] text-accent uppercase">연재</p>
        <h1 className="text-keep mt-4 font-serif text-4xl leading-[1.14] text-ink sm:text-5xl">
          {series.title}
        </h1>
        {series.description ? (
          <p className="text-keep mt-5 text-lg leading-9 text-ink">
            {series.description}
          </p>
        ) : null}
        <p className="text-keep mt-6 text-lg leading-9 text-ink-muted">
          {series.introduction}
        </p>
        <p className="text-keep mt-5 text-base leading-8 text-ink-muted">
          총 {series.count}편
        </p>
        <SeriesVolumeStats
          count={series.count}
          firstDate={series.firstDate}
          latestDate={series.latestDate}
          layout="grid"
        />
      </header>

      <SeriesToc essays={series.essays} />
    </Section>
  );
}
