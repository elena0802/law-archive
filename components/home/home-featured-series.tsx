import { HomeSectionHeader } from "@/components/home/home-section-header";
import { HomeSectionLink } from "@/components/home/home-section-link";
import { SeriesEditorialCard } from "@/components/home/series-editorial-card";
import type { EssaySeries } from "@/lib/essays";

type HomeFeaturedSeriesProps = {
  series: readonly EssaySeries[];
};

export function HomeFeaturedSeries({ series }: HomeFeaturedSeriesProps) {
  return (
    <section aria-labelledby="home-featured-series-heading">
      <HomeSectionHeader
        description="오래 이어온 주제와 회고를 연재로 모았습니다."
        headingId="home-featured-series-heading"
        title="대표 연재"
      />
      {series.length > 0 ? (
        <ul className="mt-12 grid list-none gap-6 p-0 sm:grid-cols-2 lg:gap-8">
          {series.map((item) => (
            <li key={item.slug} className="min-w-0">
              <SeriesEditorialCard series={item} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-12 border border-line/80 px-6 py-10 text-base leading-8 text-ink-muted">
          아직 공개된 연재가 없습니다.
        </p>
      )}
      <HomeSectionLink href="/series">모든 연재 보기 →</HomeSectionLink>
    </section>
  );
}
