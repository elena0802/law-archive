import type { Metadata } from "next";
import { ArticleCard } from "@/components/article-card";
import { SearchForm } from "@/components/search-form";
import { Section } from "@/components/section";
import { getEssayCoverImage } from "@/lib/essay-cover-image.server";
import { formatEssayDate, searchEssays } from "@/lib/essays";

export const metadata: Metadata = {
  title: "검색",
  description: "제목, 소개, 본문, 연재명으로 글을 검색합니다.",
  alternates: { canonical: "/search" },
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? await searchEssays(query) : [];

  return (
    <>
      <Section size="reading" className="py-page">
        <p className="mb-6 text-sm tracking-[0.18em] text-accent uppercase">검색</p>
        <h1 className="text-keep font-serif text-4xl leading-[1.1] text-ink sm:text-5xl">
          글 검색
        </h1>
        <p className="text-keep mt-7 text-lg leading-9 text-ink-muted">
          제목, 소개, 본문, 연재명으로 공개된 글을 찾을 수 있습니다.
        </p>
        <SearchForm className="mt-8" method="get">
          <label className="sr-only" htmlFor="search-query">
            검색어
          </label>
          <div className="flex flex-wrap gap-2">
            <input
              className="w-full rounded border border-line bg-paper px-4 py-3 text-base text-ink outline-none transition focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25 sm:flex-1"
              defaultValue={query}
              id="search-query"
              name="q"
              placeholder="검색어를 입력하세요"
              type="search"
            />
            <button
              className="rounded border border-accent bg-accent px-5 py-3 text-base font-medium text-paper transition hover:bg-accent/90"
              type="submit"
            >
              검색
            </button>
          </div>
        </SearchForm>
      </Section>

      <Section size="wide" className="border-t border-line">
        <div className="mx-auto max-w-reading">
          {query ? (
            <p className="py-6 text-sm text-ink-muted">
              “{query}” 검색 결과 {results.length}건
            </p>
          ) : (
            <p className="py-6 text-sm text-ink-muted">
              검색어를 입력하면 결과가 표시됩니다.
            </p>
          )}

          {results.length > 0 ? (
            results.map((essay) => {
              const cover = getEssayCoverImage(essay);

              return (
                <ArticleCard
                  key={essay.slug}
                  coverAlt={cover.alt}
                  coverSrc={cover.src ?? undefined}
                  description={essay.description}
                  eyebrow={`${formatEssayDate(essay.date)} · ${essay.category}`}
                  href={`/essays/${essay.slug}`}
                  meta={`연재: ${essay.series}`}
                  title={essay.title}
                />
              );
            })
          ) : query ? (
            <p className="border-t border-line py-8 text-base leading-8 text-ink-muted">
              검색 결과가 없습니다. 다른 검색어로 다시 시도해 주세요.
            </p>
          ) : null}
        </div>
      </Section>
    </>
  );
}

