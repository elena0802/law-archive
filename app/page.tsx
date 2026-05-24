import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { Section } from "@/components/section";
import {
  formatEssayDate,
  getAllEssays,
  getAllSeries,
  getFeaturedEssays,
} from "@/lib/essays";

export default async function Home() {
  const [featuredEssays, recentEssays, series] = await Promise.all([
    getFeaturedEssays(1),
    getAllEssays(),
    getAllSeries(),
  ]);
  const featuredEssay = featuredEssays[0];
  const latestEssays = recentEssays.slice(0, 3);
  const primarySeries = series.slice(0, 4);

  return (
    <>
      <Section size="reading" className="py-page">
        <p className="mb-6 text-sm uppercase tracking-[0.18em] text-accent">
          Digital Study
        </p>
        <h1 className="text-keep font-serif text-4xl leading-[1.18] text-ink sm:text-5xl lg:text-[3.6rem]">
          형사법의 오래된 질문을 차분히 보관하는 서재
        </h1>
        <p className="text-keep mt-8 text-xl leading-9 text-ink-muted">
          판례, 논문, 강의 노트, 그리고 사유의 흔적을 긴 호흡으로 읽을 수
          있도록 정돈하는 원로 형사법학자의 개인 아카이브입니다.
        </p>
      </Section>

      <Section size="wide" className="border-t border-line">
        <div className="grid gap-12 lg:grid-cols-[18rem_1fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-accent">
              Featured Essay
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-ink">
              먼저 읽을 글
            </h2>
          </div>
          <div>
            {featuredEssay ? (
              <ArticleCard
                eyebrow={`${formatEssayDate(featuredEssay.date)} · ${featuredEssay.category}`}
                title={featuredEssay.title}
                description={featuredEssay.description}
                meta={`연재: ${featuredEssay.series}`}
                href={`/essays/${featuredEssay.slug}`}
              />
            ) : (
              <p className="border-t border-line py-7 text-base leading-8 text-ink-muted">
                대표 글로 표시할 원고가 아직 없습니다.
              </p>
            )}
          </div>
        </div>
      </Section>

      <Section size="wide" className="border-t border-line">
        <div className="grid gap-12 lg:grid-cols-[18rem_1fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-accent">
              Recent Essays
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-ink">
              최근 글
            </h2>
          </div>
          <div>
            {latestEssays.map((essay) => (
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
        </div>
      </Section>

      <Section size="wide" className="border-t border-line">
        <div className="grid gap-12 lg:grid-cols-[18rem_1fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-accent">
              Archive Series
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-ink">
              주제별 서가
            </h2>
          </div>
          <div className="border-t border-line">
            {primarySeries.map((item) => (
              <Link
                key={item.slug}
                className="block border-b border-line py-7 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                href={`/series/${item.slug}`}
              >
                <p className="text-xs uppercase tracking-[0.16em] text-ink-muted">
                  {item.count}편 · 최근 {formatEssayDate(item.latestDate)}
                </p>
                <h3 className="mt-3 font-serif text-2xl leading-tight text-ink sm:text-[1.7rem]">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-2xl text-base leading-8 text-ink-muted">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
