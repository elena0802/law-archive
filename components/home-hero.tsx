import Image from "next/image";
import Link from "next/link";
import { HomeSeriesPanel } from "@/components/home-series-panel";
import type { EssaySeries } from "@/lib/essays";
import { siteConfig } from "@/lib/site";

type HomeHeroProps = {
  flagshipSeries: EssaySeries | null;
};

export function HomeHero({ flagshipSeries }: HomeHeroProps) {
  const { hero } = siteConfig;

  return (
    <section
      aria-labelledby="home-hero-heading"
      className="border-y border-line bg-paper-muted"
    >
      <div className="mx-auto grid max-w-wide items-stretch gap-6 px-5 py-[clamp(2rem,5vw,4rem)] sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-10 lg:px-10 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)]">
        <figure className="m-0 flex flex-col">
          <div className="overflow-hidden border border-line bg-paper shadow-[inset_0_0_0_1px_rgba(248,244,234,0.6)]">
            <div className="relative aspect-[6/5] max-h-[min(52vw,14rem)] w-full sm:max-h-[min(48vw,16rem)] lg:aspect-auto lg:max-h-none lg:min-h-[26rem]">
              <Image
                alt={hero.imageAlt}
                className="h-full w-full object-cover object-[42%_38%] lg:object-[45%_40%]"
                height={hero.imageHeight}
                priority
                quality={90}
                sizes="(min-width: 1280px) 580px, (min-width: 1024px) 48vw, 100vw"
                src={hero.image}
                width={hero.imageWidth}
              />
            </div>
          </div>
          <figcaption className="mt-2.5 text-center text-[0.8125rem] tracking-wide text-ink-muted sm:mt-3">
            {hero.imageCaption}
          </figcaption>
        </figure>

        <div className="flex flex-col justify-center">
          <p className="mb-4 text-sm tracking-[0.18em] text-accent uppercase">
            {hero.eyebrow}
          </p>
          <h1
            className="font-serif text-[clamp(2rem,4.5vw,3.15rem)] leading-[1.16] text-ink"
            id="home-hero-heading"
          >
            <span className="text-keep block">{hero.headlineLine1}</span>
            <span className="text-keep mt-1 block">{hero.headlineLine2}</span>
          </h1>
          <p className="text-keep mt-5 text-[1.0625rem] leading-[1.88] text-ink">
            {hero.lead}
          </p>

          {flagshipSeries ? (
            <HomeSeriesPanel series={flagshipSeries} />
          ) : (
            <p className="text-keep mt-6 border-t border-line/80 pt-5 text-base leading-8 text-ink-muted">
              대표 연재를 불러오지 못했습니다.{" "}
              <Link
                className="text-accent underline-offset-4 hover:underline"
                href="/series"
              >
                연재 목록
              </Link>
              에서 읽을 수 있습니다.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
