import type { Essay, EssaySeries } from "@/lib/essays";
import { getSeriesIntroduction } from "@/lib/series";

export type SeriesVolumeSource = {
  title: string;
  slug: string;
  description: string;
  sortKey: number;
};

function getSeriesDescription(seriesTitle: string, count: number) {
  return `${seriesTitle}에 속한 ${count}편의 글을 한 흐름으로 모아둔 아카이브입니다.`;
}

export function sortEssaysByDateAsc(essays: Essay[]) {
  return [...essays].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

export function sortEssaysByDateDesc(essays: Essay[]) {
  return [...essays].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function buildEssaySeriesList(
  volumes: SeriesVolumeSource[],
  essays: Essay[],
): EssaySeries[] {
  const essaysByTitle = new Map<string, Essay[]>();

  for (const essay of essays) {
    const list = essaysByTitle.get(essay.series) ?? [];
    list.push(essay);
    essaysByTitle.set(essay.series, list);
  }

  return volumes
    .map((volume) => {
      const essaysInSeries = essaysByTitle.get(volume.title) ?? [];
      const sortedEssays = sortEssaysByDateDesc(essaysInSeries);
      const sortedAsc = sortEssaysByDateAsc(essaysInSeries);
      const count = sortedEssays.length;
      const autoDescription = getSeriesDescription(volume.title, count);
      const introduction =
        volume.description.trim() ||
        getSeriesIntroduction(volume.slug, autoDescription);

      return {
        title: volume.title,
        slug: volume.slug,
        description: autoDescription,
        introduction,
        count,
        essays: sortedEssays,
        firstDate: sortedAsc[0]?.date ?? "",
        latestDate: sortedEssays[0]?.date ?? "",
        sortKey: volume.sortKey,
      };
    })
    .filter((item) => item.count > 0)
    .sort((a, b) => a.sortKey - b.sortKey || a.title.localeCompare(b.title, "ko"))
    .map((item) => {
      const { sortKey, ...series } = item;
      void sortKey;
      return series;
    });
}
