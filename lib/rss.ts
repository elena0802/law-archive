import { getAllEssays, type Essay } from "@/lib/essays";
import { getSiteOrigin, siteConfig } from "@/lib/site";

const RSS_ITEM_LIMIT = 50;
const RSS_GENERATOR = "Scholar Archive";
const RSS_LANGUAGE = "ko-KR";

export function escapeXml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatRssPubDate(date: string) {
  const parsed = date.includes("T") ? new Date(date) : new Date(`${date}T00:00:00Z`);
  return parsed.toUTCString();
}

function essayItemUrl(origin: string, slug: string) {
  return `${origin}/essays/${slug}`;
}

function buildCategoryElements(essay: Essay) {
  const elements: string[] = [];

  if (essay.category.trim()) {
    elements.push(`<category>${escapeXml(essay.category)}</category>`);
  }

  if (essay.series.trim()) {
    elements.push(
      `<category domain="series">${escapeXml(essay.series)}</category>`,
    );
  }

  return elements.join("\n      ");
}

function buildRssItem(essay: Essay, origin: string) {
  const link = essayItemUrl(origin, essay.slug);
  const categoryElements = buildCategoryElements(essay);
  const categoryBlock = categoryElements
    ? `\n      ${categoryElements}`
    : "";

  return `    <item>
      <title>${escapeXml(essay.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${formatRssPubDate(essay.date)}</pubDate>
      <description>${escapeXml(essay.description)}</description>${categoryBlock}
    </item>`;
}

export async function buildRssFeedXml() {
  const origin = getSiteOrigin();
  const essays = (await getAllEssays()).slice(0, RSS_ITEM_LIMIT);
  const channelLink = origin;
  const lastBuildDate =
    essays.length > 0 ? formatRssPubDate(essays[0].date) : new Date().toUTCString();
  const items = essays.map((essay) => buildRssItem(essay, origin)).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${escapeXml(channelLink)}</link>
    <description>${escapeXml(siteConfig.tagline)}</description>
    <language>${RSS_LANGUAGE}</language>
    <generator>${escapeXml(RSS_GENERATOR)}</generator>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}
