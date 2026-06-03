import type { Metadata } from "next";
import Link from "next/link";
import { essayStatusLabel } from "@/components/admin/essay-status-badge";
import {
  formatAdminDateTime,
} from "@/lib/admin/essays";
import {
  getAdminDashboardCounts,
  listRecentAdminEssays,
} from "@/lib/admin/dashboard";

export const metadata: Metadata = {
  title: "대시보드",
};

const summaryItems = [
  { key: "total", label: "전체 글" },
  { key: "published", label: "공개" },
  { key: "draft", label: "임시 저장" },
  { key: "archived", label: "보관" },
  { key: "deleted", label: "휴지통" },
] as const;

export default async function AdminIndexPage() {
  const [counts, recentEssays] = await Promise.all([
    getAdminDashboardCounts(),
    listRecentAdminEssays(5),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div>
        <p className="text-sm tracking-[0.18em] text-accent uppercase">
          대시보드
        </p>
        <h1 className="text-keep mt-4 font-serif text-3xl leading-tight text-ink">
          서재 현황
        </h1>
        <p className="text-keep mt-5 max-w-2xl text-base leading-8 text-ink-muted">
          서재의 전체 흐름을 한눈에 확인하고, 다음 작업으로 바로 이동할 수
          있습니다.
        </p>
      </div>

      <section className="mt-10">
        <h2 className="text-sm tracking-[0.14em] text-accent uppercase">
          요약
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {summaryItems.map((item) => (
            <div
              className="rounded border border-line bg-paper-muted px-4 py-4"
              key={item.key}
            >
              <p className="text-keep text-sm text-ink-muted">{item.label}</p>
              <p className="mt-2 font-serif text-3xl text-ink">
                {counts[item.key]}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm tracking-[0.14em] text-accent uppercase">
          최근 수정
        </h2>
        {recentEssays.length > 0 ? (
          <div className="mt-4 overflow-x-auto border-t border-line">
            <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line text-ink-muted">
                  <th className="py-4 pr-4 font-medium" scope="col">
                    제목
                  </th>
                  <th className="py-4 pr-4 font-medium" scope="col">
                    상태
                  </th>
                  <th className="py-4 font-medium" scope="col">
                    수정일
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentEssays.map((essay) => (
                  <tr className="border-b border-line" key={essay.id}>
                    <td className="py-4 pr-4">
                      <Link
                        className="text-keep text-base text-ink underline-offset-4 hover:underline"
                        href={`/admin/essays/${essay.id}`}
                      >
                        {essay.title}
                      </Link>
                    </td>
                    <td className="py-4 pr-4 text-ink-muted">
                      {essayStatusLabel(essay.status)}
                    </td>
                    <td className="py-4 text-ink-muted">
                      {formatAdminDateTime(essay.updated_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-keep mt-4 rounded border border-line bg-paper-muted px-4 py-6 text-base leading-8 text-ink-muted">
            아직 등록된 글이 없습니다.
          </p>
        )}
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="text-sm tracking-[0.14em] text-accent uppercase">
          바로가기
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            className="rounded border border-line bg-paper px-5 py-3 text-sm text-ink-muted transition hover:border-accent/40 hover:text-ink"
            href="/admin/essays"
          >
            글 관리
          </Link>
          <Link
            className="rounded border border-accent bg-accent px-5 py-3 text-sm font-medium text-paper transition hover:bg-accent/90"
            href="/admin/essays/new"
          >
            새 글 작성
          </Link>
          <Link
            className="rounded border border-line bg-paper px-5 py-3 text-sm text-ink-muted transition hover:border-accent/40 hover:text-ink"
            href="/admin/series"
          >
            연재 관리
          </Link>
          <Link
            className="rounded border border-line bg-paper px-5 py-3 text-sm text-ink-muted transition hover:border-accent/40 hover:text-ink"
            href="/admin/comments"
          >
            댓글 관리
          </Link>
          <Link
            className="rounded border border-line bg-paper px-5 py-3 text-sm text-ink-muted transition hover:border-accent/40 hover:text-ink"
            href="/admin/newsletter"
          >
            뉴스레터
          </Link>
          <Link
            className="rounded border border-line bg-paper px-5 py-3 text-sm text-ink-muted transition hover:border-accent/40 hover:text-ink"
            href="/"
            rel="noopener noreferrer"
            target="_blank"
          >
            공개 서재 보기
          </Link>
        </div>
      </section>
    </div>
  );
}
