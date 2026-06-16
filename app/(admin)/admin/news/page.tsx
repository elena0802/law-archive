import type { Metadata } from "next";
import Link from "next/link";
import {
  listAdminNewsItems,
  parseNewsFilter,
} from "@/lib/admin/news";
import { getAdminNewsNoticeMessage } from "@/lib/admin/admin-notices";

export const metadata: Metadata = {
  title: "소식 관리",
};

type AdminNewsPageProps = {
  searchParams: Promise<{ status?: string; notice?: string }>;
};

function publishedLabel(published: boolean) {
  return published ? "공개" : "비공개";
}

export default async function AdminNewsPage({ searchParams }: AdminNewsPageProps) {
  const { status, notice } = await searchParams;
  const filter = parseNewsFilter(status);
  const items = await listAdminNewsItems(filter);
  const noticeMessage = getAdminNewsNoticeMessage(notice);

  const tabs = [
    { key: "all", label: "전체", href: "/admin/news" },
    { key: "published", label: "공개", href: "/admin/news?status=published" },
    { key: "hidden", label: "비공개", href: "/admin/news?status=hidden" },
  ] as const;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-sm tracking-[0.18em] text-accent uppercase">소식</p>
          <h1 className="text-keep mt-4 font-serif text-3xl leading-tight text-ink">
            소식 관리
          </h1>
          <p className="text-keep mt-5 max-w-2xl text-base leading-8 text-ink-muted">
            홈페이지와 소식 페이지에 표시되는 활동 기록을 관리합니다.
          </p>
        </div>
        <Link
          className="inline-block rounded border border-accent bg-accent px-5 py-3 text-base font-medium text-paper transition hover:bg-accent/90"
          href="/admin/news/new"
        >
          새 소식 추가
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
          <table className="w-full min-w-[58rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line text-ink-muted">
                <th className="py-4 pr-4 font-medium">날짜</th>
                <th className="py-4 pr-4 font-medium">분류</th>
                <th className="py-4 pr-4 font-medium">제목</th>
                <th className="py-4 pr-4 font-medium">Featured</th>
                <th className="py-4 pr-4 font-medium">공개 여부</th>
                <th className="py-4 font-medium">
                  <span className="sr-only">수정</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-b border-line" key={item.id}>
                  <td className="py-4 pr-4 font-serif tabular-nums text-ink-muted">
                    {item.date}
                  </td>
                  <td className="py-4 pr-4 text-ink-muted">{item.category}</td>
                  <td className="py-4 pr-4 text-base text-ink">{item.title}</td>
                  <td className="py-4 pr-4 text-ink-muted">
                    {item.featured ? "대표" : "—"}
                  </td>
                  <td className="py-4 pr-4 text-ink-muted">
                    {publishedLabel(item.published)}
                  </td>
                  <td className="py-4">
                    <Link
                      className="text-accent underline-offset-4 hover:underline"
                      href={`/admin/news/${item.id}`}
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
              <p>먼저 소식 항목을 추가해 주세요.</p>
              <Link
                className="mt-3 inline-block text-sm text-accent underline-offset-4 hover:underline"
                href="/admin/news/new"
              >
                새 소식 추가
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
