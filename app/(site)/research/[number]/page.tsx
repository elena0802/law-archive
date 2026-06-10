import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/section";
import { ResearchPdfAccess } from "@/src/components/research/research-pdf-access";
import { researchItems } from "@/src/data/research";
import type { ResearchItem } from "@/src/types/research";
import {
  formatResearchDate,
  formatResearchPublicationDescription,
  getCategoryLabel,
  getResearchItemByNumber,
  parseResearchPublicationNumber,
} from "@/src/lib/research";
import { researchPagePath } from "@/lib/research-record";
import { buildDefaultOpenGraphImages } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

type ResearchDetailPageProps = {
  params: Promise<{
    number: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return researchItems.map((item) => ({
    number: String(item.number),
  }));
}

export async function generateMetadata({
  params,
}: ResearchDetailPageProps): Promise<Metadata> {
  const { number: numberParam } = await params;
  const publicationNumber = parseResearchPublicationNumber(numberParam);

  if (publicationNumber === null) {
    return {};
  }

  const item = getResearchItemByNumber(publicationNumber, researchItems);

  if (!item) {
    return {};
  }

  const title = `${item.title} | 연구업적 | ${siteConfig.nameEn}`;
  const description = formatResearchPublicationDescription(item);
  const canonical = `/research/${item.number}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      locale: "ko_KR",
      siteName: siteConfig.name,
      images: buildDefaultOpenGraphImages(),
    },
  };
}

type MetadataRow = {
  label: string;
  value: string;
};

function buildMetadataRows(item: ResearchItem): MetadataRow[] {
  const rows: MetadataRow[] = [
    { label: "논문 번호", value: `No. ${item.number}` },
  ];

  const dateLabel = formatResearchDate(item.year, item.month);
  if (dateLabel) {
    rows.push({ label: "게재 시기", value: dateLabel });
  }

  if (item.journal) {
    rows.push({ label: "학술지", value: item.journal });
  }

  if (item.publisher) {
    rows.push({ label: "발행처", value: item.publisher });
  }

  if (item.volume) {
    rows.push({ label: "권호", value: item.volume });
  }

  if (item.pages) {
    rows.push({ label: "면", value: item.pages });
  }

  if (item.field) {
    rows.push({ label: "학문 분야", value: item.field });
  }

  rows.push({ label: "연구 분야", value: getCategoryLabel(item.category) });

  if (item.authors) {
    rows.push({ label: "저자", value: item.authors });
  }

  return rows;
}

export default async function ResearchDetailPage({
  params,
}: ResearchDetailPageProps) {
  const { number: numberParam } = await params;
  const publicationNumber = parseResearchPublicationNumber(numberParam);

  if (publicationNumber === null) {
    notFound();
  }

  const item = getResearchItemByNumber(publicationNumber, researchItems);

  if (!item) {
    notFound();
  }

  const metadataRows = buildMetadataRows(item);

  return (
    <Section size="reading" className="py-page">
      <Link
        className="text-sm tracking-[0.1em] text-accent underline-offset-4 hover:underline"
        href={researchPagePath}
      >
        ← 연구업적 목록으로
      </Link>

      <header className="mt-10 border-b border-line pb-10">
        <p className="text-sm tracking-[0.18em] text-accent uppercase">
          Research Publication
        </p>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <h1 className="text-keep max-w-reading font-serif text-3xl leading-[1.2] text-ink sm:text-4xl">
            {item.title}
          </h1>
          {item.isRepresentative || item.isImportant ? (
            <div className="flex flex-wrap gap-2">
              {item.isRepresentative ? (
                <span className="inline-flex rounded-sm border border-line px-2 py-0.5 text-xs tracking-wide text-ink-muted">
                  대표 연구논문
                </span>
              ) : null}
              {item.isImportant ? (
                <span className="inline-flex rounded-sm border border-line px-2 py-0.5 text-xs tracking-wide text-ink-muted">
                  주요 논문
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </header>

      <dl className="mt-10 grid gap-0 border-t border-line">
        {metadataRows.map((row) => (
          <div
            key={row.label}
            className="grid gap-2 border-b border-line/70 py-5 sm:grid-cols-[7.5rem_1fr] sm:gap-6"
          >
            <dt className="text-sm text-ink-muted">{row.label}</dt>
            <dd className="text-keep text-base leading-relaxed text-ink">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <ResearchPdfAccess item={item} />
    </Section>
  );
}
