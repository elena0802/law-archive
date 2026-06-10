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
    aiResearchNote: source.aiResearchNote,
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
        최근 공개 콘텐츠로 조합한 HTML 이메일 미리보기입니다. 카드 전체를
        클릭하면 새 탭에서 링크가 열립니다. 실제 발송 전 테스트 메일로 한 번
        더 확인해 주세요.
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
