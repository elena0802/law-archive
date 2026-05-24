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
    getFeaturedEssays(3),
    getAllEssays(),
    getAllSeries(),
  ]);
  const latestEssays = recentEssays.slice(0, 3);
  const primarySeries = series.slice(0, 4);

  return (
    <>
      <Section size="reading" className="py-page">
        <p className="mb-6 text-sm uppercase tracking-[0.18em] text-accent">
          Digital Study
        </p>
        <h1 className="text-keep font-serif text-4xl leading-[1.18] text-ink sm:text-5xl lg:text-[3.6rem]">
          형사법을 오래 연구하고 가르쳤습니다.
        </h1>
        <p className="text-keep mt-8 text-xl leading-9 text-ink-muted">
          이제는 법과 인간, 책임과 사회에 대해 조금 더 천천히 기록합니다.
          판례와 제도 너머에 남는 질문들을 조용히 모아 두는 개인 서재입니다.
        </p>
      </Section>

      <Section size="wide" className="border-t border-line">
        <div className="grid gap-12 lg:grid-cols-[18rem_1fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-accent">
              Selected Essays
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-ink">
              먼저 놓아둔 글
            </h2>
            <p className="mt-5 text-base leading-8 text-ink-muted">
              이 서재의 문제의식을 먼저 보여주는 글입니다. 처벌, 책임,
              기술과 인간에 관한 질문을 천천히 따라갑니다.
            </p>
          </div>
          <div>
            {featuredEssays.length > 0 ? (
              featuredEssays.map((essay) => (
                <ArticleCard
                  key={essay.slug}
                  eyebrow={`${formatEssayDate(essay.date)} · ${essay.category}`}
                  title={essay.title}
                  description={essay.description}
                  meta={essay.series}
                  href={`/essays/${essay.slug}`}
                />
              ))
            ) : (
              <p className="border-t border-line py-8 text-base leading-8 text-ink-muted">
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
              최근에 놓인 기록
            </h2>
            <p className="mt-5 text-base leading-8 text-ink-muted">
              새로 정리한 글을 날짜순으로 모았습니다. 빠른 반응보다 오래
              생각할 수 있는 문장을 남기는 데 뜻을 둡니다.
            </p>
          </div>
          <div>
            {latestEssays.length > 0 ? (
              latestEssays.map((essay) => (
                <ArticleCard
                  key={essay.slug}
                  eyebrow={`${formatEssayDate(essay.date)} · ${essay.category}`}
                  title={essay.title}
                  description={essay.description}
                  meta={essay.series}
                  href={`/essays/${essay.slug}`}
                />
              ))
            ) : (
              <p className="border-t border-line py-8 text-base leading-8 text-ink-muted">
                아직 공개된 글이 없습니다. 원고가 공개되면 이 자리에 최신순으로
                표시됩니다.
              </p>
            )}
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
            <p className="mt-5 text-base leading-8 text-ink-muted">
              같은 질문을 여러 글이 이어 받도록 시리즈로 묶었습니다. 한 편의
              결론보다 오래 지속되는 사유의 흐름을 살펴볼 수 있습니다.
            </p>
          </div>
          <div className="border-t border-line">
            {primarySeries.length > 0 ? (
              primarySeries.map((item) => (
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
              ))
            ) : (
              <p className="py-8 text-base leading-8 text-ink-muted">
                아직 묶인 시리즈가 없습니다. 같은 시리즈 이름을 가진 글이
                공개되면 이곳에 주제별 서가가 생깁니다.
              </p>
            )}
          </div>
        </div>
      </Section>

      <Section size="reading" className="border-t border-line bg-paper-muted/35">
        <p className="text-sm uppercase tracking-[0.18em] text-accent">
          Archive Note
        </p>
        <h2 className="text-keep mt-4 font-serif text-3xl leading-tight text-ink sm:text-4xl">
          빠른 논평보다 오래 남을 사유를 위한 공간입니다.
        </h2>
        <p className="text-keep mt-6 text-lg leading-9 text-ink-muted">
          이곳의 글은 사건을 따라 급히 달려가기보다, 형사법이 인간과 사회를
          어떻게 바라보아야 하는지 천천히 묻기 위해 놓입니다. 시간이 지나도
          다시 펼쳐 읽을 수 있는 기록으로 남기고자 합니다.
        </p>
      </Section>
    </>
  );
}
