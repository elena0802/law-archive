import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { Section } from "@/components/section";
import {
  formatEssayDate,
  getAllSeries,
  getEssaysBySeries,
  getSeriesBySlug,
} from "@/lib/essays";

type SeriesPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const series = await getAllSeries();

  return series.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: SeriesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const series = await getSeriesBySlug(slug);

  if (!series) {
    return {};
  }

  return {
    title: `${series.title} | Criminal Law Archive`,
    description: series.description,
  };
}

export default async function SeriesDetailPage({ params }: SeriesPageProps) {
  const { slug } = await params;
  const series = await getSeriesBySlug(slug);

  if (!series) {
    notFound();
  }

  const essays = await getEssaysBySeries(slug);

  return (
    <>
      <Section size="reading" className="py-page">
        <Link
          className="text-sm uppercase tracking-[0.16em] text-accent underline-offset-4 hover:underline"
          href="/series"
        >
          Series로 돌아가기
        </Link>
        <p className="mt-12 text-sm uppercase tracking-[0.18em] text-accent">
          Series
        </p>
        <h1 className="text-keep mt-5 font-serif text-4xl leading-[1.18] text-ink sm:text-5xl">
          {series.title}
        </h1>
        <p className="text-keep mt-6 text-lg leading-9 text-ink-muted">
          {series.description}
        </p>
        <p className="mt-7 text-sm leading-6 text-ink-muted">
          총 {series.count}편의 글
        </p>
      </Section>

      <Section size="wide" className="border-t border-line">
        <div className="mx-auto max-w-reading">
          {essays.map((essay) => (
            <ArticleCard
              key={essay.slug}
              eyebrow={`${formatEssayDate(essay.date)} · ${essay.category}`}
              title={essay.title}
              description={essay.description}
              meta={`연재: ${essay.series}`}
              href={`/essays/${essay.slug}`}
            />
          ))}
        </div>
      </Section>
    </>
  );
}
