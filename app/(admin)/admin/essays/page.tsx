import type { Metadata } from "next";
import Link from "next/link";
import { signOutAdmin } from "@/app/(admin)/admin/actions";
import {
  formatAdminDate,
  formatAdminDateTime,
  listAdminEssays,
} from "@/lib/admin/essays";
import type { EssayStatus } from "@/lib/content/db-types";

export const metadata: Metadata = {
  title: "글 관리",
};

function statusLabel(status: EssayStatus) {
  return status === "published" ? "공개" : "임시";
}

export default async function AdminEssaysPage() {
  const essays = await listAdminEssays();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-sm tracking-[0.18em] text-accent uppercase">글</p>
          <h1 className="text-keep mt-4 font-serif text-3xl leading-tight text-ink">
            글 관리
          </h1>
          <p className="text-keep mt-5 max-w-xl text-base leading-8 text-ink-muted">
            Supabase에 저장된 원고입니다. 공개 서재는 CONTENT_SOURCE 환경 변수에
            따라 MDX 또는 Supabase를 사용합니다.
          </p>
        </div>
        <Link
          className="inline-block rounded border border-accent bg-accent px-5 py-3 text-base font-medium text-paper transition hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          href="/admin/essays/new"
        >
          새 글 작성
        </Link>
      </div>

      {essays.length > 0 ? (
        <div className="mt-10 overflow-x-auto border-t border-line">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
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
                  <td className="py-4 pr-4 align-top text-ink-muted">
                    {statusLabel(essay.status)}
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
                    <Link
                      className="text-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                      href={`/admin/essays/${essay.id}`}
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
        <p className="text-keep mt-10 rounded border border-line bg-paper-muted px-4 py-6 text-base leading-8 text-ink-muted">
          아직 저장된 글이 없습니다. 「새 글 작성」으로 첫 원고를 추가할 수
          있습니다.
        </p>
      )}

      <form action={signOutAdmin} className="mt-12">
        <button
          className="text-sm text-ink-muted underline-offset-4 hover:text-ink hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          type="submit"
        >
          로그아웃
        </button>
      </form>
    </div>
  );
}
