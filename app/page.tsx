import type { Metadata } from "next";
import Link from "next/link";
import { HomeHero } from "@/components/home-hero";
import { Section } from "@/components/section";
import { SeriesVolumeLink } from "@/components/series-volume-link";
import { getAllSeries, getSeriesBySlug } from "@/lib/essays";
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
  },
};

export default async function Home() {
  const [flagshipSeries, allSeries] = await Promise.all([
    getSeriesBySlug(siteConfig.flagshipSeriesSlug, { includeDrafts: true }),
    getAllSeries({ includeDrafts: true }),
  ]);

  const shelfSeries = allSeries.filter(
    (item) => item.slug !== siteConfig.flagshipSeriesSlug,
  );

  return (
    <>
      <HomeHero flagshipSeries={flagshipSeries} />

      <Section size="wide" className="border-t border-line">
        <p className="mb-6 text-sm tracking-[0.18em] text-accent uppercase">
          연재 서가
        </p>
        <h2 className="text-keep font-serif text-3xl leading-tight text-ink sm:text-4xl">
          주제별 서가
        </h2>
        <p className="text-keep mt-5 max-w-2xl text-base leading-8 text-ink-muted">
          같은 질문을 여러 글이 이어 받도록 묶었습니다. 한 편의 결론보다 오래
          지속되는 사유의 흐름을 살펴볼 수 있습니다.
        </p>

        {shelfSeries.length > 0 ? (
          <div className="mt-8 sm:grid sm:grid-cols-2 sm:gap-x-12">
            {shelfSeries.map((item) => (
              <SeriesVolumeLink key={item.slug} series={item} />
            ))}
          </div>
        ) : (
          <p className="mt-8 border-t border-line py-8 text-base leading-8 text-ink-muted">
            아직 다른 연재가 없습니다. 새 글이 같은 연재명으로 공개되면 이곳에
            서가가 채워집니다.
          </p>
        )}

        <Link
          className="mt-8 inline-block text-sm text-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          href="/series"
        >
          모든 연재 보기
        </Link>
      </Section>
    </>
  );
}
