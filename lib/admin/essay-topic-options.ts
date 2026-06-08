/** Admin essay topic choices — aligned with public /categories topics. */
export const ESSAY_TOPIC_OPTIONS = [
  "법학자로서의 길",
  "법과 교육",
  "법학교육",
  "형법론",
  "AI와 형사법",
  "법과 인간",
] as const;

export function getEssayTopicSelectOptions(currentValue = "") {
  const trimmed = currentValue.trim();
  const options: string[] = [...ESSAY_TOPIC_OPTIONS];

  if (trimmed && !options.includes(trimmed)) {
    options.unshift(trimmed);
  }

  return options;
}
