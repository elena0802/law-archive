import Link from "next/link";
import { EssayEditorialCard } from "@/components/home/essay-editorial-card";
import { HomeSectionHeader } from "@/components/home/home-section-header";
import type { Essay } from "@/lib/essays";

type HomeRecentWritingProps = {
  essays: readonly Essay[];
};

export function HomeRecentWriting({ essays }: HomeRecentWritingProps) {
  return (
    <section aria-labelledby="home-recent-writing-heading">
      <HomeSectionHeader
        description="지금 이어지는 글쓰기와 사유의 기록입니다."
        headingId="home-recent-writing-heading"
        title="최근 글"
      />
      {essays.length > 0 ? (
        <ul className="mt-12 grid list-none gap-8 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {essays.map((essay) => (
            <li key={essay.slug} className="min-w-0">
              <EssayEditorialCard essay={essay} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-12 border border-line/80 px-6 py-10 text-base leading-8 text-ink-muted">
          아직 공개된 글이 없습니다.
        </p>
      )}
      <Link
        className="mt-10 inline-block text-sm text-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        href="/essays"
      >
        모든 글 보기
      </Link>
    </section>
  );
}
