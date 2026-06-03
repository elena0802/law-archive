import type { Essay } from "@/lib/essays";
import { scholarProfile } from "@/lib/profile";
import { getSiteOrigin, siteConfig } from "@/lib/site";

/** Public index paths (주제 hub is `/categories`). */
export const publicSitemapStaticPaths = [
  "/",
  "/essays",
  "/series",
  "/categories",
  "/about",
] as const;

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

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: essay.title,
    description: essay.description,
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
