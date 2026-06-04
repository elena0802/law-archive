import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { formatEssayDate, type Essay } from "@/lib/essays";

type HomeRecentWritingProps = {
  essays: readonly Essay[];
};

export function HomeRecentWriting({ essays }: HomeRecentWritingProps) {
  return (
    <section aria-labelledby="home-recent-writing-heading">
      <h2
        id="home-recent-writing-heading"
        className="text-keep font-serif text-3xl leading-tight text-ink sm:text-4xl"
      >
        최근 글
      </h2>
      <p className="text-keep mt-4 text-base leading-[1.85] text-ink-muted">
        지금 이어지는 글쓰기와 사유의 기록입니다.
      </p>
      <div className="mx-auto mt-8 max-w-reading">
        {essays.length > 0 ? (
          essays.map((essay) => (
            <ArticleCard
              key={essay.slug}
              description={essay.description}
              eyebrow={formatEssayDate(essay.date)}
              href={`/essays/${essay.slug}`}
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
    </section>
  );
}
