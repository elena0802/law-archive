import type { Metadata } from "next";
import Link from "next/link";
import {
  EssayStatusFilters,
  type EssayListFilter,
} from "@/components/admin/essay-status-filters";
import { essayStatusLabel } from "@/components/admin/essay-status-badge";
import {
  type AdminEssaySort,
  formatAdminDate,
  formatAdminDateTime,
  listAdminEssays,
  listAdminSeries,
} from "@/lib/admin/essays";

export const metadata: Metadata = {
  title: "글 관리",
};

type AdminEssaysPageProps = {
  searchParams: Promise<{
    status?: string;
    series?: string;
    q?: string;
    sort?: string;
  }>;
};

function parseListFilter(status: string | undefined): EssayListFilter {
  if (
    status === "published" ||
    status === "draft" ||
    status === "archived"
  ) {
    return status;
  }

  return "all";
}

const sortOptions: { value: AdminEssaySort; label: string }[] = [
  { value: "updated_desc", label: "최근 수정순" },
  { value: "updated_asc", label: "오래된 수정순" },
  { value: "date_desc", label: "글 날짜 최신순" },
  { value: "date_asc", label: "글 날짜 오래된순" },
  { value: "title_asc", label: "제목순" },
];

function parseSort(sort: string | undefined): AdminEssaySort {
  if (
    sort === "updated_desc" ||
    sort === "updated_asc" ||
    sort === "date_desc" ||
    sort === "date_asc" ||
    sort === "title_asc"
  ) {
    return sort;
  }

  return "updated_desc";
}

function parseSearchQuery(q: string | undefined) {
  return q?.trim() ?? "";
}

function resetFiltersHref() {
  return "/admin/essays";
}

export default async function AdminEssaysPage({
  searchParams,
}: AdminEssaysPageProps) {
  const { status, series: seriesSlug, q, sort } = await searchParams;
  const listFilter = parseListFilter(status);
  const parsedSort = parseSort(sort);
  const searchQuery = parseSearchQuery(q);
  const [seriesList, essays] = await Promise.all([
    listAdminSeries(),
    listAdminEssays({
      status: listFilter === "all" ? undefined : listFilter,
      seriesSlug: seriesSlug || undefined,
      query: searchQuery || undefined,
      sort: parsedSort,
    }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-sm tracking-[0.18em] text-accent uppercase">글</p>
          <h1 className="text-keep mt-4 font-serif text-3xl leading-tight text-ink">
            글 관리
          </h1>
          <p className="text-keep mt-5 max-w-2xl text-base leading-8 text-ink-muted">
            원고를 작성하고 임시 저장·공개·보관할 수 있습니다. 최근에 손본
            글이 위에 표시됩니다.
          </p>
        </div>
        <Link
          className="inline-block rounded border border-accent bg-accent px-5 py-3 text-base font-medium text-paper transition hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          href="/admin/essays/new"
        >
          새 글 작성
        </Link>
      </div>

      <EssayStatusFilters
        baseParams={{
          q: searchQuery || undefined,
          series: seriesSlug || undefined,
          sort: parsedSort,
        }}
        current={listFilter}
      />

      <form className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" method="get">
        {listFilter !== "all" ? (
          <input name="status" type="hidden" value={listFilter} />
        ) : null}

        <div className="sm:col-span-2 lg:col-span-1">
          <label className="text-keep block text-sm text-ink-muted" htmlFor="admin-search-q">
            검색
          </label>
          <input
            className="mt-2 w-full rounded border border-line bg-paper px-4 py-2.5 text-sm text-ink outline-none transition focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25"
            defaultValue={searchQuery}
            id="admin-search-q"
            name="q"
            placeholder="글 제목, 주소, 소개 검색"
            type="search"
          />
        </div>

        <div>
          <label className="text-keep block text-sm text-ink-muted" htmlFor="admin-search-series">
            연재
          </label>
          <select
            className="mt-2 w-full rounded border border-line bg-paper px-4 py-2.5 text-sm text-ink outline-none transition focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25"
            defaultValue={seriesSlug ?? ""}
            id="admin-search-series"
            name="series"
          >
            <option value="">전체 연재</option>
            {seriesList.map((series) => (
              <option key={series.slug} value={series.slug}>
                {series.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-keep block text-sm text-ink-muted" htmlFor="admin-search-sort">
            정렬
          </label>
          <select
            className="mt-2 w-full rounded border border-line bg-paper px-4 py-2.5 text-sm text-ink outline-none transition focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25"
            defaultValue={parsedSort}
            id="admin-search-sort"
            name="sort"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-3">
          <button
            className="rounded border border-accent bg-accent px-4 py-2 text-sm font-medium text-paper transition hover:bg-accent/90"
            type="submit"
          >
            적용
          </button>
          <Link
            className="rounded border border-line bg-paper px-4 py-2 text-sm text-ink-muted transition hover:border-accent/40 hover:text-ink"
            href={resetFiltersHref()}
          >
            전체 글 보기
          </Link>
        </div>
      </form>

      {essays.length > 0 ? (
        <div className="mt-8 overflow-x-auto border-t border-line">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line text-ink-muted">
                <th className="py-4 pr-4 font-medium" scope="col">
                  제목
                </th>
                <th className="py-4 pr-4 font-medium" scope="col">
                  상태
                </th>
                <th className="py-4 pr-4 font-medium" scope="col">
                  글 날짜
                </th>
                <th className="py-4 pr-4 font-medium" scope="col">
                  연재
                </th>
                <th className="py-4 pr-4 font-medium" scope="col">
                  수정일
                </th>
                <th className="py-4 font-medium" scope="col">
                  <span className="sr-only">작업</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {essays.map((essay) => (
                <tr className="border-b border-line" key={essay.id}>
                  <td className="py-4 pr-4 align-top">
                    <span className="text-keep text-base text-ink">
                      {essay.title}
                    </span>
                  </td>
                  <td className="py-4 pr-4 align-top">
                    <span
                      className={
                        essay.status === "published"
                          ? "text-keep font-medium text-ink"
                          : "text-keep text-ink-muted"
                      }
                    >
                      {essayStatusLabel(essay.status)}
                    </span>
                  </td>
                  <td className="py-4 pr-4 align-top text-ink-muted">
                    {formatAdminDate(essay.essay_date)}
                  </td>
                  <td className="text-keep py-4 pr-4 align-top text-ink-muted">
                    {essay.series_title}
                  </td>
                  <td className="py-4 pr-4 align-top text-ink-muted">
                    {formatAdminDateTime(essay.updated_at)}
                  </td>
                  <td className="py-4 align-top">
                    <div className="flex flex-col gap-2">
                      <Link
                        className="text-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                        href={`/admin/essays/${essay.id}`}
                      >
                        수정
                      </Link>
                      <Link
                        className="text-keep text-ink-muted underline-offset-4 hover:text-ink hover:underline"
                        href={`/preview/${essay.slug}`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        미리보기
                      </Link>
                      {essay.status === "published" ? (
                        <Link
                          className="text-keep text-ink-muted underline-offset-4 hover:text-ink hover:underline"
                          href={`/essays/${essay.slug}`}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          공개 사이트에서 보기
                        </Link>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-10 rounded border border-line bg-paper-muted px-4 py-6">
          <p className="text-keep text-base leading-8 text-ink-muted">
            조건에 맞는 글이 없습니다.
          </p>
          <Link
            className="mt-3 inline-block text-sm text-accent underline-offset-4 hover:underline"
            href={resetFiltersHref()}
          >
            전체 글 보기
          </Link>
        </div>
      )}
    </div>
  );
}
