import type { Metadata } from "next";
import Link from "next/link";
import {
  listAdminSeriesWithCounts,
  parseSeriesFilter,
} from "@/lib/admin/series";

export const metadata: Metadata = {
  title: "연재 관리",
};

type AdminSeriesPageProps = {
  searchParams: Promise<{ status?: string }>;
};

function statusLabel(status: "active" | "hidden") {
  return status === "hidden" ? "숨김" : "활성";
}

export default async function AdminSeriesPage({ searchParams }: AdminSeriesPageProps) {
  const { status } = await searchParams;
  const filter = parseSeriesFilter(status);
  const series = await listAdminSeriesWithCounts(filter);

  const tabs = [
    { key: "all", label: "전체", href: "/admin/series" },
    { key: "active", label: "활성", href: "/admin/series?status=active" },
    { key: "hidden", label: "숨김", href: "/admin/series?status=hidden" },
  ] as const;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-sm tracking-[0.18em] text-accent uppercase">연재</p>
          <h1 className="text-keep mt-4 font-serif text-3xl leading-tight text-ink">
            연재 관리
          </h1>
          <p className="text-keep mt-5 max-w-2xl text-base leading-8 text-ink-muted">
            연재 구조를 정리하고 공개/숨김 상태를 관리합니다.
          </p>
        </div>
        <Link
          className="inline-block rounded border border-accent bg-accent px-5 py-3 text-base font-medium text-paper transition hover:bg-accent/90"
          href="/admin/series/new"
        >
          새 연재 작성
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = filter === tab.key;
          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "rounded-full border border-accent bg-accent px-4 py-2 text-sm font-medium text-paper"
                  : "rounded-full border border-line bg-paper px-4 py-2 text-sm text-ink-muted transition hover:border-accent/40 hover:text-ink"
              }
              href={tab.href}
              key={tab.key}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {series.length > 0 ? (
        <div className="mt-8 overflow-x-auto border-t border-line">
          <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line text-ink-muted">
                <th className="py-4 pr-4 font-medium">제목</th>
                <th className="py-4 pr-4 font-medium">주소</th>
                <th className="py-4 pr-4 font-medium">상태</th>
                <th className="py-4 pr-4 font-medium">홈 노출</th>
                <th className="py-4 pr-4 font-medium">글 수</th>
                <th className="py-4 pr-4 font-medium">순서</th>
                <th className="py-4 pr-4 font-medium">수정일</th>
                <th className="py-4 font-medium">
                  <span className="sr-only">작업</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {series.map((item) => (
                <tr className="border-b border-line" key={item.id}>
                  <td className="py-4 pr-4 text-base text-ink">{item.title}</td>
                  <td className="py-4 pr-4 text-ink-muted">{item.slug}</td>
                  <td className="py-4 pr-4 text-ink-muted">{statusLabel(item.status)}</td>
                  <td className="py-4 pr-4 text-ink-muted">
                    {item.featured ? (
                      <span className="text-keep inline-flex rounded-sm border border-line px-2 py-0.5 text-xs tracking-wide text-ink">
                        홈 노출
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-4 pr-4 text-ink-muted">{item.essay_count}</td>
                  <td className="py-4 pr-4 text-ink-muted">{item.display_order}</td>
                  <td className="py-4 pr-4 text-ink-muted">
                    {new Intl.DateTimeFormat("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    }).format(new Date(item.updated_at))}
                  </td>
                  <td className="py-4">
                    <Link
                      className="text-accent underline-offset-4 hover:underline"
                      href={`/admin/series/${item.id}`}
                    >
                      수정
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-keep mt-10 rounded border border-line bg-paper-muted px-4 py-6 text-base leading-8 text-ink-muted">
          {filter === "all" ? (
            <>
              <p>먼저 연재를 만들어 주세요.</p>
              <Link
                className="mt-3 inline-block text-sm text-accent underline-offset-4 hover:underline"
                href="/admin/series/new"
              >
                새 연재 작성
              </Link>
            </>
          ) : (
            <p>조건에 맞는 연재가 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}

