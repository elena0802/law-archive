import { buildRssFeedXml } from "@/lib/rss";

export const revalidate = 3600;

export async function GET() {
  const xml = await buildRssFeedXml();

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
