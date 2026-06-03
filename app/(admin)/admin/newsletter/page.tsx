import type { Metadata } from "next";
import { NewsletterCsvExportButton } from "@/components/admin/newsletter-csv-export-button";
import {
  formatAdminDateTime,
  formatNewsletterSource,
  getNewsletterStats,
  getNewsletterSubscribers,
  isAdminNewsletterAvailable,
  newsletterStatusLabel,
} from "@/lib/admin/newsletter";

export const metadata: Metadata = {
  title: "뉴스레터",
};

const summaryItems = [
  { key: "total", label: "총 구독자" },
  { key: "active", label: "활성 구독자" },
  { key: "unsubscribed", label: "구독 해지" },
] as const;

export default async function AdminNewsletterPage() {
  if (!isAdminNewsletterAvailable()) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-sm tracking-[0.18em] text-accent uppercase">
          뉴스레터
        </p>
        <h1 className="text-keep mt-4 font-serif text-3xl leading-tight text-ink">
          뉴스레터
        </h1>
        <p className="text-keep mt-5 max-w-2xl text-base leading-8 text-ink-muted">
          뉴스레터 관리를 사용하려면 Supabase URL과 서비스 역할 키가 필요합니다.
        </p>
      </div>
    );
  }

  const [stats, subscribers] = await Promise.all([
    getNewsletterStats(),
    getNewsletterSubscribers(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-sm tracking-[0.18em] text-accent uppercase">
            뉴스레터
          </p>
          <h1 className="text-keep mt-4 font-serif text-3xl leading-tight text-ink">
            뉴스레터
          </h1>
          <p className="text-keep mt-5 max-w-2xl text-base leading-8 text-ink-muted">
            뉴스레터 구독자 목록을 확인하고 CSV로 내보낼 수 있습니다.
          </p>
        </div>
        <NewsletterCsvExportButton />
      </div>

      <section className="mt-10">
        <h2 className="text-sm tracking-[0.14em] text-accent uppercase">
          요약
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {summaryItems.map((item) => (
            <div
              className="rounded border border-line bg-paper-muted px-4 py-4"
              key={item.key}
            >
              <p className="text-keep text-sm text-ink-muted">{item.label}</p>
              <p className="mt-2 font-serif text-3xl text-ink">
                {stats[item.key]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {subscribers.length > 0 ? (
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line text-ink-muted">
                <th className="py-4 pr-4 font-medium" scope="col">
                  이메일
                </th>
                <th className="py-4 pr-4 font-medium" scope="col">
                  상태
                </th>
                <th className="py-4 pr-4 font-medium" scope="col">
                  유입 경로
                </th>
                <th className="py-4 font-medium" scope="col">
                  구독일
                </th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr className="border-b border-line" key={subscriber.id}>
                  <td className="text-keep py-4 pr-4 align-top text-base text-ink">
                    {subscriber.email}
                  </td>
                  <td className="py-4 pr-4 align-top">
                    <span
                      className={
                        subscriber.status === "active"
                          ? "text-keep font-medium text-ink"
                          : "text-keep text-ink-muted"
                      }
                    >
                      {newsletterStatusLabel(subscriber.status)}
                    </span>
                  </td>
                  <td className="text-keep py-4 pr-4 align-top text-ink-muted">
                    {formatNewsletterSource(subscriber.source)}
                  </td>
                  <td className="py-4 align-top text-ink-muted">
                    {formatAdminDateTime(subscriber.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-10 rounded border border-line bg-paper-muted px-4 py-6">
          <p className="text-keep text-base leading-8 text-ink-muted">
            아직 뉴스레터 구독자가 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}
