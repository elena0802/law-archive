import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function HomeHero() {
  const { hero } = siteConfig;

  return (
    <section
      aria-labelledby="home-hero-heading"
      className="border-b border-line bg-paper-muted"
    >
      <div className="mx-auto grid max-w-wide items-stretch gap-6 px-5 py-[clamp(2rem,5vw,4rem)] sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-10 lg:px-10 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)]">
        <figure className="m-0 flex flex-col">
          <div className="relative aspect-[6/5] max-h-[min(52vw,14rem)] w-full overflow-hidden sm:max-h-[min(48vw,16rem)] lg:aspect-auto lg:max-h-none lg:min-h-[26rem]">
            <Image
              alt={hero.imageAlt}
              className="h-full w-full object-cover object-[42%_38%] mix-blend-multiply lg:object-[45%_40%]"
              height={hero.imageHeight}
              priority
              quality={90}
              sizes="(min-width: 1280px) 580px, (min-width: 1024px) 48vw, 100vw"
              src={hero.image}
              width={hero.imageWidth}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 shadow-[inset_0_0_28px_14px_var(--paper-muted)]"
            />
          </div>
          <figcaption className="mt-2.5 text-center text-[0.8125rem] tracking-wide text-ink-muted sm:mt-3">
            {hero.imageCaption}
          </figcaption>
        </figure>

        <div className="flex flex-col justify-center">
          <h1
            className="font-serif text-[clamp(2rem,4.5vw,3.15rem)] leading-[1.16] text-ink"
            id="home-hero-heading"
          >
            {siteConfig.name}
          </h1>
          <p className="text-keep mt-6 text-[1.0625rem] leading-[1.88] text-ink">
            35년간 형사법을 연구하고 가르쳤습니다.
            <br />
            이제는 AI와 함께 생각을 기록하고 있습니다.
          </p>
          <p className="text-keep mt-5 text-base leading-[1.85] text-ink-muted">
            형사법, 사회, 기술에 대한 생각을
            <br />
            AI와 함께 기록하는 디지털 연구 노트입니다.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              className="inline-flex border border-line bg-paper px-5 py-2.5 text-sm text-ink transition-colors hover:border-ink-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              href="/essays"
            >
              최근 글 보기
            </Link>
            <Link
              className="text-sm text-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              href="/research"
            >
              연구업적 보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
