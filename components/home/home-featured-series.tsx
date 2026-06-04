import Link from "next/link";
import { SeriesVolumeLink } from "@/components/series-volume-link";
import type { EssaySeries } from "@/lib/essays";

type HomeFeaturedSeriesProps = {
  series: readonly EssaySeries[];
};

export function HomeFeaturedSeries({ series }: HomeFeaturedSeriesProps) {
  return (
    <section aria-labelledby="home-featured-series-heading">
      <h2
        id="home-featured-series-heading"
        className="text-keep font-serif text-3xl leading-tight text-ink sm:text-4xl"
      >
        대표 연재
      </h2>
      <p className="text-keep mt-4 text-base leading-[1.85] text-ink-muted">
        오래 이어온 주제와 회고를 연재로 모았습니다.
      </p>
      {series.length > 0 ? (
        <div className="mt-8">
          {series.map((item) => (
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
    </section>
  );
}
