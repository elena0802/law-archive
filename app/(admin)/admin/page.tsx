import type { Metadata } from "next";
import Link from "next/link";
import { essayStatusLabel } from "@/components/admin/essay-status-badge";
import { formatAdminDateTime } from "@/lib/admin/essays";
import {
  getAdminDashboardAttention,
  getAdminDashboardCounts,
  listRecentAdminEssays,
} from "@/lib/admin/dashboard";

export const metadata: Metadata = {
  title: "대시보드",
};

const summaryItems = [
  { key: "total", label: "전체 글", href: "/admin/essays" },
  { key: "published", label: "공개", href: "/admin/essays?status=published" },
  { key: "draft", label: "임시 저장", href: "/admin/essays?status=draft" },
  { key: "archived", label: "보관", href: "/admin/essays?status=archived" },
  { key: "deleted", label: "휴지통", href: "/admin/essays?status=deleted" },
] as const;

function formatCountLabel(count: number) {
  return new Intl.NumberFormat("ko-KR").format(count);
}

export default async function AdminIndexPage() {
  const [counts, recentEssays, attention] = await Promise.all([
    getAdminDashboardCounts(),
    listRecentAdminEssays(5),
    getAdminDashboardAttention(),
  ]);

  const commentsAttentionAvailable = attention.pendingComments !== null;
  const pendingCommentCount = attention.pendingComments ?? 0;
  const hasPendingComments = pendingCommentCount > 0;

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
            <Link
              className="rounded border border-line bg-paper-muted px-4 py-4 transition hover:border-accent/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              href={item.href}
              key={item.key}
            >
              <p className="text-keep text-sm text-ink-muted">{item.label}</p>
              <p className="mt-2 font-serif text-3xl text-ink">
                {counts[item.key]}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm tracking-[0.14em] text-accent uppercase">
          확인이 필요한 항목
        </h2>
        {commentsAttentionAvailable ? (
          hasPendingComments ? (
            <ul className="mt-4 list-none space-y-2 p-0">
              <li>
                <Link
                  className="flex items-baseline justify-between gap-4 rounded border border-line bg-paper-muted px-4 py-4 transition hover:border-accent/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  href="/admin/comments?status=pending"
                >
                  <span className="text-keep text-base text-ink">
                    댓글 승인 대기
                  </span>
                  <span className="text-keep text-base text-ink-muted">
                    {formatCountLabel(pendingCommentCount)}건
                  </span>
                </Link>
              </li>
            </ul>
          ) : (
            <p className="text-keep mt-4 rounded border border-line bg-paper-muted px-4 py-6 text-base leading-8 text-ink-muted">
              현재 확인이 필요한 항목이 없습니다.
            </p>
          )
        ) : (
          <p className="text-keep mt-4 rounded border border-line bg-paper-muted px-4 py-6 text-base leading-8 text-ink-muted">
            관리 기능을 사용할 수 있으면 이곳에 확인할 항목이 표시됩니다.
          </p>
        )}
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
