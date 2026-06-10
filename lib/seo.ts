import type { Metadata } from "next";
import type { Essay } from "@/lib/essays";
import { getEssayCoverImage } from "@/lib/essay-cover-image.server";
import { toAbsoluteCoverImageUrl } from "@/lib/essay-cover-url";
import { scholarProfile } from "@/lib/profile";
import { getSiteOrigin, siteConfig } from "@/lib/site";
import type { ResearchItem } from "@/src/types/research";

/** Public index paths (주제 hub is `/categories`). */
export const publicSitemapStaticPaths = [
  "/",
  "/essays",
  "/series",
  "/categories",
  "/research",
  "/guestbook",
  "/about",
  "/scholar-dna",
  "/curation",
] as const;

export function toSitemapAbsoluteUrl(origin: string, path: string) {
  return path === "/" ? `${origin}/` : `${origin}${path}`;
}

export function toAbsoluteAssetUrl(assetPath: string) {
  return toSitemapAbsoluteUrl(getSiteOrigin(), assetPath);
}

export function buildDefaultOpenGraphImages(): NonNullable<
  Metadata["openGraph"]
>["images"] {
  const { path, width, height, alt } = siteConfig.og.default;

  return [
    {
      url: toAbsoluteAssetUrl(path),
      width,
      height,
      alt,
    },
  ];
}

export function buildEssayOpenGraphImages(
  essay: Pick<Essay, "slug" | "title" | "coverImageUrl" | "coverImageAlt">,
) {
  const cover = getEssayCoverImage(essay);

  if (cover.src) {
    return [
      {
        url: toAbsoluteCoverImageUrl(cover.src, getSiteOrigin()),
        alt: cover.alt,
      },
    ];
  }

  return buildDefaultOpenGraphImages();
}

export function toResearchLastModified(item: ResearchItem) {
  const year = item.year ?? 2000;
  const month = item.month ?? 12;

  return new Date(
    `${year}-${String(month).padStart(2, "0")}-01T00:00:00.000Z`,
  );
}

export function toSchemaIsoDate(date: string) {
  if (date.includes("T")) {
    return date;
  }

  return `${date}T00:00:00.000Z`;
}

export function buildArticleJsonLd(essay: Essay) {
  const origin = getSiteOrigin();
  const url = `${origin}/essays/${essay.slug}`;
  const datePublished = toSchemaIsoDate(essay.date);
  const dateModified = toSchemaIsoDate(essay.updatedAt ?? essay.date);

  const description = essay.description.trim();

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: essay.title,
    ...(description ? { description } : {}),
    author: {
      "@type": "Person",
      name: siteConfig.authorName,
    },
    datePublished,
    dateModified,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    inLanguage: "ko-KR",
  };
}

export function buildPersonJsonLd() {
  const origin = getSiteOrigin();

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Chun Jin-Ho",
    alternateName: [scholarProfile.name, scholarProfile.nameHanja],
    jobTitle: scholarProfile.role,
    url: `${origin}/about`,
    description: scholarProfile.introduction.paragraphs[0],
    knowsAbout: scholarProfile.research.areas.map((area) => area.title),
  };
}
