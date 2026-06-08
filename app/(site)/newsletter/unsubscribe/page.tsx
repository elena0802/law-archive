import type { Metadata } from "next";
import { NewsletterTokenUnsubscribeResult } from "@/components/newsletter-token-unsubscribe-result";
import { NewsletterUnsubscribeForm } from "@/components/newsletter-unsubscribe-form";
import { Section } from "@/components/section";

export const metadata: Metadata = {
  title: "뉴스레터 구독 해지",
  description:
    "형사법 아카이브 뉴스레터 구독을 해지할 수 있습니다.",
  alternates: {
    canonical: "/newsletter/unsubscribe",
  },
  robots: {
    index: false,
    follow: false,
  },
};

type NewsletterUnsubscribePageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function NewsletterUnsubscribePage({
  searchParams,
}: NewsletterUnsubscribePageProps) {
  const { token } = await searchParams;
  const trimmedToken = token?.trim();

  return (
    <Section size="reading" className="py-page">
      <p className="mb-6 text-sm tracking-[0.18em] text-accent uppercase">
        뉴스레터
      </p>
      <h1 className="text-keep font-serif text-4xl leading-tight text-ink sm:text-5xl">
        뉴스레터 구독 해지
      </h1>

      {trimmedToken ? (
        <>
          <p className="text-keep mt-6 max-w-2xl text-base leading-8 text-ink-muted">
            구독 해지 링크를 확인하고 있습니다.
          </p>
          <div className="mt-8">
            <NewsletterTokenUnsubscribeResult token={trimmedToken} />
          </div>
        </>
      ) : (
        <>
          <p className="text-keep mt-6 max-w-2xl text-base leading-8 text-ink-muted">
            더 이상 형사법 아카이브의 새 글 알림을 받고 싶지 않다면 이메일을
            입력해 주세요.
          </p>
          <NewsletterUnsubscribeForm />
        </>
      )}
    </Section>
  );
}
