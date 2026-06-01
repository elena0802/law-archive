import type { Metadata } from "next";
import { AboutSection } from "@/components/about-section";
import { Section } from "@/components/section";
import { siteConfig } from "@/lib/site";

const { about } = siteConfig;

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
  },
};

export default function AboutPage() {
  return (
    <Section size="reading" className="py-page">
      <header>
        <p className="mb-6 text-sm tracking-[0.18em] text-accent uppercase">
          {about.pageTitle}
        </p>
        <h1 className="text-keep font-serif text-4xl leading-[1.12] text-ink sm:text-5xl">
          {about.scholarName}
        </h1>
        <p className="mt-3 text-base tracking-wide text-ink-muted">
          {about.role}
        </p>
      </header>

      <div className="mt-14 space-y-10">
        <AboutSection heading={about.introduction.heading} id="introduction">
          {about.introduction.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-keep not-first:mt-5">
              {paragraph}
            </p>
          ))}
        </AboutSection>

        <AboutSection
          heading={about.academicBackground.heading}
          id="academic-background"
        >
          {about.academicBackground.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-keep not-first:mt-5">
              {paragraph}
            </p>
          ))}
        </AboutSection>

        <AboutSection heading={about.research.heading} id="research">
          {about.research.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-keep not-first:mt-5">
              {paragraph}
            </p>
          ))}
        </AboutSection>

        <AboutSection
          heading={about.academicActivities.heading}
          id="academic-activities"
        >
          {about.academicActivities.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-keep not-first:mt-5">
              {paragraph}
            </p>
          ))}
        </AboutSection>

        <AboutSection heading={about.publicService.heading} id="public-service">
          {about.publicService.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-keep not-first:mt-5">
              {paragraph}
            </p>
          ))}
        </AboutSection>

        <AboutSection heading={about.selectedBooks.heading} id="selected-books">
          <ul className="list-none space-y-3 p-0">
            {about.selectedBooks.items.map((item) => (
              <li key={item.citation} className="text-keep">
                {item.citation}
              </li>
            ))}
          </ul>
        </AboutSection>

        <AboutSection heading={about.whyArchive.heading} id="why-archive">
          {about.whyArchive.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-keep not-first:mt-5">
              {paragraph}
            </p>
          ))}
        </AboutSection>
      </div>

      <details className="mt-14 border-t border-line pt-8 text-sm leading-7 text-ink-muted">
        <summary className="cursor-pointer text-ink hover:text-accent">
          {about.editorGuide.heading}
        </summary>
        <p className="text-keep mt-4">{about.editorGuide.body}</p>
      </details>
    </Section>
  );
}
