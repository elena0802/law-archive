import type { MetadataRoute } from "next";
import { getAllEssays } from "@/lib/essays";
import { publicSitemapStaticPaths } from "@/lib/seo";
import { getSiteOrigin } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getSiteOrigin();
  const essays = await getAllEssays();

  const staticEntries: MetadataRoute.Sitemap = publicSitemapStaticPaths.map(
    (path) => ({
      url: path === "/" ? `${origin}/` : `${origin}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "/" ? "weekly" : "monthly",
      priority: path === "/" ? 1 : 0.8,
    }),
  );

  const essayEntries: MetadataRoute.Sitemap = essays.map((essay) => ({
    url: `${origin}/essays/${essay.slug}`,
    lastModified: new Date(essay.updatedAt ?? essay.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...essayEntries];
}
