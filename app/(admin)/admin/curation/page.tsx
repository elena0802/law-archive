import type { Metadata } from "next";
import Link from "next/link";
import {
  curationTypeLabel,
  listAdminCurationItems,
  parseCurationFilter,
} from "@/lib/admin/curation";
import { getAdminCurationNoticeMessage } from "@/lib/admin/admin-notices";

export const metadata: Metadata = {
  title: "요즘의 시선 관리",
};

type AdminCurationPageProps = {
  searchParams: Promise<{ status?: string; notice?: string }>;
};

function visibilityLabel(isVisible: boolean) {
  return isVisible ? "공개" : "숨김";
}

export default async function AdminCurationPage({
  searchParams,
}: AdminCurationPageProps) {
  const { status, notice } = await searchParams;
  const filter = parseCurationFilter(status);
  const items = await listAdminCurationItems(filter);
  const noticeMessage = getAdminCurationNoticeMessage(notice);

  const tabs = [
    { key: "all", label: "전체", href: "/admin/curation" },
    { key: "visible", label: "공개", href: "/admin/curation?status=visible" },
    { key: "hidden", label: "숨김", href: "/admin/curation?status=hidden" },
  ] as const;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-sm tracking-[0.18em] text-accent uppercase">
            큐레이션
          </p>
          <h1 className="text-keep mt-4 font-serif text-3xl leading-tight text-ink">
            요즘의 시선 관리
          </h1>
          <p className="text-keep mt-5 max-w-2xl text-base leading-8 text-ink-muted">
            교수님이 추천하는 유튜브, 기사, 외부글, 논문, 책을 관리합니다.
          </p>
        </div>
        <Link
          className="inline-block rounded border border-accent bg-accent px-5 py-3 text-base font-medium text-paper transition hover:bg-accent/90"
          href="/admin/curation/new"
        >
          새 항목 추가
        </Link>
      </div>

      {noticeMessage ? (
        <p className="text-keep mt-8 rounded border border-line bg-paper-muted px-5 py-4 text-base leading-7 text-ink">
          {noticeMessage}
        </p>
      ) : null}

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

      {items.length > 0 ? (
        <div className="mt-8 overflow-x-auto border-t border-line">
          <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line text-ink-muted">
                <th className="py-4 pr-4 font-medium">유형</th>
                <th className="py-4 pr-4 font-medium">제목</th>
                <th className="py-4 pr-4 font-medium">출처</th>
                <th className="py-4 pr-4 font-medium">상태</th>
                <th className="py-4 pr-4 font-medium">홈 대표</th>
                <th className="py-4 pr-4 font-medium">순서</th>
                <th className="py-4 pr-4 font-medium">추천일</th>
                <th className="py-4 font-medium">
                  <span className="sr-only">작업</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-b border-line" key={item.id}>
                  <td className="py-4 pr-4 text-ink-muted">
                    {curationTypeLabel(item.type)}
                  </td>
                  <td className="py-4 pr-4 text-base text-ink">{item.title}</td>
                  <td className="py-4 pr-4 text-ink-muted">
                    {item.source.trim() || "—"}
                  </td>
                  <td className="py-4 pr-4 text-ink-muted">
                    {visibilityLabel(item.is_visible)}
                  </td>
                  <td className="py-4 pr-4 text-ink-muted">
                    {item.type === "youtube" && item.is_featured ? "유튜브" : "—"}
                  </td>
                  <td className="py-4 pr-4 text-ink-muted">{item.sort_order}</td>
                  <td className="py-4 pr-4 text-ink-muted">
                    {new Intl.DateTimeFormat("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(new Date(item.recommended_at))}
                  </td>
                  <td className="py-4">
                    <Link
                      className="text-accent underline-offset-4 hover:underline"
                      href={`/admin/curation/${item.id}`}
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
              <p>먼저 큐레이션 항목을 추가해 주세요.</p>
              <Link
                className="mt-3 inline-block text-sm text-accent underline-offset-4 hover:underline"
                href="/admin/curation/new"
              >
                새 항목 추가
              </Link>
            </>
          ) : (
            <p>조건에 맞는 항목이 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}
