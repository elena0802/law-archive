import Link from "next/link";
import { Section } from "@/components/section";
import { formatEssayDate, getAllSeries } from "@/lib/essays";

export default async function SeriesPage() {
  const series = await getAllSeries();

  return (
    <>
      <Section size="reading" className="py-page">
        <p className="mb-6 text-sm uppercase tracking-[0.18em] text-accent">
          Series
        </p>
        <h1 className="font-serif text-5xl leading-[1.1] text-ink">
          연재
        </h1>
        <p className="text-keep mt-7 text-lg leading-9 text-ink-muted">
          하나의 주제를 여러 편으로 나누어 읽을 수 있도록 준비하는
          공간입니다. 공개된 글은 연재명별로 묶여 아카이브처럼 쌓입니다.
        </p>
      </Section>

      <Section size="wide" className="border-t border-line">
        <div className="mx-auto max-w-reading">
          {series.map((item) => (
            <article key={item.slug} className="border-t border-line py-9">
              <p className="text-xs uppercase tracking-[0.16em] text-ink-muted">
                {item.count}편 · 최근 {formatEssayDate(item.latestDate)}
              </p>
              <h2 className="mt-4 font-serif text-3xl leading-tight text-ink">
                <Link
                  className="hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  href={`/series/${item.slug}`}
                >
                  {item.title}
                </Link>
              </h2>
              <p className="mt-4 text-base leading-8 text-ink-muted">
                {item.description}
              </p>
              <ul className="mt-6 space-y-3 text-sm leading-6 text-ink-muted">
                {item.essays.map((essay) => (
                  <li key={essay.slug}>
                    <Link
                      className="text-ink underline-offset-4 hover:text-accent hover:underline"
                      href={`/essays/${essay.slug}`}
                    >
                      {essay.title}
                    </Link>
                    <span className="ml-3 text-ink-muted">
                      {formatEssayDate(essay.date)}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
