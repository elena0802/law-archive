import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { HomeHero } from "@/components/home-hero";
import { NewsletterSubscribeForm } from "@/components/newsletter-subscribe-form";
import { Section } from "@/components/section";
import { SeriesVolumeLink } from "@/components/series-volume-link";
import {
  formatEssayDate,
  getAllCategories,
  getAllEssays,
  getAllSeries,
  getSeriesBySlug,
} from "@/lib/essays";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "서재",
  description: siteConfig.description,
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

const TOP_CATEGORY_COUNT = 6;
const INTRO_CATEGORY_COUNT = 4;
const FEATURED_SERIES_COUNT = 3;
const RECENT_ESSAY_COUNT = 5;

export default async function Home() {
  const [flagshipSeries, categories, allSeries, essays] = await Promise.all([
    getSeriesBySlug(siteConfig.flagshipSeriesSlug),
    getAllCategories(),
    getAllSeries(),
    getAllEssays(),
  ]);

  const topCategories = categories.slice(0, TOP_CATEGORY_COUNT);
  const introCategories = categories.slice(0, INTRO_CATEGORY_COUNT);
  const featuredSeries = allSeries.slice(0, FEATURED_SERIES_COUNT);
  const recentEssays = essays.slice(0, RECENT_ESSAY_COUNT);

  return (
    <>
      <HomeHero flagshipSeries={flagshipSeries} />

      <Section size="reading" className="border-t border-line py-page">
        <h2 className="text-keep font-serif text-3xl leading-tight text-ink sm:text-4xl">
          {siteConfig.name}
        </h2>
        <p className="text-keep mt-7 text-lg leading-9 text-ink-muted">
          35년 넘게 형사법을 연구하고 가르쳐 온 학자의 글과 강의 노트를 조용히
          모으는 디지털 서재입니다.
        </p>
        <p className="mt-6 text-sm tracking-[0.14em] text-accent uppercase">
          다루는 주제
        </p>
        <ul className="text-keep mt-3 list-none space-y-1 p-0 text-base leading-8 text-ink-muted">
          {introCategories.map((category) => (
            <li key={category.slug}>
              <Link
                className="text-ink-muted underline-offset-4 hover:text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                href={`/categories/${category.slug}`}
              >
                - {category.title}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          className="mt-6 inline-block text-sm text-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          href="/about"
        >
          학자 소개 보기 →
        </Link>
      </Section>

      <Section size="reading" className="border-t border-line">
        <p className="mb-6 text-sm tracking-[0.18em] text-accent uppercase">
          Topics
        </p>
        <h2 className="text-keep font-serif text-3xl leading-tight text-ink sm:text-4xl">
          주요 주제
        </h2>
        {topCategories.length > 0 ? (
          <ul className="mt-8 list-none p-0">
            {topCategories.map((category) => (
              <li className="border-t border-line first:border-t-0" key={category.slug}>
                <Link
                  className="group flex items-baseline justify-between gap-6 py-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  href={`/categories/${category.slug}`}
                >
                  <span className="text-keep font-serif text-2xl leading-tight text-ink group-hover:text-accent">
                    {category.title}
                  </span>
                  <span className="text-sm text-ink-muted">{category.count}편</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 py-8 text-base leading-8 text-ink-muted">
            아직 공개된 주제가 없습니다.
          </p>
        )}
      </Section>

      <Section size="reading" className="border-t border-line">
        <p className="mb-6 text-sm tracking-[0.18em] text-accent uppercase">
          Series
        </p>
        <h2 className="text-keep font-serif text-3xl leading-tight text-ink sm:text-4xl">
          대표 연재
        </h2>
        {featuredSeries.length > 0 ? (
          <div className="mt-8">
            {featuredSeries.map((item) => (
              <SeriesVolumeLink key={item.slug} series={item} />
            ))}
          </div>
        ) : (
          <p className="mt-8 py-8 text-base leading-8 text-ink-muted">
            아직 공개된 연재가 없습니다.
          </p>
        )}
        <Link
          className="mt-4 inline-block text-sm text-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          href="/series"
        >
          모든 연재 보기
        </Link>
      </Section>

      <Section size="wide" className="border-t border-line">
        <p className="mb-6 text-sm tracking-[0.18em] text-accent uppercase">
          Recent
        </p>
        <h2 className="text-keep font-serif text-3xl leading-tight text-ink sm:text-4xl">
          최근 글
        </h2>
        <div className="mx-auto mt-8 max-w-reading">
          {recentEssays.length > 0 ? (
            recentEssays.map((essay) => (
              <ArticleCard
                key={essay.slug}
                description={essay.description}
                eyebrow={`${formatEssayDate(essay.date)} · ${essay.category}`}
                href={`/essays/${essay.slug}`}
                meta={`연재: ${essay.series}`}
                title={essay.title}
              />
            ))
          ) : (
            <p className="border-t border-line py-8 text-base leading-8 text-ink-muted">
              아직 공개된 글이 없습니다.
            </p>
          )}
        </div>
        <Link
          className="mt-4 inline-block text-sm text-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          href="/essays"
        >
          모든 글 보기
        </Link>
      </Section>

      <Section size="reading" className="border-t border-line py-page">
        <p className="mb-6 text-sm tracking-[0.18em] text-accent uppercase">
          Newsletter
        </p>
        <h2 className="text-keep font-serif text-3xl leading-tight text-ink sm:text-4xl">
          새 글을 이메일로 받아보세요
        </h2>
        <p className="text-keep mt-6 max-w-2xl text-base leading-8 text-ink-muted">
          형사법 아카이브의 새 글과 연재 소식을 조용히 전해드립니다.
        </p>
        <NewsletterSubscribeForm source="homepage" />
      </Section>
    </>
  );
}
