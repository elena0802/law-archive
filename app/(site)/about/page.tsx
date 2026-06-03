import type { Metadata } from "next";
import Link from "next/link";
import { AboutSection } from "@/components/about-section";
import { JsonLd } from "@/components/json-ld";
import { ProfileNarrative } from "@/components/profile-narrative";
import { ProfileSelectedBooks } from "@/components/profile-selected-books";
import { Section } from "@/components/section";
import { scholarProfile } from "@/lib/profile";
import { researchPagePath } from "@/lib/research-record";
import { buildPersonJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

const profile = scholarProfile;

export const metadata: Metadata = {
  title: "서재 소개",
  description:
    "천진호 형사법학자의 연구 궤적과 이 디지털 서재가 남기려는 기록에 대한 소개입니다.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: `서재 소개 | ${siteConfig.name}`,
    description:
      "천진호 형사법학자의 연구 궤적과 이 디지털 서재가 남기려는 기록에 대한 소개입니다.",
    url: "/about",
    locale: "ko_KR",
    siteName: siteConfig.name,
  },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={buildPersonJsonLd()} />
      <Section size="reading" className="py-page">
      <header>
        <p className="mb-6 text-sm tracking-[0.18em] text-accent uppercase">
          {siteConfig.about.pageTitle}
        </p>
        <h1 className="text-keep font-serif text-4xl leading-[1.12] text-ink sm:text-5xl">
          {profile.name}
        </h1>
        <p className="mt-3 text-base tracking-wide text-ink-muted">
          {profile.role}
        </p>
      </header>

      <div className="mt-14 space-y-10">
        <ProfileNarrative section={profile.introduction} />
        <ProfileNarrative section={profile.academicBackground} />
        <AboutSection heading={profile.research.heading} id={profile.research.id}>
          {profile.research.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-keep not-first:mt-5">
              {paragraph}
            </p>
          ))}
          <p className="text-keep mt-5 text-base leading-[1.85] text-ink-muted">
            <Link
              href={researchPagePath}
              className="text-ink underline decoration-line underline-offset-4 hover:text-accent"
            >
              연구업적
            </Link>
            에서 대표 논문과 연도별 연구 목록을 볼 수 있습니다.
          </p>
        </AboutSection>
        <ProfileNarrative section={profile.academicActivities} />
        <ProfileNarrative section={profile.publicService} />
        <ProfileSelectedBooks
          section={profile.selectedBooks}
          intro={profile.selectedBooks.intro}
        />
        <ProfileNarrative section={profile.whyArchive} />
      </div>
    </Section>
    </>
  );
}
