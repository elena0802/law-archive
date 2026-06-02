import type { Metadata } from "next";
import Link from "next/link";
import {
  EssayStatusFilters,
  type EssayListFilter,
} from "@/components/admin/essay-status-filters";
import { essayStatusLabel } from "@/components/admin/essay-status-badge";
import {
  formatAdminDate,
  formatAdminDateTime,
  listAdminEssays,
} from "@/lib/admin/essays";
import type { EssayStatus } from "@/lib/content/db-types";

export const metadata: Metadata = {
  title: "글 관리",
};

type AdminEssaysPageProps = {
  searchParams: Promise<{ status?: string }>;
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

function filterEssays<T extends { status: EssayStatus }>(
  essays: T[],
  filter: EssayListFilter,
) {
  if (filter === "all") {
    return essays;
  }

  return essays.filter((essay) => essay.status === filter);
}

export default async function AdminEssaysPage({
  searchParams,
}: AdminEssaysPageProps) {
  const { status } = await searchParams;
  const listFilter = parseListFilter(status);
  const allEssays = await listAdminEssays();
  const essays = filterEssays(allEssays, listFilter);

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

      <EssayStatusFilters current={listFilter} />

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
        <p className="text-keep mt-10 rounded border border-line bg-paper-muted px-4 py-6 text-base leading-8 text-ink-muted">
          {listFilter === "all"
            ? "아직 저장된 글이 없습니다. 「새 글 작성」으로 첫 원고를 추가할 수 있습니다."
            : "이 상태에 해당하는 글이 없습니다."}
        </p>
      )}
    </div>
  );
}
