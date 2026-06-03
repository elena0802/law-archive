import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/preview/"],
    },
    sitemap: `${getSiteOrigin()}/sitemap.xml`,
  };
}
