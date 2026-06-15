import type { Metadata } from "next";
import { NewsPageContent } from "@/components/news/news-page-content";
import { Section } from "@/components/section";
import { getFeaturedNewsItem, getNewsItemsGroupedByMonth } from "@/lib/news/queries";
import { newsPageDescription } from "@/lib/news/types";
import { buildDefaultOpenGraphImages } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "소식",
  description: newsPageDescription,
  alternates: {
    canonical: "/news",
  },
  openGraph: {
    title: `소식 | ${siteConfig.name}`,
    description: newsPageDescription,
    url: "/news",
    locale: "ko_KR",
    siteName: siteConfig.name,
    images: buildDefaultOpenGraphImages(),
  },
};

export default async function NewsPage() {
  const [groups, featured] = await Promise.all([
    getNewsItemsGroupedByMonth(),
    getFeaturedNewsItem(),
  ]);

  return (
    <>
      <Section size="reading" className="pt-page pb-6 sm:pb-8">
        <p className="mb-5 text-sm tracking-[0.18em] text-accent uppercase">
          연구실 기록
        </p>
        <h1 className="text-keep font-serif text-4xl leading-[1.1] text-ink sm:text-5xl">
          소식
        </h1>
        <p className="text-keep mt-5 text-lg leading-8 text-ink-muted sm:mt-6">
          {newsPageDescription}
        </p>
      </Section>

      <Section size="wide" className="pt-0 pb-section">
        <NewsPageContent featured={featured} groups={groups} />
      </Section>
    </>
  );
}
