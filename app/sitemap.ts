import type { MetadataRoute } from "next";
import { getAllCategories, getAllEssays, getAllSeries } from "@/lib/essays";
import {
  publicSitemapStaticPaths,
  toResearchLastModified,
  toSitemapAbsoluteUrl,
} from "@/lib/seo";
import { getSiteOrigin } from "@/lib/site";
import { researchItems } from "@/src/data/research";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getSiteOrigin();
  const [essays, seriesList, categories] = await Promise.all([
    getAllEssays(),
    getAllSeries(),
    getAllCategories(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = publicSitemapStaticPaths.map(
    (path) => ({
      url: toSitemapAbsoluteUrl(origin, path),
      lastModified: new Date(),
      changeFrequency: path === "/" ? "weekly" : "monthly",
      priority: path === "/" ? 1 : 0.8,
    }),
  );

  const essayEntries: MetadataRoute.Sitemap = essays.map((essay) => ({
    url: toSitemapAbsoluteUrl(origin, `/essays/${essay.slug}`),
    lastModified: new Date(essay.updatedAt ?? essay.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const seriesEntries: MetadataRoute.Sitemap = seriesList
    .filter((series) => series.count > 0)
    .map((series) => ({
      url: toSitemapAbsoluteUrl(origin, `/series/${series.slug}`),
      lastModified: new Date(series.latestDate),
      changeFrequency: "monthly",
      priority: 0.75,
    }));

  const categoryEntries: MetadataRoute.Sitemap = categories
    .filter((category) => category.count > 0)
    .map((category) => ({
      url: toSitemapAbsoluteUrl(origin, `/categories/${category.slug}`),
      lastModified: new Date(category.latestEssays[0]?.date ?? Date.now()),
      changeFrequency: "monthly",
      priority: 0.75,
    }));

  const researchEntries: MetadataRoute.Sitemap = researchItems.map((item) => ({
    url: toSitemapAbsoluteUrl(origin, `/research/${item.number}`),
    lastModified: toResearchLastModified(item),
    changeFrequency: "yearly",
    priority: 0.65,
  }));

  return [
    ...staticEntries,
    ...essayEntries,
    ...seriesEntries,
    ...categoryEntries,
    ...researchEntries,
  ];
}
