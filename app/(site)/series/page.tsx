import type { Metadata } from "next";
import { SeriesVolumeCard } from "@/components/series-volume-card";
import { Section } from "@/components/section";
import { getAllSeries } from "@/lib/essays";
import { siteConfig } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "연재",
  description:
    "같은 질문을 이어 받는 글들을 연재별로 묶은 서가입니다. 아카이브는 연재 단위로 읽을 수 있도록 정리되어 있습니다.",
  alternates: {
    canonical: "/series",
  },
    openGraph: {
      title: `연재 | ${siteConfig.name}`,
      description:
        "같은 질문을 이어 받는 글들을 연재별로 묶은 서가입니다. 아카이브는 연재 단위로 읽을 수 있도록 정리되어 있습니다.",
      url: "/series",
      locale: "ko_KR",
      siteName: siteConfig.name,
    },
};

export default async function SeriesPage() {
  const series = await getAllSeries();

  return (
    <>
      <Section size="reading" className="py-page">
        <p className="mb-6 text-sm tracking-[0.18em] text-accent uppercase">
          연재 서가
        </p>
        <h1 className="text-keep font-serif text-4xl leading-[1.1] text-ink sm:text-5xl">
          연재
        </h1>
        <p className="text-keep mt-7 text-lg leading-9 text-ink-muted">
          이 아카이브는 개별 글보다 연재를 먼저 묶어 둡니다. 하나의 질문을 여러
          편이 이어 받으며, 각 연재는 한 권의 기록처럼 읽을 수 있습니다.
        </p>
      </Section>

      <Section size="reading" className="border-t border-line">
        {series.length > 0 ? (
          <div>
            {series.map((item) => (
              <SeriesVolumeCard key={item.slug} series={item} />
            ))}
          </div>
        ) : (
          <p className="py-8 text-base leading-8 text-ink-muted">
            아직 공개된 연재가 없습니다. 같은 연재명을 가진 글이 공개되면 이곳에
            서가가 채워집니다.
          </p>
        )}
      </Section>
    </>
  );
}
