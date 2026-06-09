import type { Metadata } from "next";
import { ScholarDnaForm } from "@/components/scholar-dna-form";
import { Section } from "@/components/section";
import { isScholarDnaAvailable } from "@/lib/scholar-dna";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Scholar DNA",
  description:
    "대표 논문 제목으로 돌아보는 학문 인생. AI가 연구의 흐름과 관심사를 읽어 정리해 드립니다.",
  alternates: {
    canonical: "/scholar-dna",
  },
  openGraph: {
    title: `Scholar DNA | ${siteConfig.name}`,
    description:
      "대표 논문 제목으로 돌아보는 학문 인생. AI가 연구의 흐름과 관심사를 읽어 정리해 드립니다.",
    url: "/scholar-dna",
    locale: "ko_KR",
    siteName: siteConfig.name,
  },
};

export default function ScholarDnaPage() {
  const available = isScholarDnaAvailable();

  return (
    <Section size="reading" className="py-page">
      <header>
        <p className="mb-6 text-sm tracking-[0.18em] text-accent uppercase">
          Scholar DNA
        </p>
        <h1 className="text-keep font-serif text-4xl leading-[1.55] text-ink sm:text-5xl">
          연구 논문으로 돌아보는
          <br />
          나의 학문 인생
        </h1>
      </header>

      {!available ? (
        <p className="text-keep mt-10 text-base leading-8 text-ink-muted">
          Scholar DNA 기능을 사용할 수 없습니다. Supabase 설정을 확인해 주세요.
        </p>
      ) : (
        <section
          aria-labelledby="scholar-dna-form-guidance"
          className="mt-14 border-t border-line pt-8"
        >
          <p
            className="text-keep text-sm leading-7 text-ink-muted"
            id="scholar-dna-form-guidance"
          >
            대표 논문 제목만 입력해 주세요.
            <br />
            AI가 논문 제목을 바탕으로 연구의 흐름과 관심사를 추정합니다.
          </p>
          <div className="mt-6">
            <ScholarDnaForm />
          </div>
        </section>
      )}
    </Section>
  );
}
