import type { Metadata } from "next";
import Link from "next/link";
import { requireEditorSupabase } from "@/lib/admin/require-editor";
import { loadArchiveDigestSourceData } from "@/lib/newsletter-email/archive-digest-source";
import { buildArchiveDigestEmailContent } from "@/lib/newsletter/templates/archive-digest";
import { getSiteOrigin } from "@/lib/site";

export const metadata: Metadata = {
  title: "뉴스레터 미리보기",
  robots: { index: false, follow: false },
};

const sampleIntro =
  "이번 호에는 최근에 기록한 글과 함께, 요즘 읽고 보고 있는 콘텐츠를 소개합니다.";

export default async function NewsletterPreviewPage() {
  await requireEditorSupabase();

  const siteOrigin = getSiteOrigin();
  const source = await loadArchiveDigestSourceData(null, siteOrigin);
  const content = buildArchiveDigestEmailContent({
    subject: "형사법 아카이브 Digest (미리보기)",
    introMessage: sampleIntro,
    featuredEssay: source.featuredEssay,
    curationItems: source.curationItems,
    siteOrigin,
    unsubscribeUrl: `${siteOrigin}/newsletter/unsubscribe?token=preview`,
    variant: "test",
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-sm tracking-[0.18em] text-accent uppercase">
        뉴스레터
      </p>
      <h1 className="text-keep mt-4 font-serif text-3xl leading-tight text-ink">
        Archive Digest 미리보기
      </h1>
      <p className="text-keep mt-5 max-w-2xl text-base leading-8 text-ink-muted">
        본문 중심 Digest 미리보기입니다. 이번 글 본문, 댓글·공유 CTA, 요즘의
        시선 리스트가 순서대로 표시됩니다. 링크는 새 탭에서 열립니다.
      </p>
      <p className="mt-6">
        <Link
          className="text-sm text-accent underline underline-offset-2"
          href="/admin/newsletter"
        >
          ← 뉴스레터 발송으로 돌아가기
        </Link>
      </p>

      <div
        className="mt-10 overflow-hidden rounded border border-line bg-paper-muted"
        dangerouslySetInnerHTML={{ __html: content.html }}
      />
    </div>
  );
}
