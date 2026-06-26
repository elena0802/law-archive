const ALLOWED_HTML_TAGS = new Set([
  "a",
  "blockquote",
  "br",
  "code",
  "div",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "img",
  "li",
  "ol",
  "p",
  "pre",
  "span",
  "strong",
  "sub",
  "sup",
  "ul",
]);

/**
 * CMS essay bodies are mostly plain Korean prose. Angle brackets in labels such as
 * `<교수용 해설 포인트>` are not JSX, but MDX treats them as tags and throws.
 * Escape those literals while keeping a small set of real inline HTML tags.
 */
export function prepareEssayMdxSource(content: string): string {
  if (!content) {
    return "";
  }

  let result = "";

  for (let index = 0; index < content.length; index += 1) {
    const char = content[index];

    if (char !== "<") {
      result += char;
      continue;
    }

    const rest = content.slice(index);
    const tagMatch = rest.match(/^<(\/?)([a-zA-Z][\w-]*)/);

    if (tagMatch && ALLOWED_HTML_TAGS.has(tagMatch[2].toLowerCase())) {
      result += "<";
      continue;
    }

    result += "&lt;";
  }

  return result;
}
